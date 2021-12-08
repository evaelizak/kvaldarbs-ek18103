/* eslint-disable no-unused-vars */
import { Col, Row, notification, Select } from 'antd';
import React, { useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { DateTime } from 'luxon';
import { equalTo, orderByChild, query, ref } from 'firebase/database';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import ProjectCard from './ProjectCard';
import { auth, db } from '../../misc/firebase';

// component for projects page
const Projects = ({ type = 'student' }) => {
  const key = auth.currentUser.uid;
  const [sortChild, setSortChild] = useState('appDeadline');
  const [showExpired, setShowExpired] = useState(false);
  const onCheckboxChange = e => {
    setShowExpired(e.target.checked);
  };
  const studentRef = ref(db, '/projects');
  const companyRef = ref(db, `/companies/${key}/projects`);
  // database reference to take either specific company projects or show all for students
  let projectsRef;
  if (type === 'student') {
    if (sortChild === 'isPaid') {
      projectsRef = query(studentRef, orderByChild('isPaid'), equalTo(true));
    } else if (sortChild !== 'appDeadline' && sortChild !== 'startDate') {
      projectsRef = query(
        studentRef,
        orderByChild('jobType'),
        equalTo(sortChild)
      );
    } else projectsRef = query(ref(studentRef), orderByChild(sortChild));
  } else if (type === 'company') {
    if (sortChild === 'isPaid') {
      projectsRef = query(companyRef, orderByChild('isPaid'), equalTo(true));
    } else if (sortChild !== 'appDeadline' && sortChild !== 'startDate') {
      projectsRef = query(
        companyRef,
        orderByChild('jobType'),
        equalTo(sortChild)
      );
    } else projectsRef = query(companyRef, orderByChild(sortChild));
  }
  // react firebase hook to get a list of keys from the database reference
  const [projects, loading, error] = useList(projectsRef);

  const changeSort = value => {
    setSortChild(value);
  };

  return (
    <div>
      <div>
        {/* {console.log(DateTime.local().ts)} */}
        {error &&
          notification.error({
            message: 'An error has occured, try again later',
            duration: 4,
          })}
        {(!loading && !projects) ||
          (projects.length < 1 && (
            <>
              <div className="pb-5 text-xl">No projects here...</div>
            </>
          ))}
        {!loading && projects && (
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
                  Project Start Date
                </Select.Option>
                <Select.Option value="part-time">Type: Part time</Select.Option>
                <Select.Option value="full-time">Type: Full time</Select.Option>
                <Select.Option value="contract">Type: Contract</Select.Option>
                <Select.Option value="temporary">Type: Temporary</Select.Option>
                <Select.Option value="internship">
                  Type: Internship
                </Select.Option>
                <Select.Option value="isPaid">Is Paid</Select.Option>
              </Select>
              <span className="ml-5">Show expired</span>{' '}
              <Checkbox checked={showExpired} onChange={onCheckboxChange} />
            </div>

            {/* Mapping the projects keys from the database list */}
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {projects.map((project, index) =>
                // eslint-disable-next-line no-nested-ternary
                showExpired ? (
                  <Col
                    key={index}
                    className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                    span={{ xs: 16, m: 8 }}
                  >
                    <ProjectCard
                      id={project.key}
                      title={project.val().title}
                      about={project.val().about}
                      reqs={project.val().reqs}
                      startDate={project.val().startDate}
                      endDate={project.val().endDate}
                      deadline={project.val().appDeadline}
                      payment={project.val().payment}
                      type={type}
                      projectType={project.val().jobType}
                      byUser={project.val().byUser}
                    />
                  </Col>
                ) : DateTime.fromISO(project.val().appDeadline) >
                  DateTime.local() ? (
                  <Col
                    key={index}
                    className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                    span={{ xs: 16, m: 8 }}
                  >
                    <ProjectCard
                      id={project.key}
                      title={project.val().title}
                      about={project.val().about}
                      reqs={project.val().reqs}
                      startDate={project.val().startDate}
                      endDate={project.val().endDate}
                      deadline={project.val().appDeadline}
                      payment={project.val().payment}
                      type={type}
                      projectType={project.val().jobType}
                      byUser={project.val().byUser}
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

export default Projects;
