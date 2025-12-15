import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { User, Pin, Board } from '../types';
import { userService, pinService } from '../services';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pins' | 'boards'>('pins');
  const [deletingPinId, setDeletingPinId] = useState<number | null>(null);

  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  useEffect(() => {
    if (id) {
      fetchProfile(parseInt(id));
    }
  }, [id]);

  const fetchProfile = async (userId: number) => {
    setIsLoading(true);
    try {
      const [userData, userPins, userBoards] = await Promise.all([
        userService.getById(userId),
        userService.getUserPins(userId),
        userService.getUserBoards(userId),
      ]);
      setUser(userData);
      setPins(userPins);
      setBoards(userBoards);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePin = async (pinId: number) => {
    if (!confirm('Are you sure you want to delete this pin?')) return;
    
    setDeletingPinId(pinId);
    try {
      await pinService.delete(pinId);
      setPins(pins.filter(p => p.id !== pinId));
    } catch (err) {
      console.error('Failed to delete pin:', err);
      alert('Failed to delete pin');
    } finally {
      setDeletingPinId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">person_off</span>
        <h3 className="text-xl font-bold text-gray-700 mb-2">User not found</h3>
        <Link to="/" className="text-primary hover:underline font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Profile Header */}
      <div className="text-center mb-10">
        <div className="size-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          {user.username}
          {isOwnProfile && (
            <span className="ml-2 text-sm font-normal px-3 py-1 bg-primary/10 text-primary rounded-full">
              My Profile
            </span>
          )}
        </h1>
        {user.bio && <p className="text-gray-600 max-w-md mx-auto mb-4">{user.bio}</p>}
        <p className="text-sm text-gray-500">{user.email}</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pins.length}</p>
            <p className="text-sm text-gray-500">Pins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{boards.length}</p>
            <p className="text-sm text-gray-500">Boards</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pins')}
          className={`px-6 py-3 font-bold transition-colors relative ${
            activeTab === 'pins'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pins
          {activeTab === 'pins' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('boards')}
          className={`px-6 py-3 font-bold transition-colors relative ${
            activeTab === 'boards'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Boards
          {activeTab === 'boards' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* Pins Grid */}
      {activeTab === 'pins' && (
        <>
          {pins.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {pins.map((pin) => (
                <div key={pin.id} className="break-inside-avoid group relative">
                  <Link to={`/pin/${pin.id}`}>
                    <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  </Link>
                  
                  {/* Edit/Delete buttons for own pins */}
                  {isOwnProfile && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/pin/${pin.id}/edit`}
                        className="size-8 rounded-full bg-white/90 backdrop-blur text-gray-700 hover:bg-white flex items-center justify-center shadow-lg"
                        title="Edit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeletePin(pin.id);
                        }}
                        disabled={deletingPinId === pin.id}
                        className="size-8 rounded-full bg-white/90 backdrop-blur text-red-600 hover:bg-white flex items-center justify-center shadow-lg disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingPinId === pin.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="material-symbols-outlined text-lg">delete</span>
                        )}
                      </button>
                    </div>
                  )}
                  
                  <p className="mt-2 font-medium text-gray-900 line-clamp-2">{pin.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">image</span>
              <p className="text-gray-500">No pins yet</p>
              {isOwnProfile && (
                <Link
                  to="/create"
                  className="inline-block mt-4 px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors"
                >
                  Create your first pin
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {/* Boards Grid */}
      {activeTab === 'boards' && (
        <>
          {boards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {boards.map((board) => (
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden mb-2">
                    {board.coverImage ? (
                      <img
                        src={board.coverImage}
                        alt={board.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400">dashboard</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {board.title}
                  </h3>
                  {board._count && (
                    <p className="text-sm text-gray-500">{board._count.pins} pins</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">dashboard</span>
              <p className="text-gray-500">No boards yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
