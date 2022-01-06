/* eslint-disable react/jsx-curly-brace-presence */
import { Button } from 'antd';
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';
import React from 'react';
import { Link } from 'react-router-dom';
import { onSignOut } from '../misc/auth-functions';
import SideNav from '../components/SideNav';

// import { useProfile } from '../context/profile.context';
import logo from '../img/logo.png';
import { useProfile } from '../context/profile.context';

const HomePage = ({ props }) => {
  const { profile } = useProfile();
  // for when there is no other content in the home (base) page
  if (!props && profile.usertype === 'company') {
    props = (
      <div>
        <p>Hey and welcome to the site!</p>
        <p>
          To use the full site you must first add a company to your profile and
          wait until an administrator approves it.
        </p>
        <p>
          <Link to="/profile">Profile</Link> - here you can see your profile
          page, your contact info, and add a new company
        </p>
        <p>
          <Link to="/projects">Projects</Link> - here you can add new projects
        </p>
        <p>
          <Link to="/applications">Applications</Link> - here you can see all
          applications to your added projects
        </p>
      </div>
    );
  } else if (!props && profile.usertype === 'student') {
    props = (
      <div>
        <p>Hey and welcome to the site!</p>
        <p>
          <Link to="/profile">Profile</Link> - here you can see your profile
          page, your contact info
        </p>
        <p>
          <Link to="/projects">Projects</Link> - here you can see all the
          available projects
        </p>
        <p>
          <Link to="/applications">Applications</Link> - here you can see all
          applications you have submitted to projects
        </p>
      </div>
    );
  } else if (!props && profile.usertype === 'admin') {
    props = (
      <div>
        <p>Hey and welcome to the site!</p>
        <p>
          <Link to="/profile">Profile</Link> - here you can see your profile
          page
        </p>
        <p>
          <Link to="/projects">Projects</Link> - here you can see all the added
          projects
        </p>
        <p>
          <Link to="/applications">Applications</Link> - here you can see all
          applications from companies waiting your judging
        </p>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideNav />
      <Layout>
        <Header>
          <div>
            <Link to="/home">
              <img
                src={logo}
                alt="logo"
                className="float-left w-30 h-16 mx-16 mr-5 ml-0"
              />
            </Link>
          </div>
          <Button
            className="float-right align-bottom mt-4"
            color="red-500"
            danger
            type="primary"
            onClick={onSignOut}
          >
            Sign out
          </Button>
        </Header>
        <Content className="p-5 m-5 border-2">
          <div>{props}</div>
        </Content>
        <Footer className="text-center">
          <p className="text-xs">
            Website made by Eva Eliza Kudina for University of Latvia 2021
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomePage;
