import { Outlet, Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <PackageSearch className="h-8 w-8 text-blue-600" />
              <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">CargoFlow</Link>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
              <Link to="/track" className="text-gray-700 hover:text-blue-600 font-medium">Tracking</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium hidden md:block">Login</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <PackageSearch className="h-6 w-6 text-blue-600" />
             <span className="text-xl font-bold text-gray-900">CargoFlow</span>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500 mb-4 md:mb-0">
            <Link to="/about" className="hover:text-blue-600">Features</Link>
            <Link to="/contact" className="hover:text-blue-600">Solutions</Link>
            <Link to="#" className="hover:text-blue-600">Pricing</Link>
            <Link to="/track" className="hover:text-blue-600">Resources</Link>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-gray-900">Privacy</Link>
            <Link to="#" className="hover:text-gray-900">Terms</Link>
            <Link to="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
      {/* Chat Assistant */}
      <ChatBubble />
    </div>
  );
}
