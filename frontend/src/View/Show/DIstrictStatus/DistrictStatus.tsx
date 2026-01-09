import React, { ReactElement } from "react";
import { District } from "src/requests/adminStore";
import "./status.css";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";

interface Props {
    districts: District[];
}

const DistrictStatus = ({ districts }: Props): ReactElement => {
    const [windowSize, setWindowSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    React.useEffect(() => {
        const handleResize = () =>
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const activeDistricts = districts.filter((dist) => dist.counting);

    const getBaseRows = (width: number, height: number) => {
        if (height < 500) return 3;
        if (height < 700) return 5;
        if (width > 2500) return 6;
        if (width > 1900) return 8;
        if (width > 1200) return 10;
        if (width > 800) return 12;
        return 15;
    };

    const maxRows = getBaseRows(windowSize.width, windowSize.height);
    const calculatedRows =
        activeDistricts.length > 0
            ? Math.min(activeDistricts.length, maxRows)
            : 1;

    return (
        <>
            <div className={"h-100 w-100 status-wrapper"}>
                <span className={"status-title"}>Bezirke Status:</span>
                <div
                    className={"status-grid w-100"}
                    style={{
                        gridTemplateRows: `repeat(${calculatedRows}, auto)`,
                    }}
                >
                    {activeDistricts.map((district) => (
                        <div
                            key={district.name}
                            className={
                                "d-flex flex-row align-items-center status-item"
                            }
                        >
                            <StatusIcon status={district.status} />
                            <div className={""}>{district.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DistrictStatus;
