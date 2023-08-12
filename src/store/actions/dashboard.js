export const SWITCH_LOADER = "[generic] SWITCH_LOADER";
export const CLEAR_REGISTER = "[generic] CLEAR_REGISTER";
export const VALIDATE_LOGIN = "[generic] VALIDATE_LOGIN";
export const VALIDATE_LOGIN_SUCCESS = "[generic] VALIDATE_LOGIN_SUCCESS";
export const VALIDATE_LOGIN_ERROR = "[generic] VALIDATE_LOGIN_ERROR";
export const REGISTER_CLIENT = "[generic] REGISTER_CLIENT";
export const REGISTER_CLIENT_SUCCESS = "[generic] REGISTER_CLIENT_SUCCESS";
export const REGISTER_CLIENT_ERROR = "[generic] REGISTER_CLIENT_ERROR";
export const DELETE_CLIENT = "[generic] DELETE_CLIENT";
export const DELETE_CLIENT_SUCCESS = "[generic] DELETE_CLIENT_SUCCESS";
export const DELETE_CLIENT_ERROR = "[generic] DELETE_CLIENT_ERROR";
export const LOGOUT_ACTION = "[generic] LOGOUT_ACTION";

export const switchProgressLoader = (status) => {
  return {
    type: SWITCH_LOADER,
    payload: status,
  };
};

export const clearRegister = () => {
  return {
    type: CLEAR_REGISTER,
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

export const validateLoginError = () => {
  return {
    type: VALIDATE_LOGIN_ERROR,
  };
};

export const logoutAction = () => {
  return {
    type: LOGOUT_ACTION,
  };
};

export const registerClient = (data) => {
  return {
    type: REGISTER_CLIENT,
    payload: data,
  };
};

export const registerClientSuccess = (data) => {
  return {
    type: REGISTER_CLIENT_SUCCESS,
    payload: data,
  };
};

export const registerClientError = () => {
  return {
    type: REGISTER_CLIENT_ERROR,
  };
};

export const deleteClient = (data) => {
  return {
    type: DELETE_CLIENT,
    payload: data,
  };
};

export const deleteClientSuccess = (data) => {
  return {
    type: DELETE_CLIENT_SUCCESS,
    payload: data,
  };
};

export const deleteClientError = () => {
  return {
    type: DELETE_CLIENT_ERROR,
  };
};
