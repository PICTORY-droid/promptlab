import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import MobileBottomNavigation from "./MobileBottomNavigation";

type AppChromeProps = {
  children: React.ReactNode;
};

export default function AppChrome({ children }: AppChromeProps) {
  return (
    <>
      <AppHeader />

      {children}

      <AppFooter />
      <MobileBottomNavigation />
    </>
  );
}