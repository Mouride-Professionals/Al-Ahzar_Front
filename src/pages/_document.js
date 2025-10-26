// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';
import { mediaStyles } from '../lib/utils/media';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="Al Azhar Dashboard" />
        <meta name="theme-color" content="#fd6101" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Al Azhar" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <style
          type="text/css"
          dangerouslySetInnerHTML={{ __html: mediaStyles }}
        />
      </Head>
      <body>
        {/* 👇 Here's the script */}
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
