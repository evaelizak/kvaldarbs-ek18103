import { ref } from '@firebase/database';
import React from 'react';
import { auth, database } from '../misc/firebase';
import CompanyProjectForm from './CompanyProjectForm';
// component for showing project page for companies

const CompanyProjects = () => {
  const key = auth.currentUser.uid;
  const dbref = ref(database, `/companies/${key}`);
  console.log(dbref);

  return (
    <>
      {/* TODO: add logic to show added projects  */}
      {/* TODO: add logic to show a button to add new project if projects exist + add update, delete logic for projects } */}
      <CompanyProjectForm />
    </>
  );
};

export default CompanyProjects;
