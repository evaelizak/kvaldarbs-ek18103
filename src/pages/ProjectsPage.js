import React from 'react';
import { useProfile } from '../context/profile.context';
import CompanyProjects from '../projects/CompanyProjects';
import StudentProjects from '../projects/StudentProjects';

const ProjectsPage = () => {
  /* This is where the main projects rendering logic will be
   */
  // eslint-disable-next-line no-unused-vars
  const { profile } = useProfile();
  let shownComponent;
  console.log(profile.usertype);
  if (profile.usertype === 'student') {
    shownComponent = <StudentProjects />;
  } else {
    shownComponent = <CompanyProjects />;
  }

  return <>{shownComponent}</>;
};

export default ProjectsPage;
