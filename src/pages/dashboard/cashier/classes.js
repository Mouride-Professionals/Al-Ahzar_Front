import { ClassesList } from '@components/func/lists/Classes';
import { DashboardLayout } from '@components/layout/dashboard';
import { messages, routes } from '@theme';
import { mapClassesByLevel } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

const {
  components: {
    classList: { grade, intermediate, upperIntermediate },
  },
} = messages;

export default function Classes({ classes, role ,token}) {
  return (
    <DashboardLayout
      title={messages.pages.dashboard.classes.title}
      currentPage={messages.components.menu.classes}
      role={role}
      token={token}
    >
      <ClassesList
        groupName={grade}
        classes={classes}
        listOf={'grade'}
        role={role}
      />

      <ClassesList
        groupName={intermediate}
        classes={classes}
        listOf={'intermediate'}
        role={role}
      />

      <ClassesList
        groupName={upperIntermediate}
        classes={classes}
        listOf={'upperIntermediate'}
        role={role}
      />
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const {
    alazhar: {
      get: {
        me,
        schools: { all },
      },
    },
  } = routes.api_route;

  const { id, role } = await serverFetch({
    uri: me,
    user_token: token,
  });

  const { data: school } = await serverFetch({
    uri: `${all}?filters[cashier][id][$eq]=${id}&populate=cashier,classes.eleves`,
    user_token: token,
  });

  const classes = mapClassesByLevel({
    classes: school[0]?.attributes?.classes,
  });

  return {
    props: {
      classes,
      role,
      token,
    },
  };
};
