/* eslint-disable no-nested-ternary */
import { Col, Row, notification, Select, Checkbox } from 'antd';
import React, { useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { DateTime } from 'luxon';
import { equalTo, orderByChild, query, ref } from 'firebase/database';
import { auth, db } from '../../../misc/firebase';
import StudentApplicationCard from './StudentApplicationCard';
import CompanyApplications from './CompanyApplications';

const Applications = ({ type = 'student' }) => {
  const key = auth.currentUser.uid;

  // sorting state
  const [sortChild, setSortChild] = useState('appDeadline');
  // changing the sort value
  const changeSort = value => {
    setSortChild(value);
  };

  // for showing the correct component
  let isStudent;
  if (type === 'student') {
    isStudent = true;
  } else if (type === 'company') {
    isStudent = false;
  }

  const [showExpired, setShowExpired] = useState(false);
  const onCheckboxChange = e => {
    setShowExpired(e.target.checked);
  };

  const studentRef = ref(db, `/profiles/${key}/projectApps`);
  const companyRef = ref(db, `/companies/${key}/projects`);

  // for showing the chosen sorting
  let applicationsRef;
  if (type === 'student') {
    if (sortChild !== 'appDeadline') {
      applicationsRef = query(
        studentRef,
        orderByChild('status'),
        equalTo(sortChild)
      );
    } else applicationsRef = query(studentRef, orderByChild(sortChild));
  } else if (type === 'company') {
    if (sortChild === 'isPaid') {
      applicationsRef = query(
        companyRef,
        orderByChild('isPaid'),
        equalTo(true)
      );
    } else if (
      sortChild !== 'appDeadline' &&
      sortChild !== 'startDate' &&
      sortChild !== 'endDate'
    ) {
      applicationsRef = query(
        companyRef,
        orderByChild('jobType'),
        equalTo(sortChild)
      );
    } else applicationsRef = query(companyRef, orderByChild(sortChild));
  }

  // react firebase hook to get a list of keys from the database reference
  const [applications, loading, error] = useList(applicationsRef);

  return (
    <div>
      <div>
        {error &&
          notification.error({
            message: 'An error has occured, try again later',
            duration: 4,
          })}
        {(!loading && !applications) ||
          (applications.length < 1 && (
            <>
              <div>No applications here... </div>
            </>
          ))}
        {!loading && applications && isStudent && (
          <>
            <div>
              Filter by:
              <Select
                defaultValue={sortChild}
                style={{ width: 200 }}
                onChange={changeSort}
              >
                <Select.Option value="appDeadline">
                  Application deadline
                </Select.Option>
                <Select.Option value="accepted">Status: Accepted</Select.Option>
                <Select.Option value="rejected">Status: Rejected</Select.Option>
                <Select.Option value="pending">Status: Pending</Select.Option>
                <Select.Option value="deleted">Status: Deleted</Select.Option>
              </Select>
            </div>
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
                    status={application.val().status}
                    experience={application.val().experience}
                    motivation={application.val().motivation}
                    type={application.val().type}
                    cv={application.val().cv}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
        {!loading && applications && !isStudent && (
          <>
            <div>
              Filter by:
              <Select
                defaultValue={sortChild}
                style={{ width: 200 }}
                onChange={changeSort}
              >
                <Select.Option value="appDeadline">
                  Application Deadline
                </Select.Option>
                <Select.Option value="startDate">
                  Project Start Deadline
                </Select.Option>
                <Select.Option value="endDate">Project End Date</Select.Option>
                <Select.Option value="part-time">Type: Part time</Select.Option>
                <Select.Option value="full-time">Type: Full time</Select.Option>
                <Select.Option value="contract">Type: Contract</Select.Option>
                <Select.Option value="temporary">Type: Temporary</Select.Option>
                <Select.Option value="internship">
                  Type: Internship
                </Select.Option>
                <Select.Option value="isPaid">Is Paid</Select.Option>
              </Select>
              <span className="ml-5">Show already started projects</span>{' '}
              <Checkbox checked={showExpired} onChange={onCheckboxChange} />
            </div>
            {/* Mapping the application keys from the database list */}
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {applications.map((application, index) =>
                showExpired ? (
                  <Col
                    key={index}
                    className="xl:w-full md:w-full sm:w-full  pt-2"
                    // span={{ xs: 24, m: 24 }}
                  >
                    <CompanyApplications
                      projectID={application.key}
                      title={application.val().title}
                      about={application.val().about}
                      reqs={application.val().reqs}
                      jobType={application.val().jobType}
                      startDate={application.val().startDate}
                      endDate={application.val().endDate}
                      deadline={application.val().appDeadline}
                      type={type}
                      payment={application.val().payment}
                      byUser={application.val().byUser}
                    />
                  </Col>
                ) : DateTime.fromISO(application.val().startDate) >
                  DateTime.local() ? (
                  <Col
                    key={index}
                    className="xl:w-full md:w-full sm:w-full  pt-2"
                    // span={{ xs: 24, m: 24 }}
                  >
                    <CompanyApplications
                      projectID={application.key}
                      title={application.val().title}
                      about={application.val().about}
                      reqs={application.val().reqs}
                      jobType={application.val().jobType}
                      payment={application.val().payment}
                      startDate={application.val().startDate}
                      endDate={application.val().endDate}
                      deadline={application.val().appDeadline}
                      type={type}
                      byUser={application.val().byUser}
                    />
                  </Col>
                ) : (
                  ' '
                )
              )}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default Applications;
