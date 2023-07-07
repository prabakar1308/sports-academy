import cricketReducer from "./cricket";
import dashboardReducer from "./dashboard";
import { combineReducers } from "redux";
const allReducers = combineReducers({
  cricket: cricketReducer,
  dashboard: dashboardReducer,
});
export default allReducers;
