interface ResponseGeolocation {
  result: boolean;
  msg: string;
  data: DataGeolocation;
}

interface DataGeolocation {
  _id: string;
  user_id: string;
  lat: string;
  lon: string;
}

export type { ResponseGeolocation };
