import { Column, Icon, Row } from 'react-basics';
import Link from 'next/link';
import LanguageButton from 'components/input/LanguageButton';
import ThemeButton from 'components/input/ThemeButton';
import SettingsButton from 'components/input/SettingsButton';
import Icons from 'components/icons';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Row>
        <Column>
          <Link href="https://www.actigraph.com/actistat" target="_blank" className={styles.title}>
            <Icon size="xl" className={styles.icon}>
              <Icons.Logo />
            </Icon>
          </Link>
        </Column>
        <Column className={styles.buttons}>
          <ThemeButton tooltipPosition="bottom" />
          <LanguageButton tooltipPosition="bottom" menuPosition="bottom" />
          <SettingsButton />
        </Column>
      </Row>
    </header>
  );
}
