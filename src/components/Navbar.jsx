import { ShoppingBag } from 'lucide-react';

export default function Navbar({ cartItemCount, onOpenCart }) {
  return (
    <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center transform rotate-45">
              <span className="text-dark-900 font-bold text-xl -rotate-45">E</span>
            </div>
            <span className="text-2xl font-bold tracking-wider text-white ml-2">
              ELEGANZA
            </span>
          </div>

          {/* Cart Icon */}
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-gray-300 hover:text-gold-500 transition-colors"
          >
            <ShoppingBag size={28} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-dark-900">
                {cartItemCount}
              </span>
            )}
          </button>
          
        </div>
      </div>
    </nav>
  );
}
