import { useState, useEffect } from 'react';
import type { Pin } from '../types';
import { pinService } from '../services';
import PinCard from '../components/PinCard';
import CategoryBar from '../components/CategoryBar';

const categories = [
  'For You',
  'Photography',
  'UI/UX Design',
  'Interior',
  'Nature',
  'Travel',
  'Typography',
  'Art',
];

export function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPins();
  }, [page]);

  const fetchPins = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await pinService.getAll(page, 20);
      setPins(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch pins:', err);
      setError('Failed to load pins. Please try again.');
      // Set mock data for demo if API fails
      setPins(getMockPins());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePin = async (pin: Pin) => {
    console.log('Save pin:', pin.id);
    // Will implement save to board modal later
  };

  const handleLikePin = async (pin: Pin) => {
    try {
      await pinService.toggleLike(pin.id);
    } catch (err) {
      console.error('Failed to like pin:', err);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // For now, just change category without filtering
    // In a real app, you'd filter or fetch new data
  };

  return (
    <>
      {/* Category Filter */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPins}
            className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Pins Masonry Grid */}
      {!isLoading && pins.length > 0 && (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {pins.map((pin) => (
            <PinCard
              key={pin.id}
              pin={pin}
              onSave={handleSavePin}
              onLike={handleLikePin}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pins.length === 0 && !error && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">image</span>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No pins yet</h3>
          <p className="text-gray-500">Be the first to share some inspiration!</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-8">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="size-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`size-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                  page === p
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
            
            {totalPages > 3 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`size-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                    page === totalPages
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="size-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="/create"
          className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </a>
      </div>
    </>
  );
}

// Mock data for demo purposes
function getMockPins(): Pin[] {
  const mockImages = [
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEsni_yObj-O-WKVNwJVQUn1imOQ_CFESERda54ZwrSB0Xsqn7uB4aBiDfYj1N_XyTJY6jXIzPKWceFeLerCgVVfgcsA4a3udexEaMqkD6RCpnSduWyPChMxtpBmu9FLQq_qz3OcERdiYuBCI6sGNlrc03a6khxRyCwFqmeO-4km7uuIYh35IkUP6m27dBsIUd5LHg5VuZGRUMDNhfrmHLd1JwihxDQfMyT9enlgPXo7lnrwYjBQSxcrMj3EaIpt5pIJfgqTzG1E0g', title: 'Morning Mist', user: 'NatureLover' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3kbOgdcp0ZGh8mMwcDLm1pLhcvLKBs6RaKvNW2jSo65hfp9Igpx-VJ8Hc4LiIjjF71ECCn5BAr1iIN33WALZB7j8knEK2C2Cl999_9Zr2gPALfyViuxGBjf5gXZedPH--iGbKRNX44YkKHGTLKygitvmSPlGXtNnbIi2dtkcaV0EBfrGOtG90SVcjkOhV4uRo2VxIr0pdC9tzGfNvwaNED0JsLuUh_M_AuSYtMk1ACDnNAwQ8lZTuGlrnhuTS2hqdqPznuu8gdqYA', title: 'Fluid Shapes', user: 'DesignDaily' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlamUL2B0lXvph3q0W5b6vkuHvYqwfZbfc86xA9p47FOqrkIN41wPaKU8PktV9VAVcMc_CiilFMrkeMJI4BlDW1MKsMDwYZ1OGrDfZXxaVgJ-BBZ-ZfTuwyyeOxlLysc_k1kqJPMsbaCSkJONAC9rfSDEN3BrWQoAnSsN0EYmQ3L9olH5NCG240EgM-Q05h24FsnpeOg-HImayLiFjvzfgtspoNTZmQyxZyOVXnxKvLaVOWlMjiTOK-MhpTdT5TnssrpmC4sxxvi3J', title: 'Cozy Corner', user: 'HomeDecor' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_mO1Mbur4nXBLbM5ancf0KDPLNQUbdR6CdjMxqfSCBCeaVEd7ZLJN7B6N_zGUXofSgHBm-cDje78FcZ5SzmnMaluMmhQuZXhThN8sLsycarkOnh74ev4YP4ddJqm2jqf0Is64LZyNI5ExDMsuDAf1mvT2fMd6-1v3idv0h01ihZGn9PFAZtYpKtxVTrypPRMJ_7v8gua5HC6ivis2dgSe00DaDfTEsvUytRvVfxo1PWcqLk7WqXQn-AJaPveDAtUWd_WFrz7nqnxy', title: 'Alpine Glow', user: 'MountainHigh' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Dow6ai0ORqUeTsBrJEn9Q_dH1RR3KzkpnkBrpolSPJWmJ8t5ykKl1aHUKeXIseX7YmwBvCvqx0V6IopaRBGJ8BmLKnEFiN-DqiQmI55sIxdt1Gs7VyGmh8L3YG8MJotLozSZEKIs6LAWlTRcTQNzC8juyz69P8SziZxe9BdQcPGn3NKZuzOIv5qsMfOFa4UXmBJTjBOnBoQgVOLwMlbvgJCDlidSUyLEMs3UAKNrYK-snl9AnwfgAmKmQgXokE4wDQ7gDRfDeHQx', title: 'Morning Fuel', user: 'BaristaLife' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm1aOift_4j6Nk5rfyknYzVw9loWHbItCF_Xud2tWKAwTLqukDQa0526PRI6bvUhgnyeub3v81uzTPDScroMYLXjMFSFH3hKABdTMVX8AbDAw2TkLwvGuwnwYh2ZhG6RwssNR9WKEGQLPP4z_8hQ136ZdJ_KUo0hR9FZEk4xFrKzHfWbGphT769WG-dHNQWKMDbG1r6ZmrismOdbmTDpSOOPjP9u2XSVWgQxI4rJU5mkzhffodEOSmq6K3QPUQ6Y75Trp66f9IVknC', title: 'Urban Vibes', user: 'CityWalker' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz-ZWQ4S5cHjQh5s_i_5M-c8CAQ9gwPt35IsIpw4JY8--iAxcPPTgkLh3q1RodaMTWXME4lfraXrAOOjUtbeQXlM6mV47t9rLufogr84mf93jP3Rm0Fv1j3G1LoI477L7swJmsjYBMZrq-car53IwKai5Rt70e9Rgwu2jfn4erO4HsgopqYbeRHksA7PVe6-6UVfouUIxJ_H-84mwPmSvqsveKE365xoKaaXEx3flfdb6cIAcq9tqOt9PoTrllUot8-2cqJ5dYYckl', title: 'Workspace Goals', user: 'TechMinimalist' },
    { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRaYEr6xwjZURNCGeHQ-ctFt4tV3GcGCJd4vU4_3FY_iA2IIXZqAGptsTxlZpRFW1aPh-1H4wveMWtKYfb9C8FxcAmkqVNxMdB450SrKi4cHWlb0UU4VZNLJaElIioi-4s8NaQBUTXbXdRqVBURrQXaf3pYxdXKU9F1k7eULnrFq_-w6gUSOVF2ozwpeLtr0AGHmookba7gneU_XYfmZGIym1ivqqU4xDfGSQap0Eg2kSid_nGcBh8MSrqHet_t2lkTjw3QYshXqPk', title: 'Brunch Time', user: 'Foodie101' },
  ];

  return mockImages.map((img, index) => ({
    id: index + 1,
    title: img.title,
    description: `A beautiful ${img.title.toLowerCase()} inspiration`,
    imageUrl: img.url,
    userId: index + 1,
    user: {
      id: index + 1,
      email: `${img.user.toLowerCase()}@example.com`,
      username: img.user,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export default Home;
