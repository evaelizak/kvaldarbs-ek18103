/* eslint-disable no-unused-vars */
import { Col, Row, notification } from 'antd';
import React from 'react';
import firebase from 'firebase/compat/app';
import { useList } from 'react-firebase-hooks/database';
import ProjectCard from './ProjectCard';

// component for projects page for students
const StudentProjects = () => {
  // react firebase hook to get a list of keys from the database reference
  const projectsRef = firebase
    .database()
    .ref('/projects')
    .orderByChild('startDate');
  const [projects, loading, error] = useList(projectsRef);

  return (
    <div>
      <div>
        {console.log(projects)}
        {error &&
          notification.error({
            message: 'An error has occured, try again later',
            duration: 4,
          })}
        {!loading && projects && (
          <>
            {/* Mapping the projects keys from the database list */}
            <Row>
              {projects.map((project, index) => (
                // <Col>{project.val().title}</Col>
                <Col key={index} className="p-2" span={{ xs: 16, m: 8 }}>
                  <ProjectCard
                    id={project.key}
                    title={project.val().title}
                    about={project.val().about}
                    startDate={project.val().startDate}
                    endDate={project.val().endDate}
                    deadline={project.val().appDeadline}
                    loading={loading}
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

export default StudentProjects;
