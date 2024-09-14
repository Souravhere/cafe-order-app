'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ShoppingCart, Plus, Minus } from 'lucide-react'

// Assume this is imported from a JSON file
const products = [
  { id: 1, name: 'Green Salad', price: 10, description: 'Freshly daily salads deliver at your door step' },
  { id: 2, name: 'Veg Salad', price: 12, description: 'Freshly daily salads' },
  { id: 3, name: 'Tuna Salad', price: 15, description: 'Made with Tuna ingredients' },
  { id: 4, name: 'Shrimp Salad', price: 18, description: 'Made with love and fresh sea food deliver at your' },
]

export default function Home() {
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: '', mobile: '' })

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(0, item.quantity + change) } 
        : item
    ).filter(item => item.quantity > 0))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = (e) => {
    e.preventDefault()
    // Here you would typically send the order data to your backend
    // For this example, we'll just simulate a successful order
    setOrderPlaced(true)
    setTimeout(() => {
      setOrderPlaced(false)
      setShowCheckout(false)
      setCart([])
      setCustomerInfo({ name: '', mobile: '' })
    }, 3000)
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Eat Healthy</h1>
        <button 
          className="relative p-2"
          onClick={() => setShowCheckout(true)}
        >
          <ShoppingCart />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 flex flex-col">
            <Image 
              src="/placeholder.svg" 
              alt={product.name} 
              width={200} 
              height={200} 
              className="w-full h-40 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
            <button 
              className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <div className="flex items-center">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-2">
                    <Minus size={16} />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-2">
                    <Plus size={16} />
                  </button>
                  <span className="ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            <div className="font-bold mt-4">Total: ${totalPrice.toFixed(2)}</div>
            <form onSubmit={handleCheckout} className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={customerInfo.mobile}
                onChange={(e) => setCustomerInfo({...customerInfo, mobile: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Order Now
              </button>
            </form>
            <button 
              onClick={() => setShowCheckout(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
            <p>Thank you for your order.</p>
          </div>
        </div>
      )}
    </div>
  )
}