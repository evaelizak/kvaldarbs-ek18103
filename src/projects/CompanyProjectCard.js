import React from 'react';
import firebase from 'firebase/compat/app';
import { useList } from 'react-firebase-hooks/database';
import { Card, Col, Divider, notification, Row } from 'antd';
import ShowMoreText from 'react-show-more-text';
import { auth } from '../misc/firebase';

const CompanyProjectCard = () => {
  const key = auth.currentUser.uid;

  const projectsRef = firebase
    .database()
    .ref(`/companies/${key}/projects`)
    .orderByChild('startDate');
  const [projects, loading, error] = useList(projectsRef);

  return (
    <>
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
                  <Card title={project.val().title} loading={loading}>
                    <h1>
                      <b className="text-base">About:</b>{' '}
                      <ShowMoreText lines={3} more="Show more" less="Show less">
                        {project.val().about}
                      </ShowMoreText>
                    </h1>
                    <Divider />
                    <p>
                      <b>Project starts:</b>{' '}
                      {!project.val().startDate
                        ? 'No specified start'
                        : project.val().startDate}
                    </p>
                    <p>
                      <b>Project ends:</b>{' '}
                      {!project.val().endDate
                        ? 'No specified end'
                        : project.val().endDate}
                    </p>
                    <p>
                      <b>Application deadline:</b>{' '}
                      {!project.val().appDeadline
                        ? 'No specified deadline'
                        : project.val().appDeadline}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default CompanyProjectCard;
