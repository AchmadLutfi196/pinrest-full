import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pinService, boardService } from '../services';
import type { Board } from '../types';
import { useEffect } from 'react';

export function CreatePin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    boardId: '',
  });
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await boardService.getAll();
      setBoards(data);
    } catch (err) {
      console.error('Failed to fetch boards:', err);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setPreviewImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setIsLoading(true);

    try {
      await pinService.create({
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl,
        link: formData.link || undefined,
        boardId: formData.boardId ? parseInt(formData.boardId) : undefined,
      });

      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create pin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Create Pin</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Image Preview */}
          <div className="lg:w-1/2">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewImage('')}
                />
              ) : (
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">image</span>
                  <p className="text-gray-500 font-medium">Enter an image URL to preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:w-1/2 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-gray-900">Image URL *</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className="w-full h-14 px-5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-gray-900">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-14 px-5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                placeholder="Add your title"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-gray-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-32 px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Tell everyone what your pin is about"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-gray-900">Destination Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full h-14 px-5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-gray-900">Save to Board</label>
              <select
                value={formData.boardId}
                onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                className="w-full h-14 px-5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-gray-900"
              >
                <option value="">Select a board (optional)</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating...
                  </span>
                ) : (
                  'Create Pin'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePin;
