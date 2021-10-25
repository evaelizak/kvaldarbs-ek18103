import React from 'react';
import CompanyProjects from '../projects/CompanyProjects';
import StudentProjects from '../projects/StudentProjects';

const ProjectsPage = () => {
  /* This is where the main projects rendering logic will be
   */
  return (
    <>
      <CompanyProjects />
      <StudentProjects />
    </>
  );
};

export default ProjectsPage;
