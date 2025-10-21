'use client';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.logo} href="/">
          Inctagram
        </Link>
        {/*code*/}
      </div>
    </header>
  );
}