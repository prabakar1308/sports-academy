export const SWITCH_LOADER = "[generic] SWITCH_LOADER";
export const VALIDATE_LOGIN = "[generic] VALIDATE_LOGIN";
export const VALIDATE_LOGIN_SUCCESS = "[generic] VALIDATE_LOGIN_SUCCESS";
export const LOGOUT_ACTION = "[generic] LOGOUT_ACTION";

export const switchProgressLoader = (status) => {
  return {
    type: SWITCH_LOADER,
    payload: status,
  };
};

export const validateLogin = (data) => {
  return {
    type: VALIDATE_LOGIN,
    payload: data,
  };
};

export const validateLoginSuccess = (data) => {
  return {
    type: VALIDATE_LOGIN_SUCCESS,
    payload: data,
  };
};

export const logoutAction = () => {
  return {
    type: LOGOUT_ACTION,
  };
};
