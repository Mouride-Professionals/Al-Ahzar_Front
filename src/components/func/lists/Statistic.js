import { Fragment } from 'react';
import { StatCard } from '@components/common/cards';
import { HStack, WrapItem } from '@chakra-ui/react';

export const Statistics = ({ cardStats }) => {
  return (
    <HStack  w={'100%'}>
    <Fragment >
      {cardStats.map((el, i) => (
        <WrapItem key={`kpi-item-${i}`}>
          <StatCard {...el} />
        </WrapItem>
      ))}
    </Fragment>
    </HStack>
  );
};
