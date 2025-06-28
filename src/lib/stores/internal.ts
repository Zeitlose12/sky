import { sections } from "$lib/sections/constants";
import type { SectionName } from "$lib/sections/types";
import { api } from "$lib/shared/api";
import { sectionOrderPreferences } from "$lib/stores/preferences";
import type { ProcessedSkyBlockItem, ProcessedSkyblockPet } from "$types/global";
import type { ItemV2 } from "$types/statsv2";
import { createQuery, type CreateQueryResult } from "@tanstack/svelte-query";
import type { Snippet } from "svelte";
import { get, writable } from "svelte/store";

export const tabValue = writable<SectionName>(get(sectionOrderPreferences)[0].name || sections[0].name);
export const showItem = writable<boolean>(false);
export const showItemTooltip = writable<boolean>(false);
export const tooltipAnchor = writable<HTMLElement>(null!);
export const itemContent = writable<ProcessedSkyBlockItem | ProcessedSkyblockPet | undefined>();
export const isLoadingItem = writable<boolean>(false);

export const content = writable<Snippet | undefined>(undefined);

export function getItemQuery(pieceUUID: ItemV2["uuid"], enabled: boolean = false): CreateQueryResult<ItemV2, Error> {
  const query = createQuery<ItemV2>({
    enabled,
    queryKey: ["item", pieceUUID],
    queryFn: () => api(fetch).getItem(pieceUUID)
  });

  query.subscribe((run) => {
    if (run.isLoading) {
      isLoadingItem.set(true);
    } else {
      isLoadingItem.set(false);
    }

    if (run.isSuccess && run.data) {
      if (run.data.containsItems) return;
      itemContent.set(run.data);
    }
  });

  return query;
}
