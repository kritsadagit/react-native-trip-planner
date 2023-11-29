interface ResponseFriendRequestsApprove {
  result: boolean;
  msg: string;
  data: DataFriendRequestsApprove;
}

interface DataFriendRequestsApprove {
  user_id: string;
  friends_list: Array<string>;
  _id: string;
}

export type { ResponseFriendRequestsApprove };
