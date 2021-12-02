import { Card, Divider } from 'antd';
import React from 'react';
import ShowMoreText from 'react-show-more-text';
import AcceptedApplicationContacts from './AcceptedApplicationContacts';
import CompanyApplicationAccept from './project-application-actions/CompanyApplicationAccept';
import CompanyApplicationReject from './project-application-actions/CompanyApplicationReject';

const CompanyProjectApplicationCard = ({
  type,
  about,
  experience,
  motivation,
  status,
  projectID,
  companyID,
  applicantID,
}) => {
  // the button thats shown in the footer of the application - different if the app has been accepted
  let shownButtonFooter;
  if (status === 'accepted') {
    shownButtonFooter = <AcceptedApplicationContacts />;
  } else if (status === 'rejected') {
    shownButtonFooter = 'you have rejected this';
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
  console.log(status);
  let statusColor;
  if (status === 'accepted') {
    statusColor = 'mediumseagreen';
  } else if (status === 'rejected') {
    statusColor = 'tomato';
  } else statusColor = 'black';

  console.log(statusColor);
  return (
    <>
      <Card>
        <h1 className="text-lg" style={{ color: statusColor }}>
          <b>Status: </b>
          {status}
        </h1>
        <Divider />
        <div>
          <b className="text-base">Person is a: </b>
          {type}
        </div>
        <div className="mt-2">
          <b className="text-base">About:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {about}
          </ShowMoreText>
        </div>
        <div className="mt-2">
          <b className="text-base">Experience:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {experience}
          </ShowMoreText>
        </div>
        <div className="mt-2 mb-5">
          <b className="text-base">Motivation:</b>
          <ShowMoreText lines={3} more="Show more" less="Show less">
            {motivation}
          </ShowMoreText>
        </div>
        {shownButtonFooter}
      </Card>
    </>
  );
};

export default CompanyProjectApplicationCard;
