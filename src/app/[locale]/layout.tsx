import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "../globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'Interactive Typing | Typing App' : 'Mecanografía Interactiva | Typing App',
    description: locale === 'en' 
      ? 'An interactive typing speed test with dynamic SVG 3D keyboard and mechanical sounds.'
      : 'Una aplicación interactiva de mecanografía con teclado virtual SVG 3D y sonido mecánico, con soporte para español e inglés.',
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  
  return (
    <html lang={locale || 'es'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
