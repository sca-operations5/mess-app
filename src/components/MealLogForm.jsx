
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card.jsx";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { UtensilsCrossed, PlusCircle, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { useLanguage } from '@/lib/i18n';

const MealLogForm = ({ inventory, onLogMeal }) => {
  const [mealType, setMealType] = useState('');
  const [mealDate, setMealDate] = useState(new Date());
  const [studentCount, setStudentCount] = useState('');
  const [itemsUsed, setItemsUsed] = useState([{ name: '', quantity: '' }]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleItemChange = (index, field, value) => {
    const newItems = [...itemsUsed];
    newItems[index][field] = value;
    setItemsUsed(newItems);
  };

  const addItemField = () => {
    setItemsUsed([...itemsUsed, { name: '', quantity: '' }]);
  };

  const removeItemField = (index) => {
    if (itemsUsed.length <= 1) return;
    const newItems = itemsUsed.filter((_, i) => i !== index);
    setItemsUsed(newItems);
  };

   const calculateMealCost = (usedItems) => {
     let totalCost = 0;
     const purchasePrices = {};

     inventory.filter(item => item.type === 'purchase' && item.quantity > 0).forEach(p => {
         const unitPrice = p.price / p.quantity;
         if (!purchasePrices[p.itemName]) {
             purchasePrices[p.itemName] = { totalCost: 0, totalQuantity: 0 };
         }
         purchasePrices[p.itemName].totalCost += p.price;
         purchasePrices[p.itemName].totalQuantity += p.quantity;
     });

     const averageCosts = {};
     for (const itemName in purchasePrices) {
         averageCosts[itemName] = purchasePrices[itemName].totalQuantity > 0
             ? purchasePrices[itemName].totalCost / purchasePrices[itemName].totalQuantity
             : 0;
     }


     usedItems.forEach(usedItem => {
       const quantityNeeded = parseFloat(usedItem.quantity);
       if (isNaN(quantityNeeded) || quantityNeeded <= 0) return;

       const avgCost = averageCosts[usedItem.name];

       if (typeof avgCost === 'number') {
         totalCost += quantityNeeded * avgCost;
       } else {
         console.warn(`Could not determine average cost for ${usedItem.name}. Cost calculation might be inaccurate.`);
       }
     });

     return totalCost;
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mealType || !mealDate || !studentCount || itemsUsed.some(item => !item.name || !item.quantity)) {
      toast({ title: t('error'), description: t('fillMealDetails'), variant: "destructive" });
      return;
    }

    const parsedStudentCount = parseInt(studentCount);
    if (isNaN(parsedStudentCount) || parsedStudentCount <= 0) {
      toast({ title: t('error'), description: t('positiveStudentCount'), variant: "destructive" });
      return;
    }

    const validItemsUsed = itemsUsed
      .map(item => ({ name: item.name, quantity: parseFloat(item.quantity) }))
      .filter(item => item.name && !isNaN(item.quantity) && item.quantity > 0);

    if (validItemsUsed.length === 0) {
      toast({ title: t('error'), description: t('addValidItem'), variant: "destructive" });
      return;
    }

    const currentStock = {};
    inventory.forEach(entry => {
      if (entry.type === 'purchase') {
        currentStock[entry.itemName] = (currentStock[entry.itemName] || 0) + entry.quantity;
      } else if (entry.type === 'meal') {
        entry.itemsUsed.forEach(item => {
          currentStock[item.name] = (currentStock[item.name] || 0) - item.quantity;
        });
      }
    });

    for (const item of validItemsUsed) {
      if ((currentStock[item.name] || 0) < item.quantity) {
        toast({
            title: t('error'),
            description: t('notEnoughStock', { itemName: item.name, available: (currentStock[item.name] || 0).toFixed(2) }),
            variant: "destructive"
        });
        return;
      }
    }

    const mealCost = calculateMealCost(validItemsUsed);
    const costPerStudent = parsedStudentCount > 0 ? mealCost / parsedStudentCount : 0;

    const newMealLog = {
      id: Date.now(),
      type: 'meal',
      mealType,
      date: mealDate.toISOString().split('T')[0],
      studentCount: parsedStudentCount,
      itemsUsed: validItemsUsed,
      totalCost: mealCost,
      costPerStudent: costPerStudent,
    };

    onLogMeal(newMealLog);

    toast({
      title: t('success'),
      description: t('mealLogged', { mealType: mealType, date: mealDate.toLocaleDateString(), cost: formatCurrency(mealCost) }),
    });

    setMealType('');
    setMealDate(new Date());
    setStudentCount('');
    setItemsUsed([{ name: '', quantity: '' }]);
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t('logMealPreparation')}</CardTitle>
        <CardDescription>{t('logMealDescription')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mealType">{t('mealType')}</Label>
              <Input
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                placeholder="e.g., Breakfast, Lunch"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentCount">{t('studentCount')}</Label>
              <Input
                id="studentCount"
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(e.target.value)}
                placeholder="e.g., 50"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealDate">{t('mealDate')}</Label>
              <DatePicker date={mealDate} setDate={setMealDate} className="w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('itemsUsed')}</Label>
            {itemsUsed.map((item, index) => (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2"
              >
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  placeholder={t('itemName')}
                  required
                  className="flex-grow"
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder={t('quantityLabel').split(' ')[0]}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-24"
                />
                 <Button type="button" variant="ghost" size="icon" onClick={() => removeItemField(index)} disabled={itemsUsed.length <= 1}>
                   <Trash2 className="h-4 w-4 text-destructive" />
                 </Button>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addItemField} className="mt-2">
               <PlusCircle className="mr-2 h-4 w-4" /> {t('addItem')}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
           <Button type="submit" className="w-full md:w-auto gradient-bg text-primary-foreground hover:opacity-90 transition-opacity">
             <UtensilsCrossed className="mr-2 h-4 w-4" /> {t('logMealButton')}
           </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MealLogForm;
  