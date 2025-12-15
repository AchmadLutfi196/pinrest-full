import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

// Gallery images
const galleryImages = [
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvNyQ9zrugLrYLiusE1Q69JpKpTtruALQsYb3QDyJmvk7xIbaBzhdR6qcYICePbi9qAXjAykXAlkcIxQdbUK4tVdbevXsHYzAhFbUTMKEh5rN0TPcvSwVDwu3Z4UlpNhARdT6QqSn68yaevuutyHabXST-T3KJEiEA4m9nTTPLEugF1h6KRbKifBz3VBkpVlwC7BZY5gCRuyLxdrTe0mq_3q7cXQZt-2DqzrONAvp3M4XULDkTYZ4YNFA5z61nwFwL4VfkDaiOeUVG', height: 'h-80' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvQE4yuPD0eMg-ErXNRsU0xSX3aeZM9tSeq9AnBi7ElSjrbQk9RBQXT56yt7lKgSRjT6N8dYyq1j0eFF8voGvjvtRcO3VvpkJLKorBA3z2-eaeSwz7HRlkOluOE9JBhQD2mQ5reu5W88PZb_tVvvh2ROrFKcxSAnsHJB5TuGdq-yYoA3KnogUBkhnA4oYuZSHPHNYaBGkl4XM1w3JiLDpHD39qceGxvRBgMbwUonCan4MqrlkkNG3DOG7eSaDMrdIV81-UAG8r6ITH', height: 'h-64' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI-prMQ2x3pe1g5nhyLHeRS_5vww6fhdx6o-uJbbJAB9DZzamtRzYi2z85h04ljkQHKgx4hIXnZziZ_eTmnOD1r35W1hKFzwmLIPnZEl8tLkVCwuWmnenuiO5HhppuHMjUwOu3LSPIiEQeXpGKeZjSoxqIDoWJgdcRk7ibC8ujTpTUXWOcnTRhoS1kGHwRfVvoNX4nDsGrbiTcviJK0ak6NWaGO5YZos0M8Z7tRPFMyOR50fic1JaTa83vmlJzoEAxWob8VyM7sTCt', height: 'h-96' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJmT_yVLTZWMAE3OSGiwgvO-zKh-s_XUpuCimHI3KsUHaahnIUXjR4oKS2FagizTz6sUIz3yfZVW4NBN2CvBo0Mbh3bvzgvrBHPwkVDow30zAfMbQYA6k-YhLbwNKI2JeFV-L-_QUjtgJv19Sn74UzoParfpE5iiUdUYwcXdMoxhmdFbEzEb1jp9Mxha4dcA5iMQvxy3RTX-wkhprrcnS7Y_xwwR5oeu6x2VreAiGDLj_hbmBJKa0v79HZKopeq7tq71hri8JVgdVl', height: 'h-64' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlfOoB0U7FkJiCmzVDiTBVxSyC4tki19MBMvFdfn6cDXHN98DJEnh0ozi6WmcVrlhv7n8F34lkS275qjaghQZVPOuDlZn8Wp7N73wvbxKBZwo5MLBBOabrIfE-5UiXgiDLnw6n4aXmNFJ4D3Kgh8suzcSETFQdgS2VNp4yLD8cBLHeVsccTVXBMyJIPezq3D7EFGWEh1j_SGqC2toLLHN-8oE-1fBagPBElqtRumOzr-8iP3e96q0_bzkdhhzZdGkrKBUF14AMiiF3', height: 'h-96' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0ycTU6n8mYnL5cMwrkrI-1SRMfzHqBOH3sqOJK7j3o2O1oN4x3MdF9LGAN2O4y8oR5C3M8YwYa1zwrGBYWrCpL1Q-uHPSS-XhQZKM4feWGI43ykgqBICuGFrV5gCgTf5zuEGRWwVYS9aJAjJWeQpbTo8UlxFjeBg9Yde5NjPTHrr81d20NpEQKG39JjphEDp3KJwoEyPS_o0nYRMpQXIkdFFLGQ0rfGnqE1yTXOqSsPdQdK2DOneM3MFLmMLe2jO_VVsk63-g_sSy', height: 'h-72' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHhZbrXteJ6a-3rPojanLHxA-jh8upuBQKhUH0uT0yEk1-w3iF8ZJfZOy86oHhexcR8ZqLkSZU6RmWClELRaJ4gHGtgJkk_AUA1hYqoQyosffYHU6IyoWYBNcgUiq9oB3FLtSna0E7YGjCDvmLkWwwdXcCPvOrrdrgTKPiVAhvJrKMI9jh5_doHFTHzfTUZjYxEZl1oTGbAHSVPbFEAY1PaeNJqsLfg4fM6hKrDeNcG8uOlU2g24wFbgbdRSm0EVfdqjf9XigPcoly', height: 'h-80' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc48S4QsF59gXykIEgWw_uKCmXOcmdUuiqrKXprlGbX-rGVk6AsZgSq0vUbtAlxGI5KKwgkiiI3zzRK4JwrLJ97Xw-vjTUgh8BveJWJqj4FVfQQ3tFsi9LgWpc5a2KeaA7xuoGA1-sYgp_fuof-_1eckjKhBi65GMh3antOkMv8X2xibI4pF3rKuv3KgTjusnYKXgMujZkx5jSd7Q4PiUECy_uPQ3KZyG6uDfgRS9Vi4hTOSWw-Hf8JXyeZ-6B4z1fJRt7R4vWySSw', height: 'h-72' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMsO5ZAkPHqoGWOVanpQx3nOKKw4m3V7_Lfrbc1EogoilgHLoq9QDc7AAdIwECzzNSMOq7yZh-8bTq9_OcRp0eGLshQ65Ktt2yXn73J-a3ZAp_rnsFyVgDqR8vDbBNGNKOT2m9vNAGVrL4r-nsbFBUhF4EyuJJnIUx9vy8ODtx_ffYnFD1EQsSJux51DcUs_bndMTzN5UWmmuR8mow0YzytQIFm0kV9lOr-g1sineN1rvHNKs89_4KwmTPNRSiFMGID9ZT4HvSGnRp', height: 'h-64' },
];

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        username: formData.fullName.toLowerCase().replace(/\s+/g, '_'),
        password: formData.password,
      });

      login(response.access_token, response.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-[Manrope] bg-white text-gray-900 min-h-screen w-full flex overflow-hidden selection:bg-pink-100 selection:text-primary">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-y-auto bg-white">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 lg:px-12 xl:px-20 w-full max-w-2xl mx-auto xl:mx-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-lg font-bold">grid_view</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">InspoShare</h1>
          </div>
          <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            Log In
          </Link>
        </header>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-20 pb-12 w-full max-w-2xl mx-auto xl:mx-0">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-3 text-gray-900">
              Create your account
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Sign up to discover and share inspiring content.
            </p>
          </div>

          {/* Social Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 h-14 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path>
              </svg>
              <span className="text-base font-bold text-gray-700 group-hover:text-gray-900">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 h-14 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors group">
              <span className="material-symbols-outlined text-2xl text-gray-700">star</span>
              <span className="text-base font-bold text-gray-700 group-hover:text-gray-900">Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or register with email</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium leading-normal text-gray-900 ml-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-14 px-5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-base font-normal text-gray-900"
                placeholder="e.g. Jane Doe"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium leading-normal text-gray-900 ml-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 px-5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-base font-normal text-gray-900"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium leading-normal text-gray-900 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-14 pl-5 pr-12 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-base font-normal text-gray-900"
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 cursor-pointer hover:text-primary"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-base font-medium leading-normal text-gray-900 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full h-14 pl-5 pr-12 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-base font-normal text-gray-900"
                    placeholder="Repeat password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 cursor-pointer hover:text-primary"
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-2 ml-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-primary checked:border-primary transition-all"
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-sm font-bold">
                  check
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-tight pt-0.5">
                I agree to the{' '}
                <a className="text-primary hover:underline font-semibold" href="#">Terms of Service</a>
                {' '}and{' '}
                <a className="text-primary hover:underline font-semibold" href="#">Privacy Policy</a>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full h-14 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-lg font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Login Link (Mobile) */}
          <p className="mt-8 text-center text-sm font-medium text-gray-500 md:hidden">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Gallery */}
      <div className="hidden lg:flex w-1/2 bg-accent-pink relative items-center justify-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Image Gallery */}
        <div className="w-full h-[120%] -rotate-6 scale-110 flex gap-6 justify-center opacity-90 transition-opacity duration-1000">
          <div className="flex flex-col gap-6 w-64 animate-marquee-up">
            {galleryImages.slice(0, 3).map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${img.height} relative shadow-xl`}>
                <img className="w-full h-full object-cover" src={img.src} alt={`Gallery ${i + 1}`} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6 w-64 -mt-20">
            {galleryImages.slice(3, 6).map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${img.height} relative shadow-xl ${i === 1 ? 'border-4 border-white/60 ring-1 ring-black/5' : ''}`}>
                <img className="w-full h-full object-cover" src={img.src} alt={`Gallery ${i + 4}`} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6 w-64">
            {galleryImages.slice(6, 9).map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${img.height} relative shadow-xl`}>
                <img className="w-full h-full object-cover" src={img.src} alt={`Gallery ${i + 7}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent-pink via-transparent to-transparent opacity-90"></div>
        
        {/* Info Card */}
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-pink-100/50 p-6 rounded-2xl max-w-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary rounded-full text-white shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Find your spark</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Join millions of creators collecting ideas for their next project. From home decor to fashion, find what moves you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
