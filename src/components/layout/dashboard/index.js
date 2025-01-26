import { DesktopDashboardLayoutView } from './views';

export const DashboardLayout = ({ children, title, currentPage, role, token }) => {
  return (
    <DesktopDashboardLayoutView
      title={title}
      currentPage={currentPage}
      role={role}
      token={token}
    >
      {children}
    </DesktopDashboardLayoutView>
  );
};
