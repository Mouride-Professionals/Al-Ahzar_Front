// import { RegistrationForm } from '@components/forms/register';
import {
  AuthenticationLayout,
  AuthenticationLayoutForm,
} from '@components/layout/authentication';
import { messages, routes } from '@theme';

export default function Register() {
  return (
    <AuthenticationLayout title={'Register'}>
      <AuthenticationLayoutForm
        redirection_route={routes.page_route.auth.initial}
        title={messages.components.authentication.register.heading.title}
        subtitle={messages.components.authentication.register.heading.subtitle}
        specifics={messages.components.authentication.register.specifics}
      >
        {/* <RegistrationForm /> */}
      </AuthenticationLayoutForm>
    </AuthenticationLayout>
  );
}
