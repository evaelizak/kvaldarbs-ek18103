import { UserOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { useState } from 'react';
import { useProfile } from '../context/profile.context';
import { onSignOut } from '../misc/auth-functions';

// eslint-disable-next-line react-hooks/rules-of-hooks

const HomePage = () => {
  const { profile } = useProfile();
  console.log(profile);

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={isCollapsed}
        onCollapse={setIsCollapsed}
        collapsedWidth="40"
        breakpoint="md"
        //  width="200"
      >
        <div className="h-32 m-16" />
        <Menu className="ant-layout-sider-zero-width" mode="vertical">
          <Menu.Item key="1" icon={<UserOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" title="Option 3" icon={<UserOutlined />}>
            <Menu.Item key="3">Suboption</Menu.Item>
          </SubMenu>
          <Menu.Item key="4" icon={<UserOutlined />}>
            Option 4
          </Menu.Item>
          <SubMenu key="sub2" title="Option 3" icon={<UserOutlined />}>
            <Menu.Item key="5">Suboption</Menu.Item>
            <Menu.Item key="6">Suboption</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header>
          <p className="text-white">For students by students</p>
        </Header>
        <Content>
          <div className="p-10 min-h-360">
            <h1 className="text-xl text-center">Hey, {profile.name}!</h1>
            This is the content
          </div>
          <Button color="red-500" danger type="primary" onClick={onSignOut}>
            Sign out
          </Button>
        </Content>
        <Footer className="text-center">
          <p className="text-xs">
            Website made by Eva Eliza Kudina for University of Latvia 2021
          </p>
        </Footer>
      </Layout>
      {/* <div>This is the homepage</div>
      <div>
        
      </div> */}
    </Layout>
  );
};

export default HomePage;
