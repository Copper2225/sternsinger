import { DistrictStatusText } from "src/requests/adminStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalculator, faCar,
    faCircleCheck,
    faPersonWalking,
    faUsers,
    faUsersSlash,
} from "@fortawesome/free-solid-svg-icons";
import React, { useMemo } from "react";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
    status: DistrictStatusText | undefined;
    bauernschaft?: boolean;
    colored?: boolean;
    size?: SizeProp;
}

const StatusIcon = ({ status, colored = true, bauernschaft = false, size = "lg" }: Props) => {
    const icon = useMemo(() => {
        switch (status) {
            case DistrictStatusText.planned:
                return faUsers;
            case DistrictStatusText.finished:
                return faCircleCheck;
            case DistrictStatusText.walking:
                return bauernschaft ? faCar : faPersonWalking;
            case DistrictStatusText.calculating:
                return faCalculator;
            default:
                return faUsersSlash;
        }
    }, [bauernschaft, status]);

    const color = useMemo(() => {
        switch (status) {
            case DistrictStatusText.finished:
                return "var(--bs-success)";
            case DistrictStatusText.notPlanned:
            case undefined:
                return "var(--bs-danger)";
        }
    }, [status]);

    return (
        <div className={`status-icon`}>
            <FontAwesomeIcon
                style={{ aspectRatio: 1 }}
                color={colored ? color : undefined}
                size={size}
                icon={icon}
            />
        </div>
    );
};

export default StatusIcon;
