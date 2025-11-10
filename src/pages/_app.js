'use client';
import '../styles/globals.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import RTLProvider from '@components/RTLProvider';
import AddToHomePrompt from '@components/pwa/AddToHomePrompt';
import { SchoolYearProvider } from '@utils/context/school_year_context';
import { SessionProvider, useSession } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';
import { MediaContextProvider } from '../lib/utils/media';
import { clearSessionCache } from '../lib/utils/sessionCache';
import Loading from './dashboard/loading';

const theme = (locale) =>
  extendTheme({
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    colors: {
      primary: { regular: '#fd6101', hover: '#e55a00' },
      secondary: { regular: '#4A5568' },
      gray: { regular: '#A0AEC0', bold: '#2D3748' },
      white: '#ffffff',
      error: '#e53e3e',
    },
  });

// Wrapper to monitor session changes and clear cache
function SessionMonitor({ children }) {
  const { data: session, status } = useSession();
  const [previousStatus, setPreviousStatus] = useState(status);

  useEffect(() => {
    // Clear session cache when status changes (login/logout)
    if (previousStatus !== status) {
      clearSessionCache();
      setPreviousStatus(status);
    }
  }, [status, previousStatus]);

  return <>{children}</>;
}

export default function AlAzhar({ Component, pageProps }) {
  const router = useRouter();
  const locale = router.locale || 'ar';
  const [mounted, setMounted] = useState(false);

  // Set <html dir> dynamically
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
    setMounted(true);
  }, [locale, mounted]);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Service worker registration failed', error);
      }
    };

    registerServiceWorker();
  }, []);

  // Load messages for the current locale
  let messages;
  try {
    messages = require(`../../messages/${locale}.json`);
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    messages = require('../../messages/ar.json');
  }

  // Optionally show a loading spinner if messages are not loaded
  if (!messages || !mounted) {
    return <Loading />;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider
        session={pageProps.session}
        refetchOnWindowFocus={false}
        refetchInterval={0}
        refetchWhenOffline={false}
      >
        <SessionMonitor>
          <ChakraProvider theme={theme(locale)}>
            <Head>
              <title>{process.env.NEXT_PUBLIC_SITENAME}</title>
            </Head>
            <MediaContextProvider disableDynamicMediaQueries>
              <Suspense fallback={<Loading />}>
                <SchoolYearProvider>
                  <RTLProvider>
                    <Component {...pageProps} />
                    <AddToHomePrompt />
                  </RTLProvider>
                </SchoolYearProvider>
              </Suspense>
            </MediaContextProvider>
          </ChakraProvider>
        </SessionMonitor>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
