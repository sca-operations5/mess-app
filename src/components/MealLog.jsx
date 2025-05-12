
import React from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import MealLogForm from './MealLogForm';
import MealLogHistory from './MealLogHistory';
import { useLanguage } from '@/lib/i18n';

const MealLog = () => {
  const [inventory, setInventory] = useLocalStorage('kitchenInventory', []);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogMeal = (newMealLog) => {
    setInventory([...inventory, newMealLog]);
  };

  const handleDeleteMealLog = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast({
      title: t('deleted'),
      description: t('mealLogRemoved'),
    });
  };

  const mealHistory = inventory.filter(item => item.type === 'meal');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <MealLogForm inventory={inventory} onLogMeal={handleLogMeal} />
      <MealLogHistory mealHistory={mealHistory} onDeleteMealLog={handleDeleteMealLog} />
    </motion.div>
  );
};

export default MealLog;
  