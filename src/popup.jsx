import React, {useEffect, createContext, useState} from "react";
import { createRoot } from "react-dom/client";
import { PopupProvider } from "./context/popupContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import './popup.css'

function Popup(){

    useEffect(() => {
        document.body.style.backgroundColor = 'white';
    }, [])

    return (
        <PopupProvider>
            <div className="Popup">
                <Header />
                <hr className='line'></hr>
                <div className="Popup-body">
                    <Home />
                </div>
            </div>
        </PopupProvider>
    )
}

const container = document.getElementById('react-target')
const root = createRoot(container)
root.render(
<Popup />
);