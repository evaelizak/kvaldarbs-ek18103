/* eslint-disable no-unused-vars */
import React from 'react';
import { orderByChild, query, ref } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';
import { Card, Col, notification, Row } from 'antd';
import { db } from '../../misc/firebase';
import AcceptedApplicationContacts from '../projects/project-applications/AcceptedApplicationContacts';
import AdminCompanyAccept from './AdminCompanyAccept';
import AdminCompanyReject from './AdminCompanyReject';

// component for admins to make sure that the companies who make projects are approved without issues
const AdminCompanyJudging = () => {
  const companyRef = ref(db, `/companies`);
  const orderedRef = query(companyRef, orderByChild('createdAt'));
  const [companies, loading, error] = useList(orderedRef);

  return (
    <>
      {error &&
        notification.error({
          message: 'An error has occured, try again later',
          duration: 4,
        })}
      {(!loading && !companies) ||
        (companies.length < 1 && (
          <>
            <div className="pb-5 text-xl">No companies here...</div>
          </>
        ))}
      {!loading && companies && (
        <>
          <h1 className="text-2xl">
            This is a page for seeing all new company applications
          </h1>
          <Row gutter={{ xs: 4, sm: 8 }} type="flex">
            {companies.map((company, index) =>
              company.val().isApproved ? (
                <Col
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  <Card
                    headStyle={{ fontSize: '20px' }}
                    title={company.val().name}
                  >
                    <p> Approved</p>
                    <p>
                      <b>About: </b>
                      {company.val().about}
                    </p>
                    <p>
                      <b>Country: </b>
                      {company.val().country}
                    </p>
                    <p className="pb-3">
                      <b>Website: </b>
                      <a
                        href={company.val().website}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {company.val().website}
                      </a>
                    </p>
                    <div>
                      <AcceptedApplicationContacts applicantID={company.key} />
                    </div>
                  </Card>{' '}
                </Col>
              ) : (
                <Col
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  <Card
                    headStyle={{ fontSize: '20px' }}
                    title={company.val().name}
                  >
                    <p> Not approved</p>
                    <p>
                      Admin message sent -{' '}
                      {company.val().adminMessage
                        ? company.val().adminMessage
                        : 'no'}
                    </p>
                    <p>
                      {' '}
                      <b>About: </b>
                      {company.val().about}
                    </p>
                    <p>
                      {' '}
                      <b>Country: </b>
                      {company.val().country}{' '}
                    </p>
                    <p className="pb-3">
                      <b>Website: </b>
                      <a
                        href={company.val().website}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {company.val().website}
                      </a>
                    </p>
                    <div>
                      <AcceptedApplicationContacts applicantID={company.key} />
                    </div>
                    <AdminCompanyAccept companyKey={company.key} />
                    {company.val().adminMessage ? (
                      <>
                        <span> Send a new message?</span>
                        <AdminCompanyReject companyKey={company.key} />{' '}
                      </>
                    ) : (
                      <AdminCompanyReject companyKey={company.key} />
                    )}
                  </Card>
                </Col>
              )
            )}
          </Row>
        </>
      )}
    </>
  );
};

export default AdminCompanyJudging;
