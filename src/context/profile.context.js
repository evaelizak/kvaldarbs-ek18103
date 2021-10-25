import { React, createContext, useState, useEffect, useContext } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../misc/firebase';

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
        userRef = ref(database, `/profiles/${authObj.uid}`);

        onValue(userRef, snap => {
          const { username, createdAt, usertype } = snap.val();
          console.log(username, createdAt, usertype);

          // data from the snapshot that was received from Google auth
          const data = {
            username,
            createdAt,
            // avatar,
            usertype,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
      } else {
        // removes the user reference
        if (userRef) {
          off(userRef);
        }
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
