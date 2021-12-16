/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable object-shorthand */
import { Button, Col, notification, Radio, Row, Form, Input } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { ref, serverTimestamp, set } from 'firebase/database';
import { auth, db } from '../misc/firebase';

const SignInPage = () => {
  // for the radio to set whether the user is a student or a company
  const [value, setValue] = useState(1);
  const [number, setNumber] = useState('16');
  const onChange = e => {
    setValue(e.target.value);
  };
  const onNumberChange = n => {
    setNumber(n.target.value);
  };
  let disabledButton;
  // eslint-disable-next-line no-restricted-globals
  if (number < 16 || number > 120 || isNaN(number)) {
    disabledButton = true;
  } else {
    disabledButton = false;
  }

  // sign in with google
  const signInWithGoogle = async () => {
    // sets the provider
    let userType;
    if (value === 1) {
      userType = 'student';
    } else {
      userType = 'company';
    }

    const provider = new GoogleAuthProvider();

    try {
      // opens the pop up
      const signedIn = await signInWithPopup(auth, provider);
      // gets additional data
      const userData = getAdditionalUserInfo(signedIn);

      // sets the data for new users
      if (userData.isNewUser && userType === 'student') {
        // sets the data in the database - set because we use user uid for nodes
        await set(ref(db, `/profiles/${signedIn.user.uid}`), {
          username: signedIn.user.displayName,
          email: signedIn.user.email,
          createdAt: serverTimestamp(),
          usertype: userType,
          phone: '',
          linkedin: '',
          profileType: '',
          age: number,
        });
      } else if (userData.isNewUser) {
        // if a user is a new user and is a company then an additional field is added
        await set(ref(db, `/profiles/${signedIn.user.uid}`), {
          username: signedIn.user.displayName,
          email: signedIn.user.email,
          createdAt: serverTimestamp(),
          usertype: userType,
          hasCompany: false,
          website: '',
          phone: '',
          linkedin: '',
        });
      }
      notification.open({ message: 'Signed in successfully', duration: 4 });
    } catch (err) {
      notification.open({
        message: 'Error has occured, try again later',
        duration: 4,
      });
    }
  };

  return (
    <>
      <Row justify="center" gutter="20">
        <Col span={{ xs: 0, md: 12 }}>
          <h1 className="mt-10 text-3xl bold text-center">
            Register with Google
          </h1>
          <h2 className="text-2xl text-center">Choose your account type</h2>
          <div className="mt-5 grid justify-items-center">
            <Form
              type="flex"
              justify="center"
              align="middle"
              initialValues={{ age: number }}
            >
              <Form.Item>
                <Radio.Group
                  className="mt-3"
                  onChange={onChange}
                  value={value}
                  defaultValue={1}
                >
                  <Radio value={1}>
                    I&apos;m a student looking for opportunities!
                  </Radio>
                  <Radio value={2}>
                    We&apos;re a company looking for bright minds!
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="age"
                label="Your age"
                rules={[
                  {
                    required: true,
                    message: 'Your age must be entered',
                    pattern: new RegExp(/^[0-9]+$/),
                  },
                  () => ({
                    validator(_, val) {
                      if (!val) {
                        return Promise.reject();
                      }
                      if (number < 16) {
                        return Promise.reject('You must be 16+');
                      }
                      if (number > 120) {
                        return Promise.reject("Are you sure you're 120+?");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input maxLength={3} onChange={onNumberChange} />
              </Form.Item>
            </Form>
            {disabledButton && value === 1 ? (
              <Button
                type="primary"
                onClick={signInWithGoogle}
                className="mt-3"
                disabled
              >
                <GoogleOutlined />
                Register with Google
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={signInWithGoogle}
                className="mt-3"
              >
                <GoogleOutlined />
                Register with Google
              </Button>
            )}
          </div>
        </Col>
        <Col span={{ xs: 0, md: 12 }} className="justify-items-center">
          <h1 className="mt-10 text-3xl bold text-center">
            Sign in to your account
          </h1>
          <div className="mt-5 grid justify-items-center">
            {disabledButton ? (
              <Button
                type="primary"
                onClick={signInWithGoogle}
                className="mt-5"
                disabled
              >
                <GoogleOutlined />
                Sign in with Google
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={signInWithGoogle}
                className="mt-5"
              >
                <GoogleOutlined />
                Sign in with Google
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SignInPage;
