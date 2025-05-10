import { ChangePasswordForm } from '@components/forms/change_password';
import {
  AuthenticationLayout,
  AuthenticationLayoutForm,
} from '@components/layout/authentication';
import { messages, routes } from '@theme';
import { useRouter } from 'next/router';

export default function SettingsPage() {
  const router = useRouter();
  const { forcePasswordChange } = router.query;

  return (
    <AuthenticationLayout title={'Change Password'}>
      <AuthenticationLayoutForm
        redirection_route={routes.page_route.dashboard.initial}
        title={messages.components.authentication.change_password.heading.title}
        subtitle={messages.components.authentication.change_password.heading.subtitle}
        specifics={!forcePasswordChange ? messages.components.authentication.change_password.specifics : {}}
      >
        <ChangePasswordForm />
      </AuthenticationLayoutForm>
    </AuthenticationLayout>
  );
}
