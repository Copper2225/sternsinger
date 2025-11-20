import React, { useCallback, useRef } from "react";
import { Button } from "react-bootstrap";
import { District, DistrictStatusText } from "src/requests/adminStore";

interface Props {
    setState: (value: District[]) => void;
}

const ImportButton = ({ setState }: Props): React.ReactElement => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const uploadDistrictData = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(
                        e.target?.result as string,
                    ) as District[];

                    const processedData: District[] = data.map((district) => ({
                        ...district,
                        bauernschaft: district.bauernschaft ?? false,
                        counting: district.counting ?? true,
                        status: district.status ?? DistrictStatusText.notPlanned,
                    }));

                    setState(processedData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };

            reader.readAsText(file);
        },
        [setState],
    );

    return (
        <div>
            <Button onClick={handleFileClick}>Import</Button>
            <input
                type="file"
                accept="application/json"
                onChange={uploadDistrictData}
                ref={fileInputRef}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default ImportButton;
