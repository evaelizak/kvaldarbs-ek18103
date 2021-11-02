import { Button, Descriptions, Divider } from 'antd';
import React from 'react';
import { useProfile } from '../../context/profile.context';
import { onSignOut } from '../../misc/auth-functions';
import StudentEditProfile from './StudentEditProfile';

const StudentProfile = () => {
  const { profile, isLoading } = useProfile();
  console.log(isLoading);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-3xl">
          Hey, {profile.username}!
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
          {profile.phone ? profile.phone : 'No phone number set'}
        </Descriptions.Item>
      </Descriptions>

      <StudentEditProfile />
    </>
  );
};

export default StudentProfile;
