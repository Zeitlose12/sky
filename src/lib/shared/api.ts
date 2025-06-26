import type { ItemsV2, ItemV2, StatsV2 } from "$types/statsv2";

export const api = (customFetch = fetch) => ({
  getProfile: async (ign: string, profile?: string): Promise<StatsV2 & { message?: string }> => {
    const response = await customFetch(`/api/v2/stats/${ign}${profile ? "/" + profile : ""}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch data - ${response.statusText}`);
    }
    const data = (await response.json()) as StatsV2 & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getItems: async (profileUUID: string): Promise<ItemsV2> => {
    const response = await customFetch(`/api/v2/items/${profileUUID}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch items - ${response.statusText}`);
    }
    const data = (await response.json()) as ItemsV2 & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getItem: async (itemUUID: string): Promise<ItemV2> => {
    const response = await customFetch(`/api/v2/item/${itemUUID}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch item - ${response.statusText}`);
    }
    const data = (await response.json()) as ItemV2 & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  }
});
