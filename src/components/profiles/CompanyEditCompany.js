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
import React, { useMemo, useState } from 'react';
import countryList from 'react-select-country-list';
import { useProfile } from '../../context/profile.context';
import { db } from '../../misc/firebase';

const CompanyEditProfile = ({
  companyName,
  companyAbout,
  companyLocation,
  companyWebsite,
}) => {
  // profile for getting the uid
  const { profile } = useProfile();

  // state for showing the modal for projects
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state for saving the form values from the project form application
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();

  // memo for the country options
  const options = useMemo(() => countryList().getData(), []);

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
      const dbref = ref(db, `companies/${profile.uid}`);

      // updates the values that were changed
      update(dbref, {
        name: cleanedData.name,
        about: cleanedData.about,
        country: cleanedData.country,
        website: cleanedData.website,
      });

      notification.open({
        message: 'Company information edited successfully!',
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
        Edit company data
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
            name: companyName,
            about: companyAbout,
            country: companyLocation,
            website: companyWebsite,
          }}
        >
          <Form.Item />
          <Form.Item
            name="name"
            label="Company name"
            rules={[
              { required: true, message: 'Your company name is required' },
            ]}
          >
            <Input placeholder="Your company name" />
          </Form.Item>
          <Form.Item
            name="about"
            label="About your company"
            rules={[
              {
                required: true,
                message: 'Info about your company is required',
              },
            ]}
          >
            <Input.TextArea placeholder="About your company" />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Select placeholder="Country" options={options} />
          </Form.Item>
          <Form.Item
            name="website"
            label="Company website"
            rules={[
              {
                required: true,
                message: 'Company website is required',
              },
              {
                type: 'url',
              },
            ]}
          >
            <Input placeholder="Your company website (must include https:// at the start)" />
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

export default CompanyEditProfile;
