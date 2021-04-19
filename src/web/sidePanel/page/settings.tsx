import React, { useState, useEffect } from 'react';
import L, { LatLng } from 'leaflet';
import mapService, { MapContext, ClickListener, MoveListener } from '../../service/map';
import FileInput from '../../components/fileInput';
import { latLngToPrettyStr } from '../../util';
import { GeoJsonWrapper } from '../geoJsonWrapper';

type SettingsPageProps = {
    isActive: boolean;
    mapContext: MapContext;
    geoJsons: GeoJsonWrapper[];
    setEditedGeoJson: (index: number) => void;
    setGeoJsons: (geoJsons: GeoJsonWrapper[] | ((prev: GeoJsonWrapper[]) => GeoJsonWrapper[])) => void;
};

const SettingsPage: React.FunctionComponent<SettingsPageProps> = (props: SettingsPageProps) => {
    const [measuringDistance, setMeasuringDistance] = useState<boolean>(false);
    const [distanceP1, setDistanceP1] = useState(null);
    const [distanceP2, setDistanceP2] = useState(null);
    const [measureDistanceLine, setMeasureDistanceLine] = useState(null);
    const [mouseCoords, setMouseCoords] = useState<LatLng>(null);

    const handleMouseMove: MoveListener = (ev) => {
        setMouseCoords(ev.latlng);
    };

    useEffect(() => {
        if (!props.mapContext) {
            return () => {};
        }

        mapService.addMoveListener(handleMouseMove, props.mapContext);

        return () => {
            mapService.removeMoveListener(handleMouseMove, props.mapContext);
        };
    }, [props.mapContext]);


    const handleClickMeasureDistance = () => {
        setDistanceP1(null);
        setDistanceP2(null);
        setMeasuringDistance(prev => !prev);

        if (measuringDistance) {
            measureDistanceLine.remove();
            setMeasureDistanceLine(null);
        }
    };

    useEffect(() => {
        if (!props.mapContext) {
            return;
        }

        if (!measuringDistance) {
            return;
        }

        const start = distanceP1;
        const end = distanceP2 ?? mouseCoords;
        if (!start || !end) {
            return;
        }

        if (!measureDistanceLine) {
            const pl = L.polyline([[start.lat, start.lng], [end.lat, end.lng]]);
            setMeasureDistanceLine(pl);
            pl.addTo(props.mapContext.map);
            return;
        }
        measureDistanceLine.setLatLngs([[start.lat, start.lng], [end.lat, end.lng]]);
    }, [props.mapContext, distanceP1, distanceP2, mouseCoords, measuringDistance]);

    const handleMapClick: ClickListener = (ev) => {
        if (!props.mapContext) {
            return;
        }

        if (!distanceP1) {
            setDistanceP1(ev.latlng);
        } else {
            setDistanceP2(ev.latlng);
        }
    };

    useEffect(() => {
        if (!props.mapContext) {
            return () => {};
        }

        mapService.addClickListener(handleMapClick, props.mapContext);

        return () => {
            mapService.removeClickListener(handleMapClick, props.mapContext);
        };
    }, [props.mapContext, distanceP1]);

    return <div className={'page' + (props.isActive ? ' active' : '')}>
        <p>Settings</p>

        <button
            type="button"
            onClick={handleClickMeasureDistance}
        >
            {measuringDistance && 'Cancel '}
            Measure Distance
        </button>
        {measuringDistance && <React.Fragment>
            {distanceP1 && <div>From {latLngToPrettyStr(distanceP1)}</div>}
            {distanceP2 && <div>To {latLngToPrettyStr(distanceP2)}</div>}
            {distanceP1 && distanceP2 && <div>Is {props.mapContext.map.distance(distanceP1, distanceP2).toFixed(2)} meters</div>}
        </React.Fragment>}

        <hr/>

        <label>Import GeoJSON</label>
        <FileInput
            onChange={(files) => {
                if (files.length !== 1) {
                    return;
                }

                const fr = new FileReader();
                fr.onload = (e) => {
                    const txt = e.target.result as string;
                    const json = JSON.parse(txt);
                    const gj = L.geoJSON(json.features, {
                        pointToLayer: (_gjPoint, latLng) => {
                            return L.circle(latLng, {radius: 10});
                        },
                    })
                        .addTo(props.mapContext.map);
                    props.setGeoJsons(prev => ([...prev, {
                        name: files[0].name,
                        leafletLayer: gj,
                    }]));
                };
                fr.readAsText(files[0], 'utf8');
            }}
        />

        <div className="geoJsons">
            {props.geoJsons.map((geoJson, i) => <div key={i} className="geoJson">
                <div className="name">
                    {geoJson.name}
                </div>
                <div className="buttons">
                    <button
                        type="button"
                        onClick={() => {
                            props.setEditedGeoJson(i);
                        }}
                    >
                        E
                    </button>
                    <button
                        type="button"
                        style={{color: '#f00'}}
                        onClick={() => {
                            props.setEditedGeoJson(NaN);
                            geoJson.leafletLayer.remove();
                            props.setGeoJsons(prev => {
                                const index = prev.findIndex(gj => gj === geoJson);
                                if (index === -1) {
                                    return prev;
                                }
                                return [
                                    ...prev.slice(0, index),
                                    ...prev.slice(index + 1),
                                ];
                            });
                        }}
                    >
                        X
                    </button>
                </div>
            </div>)}
        </div>
    </div>;
};

export default SettingsPage;
