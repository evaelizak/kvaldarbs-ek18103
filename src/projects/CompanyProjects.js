import { push, ref, serverTimestamp, set } from '@firebase/database';
import { Button, Input, notification, Form, message, DatePicker } from 'antd';
import React, { useState } from 'react';
// import moment from 'moment';
import { database, auth } from '../misc/firebase';
// component for showing project page for companies

const CompanyProjects = () => {
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();

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
      // reference to the database
      const dbref = ref(database, 'projects');
      // pushes the data with a unique id node
      const newPostRef = push(dbref);
      // sets the data
      set(newPostRef, cleanedData);

      notification.open({
        message: 'Project submit successfully!',
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
  // onClick={submitUserForm}
  const onFinish = () => {
    submitUserForm();
  };
  const onFinishFailed = () => {
    message.error('Please check the required fields!');
  };

  // const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

  return (
    <>
      <h1 className="text-3xl">Submit a new project</h1>
      <div className="mt-2">
        <Form
          form={form}
          layout="vertical"
          size="middle"
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

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
      </div>
    </>
  );
};

export default CompanyProjects;
