import { useEffect, useState } from "react";
import Spinner from "../spinner/spinner";
import "./pageLoader.css";

function PageLoader({ delay = 250 } : { delay?: number }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!show) return null;

    return (
        <main className="page-loader">
            <Spinner />
        </main>
    );
}


export default PageLoader;