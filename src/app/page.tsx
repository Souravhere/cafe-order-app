'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

const products = [
  { id: 1, name: 'Green Salad', price: 10, description: 'Freshly daily salads deliver at your door step', image: '/placeholder.svg?height=200&width=200&text=Green+Salad' },
  { id: 2, name: 'Veg Salad', price: 12, description: 'Freshly daily salads', image: '/placeholder.svg?height=200&width=200&text=Veg+Salad' },
  { id: 3, name: 'Tuna Salad', price: 15, description: 'Made with Tuna ingredients', image: '/placeholder.svg?height=200&width=200&text=Tuna+Salad' },
  { id: 4, name: 'Shrimp Salad', price: 18, description: 'Made with love and fresh sea food deliver at your', image: '/placeholder.svg?height=200&width=200&text=Shrimp+Salad' },
]

const categories = ['Fruits', 'Salads & Soups', 'Grilled']

export default function Home() {
  const [cart, setCart] = useState([])
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  if (!isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 backdrop-blur-md">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">This website is for mobile devices only</h2>
          <p className="mb-4">Please scan the QR code below to open on your mobile device:</p>
          <Image 
            src="/placeholder.svg?height=200&width=200&text=QR+Code" 
            alt="QR Code" 
            width={200} 
            height={200} 
            className="mx-auto"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Eat Healthy</h1>
          <button className="relative p-2">
            <ShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </button>
        </div>
        <p className="text-gray-600 mt-1">Our Daily Healthy meals Plans</p>
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button 
              key={index} 
              className="px-4 py-2 bg-gray-200 rounded-full text-sm whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md"
              style={{
                aspectRatio: '1 / 1.2',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="relative h-3/5">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="font-bold text-lg">{product.name}</h2>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => addToCart(product)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}