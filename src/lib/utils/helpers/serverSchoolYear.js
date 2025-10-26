import Cookies from 'cookies';
import { routes } from '@theme';
import { serverFetch } from 'src/lib/api';

const {
  alazhar: {
    get: {
      school_years: { all: allSchoolYears },
    },
  },
} = routes.api_route;

export const ensureActiveSchoolYear = async ({ req, res, token }) => {
  const cookies = new Cookies(req, res);
  let activeSchoolYear = cookies.get('selectedSchoolYear');

  if (activeSchoolYear) {
    return activeSchoolYear;
  }

  if (!token) {
    return null;
  }

  try {
    const response = await serverFetch({
      uri: `${allSchoolYears}?sort=createdAt:desc`,
      user_token: token,
    });

    const schoolYears = Array.isArray(response?.data) ? response.data : [];
    if (!schoolYears.length) {
      return null;
    }

    const currentYear =
      schoolYears.find((year) => year.attributes?.isCurrent) ||
      schoolYears[0];

    if (!currentYear?.id) {
      return null;
    }

    activeSchoolYear = String(currentYear.id);
    cookies.set('selectedSchoolYear', activeSchoolYear, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    });

    return activeSchoolYear;
  } catch (error) {
    console.error('Failed to ensure active school year:', error);
    return null;
  }
};

export default ensureActiveSchoolYear;
