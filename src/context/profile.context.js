import { React, createContext, useState, useEffect, useContext } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../misc/firebase';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  // useState for later use
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    // listener for auth changes
    const authUnsub = onAuthStateChanged(auth, async authObj => {
      if (authObj) {
        userRef = ref(db, `/profiles/${authObj.uid}`);
        let data;
        onValue(userRef, snap => {
          const {
            username,
            email,
            createdAt,
            usertype,
            hasCompany,
            profileType,
            phone,
            linkedin,
            age,
          } = snap.val();
          // sets additional data for company accounts
          if (usertype === 'company') {
            data = {
              username,
              createdAt,
              email,
              usertype,
              hasCompany,
              linkedin,
              phone,
              uid: authObj.uid,
            };
          } else {
            // data from the snapshot that was received from Google auth
            data = {
              username,
              email,
              createdAt,
              usertype,
              profileType,
              phone,
              linkedin,
              age,
              uid: authObj.uid,
            };
          }
          setProfile(data);
          setIsLoading(false);
        });
      } else {
        // removes the user reference
        if (userRef) {
          off(userRef);
        }
        // removes profile data
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsub();

      if (userRef) {
        off(userRef);
      }
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
