import React from "react";
import { Link } from "react-router-dom";

import Patient from "../../models/Patient";

const Profile = ({ patients }: { patients: Patient[] }) => (
  <div className="m-3">
    <h2 className="text-capitalize">Ken Lejnieks</h2>
    <br />
    <h3>Patients</h3>
    <ul>
      {patients?.map((p) => (
        <li key={p.patientId}>
          <Link to={`/patient/${p.patientId}`}>
            {p.firstName} {p.surname}
          </Link>
        </li>
      )) ?? null}
    </ul>
  </div>
);

export default Profile;
