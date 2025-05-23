
import React, { useState, createContext, useContext } from 'react';

const translations = {
  en: {
    appName: "Central Kitchen Manager",
    inventory: "Inventory",
    purchases: "Purchases",
    mealLog: "Meal Log",
    reports: "Reports",
    currentInventory: "Current Inventory",
    itemName: "Item Name",
    quantityInStock: "Quantity in Stock",
    avgUnitCost: "Avg. Unit Cost",
    totalValue: "Total Value",
    noItemsInStock: "No items in stock. Add purchases first.",
    inventoryCaption: "List of current groceries and vegetables in stock with estimated value.",
    exportInventory: "Export Inventory",
    exportTodayInventory: "Export Today's Inventory",
    recordNewPurchase: "Record New Purchase",
    addPurchaseDescription: "Add new groceries or vegetables to the inventory.",
    quantityLabel: "Quantity",
    unitLabel: "Unit",
    unitPlaceholder: "Select unit",
    unitPriceLabel: "Price per Unit (INR)",
    totalPriceLabel: "Total Price (INR)",
    purchaseDateLabel: "Purchase Date",
    addPurchaseButton: "Add Purchase",
    purchaseHistory: "Purchase History",
    date: "Date",
    unitPrice: "Unit Price",
    pricePerKg: "Price/kg",
    totalPrice: "Total Price",
    actions: "Actions",
    noPurchaseHistory: "No purchase history yet.",
    purchaseHistoryCaption: "History of all recorded purchases.",
    exportHistory: "Export History",
    exportTodayHistory: "Export Today's History",
    logMealPreparation: "Log Meal Preparation",
    logMealDescription: "Record details about a prepared meal and the ingredients used.",
    mealType: "Meal Type",
    studentCount: "Number of Students",
    mealDate: "Meal Date",
    itemsUsed: "Items Used",
    addItem: "Add Item",
    logMealButton: "Log Meal",
    mealLogHistory: "Meal Log History",
    students: "Students",
    totalCost: "Total Cost",
    costPerStudent: "Cost/Student",
    noMealLogs: "No meal logs yet.",
    mealLogCaption: "History of all logged meals and their costs.",
    totalPurchaseCost: "Total Purchase Cost",
    totalPurchaseCostDesc: "Total spent on all purchases",
    totalMealCost: "Total Meal Cost",
    totalMealCostDesc: "Calculated cost of all logged meals",
    monthlyCostSummary: "Monthly Cost Summary",
    monthlyCostDesc: "Overview of purchase and meal costs per month.",
    month: "Month",
    noCostData: "No cost data available yet.",
    monthlyCostCaption: "Summary of costs aggregated by month.",
    exportCosts: "Export Costs",
    ingredientUsageSummary: "Ingredient Usage Summary",
    ingredientUsageDesc: "Total quantity of each ingredient used in meals.",
    ingredientName: "Ingredient Name",
    totalQuantityUsed: "Total Quantity Used",
    noIngredientData: "No ingredient usage data available yet.",
    ingredientUsageCaption: "Summary of ingredient consumption based on meal logs.",
    exportUsage: "Export Usage",
    footerText: "Kitchen Management System",
    pickADate: "Pick a date",
    success: "Success",
    error: "Error",
    deleted: "Deleted",
    purchaseAdded: "{itemName} purchase added successfully.",
    purchaseRemoved: "Purchase record removed.",
    mealLogged: "{mealType} logged for {date}. Cost: {cost}.",
    mealLogRemoved: "Meal log entry removed.",
    fillAllDetails: "Please fill in all details.",
    fillPurchaseDetails: "Please fill in all purchase details correctly (Quantity > 0, Price/Unit >= 0, Unit selected).",
    fillMealDetails: "Please fill in all meal details and items used.",
    positiveStudentCount: "Student count must be a positive number.",
    addValidItem: "Please add at least one valid item used.",
    notEnoughStock: "Not enough stock for {itemName}. Available: {available}",
    language: "Language",
    english: "English",
    telugu: "Telugu",
    monthlyCostChartTitle: "Monthly Costs (Purchase vs Meal)",
    itemUsageChartTitle: "Top 5 Ingredient Usage",
    quantityWithUnit: "Quantity",
    calculatedTotal: "Calculated Total",
  },
  te: {
    appName: "సెంట్రల్ కిచెన్ మేనేజర్",
    inventory: "ఇన్వెంటరీ",
    purchases: "కొనుగోళ్లు",
    mealLog: "భోజన లాగ్",
    reports: "నివేదికలు",
    currentInventory: "ప్రస్తుత ఇన్వెంటరీ",
    itemName: "వస్తువు పేరు",
    quantityInStock: "స్టాక్‌లో పరిమాణం",
    avgUnitCost: "సగటు యూనిట్ ధర",
    totalValue: "మొత్తం విలువ",
    noItemsInStock: "స్టాక్‌లో వస్తువులు లేవు. ముందుగా కొనుగోళ్లు జోడించండి.",
    inventoryCaption: "అంచనా విలువతో స్టాక్‌లో ఉన్న ప్రస్తుత కిరాణా మరియు కూరగాయల జాబితా.",
    exportInventory: "ఇన్వెంటరీని ఎగుమతి చేయండి",
    exportTodayInventory: "నేటి ఇన్వెంటరీని ఎగుమతి చేయండి",
    recordNewPurchase: "కొత్త కొనుగోలును రికార్డ్ చేయండి",
    addPurchaseDescription: "ఇన్వెంటరీకి కొత్త కిరాణా లేదా కూరగాయలను జోడించండి.",
    quantityLabel: "పరిమాణం",
    unitLabel: "యూనిట్",
    unitPlaceholder: "యూనిట్ ఎంచుకోండి",
    unitPriceLabel: "యూనిట్‌కు ధర (INR)",
    totalPriceLabel: "మొత్తం ధర (INR)",
    purchaseDateLabel: "కొనుగోలు తేదీ",
    addPurchaseButton: "కొనుగోలు జోడించు",
    purchaseHistory: "కొనుగోలు చరిత్ర",
    date: "తేదీ",
    unitPrice: "యూనిట్ ధర",
    pricePerKg: "ధర/కిలో",
    totalPrice: "మొత్తం ధర",
    actions: "చర్యలు",
    noPurchaseHistory: "ఇంకా కొనుగోలు చరిత్ర లేదు.",
    purchaseHistoryCaption: "రికార్డ్ చేయబడిన అన్ని కొనుగోళ్ల చరిత్ర.",
    exportHistory: "చరిత్రను ఎగుమతి చేయండి",
    exportTodayHistory: "నేటి చరిత్రను ఎగుమతి చేయండి",
    logMealPreparation: "భోజన తయారీని లాగ్ చేయండి",
    logMealDescription: "తయారుచేసిన భోజనం మరియు ఉపయోగించిన పదార్థాల వివరాలను రికార్డ్ చేయండి.",
    mealType: "భోజన రకం",
    studentCount: "విద్యార్థుల సంఖ్య",
    mealDate: "భోజన తేదీ",
    itemsUsed: "ఉపయోగించిన వస్తువులు",
    addItem: "వస్తువును జోడించు",
    logMealButton: "భోజనాన్ని లాగ్ చేయండి",
    mealLogHistory: "భోజన లాగ్ చరిత్ర",
    students: "విద్యార్థులు",
    totalCost: "మొత్తం ఖర్చు",
    costPerStudent: "ఒక్కో విద్యార్థికి ఖర్చు",
    noMealLogs: "ఇంకా భోజన లాగ్‌లు లేవు.",
    mealLogCaption: "లాగ్ చేయబడిన అన్ని భోజనాలు మరియు వాటి ఖర్చుల చరిత్ర.",
    totalPurchaseCost: "మొత్తం కొనుగోలు ఖర్చు",
    totalPurchaseCostDesc: "అన్ని కొనుగోళ్లపై మొత్తం ఖర్చు",
    totalMealCost: "మొత్తం భోజన ఖర్చు",
    totalMealCostDesc: "లాగ్ చేయబడిన అన్ని భోజనాల గణిత ఖర్చు",
    monthlyCostSummary: "నెలవారీ ఖర్చు సారాంశం",
    monthlyCostDesc: "ప్రతి నెలా కొనుగోలు మరియు భోజన ఖర్చుల అవలోకనం.",
    month: "నెల",
    noCostData: "ఇంకా ఖర్చు డేటా అందుబాటులో లేదు.",
    monthlyCostCaption: "నెలవారీగా సమగ్రపరచబడిన ఖర్చుల సారాంశం.",
    exportCosts: "ఖర్చులను ఎగుమతి చేయండి",
    ingredientUsageSummary: "పదార్థ వినియోగ సారాంశం",
    ingredientUsageDesc: "భోజనంలో ఉపయోగించిన ప్రతి పదార్థం యొక్క మొత్తం పరిమాణం.",
    ingredientName: "పదార్థం పేరు",
    totalQuantityUsed: "మొత్తం ఉపయోగించిన పరిమాణం",
    noIngredientData: "ఇంకా పదార్థ వినియోగ డేటా అందుబాటులో లేదు.",
    ingredientUsageCaption: "భోజన లాగ్‌ల ఆధారంగా పదార్థ వినియోగ సారాంశం.",
    exportUsage: "వినియోగాన్ని ఎగుమతి చేయండి",
    footerText: "కిచెన్ మేనేజ్‌మెంట్ సిస్టమ్",
    pickADate: "తేదీని ఎంచుకోండి",
    success: "విజయం",
    error: "లోపం",
    deleted: "తొలగించబడింది",
    purchaseAdded: "{itemName} కొనుగోలు విజయవంతంగా జోడించబడింది.",
    purchaseRemoved: "కొనుగోలు రికార్డ్ తీసివేయబడింది.",
    mealLogged: "{date} నాడు {mealType} లాగ్ చేయబడింది. ఖర్చు: {cost}.",
    mealLogRemoved: "భోజన లాగ్ ఎంట్రీ తీసివేయబడింది.",
    fillAllDetails: "దయచేసి అన్ని వివరాలను పూరించండి.",
    fillPurchaseDetails: "దయచేసి అన్ని కొనుగోలు వివరాలను సరిగ్గా పూరించండి (పరిమాణం > 0, యూనిట్‌కు ధర >= 0, యూనిట్ ఎంచుకోబడింది).",
    fillMealDetails: "దయచేసి అన్ని భోజన వివరాలు మరియు ఉపయోగించిన వస్తువులను పూరించండి.",
    positiveStudentCount: "విద్యార్థుల సంఖ్య ధనాత్మక సంఖ్య అయి ఉండాలి.",
    addValidItem: "దయచేసి కనీసం ఒక చెల్లుబాటు అయ్యే వస్తువును జోడించండి.",
    notEnoughStock: "{itemName} కోసం తగినంత స్టాక్ లేదు. అందుబాటులో ఉంది: {available}",
    language: "భాష",
    english: "ఇంగ్లీష్",
    telugu: "తెలుగు",
    monthlyCostChartTitle: "నెలవారీ ఖర్చులు (కొనుగోలు vs భోజనం)",
    itemUsageChartTitle: "టాప్ 5 పదార్థ వినియోగం",
    quantityWithUnit: "పరిమాణం",
    calculatedTotal: "గణించిన మొత్తం",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key, options = {}) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`{${optionKey}}`, 'g');
        translation = translation.replace(regex, options[optionKey]);
    });
    return translation;
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
  