'use client';

import { useEffect, useRef } from 'react';
import { HStack } from '@chakra-ui/react';
import { MenuPill } from '@components/common/menu';
import { DashboardMainMenu } from '@utils/mappers/menu';
import { usePathname } from 'next/navigation';
import { colors } from '@theme';

export const MainMenus = ({ role }) => {
  const activeLink = usePathname();
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeLink]);

  return (
    <HStack
      w="100%"
      spacing={{ base: 2, sm: 3 }}
      px={{ base: '4%', sm: 4 }}
      py={2}
      justifyContent={{ base: 'flex-start', md: 'center' }}
      alignItems="flex-start"
      overflowX={{ base: 'auto'}}
      sx={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        overscrollBehaviorX: 'contain',
      }}
    >
      {DashboardMainMenu({ activeLink, role }).map((menu, i) =>
        menu ? (
          <MenuPill
            {...menu}
            key={`main-menu-${i}`}
            ref={menu.active ? activeRef : null}
          />
        ) : null
      )}
    </HStack>
  );
};