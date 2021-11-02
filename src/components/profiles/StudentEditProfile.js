import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, notification } from 'antd';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import { useProfile } from '../../context/profile.context';
import { db } from '../../misc/firebase';

const StudentEditProfile = () => {
  const { profile } = useProfile();

  // state for showing the modal for projects
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state for saving the form values from the project form application
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  // submit user form to the database
  const submitUserForm = () => {
    // transforming the form data into json
    const newUserData = {
      ...formValues,
      usertype: profile.usertype,
      createdAt: profile.createdAt,
    };
    // removes all the undefined values in case there are some
    const cleanedData = JSON.parse(JSON.stringify(newUserData));
    console.log(cleanedData);

    try {
      // reference to the database
      const dbref = ref(db, `profiles/${profile.uid}`);

      // sets the data
      set(dbref, cleanedData);

      notification.open({
        message: 'Profile edited successfully!',
        duration: 4,
      });
    } catch (err) {
      // console.log(err.message);
      notification.open({
        message: err.message,
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
        Edit profile [TBA] - will be a pop up modal with editable info
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

          {/* TO DO: Add logic for uploading CVs, selecting already uploaded CV */}
          {/* <Form.Item
                name="upload"
                label="Upload your CV"
                valuePropName="fileList"
                //   getValueFromEvent={normFile}
              >
                <Upload {...uploader} name="CV" listType=".pdf">
                  <Button icon={<UploadOutlined />}>Upload a PDF</Button>
                </Upload>
              </Form.Item> */}

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

export default StudentEditProfile;
