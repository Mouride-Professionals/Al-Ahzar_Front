'use client';

import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default function LanguageSwitcher({ onSwitch }) {
    const router = useRouter();
    const { locale, asPath } = router;
    const t = useTranslations('components.layout.header.settings');

    const switchLanguage = (targetLocale) => {
        if (locale !== targetLocale) {
            router.push(asPath, asPath, { locale: targetLocale });
            if (onSwitch) onSwitch();
        }
    };

    return (
        <VStack align="start" spacing={1} mb={2}>
            <Text >
                {t('language')}
            </Text>
            <VStack spacing={1}>
                <Button
                    onClick={() => switchLanguage('fr')}
                    variant={locale === 'fr' ? 'solid' : 'ghost'}
                    colorScheme={locale === 'fr' ? 'orange' : 'gray'}
                    aria-current={locale === 'fr' ? 'page' : undefined}
                >
                    {t('languageSelector.fr')}
                </Button>
                <Button
                    onClick={() => switchLanguage('ar')}
                    variant={locale === 'ar' ? 'solid' : 'ghost'}
                    colorScheme={locale === 'ar' ? 'orange' : 'gray'}
                    aria-current={locale === 'ar' ? 'page' : undefined}
                >
                    {t('languageSelector.ar')}
                </Button>
            </VStack>
        </VStack>
    );
}