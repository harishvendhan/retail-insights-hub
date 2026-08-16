import { useTranslation } from "react-i18next";
import { Database } from "lucide-react";
import type { DataReference } from "@/types/api";

/**
 * Raw data the AI answer was grounded in. Visually distinct from the AI's
 * natural-language interpretation on purpose.
 */
export function DataReferenceBlock({ reference }: { reference: DataReference }) {
  const { t } = useTranslation();
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border/80 bg-data text-data-foreground">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-3 py-2">
        <Database className="size-3.5" />
        <span className="text-[11px] font-semibold tracking-wide uppercase">
          {t("ai.dataReference")}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{reference.source}</span>
      </div>
      <div className="px-3 py-2.5">
        {reference.values ? (
          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {reference.values.map((v) => (
              <div key={v.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-xs text-muted-foreground">{v.label}</dt>
                <dd className="tabular text-sm font-medium">{v.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {reference.table ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  {reference.table.columns.map((c) => (
                    <th key={c} className="py-1.5 pr-4 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reference.table.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border/60">
                    {row.map((cell, j) => (
                      <td key={j} className="tabular py-1.5 pr-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="mt-2 text-[11px] text-muted-foreground">{reference.context}</p>
      </div>
    </div>
  );
}
