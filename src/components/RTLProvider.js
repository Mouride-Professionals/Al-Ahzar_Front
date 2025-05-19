'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function RTLProvider({ children }) {
  const { locale } = useRouter();

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}