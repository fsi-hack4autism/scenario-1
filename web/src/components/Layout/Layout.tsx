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
import Profile from '../Profile';
import SessionDetails from '../SessionDetails';
import { DEMO } from "../../configuration";
import { Alert } from 'reactstrap';

const Layout = () => {
    return (
        <div>
            <Nav />
            { DEMO && <Alert className="rounded-0" color="info">Application is running in demo mode.</Alert> }
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<PatientList />} />
                <Route path="/patient/" element={<NewPatientForm />} />
                <Route path="/patient/:patientId" element={<PatientInfo />} />
                <Route path="/patient/:patientId/behaviors/:behaviorId" element={<PatientBehaviorAnalysis />} />
                <Route path="/sessions/:sessionId" element={<SessionDetails />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
        
    );
}

export default Layout;
