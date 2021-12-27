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
        Show contact info
      </Button>

      <Modal
        visible={isModalVisible}
        title="Applicant's contact info"
        onClose={handleCancel}
        onCancel={handleCancel}
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
            <p>
              <b>Linkedin</b>{' '}
              {applicantData.linkedin
                ? applicantData.linkedin
                : 'No linkedin added'}
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
