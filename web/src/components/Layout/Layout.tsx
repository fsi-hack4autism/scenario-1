import React from 'react';
import { Routes, Route } from "react-router-dom";
import Calendar from '../Calendar';
import Login from '../Login';
import Nav from '../Nav';
import { DEMO } from "../../configuration";
import { Alert } from 'reactstrap';
import PatientsPage from '../../pages/Patients';
import CreatePatientsPage from '../../pages/CreatePatient';
import PatientPage from '../../pages/Patient';
import ViewObjectivePage from '../../pages/ViewObjective';
import ProfilePage from '../../pages/Profile';

const Layout = () => {
    return (
      <div>
        <Nav />
        {DEMO && (
          <Alert className="rounded-0" color="info">
            Application is running in demo mode.
          </Alert>
        )}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/patient/" element={<CreatePatientsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patient/:patientId" element={<PatientPage />} />
          <Route
            path="/patient/:patientId/objective/:objectiveId"
            element={<ViewObjectivePage />}
          />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
}

export default Layout;
