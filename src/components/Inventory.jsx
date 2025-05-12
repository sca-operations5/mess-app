import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card.jsx";
import { Button } from "@/components/ui/button";
import useLocalStorage from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import { formatCurrency } from '@/lib/currency';
import { useLanguage } from '@/lib/i18n';
import { useToast } from "@/components/ui/use-toast";
import { inventoryService } from '../lib/database';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: t('error'),
        description: t('loadInventoryError'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const newItem = await inventoryService.addItem(itemData);
      setInventory(prev => [...prev, newItem]);
      toast({
        title: t('success'),
        description: t('itemAdded')
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: t('error'),
        description: t('addItemError'),
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = async (id, updates) => {
    try {
      const updatedItem = await inventoryService.updateItem(id, updates);
      setInventory(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      toast({
        title: t('success'),
        description: t('itemUpdated')
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: t('error'),
        description: t('updateItemError'),
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await inventoryService.deleteItem(id);
      setInventory(prev => prev.filter(item => item.id !== id));
      toast({
        title: t('success'),
        description: t('itemDeleted')
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: t('error'),
        description: t('deleteItemError'),
        variant: "destructive"
      });
    }
  };

  const getAverageCost = (itemName) => {
    const purchases = inventory.filter(item => item.type === 'purchase' && item.itemName.toLowerCase() === itemName.toLowerCase() && item.quantity > 0);
    if (purchases.length === 0) return 0;
    const totalCost = purchases.reduce((sum, p) => sum + p.price, 0);
    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
    return totalQuantity > 0 ? totalCost / totalQuantity : 0;
  };

  const calculateStock = () => {
    const stock = {};

    inventory.forEach(entry => {
      if (entry.type === 'purchase') {
        const current = stock[entry.itemName] || { quantity: 0, totalValue: 0, date: entry.date }; // Keep track of date for potential filtering
        current.quantity += entry.quantity;
        current.averageCost = getAverageCost(entry.itemName);
        current.totalValue = current.quantity * current.averageCost;
        stock[entry.itemName] = current;
      }
    });

    inventory.forEach(entry => {
       if (entry.type === 'meal') {
         entry.itemsUsed.forEach(item => {
            if(stock[item.name]){
                stock[item.name].quantity -= item.quantity;
                stock[item.name].totalValue = stock[item.name].quantity * stock[item.name].averageCost;
                // Note: 'date' here refers to purchase date, not meal date. Daily inventory export might need adjustment based on requirements.
                // For simplicity, we export current stock levels regardless of date.
            }
         });
       }
     });

    return Object.entries(stock)
                 .filter(([, data]) => data.quantity > 0)
                 .map(([name, data]) => ({
                    name,
                    quantity: data.quantity,
                    averageCost: data.averageCost,
                    totalValue: data.totalValue,
                    // date: data.date // Include date if needed for filtering, though stock is cumulative
                  }));
  };

  const currentStock = calculateStock();

  const handleExport = (isDaily = false) => {
     // Note: Daily export for cumulative stock doesn't make much sense unless tracking snapshots.
     // Exporting current stock levels. Add date filtering logic if specific daily snapshot is needed.
     const exportData = currentStock.map(item => ({
         'Item Name': item.name,
         'Quantity in Stock': item.quantity.toFixed(2),
         'Average Unit Cost (INR)': item.averageCost.toFixed(2),
         'Total Value (INR)': item.totalValue.toFixed(2),
     }));

     const filename = 'inventory_report';
     const success = exportToCSV(exportData, filename, isDaily ? new Date() : null);

     if (!success && isDaily) {
         toast({ title: t('error'), description: "No inventory data for today.", variant: "destructive" });
     } else if (!success) {
         toast({ title: t('error'), description: "No inventory data to export.", variant: "destructive" });
     }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{t('currentInventory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t('itemName')}</TableHead>
                <TableHead className="text-right">{t('quantityInStock')}</TableHead>
                 <TableHead className="text-right">{t('avgUnitCost')}</TableHead>
                 <TableHead className="text-right">{t('totalValue')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStock.length > 0 ? (
                currentStock.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.averageCost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalValue)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center text-muted-foreground">
                    {t('noItemsInStock')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
             <TableCaption>{t('inventoryCaption')}</TableCaption>
          </Table>
        </CardContent>
         <CardFooter className="flex justify-end gap-2">
             <Button onClick={() => handleExport(true)} variant="outline" size="sm" disabled={currentStock.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportTodayInventory')}
             </Button>
             <Button onClick={() => handleExport(false)} variant="outline" size="sm" disabled={currentStock.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportInventory')}
             </Button>
         </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Inventory;
  