
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useLocalStorage from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { BarChart3, ShoppingCart, Utensils, Download, PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { exportToCSV } from '@/lib/export';
import { useLanguage } from '@/lib/i18n';
import { useToast } from "@/components/ui/use-toast";
import MonthlyCostChart from './MonthlyCostChart';
import ItemUsageChart from './ItemUsageChart';


const Reports = () => {
  const [inventory] = useLocalStorage('kitchenInventory', []);
  const { t } = useLanguage();
  const { toast } = useToast();

  const calculateMonthlyCosts = () => {
    const costs = {};
    inventory.forEach(item => {
      if (!item.date) return;
      const month = item.date.substring(0, 7);
      if (!costs[month]) {
        costs[month] = { purchase: 0, meal: 0 };
      }
      if (item.type === 'purchase' && typeof item.price === 'number') {
        costs[month].purchase += item.price;
      } else if (item.type === 'meal' && typeof item.totalCost === 'number') {
        costs[month].meal += item.totalCost;
      }
    });
    return Object.entries(costs).map(([month, data]) => ({ month, ...data })).sort((a, b) => b.month.localeCompare(a.month));
  };

  const calculateItemUsage = () => {
    const usage = {};
    inventory.forEach(item => {
        if (item.type === 'meal' && Array.isArray(item.itemsUsed)) {
            item.itemsUsed.forEach(used => {
                 if (used.name && typeof used.quantity === 'number') {
                    usage[used.name] = (usage[used.name] || 0) + used.quantity;
                 }
            });
        }
    });
    return Object.entries(usage).map(([name, quantity]) => ({ name, quantity })).sort((a,b) => b.quantity - a.quantity);
  }

  const monthlyCosts = calculateMonthlyCosts();
  const itemUsage = calculateItemUsage();
  const totalPurchaseCost = monthlyCosts.reduce((sum, month) => sum + month.purchase, 0);
  const totalMealCost = monthlyCosts.reduce((sum, month) => sum + month.meal, 0);

  const handleExportMonthlyCosts = () => {
      const exportData = monthlyCosts.map(cost => ({
          'Month': cost.month,
          'Total Purchase Cost (INR)': cost.purchase.toFixed(2),
          'Total Meal Cost (INR)': cost.meal.toFixed(2),
      }));
      const success = exportToCSV(exportData, 'monthly_cost_summary');
       if (!success) {
         toast({ title: t('error'), description: "No monthly cost data to export.", variant: "destructive" });
     }
  };

  const handleExportItemUsage = () => {
      const exportData = itemUsage.map(item => ({
          'Ingredient Name': item.name,
          'Total Quantity Used': item.quantity.toFixed(2),
      }));
      const success = exportToCSV(exportData, 'ingredient_usage_summary');
       if (!success) {
         toast({ title: t('error'), description: "No ingredient usage data to export.", variant: "destructive" });
     }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
         <Card className="glassmorphism">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">{t('totalPurchaseCost')}</CardTitle>
             <ShoppingCart className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{formatCurrency(totalPurchaseCost)}</div>
             <p className="text-xs text-muted-foreground">{t('totalPurchaseCostDesc')}</p>
           </CardContent>
         </Card>
         <Card className="glassmorphism">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">{t('totalMealCost')}</CardTitle>
             <Utensils className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{formatCurrency(totalMealCost)}</div>
             <p className="text-xs text-muted-foreground">{t('totalMealCostDesc')}</p>
           </CardContent>
         </Card>
        </div>

      {/* Monthly Cost Chart */}
       {monthlyCosts.length > 0 && (
         <Card className="glassmorphism">
           <CardHeader>
             <CardTitle className="text-xl font-semibold text-primary flex items-center">
               <BarChart3 className="mr-2 h-5 w-5"/> {t('monthlyCostChartTitle')}
             </CardTitle>
           </CardHeader>
           <CardContent>
             <MonthlyCostChart data={monthlyCosts} />
           </CardContent>
         </Card>
       )}


      <Card className="glassmorphism">
        <CardHeader>
         <div className="flex justify-between items-center">
            <div>
                 <CardTitle className="text-xl font-semibold text-primary flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5"/> {t('monthlyCostSummary')}
                 </CardTitle>
                 <CardDescription>{t('monthlyCostDesc')}</CardDescription>
            </div>
            <Button onClick={handleExportMonthlyCosts} variant="outline" size="sm" disabled={monthlyCosts.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportCosts')}
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('month')}</TableHead>
                <TableHead className="text-right">{t('totalPurchaseCost')}</TableHead>
                <TableHead className="text-right">{t('totalMealCost')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyCosts.length > 0 ? (
                monthlyCosts.map((cost) => (
                  <TableRow key={cost.month}>
                    <TableCell className="font-medium">{cost.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(cost.purchase)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(cost.meal)}</TableCell>
                  </TableRow>
                ))
               ) : (
                 <TableRow>
                  <TableCell colSpan="3" className="text-center text-muted-foreground">
                    {t('noCostData')}
                  </TableCell>
                </TableRow>
               )}
            </TableBody>
             <TableCaption>{t('monthlyCostCaption')}</TableCaption>
          </Table>
        </CardContent>
      </Card>

       {/* Item Usage Chart */}
        {itemUsage.length > 0 && (
         <Card className="glassmorphism">
           <CardHeader>
             <CardTitle className="text-xl font-semibold text-primary flex items-center">
               <PieChartIcon className="mr-2 h-5 w-5"/> {t('itemUsageChartTitle')}
             </CardTitle>
           </CardHeader>
           <CardContent>
             <ItemUsageChart data={itemUsage} />
           </CardContent>
         </Card>
       )}


        <Card className="glassmorphism">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                 <CardTitle className="text-xl font-semibold text-primary flex items-center">
                    <Utensils className="mr-2 h-5 w-5"/> {t('ingredientUsageSummary')}
                 </CardTitle>
                 <CardDescription>{t('ingredientUsageDesc')}</CardDescription>
             </div>
            <Button onClick={handleExportItemUsage} variant="outline" size="sm" disabled={itemUsage.length === 0}>
                <Download className="mr-2 h-4 w-4" /> {t('exportUsage')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('ingredientName')}</TableHead>
                <TableHead className="text-right">{t('totalQuantityUsed')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemUsage.length > 0 ? (
                itemUsage.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                  </TableRow>
                ))
               ) : (
                 <TableRow>
                  <TableCell colSpan="2" className="text-center text-muted-foreground">
                    {t('noIngredientData')}
                  </TableCell>
                </TableRow>
               )}
            </TableBody>
             <TableCaption>{t('ingredientUsageCaption')}</TableCaption>
          </Table>
        </CardContent>
      </Card>


    </motion.div>
  );
};

export default Reports;
  