import { LoginForm } from '@components/forms/login';
import {
  AuthenticationLayout,
  AuthenticationLayoutForm,
} from '@components/layout/authentication';
import { routes } from '@theme';
import { useTranslations } from 'next-intl';

export default function Login() {
  const t = useTranslations('components.authentication.login');

  return (
    <AuthenticationLayout title={'Login'}>
      <AuthenticationLayoutForm
        redirection_route={routes.page_route.auth.forgot_password}
        title={t('heading.title')}
        subtitle={t('heading.subtitle')}
        specifics={{
          forgotten_password: t('specifics.forgotten_password'),
          account: t('specifics.account'),
          highlight: t('specifics.highlight'),
        }}
      >
        <LoginForm />
      </AuthenticationLayoutForm>
    </AuthenticationLayout>
  );
}
