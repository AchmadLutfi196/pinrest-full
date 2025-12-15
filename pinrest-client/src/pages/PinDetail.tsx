import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Pin } from '../types';
import { pinService } from '../services';
import { useAuth } from '../context/AuthContext';

export function PinDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pin, setPin] = useState<Pin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user && pin && user.id === pin.userId;

  useEffect(() => {
    if (id) {
      fetchPin(parseInt(id));
    }
  }, [id]);

  const fetchPin = async (pinId: number) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await pinService.getById(pinId);
      setPin(data);
      setIsLiked(data.isLiked || false);
    } catch (err) {
      console.error('Failed to fetch pin:', err);
      setError('Pin not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!pin) return;
    try {
      await pinService.toggleLike(pin.id);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to like pin:', err);
    }
  };

  const handleDelete = async () => {
    if (!pin) return;
    setIsDeleting(true);
    try {
      await pinService.delete(pin.id);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to delete pin:', err);
      alert('Failed to delete pin');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !pin) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
        <h3 className="text-xl font-bold text-gray-700 mb-2">{error || 'Pin not found'}</h3>
        <Link to="/" className="text-primary hover:underline font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Pin?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this pin?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="lg:w-1/2 bg-gray-100">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>

          {/* Details */}
          <div className="lg:w-1/2 p-8 flex flex-col">
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`size-12 rounded-full flex items-center justify-center transition-colors ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {isLiked ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
                <button className="size-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
                
                {/* Edit/Delete buttons for owner */}
                {isOwner && (
                  <>
                    <Link
                      to={`/pin/${pin.id}/edit`}
                      className="size-12 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                      title="Edit Pin"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="size-12 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                      title="Delete Pin"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </>
                )}
              </div>
              <button className="h-12 px-6 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                Save
              </button>
            </div>

            {/* Link */}
            {pin.link && (
              <a
                href={pin.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-primary transition-colors mb-4 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-lg">link</span>
                {new URL(pin.link).hostname}
              </a>
            )}

            {/* Title & Description */}
            <h1 className="text-3xl font-black text-gray-900 mb-4">{pin.title}</h1>
            {pin.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{pin.description}</p>
            )}

            {/* Author */}
            {pin.user && (
              <Link
                to={`/profile/${pin.user.id}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors mb-6"
              >
                <div className="size-12 rounded-full bg-gray-200 overflow-hidden">
                  {pin.user.avatar ? (
                    <img src={pin.user.avatar} alt={pin.user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-bold">
                      {pin.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{pin.user.username}</p>
                  {pin.user.bio && (
                    <p className="text-sm text-gray-500">{pin.user.bio}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
              {pin._count && (
                <>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    {pin._count.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                    {pin._count.savedPins} saves
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default PinDetail;
