import { ref, serverTimestamp, set, update } from 'firebase/database';
import { Button, Input, message, notification, Select, Form } from 'antd';
import React, { useMemo, useState } from 'react';
import countryList from 'react-select-country-list';
// import { useProfile } from '../context/profile.context';
import { auth, db } from '../../misc/firebase';

const NewCompanyForm = () => {
  // const { profile } = useProfile();
  const [formValues, setFormValues] = useState({});
  // for using the form from antd
  const [form] = Form.useForm();
  // for getting the country list from react-select-country-list
  const options = useMemo(() => countryList().getData(), []);
  // for showing more fields if the project is paid for

  // function to submit the input data to the database
  const submitUserForm = () => {
    // transforming the form data into json
    const newCompany = {
      ...formValues,
      byUser: auth.currentUser.uid,
      isApproved: false,
      createdAt: serverTimestamp(),
    };
    // removes all the undefined values in case there are some
    const cleanedData = JSON.parse(JSON.stringify(newCompany));
    // reference to the database
    const key = auth.currentUser.uid;
    const dbref = ref(db, `/companies/${key}`);
    try {
      // sets the data
      set(dbref, cleanedData);
      // updates user hasCompany field to true
      // db.ref('/profiles').child(key).update({ hasCompany: true });
      update(ref(db, `/profiles${key}`), { hasCompany: true });
      // profile.hasCompany = true;

      notification.open({
        message: 'Company added successfully!',
        duration: 4,
      });
    } catch (err) {
      notification.open({
        message: err.message,
        duration: 4,
      });
    }
  };
  const onFinish = () => {
    submitUserForm();
  };
  const onFinishFailed = () => {
    message.error('Please check the required fields!');
  };

  return (
    <>
      <h1 className="text-3xl">Make a new company</h1>
      <div className="mt-2">
        <Form
          form={form}
          layout="vertical"
          wrapperCol={{ span: 12 }}
          labelCol={{ span: 6 }}
          onValuesChange={(_, values) => setFormValues(values)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="name"
            label="Company name"
            rules={[{ required: true, message: 'Company name is required' }]}
          >
            <Input placeholder="Input the title" />
          </Form.Item>
          <Form.Item
            name="about"
            label="About The Company"
            rules={[
              {
                required: true,
                message: 'Information about the company is required!',
              },
            ]}
          >
            <Input.TextArea placeholder="input placeholder" />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Select placeholder="Country" options={options} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default NewCompanyForm;
