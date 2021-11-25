/* eslint-disable react/jsx-curly-brace-presence */
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';
import React from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav';
// import { useProfile } from '../context/profile.context';
import logo from '../img/logo.png';

const HomePage = ({ props }) => {
  // for when there is no other content in the home page
  // TODO: add some more buttons for page links etc
  if (!props) {
    props = <div>Hey and welcome to the site :)</div>;
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
          <p className="text-white">For students by students</p>
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
