export const SWITCH_LOADER = "[cricket] SWITCH_LOADER";

export const switchProgressLoader = (status) => {
  return {
    type: SWITCH_LOADER,
    payload: status,
  };
};
