import { DashboardLayout } from '@components/layout/dashboard';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { serverFetch } from 'src/lib/api';

export default function EditUser({ user, token, role }) {
  const router = useRouter();
  const t = useTranslations('components');
  const [formData, setFormData] = useState(user || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await serverFetch({
      uri: `/api/users/${user.id}/update`, // Adjust to your API route
      user_token: token,
      options: {
        method: 'PUT',
        body: formData,
      },
    });
    setLoading(false);
    router.push('/dashboard/direction/users');
  };

  return (
    <DashboardLayout
      title={t('edit')}
      currentPage={t('users')}
      role={role}
      token={token}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('firstname.placeholder')}
          value={formData.name || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <input
          type="email"
          placeholder={t('email.placeholder')}
          value={formData.email || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
        {/* Add any additional fields as needed */}
        <button type="submit" disabled={loading}>
          {loading ? t('updating') : t('update')}
        </button>
      </form>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const token = (
    await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  )?.accessToken;
  if (!token) {
    return {
      redirect: { destination: '/user/auth', permanent: false },
    };
  }
  const { id } = query;
  const userData = await serverFetch({
    uri: `/api/users/${id}`,
    user_token: token,
  });
  return {
    props: {
      user: userData,
      token,
      role: 'admin',
    },
  };
};