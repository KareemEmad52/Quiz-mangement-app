import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Roboto } from "next/font/google";
import { getTranslations } from 'next-intl/server';
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import QueryProvider from "@/utils/QueryProvider";
import { Toaster } from "sonner";


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
});


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('meta.title'),
    description: t('meta.desc'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Awaited<Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>>) {

  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);


  const messages = await getMessages();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const fontClass = isRTL ? ibmPlexSansArabic.variable : roboto.variable;
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`${fontClass} antialiased`}
      >
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>

            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="top-right" duration={2000} />
              <header>
                {/* <LanguageSwitcher currentLocale={locale} /> */}
              </header>
              <main>
                {children}
              </main>
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
