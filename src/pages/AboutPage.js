import { LoginOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../img/logo.png';

const AboutPage = ({ props }) => {
  if (!props) {
    props = (
      <>
        <div className="grid justify-items-center mt-10">
          <h1 className="text-3xl">Hey and welcome to Re:initiate! </h1>
          <div className="mx-20 text-center">
            <p>
              We are a site for students, graduates and young professionals
              looking for job, project and internship opportunities.
            </p>
            <p>
              If you are interested - click on
              <span className="font-bold"> Sign in</span> at the top!
            </p>
          </div>
        </div>
      </>
    );
  }
  const location = useLocation();

  return (
    <Layout>
      <Header>
        <div>
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="float-left w-30 h-16 mx-16 mr-5 ml-0"
            />
          </Link>
        </div>
        <Menu
          mode="horizontal"
          className="float-right"
          theme="dark"
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/signin" icon={<LoginOutlined />}>
            <Link to="/signin">Sign in</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ minHeight: '100vh' }}>
        <div>{props}</div>
      </Content>
    </Layout>
  );
};

export default AboutPage;
