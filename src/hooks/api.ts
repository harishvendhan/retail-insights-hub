import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AiQueryRequest, ProductQuery, ReportType, SalesQuery } from "@/types/api";

export function useDashboardSummary() {
  return useQuery({ queryKey: ["dashboard"], queryFn: () => api.dashboard() });
}

export function useProducts(filters: ProductQuery) {
  return useQuery({ queryKey: ["products", filters], queryFn: () => api.products(filters) });
}

export function useFilterOptions() {
  return useQuery({ queryKey: ["product-filters"], queryFn: () => api.filterOptions(), staleTime: 300_000 });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ["product", id], queryFn: () => api.product(id), enabled: !!id });
}

export function useSalesOverview(query: SalesQuery) {
  return useQuery({ queryKey: ["sales", query], queryFn: () => api.sales(query) });
}

export function useSuppliers() {
  return useQuery({ queryKey: ["suppliers"], queryFn: () => api.suppliers() });
}

export function useSupplier(id: string) {
  return useQuery({ queryKey: ["supplier", id], queryFn: () => api.supplier(id), enabled: !!id });
}

export function useImportHistory() {
  return useQuery({ queryKey: ["import-history"], queryFn: () => api.importHistory() });
}

export function useImportUpload() {
  return useMutation({ mutationFn: (file: File) => api.importUpload(file) });
}

export function useImportConfirm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { importId: string; mappings: Record<string, string> }) =>
      api.importConfirm(vars.importId, vars.mappings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["import-history"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAiQuery() {
  return useMutation({ mutationFn: (req: AiQueryRequest) => api.aiQuery(req) });
}

export function useVoiceQuery() {
  return useMutation({
    mutationFn: (vars: { transcript: string; conversationId?: string }) =>
      api.voiceQuery(vars.transcript, vars.conversationId),
  });
}

export function useReportDefinitions() {
  return useQuery({ queryKey: ["reports"], queryFn: () => api.reportDefinitions() });
}

export function useReportPreview(type: ReportType | null) {
  return useQuery({
    queryKey: ["report", type],
    queryFn: () => api.report(type as ReportType),
    enabled: !!type,
  });
}
