/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

module.exports =
  withNextIntl({
    reactStrictMode: true,
    
    i18n: {
      locales: ['fr', 'ar'],
      defaultLocale: 'ar',
    },
    images: {
      domains: ['localhost'],
    },
  });