import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tableNo" className="block text-sm font-medium text-gray-700">Table No</label>
        <input
          type="text"
          id="tableNo"
          name="tableNo"
          value={formData.tableNo}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">Phone No</label>
        <input
          type="tel"
          id="phoneNo"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
        >
          Confirm Order
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
