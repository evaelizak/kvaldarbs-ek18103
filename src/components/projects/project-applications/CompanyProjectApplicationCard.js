/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { Button, Card, Divider, Drawer } from 'antd';
import { off, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import ShowMoreText from 'react-show-more-text';
import { db } from '../../../misc/firebase';
import AcceptedApplicationContacts from './AcceptedApplicationContacts';
import CompanyApplicationAccept from './project-application-actions/CompanyApplicationAccept';
import CompanyApplicationReject from './project-application-actions/CompanyApplicationReject';

const CompanyProjectApplicationCard = ({
  type,
  about,
  experience,
  motivation,
  status,
  cv,
  projectID,
  companyID,
  applicantID,
}) => {
  const [applicantData, setApplicantData] = useState(null);

  const getData = () => {
    onValue(ref(db, `profiles/${applicantID}`), snapshot => {
      setApplicantData(snapshot.val());
    });
  };
  // use effect hook for getting applicant data
  useEffect(() => {
    getData();
  }, []);

  // the button thats shown in the footer of the application - different if the app has been accepted
  let shownButtonFooter;
  if (status === 'accepted') {
    shownButtonFooter = (
      <AcceptedApplicationContacts applicantID={applicantID} />
    );
  } else if (status === 'rejected') {
    shownButtonFooter = 'You have rejected this application';
  } else
    shownButtonFooter = (
      <>
        <CompanyApplicationAccept
          projectID={projectID}
          companyID={companyID}
          applicantID={applicantID}
        />
        <CompanyApplicationReject
          projectID={projectID}
          companyID={companyID}
          applicantID={applicantID}
        />
      </>
    );
  let statusColor;
  if (status === 'accepted') {
    statusColor = 'mediumseagreen';
  } else if (status === 'rejected') {
    statusColor = 'tomato';
  } else statusColor = 'black';

  return (
    <>
      <Card>
        <h1 className="text-lg" style={{ color: statusColor }}>
          <b>Status: </b>
          {status}
        </h1>
        <Divider plain>Applicant info</Divider>
        <div>
          {applicantData ? (
            <div>
              <b>Name: </b> {applicantData.username}
              <br />
              <b>Age: </b>
              {applicantData.age ? applicantData.age : 'No age set'}
              <br />
              <b>Linkedin: </b>
              {applicantData.linkedin ? applicantData.linkedin : 'Not added'}
              <br />{' '}
            </div>
          ) : (
            'Loading...'
          )}
          <b>Person is a: </b>
          {type}
        </div>
        <Divider plain>Application</Divider>
        <div className="pb-3">
          <b>About:</b>
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
          <b>Experience:</b>
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
          <b>Motivation:</b>
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
        {shownButtonFooter}
      </Card>
    </>
  );
};

export default CompanyProjectApplicationCard;
