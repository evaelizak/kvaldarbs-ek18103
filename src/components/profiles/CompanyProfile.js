/* eslint-disable no-unused-vars */
import { Button, Divider } from 'antd';
import React from 'react';
import { useProfile } from '../../context/profile.context';
import { onSignOut } from '../../misc/auth-functions';
import CompanyInfo from './CompanyInfo';
import NewCompanyForm from '../NewCompanyForm';

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
      <Divider plain>Company info</Divider>
      {/* If the user has a company, then only info will show, if not - the new company form will show */}
      {shownComponent}
    </>
  );
};

export default CompanyProfile;
