/* eslint-disable no-unused-vars */
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { onValue, ref, remove, update } from 'firebase/database';
import React from 'react';
import { useListKeys } from 'react-firebase-hooks/database';
import { db, auth } from '../../misc/firebase';

const CompanyDeleteCompany = () => {
  // first there is a list of all projects a company has
  const companyProjectRef = ref(
    db,
    `/companies/${auth.currentUser.uid}/projects/`
  );
  const [companyProject, loading, error] = useListKeys(companyProjectRef);

  const onConfirmation = () => {
    try {
      // then it goes through each project
      companyProject.map((companyProjects, index) => {
        const projectAppRef = ref(
          db,
          `/companies/${auth.currentUser.uid}/projects/${companyProjects}/applications`
        );
        // then for each project it goes through the applications
        onValue(
          projectAppRef,
          snapshot => {
            snapshot.forEach(childSnapshot => {
              const childKey = childSnapshot.key;
              update(
                ref(db, `profiles/${childKey}/projectApps/${companyProjects}`),
                {
                  status: 'check2',
                }
              );
            });
          },
          {
            onlyOnce: true,
          }
        );
        // removes the project from the project node
        remove(ref(db, `projects/${companyProjects}`));
        return console.log('Project has been deleted');
      });

      // updates that the user no longer has a company
      update(ref(db, `profiles/${auth.currentUser.uid}`), {
        hasCompany: false,
      });

      // removes the company from the database
      remove(ref(db, `companies/${auth.currentUser.uid}`));

      notification.open({
        message: 'Company & projects deleted successfully!',
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
      title: 'Are you sure you want to delete your COMPANY?',
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
      <Button onClick={showDeleteConfirm} danger className="mt-2">
        Delete company
      </Button>
    </>
  );
};

export default CompanyDeleteCompany;
