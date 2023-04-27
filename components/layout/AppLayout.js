import { Container } from 'react-basics';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from 'components/layout/NavBar';
import useRequireLogin from 'hooks/useRequireLogin';
import useConfig from 'hooks/useConfig';
import { CURRENT_VERSION } from 'lib/constants';
import styles from './AppLayout.module.css';
import Footer from './Footer';

export function AppLayout({ title, children }) {
  const { user } = useRequireLogin();
  const config = useConfig();

  if (!user || !config) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{title ? `${title} | ActiSTAT` : 'ActiSTAT'}</title>
      </Head>
      <nav className={styles.nav}>
        <NavBar />
      </nav>
      <main className={styles.body}>
        <Container>{children}</Container>
        <Footer />
      </main>
    </div>
  );
}

export default AppLayout;
