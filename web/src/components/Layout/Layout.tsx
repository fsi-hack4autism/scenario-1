import React from 'react';
import { Routes, Route } from "react-router-dom";
import Calendar from '../Calendar';
import Nav from '../Nav';
import NewPatientForm from '../NewPatientForm';
import PatientInfo from '../PatientInfo';
import PatientList from '../PatientList';

const Layout = () => {
    return (
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={<PatientList />} />
                <Route path="/patient/" element={<NewPatientForm />} />
                <Route path="/patient/:patientId" element={<PatientInfo />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </div>
        
    );
}

export default Layout;
