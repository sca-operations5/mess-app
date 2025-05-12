
import React from 'react';
import PurchaseForm from './PurchaseForm';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n.jsx';

const Purchases = () => {
  const [inventory, setInventory] = useLocalStorage('kitchenInventory', []);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAddPurchase = ({ itemName, quantity, unit, unitPrice, purchaseDate, totalPrice }) => {
    const parsedQuantity = parseFloat(quantity);
    const parsedUnitPrice = parseFloat(unitPrice);

    if (!itemName || isNaN(parsedQuantity) || parsedQuantity <= 0 || !unit || isNaN(parsedUnitPrice) || parsedUnitPrice < 0 || !purchaseDate) {
      toast({
        title: t('error'),
        description: t('fillPurchaseDetails'),
        variant: "destructive",
      });
      return false; // Indicate failure
    }

    const newPurchase = {
      id: Date.now(),
      type: 'purchase',
      itemName,
      quantity: parsedQuantity,
      unit,
      unitPrice: parsedUnitPrice, // Store unit price
      price: totalPrice, // Store calculated total price
      date: purchaseDate.toISOString().split('T')[0],
    };

    setInventory([...inventory, newPurchase]);

    toast({
      title: t('success'),
      description: t('purchaseAdded', { itemName: itemName }),
    });

    return true; // Indicate success
  };

   const handleDeletePurchase = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast({
      title: t('deleted'),
      description: t('purchaseRemoved'),
    });
  };

  const purchaseHistory = inventory.filter(item => item.type === 'purchase').sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PurchaseForm onAddPurchase={handleAddPurchase} />
      <PurchaseHistoryTable
        purchaseHistory={purchaseHistory}
        onDeletePurchase={handleDeletePurchase}
      />
    </motion.div>
  );
};

export default Purchases;
  