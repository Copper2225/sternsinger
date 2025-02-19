import React, {useCallback, useRef} from "react";
import {Button} from "react-bootstrap";

interface Props {
    setState: (value: any) => void;
}

const ImportButton = ({setState}: Props): React.ReactElement => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const uploadDistrictData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                setState(importedData);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };

        reader.readAsText(file);
    }, []);

    return (<div>
        <Button onClick={handleFileClick}>Import</Button>
        <input
            type="file"
            accept="application/json"
            onChange={uploadDistrictData}
            ref={fileInputRef}
            style={{display: 'none'}}
        />
    </div>)
}

export default ImportButton;