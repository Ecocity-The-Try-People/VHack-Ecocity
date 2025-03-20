import React from 'react';
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const traffic_page = () => {
        navigate("/traffic");
    };

    const flood_page = () => {
        navigate("/flood_page");
    };

    const edwards_page = () => {
        navigate("/edwards");
    };

    return (
        <div>
            <button onClick={traffic_page}>Traffic</button>
            <button onClick={flood_page}>Flooding</button>
            <button onClick={edwards_page}>Edwards Page</button>
        </div>
    );
}