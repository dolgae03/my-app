"use client";

import { ConfirmationModal } from "./ConfirmationModal";

export function ConfirmApplyDialog({
  open,
  payload,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  payload: any;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ConfirmationModal
      open={open}
      title="변경 사항 확인"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </ConfirmationModal>
  );
}