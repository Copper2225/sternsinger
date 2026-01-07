import React, {
    ChangeEvent,
    FormEvent,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useRecoilState } from "recoil";
import {
    District,
    districtsState,
    DistrictStatusText,
} from "src/requests/adminStore";
import { useLoadDistricts } from "src/requests/useLoadDistricts";
import {
    Button,
    Form,
    FormCheck,
    FormControl,
    FormLabel,
    FormSelect,
} from "react-bootstrap";
import "./teamLeader.css";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilm,
    faPaperPlane,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import NextModal from "src/View/TeamLeader/NextModal";
import MapComponent from "src/View/TeamLeader/MapComponent";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";
import StatusModal from "src/View/TeamLeader/StatusModal";
import DistrictLoginModal from "src/View/TeamLeader/DistrictLoginModal";

const TeamLeader = () => {
    const loadDistricts = useLoadDistricts();
    const [districts, setDistricts] = useRecoilState(districtsState);
    const [selectedDistrict, setSelectedDistrict] = useState<District>();
    const [selectedIndex, setSelectedIndex] = useState<number>();
    const [lockDistrict, setLockDistrict] = useState<boolean>(false);
    const [nextModal, setNextModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [buttonTimeout, setButtonTimeout] = useState<boolean>();
    const [needsDistrictAuth, setNeedsDistrictAuth] = useState(false);
    const [districtPasscode, setDistrictPasscode] = useState("");
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [showMap, setShowMap] = useState<boolean>(false);

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => {
                const index = Number(Cookies.get("district"));
                if (!isNaN(index)) {
                    setSelectedIndex(index);
                    setSelectedDistrict({
                        ...data[index],
                        status:
                            data[index].status ?? DistrictStatusText.notPlanned,
                    });
                    setLockDistrict(true);
                }
                setDistricts(data);
            })
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );
        setShowMap(Cookies.get("showMap") === "true");
    }, [backendURL, loadDistricts, setDistricts]);

    const checkDistrictAuth = useCallback(
        async (index: number) => {
            const res = await fetch(`${backendURL}/dist-check-auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ index }),
            });

            if (!res.ok) {
                setNeedsDistrictAuth(true);
            }
        },
        [backendURL],
    );

    const handleDistrictLogin = async () => {
        const res = await fetch(`${backendURL}/district-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                index: selectedIndex,
                passcode: districtPasscode,
            }),
        });

        if (res.ok) {
            setNeedsDistrictAuth(false);
            setLockDistrict(true);
        } else {
            alert("Falscher Passcode");
        }
    };

    const handleChangeDistrict = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const index = Number(event.currentTarget.value);
            if (!isNaN(index)) {
                const dist = districts[index];
                if (dist.status === undefined) {
                    setSelectedDistrict({
                        ...dist,
                        status: DistrictStatusText.notPlanned,
                    });
                } else {
                    setSelectedDistrict(dist);
                }
                setSelectedIndex(index);
                checkDistrictAuth(index);
                Cookies.set("district", index.toString());
                setLockDistrict(true);
            }
        },
        [checkDistrictAuth, districts],
    );

    const handleContactSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setButtonTimeout(true);

            const formData = new FormData(event.currentTarget);
            const teamContact = formData.get("teamContact") as string;

            fetch(`${backendURL}/district`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    index: selectedIndex,
                    value: { ...selectedDistrict, contact: teamContact },
                }),
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) =>
                    console.log(`Updated ${selectedDistrict?.name}`, data),
                )
                .catch((error) =>
                    console.error("Error updating district:", error),
                );

            setTimeout(() => setButtonTimeout(false), 2000);
        },
        [backendURL, selectedDistrict, selectedIndex],
    );

    const handleCheckedChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setShowMap(event.target.checked);
            Cookies.set("showMap", event.target.checked.toString());
        },
        [],
    );

    return (
        <div className={"h-100 d-flex flex-column p-2"}>
            <DistrictLoginModal
                show={needsDistrictAuth}
                passcode={districtPasscode}
                setPasscode={setDistrictPasscode}
                onSubmit={handleDistrictLogin}
                onCancel={() => {
                    setNeedsDistrictAuth(false);
                    setSelectedIndex(undefined);
                    setSelectedDistrict(undefined);
                    setLockDistrict(false);
                }}
            />

            <div className={"d-flex gap-3"}>
                <Button
                    className={"flex-grow-1 my-2"}
                    onClick={() => setNextModal(true)}
                >
                    <FontAwesomeIcon icon={faFilm} size={"3x"} />
                </Button>
                <NextModal show={nextModal} setShow={setNextModal} />
                <Button
                    className={"flex-grow-1 my-2"}
                    onClick={() => setStatusModal(true)}
                >
                    <StatusIcon
                        colored={false}
                        status={selectedDistrict?.status}
                        size={"3x"}
                    />
                </Button>
                <StatusModal
                    show={statusModal}
                    setShow={setStatusModal}
                    index={selectedIndex}
                    district={selectedDistrict}
                    setDistricts={setDistricts}
                    setSelectedDistrict={setSelectedDistrict}
                />
            </div>
            <div className={"d-flex gap-3 mb-3"}>
                <FormSelect
                    value={selectedIndex}
                    className={"fs-2"}
                    name={"districtIndex"}
                    onChange={handleChangeDistrict}
                    disabled={lockDistrict}
                >
                    <option value={-1}></option>
                    {districts.map((district, index) => (
                        <option value={index} key={district.name}>
                            {district.name}
                        </option>
                    ))}
                </FormSelect>
                <Button
                    className={"ratio-1x1"}
                    onClick={() => setLockDistrict(false)}
                >
                    <FontAwesomeIcon icon={faRotateRight} />
                </Button>
            </div>
            <Form onSubmit={handleContactSubmit}>
                <FormLabel htmlFor={"teamContact"}>Teamleiter</FormLabel>
                <div className={"d-flex gap-3"}>
                    <FormControl
                        defaultValue={selectedDistrict?.contact}
                        name={"teamContact"}
                    />
                    <Button
                        name={"contact"}
                        type="submit"
                        disabled={buttonTimeout}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            </Form>
            {selectedIndex !== undefined && selectedDistrict && (
                <>
                    <h3 className={"py-2 d-flex justify-content-between"}>
                        Karte{" "}
                        <FormCheck
                            type={"switch"}
                            checked={showMap}
                            onChange={handleCheckedChange}
                        />
                    </h3>
                    {showMap && (
                        <MapComponent
                            district={selectedDistrict}
                            index={selectedIndex}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TeamLeader;
