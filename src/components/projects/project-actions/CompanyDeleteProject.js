import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
// eslint-disable-next-line no-unused-vars
import { query, ref, remove, update } from 'firebase/database';
// import { auth } from 'firebase-admin';
import React from 'react';
import { useListKeys } from 'react-firebase-hooks/database';
import { db } from '../../../misc/firebase';

const CompanyDeleteProject = ({ id, companyUser }) => {
  const projectsRef3 = ref(
    db,
    `/companies/${companyUser}/projects/${id}/applications`
  );
  const [studentProjectApps, loading, error] = useListKeys(projectsRef3);

  const onConfirmation = () => {
    try {
      const projectsRef1 = `/projects/${id}`;
      const projectsRef2 = `/companies/${companyUser}/projects/${id}`;

      studentProjectApps.map((studentProjectApp, index) => (
        <>
          {update(ref(db, `profiles/${studentProjectApp}/projectApps/${id}`), {
            status: 'deleted',
          })}
          {console.log('1', studentProjectApp, index, loading, error)}
        </>
      ));

      // removes the project from the database
      remove(ref(db, projectsRef1));
      remove(ref(db, projectsRef2));

      notification.open({
        message: 'Project deleted successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.open({
        message: 'An error has occured, try again later',
        duration: 4,
      });
    }
  };

  // function for showing the delete confirmation modal
  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this project?',
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

export default CompanyDeleteProject;
