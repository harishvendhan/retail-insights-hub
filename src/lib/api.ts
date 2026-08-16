import { mockApi } from "@/mocks/handlers";
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

const USE_MOCKS = (import.meta.env['VITE_USE_MOCKS'] ?? "true") !== "false";
const BASE_URL = import.meta.env['VITE_API_BASE_URL'] ?? "/api";

const TOKEN_KEY = "smkt.token";
const USER_KEY = "smkt.user";

export const authStorage = {
  get token() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  get user() {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as LoginResponse["user"]) : null;
  },
  save(res: LoginResponse) {
    window.localStorage.setItem(TOKEN_KEY, res.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  },
  clear() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = authStorage.token;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

function qs(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && v !== "all") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * Single API surface used by every React Query hook.
 * When VITE_USE_MOCKS is not "false" the typed mock layer answers instead of
 * the backend. Swapping to the live backend requires no component changes.
 */
export const api = {
  usingMocks: USE_MOCKS,

  login: (email: string, password: string): Promise<LoginResponse> =>
    USE_MOCKS
      ? mockApi.login(email)
      : request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  signup: (payload: { name: string; storeName: string; email: string; password: string }): Promise<LoginResponse> =>
    USE_MOCKS
      ? mockApi.login(payload.email)
      : request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),

  logout: (): Promise<void> =>
    USE_MOCKS ? Promise.resolve() : request("/auth/logout", { method: "POST" }),

  dashboard: (): Promise<DashboardSummary> =>
    USE_MOCKS ? mockApi.dashboard() : request("/analytics/dashboard"),

  products: (query: ProductQuery): Promise<Paginated<Product>> =>
    USE_MOCKS ? mockApi.products(query) : request(`/products${qs(query as Record<string, unknown>)}`),

  filterOptions: () =>
    USE_MOCKS
      ? mockApi.filterOptions()
      : request<{ categories: string[]; brands: string[]; suppliers: { id: string; name: string }[] }>(
          "/products/filters",
        ),

  product: (id: string): Promise<ProductDetail> =>
    USE_MOCKS ? mockApi.product(id) : request(`/products/${id}`),

  sales: (query: SalesQuery): Promise<SalesOverview> =>
    USE_MOCKS ? mockApi.sales(query) : request(`/sales${qs(query as Record<string, unknown>)}`),

  suppliers: (): Promise<Supplier[]> => (USE_MOCKS ? mockApi.suppliers() : request("/suppliers")),

  supplier: (id: string): Promise<SupplierDetail> =>
    USE_MOCKS ? mockApi.supplier(id) : request(`/suppliers/${id}`),

  importUpload: (file: File): Promise<ImportUploadResponse> => {
    if (USE_MOCKS) return mockApi.importUpload(file);
    const form = new FormData();
    form.append("file", file);
    return request("/import/upload", { method: "POST", body: form });
  },

  importConfirm: (importId: string, mappings: Record<string, string>): Promise<ImportConfirmResponse> =>
    USE_MOCKS
      ? mockApi.importConfirm(importId)
      : request("/import/confirm", { method: "POST", body: JSON.stringify({ importId, mappings }) }),

  importHistory: (): Promise<ImportHistoryEntry[]> =>
    USE_MOCKS ? mockApi.importHistory() : request("/import/history"),

  aiQuery: (req: AiQueryRequest): Promise<AiAnswer> =>
    USE_MOCKS ? mockApi.aiQuery(req) : request("/ai/query", { method: "POST", body: JSON.stringify(req) }),

  voiceQuery: (transcript: string, conversationId?: string): Promise<VoiceQueryResponse> => {
    if (USE_MOCKS) return mockApi.voiceQuery(transcript);
    return request("/voice/query", {
      method: "POST",
      body: JSON.stringify({ transcript, conversationId }),
    });
  },

  reportDefinitions: (): Promise<ReportDefinition[]> =>
    USE_MOCKS ? mockApi.reportDefinitions() : request("/reports"),

  report: (type: ReportType): Promise<ReportPreview> =>
    USE_MOCKS ? mockApi.report(type) : request(`/reports/${type}`),
};
