import { Button, Layout } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import React from 'react';
import { signInWithGoogle } from '../misc/auth-functions';

const SignInPage = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl bold text-center">sign in page</h1>
      </div>
      <div>
        <h3 className="text-xl bold text-center">Sign in with</h3>
      </div>
      <div className="mt-5">
        <Button block color="white" onClick={signInWithGoogle}>
          <GoogleOutlined />
          Google
        </Button>
      </div>
    </Layout>
  );
};

export default SignInPage;
