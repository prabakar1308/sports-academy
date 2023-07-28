import * as genericActions from "../actions/dashboard";

const initialState = {
  progressLoader: false,
  loginStatus: {
    success: false,
    fail: false,
  },
  roles: {
    isSuperAdmin: false,
    isAdmin: false,
    isUser: false,
  },
  clients: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case genericActions.SWITCH_LOADER:
      return {
        ...state,
        progressLoader: action.payload,
      };

    case genericActions.VALIDATE_LOGIN: {
      return {
        ...state,
        ...initialState,
        progressLoader: true,
      };
    }
    case genericActions.VALIDATE_LOGIN_SUCCESS: {
      const { isSuperAdmin, data } = action.payload;
      const { isAdmin } = data && data.length > 0 ? data[0].isAdmin : false;
      if (data && data.length > 0) {
        sessionStorage.setItem("userDetails", JSON.stringify(action.payload));
        if (!isSuperAdmin) {
          sessionStorage.setItem(
            "client",
            JSON.stringify({
              ...data[0],
            })
          );
        }
      }
      return {
        ...state,
        progressLoader: false,
        roles: {
          ...state.roles,
          isSuperAdmin,
          isAdmin: isSuperAdmin || isAdmin,
          isUser: isSuperAdmin || isAdmin || !isAdmin,
        },
        loginStatus: {
          ...state.loginStatus,
          success: data && data.length > 0,
          fail: !data || (data && data.length === 0),
        },
        clients: data,
      };
    }
    case genericActions.LOGOUT_ACTION:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
export default dashboardReducer;
