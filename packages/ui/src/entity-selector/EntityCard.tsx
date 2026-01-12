"use client";

export function EntityCard({
  title,
  subtitle,
  tags = [],
  createdAt,
  visualState = "normal",
  onClick,
}: {
  title: string;
  subtitle?: string;
  tags?: string[];
  createdAt?: string;
  visualState?: "normal" | "integration-target" | "integration-child" | "delete" | "update";
  onClick?: () => void;
}) {
  let bgClass = "bg-white border-gray-300";

  if (visualState === "integration-target") {
    bgClass = "bg-blue-600 text-white border-blue-700";
  } else if (visualState === "integration-child") {
    bgClass = "bg-blue-100 text-blue-800 border-blue-300";
  } else if (visualState === "delete") {
    bgClass = "bg-red-200 text-red-700 border-red-500";
  } else if (visualState === "update") {
    bgClass = "bg-green-100 text-green-800 border-yellow-300";
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded cursor-pointer shadow-sm hover:shadow-md transition ${bgClass}`}
    >
      <p className="font-semibold text-lg">{title}</p>

      {subtitle && (
        <p className="text-sm mt-1">{subtitle}</p>
      )}

      {tags.length > 0 && (
        <p className="text-sm mt-1">
          <strong>Tags:</strong> {tags.join(", ")}
        </p>
      )}

      {createdAt && (
        <p className="text-xs opacity-70 mt-2">
          Added: {new Date(createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}