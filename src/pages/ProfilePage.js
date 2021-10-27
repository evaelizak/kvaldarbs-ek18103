import React from 'react';
import StudentProfile from '../components/StudentProfile';
import CompanyProfile from '../components/CompanyProfile';

import { useProfile } from '../context/profile.context';

const ProfilePage = () => {
  const { profile, isLoading } = useProfile();
  console.log(isLoading);

  let shownComponent;
  console.log(profile.usertype);
  if (profile.usertype === 'student') {
    shownComponent = <StudentProfile />;
  } else {
    shownComponent = <CompanyProfile />;
  }

  return <>{shownComponent}</>;
};

export default ProfilePage;
