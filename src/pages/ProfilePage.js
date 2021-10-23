import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Upload,
} from 'antd';
import React from 'react';
import { useProfile } from '../context/profile.context';
import { onSignOut } from '../misc/auth-functions';

const ProfilePage = () => {
  const { profile, isLoading } = useProfile();
  console.log(isLoading);

  const uploader = {
    beforeUpload: file => {
      if (file.type !== 'application/pdf') {
        notification.error({ message: `${file.type} is not a pdf file` });
      }
      return file.type === 'application/pdf' ? true : Upload.LIST_IGNORE;
    },
    onChange: info => {
      console.log(info.fileList);
    },
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-3xl">
          Hey, {profile.name}!
          <Button
            className="float-right inline"
            color="red-500"
            danger
            type="primary"
            onClick={onSignOut}
          >
            Sign out
          </Button>
        </h1>
      </div>
      <Divider plain>Your profile info</Divider>
      <Descriptions
        bordered
        size="small"
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="E-mail">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="Phone number">
          {profile.number ? profile.number : 'No phone number set'}
        </Descriptions.Item>
      </Descriptions>
      <Button type="primary" className="mt-3">
        <EditOutlined />
        Edit profile [TBA]
      </Button>
      <Divider plain>Your Application Template</Divider>

      <div className="mt-5 pr-80">
        <Form layout="vertical" size="middle">
          <Form.Item label="About You">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="Motivation">
            <Input.TextArea placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            name={['Age']}
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
          <Form.Item name={['Website']} label="Website">
            <Input />
          </Form.Item>
          <Form.Item name={['Social media']} label="Social media">
            <Input />
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload your CV"
            valuePropName="fileList"
            //   getValueFromEvent={normFile}
          >
            <Upload {...uploader} name="CV" listType=".pdf">
              <Button icon={<UploadOutlined />}>Upload a PDF</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary">Submit</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProfilePage;
