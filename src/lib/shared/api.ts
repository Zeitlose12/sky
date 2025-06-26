import type { Stats as StatsType } from "$lib/types/stats";

export const api = (customFetch = fetch) => ({
  getProfile: async (ign: string, profile?: string) => {
    const response = await customFetch(`/api/v2/stats/${ign}${profile ? "/" + profile : ""}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch data - ${response.statusText}`);
    }
    const data = (await response.json()) as StatsType & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getItems: async (profileUUID: string) => {
    const response = await customFetch(`/api/v2/items/${profileUUID}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch items - ${response.statusText}`);
    }
    const data = await response.json();
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getItem: async (itemUUID: string) => {
    const response = await customFetch(`/api/v2/item/${itemUUID}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch item - ${response.statusText}`);
    }
    const data = await response.json();
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  }
});
