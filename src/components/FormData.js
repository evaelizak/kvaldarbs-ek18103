import React, { useCallback, useState } from 'react';
import { Button, Form, Input, InputNumber, notification } from 'antd';
import { auth, database } from 'firebase-admin';
import { push, ref, serverTimestamp } from '@firebase/database';

const INITIALFORM = {
  about: 'About yourself... ',
  motivation: 'What makes you special...',
  age: ' ',
  website: 'Your website',
  social: 'Your social media site(s)',
};

const FormData = () => {
  const [formValue, setFormValue] = useState(INITIALFORM);

  const onFormValueChange = useCallback(value => {
    setFormValue(value);
  }, []);
  const submitUserForm = async () => {
    console.log(formValue);
    const newUserForm = {
      ...formValue,
      byUser: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    };
    try {
      console.log(newUserForm);
      await push(ref(database, 'forms'), newUserForm);
    } catch (err) {
      console.log(err.message);
      notification.open({
        message: 'Error has occured, try again later',
        duration: 4,
      });
    }
  };

  // const uploader = {
  //   beforeUpload: file => {
  //     if (file.type !== 'application/pdf') {
  //       notification.error({ message: `${file.type} is not a pdf file` });
  //     }
  //     return file.type === 'application/pdf' ? true : Upload.LIST_IGNORE;
  //   },
  //   onChange: info => {
  //     console.log(info.fileList);
  //   },
  // };
  // console.log(uploader, UploadOutlined);
  // console.log(formValue);

  return (
    <div className="mt-2">
      <Form
        layout="vertical"
        size="middle"
        onChange={onFormValueChange}
        formvalue={formValue}
      >
        <Form.Item name="about" label="About You">
          <Input.TextArea placeholder="input placeholder" />
        </Form.Item>
        <Form.Item name="motivation" label="Motivation">
          <Input.TextArea placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[
            {
              type: 'number',
              min: 0,
              max: 99,
            },
          ]}
        >
          <InputNumber />
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
  );
};

export default FormData;
