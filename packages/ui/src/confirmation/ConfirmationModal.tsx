"use client";

export function ConfirmationModal({
  open,
  title = "확인",
  children,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-4">{children}</div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-300"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}