import { SearchProvider } from "./SearchContext";
import Sidebar from "./Sidebar";
import styles from "./DashboardLayout.module.css";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SearchProvider>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.main}>
          <div id="main-content" className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
