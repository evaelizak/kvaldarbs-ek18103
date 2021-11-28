import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import countryList from 'react-select-country-list';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../misc/firebase';
import CompanyEditProfile from './CompanyEditProfile';
import CompanyDeleteProfile from './CompanyDeleteProfile';

const CompanyInfo = () => {
  const [hasCompany, setHasCompany] = useState(null);

  const key = auth.currentUser.uid;

  const getData = () => {
    onValue(ref(db, `companies/${key}`), snapshot => {
      setHasCompany(snapshot.val());
    });
  };

  // function for showing the full country name, because the database contains only short 2 letter name, f.e. LV -> Latvia
  const GetFullCountry = countryLabel => {
    const countries = countryList().getData();
    countryLabel = countries.find(country => country.value === countryLabel);
    return countryLabel.label;
  };

  // use effect hook for showing the company data once it is loaded properly
  useEffect(() => {
    getData();
  }, []);

  let shown;
  if (hasCompany) {
    const countryLabel = GetFullCountry(hasCompany.country);
    shown = (
      <>
        {' '}
        <p>Name: {hasCompany.name}</p>
        <p>About: {hasCompany.about}</p>
        <p>Location: {countryLabel}</p>
        <CompanyEditProfile
          companyName={hasCompany.name}
          companyAbout={hasCompany.about}
          companyLocation={countryLabel}
        />
      </>
    );
  } else {
    shown = 'Loading data... ';
  }

  return (
    <>
      <Card>{shown}</Card>
      <CompanyDeleteProfile />
    </>
  );
};

export default CompanyInfo;
