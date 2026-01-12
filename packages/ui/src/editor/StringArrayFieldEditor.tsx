import { useState } from "react";

type StringArrayFieldEditorProps = {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
};

export function StringArrayFieldEditor({
  label,
  value,
  onChange,
}: StringArrayFieldEditorProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...value, v]);
    setInput("");
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="border rounded p-3">
      <div className="text-xs font-semibold text-gray-500 mb-2">
        {label}
      </div>

      {/* tag chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              className="text-xs text-red-500 hover:text-red-700"
              onClick={() => handleRemove(idx)}
            >
              ✕
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <span className="text-xs text-gray-400">
            (아직 항목이 없습니다)
          </span>
        )}
      </div>

      {/* input + 추가 */}
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1 text-sm"
          placeholder="새 항목 입력 후 Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          className="px-3 py-1 rounded bg-gray-200 text-sm"
          onClick={handleAdd}
        >
          추가
        </button>
      </div>
    </div>
  );
}