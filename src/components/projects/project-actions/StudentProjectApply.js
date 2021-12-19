/* eslint-disable object-shorthand */
import { ref, serverTimestamp, set } from 'firebase/database';
import { Button, Form, Input, message, notification } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { auth, db } from '../../../misc/firebase';

const StudentProjectApply = ({ id, title, companyID }) => {
  // state for showing the modal for projects
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state for saving the form values from the project form application
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();

  // submit user form to the database
  const submitUserForm = () => {
    // transforming the form data into json
    const newProjectAppCompany = {
      ...formValues,
      byUser: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      status: 'pending',
    };

    const newProjectAppStudent = {
      ...formValues,
      byUser: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      companyID: companyID,
    };
    // removes all the undefined values in case there are some
    const cleanedDataCompany = JSON.parse(JSON.stringify(newProjectAppCompany));
    const cleanedDataStudent = JSON.parse(JSON.stringify(newProjectAppStudent));

    try {
      // reference to the database
      const dbrefcompany = ref(
        db,
        `companies/${companyID}/projects/${id}/applications/${auth.currentUser.uid}`
      );

      const dbrefstudent = ref(
        db,
        `profiles/${auth.currentUser.uid}/projectApps/${id}/`
      );

      // sets the data
      set(dbrefcompany, cleanedDataCompany);
      set(dbrefstudent, cleanedDataStudent);

      notification.open({
        message: 'Application submit successfully!',
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
      <Button onClick={setIsModalVisible}>Apply</Button>
      <Modal
        visible={isModalVisible}
        title="Application form"
        onCancel={handleCancel}
        footer={[
          <Button key="back" type="ghost" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <h1 className="pb-3 text-xl ">Apply to {title}</h1>
        <Form
          form={form}
          layout="vertical"
          size="middle"
          onValuesChange={(_, values) => setFormValues(values)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
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
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item
            name="cv"
            label="Your CV"
            rules={[
              {
                message: 'Add a link to your CV',
              },
              {
                type: 'url',
                message: 'Must be a full URL including https://',
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

export default StudentProjectApply;
