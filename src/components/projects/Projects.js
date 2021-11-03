/* eslint-disable no-unused-vars */
import { Col, Row, notification } from 'antd';
import React from 'react';
import { useList } from 'react-firebase-hooks/database';
import ProjectCard from './ProjectCard';
import { auth, db } from '../../misc/firebase';

// component for projects page
const Projects = ({ type = 'student' }) => {
  // react firebase hook to get a list of keys from the database reference
  const key = auth.currentUser.uid;
  let projectsRef;
  if (type === 'student') {
    projectsRef = db.ref('/projects').orderByChild('startDate');
  } else {
    projectsRef = db.ref(`/companies/${key}/projects`);
  }
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
            <Row gutter={{ xs: 4, sm: 8 }}>
              {projects.map((project, index) => (
                // <Col>{project.val().title}</Col>
                <Col
                  key={index}
                  className="pt-2 inline-flex self-stretch"
                  span={{ xs: 16, m: 8 }}
                >
                  <ProjectCard
                    id={project.key}
                    title={project.val().title}
                    about={project.val().about}
                    startDate={project.val().startDate}
                    endDate={project.val().endDate}
                    deadline={project.val().appDeadline}
                    loading={loading}
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
