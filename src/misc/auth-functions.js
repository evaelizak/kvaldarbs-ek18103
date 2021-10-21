// import React from 'react';
import { notification } from 'antd';
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import { ref, serverTimestamp, set } from '@firebase/database';
import { auth, database } from './firebase';

export const signInWithGoogle = async () => {
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
    notification.open({ message: 'Signed in successfully', duration: 4 });
  } catch (err) {
    notification.open({ message: 'Error has occurred', duration: 4 });
  }
};

export const onSignOut = () => {
  auth.signOut();
  notification.open({ message: 'Signed out', duration: 4 });
};
