import React, { useRef, useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import mapService, { MapContext } from './service/map';
import SidePanel from './sidePanel';
import Footer from './footer';
import './style.scss'; // eslint-disable-line import/no-unassigned-import

const App: React.FunctionComponent = () => {
    const mapElementRef = useRef<HTMLDivElement>();
    const [mapContext, setMapContext] = useState<MapContext>(null);

    useEffect(() => {
        if (!mapElementRef.current) {
            return;
        }

        const mc = mapService.init(mapElementRef.current);
        if (mc) {
            setMapContext(mc);
        }
    }, [mapElementRef.current]);

    return <div className="app">
        <SidePanel
            mapContext={mapContext}
        />
        <div className="mainPanel">
            <div ref={mapElementRef} className="map"></div>
            <Footer
                mapContext={mapContext}
            />
        </div>
    </div>;
};

ReactDom.render(<App/>, document.getElementById('root'));
