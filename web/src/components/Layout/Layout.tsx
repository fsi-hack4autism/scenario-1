import React from 'react';
import { Routes, Route } from "react-router-dom";
import Calendar from '../Calendar';
import Login from '../Login';
import Logout from '../Logout';
import Nav from '../Nav';
import NewPatientForm from '../NewPatientForm';
import PatientBehaviorAnalysis from '../PatientBehaviorAnalysis';
import PatientInfo from '../PatientInfo';
import PatientList from '../PatientList';

const isLoggedIn = window.localStorage.getItem("loggedIn") ? true : false;

const Layout = () => {
    return (
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<PatientList />} />
                <Route path="/patient/" element={<NewPatientForm />} />
                <Route path="/patient/:patientId" element={<PatientInfo />} />
                <Route path="/patient/:patientId/behaviors/:behaviorId" element={<PatientBehaviorAnalysis />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
        
    );
}

export default Layout;
