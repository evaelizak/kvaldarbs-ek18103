import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { ref, remove, update } from 'firebase/database';
import React from 'react';
import { db } from '../../misc/firebase';

const AdminCompanyAccept = ({ companyKey }) => {
  const onConfirmation = () => {
    try {
      const companyRef = ref(db, `companies/${companyKey}`);

      // changes the application status in the database
      update(companyRef, {
        isApproved: 'true',
      });
      remove(ref(db, `companies/${companyKey}/adminMessage`));

      notification.open({
        message: 'Company accepted successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.open({
        message: 'An error has occured, try again later',
        duration: 4,
      });
    }
  };

  const showAcceptConfirm = () => {
    confirm({
      title: 'Are you sure you want to approve this company?',
      icon: <ExclamationCircleTwoTone twoToneColor="mediumseagreen" />,
      content:
        'This will change the status of the company and let the company post projects',
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
        className="mt-2"
      >
        Accept
      </Button>
    </>
  );
};

export default AdminCompanyAccept;
