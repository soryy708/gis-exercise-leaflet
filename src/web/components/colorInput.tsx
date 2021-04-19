import React from 'react';
import './colorInput.scss'; // eslint-disable-line import/no-unassigned-import

export type Color = {
    r: number;
    g: number;
    b: number;
};

type ColorInputProps = {
    value: Color;
    onChange: React.Dispatch<React.SetStateAction<Color>>;
};

const ColorInput: React.FunctionComponent<ColorInputProps> = (props: ColorInputProps) => {
    const {r, g, b} = props.value;

    const handleChange = (key: keyof Color) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.currentTarget.value);
        if (newValue >= 0 && newValue <= 255) {
            props.onChange(prevC => ({
                ...prevC,
                [key]: newValue,
            }));
        }
    };

    return <div className="colorPicker">
        <div className="control">
            <label>Red</label>
            <input
                type="number"
                value={r}
                onChange={handleChange('r')}
            />
        </div>

        <div className="control">
            <label>Green</label>
            <input
                type="number"
                value={g}
                onChange={handleChange('g')}
            />
        </div>

        <div className="control">
            <label>Blue</label>
            <input
                type="number"
                value={b}
                onChange={handleChange('b')}
            />
        </div>

        <div
            className="preview"
            style={{
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
            }}
        ></div>
    </div>;
};

export default ColorInput;
