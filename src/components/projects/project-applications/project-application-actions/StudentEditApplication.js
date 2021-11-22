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
// import { useProfile } from '../../../../context/profile.context';
import { auth, db } from '../../../../misc/firebase';

const StudentEditApplication = ({
  about,
  experience,
  motivation,
  type,
  // status,
  id,
  companyID,
}) => {
  // profile for getting the uid
  // const { profile } = useProfile();
  //  console.log(status);
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

    // removes all the undefined values in case there are some

    const cleanedData = JSON.parse(JSON.stringify(newUserData));
    // const updateData = {
    //   about: cleanedData.about,
    //   motivation: cleanedData.motivation,
    //   experience: cleanedData.experience,
    //   status: 'edited',
    // };

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

      update(applicationRef1, {
        about: cleanedData.about,
        motivation: cleanedData.motivation,
        experience: cleanedData.experience,
        sortStatus: '1',
      });
      update(applicationRef2, {
        about: cleanedData.about,
        motivation: cleanedData.motivation,
        experience: cleanedData.experience,
        sortStatus: '1',
      });

      // const updates = {};
      // // updates the data in projects and under company specific projects
      // updates[`${applicationRef1}`] = updateData;
      // updates[`${applicationRef2}`] = updateData;
      // // updates the data
      // db.ref().update(updates);

      notification.open({
        message: 'Company information edited successfully!',
        duration: 4,
      });
    } catch (err) {
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
      <Button type="primary" onClick={setIsModalVisible}>
        <EditOutlined />
        Edit application
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
