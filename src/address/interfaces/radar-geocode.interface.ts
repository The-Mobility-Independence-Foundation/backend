export interface IRadarGeocodeResponse {
  meta: IRadarGeocodeMeta;
  addresses: IRadarGeocodeAddress[];
}

export interface IRadarGeocodeMeta {
  code: number;
  param?: string;
  message?: string;
}

export interface IRadarGeocodeAddress {
  latitude: number;
  longitude: number;
  geometry: IRadarGeocodeGeometry;
  country: string;
  countryCode: string;
  countryFlag: string;
  county: string;
  confidence: 'exact' | 'interpolated' | 'fallback';
  borough?: string;
  city: string;
  number?: string;
  neighborhood?: string;
  postalCode: string;
  stateCode: string;
  state: string;
  street: string;
  layer: string;
  formattedAddress: string;
  addressLabel: string;
  timeZone: IRadarGeocodeTimeZone;
}

export interface IRadarGeocodeGeometry {
  type: string;
  coordinates: number[];
}

export interface IRadarGeocodeTimeZone {
  id: string;
  name: string;
  code: string;
  currentTime: string;
  utcOffset: number;
  dstOffset: number;
}
