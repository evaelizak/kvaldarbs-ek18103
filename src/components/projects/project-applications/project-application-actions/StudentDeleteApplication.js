import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { ref, remove } from 'firebase/database';
// import { auth } from 'firebase-admin';
import React from 'react';
import { db, auth } from '../../../../misc/firebase';

const StudentDeleteApplication = ({ companyID, id }) => {
  const onConfirmation = () => {
    try {
      const applicationRef1 = `companies/${companyID}/projects/${id}/applications/${auth.currentUser.uid}`;
      const applicationRef2 = `profiles/${auth.currentUser.uid}/projectApps/${id}/`;
      // removes the application from the database
      remove(ref(db, applicationRef1));
      remove(ref(db, applicationRef2));
      notification.open({
        message: 'Application deleted successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.error({
        message: 'An error has occured, try again later',
        duration: 4,
      });
    }
  };

  // function for showing the delete confirmation modal
  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this application?',
      icon: <ExclamationCircleTwoTone twoToneColor="#ff3030" />,
      content: 'You will not be able to revert this action',
      okText: 'Yes',
      okType: 'danger primary',
      cancelText: 'No',
      onOk() {
        onConfirmation();
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

export default StudentDeleteApplication;
