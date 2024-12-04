import { useState, useEffect } from 'react';

function FetchLog() {
    const [logData, setLogData] = useState("");  // Menyimpan data log yang diambil

    const fetchlogs = async () => {
        try {
            const response = await fetch('http://localhost:5000/download-log');
            if (response.ok) {
                const logText = await response.text();
                setLogData(logText);
            } else {
                alert("Failed to fetch the log file");
            }
        } catch (error) {
            console.error("Error fetching log:", error);
            alert("Error fetching log file");
        }
    };

    useEffect(() => {
        fetchlogs();
    }, []); 

    return (
        <div>
            <h1>Log File</h1>
            <pre>{logData}</pre>
        </div>
    );
}

export default FetchLog;