'use client';

import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import { colors } from '@theme';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BsArrowLeftShort } from 'react-icons/bs';

export const BackButton = ({ label = null, href = null, ...props }) => {
  const router = useRouter();
  const t = useTranslations('components');
  const resolvedLabel = label || t('back');

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      color={colors.secondary.regular}
      leftIcon={<Icon as={BsArrowLeftShort} boxSize={6} />}
      _hover={{ bg: colors.secondary.light }}
      alignSelf="flex-start"
      {...props}
    >
      <HStack spacing={1}>
        <Text fontWeight="700">{resolvedLabel}</Text>
      </HStack>
    </Button>
  );
};
