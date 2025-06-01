import { ChangePasswordForm } from '@components/forms/change_password';
import {
  AuthenticationLayout,
  AuthenticationLayoutForm,
} from '@components/layout/authentication';
import { routes } from '@theme';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default function SettingsPage() {
  const router = useRouter();
  const { forcePasswordChange } = router.query;
  const t = useTranslations('components.authentication.change_password');

  return (
    <AuthenticationLayout title={t('heading.title')}>
      <AuthenticationLayoutForm
        redirection_route={routes.page_route.dashboard.initial}
        title={t('heading.title')}
        subtitle={t('heading.subtitle')}
        specifics={!forcePasswordChange ? {

        } : {}}
      >
        <ChangePasswordForm />
      </AuthenticationLayoutForm>
    </AuthenticationLayout>
  );
}
