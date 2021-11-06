import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { ref, remove } from 'firebase/database';
// import { auth } from 'firebase-admin';
import React from 'react';
import { db } from '../../../misc/firebase';

const CompanyDeleteProject = ({ id, companyUser }) => {
  const onConfirmation = () => {
    try {
      const projectsRef1 = `/projects/${id}`;
      const projectsRef2 = `/companies/${companyUser}/projects/${id}`;
      // removes the project from the database
      remove(ref(db, projectsRef1));
      remove(ref(db, projectsRef2));

      notification.open({
        message: 'Project deleted successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.open({
        message: err.message,
        duration: 4,
      });
    }

    console.log('confirmed');
  };

  // function for showing the delete confirmation modal
  const showDeleteConfirm = () => {
    console.log(id);
    confirm({
      title: 'Are you sure you want to delete this project?',
      icon: <ExclamationCircleTwoTone twoToneColor="#ff3030" />,
      content: 'You will not be able to revert this action',
      okText: 'Yes',
      okType: 'danger primary',
      cancelText: 'No',
      onOk() {
        onConfirmation();
        console.log('OK');
      },
      onCancel() {},
    });
  };

  return (
    <>
      <Button onClick={showDeleteConfirm} danger className="float-right">
        Delete
      </Button>
    </>
  );
};

export default CompanyDeleteProject;
