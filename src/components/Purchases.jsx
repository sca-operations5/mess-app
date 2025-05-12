import React, { useState, useEffect } from 'react';
import PurchaseForm from './PurchaseForm';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n.jsx';
import { purchasesService, inventoryService } from '../lib/database';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    supplier: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [inventory, setInventory] = useLocalStorage('kitchenInventory', []);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await purchasesService.getPurchases();
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError('Failed to load purchases');
      console.error('Error loading purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Add purchase
      const newPurchase = await purchasesService.addPurchase(formData);
      setPurchases(prev => [...prev, newPurchase]);

      // Update inventory
      const existingItem = await inventoryService.getItemByName(formData.item_name);
      if (existingItem) {
        // Update existing item
        await inventoryService.updateItem(existingItem.id, {
          quantity: existingItem.quantity + parseFloat(formData.quantity),
          last_updated: new Date().toISOString()
        });
      } else {
        // Add new item to inventory
        await inventoryService.addItem({
          name: formData.item_name,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          category: 'General',
          last_updated: new Date().toISOString()
        });
      }

      // Reset form
      setFormData({
        item_name: '',
        quantity: '',
        unit: 'kg',
        price: '',
        supplier: '',
        date: new Date().toISOString().split('T')[0]
      });
      setError(null);

      toast({
        title: t('success'),
        description: t('purchaseAdded', { itemName: formData.item_name }),
      });
    } catch (err) {
      setError('Failed to add purchase');
      console.error('Error adding purchase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await purchasesService.deletePurchase(id);
      setPurchases(prev => prev.filter(p => p.id !== id));
      setError(null);

      toast({
        title: t('deleted'),
        description: t('purchaseRemoved'),
      });
    } catch (err) {
      setError('Failed to delete purchase');
      console.error('Error deleting purchase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const purchaseHistory = purchases.filter(item => item.type === 'purchase').sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PurchaseForm onSubmit={handleSubmit} onInputChange={handleChange} formData={formData} />
      <PurchaseHistoryTable
        purchaseHistory={purchaseHistory}
        onDeletePurchase={handleDelete}
      />
    </motion.div>
  );
};

export default Purchases;
  