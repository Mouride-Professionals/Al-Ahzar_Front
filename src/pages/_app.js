import '../styles/globals.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SchoolYearProvider } from '@utils/context/school_year_context';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { Suspense, useEffect, useState } from 'react';
import { MediaContextProvider } from '../lib/utils/media';
import Loading from './dashboard/loading';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const theme = extendTheme({ colors });

// 3. Pass the `theme` prop to the `ChakraProvider`
function AlAzhar({ Component, pageProps: { session, ...pageProps } }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }
  
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>{process.env.NEXT_PUBLIC_SITENAME}</title>
        </Head>

        <MediaContextProvider disableDynamicMediaQueries>
          <Suspense fallback={<div>Loading...</div>}>
            <SchoolYearProvider>
              <Component {...pageProps} />
            </SchoolYearProvider>

          </Suspense>
        </MediaContextProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default AlAzhar;
