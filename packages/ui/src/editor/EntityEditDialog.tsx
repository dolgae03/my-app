"use client";

import { useEffect, useState } from "react";
import { TextFieldEditor } from "./TextFieldEditor";
import { StringArrayFieldEditor } from "./StringArrayFieldEditor";
import { DictFieldEditor } from "./DictFieldEditor";
import { SearchAddEditor } from "./SearchEditor";

type FieldKind = "text" | "stringArray" | "dict" | "searchMulti";

type FieldConfig = {
  key: string;         // ex) "drug_name", "drug_synonym"
  label: string;       // 표시용 라벨
  kind: FieldKind;
};

type SearchConfig<T> = {
  search: (query: string) => Promise<T[]>;
  getOptionId: (opt: T) => string;
  getOptionLabel: (opt: T) => string;
};


type EntityEditDialogProps = {
  open: boolean;
  title?: string;
  item: any | null;             // 실제 타입은 상위에서 알고 있음
  fields: FieldConfig[];
  searchConfigs?: Record<string, SearchConfig<any>>;
  onSave: (updated: any) => void;
  onCancel: () => void;
};

export function EntityEditDialog({
  open,
  title,
  item,
  fields,
  searchConfigs,
  onSave,
  onCancel,
}: EntityEditDialogProps) {
  const [draft, setDraft] = useState<any | null>(item);

  useEffect(() => {
    setDraft(item);
  }, [item]);

  if (!open || !draft) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {title ?? "Edit Entity"}
        </h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {fields.map((field) => {
            const value = draft[field.key];

            if (field.kind === "text") {
              return (
                <TextFieldEditor
                  key={field.key}
                  label={field.label}
                  value={value ?? ""}
                  onChange={(v) =>
                    setDraft((prev: any) => ({
                      ...prev,
                      [field.key]: v,
                    }))
                  }
                />
              );
            }

            if (field.kind === "stringArray") {
              const arr: string[] = Array.isArray(value) ? value : [];
              return (
                <StringArrayFieldEditor
                  key={field.key}
                  label={field.label}
                  value={arr}
                  onChange={(next) =>
                    setDraft((prev: any) => ({
                      ...prev,
                      [field.key]: next,
                    }))
                  }
                />
              );
            }

            if (field.kind === "dict") {
              const obj: Record<string, string> =
                value && typeof value === "object" && !Array.isArray(value)
                  ? value
                  : {};
              return (
                <DictFieldEditor
                  key={field.key}
                  label={field.label}
                  value={obj}
                  onChange={(next) =>
                    setDraft((prev: any) => ({
                      ...prev,
                      [field.key]: next,
                    }))
                  }
                />
              );
            }

            if (field.kind === "searchMulti") {
              const cfg = searchConfigs?.[field.key];
              if (!cfg) return null;  // 혹은 경고

              const arr = Array.isArray(value) ? value : [];

              return (
                <SearchAddEditor
                  key={field.key}
                  label={field.label}
                  value={arr}
                  onChange={(next) =>
                    setDraft((prev: any) => ({
                      ...prev,
                      [field.key]: next,
                    }))
                  }
                  search={cfg.search}
                  getOptionId={cfg.getOptionId}
                  getOptionLabel={cfg.getOptionLabel}
                />
              );
            }

            return null;
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-300"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => onSave(draft)}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}