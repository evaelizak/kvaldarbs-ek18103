/* eslint-disable no-unused-vars */
import { Button, Drawer, Modal } from 'antd';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../../../misc/firebase';

const AcceptedApplicationContacts = ({ applicantID }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [applicantData, setApplicantData] = useState(null);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getData = () => {
    onValue(ref(db, `profiles/${applicantID}`), snapshot => {
      setApplicantData(snapshot.val());
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Button type="primary" onClick={setIsModalVisible}>
        {' '}
        Show applicant contact information
      </Button>

      <Modal
        // title="Basic Drawer"
        //         placement="right"
        //         // closable={true}
        //         onClose={onDrawerClose()}
        //         visible={false}
        //         getContainer={false}
        //         style={{ position: 'absolute' }}

        visible={isModalVisible}
        title="Applicant's contact info"
        onClose={handleCancel}
        footer={[
          <Button key="back" type="ghost" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {applicantData ? (
          <>
            <p>
              <b>Name: </b>
              {applicantData.username}{' '}
            </p>
            <p>
              <b>Email:</b> {applicantData.email}{' '}
            </p>
            <p>
              <b>Phone number:</b>{' '}
              {applicantData.phone
                ? applicantData.phone
                : 'No phone number added'}
            </p>
          </>
        ) : (
          'no'
        )}
      </Modal>
    </>
  );
};

export default AcceptedApplicationContacts;
