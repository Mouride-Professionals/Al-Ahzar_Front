
'use client';

import { HStack } from '@chakra-ui/react';
import { StatCard } from '@components/common/cards';
import { colors } from '@theme';
import { Fragment } from 'react';

export const Statistics = ({ cardStats }) => {
  return (
    <HStack
      w="100%"
      spacing={{ base: '8px', sm: '12px' }}
      overflowX="auto"
      px={{ base: 2, sm: 4 }}
      py={2}
      bg={colors.gray.highlight}
      sx={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      {cardStats.map((el, i) => (
        <Fragment key={`kpi - item - ${i} `}>
          <StatCard {...el} />
        </Fragment>
      ))}
    </HStack>
  );
};