import { ChangePasswordForm } from '@components/forms/change_password';
import {
  AuthenticationLayout,
  AuthenticationLayoutForm,
} from '@components/layout/authentication';
import { messages, routes } from '@theme';

export default function SettingsPage() {
  return (
    <AuthenticationLayout title={'Change Password'}>
      <AuthenticationLayoutForm
        redirection_route={routes.page_route.dashboard.initial}
        title={messages.components.authentication.change_password.heading.title}
        subtitle={messages.components.authentication.change_password.heading.subtitle}
        specifics={messages.components.authentication.change_password.specifics}
      >
        <ChangePasswordForm />
      </AuthenticationLayoutForm>
    </AuthenticationLayout>
  );
}
