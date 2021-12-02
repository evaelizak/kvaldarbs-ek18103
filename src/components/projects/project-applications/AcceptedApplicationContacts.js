import { Button, Modal } from 'antd';
import React, { useState } from 'react';

const AcceptedApplicationContacts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={setIsModalVisible}>
        {' '}
        Show applicant contact information
      </Button>
      <Modal
        visible={isModalVisible}
        title="Applicant's contact info"
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="ghost" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        Hello
      </Modal>
    </>
  );
};

export default AcceptedApplicationContacts;
