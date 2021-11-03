/* eslint-disable no-unused-vars */
import { Button, Card, Divider } from 'antd';
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import StudentProjectApply from './StudentProjectApply';

// component to show data about submitted projects
const ProjectCard = ({
  loading,
  title,
  about,
  startDate,
  endDate,
  deadline,
  id,
  type,
  byUser,
}) => {
  const [activeTab, setActiveTab] = useState('projectTab');

  if (startDate) {
    startDate = DateTime.fromISO(startDate).toFormat('dd.LL.yyyy');
  }
  if (endDate) {
    endDate = DateTime.fromISO(endDate).toFormat('dd.LL.yyyy');
  }
  if (deadline) {
    deadline = DateTime.fromISO(deadline).toFormat('dd.LL.yyyy');
  }

  let company;
  let showCompany;

  firebase
    .database()
    .ref(`companies/${byUser}`)
    .on('value', snapshot => {
      company = snapshot.val();
    });

  if (!company) {
    showCompany = 'none';
  } else {
    showCompany = company.name;
  }
  // useEffect(() => {
  //   getData();
  //   console.log('company:', company);
  //   console.log('show: ', showCompany);
  //   // console.log(company);
  //   // return () => {
  //   //   company = null;
  //   // };
  // }, []);

  let shownButtonFooter;
  if (type === 'student') {
    shownButtonFooter = <StudentProjectApply id={id} title={title} />;
  } else {
    shownButtonFooter = (
      <>
        <Button type="primary">Edit</Button>{' '}
        <Button danger className="float-right">
          Delete
        </Button>
      </>
    );
  }

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
    companyTab: (
      <>
        <h1 className="text-lg">
          <b>Company:</b> {showCompany}
        </h1>
        <p>
          <b>About:</b> {company.about}
        </p>
        <p>
          <b>Sector:</b> [TBA] f.e. Medicine, IT
        </p>
      </>
    ),
  };

  return (
    <Card
      title={title}
      loading={loading}
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={key => {
        setActiveTab(key);
      }}
      // className="h-full w-full"
    >
      {contentList[activeTab]}
      {/* <p>{projectInfo}</p> */}
      {/* <p>
        {console.log('show company', showCompany)}
        <b>Company:</b> {showCompany}
      </p>
      <Divider />
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

      {/* <p>{projectInfo.about}</p> */}
      {/* <p>{data.title}</p> */}
      {shownButtonFooter}
    </Card>
  );
};

export default ProjectCard;
