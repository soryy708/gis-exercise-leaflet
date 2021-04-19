import React, { useState } from 'react';
import { MapContext } from '../service/map';
import { GeoJsonWrapper } from './geoJsonWrapper';
import SettingsPage from './page/settings';
import EditingPage from './page/editing';
import './style.scss'; // eslint-disable-line import/no-unassigned-import

type SidePanelProps = {
    mapContext: MapContext;
};

const SidePanel: React.FunctionComponent<SidePanelProps> = (props: SidePanelProps) => {
    const [geoJsons, setGeoJsons] = useState<GeoJsonWrapper[]>([]);
    const [editedGeoJson, setEditedGeoJson] = useState(NaN);

    return <div className="sidePanel">
        <SettingsPage
            isActive={isNaN(editedGeoJson)}
            mapContext={props.mapContext}
            geoJsons={geoJsons}
            setEditedGeoJson={setEditedGeoJson}
            setGeoJsons={setGeoJsons}
        />
        <EditingPage
            geoJson={(isNaN(editedGeoJson) || editedGeoJson > geoJsons.length) ? null : geoJsons[editedGeoJson]}
            onCancel={() => setEditedGeoJson(NaN)}
            onSave={details => {
                const geoJson = geoJsons[editedGeoJson];
                const colorStr = `rgb(${details.color.r}, ${details.color.g}, ${details.color.b})`;
                geoJson.leafletLayer.setStyle(() => ({
                    color: colorStr,
                    fillColor: colorStr,
                }));
                setEditedGeoJson(NaN);
            }}
        />
    </div>;
};

export default SidePanel;
