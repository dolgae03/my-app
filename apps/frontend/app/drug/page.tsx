"use client";

import { useState } from "react";

import {
  EntitySelectorView,
  EntityCard,
} from "@workspace/ui/entity-selector";

import { EntityEditDialog } from "@workspace/ui/editor"; // 새 공용 컴포넌트

import { ConfirmApplyDialog } from "@workspace/ui/confirmation";  // 변경사항 확인 모달

type Drug = {
  drug_id: string;
  drug_name: string;
  drug_synonym: string[];
  created_at: string;
};

// 초기 mock 생성 함수
function makeMock(): Drug[] {
  return Array.from({ length: 150 }).map((_, i) => {
    const idNum = (i + 1).toString().padStart(3, "0");

    return {
      drug_id: `DR${idNum}`,
      drug_name: `Drug ${i + 1}`,
      drug_info : {
        description: `This is a description for Drug ${i + 1}.`,
        manufacturer: `Pharma Co. ${((i % 5) + 1)}`,
        dosage: `${(Math.floor(Math.random() * 5) + 1) * 10} mg`,
      },
      drug_synonym: [
        `Synonym ${i + 1}-A`,
        ...(i % 3 === 0 ? [`Synonym ${i + 1}-B`] : []),
      ],
      created_at: new Date(
        2025,
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      ).toISOString(),
    };
  });
}

export default function DrugPage() {
  // 🔹 이제 mock이 아니라 상태로 관리
  const [drugs, setDrugs] = useState<Drug[]>(() => makeMock());

  // bulk integration/delete용 payload
  const [payload, setPayload] = useState<any | null>(null);

  // update 모드에서 선택된 카드
  const [editTarget, setEditTarget] = useState<Drug | null>(null);
  const [editName, setEditName] = useState("");
  const [editSynonyms, setEditSynonyms] = useState("");

  return (
    <div className="flex flex-col h-full gap-6">
      <h1 className="text-3xl font-bold mb-6">Drugs</h1>

      <EntitySelectorView<Drug>
        items={drugs}
        getId={(d) => d.drug_id}
        renderCard={(d, visualState, onClick) => {
          return (
            <EntityCard
              title={d.drug_name}
              subtitle={d.drug_id}
              tags={d.drug_synonym}
              createdAt={d.created_at}
              visualState={visualState}
              onClick={onClick}
            />
          );
        }}
        onApply={(jsonPayload) => setPayload(jsonPayload)}
        onUpdate={(drug) => {
          setEditTarget(drug);
          setEditName(drug.drug_name);
          setEditSynonyms(drug.drug_synonym.join(", "));
        }}
      />

      {/* bulk 변경사항 모달 */}
      <ConfirmApplyDialog
        open={!!payload}
        payload={payload}
        onCancel={() => setPayload(null)}
        onConfirm={() => {
          console.log("최종 반영:", payload);
          // 여기서 실제로 API 호출하면 됨


          setPayload(null);
        }}
      />


      {/* 🔹 공용 EntityEditDialog 사용 */}
      <EntityEditDialog
        open={!!editTarget}
        title={editTarget ? `${editTarget.drug_id} 수정` : "수정"}
        item={editTarget}
        fields={[
          { key: "drug_name", label: "Drug Name", kind: "text" },
          { key: "drug_info", label: "Drug Info", kind: "dict" },
          { key: "drug_synonym", label: "Synonyms", kind: "stringArray" },
          { key: "clinical_trial", label: "Related Compounds", kind: "searchMulti" },
          { key: "fda", label: "Related Compounds", kind: "searchMulti" },
          { key: "company", label: "Related Compounds", kind: "searchMulti" },
        ]}
        searchConfigs={{
          clinical_trial: {
            search: async (q: string) => {
              // const res = await fetch(`/api/compound/search?q=${encodeURIComponent(q)}`);
              // return await res.json(); // [{ id, name, ... }]
              return [
                { id: "C001", name: "Compound Alpha" },
                { id: "C002", name: "Compound Beta" },
                { id: "C003", name: "Compound Gamma" },
              ].filter((c) =>
                c.name.toLowerCase().includes(q.toLowerCase())
              );
            },
            getOptionId: (c: any) => c.id,
            getOptionLabel: (c: any) => c.name,
          },
          fda: {
            search: async (q: string) => {
              // const res = await fetch(`/api/compound/search?q=${encodeURIComponent(q)}`);
              // return await res.json(); // [{ id, name, ... }]
              return [
                { id: "C001", name: "Compound Alpha" },
                { id: "C002", name: "Compound Beta" },
                { id: "C003", name: "Compound Gamma" },
              ].filter((c) =>
                c.name.toLowerCase().includes(q.toLowerCase())
              );
            },
            getOptionId: (c: any) => c.id,
            getOptionLabel: (c: any) => c.name,
          },
          company: {
            search: async (q: string) => {
              // const res = await fetch(`/api/compound/search?q=${encodeURIComponent(q)}`);
              // return await res.json(); // [{ id, name, ... }]
              return [
                { id: "C001", name: "Compound Alpha" },
                { id: "C002", name: "Compound Beta" },
                { id: "C003", name: "Compound Gamma" },
              ].filter((c) =>
                c.name.toLowerCase().includes(q.toLowerCase())
              );
            },
            getOptionId: (c: any) => c.id,
            getOptionLabel: (c: any) => c.name,
          },
        }}
        onCancel={() => setEditTarget(null)}
        onSave={(updated) => {
          const casted = updated as Drug;

          setDrugs((prev) =>
            prev.map((d) =>
              d.drug_id === casted.drug_id ? casted : d
            )
          );

          // setUpdatedIds((prev) =>
          //   prev.includes(casted.drug_id)
          //     ? prev
          //     : [...prev, casted.drug_id]
          // );

          console.log("단일 카드 수정:", casted);
          setEditTarget(null);
        }}
      />
    </div>
  );
}