import { sections } from "$lib/sections/constants";
import type { SectionID } from "$lib/sections/types";
import { persisted } from "svelte-persisted-store";

// First param `internalPreferences` is the local storage key.
// Second param is the initial value.
export const internalPreferences = persisted("internalPreferences", {
  hasSeenv2Toast: false
});

export const sectionOrderPreferences = persisted<SectionID[]>("sectionOrderPreferences", sections);
