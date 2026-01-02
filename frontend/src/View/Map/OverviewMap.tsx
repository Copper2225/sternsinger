import React, {useCallback, useEffect, useMemo, useRef} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { v4 as uuidv4 } from "uuid";
import {DistrictMarker, districtsState} from "src/requests/adminStore";
import {useRecoilState} from "recoil";
import {useDistrictColor} from "src/View/Map/useDistrictColor";

interface OverviewMarker extends DistrictMarker {
    district: string;
}

const OverviewMap = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [districts, setDistricts] = useRecoilState(districtsState);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const getMarkerColor = useDistrictColor();
    const lastSelectedRef = useRef<number>(0);

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => {
                setDistricts(data);
            })
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );
    }, [backendURL, setDistricts]);

    const initialMarkers = useMemo(() => {
        const result = new Map<string, OverviewMarker>();

        districts.forEach(district => {
            const src = district.markers;

            if (src instanceof Map) {
                for (const [key, value] of src) {
                    result.set(key, {...value, district: district.name});
                }
            } else if (src && typeof src === "object") {
                for (const [key, value] of Object.entries(src)) {
                    result.set(key, {...value, district: district.name} as OverviewMarker);
                }
            }
        });

        return result;
    }, [districts]);

    type RenderedMarker = OverviewMarker & { mapMarker: mapboxgl.Marker; originalHTML: string };
    const markersRef = useRef<Map<string, RenderedMarker>>(new Map());

    const defaultMarkerColor = "#3FB1CE";
    const notesColor = "#DDAA33";

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string | undefined;

    const centerLngLat = useMemo<[number, number]>(() => [7.841325, 52.040678], []);
    const mapZoom = 14.6;

    const createDoneMarkerElement = useCallback(() => {
        const el = document.createElement("div");
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.background = "var(--bs-success)";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "white";
        el.style.fontSize = "14px";
        el.style.lineHeight = "1";
        el.style.boxShadow = "0 0 0 2px #ffffff";
        el.textContent = "✓";
        return el;
    }, []);

    const updateMarkerColor = useCallback((key: string) => {
        const current = markersRef.current.get(key);
        if (current) {
            const el = current.mapMarker.getElement();

            if (current.done) {
                const doneMarkerElement = createDoneMarkerElement();
                // Replace inner content with the "done" badge while keeping the outer marker element and listeners
                el.innerHTML = "";
                el.appendChild(doneMarkerElement);
            }

            else {
                // Restore original default marker HTML and then recolor based on notes
                if (current.originalHTML) {
                    el.innerHTML = current.originalHTML;
                }
                const path = el?.querySelector?.("path") as SVGPathElement | null;
                if (path) {
                    const newFill = getMarkerColor(current.district);
                    path.setAttribute("fill", newFill);
                }
                const circle = el?.querySelector?.("circle") as SVGPathElement | null;
                if (circle) {
                    const newFill = current.notes.trim().length > 0 ? notesColor : "white";
                    circle.setAttribute("fill", newFill);
                }
            }
        }
    }, [createDoneMarkerElement, getMarkerColor]);

    const removeMarker = useCallback((key: string) => {
        const instance = markersRef.current.get(key);
        if (instance) {
            instance.mapMarker.remove();
            markersRef.current.delete(key);
        }
    }, []);

    const handleSave = useCallback(() => {
        if (!markersRef.current) return;

        const markersByDistrict = new Map<string, Record<string, unknown>>();

        markersRef.current.forEach((marker, key) => {
            if (!markersByDistrict.has(marker.district)) {
                markersByDistrict.set(marker.district, {});
            }
            markersByDistrict.get(marker.district)![key] = {
                lat: marker.lat,
                lng: marker.lng,
                notes: marker.notes,
                done: marker.done,
            };
        });

        const updatedDistricts = districts.map(d => ({
            ...d,
            markers: markersByDistrict.get(d.name) ?? d.markers ?? {},
        }));

        fetch(`${backendURL}/districts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: updatedDistricts }),
        })
            .then(response => response.json())
            .catch(error =>
                console.error("Error updating districts:", error),
            );
    }, [backendURL, districts]);


    const renderMarkerPopupContent = useCallback((key: string) => {
        const container = document.createElement("div");
        container.className = "d-flex flex-column";

        const current = markersRef.current.get(key);
        const label = document.createElement("div");
        label.textContent = `Marker - ${current?.district}`;
        container.appendChild(label);

        const notesLabel = document.createElement("label");
        notesLabel.textContent = "Notizen";
        notesLabel.className = "mt-2";
        container.appendChild(notesLabel);

        const textarea = document.createElement("textarea");
        textarea.className = "form-control";
        textarea.rows = 3;
        textarea.value = current?.notes ?? "";
        textarea.addEventListener("input", (e) => {
            const instance = markersRef.current.get(key);
            if (instance) {
                instance.notes = (e.target as HTMLTextAreaElement).value;
            }
        });
        // prevent map interactions while typing
        ["click", "mousedown", "dblclick", "touchstart", "touchend"].forEach((evt) => {
            textarea.addEventListener(evt, (ev) => ev.stopPropagation());
        });
        container.appendChild(textarea);

        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "form-check mt-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
        checkbox.id = `done-${key}`;
        checkbox.checked = Boolean(current?.done);
        checkbox.addEventListener("change", () => {
            const instance = markersRef.current.get(key);
            if (instance) {
                instance.done = checkbox.checked;
            }
        });
        ["click", "mousedown", "dblclick", "touchstart", "touchend"].forEach((evt) => {
            checkbox.addEventListener(evt, (ev) => ev.stopPropagation());
        });

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "form-check-label";
        checkboxLabel.htmlFor = `done-${key}`;
        checkboxLabel.textContent = "Erledigt";

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);
        container.appendChild(checkboxWrapper);

        const button = document.createElement("button");
        button.className = "btn btn-danger mt-2";
        button.textContent = "Löschen";
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeMarker(key);
            handleSave();
        });
        container.appendChild(button);

        return container;
    }, [removeMarker, handleSave]);

    const addMarker = useCallback((lat: number, lng: number, district: string) => {
        const key = uuidv4();
        if (!mapRef.current) return;
        const popup = new mapboxgl.Popup({ offset: 16 });
        let wasOpened = false;
        popup.on("open", () => {
            wasOpened = true;
            popup.setDOMContent(renderMarkerPopupContent(key));
        });
        popup.on("close", () => {
            if (wasOpened) {
                handleSave();
                updateMarkerColor(key);
            }
        });
        const marker = new mapboxgl.Marker({ color: defaultMarkerColor })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(mapRef.current);

        const markerElement = marker.getElement();
        markerElement.addEventListener("click", (ev) => {
            ev.stopPropagation();
            marker.togglePopup();
        });
        ["mousedown", "dblclick", "touchstart", "touchend"].forEach((evt) => {
            markerElement.addEventListener(evt, (ev) => {
                ev.stopPropagation();
            });
        });

        const originalHTML = markerElement.innerHTML;
        markersRef.current.set(key, { mapMarker: marker, lat, lng, notes: "", done: false, originalHTML, district: district });
        updateMarkerColor(key);
        handleSave();
    }, [renderMarkerPopupContent, handleSave, updateMarkerColor]);

    const showAddConfirmPopup = useCallback((lat: number, lng: number) => {
        if (!mapRef.current) return;

        const container = document.createElement("div");
        container.className = "d-flex flex-column";

        const text = document.createElement("div");
        text.textContent = "Marker hier hinzufügen?";
        container.appendChild(text);

        // ---- Create dropdown ----
        const districtSelectLabel = document.createElement("label");
        districtSelectLabel.textContent = "Bezirk auswählen:";
        districtSelectLabel.className = "mt-2";
        container.appendChild(districtSelectLabel);

        const districtSelect = document.createElement("select");
        districtSelect.className = "form-select form-select-sm mb-2";

        districts.forEach((d, index) => {
            const option = document.createElement("option");
            option.value = d.name;
            option.textContent = d.name;
            districtSelect.appendChild(option);

            if (index === lastSelectedRef.current) {
                option.selected = true;
            }
        });

        container.appendChild(districtSelect);

        const btns = document.createElement("div");
        btns.className = "d-flex gap-2 mt-2";

        const confirmBtn = document.createElement("button");
        confirmBtn.className = "btn btn-primary btn-sm";
        confirmBtn.textContent = "Hinzufügen";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn btn-secondary btn-sm";
        cancelBtn.textContent = "Abbrechen";

        btns.appendChild(confirmBtn);
        btns.appendChild(cancelBtn);
        container.appendChild(btns);

        const popup = new mapboxgl.Popup({ offset: 12, closeOnClick: true })
            .setLngLat([lng, lat])
            .setDOMContent(container)
            .addTo(mapRef.current);

        const stop = (ev: Event) => ev.stopPropagation();
        ["click", "mousedown", "dblclick", "touchstart", "touchend"].forEach(evt => {
            container.addEventListener(evt, stop);
            confirmBtn.addEventListener(evt, stop);
            cancelBtn.addEventListener(evt, stop);
            districtSelect.addEventListener(evt, stop);
        });

        confirmBtn.addEventListener("click", () => {
            popup.remove();
            const selectedDistrict = districtSelect.value;
            lastSelectedRef.current = districtSelect.selectedIndex
            addMarker(lat, lng, selectedDistrict);
        });

        cancelBtn.addEventListener("click", () => {
            popup.remove();
        });
    }, [addMarker, districts]);


    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: centerLngLat,
            zoom: mapZoom,
            maxZoom: 30,
        });
        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl(), "top-left");
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showAccuracyCircle: false,
            showUserHeading: true,
        });
        map.addControl(geolocate, "top-left");

        // Style toggle control (streets <-> satellite)
        {
            let container: HTMLDivElement | null = null;
            let currentStyle: "streets" | "satellite" = "streets";
            const styleToggleControl: mapboxgl.IControl = {
                onAdd: (mapInstance) => {
                    container = document.createElement("div");
                    container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
                    const streetsBtn = document.createElement("button");
                    streetsBtn.type = "button";
                    streetsBtn.title = "Karte";
                    streetsBtn.textContent = "Karte";
                    const satelliteBtn = document.createElement("button");
                    satelliteBtn.type = "button";
                    satelliteBtn.title = "Satellit";
                    satelliteBtn.textContent = "Satellit";
                    const stop = (ev: Event) => ev.stopPropagation();
                    [container, streetsBtn, satelliteBtn].forEach((el) => {
                        ["click", "mousedown", "dblclick", "touchstart", "touchend"].forEach((evt) =>
                            el.addEventListener(evt, stop),
                        );
                    });

                    const setActive = (styleName: "streets" | "satellite") => {
                        currentStyle = styleName;
                        if (styleName === "streets") {
                            streetsBtn.classList.add("active");
                            satelliteBtn.classList.remove("active");
                        } else {
                            satelliteBtn.classList.add("active");
                            streetsBtn.classList.remove("active");
                        }
                    };

                    streetsBtn.addEventListener("click", () => {
                        if (currentStyle !== "streets") {
                            handleSave();
                            mapInstance.setStyle("mapbox://styles/mapbox/streets-v11");
                            setActive("streets");
                        }
                    });

                    satelliteBtn.addEventListener("click", () => {
                        if (currentStyle !== "satellite") {
                            handleSave();
                            mapInstance.setStyle("mapbox://styles/mapbox/satellite-streets-v12");
                            setActive("satellite");
                        }
                    });

                    container.appendChild(streetsBtn);
                    container.appendChild(satelliteBtn);
                    setActive("streets");
                    return container;
                },
                onRemove: () => {
                    if (container && container.parentNode) {
                        container.parentNode.removeChild(container);
                    }
                    container = null;
                },
            };
            map.addControl(styleToggleControl, "top-right");
        }

        // Render existing markers from the district on map load
        map.on("load", () => {
            // Ensure we start with a clean marker state when (re)loading the map
            markersRef.current.forEach(({ mapMarker }) => mapMarker.remove());
            markersRef.current.clear();
            initialMarkers.forEach((value, key) => {
                if (
                    value
                ) {
                    const popup = new mapboxgl.Popup({ offset: 16 });
                    let wasOpened = false;
                    popup.on("open", () => {
                        wasOpened = true;
                        popup.setDOMContent(renderMarkerPopupContent(key));
                    });
                    popup.on("close", () => {
                        if (wasOpened) {
                            handleSave();
                            updateMarkerColor(key)
                        }
                    });
                    const marker = new mapboxgl.Marker({ color: (value.done ? notesColor : defaultMarkerColor) })
                        .setLngLat([value.lng, value.lat])
                        .setPopup(popup)
                        .addTo(map);

                    const markerElement = marker.getElement();
                    markerElement.addEventListener("click", (ev) => {
                        ev.stopPropagation();
                        marker.togglePopup();
                    });
                    ["mousedown", "dblclick", "touchstart", "touchend"].forEach((evt) => {
                        markerElement.addEventListener(evt, (ev) => {
                            ev.stopPropagation();
                        });
                    });

                    const originalHTML = markerElement.innerHTML;
                    markersRef.current.set(key, {
                        mapMarker: marker,
                        lat: value.lat,
                        lng: value.lng,
                        notes: value.notes ?? "",
                        done: Boolean(value.done),
                        district: value.district,
                        originalHTML,
                    });
                    updateMarkerColor(key);
                }
            });
            // After rendering all existing markers, fit the map to show all of them
            const renderedMarkers = Array.from(markersRef.current.values());
            if (renderedMarkers.length > 0) {
                if (renderedMarkers.length === 1) {
                    const only = renderedMarkers[0];
                    map.setCenter([only.lng, only.lat]);
                    // Keep current zoom if it's already close; otherwise zoom in moderately
                    const currentZoom = map.getZoom();
                    if (currentZoom < 16) {
                        map.setZoom(16);
                    }
                } else {
                    const bounds = new mapboxgl.LngLatBounds();
                    renderedMarkers.forEach((m) => bounds.extend([m.lng, m.lat]));
                    map.fitBounds(bounds, { padding: 60, maxZoom: 18, duration: 500 });
                }
            }
        });

        map.on("click", (e) => {
            // Ignore clicks originating from markers or popups
            const target = (e.originalEvent as MouseEvent | TouchEvent)
                .target as HTMLElement | null;
            if (target && (target.closest(".mapboxgl-marker") || target.closest(".mapboxgl-popup"))) {
                return;
            }
            showAddConfirmPopup(e.lngLat.lat, e.lngLat.lng);
        });

        return () => {
            // Remove all existing markers and clear local state on teardown
            markersRef.current.forEach(({ mapMarker }) => mapMarker.remove());
            markersRef.current.clear();
            map.remove();
            mapRef.current = null;
        };
    }, [addMarker, centerLngLat, initialMarkers, renderMarkerPopupContent, handleSave, updateMarkerColor, showAddConfirmPopup]);

    return (
        <>
            <h3 className={"py-2"}>Karte</h3>
            <div className={"map-wrapper mb-3 h-100"}>
                <div
                    ref={mapContainerRef}
                    className={"leaflet-map h-100"}
                    style={{ width: "100%" }}
                />
            </div>
        </>
    );
};

export default OverviewMap;