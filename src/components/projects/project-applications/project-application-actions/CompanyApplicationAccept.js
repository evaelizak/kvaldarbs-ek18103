/* eslint-disable no-unused-vars */
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { ref, update } from 'firebase/database';
import React from 'react';
import { db } from '../../../../misc/firebase';

const CompanyApplicationAccept = ({ companyID, projectID, applicantID }) => {
  const onConfirmation = () => {
    try {
      const applicationRef1 = ref(
        db,
        `companies/${companyID}/projects/${projectID}/applications/${applicantID}`
      );
      const applicationRef2 = ref(
        db,
        `profiles/${applicantID}/projectApps/${projectID}/`
      );

      // changes the application status in the database
      update(applicationRef1, {
        status: 'accepted',
      });
      update(applicationRef2, {
        status: 'accepted',
      });

      notification.open({
        message: 'Application accepted successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.error({
        message: 'An error has occured, try again later',
        duration: 4,
      });
    }
  };

  const showAcceptConfirm = () => {
    confirm({
      title: 'Are you sure you want to accept this application?',
      icon: <ExclamationCircleTwoTone twoToneColor="mediumseagreen" />,
      content:
        "This will change the status of the application and show you the applicant's contact data",
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        onConfirmation();
      },
      onCancel() {},
    });
  };

  return (
    <>
      <Button
        style={{
          borderColor: 'mediumseagreen',
          color: 'mediumseagreen',
        }}
        onClick={showAcceptConfirm}
      >
        Accept
      </Button>
    </>
  );
};

export default CompanyApplicationAccept;
