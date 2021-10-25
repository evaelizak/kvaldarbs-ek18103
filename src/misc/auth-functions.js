import { notification } from 'antd';
import { auth } from './firebase';

export const onSignOut = () => {
  auth.signOut();
  notification.open({ message: 'Signed out', duration: 4 });
};
