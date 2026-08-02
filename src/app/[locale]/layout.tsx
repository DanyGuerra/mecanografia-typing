import { getMessages } from 'next-intl/server';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { AppProviders } from '@/components/AppProviders';
import '../globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RootLayoutProps) {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'Interactive Typing | Typing App' : 'Mecanografía Interactiva | Typing App',
    description: locale === 'en' 
      ? 'An interactive typing speed test with dynamic SVG 3D keyboard and mechanical sounds.'
      : 'Una aplicación interactiva de mecanografía con teclado virtual SVG 3D y sonido mecánico, con soporte para español e inglés.',
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale || 'es'} className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppProviders locale={locale} messages={messages}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

