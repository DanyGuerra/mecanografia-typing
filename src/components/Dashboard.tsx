'use client';

import React from 'react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  wpmLabel: string;
  accuracyLabel: string;
  timeLabel: string;
}

export default function Dashboard({
  wpm,
  accuracy,
  elapsedTime,
  wpmLabel,
  accuracyLabel,
  timeLabel,
}: DashboardProps) {
  return (
    <section className={styles.dashboard}>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>{wpmLabel}</span>
        <span className={styles.metricValue}>{wpm}</span>
      </div>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>{accuracyLabel}</span>
        <span className={styles.metricValue}>{accuracy}%</span>
      </div>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>{timeLabel}</span>
        <span className={styles.metricValue}>{elapsedTime}s</span>
      </div>
    </section>
  );
}
