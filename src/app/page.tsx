'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCart, X, Plus, Minus } from 'lucide-react'

const categories = ['All', 'Fruits', 'Salads', 'Soups', 'Grilled', 'Desserts']

const getRandomColor = () => {
  const colors = ['bg-red-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-indigo-100', 'bg-purple-100', 'bg-pink-100']
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function Component() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  // Fetch products from the JSON file in src folder
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await import('../data/products.json')
        setProducts(response.products)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, change) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(0, item.quantity + change) } 
        : item
    ).filter(item => item.quantity > 0))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Eat Healthy</h1>
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
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`rounded-lg overflow-hidden shadow-md ${getRandomColor()}`}
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
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">${product.price.toFixed(2)}</span>
                  <button 
                    className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition-colors"
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
          <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button 
                onClick={() => setShowCart(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
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
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</div>
                <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
