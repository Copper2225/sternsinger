import { DistrictStatusText } from "src/requests/adminStore";

const getStatusValues = (statusObject: typeof DistrictStatusText): string[] => {
    return Object.values(statusObject) as string[];
};

const Help = () => {
    const allStatus = getStatusValues(DistrictStatusText);

    return (
        <div className={"p-3"}>
            <h1>Hilfe zur Ansicht</h1>
            <p>Die folgenden URL-Parameter können verwendet werden, um die Darstellung der Übersicht anzupassen:</p>

            <hr />

            <h3>URL Parameter</h3>
            <ul>
                <li><code>?value=true</code>: Zeigt die Prozentzahl beim Fortschritt an.</li>
                <li><code>?summe=true</code>: Blendet die Spendensumme aus.</li>
                <li><code>?progress=true</code>: Blendet den Fortschrittsbalken aus.</li>
                <li><code>?status=true</code>: Blendet die Bezirks-Status-Symbole aus.</li>
            </ul>

            <hr />

            <h3>Beispiel JSON (Datenstruktur)</h3>
            <p>Die Anwendung erwartet ein Array von Objekten in dieser Struktur:</p>
            <pre>
                <code>
{`[
    {
        "name": "Dorf #1",
    },
    {
        "name": "Überwasser",
        "bauernschaft": true,
        "money": 356.12 // Optional
    },
    {
        "name": "Sonstiges",
        "counting": false,
        "bauernschaft": false,
        "status": "walking" // Optional, siehe unten
    },
    ...
]`}
                </code>
            </pre>

            <hr />

            <h3>Alle möglichen Status-Werte</h3>
            <p>Dies sind die gültigen Werte für das optionale Feld <code>"status"</code>:</p>
            <ul>
                {allStatus.map((status) => (
                    <li key={status}><code>{status}</code></li>
                ))}
            </ul>
        </div>
    );
};

export default Help;