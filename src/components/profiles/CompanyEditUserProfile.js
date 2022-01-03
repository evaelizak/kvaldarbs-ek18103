import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, notification } from 'antd';
import { ref, update } from 'firebase/database';
import React, { useState } from 'react';
import { useProfile } from '../../context/profile.context';
import { db } from '../../misc/firebase';

const CompanyEditUserProfile = () => {
  // profile for getting the uid
  const { profile } = useProfile();

  // state for showing the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state for saving the form values from the project form application
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();

  // submit user form to the database
  const submitUserForm = () => {
    // transforming the form data into json
    const newUserData = {
      ...formValues,
    };

    // removes all the undefined values in case there are some
    const cleanedData = JSON.parse(JSON.stringify(newUserData));

    try {
      // reference to the database
      const dbref = ref(db, `profiles/${profile.uid}`);

      // updates the values that were changed
      update(dbref, {
        username: cleanedData.username,
        phone: cleanedData.phone,
        linkedin: cleanedData.linkedin,
      });

      notification.open({
        message: 'Profile edited successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.error({
        message: 'An error has occured, try again later',
        duration: 4,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = () => {
    submitUserForm();
    handleCancel();
  };

  const onFinishFailed = () => {
    message.error('Please check the required fields!');
  };

  return (
    <>
      <Button type="primary" className="mt-3" onClick={setIsModalVisible}>
        <EditOutlined />
        Edit profile
      </Button>
      <Modal
        visible={isModalVisible}
        title="Edit your data"
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="ghost" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          size="middle"
          onValuesChange={(_, values) => setFormValues(values)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            username: profile.username,
            phone: !profile.phone ? '' : profile.phone,
            linkedin: !profile.linkedin ? '' : profile.linkedin,
          }}
        >
          <Form.Item />
          <Form.Item
            name="username"
            label="Your name"
            rules={[{ required: true, message: 'Your name is required' }]}
          >
            <Input placeholder="Your full name" />
          </Form.Item>
          <Form.Item name="phone" label="Your phone number">
            <Input placeholder="Your phone number" />
          </Form.Item>
          <Form.Item
            name="linkedin"
            label="Your LinkedIn profile link"
            rules={[{ type: 'string', min: 6 }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CompanyEditUserProfile;
