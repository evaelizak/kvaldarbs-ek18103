/* eslint-disable react/no-children-prop */
import { Spin } from 'antd';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useProfile } from './context/profile.context';
import AboutPage from './pages/AboutPage';
import ApplicationsPage from './pages/ApplicationsPage';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import SignInPage from './pages/SignInPage';

const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfile();
  if (isLoading && !profile) {
    return (
      <div className="text-center my-20 mx-0 py-30 px-50 bg-white rounded-md">
        <Spin />
      </div>
    );
  }
  // if there isnt a profile present and the site is loading
  if (!profile && !isLoading) {
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

const PublicRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfile();
  if (isLoading && !profile) {
    return (
      <div className="text-center my-20 mx-0 py-30 px-50 bg-white rounded-md">
        <Spin />
      </div>
    );
  }
  // if there is a profile - redirect to home page
  if (profile && !isLoading) {
    return <Redirect to="/home" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export const Routes = () => {
  const profilePage = <ProfilePage />;
  const projectsPage = <ProjectsPage />;
  const signinPage = <SignInPage />;
  const appsPage = <ApplicationsPage />;
  const notFoundPage = <NotFound />;

  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute exact path="/signin">
          <AboutPage props={signinPage} />
        </PublicRoute>
        <PublicRoute exact path="/">
          <AboutPage />
        </PublicRoute>
        <PrivateRoute exact path="/home">
          <HomePage />
        </PrivateRoute>
        {/* This is for rendering the correct component inside home page (base page) based on the selected route */}
        <PrivateRoute exact path="/profile">
          <HomePage props={profilePage} />
        </PrivateRoute>
        <PrivateRoute exact path="/projects">
          <HomePage props={projectsPage} />
        </PrivateRoute>
        <PrivateRoute exact path="/applications">
          <HomePage props={appsPage} />
        </PrivateRoute>
        {/* When the route is not set to any of the above */}
        <Route path="*">
          <HomePage props={notFoundPage} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
