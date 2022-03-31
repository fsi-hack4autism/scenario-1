import React from 'react';
import { Routes, Route } from "react-router-dom";
import Calendar from '../Calendar';
import Nav from '../Nav';
import PatientList from '../PatientList';

const Layout = () => {
    return (
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={<PatientList />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </div>
        
    );
}

export default Layout;
