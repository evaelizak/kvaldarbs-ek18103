/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { notification } from 'antd';
import { onValue, ref } from 'firebase/database';
import { useListKeys } from 'react-firebase-hooks/database';
import { db } from './firebase';

export function UpdateProjectAppStatus(companyID, projectID) {
  const projectAppRef = ref(
    db,
    `/companies/${companyID}/projects/${projectID}/applications`
  );

  onValue(
    projectAppRef,
    snapshot => {
      snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey, childData);
      });
    },
    {
      onlyOnce: true,
    }
  );

  //   const [studentProjectApps, loading, error] = useListKeys(projectAppRef);

  //   studentProjectApps.map((studentProjectApp, index) => {
  //     return console.log(studentProjectApp);
  //     //   update(
  //     //     ref(
  //     //       db,
  //     //       `profiles/${studentProjectApp}/projectApps/${companyProjects}`
  //     //     ),
  //     //     {
  //     //       // status: 'deleted',
  //     //     }
  //     //   );
  //   });
  notification.open({ message: 'Hello', duration: 4 });
}
