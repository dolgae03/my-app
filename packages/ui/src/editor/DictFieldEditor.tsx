

type DictFieldEditorProps = {
  label: string;
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
};

export function DictFieldEditor({
  label,
  value,
  onChange,
}: DictFieldEditorProps) {
  const entries = Object.entries(value ?? {});

  const handleValueChange = (idx: number, newVal: string) => {
    if (!entries[idx]) return;
    const [k] = entries[idx];
    const nextEntries = [...entries];
    nextEntries[idx] = [k, newVal];

    const nextObj: Record<string, string> = {};
    for (const [key, val] of nextEntries) {
      nextObj[key] = val;
    }
    onChange(nextObj);
  };

  return (
    <div className="border rounded p-3">
      <div className="text-xs font-semibold text-gray-500 mb-2">
        {label}
      </div>

      <div className="space-y-2">
        {entries.length === 0 && (
          <div className="text-xs text-gray-400">
            (아직 key/value가 없습니다)
          </div>
        )}

        {entries.map(([k, v], idx) => (
          <div
            key={idx}
            className="flex gap-2 items-center"
          >
            {/* key: read-only */}
            <input
              className="border rounded px-2 py-1 w-1/3 text-xs bg-gray-100"
              value={k}
              disabled
            />

            {/* value: editable */}
            <input
              className="border rounded px-2 py-1 flex-1 text-xs"
              placeholder="value"
              value={v}
              onChange={(e) => handleValueChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}