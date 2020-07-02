import React from 'react';
import { ButtonBase } from '@material-ui/core';
import styles from '../styles/footer.module.scss';
import Link from './link';

const Footer = () => {
    return (
        <>
            <footer className={styles.root}>
                <section className={styles.section}>
                    <h3>Menu</h3>
                    <div className={styles.sectionDiv}>
                        <Link
                            className={styles.sectionDivA}
                            href="/"
                            color="secondary"
                        >
                            Home
                        </Link>
                        <Link
                            className={styles.sectionDivA}
                            href="/"
                            color="secondary"
                        >
                            Create ad
                        </Link>
                        <Link
                            className={styles.sectionDivA}
                            href="/search"
                            color="secondary"
                        >
                            Search
                        </Link>
                        <Link
                            className={styles.sectionDivA}
                            href="/contact"
                            color="secondary"
                        >
                            Contact
                        </Link>
                        <Link
                            className={styles.sectionDivA}
                            href="/legal"
                            color="secondary"
                        >
                            Legal
                        </Link>
                    </div>
                </section>
                <section className={styles.section}>
                    <h3>Social</h3>
                    <div className={styles.social} />
                    <ButtonBase aria-label="go to homepage">
                        <Link href="/" aria-label="go to homepage">
                            <img src="/images/main-logo.png" alt="quiamo logo" className={styles.branding} />
                        </Link>
                    </ButtonBase>
                </section>
                <section className={styles.section}>
                    <h3>Our mission</h3>
                    <p className={styles.sectionP}>
                        Nam sole orto magnitudine angusti gurgitis sed profundi
                        a transitu arcebantur et dum piscatorios.
                    </p>
                    <p className={styles.sectionP}>
                        Quaerunt lenunculos vel innare temere contextis cratibus
                        parant, effusae legiones, quae hiemabant tunc apud.
                    </p>
                    <p className={styles.sectionP}>
                        Siden, isdem impetu occurrere veloci. et signis prope
                        ripam locatis ad manus comminus conserendas denseta
                        scutorum conpage semet scientissime.
                    </p>
                </section>
            </footer>
        </>
    );
};

export default Footer;
