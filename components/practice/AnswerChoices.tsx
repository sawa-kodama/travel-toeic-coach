import type { Choice } from "@/types/question";
import { cn } from "@/lib/utils";

export function AnswerChoices({
  choices,
  selectedId,
  answerId,
  answered,
  onSelect,
}: {
  choices: Choice[];
  selectedId?: Choice["id"];
  answerId: Choice["id"];
  answered: boolean;
  onSelect: (id: Choice["id"]) => void;
}) {
  return (
    <div className="grid gap-3">
      {choices.map((choice) => {
        const selected = selectedId === choice.id;
        const correct = answered && choice.id === answerId;
        const wrong = answered && selected && choice.id !== answerId;
        return (
          <button
            key={choice.id}
            type="button"
            onClick={() => onSelect(choice.id)}
            disabled={answered}
            className={cn(
              "flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-white p-4 text-left text-sm font-bold text-slate-800 shadow-sm",
              selected && "border-brand-500 bg-brand-50 ring-4 ring-brand-100",
              correct && "border-emerald-500 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-100",
              wrong && "border-rose-500 bg-rose-50 text-rose-800 ring-4 ring-rose-100"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600",
                selected && "bg-brand-600 text-white",
                correct && "bg-emerald-600 text-white",
                wrong && "bg-rose-600 text-white"
              )}
            >
              {choice.id}
            </span>
            <span className="leading-6">{choice.text}</span>
          </button>
        );
      })}
    </div>
  );
}
