import React from 'react';
import { useProfile } from '../context/profile.context';
import CompanyProjects from '../components/projects/CompanyProjects';
import Projects from '../components/projects/Projects';
// import StudentProjects from '../projects/StudentProjects';

const ProjectsPage = () => {
  /* This is where the main projects rendering logic will be
   */
  // eslint-disable-next-line no-unused-vars
  const { profile } = useProfile();
  let shownComponent;
  if (profile.usertype === 'student') {
    shownComponent = <Projects />;
  } else if (profile.usertype === 'company') {
    shownComponent = <CompanyProjects />;
  } else if (profile.usertype === 'admin') {
    shownComponent = <Projects type="admin" />;
  }

  return <>{shownComponent}</>;
};

export default ProjectsPage;
