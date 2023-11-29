import { User } from "@react-native-google-signin/google-signin";

interface ResponseUsers {
  result: boolean;
  data: DataGoogleSignData;
  msg: string;
}

interface DataGoogleSignData {
  user_data: {
    idToken: string;
    scopes: Array<string>;
    serverAuthCode: string;
    user: User;
  };
  createAt: string;
  updateAt?: string;
  _id: string;
}

export type { ResponseUsers, DataGoogleSignData };
