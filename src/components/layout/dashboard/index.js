import { DesktopDashboardLayoutView } from './views';

export const DashboardLayout = ({ children, title, currentPage, role }) => {
  return (

    <DesktopDashboardLayoutView
      title={title}
      currentPage={currentPage}

      role={role}
    >
      {children}
    </DesktopDashboardLayoutView>
  );
};
