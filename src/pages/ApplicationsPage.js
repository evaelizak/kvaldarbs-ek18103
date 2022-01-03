import React from 'react';
import AdminCompanyJudging from '../components/admin-components/AdminCompanyJudging';
import NoCompany from '../components/NoCompany';
import Applications from '../components/projects/project-applications/Applications';
import { useProfile } from '../context/profile.context';

const ApplicationsPage = () => {
  const { profile } = useProfile();

  let shownPage;
  if (profile.usertype === 'student') {
    shownPage = <Applications type="student" />;
  } else if (profile.usertype === 'company' && profile.hasCompany === true) {
    shownPage = <Applications type="company" />;
  } else if (profile.usertype === 'company' && profile.hasCompany === false) {
    shownPage = <NoCompany />;
  } else if (profile.usertype === 'admin') {
    shownPage = <AdminCompanyJudging />;
  }

  return <>{shownPage}</>;
};

export default ApplicationsPage;
