import '../styles/globals.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { MediaContextProvider } from '../lib/utils/media';

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
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>{process.env.NEXT_PUBLIC_SITENAME}</title>
        </Head>
        <MediaContextProvider disableDynamicMediaQueries>
          <Component {...pageProps} />
        </MediaContextProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default AlAzhar;
