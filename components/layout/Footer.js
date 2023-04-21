import { Row, Column } from 'react-basics';
import { FormattedMessage } from 'react-intl';
import { CURRENT_VERSION, HOMEPAGE_URL } from 'lib/constants';
import { labels } from 'components/messages';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Row>
        <Column defaultSize={10} lg={10} xl={10}>
          <div>
            <FormattedMessage
              {...labels.poweredBy}
              values={{
                name: (
                  <a href={HOMEPAGE_URL}>
                    <b>ActiSTAT</b>
                  </a>
                ),
              }}
            />
          </div>
        </Column>
        <Column className={styles.version} defaultSize={2} lg={2} xl={2}>
          <p>{`v${CURRENT_VERSION}`}</p>
        </Column>
      </Row>
    </footer>
  );
}
