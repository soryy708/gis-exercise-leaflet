import React, { useRef, useEffect } from 'react';

type FileInputProps = {
    onChange?: (files: FileList) => void;
};

const FileInput: React.FunctionComponent<FileInputProps> = (props: FileInputProps) => {
    const ref = useRef<HTMLInputElement>();

    useEffect(() => {
        if (props.onChange) {
            props.onChange(ref.current.files);
        }
    }, [ref.current && ref.current.files && Array.from(ref.current.files).map(file => file.name).join(';')]);

    return <input
        type="file"
        ref={ref}
    />;
};

export default FileInput;
