import { Action } from "@reduxjs/toolkit";
import { USER } from "../constants";
import { User } from "@react-native-google-signin/google-signin";

interface UserAction extends Action {
  type: typeof USER;
  payload: object;
}

interface InitialState {
  user_data: User | object | any;
}

type Actions = UserAction;

const initialState: InitialState = {
  user_data: {},
};

export default (state = initialState, action: Actions) => {
  switch (action.type) {
    case USER:
      return { ...state, user_data: action.payload };

    default:
      return state;
  }
};
