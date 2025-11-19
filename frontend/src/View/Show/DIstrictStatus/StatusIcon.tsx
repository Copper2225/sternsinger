import {DistrictStatusText} from "src/requests/adminStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faPersonWalking, faUsers, faUsersSlash,} from "@fortawesome/free-solid-svg-icons";
import React, {useMemo} from "react";

interface Props {
    status: DistrictStatusText | undefined;
    colored?: boolean;
}

const StatusIcon = ({ status, colored = true}: Props) => {

    const icon = useMemo(() => {
        switch (status) {
            case DistrictStatusText.planned:
                return faUsers;
            case DistrictStatusText.finished:
                return faCircleCheck;
            case DistrictStatusText.walking:
                return faPersonWalking;
            default:
                return  faUsersSlash;
        }
    }, [status]);

    const color = useMemo(() => {
        switch (status) {
            case DistrictStatusText.finished:
                return 'var(--bs-success)';
            case DistrictStatusText.notPlanned:
            case undefined:
                return 'var(--bs-danger)';
        }
    }, [status]);

    return (
        <div className={`status-icon`}>
            <FontAwesomeIcon style={{aspectRatio: 1}} color={colored ? color : undefined} size={"lg"} icon={icon} />
        </div>
    );
};

export default StatusIcon;
