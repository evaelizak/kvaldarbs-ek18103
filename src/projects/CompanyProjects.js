import { onValue, ref } from '@firebase/database';
import React from 'react';

import { auth, database } from '../misc/firebase';
import CompanyProjectCard from './CompanyProjectCard';
import CompanyProjectForm from './CompanyProjectForm';
// component for showing project page for companies

const CompanyProjects = () => {
  const key = auth.currentUser.uid;

  let projectdata;
  const companyprojectdbref = ref(database, `/companies/${key}/projects`);
  onValue(companyprojectdbref, snapshot => {
    projectdata = snapshot.val();
    console.log(projectdata);
  });

  // dbref.on('projects', snapshot => {
  //   const data = snapshot.val();
  //   console.log(data);
  // });

  // console.log(dbref);

  return (
    <>
      {projectdata ? <CompanyProjectCard /> : 'No projects added... yet!'}
      {/* <CompanyProjectCard /> */}
      {/* TODO: add logic to show added projects  */}
      {/* TODO: add logic to show a button to add new project if projects exist */}
      {/* TODO: + add update, delete logic for projects */}
      <CompanyProjectForm />
    </>
  );
};

export default CompanyProjects;
