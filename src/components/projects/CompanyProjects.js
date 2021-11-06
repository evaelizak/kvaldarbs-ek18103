// import { onValue, ref } from 'firebase/database';
import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';

import firebase from 'firebase/compat/app';
import { auth } from '../../misc/firebase';

// import CompanyProjectCard from './CompanyProjectCard';
import CompanyCreateProjectForm from './project-actions/CompanyCreateProjectForm';
// import ProjectCard from './ProjectCard';
import Projects from './Projects';
// component for showing project page for companies

const CompanyProjects = () => {
  const key = auth.currentUser.uid;

  const [hasProjects, setHasProjects] = useState(null);
  // state for showing the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getProjectData = () => {
    firebase
      .database()
      .ref(`/companies/${key}/projects`)
      .on('value', snapshot => {
        if (snapshot.val()) {
          setHasProjects(true);
        }
      });
  };

  // useEffect for getting the project data, it did not work properly otherwise
  useEffect(() => {
    getProjectData();
    return () => {
      setHasProjects(null);
    };
  }, []);

  // cancel handling for the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // button for adding new project, which opens a modal with the new project form inside
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
        <CompanyCreateProjectForm />
      </Modal>
    </>
  );

  return (
    <>
      {/* showing project cards if any are added */}
      {console.log(hasProjects ? 'projects exist' : 'projects dont exist')}
      {hasProjects ? <Projects type="company" /> : 'No projects added... yet!'}
      {/* TODO: + add update, delete logic for projects */}
      {hasProjects ? newProjectBtn : <CompanyCreateProjectForm />}
    </>
  );
};

export default CompanyProjects;
