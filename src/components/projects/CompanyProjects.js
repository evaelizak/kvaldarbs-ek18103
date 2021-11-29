// import { onValue, ref } from 'firebase/database';
import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';

// import firebase from 'firebase/compat/app';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../misc/firebase';

// import CompanyProjectCard from './CompanyProjectCard';
import CompanyCreateProjectForm from './project-actions/CompanyCreateProjectForm';
// import ProjectCard from './ProjectCard';
import Projects from './Projects';
// component for showing project page for companies

const CompanyProjects = () => {
  const key = auth.currentUser.uid;

  const [hasProjects, setHasProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // state for showing the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getProjectData = () => {
    onValue(ref(db, `/companies/${key}/projects`), snapshot => {
      if (snapshot.val()) {
        setHasProjects(true);
      }
    });
    setIsLoading(false);
  };

  // useEffect for getting the project data, it did not work properly otherwise
  useEffect(() => {
    setIsLoading(true);
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
      <Button className="mt-5 mb-5" type="primary" onClick={setIsModalVisible}>
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
      {hasProjects ? newProjectBtn : <CompanyCreateProjectForm />}
      {/* showing project cards if any are added */}
      {isLoading && (
        <>
          <p>Data is loading...</p>
        </>
      )}
      {hasProjects ? (
        <Projects type="company" />
      ) : (
        <p className="pb-2">
          No projects added... yet! Feel free to add one below.
        </p>
      )}
      {/* TODO: + add update logic for projects */}
    </>
  );
};

export default CompanyProjects;
