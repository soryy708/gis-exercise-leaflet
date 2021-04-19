import L, { Map, LeafletMouseEvent } from 'leaflet';

export type ClickListener = (ev: LeafletMouseEvent) => void;
export type MoveListener = (ev: LeafletMouseEvent) => void;

export type MapContext = {
    map: Map,
    clickListeners: ClickListener[],
    moveListeners: MoveListener[];
};

const init = (rootElement: HTMLDivElement): MapContext => {
    if (rootElement.classList.contains('leaflet-container')) {
        return null;
    }

    const context: MapContext = {
        map: null,
        clickListeners: [],
        moveListeners: [],
    };

    context.map = L.map(rootElement, {
        center: [31.807607, 34.658517],
        zoom: 16,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(context.map);
    
    L.control.scale().addTo(context.map);
    
    context.map.addEventListener('click', (ev: LeafletMouseEvent) => {
        context.clickListeners.forEach(listener => listener(ev));
    });

    context.map.addEventListener('mousemove', (ev: LeafletMouseEvent) => {
        context.moveListeners.forEach(listener => listener(ev));
    });

    return context;
};

const addClickListener = (listener: ClickListener, context: MapContext): void => {
    context.clickListeners.push(listener);
};

const removeClickListener = (listener: ClickListener, context: MapContext): void => {
    const index = context.clickListeners.findIndex(l => l === listener);
    if (index === -1) {
        return;
    }
    context.clickListeners.splice(index, 1);
};

const addMoveListener = (listener: ClickListener, context: MapContext): void => {
    context.moveListeners.push(listener);
};

const removeMoveListener = (listener: ClickListener, context: MapContext): void => {
    const index = context.moveListeners.findIndex(l => l === listener);
    if (index === -1) {
        return;
    }
    context.moveListeners.splice(index, 1);
};

export default {
    init,
    addClickListener,
    removeClickListener,
    addMoveListener,
    removeMoveListener,
};
