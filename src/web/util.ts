import { LatLng } from 'leaflet';

export const latLngToPrettyStr = (latlng: LatLng): string => `lat: ${Number(latlng.lat).toFixed(4)}, lng: ${Number(latlng.lng).toFixed(4)}`;

export default {
    latLngToPrettyStr,
};
