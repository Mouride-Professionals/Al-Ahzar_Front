'use client';

import { Button, Text, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default function LanguageSwitcher({ onSwitch }) {
    const router = useRouter();
    const { locale, asPath } = router;
    const t = useTranslations('components.layout.header.settings');

    // Add more languages here as needed
    const languages = [
        { code: 'fr', label: t('languageSelector.fr') },
        { code: 'ar', label: t('languageSelector.ar') },
        // Example for English support:
        { code: 'en', label: t('languageSelector.en') },
    ];

    const switchLanguage = (targetLocale) => {
        if (locale !== targetLocale) {
            router.push(asPath, asPath, { locale: targetLocale });
            if (onSwitch) onSwitch();
        }
    };

    return (
        <VStack align="start" spacing={1} mb={2}>
            <Text>{t('language')}</Text>
            <VStack align="stretch" spacing={1}>
                {languages.map(({ code, label }) => (
                    <Button
                        key={code}
                        onClick={() => switchLanguage(code)}
                        variant={locale === code ? 'solid' : 'ghost'}
                        colorScheme={locale === code ? 'orange' : 'gray'}
                        aria-current={locale === code ? 'page' : undefined}
                        w="100%"
                    >
                        {label}
                    </Button>
                ))}
            </VStack>
        </VStack>
    );
}