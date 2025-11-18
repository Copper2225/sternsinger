import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { District } from "src/requests/adminStore";

interface Props {
    district: District;
    handleSubmit: (value: District, index: number) => void;
    index: number;
}

const DistrictLine = ({
    district,
    handleSubmit,
    index,
}: Props): React.ReactElement => {
    const [inputValue, setInputValue] = useState<number | "">(
        district.money ?? "",
    );

    useEffect(() => {
        setInputValue(district.money ?? "");
    }, [district]);

    const handleSave = useCallback(() => {
        handleSubmit(
            { ...district, money: inputValue != "" ? inputValue : null },
            index,
        );
    }, [district, handleSubmit, index, inputValue]);

    const handleCancel = useCallback(() => {
        setInputValue(district.money ?? "");
    }, [district.money]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                handleSave();
                event.currentTarget.blur();
            }
        },
        [handleSave],
    );

    return (
        <tr style={{ height: "10px" }}>
            <td style={{ padding: "10px 10px 10px 0" }}>
                <label style={{ fontSize: "larger" }}>{district.name}:</label>
            </td>
            <td style={{ padding: "10px", width: "200px" }}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) =>
                        setInputValue(
                            e.target.value === "" ? "" : Number(e.target.value),
                        )
                    }
                    style={{ padding: "5px", width: "100%" }}
                    onKeyDown={handleKeyDown}
                />
            </td>
            <td style={{ padding: "10px", minWidth: '80px' }}>
                {inputValue !== (district.money ?? "") && (
                    <div style={{ display: "flex", gap: 8 }}>
                        <FontAwesomeIcon
                            size={"xl"}
                            className={"text-success"}
                            icon={faCheck}
                            onClick={handleSave}
                        />
                        <FontAwesomeIcon
                            size={"xl"}
                            className={"text-danger"}
                            icon={faXmark}
                            onClick={handleCancel}
                        />
                    </div>
                )}
            </td>
        </tr>
    );
};

export default DistrictLine;
