import {
  MessageOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Refactored sidebar navigation
const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  // Sidebar component used from antd
  return (
    <>
      <Sider
        collapsible
        collapsed={isCollapsed}
        onCollapse={setIsCollapsed}
        collapsedWidth="40"
        breakpoint="lg"
        style={{ positon: 'absolute' }}
      >
        <div className="h-32 m-16" />
        <Menu
          className="ant-layout-sider-zero-width"
          mode="vertical"
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}
        >
          {/* Menu items with links to specific routes */}
          <Menu.Item key="/profile" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="/projects" icon={<ProjectOutlined />}>
            <Link to="/projects">Projects</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<MessageOutlined />}>
            Messaging
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default SideNav;
