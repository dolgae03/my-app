type TextFieldEditorProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export function TextFieldEditor({ label, value, onChange }: TextFieldEditorProps) {
  return (
    <div className="border rounded p-3">
      <div className="text-xs font-semibold text-gray-500 mb-1">
        {label}
      </div>
      <input
        className="border rounded px-3 py-2 w-full"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}