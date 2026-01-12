"use client";

import { useEffect, useState } from "react";

type SearchAddEditorProps<T> = {
  label: string;
  value: T[];                                    // 선택된 값들
  onChange: (next: T[]) => void;                // 선택 변경 콜백
  search: (query: string) => Promise<T[]>;      // 검색 함수 (API 연동은 상위에서)
  getOptionId: (opt: T) => string;              // 중복 체크용 ID
  getOptionLabel: (opt: T) => string;           // 화면에 보여줄 라벨
};

export function SearchAddEditor<T>({
  label,
  value,
  onChange,
  search,
  getOptionId,
  getOptionLabel,
}: SearchAddEditorProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // query가 바뀔 때마다 검색 (간단 버전: 디바운스 없이 바로)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    search(query)
      .then((res) => {
        if (cancelled) return;
        setResults(res);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("검색 중 오류가 발생했습니다.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, search]);

  const selectedIds = new Set(value.map((v) => getOptionId(v)));

  const handleAdd = (opt: T) => {
    const id = getOptionId(opt);
    if (selectedIds.has(id)) return;
    onChange([...value, opt]);
    setQuery("");      // 선택 후 검색창 비우기
    setResults([]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => getOptionId(v) !== id));
  };

  return (
    <div className="border rounded p-3">
      <div className="text-xs font-semibold text-gray-500 mb-2">
        {label}
      </div>

      {/* 선택된 아이템 chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((v) => {
          const id = getOptionId(v);
          const label = getOptionLabel(v);
          return (
            <span
              key={id}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-50 text-xs"
            >
              <span>{label}</span>
              <button
                type="button"
                className="text-[10px] text-blue-600 hover:text-blue-800"
                onClick={() => handleRemove(id)}
              >
                ✕
              </button>
            </span>
          );
        })}
        {value.length === 0 && (
          <span className="text-xs text-gray-400">
            (아직 선택된 항목이 없습니다)
          </span>
        )}
      </div>

      {/* 검색 input */}
      <input
        className="border rounded px-3 py-2 w-full text-sm"
        placeholder="검색어를 입력해서 항목을 추가하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* 검색 상태/결과 */}
      <div className="mt-2 max-h-40 overflow-y-auto text-sm">
        {loading && <div className="text-gray-500 text-xs">검색 중...</div>}
        {error && <div className="text-red-500 text-xs">{error}</div>}

        {!loading && !error && query && results.length === 0 && (
          <div className="text-gray-400 text-xs">
            검색 결과가 없습니다.
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <ul className="border rounded mt-1 divide-y">
            {results.map((opt) => {
              const id = getOptionId(opt);
              const label = getOptionLabel(opt);
              const disabled = selectedIds.has(id);

              return (
                <li
                  key={id}
                  className={`px-3 py-2 cursor-pointer text-xs hover:bg-gray-50 ${
                    disabled ? "opacity-50 cursor-default" : ""
                  }`}
                  onClick={() => !disabled && handleAdd(opt)}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}