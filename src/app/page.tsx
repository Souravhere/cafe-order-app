"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import productsData from '../data/products.json';
import CheckoutForm from '../Components/CheckoutForm';

// Define Product type
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

// Create a CartItem type that includes quantity
type CartItem = Product & { quantity: number };

const categories = ['All', 'Fruits', 'Salads', 'Soups', 'Grilled', 'Desserts'];

// Add this new type for the popup
type Popup = {
  message: string;
  isOpen: boolean;
};

export default function Component() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]); // Use CartItem type for cart
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [popup, setPopup] = useState<Popup>({ message: '', isOpen: false });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (productsData && Array.isArray(productsData.products)) {
      setProducts(productsData.products); // Correctly set products from nested data
    } else {
      console.error("Invalid products data format:", productsData);
    }
  }, []);

  // Add this new function to show popups
  const showPopup = useCallback((message: string) => {
    setPopup({ message, isOpen: true });
    setTimeout(() => setPopup({ message: '', isOpen: false }), 3000); // Auto-close after 3 seconds
  }, []);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      if (prevCart.length >= 5) {
        showPopup('You can only add up to 5 different items to the cart.');
        return prevCart;
      }

      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= 5) {
          showPopup('You can only add up to 5 units of each item.');
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 5) {
              showPopup('You can only add up to 5 units of each item.');
              return item;
            }
            return { ...item, quantity: Math.max(1, newQuantity) };
          }
          return item;
        })
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.category === activeCategory);

  const handleCheckout = (formData: { tableNo: string; name: string; phoneNo: string }) => {
    console.log('Order placed:', { ...formData, cart, totalPrice });
    setCart([]);
    setShowCart(false);
    setIsCheckingOut(false);
    showPopup('Order placed successfully!');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Your Cafe</h1>
          <button 
            className="relative p-2" 
            onClick={() => setShowCart(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="text-gray-600" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
        <p className="text-gray-600 mb-4">Our Daily Healthy Meal Plans</p>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button 
              key={index} 
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === category 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4">
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`rounded-lg overflow-hidden shadow-md bg-gray-100`}
            >
              <div className="relative h-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="sm:flex block justify-between items-center">
                  <span className="font-bold text-gray-800">₹{product.price.toFixed(2)}</span>
                  <button 
                    className="bg-green-500 sm:w-1/2 w-full sm:my-0 my-1 text-white px-3 py-1 rounded-sm text-sm hover:bg-green-600 transition-colors"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm text-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white sm:mx-0 mx-3 p-4 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{isCheckingOut ? 'Checkout' : 'Your Cart'}</h2>
              <button 
                onClick={() => {
                  setShowCart(false);
                  setIsCheckingOut(false);
                }} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>
            {!isCheckingOut ? (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-2 pb-2 border-b">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="px-2 py-1 bg-gray-200 rounded-l"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        className="px-2 py-1 bg-gray-200 rounded-r"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                      <span className="ml-4 min-w-[60px] text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</div>
                <button 
                  className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </button>
              </>
            ) : (
              <CheckoutForm 
                onSubmit={handleCheckout}
                onCancel={() => setIsCheckingOut(false)}
              />
            )}
          </div>
        </div>
      )}

      {popup.isOpen && (
        <div className="fixed z-50 bottom-4 right-4 bg-red-600 font-semibold rounded-lg shadow-lg p-4 max-w-sm animate-fade-in-up">
          <p className="text-white">{popup.message}</p>
        </div>
      )}
    </div>
  );
}

// Add this at the end of the file
const fadeInUp = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fadeInUp;
  document.head.appendChild(style);
}
