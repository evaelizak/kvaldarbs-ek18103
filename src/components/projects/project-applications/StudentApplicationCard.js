/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Card, Divider } from 'antd';
import React, { useState } from 'react';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import { onValue, ref } from 'firebase/database';
import StudentDeleteApplication from './project-application-actions/StudentDeleteApplication';
import StudentEditApplication from './project-application-actions/StudentEditApplication';
import { db } from '../../../misc/firebase';

// component to show data about submitted projects
const StudentApplicationCard = ({
  about,
  experience,
  motivation,
  companyID,
  projectID,
  type,
  cv,
  status,
}) => {
  // state for showing the clicked tab
  const [activeTab, setActiveTab] = useState('applicationTab');

  // fetching the project data from the database
  let projectData;
  onValue(ref(db, `companies/${companyID}/projects/${projectID}`), snapshot => {
    projectData = snapshot.val();
  });

  let companyData;
  onValue(ref(db, `companies/${companyID}`), snapshot => {
    companyData = snapshot.val();
  });

  // the button thats shown in the footer - different for students and companies
  let shownButtonFooter;
  if (status !== 'accepted' && status !== 'rejected' && status !== 'deleted') {
    shownButtonFooter = (
      <>
        <StudentEditApplication
          id={projectID}
          companyID={companyID}
          about={about}
          experience={experience}
          motivation={motivation}
          type={type}
          cv={cv}
        >
          Edit
        </StudentEditApplication>
        <StudentDeleteApplication id={projectID} companyID={companyID} />
      </>
    );
  } else if (status === 'deleted') {
    shownButtonFooter = (
      <>
        <p className="text-red-600">This project has been removed :(</p>
        <StudentDeleteApplication id={projectID} companyID={companyID} />{' '}
      </>
    );
  } else {
    shownButtonFooter = (
      <>
        {' '}
        <>You can not edit this anymore</>{' '}
        <StudentDeleteApplication id={projectID} companyID={companyID} />
      </>
    );
  }

  // variable for storing company tab data, i had problems with the data not fetching on page load and this was the only way to get around this issue
  let projectInfo;
  if (projectData) {
    projectInfo = (
      <>
        <div>
          <h1 className="text-lg">
            <b>Company:</b> {companyData.name}
          </h1>
        </div>

        <Divider />
        <div className="pb-3">
          <b>About: </b>
          <ShowMoreText
            className="inline"
            lines={3}
            more="Show more"
            less="Show less"
          >
            {projectData.about.split('\n').map(item => {
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
          <b>Requirements: </b>
          <ShowMoreText
            className="inline"
            lines={3}
            more="Show more"
            less="Show less"
          >
            {projectData.reqs.split('\n').map(item => {
              return (
                <span>
                  {item}
                  <br />
                </span>
              );
            })}{' '}
          </ShowMoreText>
        </div>
        <p className="pb-3">
          <b>Type: </b> {projectData.jobType}
        </p>
        <p>
          <b>Payment: </b>
          {projectData.payment ? projectData.payment : 'unpaid'}
        </p>

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
    projectInfo = (
      <div>Project has been deleted or data is still loading...</div>
    );
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
        <div className="pb-3">
          <b className="text-base">About:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
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
          <b className="text-base">Experience:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {experience.split('\n').map(item => {
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
          <b className="text-base">Motivation:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {motivation.split('\n').map(item => {
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
          {cv ? (
            <a href={cv} target="_blank" rel="noopener noreferrer">
              <b className="text-base">CV link</b>
            </a>
          ) : (
            <b className="text-base">No CV added</b>
          )}
        </div>
      </>
    ),
    projectTab: projectInfo,
  };

  let statusColor;
  if (status === 'accepted') {
    statusColor = 'mediumseagreen';
  } else if (status === 'rejected') {
    statusColor = 'tomato';
  } else statusColor = 'black';

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
      <h1 className="text-lg" style={{ color: statusColor }}>
        <b>Status:</b> {status}
      </h1>
      <Divider />
      {contentList[activeTab]}
      {shownButtonFooter}
    </Card>
  );
};

export default StudentApplicationCard;
