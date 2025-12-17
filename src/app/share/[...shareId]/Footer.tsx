import { Icon } from 'react-basics';
import { CURRENT_VERSION, HOMEPAGE_URL } from '@/lib/constants';
import Icons from '@/components/icons';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a href={HOMEPAGE_URL} className={styles.footerLink}>
        <Icon className={styles.logoIcon}>
          <Icons.Logo />
        </Icon>
        <span>{`v${CURRENT_VERSION}`}</span>
      </a>
    </footer>
  );
}

export default Footer;
