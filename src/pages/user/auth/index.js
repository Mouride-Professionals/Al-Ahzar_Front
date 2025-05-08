import { LoginForm } from '@components/forms/login';
import {
  AuthenticationLayout,
  AuthenticationLayoutForm,
} from '@components/layout/authentication';
import { messages, routes } from '@theme';

export default function Login() {
  return (
    <AuthenticationLayout title={'Login'}>
      <AuthenticationLayoutForm
        redirection_route={routes.page_route.auth.forgot_password}
        title={messages.components.authentication.login.heading.title}
        subtitle={messages.components.authentication.login.heading.subtitle}
        specifics={messages.components.authentication.login.specifics}
      >
        <LoginForm />
      </AuthenticationLayoutForm>
    </AuthenticationLayout>
  );
}
