import { LoaderCircle } from "lucide-react";
import "./spinner.css";

function Spinner({ label = "Laden"}: { label?: string }) {
    return (
        <div className="spinner" role="status">
            <LoaderCircle className="spinner-icon" size={32} strokeWidth={1.8} aria-hidden="true"/>
            <span className="spinner-label">{label}</span>
        </div>
    )
}

export default Spinner;