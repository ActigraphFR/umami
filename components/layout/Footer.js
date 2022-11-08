import { useRouter } from 'next/router';
import Script from 'next/script';
import classNames from 'classnames';
import Link from 'components/common/Link';
import styles from './Footer.module.css';
import { CURRENT_VERSION, HOMEPAGE_URL, REPO_URL } from 'lib/constants';
import Icon from '../common/Icon';
import Logo from '../../assets/logo.svg';

export default function Footer() {
  const { pathname } = useRouter();

  return (
    <footer className={classNames(styles.footer, 'row')}>
      <div className="col-12 col-md-4" />
      <div className="col-12 col-md-4">
        <Link href={HOMEPAGE_URL}>
          <Icon icon={<Logo />} size="large" className={styles.logo} />
        </Link>
      </div>
      <div className={classNames(styles.version, 'col-12 col-md-4')}>
        <Link href={REPO_URL}>{`v${CURRENT_VERSION}`}</Link>
      </div>
      {!pathname.includes('/share/') && <Script src={`/telemetry.js`} />}
    </footer>
  );
}
