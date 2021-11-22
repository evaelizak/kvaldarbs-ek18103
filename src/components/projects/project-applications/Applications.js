import { Col, Row, notification } from 'antd';
import React from 'react';
import { useList } from 'react-firebase-hooks/database';
import { DateTime } from 'luxon';
import { auth, db } from '../../../misc/firebase';
import StudentApplicationCard from './StudentApplicationCard';
import CompanyApplicationCard from './CompanyApplicationCard';

// component for projects page
const Applications = ({ type = 'student' }) => {
  const key = auth.currentUser.uid;
  // database reference to take either specific company projects or show all for students
  let applicationsRef;
  let isStudent;
  if (type === 'student') {
    applicationsRef = db.ref(`/profiles/${key}/projectApps`);
    isStudent = true;
  } else if (type === 'company') {
    applicationsRef = db.ref(`/companies/${key}/projects`);
    isStudent = false;
  }
  // react firebase hook to get a list of keys from the database reference
  const [applications, loading, error] = useList(applicationsRef);

  //   let returnedCard;
  //   if (type === 'student') {
  //     returnedCard = (
  //       <StudentApplicationCard
  //         projectID={application.key}
  //         about={application.val().about}
  //         companyID={application.val().companyID}
  //         experience={application.val().experience}
  //         motivation={application.val().motivation}
  //         // loading={loading}
  //         type={application.val().type}
  //         byUser={application.val().byUser}
  //       />
  //     );
  //   } else if (type === 'company') {
  //     returnedCard = <CompanyApplicationCard />;
  //   }

  return (
    <div>
      <div>
        {/* {console.log(DateTime.local().ts)} */}
        {error &&
          notification.error({
            message: 'An error has occured, try again later',
            duration: 4,
          })}
        {!loading && !applications && (
          <>
            <div>No applications submitted... / received</div>
          </>
        )}
        {!loading && applications && isStudent && (
          <>
            {/* Mapping the application keys from the database list */}
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {applications.map((application, index) => (
                <Col
                  key={index}
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  {console.log(
                    DateTime.fromISO(application.val().appDeadline) <
                      DateTime.local()
                  )}
                  <StudentApplicationCard
                    projectID={application.key}
                    companyID={application.val().companyID}
                    about={application.val().about}
                    experience={application.val().experience}
                    motivation={application.val().motivation}
                    type={application.val().type}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
        {!loading && applications && !isStudent && (
          <>
            {/* Mapping the application keys from the database list */}
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {applications.map((application, index) => (
                <Col
                  key={index}
                  className="xl:w-full md:w-full sm:w-full  pt-2"
                  // span={{ xs: 24, m: 24 }}
                >
                  <CompanyApplicationCard
                    projectID={application.key}
                    title={application.val().title}
                    about={application.val().about}
                    startDate={application.val().startDate}
                    endDate={application.val().endDate}
                    deadline={application.val().appDeadline}
                    type={type}
                    byUser={application.val().byUser}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default Applications;
