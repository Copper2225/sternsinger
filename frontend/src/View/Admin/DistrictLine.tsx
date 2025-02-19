import React, {useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCross, faXmark} from "@fortawesome/free-solid-svg-icons";

interface Props {
    name: string;
    value: number | '';
    handleSubmit: (value: number, index: number) => void;
    index: number;
}

const DistrictLine = ({ name, value, handleSubmit, index }: Props): React.ReactElement => {
    const [inputValue, setInputValue] = useState<number | ''>(value);

    useEffect(() => {
        setInputValue(value)
    }, [value]);

    const handleSave = useCallback(() => {
        handleSubmit(inputValue === '' ? 0 : inputValue, index);
    }, [inputValue]);

    const handleCancel = useCallback(() => {
        setInputValue(value);
    }, []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSave();
            event.currentTarget.blur();
        }
    }, [handleSave]);

    return (
        <tr style={{ height: "10px" }}>
            <td style={{ padding: "10px 10px 10px 0" }}>
                <label style={{fontSize: "larger"}}>{name}:</label>
            </td>
            <td style={{ padding: "10px", width: "50%" }}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
                    style={{ padding: "5px", width: "100%" }}
                    onKeyDown={handleKeyDown}
                />
            </td>
            <td style={{padding: "10px", width: 30}}>
                {inputValue !== value &&
                    <div style={{display: "flex", gap: 4}}>
                        <FontAwesomeIcon icon={faCheck} onClick={handleSave} />
                        <FontAwesomeIcon icon={faXmark} onClick={handleCancel} />
                    </div>
                }
            </td>
        </tr>
    );
};


export default DistrictLine;