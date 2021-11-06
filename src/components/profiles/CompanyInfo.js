import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import countryList from 'react-select-country-list';
import { auth } from '../../misc/firebase';

const CompanyInfo = () => {
  const [isCompany, setIsCompany] = useState(null);

  const key = auth.currentUser.uid;

  const getData = () => {
    firebase
      .database()
      .ref(`companies/${key}`)
      .on('value', snapshot => {
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
      </>
    );
  } else {
    shown = 'Loading data... ';
  }

  return (
    <>
      <Card>
        {console.log(isCompany ? 'company exists' : "company doesn't exist")}
        {shown}
        {/* TODO: add Modal? to show editable form for the data and the update the database */}
        <Button type="primary">Edit company data</Button>
      </Card>
    </>
  );
};

export default CompanyInfo;
