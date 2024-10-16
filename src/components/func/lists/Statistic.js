import { Fragment } from 'react';
import { StatCard } from '@components/common/cards';
import { WrapItem } from '@chakra-ui/react';

export const Statistics = ({ cardStats }) => {
  return (
    <Fragment>
      {cardStats.map((el, i) => (
        <WrapItem key={`kpi-item-${i}`}>
          <StatCard {...el} />
        </WrapItem>
      ))}
    </Fragment>
  );
};
