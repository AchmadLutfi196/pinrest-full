import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Pin } from '../types';
import { pinService } from '../services';
import { useAuth } from '../context/AuthContext';

export function EditPin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pin, setPin] = useState<Pin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (id) {
      fetchPin(parseInt(id));
    }
  }, [id]);

  const fetchPin = async (pinId: number) => {
    setIsLoading(true);
    try {
      const data = await pinService.getById(pinId);
      
      // Check if user owns this pin
      if (user && data.userId !== user.id) {
        navigate(`/pin/${pinId}`, { replace: true });
        return;
      }
      
      setPin(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setLink(data.link || '');
    } catch (err) {
      console.error('Failed to fetch pin:', err);
      setError('Pin not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !title.trim()) return;

    setIsSaving(true);
    setError('');

    try {
      await pinService.update(pin.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
      });
      navigate(`/pin/${pin.id}`);
    } catch (err) {
      console.error('Failed to update pin:', err);
      setError('Failed to update pin. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !pin) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
        <h3 className="text-xl font-bold text-gray-700 mb-2">{error}</h3>
        <Link to="/" className="text-primary hover:underline font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!pin) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Preview */}
          <div className="lg:w-1/2 bg-gray-100 p-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              Image cannot be changed
            </p>
          </div>

          {/* Edit Form */}
          <div className="lg:w-1/2 p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-6">Edit Pin</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell everyone what your Pin is about"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  to={`/pin/${pin.id}`}
                  className="flex-1 py-3 text-center font-bold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving || !title.trim()}
                  className="flex-1 py-3 font-bold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link
          to={`/pin/${pin.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Pin
        </Link>
      </div>
    </div>
  );
}

export default EditPin;
