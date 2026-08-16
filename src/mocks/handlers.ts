import type {
  AiAnswer,
  AiQueryRequest,
  DashboardSummary,
  ImportConfirmResponse,
  ImportHistoryEntry,
  ImportUploadResponse,
  LoginResponse,
  Paginated,
  Product,
  ProductDetail,
  ProductQuery,
  ReportDefinition,
  ReportPreview,
  ReportType,
  SalesOverview,
  SalesQuery,
  Supplier,
  SupplierDetail,
  VoiceQueryResponse,
} from "@/types/api";
import {
  mockBrands,
  mockCategories,
  mockDashboard,
  mockImportHistory,
  mockProducts,
  mockReportDefinitions,
  mockSuppliers,
  trendPoints,
} from "./data";

const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async login(email: string): Promise<LoginResponse> {
    await delay();
    return {
      token: "mock-token-" + Date.now(),
      user: {
        id: "usr-1",
        name: "Store Manager",
        email,
        role: "manager",
        storeName: "Anandha Super Market",
        preferredLanguage: "ta",
      },
    };
  },

  async dashboard(): Promise<DashboardSummary> {
    await delay();
    return mockDashboard;
  },

  async products(q: ProductQuery): Promise<Paginated<Product>> {
    await delay();
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 10;
    let rows = [...mockProducts];
    if (q.search) {
      const s = q.search.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          (p.nameTa ?? "").includes(q.search ?? ""),
      );
    }
    if (q.category && q.category !== "all") rows = rows.filter((p) => p.category === q.category);
    if (q.brand && q.brand !== "all") rows = rows.filter((p) => p.brand === q.brand);
    if (q.supplierId && q.supplierId !== "all") rows = rows.filter((p) => p.supplierId === q.supplierId);
    if (q.stockStatus && q.stockStatus !== "all") rows = rows.filter((p) => p.stockStatus === q.stockStatus);
    if (q.sortBy) {
      const key = q.sortBy as keyof Product;
      const dir = q.sortDir === "desc" ? -1 : 1;
      rows.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
      });
    }
    const total = rows.length;
    return {
      data: rows.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async filterOptions() {
    await delay(120);
    return {
      categories: mockCategories,
      brands: mockBrands,
      suppliers: mockSuppliers.map((s) => ({ id: s.id, name: s.name })),
    };
  },

  async product(id: string): Promise<ProductDetail> {
    await delay();
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return {
      product,
      salesTrend: {
        context: "Units sold · last 14 days",
        points: trendPoints(14, 40, (i) => `${3 + i} Aug`),
      },
      purchaseHistory: Array.from({ length: 5 }, (_, i) => ({
        id: `pur-${id}-${i}`,
        date: `2026-0${7 - (i % 2)}-${10 + i}`,
        supplierName: product.supplierName,
        quantity: 40 + i * 10,
        unitCost: product.unitCost,
        totalCost: (40 + i * 10) * product.unitCost,
      })),
      movements: Array.from({ length: 8 }, (_, i) => ({
        id: `mov-${id}-${i}`,
        date: `2026-08-${String(16 - i).padStart(2, "0")}`,
        type: (["sale", "purchase", "adjustment", "return"] as const)[i % 4]!,
        quantity: i % 4 === 1 ? 60 : -(4 + i),
        note: i % 4 === 2 ? "Stock count correction" : undefined,
      })),
      aiInsights: [
        {
          id: "pins-1",
          message: `Average daily sale is around ${Math.max(1, Math.round(product.currentStock / 12))} units — estimated cover of ${Math.max(1, Math.round(product.currentStock / 4))} days.`,
          severity: "info",
          isEstimate: true,
        },
        {
          id: "pins-2",
          message:
            product.stockStatus === "healthy"
              ? "Stock level looks comfortable against recent demand."
              : "Reorder recommended before the weekend demand peak.",
          severity: product.stockStatus === "healthy" ? "info" : "warning",
          isEstimate: true,
        },
      ],
    };
  },

  async sales(q: SalesQuery): Promise<SalesOverview> {
    await delay();
    const range = q.range ?? "daily";
    const groupBy = q.groupBy ?? "product";
    const points =
      range === "daily"
        ? trendPoints(14, 46000, (i) => `${3 + i} Aug`)
        : range === "weekly"
          ? trendPoints(8, 302000, (i) => `W${i + 24}`)
          : trendPoints(12, 1180000, (i) => ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i]!);
    const source =
      groupBy === "product"
        ? mockProducts.slice(0, 10).map((p) => ({ key: p.id, label: p.name }))
        : groupBy === "category"
          ? mockCategories.map((c) => ({ key: c, label: c }))
          : mockBrands.map((b) => ({ key: b, label: b }));
    const revenues = source.map((_, i) => 240000 - i * 17000);
    const totalRev = revenues.reduce((a, b) => a + b, 0);
    const context = `${range === "daily" ? "3–16 Aug 2026" : range === "weekly" ? "Last 8 weeks" : "Last 12 months"} · store totals`;
    return {
      context,
      currency: "INR",
      totalRevenue: { value: 1246900, unit: "INR", context, changePercent: 8.2 },
      unitsSold: { value: 18420, unit: "units", context },
      transactions: { value: 3184, unit: "bills", context },
      averageBasket: { value: 392, unit: "INR", context },
      trend: { context: `Revenue · ${context}`, points },
      breakdown: source.map((s, i) => ({
        key: s.key,
        label: s.label,
        unitsSold: 3200 - i * 210,
        revenue: revenues[i]!,
        sharePercent: Math.round((revenues[i]! / totalRev) * 1000) / 10,
      })),
      topSellers: mockProducts.slice(0, 5).map((p, i) => ({
        productId: p.id,
        name: p.name,
        value: 3820 - i * 340,
        unit: "units",
        context,
      })),
      slowMovers: mockProducts.slice(-5).map((p, i) => ({
        productId: p.id,
        name: p.name,
        value: 8 + i * 3,
        unit: "units",
        context,
      })),
    };
  },

  async suppliers(): Promise<Supplier[]> {
    await delay();
    return mockSuppliers;
  },

  async supplier(id: string): Promise<SupplierDetail> {
    await delay();
    const supplier = mockSuppliers.find((s) => s.id === id);
    if (!supplier) throw new Error("Supplier not found");
    const products = mockProducts.filter((p) => p.supplierId === id);
    return {
      supplier,
      products,
      purchaseHistory: products.slice(0, 6).map((p, i) => ({
        id: `sp-${id}-${i}`,
        date: `2026-08-${String(14 - i).padStart(2, "0")}`,
        supplierName: supplier.name,
        quantity: 50 + i * 12,
        unitCost: p.unitCost,
        totalCost: (50 + i * 12) * p.unitCost,
      })),
    };
  },

  async importUpload(file: File): Promise<ImportUploadResponse> {
    await delay(900);
    return {
      importId: "imp-" + Date.now(),
      fileName: file.name,
      totalRows: 620,
      validRows: 597,
      invalidRows: 23,
      columnMappings: [
        { sourceColumn: "Item Name", targetField: "name", ambiguous: false },
        { sourceColumn: "Code", targetField: "sku", ambiguous: false },
        { sourceColumn: "Qty", targetField: null, ambiguous: true, options: ["currentStock", "unitsSold", "reorderLevel"] },
        { sourceColumn: "Rate", targetField: null, ambiguous: true, options: ["unitCost", "sellingPrice"] },
        { sourceColumn: "Supplier", targetField: "supplierName", ambiguous: false },
      ],
      invalidRowDetails: Array.from({ length: 6 }, (_, i) => ({
        rowNumber: 14 + i * 27,
        reason: i % 2 === 0 ? "Quantity is not a number" : "Unknown supplier name",
        values: { "Item Name": `Row item ${i + 1}`, Qty: i % 2 === 0 ? "ten" : "24", Supplier: i % 2 === 0 ? "Madurai Wholesale Traders" : "Unknown Traders" },
      })),
      preview: mockProducts.slice(0, 6).map((p) => ({
        "Item Name": p.name,
        Code: p.sku,
        Qty: String(p.currentStock),
        Rate: String(p.unitCost),
        Supplier: p.supplierName,
      })),
    };
  },

  async importConfirm(importId: string): Promise<ImportConfirmResponse> {
    await delay(800);
    return {
      importId,
      status: "partial",
      inserted: 412,
      updated: 185,
      skipped: 23,
      message: "597 rows imported. 23 rows skipped due to validation errors.",
    };
  },

  async importHistory(): Promise<ImportHistoryEntry[]> {
    await delay();
    return mockImportHistory;
  },

  async aiQuery(req: AiQueryRequest): Promise<AiAnswer> {
    await delay(900);
    const conversationId = req.conversationId ?? "conv-" + Date.now();
    const messageId = "msg-" + Date.now();
    const q = req.question.toLowerCase();

    if (q.includes("oil") || q.includes("எண்ணெய்")) {
      return {
        conversationId,
        messageId,
        answer: "எந்த எண்ணெய் பற்றி கேட்கிறீர்கள்?",
        language: "ta",
        status: "needs_clarification",
        clarificationOptions: [
          { label: "சூரியகாந்தி எண்ணெய் 1லி", value: "Sunflower Oil 1L" },
          { label: "நல்லெண்ணெய் 500மிலி", value: "Gingelly Oil 500ml" },
          { label: "தேங்காய் எண்ணெய் 500மிலி", value: "Coconut Oil 500ml" },
        ],
      };
    }
    if (q.includes("profit") || q.includes("லாபம்")) {
      return {
        conversationId,
        messageId,
        answer:
          "இந்த மாதம் மதிப்பிடப்பட்ட மொத்த லாபம் ₹1,86,400. பால் பொருட்கள் பிரிவு அதிக பங்கு அளிக்கிறது.",
        language: "ta",
        status: "answered",
        isEstimate: true,
        dataReferences: [
          {
            source: "analytics.profit_summary",
            context: "1–16 Aug 2026 · cost basis: last purchase price",
            values: [
              { label: "Revenue", value: "₹12,46,900" },
              { label: "Cost of goods", value: "₹10,60,500" },
              { label: "Estimated profit", value: "₹1,86,400" },
            ],
          },
        ],
      };
    }
    if (q.includes("2019") || q.includes("last year")) {
      return {
        conversationId,
        messageId,
        answer: "இந்த காலகட்டத்திற்கு போதுமான தரவு இல்லை. தயவுசெய்து வேறு தேதி வரம்பை தேர்ந்தெடுக்கவும்.",
        language: "ta",
        status: "insufficient_data",
      };
    }
    return {
      conversationId,
      messageId,
      answer:
        "இன்று மொத்த விற்பனை ₹48,250. நேற்றை விட 6.4% அதிகம். அதிகம் விற்பனையானது பால் 500மிலி.",
      language: req.language,
      status: "answered",
      dataReferences: [
        {
          source: "analytics.daily_sales",
          context: "16 Aug 2026 · 00:00–06:30 IST",
          table: {
            columns: ["Product", "Units", "Revenue"],
            rows: [
              ["பால் 500மிலி", 182, "₹6,370"],
              ["இட்லி அரிசி 10கிலோ", 24, "₹11,280"],
              ["சூரியகாந்தி எண்ணெய் 1லி", 41, "₹7,585"],
            ],
          },
        },
      ],
    };
  },

  async voiceQuery(question: string): Promise<VoiceQueryResponse> {
    const answer = await mockApi.aiQuery({ question, language: "ta" });
    return { ...answer, transcript: question, detectedLanguage: "ta", audioUrl: null };
  },

  async reportDefinitions(): Promise<ReportDefinition[]> {
    await delay(200);
    return mockReportDefinitions;
  },

  async report(type: ReportType): Promise<ReportPreview> {
    await delay(700);
    const def = mockReportDefinitions.find((d) => d.type === type)!;
    return {
      type,
      title: def.title,
      context: "1–16 Aug 2026 · generated 16 Aug 2026 06:30 IST",
      columns: ["Product", "Category", "Stock", "Value (₹)"],
      rows: mockProducts.slice(0, 12).map((p) => [p.name, p.category, p.currentStock, p.stockValue]),
      downloadUrl: "#mock-download",
    };
  },
};
