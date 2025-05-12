
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n.jsx';
import { formatCurrency } from '@/lib/currency';

const PurchaseForm = ({ onAddPurchase }) => {
  const { t } = useLanguage();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const units = ['kg', 'g', 'L', 'ml', 'pcs', 'unit', 'pack', 'box'];

  useEffect(() => {
    const parsedQuantity = parseFloat(quantity);
    const parsedUnitPrice = parseFloat(unitPrice);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0 && !isNaN(parsedUnitPrice) && parsedUnitPrice >= 0) {
      setCalculatedTotal(parsedQuantity * parsedUnitPrice);
    } else {
      setCalculatedTotal(0);
    }
  }, [quantity, unitPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPurchase({ itemName, quantity, unit, unitPrice, purchaseDate, totalPrice: calculatedTotal });
    // Reset form after submission handled by parent
    setItemName('');
    setQuantity('');
    setUnit('');
    setUnitPrice('');
    setPurchaseDate(new Date());
    setCalculatedTotal(0);
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t('recordNewPurchase')}</CardTitle>
        <CardDescription>{t('addPurchaseDescription')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="itemName">{t('itemName')}</Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Tomatoes"
                required
              />
            </div>
             <div className="space-y-2">
               <Label htmlFor="quantity">{t('quantityLabel')}</Label>
               <Input
                 id="quantity"
                 type="number"
                 value={quantity}
                 onChange={(e) => setQuantity(e.target.value)}
                 placeholder="e.g., 5"
                 required
                 min="0.01"
                 step="any"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="unit">{t('unitLabel')}</Label>
               <Select value={unit} onValueChange={setUnit} required>
                 <SelectTrigger id="unit">
                   <SelectValue placeholder={t('unitPlaceholder')} />
                 </SelectTrigger>
                 <SelectContent>
                   {units.map((u) => (
                     <SelectItem key={u} value={u}>{u}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                 <Label htmlFor="unitPrice">{t('unitPriceLabel')}</Label>
                 <Input
                   id="unitPrice"
                   type="number"
                   value={unitPrice}
                   onChange={(e) => setUnitPrice(e.target.value)}
                   placeholder="e.g., 30.10"
                   required
                   min="0"
                   step="any"
                 />
             </div>
             <div className="space-y-2">
                <Label htmlFor="purchaseDate">{t('purchaseDateLabel')}</Label>
                <DatePicker date={purchaseDate} setDate={setPurchaseDate} className="w-full" />
            </div>
             <div className="space-y-2">
                <Label>{t('calculatedTotal')}</Label>
                <div className="h-10 flex items-center px-3 py-2 text-sm text-muted-foreground border border-input rounded-md bg-muted">
                    {formatCurrency(calculatedTotal)}
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto gradient-bg text-primary-foreground hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('addPurchaseButton')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PurchaseForm;
  