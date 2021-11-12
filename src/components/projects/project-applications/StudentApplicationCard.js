/* eslint-disable no-unused-vars */
import { Button, Card, Divider } from 'antd';
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import countryList from 'react-select-country-list';

// component to show data about submitted projects
const StudentApplicationCard = ({
  about,
  experience,
  motivation,
  companyID,
  projectID,
}) => {
  // state for showing the clicked tab
  const [activeTab, setActiveTab] = useState('applicationTab');

  // fetching the project data from the database
  let projectData;
  firebase
    .database()
    .ref(`companies/${companyID}/projects/${projectID}`)
    .on('value', snapshot => {
      projectData = snapshot.val();
    });

  let companyData;
  firebase
    .database()
    .ref(`companies/${companyID}`)
    .on('value', snapshot => {
      companyData = snapshot.val();
    });
  console.log('compID ', companyID, ' projectID: ', projectID);

  // if's for changing date format from ISO to a more user friendly format
  // if (startDate) {
  //   startDate = DateTime.fromISO(startDate).toFormat('dd.LL.yyyy');
  // }
  // if (endDate) {
  //   endDate = DateTime.fromISO(endDate).toFormat('dd.LL.yyyy');
  // }
  // if (deadline) {
  //   deadline = DateTime.fromISO(deadline).toFormat('dd.LL.yyyy');
  // }

  const GetFullCountry = countryLabel => {
    const countries = countryList().getData();
    countryLabel = countries.find(country => country.value === countryLabel);
    return countryLabel.label;
  };

  // the button thats shown in the footer - different for students and companies
  const shownButtonFooter = (
    // TODO: Add logic to disable editing after project deadline
    <>
      <Button>Edit</Button>
      <Button>Delete</Button>
    </>
  );

  // variable for storing company tab data, i had problems with the data not fetching on page load and this was the only way to get around this issue, its dumb
  let projectInfo;
  // console.log(projectData.about);
  if (projectData) {
    // console.log(projectData.title);
    projectInfo = (
      <>
        <div>
          <h1 className="text-lg">
            <b>Company:</b> {companyData.name}
          </h1>
        </div>

        <Divider />
        <h1 className="text-xl">{projectData.title}</h1>
        <h1>{projectData.about}</h1>
        <Divider />
        <p>
          <b>Project starts:</b>{' '}
          {!projectData.startDate
            ? 'No specified start'
            : DateTime.fromISO(projectData.startDate).toFormat('dd.LL.yyyy')}
        </p>
        <p>
          <b>Project ends:</b>{' '}
          {!projectData.endDate
            ? 'No specified end'
            : DateTime.fromISO(projectData.endDate).toFormat('dd.LL.yyyy')}
        </p>
        <p>
          <b>Application deadline:</b>{' '}
          {!projectData.deadline
            ? 'No specified deadline'
            : DateTime.fromISO(projectData.deadline).toFormat('dd.LL.yyyy')}
        </p>
      </>
    );
  } else {
    projectInfo = 'Data is loading...';
  }

  // tabs in the card
  const tabList = [
    {
      key: 'applicationTab',
      tab: 'Application info',
    },
    {
      key: 'projectTab',
      tab: 'Project info',
    },
  ];

  // list of content to show in the specific tabs in the cards
  const contentList = {
    applicationTab: (
      <>
        <p>
          <b className="text-base">About:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {about}
          </ShowMoreText>
        </p>
        <p>
          <b className="text-base">Experience:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {experience}
          </ShowMoreText>
        </p>
        <p>
          <b className="text-base">Motivation:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {motivation}
          </ShowMoreText>
        </p>
      </>
    ),
    projectTab: projectInfo,
  };

  return (
    <Card
      headStyle={{ fontSize: '20px' }}
      title="Your application"
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={key => {
        setActiveTab(key);
      }}
    >
      <h1 className="text-lg">
        <b>Status:</b> TBA
      </h1>
      <Divider />
      {contentList[activeTab]}
      {shownButtonFooter}
    </Card>
  );
};

export default StudentApplicationCard;
