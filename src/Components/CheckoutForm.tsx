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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Checkout Details</h2>
      {['tableNo', 'name', 'phoneNo'].map((field) => (
        <div key={field} className="relative">
          <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1 block">
            {field === 'tableNo' ? 'Table Number' : field === 'name' ? 'Your Name' : 'Phone Number'}
          </label>
          <div className="relative">
            {field === 'tableNo' && <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
            {field === 'name' && <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
            {field === 'phoneNo' && <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
            <input
              type={field === 'phoneNo' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 text-sm"
              placeholder={`Enter ${field === 'tableNo' ? 'table number' : field === 'name' ? 'your name' : 'phone number'}`}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-col space-y-2 pt-4">
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium text-sm"
        >
          Confirm Order
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;