import React, { useState, useEffect } from 'react';
import { LatLng } from 'leaflet';
import mapService, { MapContext, MoveListener } from './service/map';
import { latLngToPrettyStr } from './util';

type FooterProps = {
    mapContext: MapContext;
};

const Footer: React.FunctionComponent<FooterProps> = (props: FooterProps) => {
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

    return <div className="footer">
        {mouseCoords && latLngToPrettyStr(mouseCoords)}
    </div>;
};

export default Footer;
