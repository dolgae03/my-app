"use client";

import { useEntitySelectorCore } from "./useEntitySelectorCore";

export function EntitySelectorView<T>({
  items,
  getId,
  renderCard,
  onApply,
  onAdd,
  onUpdate, // ⭐ 추가: 개별 카드 수정 콜백
}: {
  items: T[];
  getId: (item: T) => string;
  renderCard: (
    item: T,
    visualState: string,
    onClick: () => void
  ) => React.ReactNode;
  onApply: (payload: any) => void;
  onAdd?: () => void;
  onUpdate?: (item: T) => void; // ⭐ 선택 카드 수정할 때 호출
}) {
  const {
    mode,
    changeMode,
    target,
    mergeList,
    deleteList,
    updatedList,

    query,
    setQuery,

    paginatedItems,
    page,
    totalPages,
    goPrev,
    goNext,

    toggleClick,
    selectAll,
    unselectAll,

    // ❌ 여기서 update 관련 걸 굳이 쓰지 않아도 됨
    // editTarget,
    // handleUpdateClick,
    // setEditTarget,
  } = useEntitySelectorCore(items, getId);

  return (
    <div className="space-y-6">
      {/* 모드 + Select All */}
      <div className="flex items-center gap-4">
        <button
          className={`px-4 py-2 rounded ${
            mode === "integrate" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => changeMode("integrate")}
        >
          Integration
        </button>

        <button
          className={`px-4 py-2 rounded ${
            mode === "delete" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => changeMode("delete")}
        >
          Delete
        </button>

        {/* ⭐ Update 모드 버튼 */}
        <button
          className={`px-4 py-2 rounded ${
            mode === "update" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => changeMode("update")}
        >
          Update
        </button>

        {/* 전체 선택 */}
        <button
          className="px-4 py-2 rounded bg-gray-300"
          onClick={selectAll}
        >
          Select All (page)
        </button>

        <button
          className="px-4 py-2 rounded bg-gray-300"
          onClick={unselectAll}
        >
          Unselect All (page)
        </button>

        {onAdd && (
          <button
            className="ml-auto px-4 py-2 rounded bg-green-600 text-white"
            onClick={onAdd}
          >
            + Add
          </button>
        )}
      </div>

      {/* 검색 */}
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          className="px-4 py-2 bg-gray-300"
          onClick={goPrev}
          disabled={page === 0}
        >
          Prev
        </button>

        <div>
          Page {page + 1} / {totalPages}
        </div>

        <button
          className="px-4 py-2 bg-gray-300"
          onClick={goNext}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* 카드 */}
      <div className="space-y-4">
        {paginatedItems.map((item) => {
          const id = getId(item);

          let visualState: string = "normal";

          if (mode === "integrate") {
            if (target && getId(target) === id)
              visualState = "integration-target";
            else if (mergeList.some((m) => getId(m) === id))
              visualState = "integration-child";
          }

          if (mode === "delete") {
            if (deleteList.some((d) => getId(d) === id))
              visualState = "delete";
          }

          // ⭐ update 모드일 때 카드 전체를 "update" 스타일로 줄 수도 있음
          if (mode === "update") {
            if (updatedList.some((u) => getId(u) === id))
                visualState = "update";
          }

          // ⭐ 클릭 로직: update 모드면 onUpdate, 아니면 기존 toggleClick
          const handleClick =
            mode === "update" && onUpdate
              ? () => {onUpdate(item); toggleClick(item);}
              : () => toggleClick(item);

          return renderCard(item, visualState, handleClick);
        })}
      </div>

      {/* Apply */}
      {<button
          className="mt-6 bg-black text-white px-4 py-2 rounded"
          onClick={() => {
            
            if (mode === "integrate"){
              const payload = {
                mode: "integration",
                target: target ? getId(target) : null,
                merge: mergeList.map((i) => getId(i)),
              };
              onApply(payload);
              return;
            }

            if (mode === "delete"){
              const payload = {
                mode: "delete",
                delete: deleteList.map((i) => getId(i)),
              };
              onApply(payload);
              return;
            }

            if (mode === "update"){
              const payload = {
                mode: "update",
                update: updatedList.map((i) => getId(i)),
              };
              onApply(payload);
              return;
            }
          }}
        >
          변경 사항 반영
        </button>
      }
    </div>
  );
}