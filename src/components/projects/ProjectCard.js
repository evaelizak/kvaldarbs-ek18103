import { Button, Card, Divider } from 'antd';
import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { DateTime } from 'luxon';
import StudentProjectApply from './StudentProjectApply';

// component to show data about submitted projects
const ProjectCard = ({
  loading,
  title,
  about,
  startDate,
  endDate,
  deadline,
  id,
  type,
}) => {
  if (startDate) {
    startDate = DateTime.fromISO(startDate).toFormat('dd.LL.yyyy');
  }
  if (endDate) {
    endDate = DateTime.fromISO(endDate).toFormat('dd.LL.yyyy');
  }
  if (deadline) {
    deadline = DateTime.fromISO(deadline).toFormat('dd.LL.yyyy');
  }

  let shownButton;
  if (type === 'student') {
    shownButton = <StudentProjectApply id={id} title={title} />;
  } else {
    shownButton = (
      <>
        <Button type="primary">Edit</Button>{' '}
        <Button danger className="float-right">
          Delete
        </Button>
      </>
    );
  }

  return (
    <Card title={title} loading={loading}>
      {/* <p>{projectInfo}</p> */}

      <h1>
        <b className="text-base">About:</b>{' '}
        <ShowMoreText lines={3} more="Show more" less="Show less">
          {about}
        </ShowMoreText>
      </h1>
      <Divider />
      <p>
        <b>Project starts:</b> {!startDate ? 'No specified start' : startDate}
      </p>
      <p>
        <b>Project ends:</b> {!endDate ? 'No specified end' : endDate}
      </p>
      <p>
        <b>Application deadline:</b>{' '}
        {!deadline ? 'No specified deadline' : deadline}
      </p>

      {/* <p>{projectInfo.about}</p> */}
      {/* <p>{data.title}</p> */}
      {shownButton}
    </Card>
  );
};

export default ProjectCard;
