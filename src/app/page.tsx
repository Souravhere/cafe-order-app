'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import productsData from '../data/products.json'

type Product = {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
}

type CartItem = Product & { quantity: number }

const categories = ['All', 'Fruits', 'Salads', 'Soups', 'Grilled', 'Desserts']

export default function Component() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    if (productsData && Array.isArray(productsData.products)) {
      setProducts(productsData.products)
    } else {
      console.error("Invalid products data format:", productsData)
    }
  }, [])

  const addToCart = (product: Product) => {
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

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, change: number) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.category === activeCategory)

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen">
      <header className="bg-white p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-600">Your Cafe</h1>
          <button 
            className="relative p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors duration-300" 
            onClick={() => setShowCart(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="text-purple-600" />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-center text-lg">Our Daily Healthy Meal Plans</p>
        <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <motion.button 
              key={index} 
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              }`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id} 
              className="rounded-2xl overflow-hidden shadow-lg bg-white"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-60">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h2 className="font-bold text-xl text-purple-600 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-2xl text-purple-600">₹{product.price.toFixed(2)}</span>
                  <motion.button 
                    className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-600 transition-colors"
                    onClick={() => addToCart(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {showCart && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-600">Your Cart</h2>
                <motion.button 
                  onClick={() => setShowCart(false)} 
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close cart"
                >
                  <X size={24} />
                </motion.button>
              </div>
              {cart.length === 0 ? (
                <p className="text-center text-gray-600">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map(item => (
                    <motion.div 
                      key={item.id} 
                      className="flex justify-between items-center mb-4 pb-4 border-b"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <span className="font-medium text-lg">{item.name}</span>
                      <div className="flex items-center">
                        <motion.button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="px-2 py-1 bg-purple-100 rounded-l hover:bg-purple-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="px-4 py-1 bg-purple-50 font-medium">{item.quantity}</span>
                        <motion.button 
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="px-2 py-1 bg-purple-100 rounded-r hover:bg-purple-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={16} />
                        </motion.button>
                        <span className="ml-6 min-w-[80px] text-right font-bold text-purple-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <motion.button 
                          onClick={() => removeFromCart(item.id)} 
                          className="ml-4 text-red-500 hover:text-red-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  <div className="mt-6 text-2xl font-bold text-purple-600">Total: ₹{totalPrice.toFixed(2)}</div>
                  <motion.button 
                    className="mt-6 w-full bg-purple-500 text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Proceed to Checkout
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}