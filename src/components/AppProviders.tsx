'use client';

import React from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ThemeProvider } from '@/components/ThemeProvider';

interface AppProvidersProps {
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
  children: React.ReactNode;
}

export function AppProviders({ locale, messages, timeZone, children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
