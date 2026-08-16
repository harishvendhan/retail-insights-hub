import { useTranslation } from "react-i18next";
import { AlertCircle, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/api";
import { DataReferenceBlock } from "./DataReferenceBlock";

export function ChatBubble({
  message,
  onQuickReply,
}: {
  message: ChatMessage;
  onQuickReply?: (value: string) => void;
}) {
  const { t } = useTranslation();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          lang={message.language}
          className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[92%] flex-col sm:max-w-[80%]">
      <div className="rounded-2xl rounded-bl-md border bg-card p-4 shadow-card">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold tracking-wide text-brand uppercase">
            <Sparkles className="size-3" />
            {t("ai.aiInterpretation")}
          </span>
          {message.status === "insufficient_data" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning-foreground">
              <AlertCircle className="size-3" />
              {t("ai.insufficient")}
            </span>
          ) : null}
          {message.status === "needs_clarification" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-expiring-soft px-2 py-0.5 text-[11px] font-medium text-expiring">
              <HelpCircle className="size-3" />
              {t("ai.clarify")}
            </span>
          ) : null}
          {message.isEstimate ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              {t("common.estimate")}
            </span>
          ) : null}
        </div>

        <p lang={message.language} className="text-sm leading-relaxed whitespace-pre-line">
          {message.content}
        </p>

        {message.isEstimate ? (
          <p className="mt-2 text-[11px] text-muted-foreground">{t("ai.estimateNote")}</p>
        ) : null}

        {message.dataReferences?.map((ref, i) => <DataReferenceBlock key={i} reference={ref} />)}

        {message.clarificationOptions?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.clarificationOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onQuickReply?.(opt.value)}
                className={cn(
                  "rounded-full border border-brand/40 bg-brand-soft/60 px-3 py-1.5 text-xs font-medium text-brand",
                  "transition-colors hover:bg-brand-soft",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
