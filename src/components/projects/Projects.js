/* eslint-disable no-unused-vars */
import { Col, Row, notification, Select } from 'antd';
import React, { useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { DateTime } from 'luxon';
import { get, orderByChild, query, ref } from 'firebase/database';
import ProjectCard from './ProjectCard';
import { auth, db } from '../../misc/firebase';

// component for projects page
const Projects = ({ type = 'student' }) => {
  const key = auth.currentUser.uid;
  const [sortChild, setSortChild] = useState('startDate');
  // database reference to take either specific company projects or show all for students
  let projectsRef;
  if (type === 'student') {
    projectsRef = query(ref(db, '/projects'), orderByChild(sortChild));
  } else if (type === 'company') {
    projectsRef = query(
      ref(db, `/companies/${key}/projects`),
      orderByChild(sortChild)
    );
  }
  // react firebase hook to get a list of keys from the database reference
  const [projects, loading, error] = useList(projectsRef);

  const changeSortDeadlines = value => {
    setSortChild(value);
  };
  const changeType = value => {
    console.log(value);
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
        {!loading && !projects && (
          <>
            <div>
              No projects added... yet! Feel free to add a new one below:
            </div>
          </>
        )}
        {!loading && projects && (
          <>
            <div>
              Sort by:
              <Select
                defaultValue="appDeadline"
                style={{ width: 200 }}
                onChange={changeSortDeadlines}
              >
                <Select.Option value="appDeadline">
                  Application Deadline
                </Select.Option>
                <Select.Option value="startDate">
                  Project Start Date
                </Select.Option>
              </Select>
              <Select
                defaultValue="part-time"
                style={{ width: 200 }}
                onChange={changeType}
              >
                <Select.Option value="part-time">Part time</Select.Option>
                <Select.Option value="full-time">Full time</Select.Option>
                <Select.Option value="contract">Contract</Select.Option>
                <Select.Option value="temporary">Temporary</Select.Option>
              </Select>
            </div>

            {/* Mapping the projects keys from the database list */}
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {projects.map((project, index) => (
                <Col
                  key={index}
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  {/* {console.log(
                    DateTime.fromISO(project.val().appDeadline) <
                      DateTime.local()
                  )} */}
                  <ProjectCard
                    id={project.key}
                    title={project.val().title}
                    about={project.val().about}
                    startDate={project.val().startDate}
                    endDate={project.val().endDate}
                    deadline={project.val().appDeadline}
                    payment={project.val().payment}
                    type={type}
                    projectType={project.val().jobType}
                    byUser={project.val().byUser}
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

export default Projects;
