import type { ParamMatcher } from "@sveltejs/kit";

export const isProfileId = ((param) => {
  return (param.length === 32 || param.length === 36) && /^[a-fA-F0-9]+$/.test(param);
}) satisfies ParamMatcher;

export const match = isProfileId;
