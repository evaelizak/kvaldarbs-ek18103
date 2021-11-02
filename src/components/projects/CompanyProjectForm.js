import { serverTimestamp } from 'firebase/database';
import {
  Button,
  Input,
  notification,
  Form,
  message,
  DatePicker,
  Checkbox,
  InputNumber,
} from 'antd';
import React, { useState } from 'react';
// import { useProfile } from '../context/profile.context';
// import moment from 'moment';
import { db, auth } from '../../misc/firebase';
// component for showing project page for companies

const CompanyProjectForm = () => {
  // TODO: add logic to reset form after submitting
  const [hasProject, setHasProject] = useState(false);
  console.log(hasProject);

  const [formValues, setFormValues] = useState({});
  // const { profile } = useProfile();
  const [form] = Form.useForm();

  // for showing more fields if the project is paid for
  const [isPaid, setIsPaid] = useState(false);
  const onCheckboxChange = e => {
    setIsPaid(e.target.checked);
  };
  // in case there isn't a set message for validation
  const validateMessages = {
    required: `Field is required!`,
  };

  // function to submit the input data to the database
  const submitUserForm = () => {
    // transforming the form data into json
    const newProject = {
      ...formValues,
      byUser: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    };
    // removes all the undefined values in case there are some
    const cleanedData = JSON.parse(JSON.stringify(newProject));

    try {
      // gets the post key
      const newProjectKey = db.ref('/projects/').push().key;
      // creates an array where the places to update the data are
      const updates = {};
      // updates the data in projects and under company specific projects
      updates[`/projects/${newProjectKey}`] = cleanedData;
      updates[`/companies/${auth.currentUser.uid}/projects/${newProjectKey}`] =
        cleanedData;
      // updates the data
      db.ref().update(updates);
      form.resetFields();

      setHasProject(true);

      // reference to the database
      // const dbref = ref(database, `companies/${profile.uid}/projects`);
      // pushes the data with a unique id node
      // const newPostRef = push(dbref);
      // sets the data
      //  set(newPostRef, cleanedData);

      notification.open({
        message: 'Project submit successfully!',
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
      <h1 className="text-3xl">Submit a new project</h1>
      <div className="mt-2">
        <Form
          form={form}
          layout="vertical"
          size="middle"
          wrapperCol={{ span: 16 }}
          labelCol={{ span: 10 }}
          validateMessages={validateMessages}
          onValuesChange={(_, values) => setFormValues(values)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="title"
            label="Project Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Input the title" />
          </Form.Item>
          <Form.Item
            name="about"
            label="About The Project"
            rules={[
              {
                required: true,
                message: 'Information about the project is required!',
              },
            ]}
          >
            <Input.TextArea placeholder="input placeholder" />
          </Form.Item>
          <Form.Item name="startDate" label="Project Start Date">
            <DatePicker showToday format="DD MM YYYY" />
          </Form.Item>
          <Form.Item name="endDate" label="Project End Date">
            <DatePicker format="DD MM YYYY" />
          </Form.Item>
          <Form.Item name="appDeadline" label="Project Application Deadline">
            <DatePicker format="DD MM YYYY" />
          </Form.Item>
          <Form.Item name="isPaid">
            <Checkbox checked={isPaid} onChange={onCheckboxChange}>
              Is Paid
            </Checkbox>
          </Form.Item>
          <Form.Item name="payment" label="Payment amount" hidden={!isPaid}>
            <InputNumber />
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

export default CompanyProjectForm;
