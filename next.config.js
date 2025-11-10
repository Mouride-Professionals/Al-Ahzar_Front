/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports =
  withBundleAnalyzer(
  withNextIntl({
    reactStrictMode: true,
    
    i18n: {
      locales: ['fr', 'ar', 'en'],
      defaultLocale: 'ar',
    },
    images: {
      domains: ['localhost'],
    },
  }));