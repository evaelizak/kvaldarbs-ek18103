import { Alert, Button, Layout } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import React from 'react';
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { ref, serverTimestamp, set } from 'firebase/database';
import { auth, database } from '../misc/firebase';

const SignInPage = () => {
  let alertMessage = null;

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const signedIn = await signInWithPopup(auth, provider);
      const userData = getAdditionalUserInfo(signedIn);
      if (userData.isNewUser) {
        await set(ref(database, `/profiles/${signedIn.user.uid}`), {
          name: signedIn.user.displayName,
          createdAt: serverTimestamp(),
        });
      }
      alertMessage = <Alert message="Signed in successfully" banner closable />;
    } catch (err) {
      alertMessage = (
        <Alert type="error" message={err.message} banner closable />
      );
    }
  };
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
        {alertMessage}
      </div>
    </Layout>
  );
};

export default SignInPage;
