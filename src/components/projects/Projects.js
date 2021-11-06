/* eslint-disable no-unused-vars */
import { Col, Row, notification } from 'antd';
import React from 'react';
import { useList } from 'react-firebase-hooks/database';
import ProjectCard from './ProjectCard';
import { auth, db } from '../../misc/firebase';

// component for projects page
const Projects = ({ type = 'student' }) => {
  const key = auth.currentUser.uid;
  // database reference to take either specific company projects or show all for students
  let projectsRef;
  if (type === 'student') {
    projectsRef = db.ref('/projects').orderByChild('startDate');
  } else if (type === 'company') {
    projectsRef = db.ref(`/companies/${key}/projects`);
  }
  // react firebase hook to get a list of keys from the database reference
  const [projects, loading, error] = useList(projectsRef);

  return (
    <div>
      <div>
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
            {/* Mapping the projects keys from the database list */}
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {projects.map((project, index) => (
                <Col
                  key={index}
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  <ProjectCard
                    id={project.key}
                    title={project.val().title}
                    about={project.val().about}
                    startDate={project.val().startDate}
                    endDate={project.val().endDate}
                    deadline={project.val().appDeadline}
                    // loading={loading}
                    type={type}
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