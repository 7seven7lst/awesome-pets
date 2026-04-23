import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PetListFilterCard } from "../components/pet-list/PetListFilterCard";
import { PetListHeader } from "../components/pet-list/PetListHeader";
import { PetListResults } from "../components/pet-list/PetListResults";
import { usePetList } from "../hooks/usePetList";
import { stack } from "../lib/ui-styles";
import type { AnimalType } from "../types";

export function PetListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const animalType = (searchParams.get("animalType") ?? "") as AnimalType | "";

  const [nameDraft, setNameDraft] = useState(query);
  const { pets, listMeta, loading, error, setPage } = usePetList({ query, animalType });

  useEffect(() => {
    setNameDraft(query);
  }, [query]);

  function mergeParams(mutate: (n: URLSearchParams) => void) {
    const n = new URLSearchParams(searchParams);
    mutate(n);
    setSearchParams(n, { replace: true });
  }

  return (
    <div className={stack}>
      <PetListHeader />
      <PetListFilterCard
        nameDraft={nameDraft}
        onNameDraftChange={setNameDraft}
        onSearchSubmit={(e) => {
          e.preventDefault();
          const trimmed = nameDraft.trim();
          mergeParams((n) => {
            if (trimmed) n.set("query", trimmed);
            else n.delete("query");
          });
        }}
        animalType={animalType}
        onAnimalTypeChange={(v) => {
          mergeParams((n) => {
            if (v) n.set("animalType", v);
            else n.delete("animalType");
          });
        }}
      />
      <PetListResults pets={pets} listMeta={listMeta} loading={loading} error={error} onPageChange={setPage} />
    </div>
  );
}
