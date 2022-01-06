import React from 'react';
import StudentProfile from '../components/profiles/StudentProfile';
import CompanyProfile from '../components/profiles/CompanyProfile';
import { useProfile } from '../context/profile.context';
import AdminProfile from '../components/profiles/AdminProfile';

const ProfilePage = () => {
  const { profile } = useProfile();

  let shownComponent;
  if (profile.usertype === 'student') {
    shownComponent = <StudentProfile />;
  } else if (profile.usertype === 'company') {
    shownComponent = <CompanyProfile />;
  } else if (profile.usertype === 'admin') {
    shownComponent = <AdminProfile />;
  }

  return <>{shownComponent}</>;
};

export default ProfilePage;
