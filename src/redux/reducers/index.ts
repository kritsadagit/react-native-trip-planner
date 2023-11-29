import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";

export default combineReducers({
  userReducer,
});

export interface RootState {
  userReducer: ReturnType<typeof userReducer>;
}
