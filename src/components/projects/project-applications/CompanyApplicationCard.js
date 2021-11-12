import { Button, Card, Col, Divider, notification, Row } from 'antd';
import React from 'react';
// import firebase from 'firebase/compat/app';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import { useList } from 'react-firebase-hooks/database';
import { auth, db } from '../../../misc/firebase';

// component to show data about submitted projects
const CompanyApplicationCard = ({
  title,
  about,
  startDate,
  endDate,
  deadline,
  projectID,
}) => {
  //   about={application.val().about}
  //   companyID={application.val().companyID}
  //   experience={application.val().experience}
  //   motivation={application.val().motivation}
  //   // loading={loading}
  //   type={application.val().type}
  //   byUser={application.val().byUser}

  // fetching the project data from the database
  const projectApplicationRef = db.ref(
    `companies/${auth.currentUser.uid}/projects/${projectID}/applications`
  );

  const [applications, loading, error] = useList(projectApplicationRef);

  // TO DO change this to user data
  // console.log(byUser);
  //   let companyData;
  //   firebase
  //     .database()
  //     .ref(`companies/${companyID}`)
  //     .on('value', snapshot => {
  //       companyData = snapshot.val();
  //     });
  //   console.log('compID ', companyID, ' projectID: ', projectID);

  // the button thats shown in the footer - different for students and companies
  const shownButtonFooter = (
    // TODO: Add logic to disable editing after project deadline
    <>
      <Button>Accept</Button>
      <Button>Reject</Button>
    </>
  );

  const projectInfo = (
    <>
      <Divider />
      <h1 className="text-xl">{title}</h1>
      <h1>{about}</h1>
      <Divider />
      <p>
        <b>Project starts:</b>{' '}
        {!startDate
          ? 'No specified start'
          : DateTime.fromISO(startDate).toFormat('dd.LL.yyyy')}
      </p>
      <p>
        <b>Project ends:</b>{' '}
        {!endDate
          ? 'No specified end'
          : DateTime.fromISO(endDate).toFormat('dd.LL.yyyy')}
      </p>
      <p>
        <b>Application deadline:</b>{' '}
        {!deadline
          ? 'No specified deadline'
          : DateTime.fromISO(deadline).toFormat('dd.LL.yyyy')}
      </p>
    </>
  );

  return (
    <div>
      <div>
        {projectInfo}
        {/* {console.log(DateTime.local().ts)} */}
        {error &&
          notification.error({
            message: 'An error has occured, try again later',
            duration: 4,
          })}
        {!loading && !applications && (
          <>
            <div>No applications received</div>
          </>
        )}
        {!loading && applications && (
          <>
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {applications.map((application, index) => (
                <Col
                  key={index}
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  <Card>
                    <h1 className="text-lg">
                      <b>Status:</b> TBA
                    </h1>
                    <Divider />
                    <p>
                      <b className="text-base">Person is a: </b>
                      {application.val().type}
                    </p>
                    <p>
                      <b className="text-base">About:</b>
                      <ShowMoreText lines={3} more="Show more" less="Show less">
                        {application.val().about}
                      </ShowMoreText>
                    </p>
                    <p>
                      <b className="text-base">Experience:</b>
                      <ShowMoreText lines={3} more="Show more" less="Show less">
                        {application.val().experience}
                      </ShowMoreText>
                    </p>
                    <p>
                      <b className="text-base">Motivation:</b>
                      <ShowMoreText lines={3} more="Show more" less="Show less">
                        {application.val().motivation}
                      </ShowMoreText>
                    </p>
                    {shownButtonFooter}
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyApplicationCard;
