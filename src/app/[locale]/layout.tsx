import { getMessages } from 'next-intl/server';
import { AppProviders } from '@/components/AppProviders';
import '../globals.css';

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
    <html lang={locale || 'es'} suppressHydrationWarning>
      <body>
        <AppProviders locale={locale} messages={messages}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
