import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {District, DistrictStatusText} from "src/requests/adminStore";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";
import {Button} from "react-bootstrap";
import StatusChangeModal from "src/View/Admin/StatusChangeModal";

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
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setInputValue(district.money ?? "");
    }, [district]);

    const handleSave = useCallback(() => {
        handleSubmit(
            {
                ...district,
                money: inputValue != "" ? inputValue : undefined,
                status: DistrictStatusText.finished,
            },
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

    const buttonVariant = useMemo(() => {
        switch (district.status) {
            case DistrictStatusText.finished :
                return "success";
            case DistrictStatusText.planned :
                return "warning";
            case DistrictStatusText.walking :
                return "info";
            case DistrictStatusText.notPlanned :
            default: return "danger";
        }
    }, [district.status])

    return (
        <tr style={{ height: "10px" }}>
            <td style={{ padding: "10px 10px 10px 0" }}>
                <Button variant={buttonVariant} style={{width: "3.4em"}} onClick={() => setShowModal(true)}>
                    <StatusIcon colored={false} status={district.status} />
                </Button>
            </td>
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
            <td style={{ padding: "10px", minWidth: "80px" }}>
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
            <StatusChangeModal district={district} showModal={showModal} setShowModal={setShowModal} handleSubmit={handleSubmit} index={index} />
        </tr>
    );
};

export default DistrictLine;
