// src/components/LanguageSwitcher/index.js
'use client';

import { Button, Text, VStack, Select } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useBreakpointValue } from '@chakra-ui/react';

export default function LanguageSwitcher({ onSwitch }) {
    const router = useRouter();
    const { locale, asPath } = router;
    const t = useTranslations('components.layout.header.settings');
    const isMobile = useBreakpointValue({ base: true, md: false });

    const languages = [
        { code: 'fr', label: t('languageSelector.fr') },
        { code: 'ar', label: t('languageSelector.ar') },
        { code: 'en', label: t('languageSelector.en') },
    ];

    const switchLanguage = (targetLocale) => {
        if (locale !== targetLocale) {
            router.push(asPath, asPath, { locale: targetLocale });
            if (onSwitch) onSwitch();
        }
    };

    if (isMobile) {
        return (
            <Select
                size={{ base: 'sm', sm: 'md' }}
                value={locale}
                onChange={(e) => switchLanguage(e.target.value)}
                w="60px"
                
            >
                {languages.map(({ code, label }) => (
                    <option key={code} value={code}>
                        {code}
                    </option>
                ))}
            </Select>
        );
    }

    return (
        <VStack align="start" spacing={1} mb={2}>
            <Text fontSize="sm">{t('language')}</Text>
            <VStack align="stretch" spacing={1}>
                {languages.map(({ code, label }) => (
                    <Button
                        key={code}
                        onClick={() => switchLanguage(code)}
                        variant={locale === code ? 'solid' : 'ghost'}
                        colorScheme={locale === code ? 'orange' : 'gray'}
                        aria-current={locale === code ? 'page' : undefined}
                        w="100%"
                        size="sm"
                    >
                        {label}
                    </Button>
                ))}
            </VStack>
        </VStack>
    );
}