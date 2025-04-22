// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';
import { mediaStyles } from '../lib/utils/media';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
