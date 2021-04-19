import React, { useState } from 'react';
import { GeoJsonWrapper } from '../geoJsonWrapper';
import ColorInput, { Color } from '../../components/colorInput';

type EditedDetails = {
    color: Color;
};

type EditingPageProps = {
    geoJson: GeoJsonWrapper;
    onCancel: () => void;
    onSave: (details: EditedDetails) => void;
};

const EditingPage: React.FunctionComponent<EditingPageProps> = (props: EditingPageProps) => {
    const [color, setColor] = useState<Color>({r: 0, g: 0, b: 0});

    if (!props.geoJson) {
        return <div className="page editing">
        </div>;
    }

    return <div className="page active editing">
        <p>Editing {props.geoJson.name}</p>

        <p>Color</p>
        <ColorInput
            value={color}
            onChange={setColor}
        />

        <div className="actions">
            <button
                type="button"
                onClick={() => {
                    props.onSave({
                        color,
                    });
                }}
            >
                Save
            </button>
            <button
                type="button"
                onClick={() => { props.onCancel(); }}
            >
                Cancel
            </button>
        </div>
    </div>;
};

export default EditingPage;
