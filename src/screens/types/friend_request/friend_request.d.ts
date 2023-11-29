interface ResponseFriendRequest {
  result: boolean;
  data: DataFriendRequest[];
  msg: string;
}

interface DataFriendRequest {
  _id: string;
  requester_id: string;
  receiver_id: string;
  status_request: number;
  createAt: string;
  requester_data?: RequesterData;
  receiver_data?: RequesterData;
}

interface RequesterData {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}

interface DataUserRecevier {
  photo: string;
  givenName: string;
  familyName: string;
  email: string;
  name: string;
  id: string;
}

interface ResponseFriendRequestsApprove {
  result: boolean;
  msg: string;
  data: DataFriendRequestApprove[];
}

interface DataFriendRequestApprove {
  _id: string;
  user_id: string;
  friends_list: Array<string>;
}

export type { ResponseFriendRequest, DataFriendRequest };
