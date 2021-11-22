import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { ref, update } from 'firebase/database';
import React from 'react';
import { db } from '../../../../misc/firebase';

const CompanyApplicationReject = ({ companyID, projectID, applicantID }) => {
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

      update(applicationRef1, {
        status: 'rejected',
      });
      update(applicationRef2, {
        status: 'rejected',
      });

      notification.open({
        message: 'Application rejected successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.open({
        message: err.message,
        duration: 4,
      });
    }
  };

  // function for showing the delete confirmation modal
  const showRejectConfirm = () => {
    confirm({
      title: 'Are you sure you want to reject this application?',
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
      <Button
        style={{ borderColor: 'tomato', color: 'tomato' }}
        onClick={showRejectConfirm}
        danger
        className="float-right"
      >
        Reject
      </Button>
    </>
  );
};

export default CompanyApplicationReject;
