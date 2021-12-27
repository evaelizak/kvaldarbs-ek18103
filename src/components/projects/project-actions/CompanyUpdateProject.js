/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
import { ref, update } from 'firebase/database';
import {
  Button,
  Input,
  notification,
  Form,
  message,
  DatePicker,
  Checkbox,
  Select,
  Modal,
} from 'antd';
import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { DateTime } from 'luxon';
import { db } from '../../../misc/firebase';

// component for editing project data
const CompanyUpdateProject = ({
  id,
  companyUser,
  title,
  about,
  reqs,
  startDate,
  endDate,
  deadline,
  payment,
  projectType,
}) => {
  // state for showing the modal for projects
  let setState;
  if (payment) {
    setState = true;
  } else setState = false;
  const [isModalVisible, setIsModalVisible] = useState(false);

  // state for saving the form values from the project form application
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();

  // state for the Paid checkbox
  const [isPaid, setIsPaid] = useState(setState);
  const onCheckboxChange = e => {
    setIsPaid(e.target.checked);
  };

  // submit user form to the database
  const submitUserForm = () => {
    // transforming the form data into json
    const newProjectData = {
      ...formValues,
    };

    // removes all the undefined values in case there are some
    const cleanedData = JSON.parse(JSON.stringify(newProjectData));
    // fixes if the unrequired fields are empty
    if (!cleanedData.endDate) {
      cleanedData.endDate = '';
    }
    if (isPaid === false || !cleanedData.payment) {
      cleanedData.payment = '';
    }

    try {
      // reference to the database
      const projectsRef1 = ref(db, `/companies/${companyUser}/projects/${id}`);
      const projectsRef2 = ref(db, `/projects/${id}`);

      // updates the values that were changed
      update(projectsRef1, {
        title: cleanedData.title,
        about: cleanedData.about,
        reqs: cleanedData.reqs,
        startDate: cleanedData.startDate,
        endDate: cleanedData.endDate,
        appDeadline: cleanedData.appDeadline,
        payment: cleanedData.payment,
        isPaid: isPaid,
        jobType: cleanedData.jobType,
      });
      update(projectsRef2, {
        title: cleanedData.title,
        about: cleanedData.about,
        reqs: cleanedData.reqs,
        startDate: cleanedData.startDate,
        endDate: cleanedData.endDate,
        appDeadline: cleanedData.appDeadline,
        isPaid: isPaid,
        payment: cleanedData.payment,
        jobType: cleanedData.jobType,
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

  const validateMessages = {
    required: `Field is required!`,
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
        Edit Project
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
        <h1 className="text-3xl">Edit your project</h1>
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
            initialValues={{
              title: title,
              about: about,
              reqs: reqs,
              startDate: moment(startDate),
              endDate: endDate ? moment(endDate) : '',
              appDeadline: moment(deadline),
              payment: payment,
              jobType: projectType,
            }}
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
                    if (
                      !getFieldValue('endDate') ||
                      getFieldValue('endDate') === undefined
                    ) {
                      return Promise.resolve();
                    }
                    if (!value || getFieldValue('endDate') > value) {
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
              {/* DateTime.now().toUTC().toFormat("yyyy-MM-dd\'T\'TT"); */}
              <DatePicker format="DD.MM.YYYY" />
            </Form.Item>
            <Form.Item name="isPaid">
              <Checkbox checked={isPaid} onChange={onCheckboxChange}>
                Is Paid
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="payment"
              label="Payment amount"
              hidden={!isPaid}
              rules={[{ required: isPaid }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CompanyUpdateProject;
