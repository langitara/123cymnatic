import { Plus } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="group bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 hover:border-gold-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-dark-900">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content Container */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-100 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-semibold text-gold-500">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <button 
            onClick={() => onAddToCart(product)}
            className="p-3 bg-dark-700 hover:bg-gold-600 text-white rounded-full transition-colors group/btn shadow-md"
            title="Tambah ke Keranjang"
          >
            <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
