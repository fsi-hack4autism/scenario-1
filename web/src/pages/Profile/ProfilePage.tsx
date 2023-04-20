import React from "react";

import Profile from "../../components/Profile";
import usePatients from "../../hooks/usePatients";

const ProfilePage = () => {
  const { patients, isError, isLoading } = usePatients();

  if (isError) {
    return <div>"An unknown error occurred"</div>;
  }

  if (isLoading || patients == null) {
    return <div className="m-3">Loading...</div>;
  }

  return <Profile patients={patients} />;
};

export default ProfilePage;
