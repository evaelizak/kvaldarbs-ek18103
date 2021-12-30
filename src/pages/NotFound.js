import React from 'react';
import { useHistory } from 'react-router';

const NotFound = () => {
  const history = useHistory();
  return (
    <>
      <h1 className="text-xl">This is a 404 page! How did you get here?</h1>
      <h1 className="text-xl">
        Go{' '}
        <a href onClick={() => history.goBack()}>
          {' '}
          back{' '}
        </a>
        where you came from!
      </h1>
    </>
  );
};

export default NotFound;
