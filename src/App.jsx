
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import Inventory from '@/components/Inventory';
import Purchases from '@/components/Purchases';
import MealLog from '@/components/MealLog';
import Reports from '@/components/Reports';
import { Package, ShoppingCart, UtensilsCrossed, BarChart3, ChefHat, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function App() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4 md:p-8">
       <header className="mb-8 flex items-center justify-between">
         <div className="flex items-center space-x-3">
             <ChefHat className="h-8 w-8 text-primary" />
             <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
               {t('appName')}
             </h1>
         </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Languages className="mr-2 h-4 w-4" />
                {language === 'en' ? t('english') : t('telugu')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                {t('english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('te')} disabled={language === 'te'}>
                {t('telugu')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
       </header>

      <Tabs defaultValue="inventory" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 gap-2 md:gap-0 bg-card/80 backdrop-blur-sm p-1 rounded-lg">
          <TabsTrigger value="inventory" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all">
            <Package className="h-4 w-4" /> {t('inventory')}
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all">
             <ShoppingCart className="h-4 w-4" /> {t('purchases')}
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all">
             <UtensilsCrossed className="h-4 w-4" /> {t('mealLog')}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all">
             <BarChart3 className="h-4 w-4" /> {t('reports')}
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
           <TabsContent value="inventory" key="inventory">
                <Inventory />
           </TabsContent>
           <TabsContent value="purchases" key="purchases">
               <Purchases />
           </TabsContent>
           <TabsContent value="meals" key="meals">
               <MealLog />
           </TabsContent>
           <TabsContent value="reports" key="reports">
                <Reports />
           </TabsContent>
        </AnimatePresence>

      </Tabs>
      <Toaster />
       <footer className="text-center mt-12 text-sm text-muted-foreground">
            {t('footerText')} - &copy; {new Date().getFullYear()}
       </footer>
    </div>
  );
}

export default App;
  