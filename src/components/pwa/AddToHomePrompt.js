import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  OrderedList,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'al-azhar-a2hs-dismissed';

const isIos = () => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent || navigator.vendor || '';
  return /iPad|iPhone|iPod/.test(ua) && !(window.MSStream);
};

const isInStandaloneMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

export default function AddToHomePrompt({ onDismiss }) {
  const t = useTranslations();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) {
      setVisible(false);
      setHasDismissed(true);
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setHasDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (hasDismissed || typeof window === 'undefined') {
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, [hasDismissed]);

  const isIOSDevice = useMemo(() => isIos(), []);

  useEffect(() => {
    if (hasDismissed || isIOSDevice === false) {
      return;
    }

    if (!isInStandaloneMode()) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isIOSDevice, hasDismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setHasDismissed(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    onDismiss?.();
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      handleDismiss();
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        handleDismiss();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.debug('[a2hs] prompt error', error);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      insetX={0}
      bottom={0}
      zIndex={1400}
      px={4}
      pb={6}
      pointerEvents="none"
    >
      <Box
        mx="auto"
        maxW="md"
        border="1px"
        borderColor="orange.200"
        bg="white"
        p={4}
        borderRadius="2xl"
        boxShadow="lg"
        pointerEvents="auto"
      >
        <Flex align="flex-start" gap={4}>
          <Text fontSize="2xl" mt={1} aria-hidden>
            📲
          </Text>
          <Stack spacing={2} flex="1">
            <Text fontWeight="semibold" color="gray.800">
              {t('pwa.installTitle')}
            </Text>
            {isIOSDevice ? (
              <OrderedList spacing={1} pl={5} color="gray.600" fontSize="sm">
                <ListItem>{t('pwa.ios.step1')}</ListItem>
                <ListItem>{t('pwa.ios.step2')}</ListItem>
                <ListItem>{t('pwa.ios.step3')}</ListItem>
              </OrderedList>
            ) : (
              <Text fontSize="sm" color="gray.600">
                {t('pwa.android.hint')}
              </Text>
            )}
            <Flex gap={2} pt={2} flexWrap="wrap">
              {isIOSDevice ? (
                <Button size="sm" colorScheme="orange" onClick={handleDismiss}>
                  {t('pwa.ios.ok')}
                </Button>
              ) : (
                <Button size="sm" colorScheme="orange" onClick={handleInstallClick}>
                  {t('pwa.android.install')}
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                {t('common.close')}
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}
