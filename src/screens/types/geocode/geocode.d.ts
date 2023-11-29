interface ResponseGeocode {
  plus_code: DataGeocodePlusCode;
  results: DataGeocodeResults[];
  status: DataStatusGeocode;
}

type DataStatusGeocode =
  | "OK" //indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned
  | "ZERO_RESULTS" //indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.
  | "OVER_DAILY_LIMIT" //The API key is missing or invalid, Billing has not been enabled on your account, A self-imposed usage cap has been exceeded, The provided method of payment is no longer valid (for example, a credit card has expired).
  | "OVER_QUERY_LIMIT" //indicates that you are over your quota.
  | "REQUEST_DENIED" //indicates that your request was denied.
  | "INVALID_REQUEST" //generally indicates that the query (address, components or latlng) is missing.
  | "UNKNOWN_ERROR"; // indicates that the request could not be processed due to a server error. The request may succeed if you try again.

interface DataGeocodePlusCode {
  compound_code: string;
  global_code: string;
}

interface DataGeocodeResults {
  address_components: DataGeocodeResultAddressComponents[];
  formatted_address: string;
  geometry: DataGeocodeResultGeometry;
  place_id: string;
  plus_code: DataGeocodePlusCode;
  types: string[];
}

interface DataGeocodeResultAddressComponents {
  long_name: string;
  short_name: string;
  types: string[];
}

interface DataGeocodeResultGeometry {
  location: DataCoordinate;
  location_type: string;
  viewport: DataGeocodeResultGeometryViewport;
}

interface DataGeocodeResultGeometryViewport {
  northeast: DataCoordinate;
  southwest: DataCoordinate;
}

interface DataCoordinate {
  lat: number;
  lng: number;
}

export type { ResponseGeocode };
