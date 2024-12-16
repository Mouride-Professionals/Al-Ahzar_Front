import { DashboardLayout } from '@components/layout/dashboard';
import { messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

export default function Students({ role }) {
  return (
    <DashboardLayout
      title={messages.pages.dashboard.students.title}
      currentPage={messages.components.menu.students.initial}
      role={role}
    ></DashboardLayout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const { role } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  return {
    props: {
      role,
    },
  };
};
