/* eslint-disable object-shorthand */
import { Button, notification, Radio } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from '@firebase/auth';
import { ref, serverTimestamp, set } from '@firebase/database';
import { auth, database } from '../misc/firebase';

const SignInPage = () => {
  // for the radio to set whether the user is a student or a company
  const [value, setValue] = useState(1);
  const onChange = e => {
    setValue(e.target.value);
  };

  // sign in with google
  const signInWithGoogle = async () => {
    // sets the provider
    let userType;
    if (value === 1) {
      userType = 'student';
    } else {
      userType = 'company';
    }
    console.log(userType);

    const provider = new GoogleAuthProvider();

    try {
      // opens the pop up
      const signedIn = await signInWithPopup(auth, provider);
      // gets additional data
      const userData = getAdditionalUserInfo(signedIn);

      // sets the data for new users
      if (userData.isNewUser) {
        // // sets the data
        await set(ref(database, `/profiles/${signedIn.user.uid}`), {
          username: signedIn.user.displayName,
          createdAt: serverTimestamp(),
          usertype: userType,
        });
      }
      notification.open({ message: 'Signed in successfully', duration: 4 });
    } catch (err) {
      notification.open({ message: 'Error has occurred', duration: 4 });
    }
  };

  return (
    <>
      <div>
        <h1 className="mt-10 text-3xl bold text-center">
          Sign in to your account
        </h1>
      </div>
      <div className="mt-5 grid justify-items-center">
        <Radio.Group onChange={onChange} value={value} defaultValue={1}>
          <Radio value={1}>I&apos;m a student looking for opportunities!</Radio>
          <Radio value={2}>
            We&apos;re a company looking for bright minds!
          </Radio>
        </Radio.Group>
        <Button type="primary" onClick={signInWithGoogle} className="mt-5">
          <GoogleOutlined />
          Sign in with Google
        </Button>
      </div>
    </>
  );
};

export default SignInPage;
