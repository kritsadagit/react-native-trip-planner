import { StatusRequest } from "../status";

interface ResponseFriendList {
  result: boolean;
  msg: string;
  data: DataFriendList[];
}

interface DataFriendList {
  _id: string;
  user_id: string;
  friends_list: DataFriendsList[];
}

interface DataFriendsList {
  friend_id: string;
  user_data: {
    photo: string;
    givenName: string;
    familyName: string;
    email: string;
    name: string;
    id: string;
  };
  _id: string;
  requester_id: string;
  receiver_id: string;
  status_request: StatusRequest;
}

export type { ResponseFriendList, DataFriendList, DataFriendsList };
