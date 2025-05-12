
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { exportToCSV } from '@/lib/export';
import { useLanguage } from '@/lib/i18n.jsx';

const PurchaseHistoryTable = ({ purchaseHistory, onDeletePurchase }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const calculatePricePerKg = (item) => {
    if (!item || item.quantity <= 0) return null;
    const unitPrice = item.unitPrice || (item.price / item.quantity);
    if (isNaN(unitPrice)) return null;

    if (item.unit === 'kg') {
      return unitPrice;
    }
    if (item.unit === 'g') {
      return unitPrice * 1000;
    }
    return null;
  };

   const handleExport = (isDaily = false) => {
     const exportData = purchaseHistory.map(p => {
         const unitPrice = p.unitPrice || (p.price / p.quantity);
         const totalPrice = p.price;
         const pricePerKg = calculatePricePerKg(p);

         return {
             'Date': p.date,
             'Item Name': p.itemName,
             'Quantity': p.quantity.toFixed(2),
             'Unit': p.unit,
             'Unit Price (INR)': !isNaN(unitPrice) ? unitPrice.toFixed(2) : 'N/A',
             'Price per kg (INR)': pricePerKg !== null ? pricePerKg.toFixed(2) : '--',
             'Total Price (INR)': !isNaN(totalPrice) ? totalPrice.toFixed(2) : 'N/A',
             date: p.date
         };
     });

     const filename = 'purchase_history';
     const success = exportToCSV(exportData, filename, isDaily ? new Date() : null);

     if (!success && isDaily) {
         toast({ title: t('error'), description: "No purchase data for today.", variant: "destructive" });
     } else if (!success) {
         toast({ title: t('error'), description: "No purchase data to export.", variant: "destructive" });
     }
   };


  return (
     <Card className="glassmorphism">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold text-primary">{t('purchaseHistory')}</CardTitle>
         <div className="flex gap-2">
             <Button onClick={() => handleExport(true)} variant="outline" size="sm" disabled={purchaseHistory.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportTodayHistory')}
             </Button>
             <Button onClick={() => handleExport(false)} variant="outline" size="sm" disabled={purchaseHistory.length === 0}>
                 <Download className="mr-2 h-4 w-4" /> {t('exportHistory')}
             </Button>
         </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('date')}</TableHead>
              <TableHead>{t('itemName')}</TableHead>
              <TableHead className="text-right">{t('quantityWithUnit')}</TableHead>
              <TableHead className="text-right">{t('unitPrice')}</TableHead>
              <TableHead className="text-right">{t('pricePerKg')}</TableHead>
              <TableHead className="text-right">{t('totalPrice')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHistory.length > 0 ? (
              purchaseHistory.map((purchase) => {
                const unitPrice = purchase.unitPrice || (purchase.quantity > 0 ? purchase.price / purchase.quantity : 0);
                const pricePerKg = calculatePricePerKg(purchase);
                return (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell className="font-medium">{purchase.itemName}</TableCell>
                    <TableCell className="text-right">{`${purchase.quantity.toFixed(2)} ${purchase.unit}`}</TableCell>
                    <TableCell className="text-right">{formatCurrency(unitPrice)}</TableCell>
                    <TableCell className="text-right">
                      {pricePerKg !== null ? formatCurrency(pricePerKg) : '--'}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(purchase.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onDeletePurchase(purchase.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
               <TableRow>
                <TableCell colSpan="7" className="text-center text-muted-foreground">
                  {t('noPurchaseHistory')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
           <TableCaption>{t('purchaseHistoryCaption')}</TableCaption>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PurchaseHistoryTable;
  