import { useBreakpointValue } from '@chakra-ui/react';
import { DesktopDashboardLayoutView, MobileDashboardLayoutView } from './views';

export const DashboardLayout = ({ children, title, currentPage, role, token, logo }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <MobileDashboardLayoutView
        title={title}
        currentPage={currentPage}
        role={role}
        token={token}
      >
        {children}
      </MobileDashboardLayoutView>
    );
  }
  return (
    <DesktopDashboardLayoutView
      title={title}
      logo={logo}
      currentPage={currentPage}
      role={role}
      token={token}
    >
      {children}
    </DesktopDashboardLayoutView>
  );
};
