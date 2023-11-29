import { USER } from "../constants";
import { DataGoogleSignData } from "../../screens/types/users/users";

export const doSetUser = (payload: DataGoogleSignData) => ({
  type: USER,
  payload,
});
