import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@components/layout/dashboard';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

export default function EditUser({ user, token, role }) {
  const router = useRouter();
  const [formData, setFormData] = useState(user || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const res = await serverFetch({
      uri: `/api/users/${user.id}/update`, // Adjust to your API route
      user_token: token,
      options: {
        method: 'PUT',
        body: formData,
      },
    });
    setLoading(false);
    // Redirect back to the users listing page after updating
    router.push('/dashboard/direction/users');
  };

  return (
    <DashboardLayout title="Edit User" currentPage="users" role={role} token={token}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
        {/* Add any additional fields as needed */}
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update User'}
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
    uri: `/api/users/${id}`, // Adjust to your API route to fetch a single user
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