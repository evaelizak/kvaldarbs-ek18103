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
  reqs,
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

  let isStudentApplied;
  onValue(
    ref(db, `profiles/${auth.currentUser.uid}/projectApps/${id}`),
    snapshot => {
      isStudentApplied = snapshot.val();
    }
  );

  let pastDeadline;
  if (DateTime.fromISO(deadline) > DateTime.local()) {
    pastDeadline = false;
  } else pastDeadline = true;

  const startDate2 = startDate;
  const endDate2 = endDate;
  const deadline2 = deadline;

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
    if (isStudentApplied && !pastDeadline) {
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
    } else if (!pastDeadline) {
      shownButtonFooter = (
        <StudentProjectApply id={id} title={title} companyID={byUser} />
      );
    } else shownButtonFooter = 'Project application deadline has expired';
  } else if (type === 'company' && !pastDeadline) {
    shownButtonFooter = (
      <>
        <CompanyUpdateProject
          id={id}
          companyUser={byUser}
          reqs={reqs}
          title={title}
          about={about}
          startDate={startDate2}
          endDate={endDate2}
          deadline={deadline2}
          payment={payment}
          type={type}
          projectType={projectType}
        />
        <CompanyDeleteProject id={id} companyUser={byUser} />
      </>
    );
  } else if (type === 'company' && pastDeadline) {
    shownButtonFooter = (
      <>
        <p>
          Project application deadline has passed, but you can extend the
          deadline
        </p>
        <CompanyUpdateProject
          id={id}
          companyUser={byUser}
          reqs={reqs}
          title={title}
          about={about}
          startDate={startDate2}
          endDate={endDate2}
          deadline={deadline2}
          payment={payment}
          type={type}
          projectType={projectType}
        />
        <CompanyDeleteProject id={id} companyUser={byUser} />
      </>
    );
  } else if (type === 'admin') {
    shownButtonFooter =
      'If there are any issues, please contact the company directly';
  }

  // variable for storing company tab data, i had problems with the data not fetching on page load and this was the only way to get around this issue
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

        <p className="pb-3">
          <b>Website: </b>
          <a
            href={companyData.website}
            rel="noopener noreferrer"
            target="_blank"
          >
            {companyData.website}
          </a>
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
        <div className="pb-3">
          <b className="text-base">About: </b>
          <ShowMoreText
            className="inline"
            lines={3}
            more="Show more"
            less="Show less"
          >
            {about.split('\n').map(item => {
              return (
                <span>
                  {item}
                  <br />
                </span>
              );
            })}
          </ShowMoreText>
        </div>
        <div className="pb-3">
          <b className="text-base">Requirements: </b>
          <ShowMoreText
            className="inline"
            lines={3}
            more="Show more"
            less="Show less"
          >
            {reqs.split('\n').map(item => {
              return (
                <span>
                  {item}
                  <br />
                </span>
              );
            })}
          </ShowMoreText>
        </div>

        <p className="pb-3">
          <b>Type: </b> {projectType}
        </p>
        <p>
          <b>Payment: </b> {payment}
        </p>
        <Divider />

        <p className="pb-3">
          <b>Project starts:</b> {!startDate ? 'No specified start' : startDate}
        </p>
        <p className="pb-3">
          <b>Project ends:</b> {!endDate ? 'No specified end' : endDate}
        </p>
        <p className="pb-3">
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
