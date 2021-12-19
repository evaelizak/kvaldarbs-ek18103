import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Tooltip } from 'antd';
import React from 'react';
import { useProfile } from '../../context/profile.context';
import { onSignOut } from '../../misc/auth-functions';
import CompanyEditUserProfile from './CompanyEditUserProfile';
import CompanyInfo from './CompanyInfo';
import NewCompanyForm from './NewCompanyForm';

const CompanyProfile = () => {
  // for getting profile data
  const { profile } = useProfile();
  let shownComponent;
  console.log('has company:', profile.hasCompany);
  if (profile.hasCompany === true) {
    shownComponent = <CompanyInfo />;
  } else {
    shownComponent = <NewCompanyForm />;
  }

  // for saving form values
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
      <Divider>Your profile info</Divider>
      <Divider plain>Contact info</Divider>
      <Descriptions
        bordered
        size="small"
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="E-mail">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="Phone number">
          {profile.phone ? profile.phone : 'No phone number set'}
          <Tooltip title="Used for contact information" placement="topRight">
            <QuestionCircleOutlined className="float-right" />
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Your LinkedIn">
          {profile.linkedin ? profile.linkedin : 'LinkedIn not added'}
          <Tooltip title="Used for contact information" placement="topRight">
            <QuestionCircleOutlined className="float-right" />
          </Tooltip>
        </Descriptions.Item>
      </Descriptions>
      <CompanyEditUserProfile />

      <Divider>Company info</Divider>
      {/* If the user has a company, then only info will show, if not - the new company form will show */}
      {shownComponent}
    </>
  );
};

export default CompanyProfile;
