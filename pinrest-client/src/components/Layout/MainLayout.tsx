import { Outlet } from 'react-router-dom';
import Header from './Header';

interface MainLayoutProps {
  onSearch?: (query: string) => void;
}

export function MainLayout({ onSearch }: MainLayoutProps) {
  return (
    <div className="bg-white font-[Manrope] text-gray-900 min-h-screen flex flex-col transition-colors duration-200">
      <Header onSearch={onSearch} />
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
