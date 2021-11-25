import React from 'react';
import Applications from '../components/projects/project-applications/Applications';
import { useProfile } from '../context/profile.context';

const ApplicationsPage = () => {
  const { profile } = useProfile();

  let shownPage;
  if (profile.usertype === 'student') {
    shownPage = <Applications type="student" />;
  } else if (profile.usertype === 'company') {
    shownPage = <Applications type="company" />;
  }

  return (
    <>
      <h1 className="text-2xl">Here you can see all applications</h1>
      {shownPage}
    </>
  );
};

export default ApplicationsPage;
