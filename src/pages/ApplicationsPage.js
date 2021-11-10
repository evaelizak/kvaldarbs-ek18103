import React from 'react';
import CompanyApplications from '../components/projects/project-applications/CompanyApplications';
import StudentApplications from '../components/projects/project-applications/StudentApplications';
import { useProfile } from '../context/profile.context';

const ApplicationsPage = () => {
  const { profile } = useProfile();

  let shownPage;
  if (profile.usertype === 'student') {
    shownPage = <StudentApplications />;
  } else if (profile.usertype === 'company') {
    shownPage = <CompanyApplications />;
  }

  return (
    <>
      {console.log(profile.usertype)}
      <h1 className="text-2xl">Here you can see all applications</h1>
      {shownPage}
    </>
  );
};

export default ApplicationsPage;
