import React from 'react';
import { useLanguage } from '@/lib/i18n.jsx';

const PurchaseForm = ({ onSubmit, onInputChange, formData }) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('itemName')}
          </label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={onInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('quantity')}
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={onInputChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('unit')}
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={onInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="kg">{t('kg')}</option>
            <option value="g">{t('g')}</option>
            <option value="l">{t('l')}</option>
            <option value="ml">{t('ml')}</option>
            <option value="pcs">{t('pcs')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('price')}
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('supplier')}
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={onInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('date')}
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('addPurchase')}
        </button>
      </div>
    </form>
  );
};

export default PurchaseForm;
  