
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Trash2, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { exportToCSV } from '@/lib/export';
import { useLanguage } from '@/lib/i18n';
import { useToast } from "@/components/ui/use-toast";


const MealLogHistory = ({ mealHistory, onDeleteMealLog }) => {
   const { t } = useLanguage();
   const { toast } = useToast();

   const handleExport = (isDaily = false) => {
     const exportData = mealHistory.map(m => ({
         'Date': m.date,
         'Meal Type': m.mealType,
         'Students': m.studentCount,
         'Items Used': m.itemsUsed.map(item => `${item.name} (${item.quantity.toFixed(2)})`).join(', '),
         'Total Cost (INR)': m.totalCost.toFixed(2),
         'Cost Per Student (INR)': m.costPerStudent.toFixed(2),
         // Include original data for filtering
         date: m.date
     }));

     const filename = 'meal_log_history';
     const success = exportToCSV(exportData, filename, isDaily ? new Date() : null);

      if (!success && isDaily) {
         toast({ title: t('error'), description: "No meal log data for today.", variant: "destructive" });
     } else if (!success) {
         toast({ title: t('error'), description: "No meal log data to export.", variant: "destructive" });
     }
   };


  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold text-primary">{t('mealLogHistory')}</CardTitle>
         <div className="flex gap-2">
             <Button onClick={() => handleExport(true)} variant="outline" size="sm" disabled={mealHistory.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportTodayHistory')}
             </Button>
             <Button onClick={() => handleExport(false)} variant="outline" size="sm" disabled={mealHistory.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportHistory')}
             </Button>
         </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('date')}</TableHead>
              <TableHead>{t('mealType')}</TableHead>
              <TableHead className="text-right">{t('students')}</TableHead>
              <TableHead>{t('itemsUsed')}</TableHead>
              <TableHead className="text-right">{t('totalCost')}</TableHead>
              <TableHead className="text-right">{t('costPerStudent')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mealHistory.length > 0 ? (
              mealHistory.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>{meal.date}</TableCell>
                  <TableCell className="font-medium">{meal.mealType}</TableCell>
                  <TableCell className="text-right">{meal.studentCount}</TableCell>
                  <TableCell>
                     {meal.itemsUsed.map((item, idx) => (
                         <span key={idx} className="block text-xs">{item.name} ({item.quantity.toFixed(2)})</span>
                     ))}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(meal.totalCost)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(meal.costPerStudent)}</TableCell>
                   <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => onDeleteMealLog(meal.id)}>
                         <Trash2 className="h-4 w-4 text-destructive" />
                     </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan="7" className="text-center text-muted-foreground">
                  {t('noMealLogs')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
           <TableCaption>{t('mealLogCaption')}</TableCaption>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MealLogHistory;
  