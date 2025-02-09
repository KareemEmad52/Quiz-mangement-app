import type { Metadata } from 'next'
import Image from "next/image";
import { Brain } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import SignupForm from '@/components/Forms/SignupForm';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export async function generateMetadata({
  params,
}: {
  params: Promise<any>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Login' });

  return {
    title: t('meta.title'),
    description: t('meta.desc'),
  };
}

export default async function Signup({ params }: { params: Awaited<Promise<any>> }) {
  const t = await getTranslations("Signup");
  const { locale } = await params
  

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* left div */}
      <div className="flex-1 h-full w-1/2 bg-gray-50 overflow-y-auto scroll" >
        <div className="w-full h-full flex flex-col">
          <div className="p-4">
            <LanguageSwitcher currentLocale={locale} withGlobe={false} />
          </div>

          <div className="flex-1 flex flex-col justify-center ">
            <div className="w-full max-w-[75%] mx-auto px-4 py-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-semibold">QuizMaster</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {t('title')}
                </h1>
                <p className="text-gray-600">
                  {t('desc')}
                </p>
              </div>

              <SignupForm />

              <div className="mt-4 text-center">
                <p>
                  {t("login1")}{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    {t('login2')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right div */}
      <div className="relative w-1/2 hidden md:block">
        <Image
          src='/Login-bg.jpg'
          alt="login image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}