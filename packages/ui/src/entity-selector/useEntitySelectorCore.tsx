"use client";

import { useState } from "react";

export type OperationMode = "none" | "integrate" | "delete" | "update";
// ... 기존 import 및 타입 동일

export function useEntitySelectorCore<T>(
  items: T[],
  getId: (item: T) => string
) {
  const [mode, setMode] = useState<OperationMode>("none");

  const [target, setTarget] = useState<T | null>(null);
  const [editTarget, setEditTarget] = useState<T | null>(null);
  const [mergeList, setMergeList] = useState<T[]>([]);
  const [deleteList, setDeleteList] = useState<T[]>([]);
  const [updatedList, setUpdatedList] = useState<T[]>([]);

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(0);
  const pageSize = 100;

  const filtered = items.filter((i) =>
    JSON.stringify(i).toLowerCase().includes(query.toLowerCase())
  );

  const startIndex = page * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const goNext = () => page < totalPages - 1 && setPage(page + 1);
  const goPrev = () => page > 0 && setPage(page - 1);

  const handleUpdateClick = (item: T) => {
    if (mode !== "update") return;   // update 모드일 때만 동작
    setEditTarget(item);             // 수정할 target 저장
  };

  const changeMode = (newMode: OperationMode) => {
    if (newMode === mode) {
      newMode = "none";
    }
    setMode(newMode);
    setTarget(null);
    setMergeList([]);
    setDeleteList([]);
    setUpdatedList([]);
  };

  // 개별 선택 로직
  const toggleClick = (item: T) => {
    const id = getId(item);

    if (mode === "integrate") {
      if (!target) {
        setTarget(item);
        return;
      }
      if (getId(target) === id) return;

      const exists = mergeList.some((m) => getId(m) === id);

      if (exists) {
        setMergeList((prev) => prev.filter((m) => getId(m) !== id));
      } else {
        setMergeList((prev) => [...prev, item]);
      }
      return;
    }

    if (mode === "delete") {
      const exists = deleteList.some((d) => getId(d) === id);

      if (exists) {
        setDeleteList((prev) => prev.filter((d) => getId(d) !== id));
      } else {
        setDeleteList((prev) => [...prev, item]);
      }
      return;
    }

    if (mode === "update") {
      const exists = updatedList.some((u) => getId(u) === id);

      if (!exists) {
        setUpdatedList((prev) => [...prev, item]);
      } 
      return;
    }
  };

  const selectAll = () => {
    if (mode === "integrate") {
      // target 없으면 첫 요소를 target으로
      if (!target) {
        const [first, ...rest] = paginatedItems;
        if (!first) return;

        setTarget(first);
        setMergeList(rest);
        return;
      }

      // target이 이미 있으면: 페이지 모든 item을 mergeList에 추가
      setMergeList(prev => {
        const existing = new Set(prev.map(i => getId(i)));
        const toAdd = paginatedItems.filter(
          item => getId(item) !== getId(target) && !existing.has(getId(item))
        );
        return [...prev, ...toAdd];
      });

      return;
    }

    if (mode === "delete") {
      setDeleteList(prev => {
        const existing = new Set(prev.map(i => getId(i)));
        const toAdd = paginatedItems.filter(
          item => !existing.has(getId(item))
        );
        return [...prev, ...toAdd];
      });
    }
  };

  const unselectAll = () => {
    if (mode === "integrate") {
      setMergeList(prev =>
        prev.filter(
          item => !paginatedItems.some(
            p => getId(p) === getId(item)
          )
        )
      );
      return;
    }

    if (mode === "delete") {
      setDeleteList(prev =>
        prev.filter(
          item => !paginatedItems.some(
            p => getId(p) === getId(item)
          )
        )
      );
      return;
    }
  };

  return {
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

    // // ⭐ Update mode 추가 요소
    // editTarget,
    // handleUpdateClick,
    // setEditTarget,
  };
}