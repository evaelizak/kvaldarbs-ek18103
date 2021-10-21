/* eslint-disable react/jsx-curly-brace-presence */
import { Button } from 'antd';
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';
import React from 'react';
import SideNav from '../components/SideNav';
// import { useProfile } from '../context/profile.context';
import { onSignOut } from '../misc/auth-functions';

const HomePage = ({ props }) => {
  // for when there is no other content in the home page
  if (!props) {
    props = <div>Hey and welcome to the site :)</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideNav />
      <Layout>
        <Header>
          <p className="text-white">For students by students</p>
        </Header>
        <Content className="p-5 m-5 border-2">
          <div>{props}</div>
        </Content>
        <Footer className="text-center">
          <Button color="red-500" danger type="primary" onClick={onSignOut}>
            Sign out
          </Button>
          <p className="text-xs">
            Website made by Eva Eliza Kudina for University of Latvia 2021
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomePage;
