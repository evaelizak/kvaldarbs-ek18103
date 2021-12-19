/* eslint-disable no-unused-vars */
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import { ref, update } from 'firebase/database';
import React, { useState } from 'react';
import { db } from '../../misc/firebase';

const AdminCompanyReject = ({ companyKey }) => {
  // state for showing the modal for projects
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state for saving the form values from the project form application
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();

  const onConfirmation = () => {
    try {
      const companyRef = ref(db, `companies/${companyKey}`);

      update(companyRef, {
        adminMessage: formValues.adminMessage,
      });

      notification.open({
        message: 'Left a rejection message successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.open({
        message: 'An error has occured, try again later',
        duration: 4,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
  console.log(formValues, formValues.adminMessage);

  const handleOk = () => {
    setIsModalVisible(false);
    showRejectConfirm();
  };

  return (
    <>
      <Button
        style={{ borderColor: 'tomato', color: 'tomato' }}
        onClick={setIsModalVisible}
        danger
        className="float-right mt-2"
      >
        Reject
      </Button>
      <Modal
        visible={isModalVisible}
        title="Application form"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onValuesChange={(_, values) => setFormValues(values)}>
          <Form.Item
            name="adminMessage"
            label="Reason for rejection"
            rules={[
              { required: true, message: 'Reason for rejection required' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminCompanyReject;
