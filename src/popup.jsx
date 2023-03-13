import React, {useEffect} from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header";
import Home from "./pages/Home";
import './popup.css'

function Popup(){

    useEffect(() => {
        document.body.style.backgroundColor = 'white';
    }, [])

    return (
        <div className="Popup">
            <Header />
            <hr className='line'></hr>
            <div className="Popup-body">
                <Home />
            </div>
        </div>
    )
}

const container = document.getElementById('react-target')
const root = createRoot(container)
root.render(
<Popup />
);