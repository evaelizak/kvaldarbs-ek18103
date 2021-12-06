/* eslint-disable object-shorthand */
import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
} from 'antd';
import { ref, update } from 'firebase/database';
import React, { useState } from 'react';
import { auth, db } from '../../../../misc/firebase';

const StudentEditApplication = ({
  about,
  experience,
  motivation,
  cv,
  type,
  id,
  companyID,
}) => {
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
    };

    // removes all the undefined values in case there are any
    const cleanedData = JSON.parse(JSON.stringify(newUserData));

    try {
      // reference to the database
      const applicationRef1 = ref(
        db,
        `companies/${companyID}/projects/${id}/applications/${auth.currentUser.uid}`
      );
      const applicationRef2 = ref(
        db,
        `profiles/${auth.currentUser.uid}/projectApps/${id}/`
      );
      // updates the relevant data
      update(applicationRef1, {
        about: cleanedData.about,
        motivation: cleanedData.motivation,
        experience: cleanedData.experience,
        cv: cleanedData.cv,
      });
      update(applicationRef2, {
        about: cleanedData.about,
        motivation: cleanedData.motivation,
        experience: cleanedData.experience,
        cv: cleanedData.cv,
      });

      notification.open({
        message: 'Application edited successfully!',
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

  const onFinish = () => {
    submitUserForm();
    handleCancel();
  };

  const onFinishFailed = () => {
    message.error('Please check the required fields!');
  };

  return (
    <>
      <Button type="primary" onClick={setIsModalVisible}>
        <EditOutlined />
        Edit
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
            about: about,
            experience: experience,
            motivation: motivation,
            type: type,
            cv: cv,
          }}
        >
          <Form.Item />
          <Form.Item
            name="about"
            label="About Yourself"
            rules={[
              { required: true, message: 'Input some info about yourself' },
            ]}
          >
            <Input.TextArea placeholder="Input some info about yourself" />
          </Form.Item>
          <Form.Item
            name="motivation"
            label="Your motivation to join this project"
            rules={[
              {
                required: true,
                message: 'Input why you would like to join this project',
              },
            ]}
          >
            <Input.TextArea placeholder="Input why you would like to join this project" />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Your Experience"
            rules={[
              {
                required: true,
                message: 'Input your experience relevant to the project',
              },
            ]}
          >
            <Input.TextArea placeholder="Input your experience relevant to the project" />
          </Form.Item>
          <Form.Item
            name="type"
            label="I am a..."
            rules={[
              {
                required: true,
                message: 'Choose your position',
              },
            ]}
          >
            <Select placeholder="Select your position">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="graduate">Graduate</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cv"
            label="Your CV"
            rules={[
              {
                message: 'Add a link to your CV',
              },
              {
                type: 'url',
              },
            ]}
          >
            <Input.TextArea placeholder="Add a link to your CV (Google Drive, Dropbox, etc.)" />
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

export default StudentEditApplication;
