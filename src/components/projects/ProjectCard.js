/* eslint-disable no-unused-vars */
import { Button, Card, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import countryList from 'react-select-country-list';
import StudentProjectApply from './project-actions/StudentProjectApply';
import CompanyDeleteProject from './project-actions/CompanyDeleteProject';
import CompanyUpdateProject from './project-actions/CompanyUpdateProject';

// component to show data about submitted projects
const ProjectCard = ({
  title,
  about,
  startDate,
  endDate,
  deadline,
  id,
  type,
  byUser,
}) => {
  // state for showing the clicked tab
  const [activeTab, setActiveTab] = useState('projectTab');

  // fetching the company data from the database
  let companyData;
  firebase
    .database()
    .ref(`companies/${byUser}`)
    .on('value', snapshot => {
      companyData = snapshot.val();
    });

  // if's for changing date format from ISO to a more user friendly format
  if (startDate) {
    startDate = DateTime.fromISO(startDate).toFormat('dd.LL.yyyy');
  }
  if (endDate) {
    endDate = DateTime.fromISO(endDate).toFormat('dd.LL.yyyy');
  }
  if (deadline) {
    deadline = DateTime.fromISO(deadline).toFormat('dd.LL.yyyy');
  }

  const GetFullCountry = countryLabel => {
    const countries = countryList().getData();
    countryLabel = countries.find(country => country.value === countryLabel);
    return countryLabel.label;
  };

  // the button thats shown in the footer - different for students and companies
  let shownButtonFooter;
  if (type === 'student') {
    shownButtonFooter = (
      <StudentProjectApply id={id} title={title} companyID={byUser} />
    );
  } else {
    shownButtonFooter = (
      <>
        <CompanyUpdateProject />
        <CompanyDeleteProject id={id} companyUser={byUser} />
      </>
    );
  }

  // variable for storing company tab data, i had problems with the data not fetching on page load and this was the only way to get around this issue, its dumb
  let companyInfo;
  if (companyData) {
    companyInfo = (
      <>
        <h1 className="text-lg">
          <b>Company:</b> {companyData.name}
        </h1>
        <p>
          <b>Country:</b> {GetFullCountry(companyData.country)}
        </p>
        <p>
          <b>About:</b> {companyData.about}
        </p>
        <p>
          <b>Sector:</b> [TBA] f.e. Medicine, IT
        </p>
      </>
    );
  } else {
    companyInfo = 'Data is loading...';
  }

  // tabs in the card
  const tabList = [
    {
      key: 'projectTab',
      tab: 'Project info',
    },
    {
      key: 'companyTab',
      tab: 'Company info',
    },
  ];

  // list of content to show in the specific tabs in the cards
  const contentList = {
    projectTab: (
      <>
        <h1>
          <b className="text-base">About:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {about}
          </ShowMoreText>
        </h1>
        <Divider />

        <p>
          <b>Project starts:</b> {!startDate ? 'No specified start' : startDate}
        </p>
        <p>
          <b>Project ends:</b> {!endDate ? 'No specified end' : endDate}
        </p>
        <p>
          <b>Application deadline:</b>{' '}
          {!deadline ? 'No specified deadline' : deadline}
        </p>
      </>
    ),
    companyTab: companyInfo,
  };

  return (
    <Card
      headStyle={{ fontSize: '20px' }}
      title={title}
      // loading={loading}
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={key => {
        setActiveTab(key);
      }}
    >
      {contentList[activeTab]}
      {shownButtonFooter}
    </Card>
  );
};

export default ProjectCard;
