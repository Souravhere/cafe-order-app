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
  const [tableNoError, setTableNoError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'tableNo') {
      const tableNumber = parseInt(value);
      if (isNaN(tableNumber) || tableNumber < 1 || tableNumber > 12) {
        setTableNoError('Table number must be between 1 and 12');
      } else {
        setTableNoError('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNoError) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-sm mx-auto">
      <div className="bg-green-500 text-white py-3 px-4">
        <h2 className="text-xl font-semibold">Checkout</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {[ 
          { name: 'tableNo', label: 'Table Number', icon: Hash, type: 'number', min: 1, max: 12 },
          { name: 'name', label: 'Your Name', icon: User, type: 'text' },
          { name: 'phoneNo', label: 'Phone Number', icon: Phone, type: 'tel' },
        ].map(({ name, label, icon: Icon, type, min, max }) => (
          <div key={name} className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type={type}
                name={name}
                id={name}
                min={min}
                max={max}
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                placeholder={`Enter ${label.toLowerCase()}`}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                required
              />
            </div>
            {name === 'tableNo' && tableNoError && (
              <p className="mt-1 text-sm text-red-600">{tableNoError}</p>
            )}
          </div>
        ))}
        <div className="flex flex-col space-y-2 pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={!!tableNoError}
          >
            Confirm Order
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;