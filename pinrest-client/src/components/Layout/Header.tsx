import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined text-4xl">dashboard</span>
          </div>
          <h2 className="hidden md:block text-lg font-bold tracking-tight text-gray-900">InspoShare</h2>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl px-4">
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-100 border-none text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm hover:bg-gray-200/50"
              placeholder="Search for inspiration..."
            />
          </div>
        </form>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 mr-2">
            <Link to="/" className="text-gray-900 font-bold hover:text-primary transition-colors">Home</Link>
            <Link to="/explore" className="text-gray-500 font-medium hover:text-gray-900 transition-colors">Explore</Link>
            <Link to="/create" className="text-gray-500 font-medium hover:text-gray-900 transition-colors">Create</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="hidden sm:flex size-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            
            {/* Messages */}
            <button className="hidden sm:flex size-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="size-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-colors bg-gray-200"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to={`/profile/${user?.id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">person</span>
                        Profile
                      </span>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">settings</span>
                        Settings
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Logout
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <button className="sm:hidden flex items-center justify-center size-10 text-gray-900">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
