import { HStack } from '@chakra-ui/react';
import { MenuPill } from '@components/common/menu';
import { DashboardMainMenu } from '@utils/mappers/menu';
import { usePathname } from 'next/navigation';

export const MainMenus = ({ role }) => {
  const activeLink = usePathname();

  return (
    <HStack
      pl={'7%'}
      alignItems={'center'}
      justifyContent={'flex-start'}
      w={'90%'}
    >
        {DashboardMainMenu({ activeLink, role }).map(
          (menu, i) => menu && <MenuPill {...menu} key={`main-menu-${i}`} />
        )}
    </HStack>
  );
};
