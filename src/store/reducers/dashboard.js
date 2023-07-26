import * as genericActions from "../actions/dashboard";

const initialState = {
  progressLoader: false,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case genericActions.SWITCH_LOADER:
      return {
        ...state,
        progressLoader: action.payload,
      };
    default:
      return state;
  }
};
export default dashboardReducer;
