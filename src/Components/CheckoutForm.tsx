import React, { useState } from 'react';
import { User, Phone, Hash } from 'lucide-react';

interface CheckoutFormProps {
  onSubmit: (formData: { tableNo: string; name: string; phoneNo: string }) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tableNo: '',
    name: '',
    phoneNo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Checkout Details</h2>
      <div className="relative">
        <label htmlFor="tableNo" className="text-sm font-medium text-gray-700 mb-1 block">
          Table Number
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            id="tableNo"
            name="tableNo"
            value={formData.tableNo}
            onChange={handleChange}
            required
            className="pl-10 pr-3 py-2 w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Enter table number"
          />
        </div>
      </div>
      <div className="relative">
        <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
          Your Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="pl-10 pr-3 py-2 w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Enter your name"
          />
        </div>
      </div>
      <div className="relative">
        <label htmlFor="phoneNo" className="text-sm font-medium text-gray-700 mb-1 block">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="tel"
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="pl-10 pr-3 py-2 w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Enter phone number"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium text-sm"
        >
          Confirm Order
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;