import React, {useEffect, createContext, useState} from "react";
import { createRoot } from "react-dom/client";
import { PopupProvider } from "./context/popupContext";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
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
                    <Routes>
                        <Route path='/' element={<Home />}/>
                    </Routes>
                    </div>
                </div>
        </PopupProvider>
    )
}

const container = document.getElementById('react-target')
const root = createRoot(container)
root.render(
<Router>
    <Popup />
</Router>
);