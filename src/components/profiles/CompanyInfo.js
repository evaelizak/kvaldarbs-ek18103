import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import countryList from 'react-select-country-list';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../../misc/firebase';
import CompanyEditProfile from './CompanyEditProfile';
import CompanyDeleteProfile from './CompanyDeleteProfile';

const CompanyInfo = () => {
  const [isCompany, setIsCompany] = useState(null);

  const key = auth.currentUser.uid;

  const getData = () => {
    onValue(ref(db, `companies/${key}`), snapshot => {
      setIsCompany(snapshot.val());
    });

    console.log('company: ', isCompany);
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
    // return () => {
    //   setIsCompany(null);
    // };
  }, []);

  let shown;
  if (isCompany) {
    const countryLabel = GetFullCountry(isCompany.country);
    shown = (
      <>
        {' '}
        <p>Name: {isCompany.name}</p>
        <p>About: {isCompany.about}</p>
        <p>Location: {countryLabel}</p>
        <CompanyEditProfile
          companyName={isCompany.name}
          companyAbout={isCompany.about}
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
