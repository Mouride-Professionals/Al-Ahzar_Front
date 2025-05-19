import { createRequestHandler } from 'next-intl/server';

export default createRequestHandler({
    defaultLocale: 'ar',
    locales: ['fr', 'ar', 'en'],
});
