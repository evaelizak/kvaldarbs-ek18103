import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import React from 'react';
import { signInWithGoogle } from '../misc/auth-functions';

const SignInPage = () => {
  return (
    <>
      <div>
        <h1 className="mt-10 text-3xl bold text-center">
          Sign in to your account
        </h1>
      </div>
      <div className="mt-5 grid justify-items-center">
        <Button type="primary" onClick={signInWithGoogle}>
          <GoogleOutlined />
          Sign in with Google
        </Button>
      </div>
    </>
  );
};

export default SignInPage;
