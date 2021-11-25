/* eslint-disable no-unused-vars */
import { Card, Divider } from 'antd';
import React, { useState } from 'react';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import countryList from 'react-select-country-list';
import { onValue, ref } from 'firebase/database';
import StudentProjectApply from './project-actions/StudentProjectApply';
import CompanyDeleteProject from './project-actions/CompanyDeleteProject';
import CompanyUpdateProject from './project-actions/CompanyUpdateProject';
import { auth, db } from '../../misc/firebase';

// component to show data about submitted projects
const ProjectCard = ({
  title,
  about,
  startDate,
  endDate,
  deadline,
  id,
  type,
  projectType,
  byUser,
  payment,
}) => {
  // state for showing the clicked tab
  const [activeTab, setActiveTab] = useState('projectTab');

  // fetching the company data from the database
  let companyData;
  onValue(ref(db, `companies/${byUser}`), snapshot => {
    companyData = snapshot.val();
  });
  // firebase
  // .database()
  // .ref(`companies/${byUser}`)
  // .on('value', snapshot => {
  //   companyData = snapshot.val();
  // });

  let isStudentApplied;
  // firebase
  //   .database()
  //   .ref(`profiles/${auth.currentUser.uid}/projectApps/${id}`)
  //   .on('value', snapshot => {
  //     isStudentApplied = snapshot.val();
  //   });
  onValue(
    ref(db, `profiles/${auth.currentUser.uid}/projectApps/${id}`),
    snapshot => {
      isStudentApplied = snapshot.val();
    }
  );

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
    if (isStudentApplied) {
      shownButtonFooter = (
        <>
          <span className=" text-gray-500">
            You have already applied to this project
            {/* , to see your application
            and edit or delete, click <a href="/applications">here</a> */}
          </span>
          {/* TODO: Make Homepage have this information, and then just keep the first part of this text */}
        </>
      );
    } else {
      shownButtonFooter = (
        <StudentProjectApply id={id} title={title} companyID={byUser} />
      );
    }
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

  if (!payment) {
    payment = 'unpaid';
  }

  // list of content to show in the specific tabs in the cards
  const contentList = {
    projectTab: (
      <>
        <p>
          <b className="text-base">About:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {about}
          </ShowMoreText>
        </p>
        <p>
          <b>Type: </b> {projectType}
        </p>
        <p>
          <b>Payment: </b> {payment}
        </p>
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
