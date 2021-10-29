import { onValue, ref } from '@firebase/database';
import { Button, Card } from 'antd';
import React from 'react';
import countryList from 'react-select-country-list';
import { auth, database } from '../../misc/firebase';

const CompanyInfo = () => {
  const key = auth.currentUser.uid;
  const companydbref = ref(database, `/companies/${key}`);
  let companydata;
  onValue(companydbref, snapshot => {
    companydata = snapshot.val();
  });

  const countryData = companydata.country;
  const countries = countryList().getData();
  const fullCountryName = countries.find(
    country => country.value === countryData
  );

  return (
    <>
      <Card>
        <p>Name: {companydata.name}</p>
        <p>About: {companydata.about}</p>
        <p>Location: {fullCountryName.label}</p>
        {/* TODO: add Modal? to show editable form for the data and the update the database */}
        <Button type="primary">Edit company data</Button>
      </Card>
    </>
  );
};

export default CompanyInfo;
