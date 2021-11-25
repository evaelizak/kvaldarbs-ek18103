/* eslint-disable object-shorthand */
import { push, ref, serverTimestamp, update } from 'firebase/database';
import {
  Button,
  Input,
  notification,
  Form,
  message,
  DatePicker,
  Checkbox,
  Select,
} from 'antd';
import React, { useState } from 'react';
import { db, auth } from '../../../misc/firebase';

// component for showing project page for companies
const CompanyCreateProjectForm = () => {
  // TODO: add logic to reset form after submitting
  const [hasProject, setHasProject] = useState(false);

  const [formValues, setFormValues] = useState({});
  // const { profile } = useProfile();
  const [form] = Form.useForm();

  // for showing another field if the project has payment
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
      isPaid: isPaid,
      byUser: auth.currentUser.uid,
      status: '0', // new status
      createdAt: serverTimestamp(),
    };
    // removes all the undefined values in case there are some
    const cleanedData = JSON.parse(JSON.stringify(newProject));

    try {
      // gets the post key
      const newProjectKey = push(ref(db, '/projects/')).key;
      // creates an array where the places to update the data are
      const updates = {};
      // updates the data in projects and under company specific projects
      updates[`/projects/${newProjectKey}`] = cleanedData;
      updates[`/companies/${auth.currentUser.uid}/projects/${newProjectKey}`] =
        cleanedData;
      // updates the data
      update(ref(db), updates);
      form.resetFields();

      // updates the state if there are no projects
      if (!hasProject) {
        setHasProject(true);
      }

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
            <Input placeholder="Input the project title" />
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
            <Input.TextArea placeholder="What is the project about?" />
          </Form.Item>
          <Form.Item
            name="reqs"
            label="Requirements for joining the project"
            rules={[
              {
                required: true,
                message: 'Please specify requirements for applying!',
              },
            ]}
          >
            <Input.TextArea placeholder="Requirements for the perfect candidate" />
          </Form.Item>
          <Form.Item
            name="jobType"
            label="Job type"
            rules={[
              {
                required: true,
                message: 'Choose job type',
              },
            ]}
          >
            <Select placeholder="Select the job type">
              <Select.Option value="part-time">Part time</Select.Option>
              <Select.Option value="full-time">Full time</Select.Option>
              <Select.Option value="temporary">Temporary</Select.Option>
              <Select.Option value="contract">Contract</Select.Option>
              <Select.Option value="internship">Internship</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Project Start Date"
            rules={[
              {
                required: true,
                message: 'Choose the project start date, can be approximate',
              },
            ]}
          >
            <DatePicker showToday format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Project End Date"
            dependencies={['startDate']}
            hasFeedback
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('startDate') < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('End date must be later than start date!')
                  );
                },
              }),
            ]}
          >
            <DatePicker format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="appDeadline"
            label="Project Application Deadline"
            dependencies={['endDate']}
            hasFeedback
            rules={[
              { required: true, message: 'Set the application deadline' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('endDate') === undefined) {
                    return Promise.resolve();
                  }
                  if (!value || getFieldValue('endDate') < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Application deadline must be earlier than project end date!'
                    )
                  );
                },
              }),
            ]}
          >
            <DatePicker format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item name="isPaid">
            <Checkbox checked={isPaid} onChange={onCheckboxChange}>
              Is Paid
            </Checkbox>
          </Form.Item>
          <Form.Item name="payment" label="Payment amount" hidden={!isPaid}>
            <Input />
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

export default CompanyCreateProjectForm;
