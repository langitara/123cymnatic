import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';

export default function Cart({ cartItems, updateQuantity, removeFromCart, checkout, closeCart }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-dark-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-dark-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gold-500">
            <ShoppingBag size={24} />
            Keranjang Belanja
          </h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Keranjang Anda masih kosong.
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-dark-900 p-4 rounded-xl border border-dark-700">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-200 line-clamp-1">{item.name}</h3>
                  <p className="text-gold-500 font-semibold mt-1">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-dark-700 bg-dark-900/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Pembayaran</span>
              <span className="text-2xl font-bold text-white">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <button 
              onClick={checkout}
              className="w-full py-4 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98]"
            >
              Beli Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
