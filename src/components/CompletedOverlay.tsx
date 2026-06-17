'use client';

import React from 'react';
import styles from './CompletedOverlay.module.css';

interface CompletedOverlayProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
  title: string;
  body: string;
  restartBtnLabel: string;
}

export default function CompletedOverlay({
  onRestart,
  title,
  body,
  restartBtnLabel,
}: CompletedOverlayProps) {
  return (
    <div className={styles.completedOverlay}>
      <div className={styles.completedMsg}>
        <h2>{title}</h2>
        <p>{body}</p>
        <button className={styles.restartBtn} onClick={onRestart}>
          {restartBtnLabel}
        </button>
      </div>
    </div>
  );
}
