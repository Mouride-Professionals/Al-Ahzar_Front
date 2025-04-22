import { DesktopDashboardLayoutView } from './views';

export const DashboardLayout = ({ children, title, currentPage, role, token , logo}) => {
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
