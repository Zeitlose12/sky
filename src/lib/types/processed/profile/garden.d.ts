import type { ProcessedSkyBlockItem, Skill } from "$types/global";

export type Garden = {
  level: Skill;
  visitors: {
    visited: number;
    completed: number;
    uniqueVisitors: number;
    visitors: Record<
      string,
      {
        visited: number;
        completed: number;
        unique: number;
        maxUnqiue: number;
      }
    >;
  };
  cropMilestones: {
    name: string;
    texture: string;
    level: skill;
  }[];
  cropUpgrades: {
    name: string;
    texture: string;
    level: skill;
  }[];
  composter: Record<string, number>;
  plot: ProcessedSkyBlockItem[];
};
