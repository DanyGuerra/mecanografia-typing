'use client';

import React from 'react';
import styles from './TypingArea.module.css';

interface TypingAreaProps {
  text: string;
  userInput: string;
  hasError: boolean;
}

export default function TypingArea({ text, userInput, hasError }: TypingAreaProps) {
  return (
    <div className={`${styles.typingArea} ${hasError ? 'shake-error' : ''}`}>
      <div className={styles.textContainer}>
        {text.split('').map((char, index) => {
          let charClass = styles.upcoming;
          const isTyped = index < userInput.length;
          const isCurrent = index === userInput.length;
          const isSpace = char === ' ';

          if (isTyped) {
            const isCorrect = userInput[index] === char;
            charClass = isCorrect ? styles.correct : styles.wrong;
          } else if (isCurrent) {
            charClass = styles.current;
          }

          return (
            <span key={index} className={`${styles.char} ${charClass}`}>
              {isCurrent && (
                <span
                  className={`${styles.cursor} ${hasError ? styles.cursorError : ''}`}
                />
              )}
              {isSpace ? ' ' : char}
            </span>
          );
        })}
        {userInput.length === text.length && (
          <span className={`${styles.char} ${styles.current}`}>
            <span className={styles.cursor} />
          </span>
        )}
      </div>
    </div>
  );
}
