import { onValue, ref } from '@firebase/database';
import { Modal, Button } from 'antd';
import React, { useState } from 'react';
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

  // state for showing the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // getting data for projects from the database

  const newProjectBtn = (
    <>
      <Button onClick={setIsModalVisible}>Add a new project</Button>
      <Modal
        visible={isModalVisible}
        title="Apply to this project"
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

  // if (projectdata) {
  // }

  return (
    <>
      {/* showing project cards if any are added */}
      {console.log(projectdata ? 'projects exist' : 'projects dont exist')}

      {projectdata ? <CompanyProjectCard /> : 'No projects added... yet!'}
      {/* TODO: add logic to show a button to add new project if projects exist */}
      {/* TODO: + add update, delete logic for projects */}

      {console.log(projectdata ? 'projects exist' : 'projects dont exist')}

      {projectdata ? newProjectBtn : <CompanyProjectForm />}
    </>
  );
};

export default CompanyProjects;
