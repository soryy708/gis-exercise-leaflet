import { GeoJSON } from 'leaflet';

export type GeoJsonWrapper = {
    name: string;
    leafletLayer: GeoJSON;
};
