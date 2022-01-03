import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../misc/firebase';
import CompanyCreateProjectForm from './project-actions/CompanyCreateProjectForm';
import Projects from './Projects';

// component for showing project page for companies
const CompanyProjects = () => {
  const key = auth.currentUser.uid;

  let isApproved;
  onValue(ref(db, `companies/${key}`), snapshot => {
    isApproved = snapshot.val().isApproved;
  });

  const [hasProjects, setHasProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // state for showing the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // getting the project data
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

  let adminMsg;
  if (isApproved === false) {
    onValue(ref(db, `companies/${key}`), snapshot => {
      adminMsg = snapshot.val().adminMessage;
    });
  }

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
      {isApproved === false ? (
        <>
          <div>Your company is not approved yet</div>
          <div>
            {adminMsg ? (
              <>
                <h1 className="text-xl pt-5">
                  {' '}
                  <b>Admin message for rejection: </b>
                  {adminMsg}
                </h1>
              </>
            ) : (
              'An admin will approve or reject your application in the nearest time'
            )}
            {/* <b>Admin message: </b> {!adminMsg : ""} */}
          </div>
        </>
      ) : (
        <>
          {/* showing project cards if any are added */}
          {isLoading && (
            <>
              <p>Data is loading...</p>
            </>
          )}
          {hasProjects ? newProjectBtn : <CompanyCreateProjectForm />}
          {hasProjects ? (
            <Projects type="company" />
          ) : (
            <p className="pb-2">
              No projects added... yet! Feel free to add one below.
            </p>
          )}
          {/* TODO: + add update logic for projects */}
        </>
      )}
    </>
  );
};

export default CompanyProjects;
