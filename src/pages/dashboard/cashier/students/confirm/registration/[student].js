import { RegistrationCard } from '@components/common/cards';
import { StudentConfirmationForm } from '@components/forms/student/confirmationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { RegistrationFormLayout } from '@components/layout/dashboard/registration';
import { messages, routes } from '@theme';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { getToken } from 'next-auth/jwt';
import { useState } from 'react';
import { serverFetch } from 'src/lib/api';

const {
  pages: { dashboard },
  components: {
    menu,
    cards: {
      student: { confirmation, info },
    },
  },
} = messages;

export default function StudentConfirmation({ studentDetail, role, token }) {
  const {
    id,
    attributes: {
      student: {
        data: {
          id: studentId,
          attributes: { firstname, lastname, type },
        },
      },
      class: {
        data: {
          attributes: { level, letter },
        },
      },
    },
  } = studentDetail;

  
  const [hasSucceeded, setHasSucceeded] = useState( false);

  return (
    <DashboardLayout
      title={dashboard.students.title}
      currentPage={menu.students.create}
      role={role}
      token={token}
    >
      <RegistrationFormLayout message={confirmation}>
        {hasSucceeded ? (
          <RegistrationCard
            message={info.confirmation
              .replace('%firstname', firstname)
              .replace('%lastname', lastname)
              .replace('%classname', `${level}${letter}`)}
            cta={{
              message: info.classList,
              link: ACCESS_ROUTES[role?.name].classes.all,
            }}
          />
        ) : (
          <StudentConfirmationForm
            enrollment={id}
            student={studentDetail}
            token={token}
            hasSucceeded={hasSucceeded}
            setHasSucceeded={setHasSucceeded}
          />
        )}
      </RegistrationFormLayout>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ query, req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const { student } = query;

  const { role } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const { data: studentDetail } = await serverFetch({
    uri: routes.api_route.alazhar.get.students.detail.replace('%id', student),
    user_token: token,
  });


  return {
    props: {
      studentDetail,
      role,
      token,
    },
  };
};
