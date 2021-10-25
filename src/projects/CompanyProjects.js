import { push, ref, serverTimestamp, set } from '@firebase/database';
import { Button, Input, notification, Form } from 'antd';
import React, { useState } from 'react';
import { database, auth } from '../misc/firebase';
// component for showing project page for companies

const CompanyProjects = () => {
  const [formValues, setFormValues] = useState({});

  const [form] = Form.useForm();

  // function to submit the input data to the database
  const submitUserForm = () => {
    // making the form data into a json string
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
        message: 'Error has occured, try again later',
        duration: 4,
      });
    }
  };

  return (
    <>
      <h1 className="text-3xl">Submit a new project</h1>
      <div className="mt-2">
        <Form
          form={form}
          layout="vertical"
          size="middle"
          onValuesChange={(_, values) => setFormValues(values)}
        >
          <Form.Item name="about" label="About You">
            <Input.TextArea placeholder="input placeholder" />
          </Form.Item>
          <Form.Item name="motivation" label="Motivation">
            <Input.TextArea placeholder="input placeholder" />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item name="social" label="Social media">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={submitUserForm}>
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
