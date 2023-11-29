interface ResponsePlaceDetail {
  html_attributions: any;
  result: DataPlaceDetailResult;
  status: DataStatusPlaceDetail;
}

type DataStatusPlaceDetail =
  | "OK" //indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned
  | "ZERO_RESULTS" //indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.
  | "OVER_DAILY_LIMIT" //The API key is missing or invalid, Billing has not been enabled on your account, A self-imposed usage cap has been exceeded, The provided method of payment is no longer valid (for example, a credit card has expired).
  | "OVER_QUERY_LIMIT" //indicates that you are over your quota.
  | "REQUEST_DENIED" //indicates that your request was denied.
  | "INVALID_REQUEST" //generally indicates that the query (address, components or latlng) is missing.
  | "UNKNOWN_ERROR"; // indicates that the request could not be processed due to a server error. The request may succeed if you try again.

interface DataPlaceDetailResult {
  address_components: DataPlaceDetailResultAddressComponents[];
  adr_address: string;
  business_status: string;
  current_opening_hours: DataPlaceDetailResultCurrentOpeningHours;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: DataPlaceDetailResultGeometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  international_phone_number: string;
  name: string;
  opening_hours: DataPlaceDetailResultOpeningHours;
  photos: DataPlaceDetailResultPhotos[];
  place_id: string;
  plus_code: DataPlaceDetailPlusCode;
  rating: number;
  reference: string;
  reviews: DataPlaceDetailResultReviews[];
  types: string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
  wheelchair_accessible_entrance: boolean;
}

interface DataPlaceDetailResultAddressComponents {
  long_name: string;
  short_name: string;
  types: string[];
}

interface DataPlaceDetailResultCurrentOpeningHours {
  open_now: boolean;
  periods: DataPlaceDetailResultCurrentOpeningHoursPeriods[];
  weekday_text: string[];
}

interface DataPlaceDetailResultCurrentOpeningHoursPeriods {
  close: DataPlaceDetailResultCurrentOpeningHoursPeriodsCloseOpen;
  open: DataPlaceDetailResultCurrentOpeningHoursPeriodsCloseOpen;
}

interface DataPlaceDetailResultCurrentOpeningHoursPeriodsCloseOpen {
  date: string;
  day: number;
  time: string;
}

interface DataCoordinate {
  lat: number;
  lng: number;
}
interface DataCoordinateCompass {
  northeast: DataCoordinate;
  southwest: DataCoordinate;
}

interface DataPlaceDetailResultGeometry {
  location: DataCoordinate;
  viewport: DataCoordinateCompass;
}

interface DataPlaceDetailResultOpeningHours {
  open_now: boolean;
  periods: DataPlaceDetailResultOpeningHoursPeriods[];
  weekday_text: string[];
}

interface DataPlaceDetailResultOpeningHoursPeriods {
  close: DataPlaceDetailResultOpeningHoursPeriodsCloseOpen;
  open: DataPlaceDetailResultOpeningHoursPeriodsCloseOpen;
}

interface DataPlaceDetailResultOpeningHoursPeriodsCloseOpen {
  day: number;
  time: strting;
}

interface DataPlaceDetailResultPhotos {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface DataPlaceDetailPlusCode {
  compound_code: string;
  global_code: string;
}

interface DataPlaceDetailResultReviews {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export type {
  ResponsePlaceDetail,
  DataStatusPlaceDetail,
  DataPlaceDetailResult,
  DataPlaceDetailResultCurrentOpeningHoursPeriods,
};
