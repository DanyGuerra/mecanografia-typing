'use client';

import React from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  text: string;
}

export default function Footer({ text }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <p>{text}</p>
    </footer>
  );
}
