// import { onValue, ref } from 'firebase/database';
import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';

import firebase from 'firebase/compat/app';
import { auth } from '../misc/firebase';

// import CompanyProjectCard from './CompanyProjectCard';
import CompanyProjectForm from './CompanyProjectForm';
// import ProjectCard from './ProjectCard';
import Projects from './Projects';
// component for showing project page for companies

const CompanyProjects = () => {
  const key = auth.currentUser.uid;

  const [hasProjects, setHasProjects] = useState(null);

  const getProjectData = () => {
    // const companyprojectdbref = ref(db, `/companies/${key}/projects`);
    // onValue(companyprojectdbref, snapshot => {
    //   projectdata = snapshot.val();
    //   console.log(projectdata);
    // });
    firebase
      .database()
      .ref(`/companies/${key}/projects`)
      .on('value', snapshot => {
        if (snapshot.val()) {
          setHasProjects(true);
        }
      });
  };

  useEffect(() => {
    getProjectData();
    return () => {
      setHasProjects(null); // This worked for me
    };
  }, []);

  // state for showing the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // getting data for projects from the database

  const newProjectBtn = (
    <>
      <Button className="mt-5" type="primary" onClick={setIsModalVisible}>
        Add a new project
      </Button>
      <Modal
        visible={isModalVisible}
        title="Add a new project"
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="ghost" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <CompanyProjectForm />
      </Modal>
    </>
  );

  // let shown;

  // if (hasProjects) {
  //   shown = <Projects type="company" />;
  // }

  return (
    <>
      {/* showing project cards if any are added */}
      {console.log(hasProjects ? 'projects exist' : 'projects dont exist')}
      {hasProjects ? <Projects type="company" /> : 'No projects added... yet!'}
      {/* TODO: add logic to show a button to add new project if projects exist */}
      {/* TODO: + add update, delete logic for projects */}
      {hasProjects ? newProjectBtn : <CompanyProjectForm />}
    </>
  );
};

export default CompanyProjects;
