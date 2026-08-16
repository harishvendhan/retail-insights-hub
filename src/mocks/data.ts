import type {
  DashboardSummary,
  ImportHistoryEntry,
  Product,
  ReportDefinition,
  Supplier,
  TrendPoint,
} from "@/types/api";

const CATEGORIES = ["Rice & Grains", "Oils", "Dairy", "Snacks", "Beverages", "Spices", "Household"];
const BRANDS = ["Aachi", "Sakthi", "Amul", "Britannia", "Tata", "Nandini", "Surf"];

export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Madurai Wholesale Traders",
    contactPerson: "R. Selvam",
    phone: "+91 98400 11223",
    email: "selvam@maduraiwholesale.in",
    productCount: 18,
    totalPurchaseValue: 1846500,
    lastPurchaseDate: "2026-08-12",
  },
  {
    id: "sup-2",
    name: "Coimbatore Foods Distribution",
    contactPerson: "K. Anitha",
    phone: "+91 99442 55667",
    email: "anitha@cbefoods.in",
    productCount: 14,
    totalPurchaseValue: 1204300,
    lastPurchaseDate: "2026-08-09",
  },
  {
    id: "sup-3",
    name: "Chennai Daily Dairy",
    contactPerson: "S. Prakash",
    phone: "+91 90031 44556",
    email: "prakash@chennaidairy.in",
    productCount: 9,
    totalPurchaseValue: 738200,
    lastPurchaseDate: "2026-08-15",
  },
  {
    id: "sup-4",
    name: "Salem Home Essentials",
    contactPerson: "M. Devi",
    phone: "+91 94433 77889",
    email: "devi@salemessentials.in",
    productCount: 11,
    totalPurchaseValue: 512900,
    lastPurchaseDate: "2026-07-28",
  },
];

const PRODUCT_NAMES: [string, string][] = [
  ["Ponni Boiled Rice 25kg", "பொன்னி புழுங்கல் அரிசி 25கிலோ"],
  ["Idli Rice 10kg", "இட்லி அரிசி 10கிலோ"],
  ["Sunflower Oil 1L", "சூரியகாந்தி எண்ணெய் 1லி"],
  ["Gingelly Oil 500ml", "நல்லெண்ணெய் 500மிலி"],
  ["Toned Milk 500ml", "பால் 500மிலி"],
  ["Curd 400g", "தயிர் 400கி"],
  ["Butter 100g", "வெண்ணெய் 100கி"],
  ["Marie Biscuit 250g", "மேரி பிஸ்கட் 250கி"],
  ["Banana Chips 200g", "வாழைக்காய் சிப்ஸ் 200கி"],
  ["Filter Coffee Powder 500g", "பில்டர் காபி பொடி 500கி"],
  ["Tea Dust 250g", "தேயிலை 250கி"],
  ["Tamarind 500g", "புளி 500கி"],
  ["Sambar Powder 200g", "சாம்பார் பொடி 200கி"],
  ["Chilli Powder 200g", "மிளகாய் பொடி 200கி"],
  ["Turmeric Powder 100g", "மஞ்சள் பொடி 100கி"],
  ["Toor Dal 1kg", "துவரம் பருப்பு 1கிலோ"],
  ["Urad Dal 500g", "உளுந்து 500கி"],
  ["Detergent Powder 1kg", "சலவை தூள் 1கிலோ"],
  ["Dish Wash Bar", "பாத்திரம் கழுவும் சோப்"],
  ["Coconut Oil 500ml", "தேங்காய் எண்ணெய் 500மிலி"],
  ["Wheat Flour 5kg", "கோதுமை மாவு 5கிலோ"],
  ["Rava 1kg", "ரவை 1கிலோ"],
  ["Jaggery 1kg", "வெல்லம் 1கிலோ"],
  ["Salt 1kg", "உப்பு 1கிலோ"],
  ["Sugar 1kg", "சர்க்கரை 1கிலோ"],
  ["Soft Drink 750ml", "குளிர்பானம் 750மிலி"],
  ["Mineral Water 1L", "குடிநீர் 1லி"],
  ["Ghee 200ml", "நெய் 200மிலி"],
  ["Paneer 200g", "பனீர் 200கி"],
  ["Bread Loaf", "பிரெட்"],
  ["Egg Tray (30)", "முட்டை தட்டு (30)"],
  ["Mustard 100g", "கடுகு 100கி"],
  ["Cumin 100g", "சீரகம் 100கி"],
  ["Pepper 100g", "மிளகு 100கி"],
  ["Groundnut 500g", "வேர்க்கடலை 500கி"],
  ["Cashew 250g", "முந்திரி 250கி"],
  ["Noodles 70g", "நூடுல்ஸ் 70கி"],
  ["Hand Wash 250ml", "கை சோப் 250மிலி"],
  ["Floor Cleaner 1L", "தரை சுத்திகரிப்பு 1லி"],
  ["Toothpaste 100g", "பற்பசை 100கி"],
  ["Shampoo Sachet", "ஷாம்பு பாக்கெட்"],
  ["Incense Sticks", "ஊதுபத்தி"],
  ["Matchbox Pack", "தீப்பெட்டி"],
  ["Coriander Seeds 200g", "மல்லி 200கி"],
  ["Green Gram 500g", "பச்சை பயறு 500கி"],
  ["Appalam 100g", "அப்பளம் 100கி"],
  ["Vermicelli 200g", "சேமியா 200கி"],
  ["Honey 250ml", "தேன் 250மிலி"],
  ["Chocolate Bar 50g", "சாக்லேட் 50கி"],
  ["Ice Cream 500ml", "ஐஸ்கிரீம் 500மிலி"],
];

function statusFor(i: number, stock: number, reorder: number): Product["stockStatus"] {
  if (stock === 0) return "out_of_stock";
  if (i % 9 === 4) return "expiring";
  if (stock <= reorder) return "low_stock";
  return "healthy";
}

export const mockProducts: Product[] = PRODUCT_NAMES.map(([name, nameTa], i) => {
  const reorder = 10 + (i % 5) * 6;
  const stock = i % 11 === 3 ? 0 : Math.max(0, ((i * 37) % 140) - (i % 7) * 4);
  const unitCost = 25 + ((i * 17) % 480);
  const supplier = mockSuppliers[i % mockSuppliers.length]!;
  const expiryOffset = 4 + (i % 9) * 21;
  return {
    id: `prd-${i + 1}`,
    sku: `SKU-${(1000 + i).toString()}`,
    name,
    nameTa,
    category: CATEGORIES[i % CATEGORIES.length]!,
    brand: BRANDS[i % BRANDS.length]!,
    supplierId: supplier.id,
    supplierName: supplier.name,
    unit: "pcs",
    currentStock: stock,
    reorderLevel: reorder,
    unitCost,
    sellingPrice: Math.round(unitCost * 1.18),
    stockValue: stock * unitCost,
    stockStatus: statusFor(i, stock, reorder),
    expiryDate: new Date(Date.UTC(2026, 7, 16 + expiryOffset)).toISOString().slice(0, 10),
    updatedAt: new Date(Date.UTC(2026, 7, 10 + (i % 6))).toISOString(),
  };
});

export const mockCategories = CATEGORIES;
export const mockBrands = BRANDS;

export function trendPoints(count: number, base: number, labelFor: (i: number) => string): TrendPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    label: labelFor(i),
    value: Math.round(base + Math.sin(i / 1.7) * base * 0.22 + (i % 4) * base * 0.05),
    secondaryValue: Math.round((base + Math.cos(i / 2) * base * 0.18) * 0.31),
  }));
}

export const mockDashboard: DashboardSummary = {
  generatedAt: "2026-08-16T06:30:00.000Z",
  currency: "INR",
  todaySales: { value: 48250, unit: "INR", context: "Today · 16 Aug 2026", changePercent: 6.4 },
  weeklySales: { value: 318400, unit: "INR", context: "10–16 Aug 2026", changePercent: -2.1 },
  monthlySales: { value: 1246900, unit: "INR", context: "1–16 Aug 2026", changePercent: 9.8 },
  totalRevenue: { value: 14872300, unit: "INR", context: "All time · since Jan 2025" },
  totalProducts: { value: 50, unit: "products", context: "Active catalogue · 16 Aug 2026" },
  totalUnitsSold: { value: 92480, unit: "units", context: "All time · since Jan 2025" },
  inventoryValue: { value: 1893450, unit: "INR", context: "At cost · 16 Aug 2026 06:30" },
  lowStockCount: { value: 12, unit: "products", context: "Below reorder level · live" },
  outOfStockCount: { value: 4, unit: "products", context: "Zero stock · live" },
  expiringCount: { value: 6, unit: "products", context: "Expiring within 30 days" },
  bestSellingProduct: {
    productId: "prd-5",
    name: "Toned Milk 500ml",
    value: 3820,
    unit: "units",
    context: "Last 30 days",
  },
  slowMovingProduct: {
    productId: "prd-36",
    name: "Cashew 250g",
    value: 11,
    unit: "units",
    context: "Last 30 days",
  },
  insights: [
    {
      id: "ins-1",
      message: "12 products are below reorder level — place purchase orders to avoid stock-outs.",
      severity: "warning",
      link: "/inventory?filter=low-stock",
    },
    {
      id: "ins-2",
      message: "4 products are out of stock right now, including 2 fast movers.",
      severity: "critical",
      link: "/inventory?filter=out-of-stock",
    },
    {
      id: "ins-3",
      message: "6 products expire within 30 days. Consider a clearance offer.",
      severity: "warning",
      link: "/inventory?filter=expiring",
    },
    {
      id: "ins-4",
      message: "Dairy category revenue is trending up 14% week-on-week.",
      severity: "info",
      link: "/sales?groupBy=category",
      isEstimate: true,
    },
    {
      id: "ins-5",
      message: "Estimated reorder budget for the next 7 days is around ₹1,15,000.",
      severity: "info",
      isEstimate: true,
    },
  ],
};

export const mockImportHistory: ImportHistoryEntry[] = [
  {
    importId: "imp-1042",
    fileName: "august-sales-week2.xlsx",
    uploadedAt: "2026-08-15T11:20:00.000Z",
    status: "completed",
    totalRows: 1840,
    validRows: 1840,
    invalidRows: 0,
  },
  {
    importId: "imp-1039",
    fileName: "stock-count-aug.csv",
    uploadedAt: "2026-08-11T07:45:00.000Z",
    status: "partial",
    totalRows: 620,
    validRows: 597,
    invalidRows: 23,
  },
  {
    importId: "imp-1031",
    fileName: "supplier-purchases-july.xlsx",
    uploadedAt: "2026-07-31T15:02:00.000Z",
    status: "failed",
    totalRows: 410,
    validRows: 0,
    invalidRows: 410,
  },
];

export const mockReportDefinitions: ReportDefinition[] = [
  { type: "sales", title: "Sales report", description: "Revenue, units and transactions for a date range.", formats: ["pdf", "excel", "csv"] },
  { type: "inventory", title: "Inventory valuation", description: "Stock on hand and value at cost.", formats: ["pdf", "excel", "csv"] },
  { type: "low-stock", title: "Low stock report", description: "Products at or below reorder level.", formats: ["pdf", "excel"] },
  { type: "reorder", title: "Reorder suggestions", description: "Suggested purchase quantities (estimate).", formats: ["pdf", "excel"] },
  { type: "expiry", title: "Expiry report", description: "Products nearing expiry with batch details.", formats: ["pdf", "csv"] },
  { type: "product-performance", title: "Product performance", description: "Best and slow movers by product.", formats: ["pdf", "excel", "csv"] },
  { type: "category-performance", title: "Category performance", description: "Revenue share by category.", formats: ["pdf", "excel"] },
  { type: "supplier-performance", title: "Supplier performance", description: "Purchase value and reliability by supplier.", formats: ["pdf", "excel"] },
];
