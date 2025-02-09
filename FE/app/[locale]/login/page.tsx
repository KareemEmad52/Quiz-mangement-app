import type { Metadata } from 'next'
import Image from "next/image";
import { Brain } from "lucide-react";
import LoginForm from "@/components/Forms/LoginForm";
import ButtonAnimate from "@/components/Button-animate";
import { getTranslations } from 'next-intl/server';
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

export default async function Login({ params }: { params: Awaited<Promise<any>> }) {
  const login = await getTranslations("Login")
  const { locale } = await params
  return (
    <>

      <div className="w-full h-screen max-h-screen flex justify-center items-center bg-gray-50">
        {/* left div */}
        <div className="flex-1 justify-center items-center h-full w-1/2">

          <div className="w-full  h-full flex flex-col">
            <div className="self-start mr-4 mt-4">
              <LanguageSwitcher currentLocale={locale} withGlobe={false} />
            </div>
            <div className='flex-grow flex flex-col justify-center items-center gap-y-3'>
            <div className='w-full lg:max-w-[75%]  px-4 '>
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-semibold">QuizMaster</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {login('title')}
                </h1>
                <p className="text-gray-600">
                  {login('desc')}
                </p>
              </div>
            </div>
            <div className='w-full lg:max-w-[75%]  px-4 '>
              <LoginForm />

              <div className="my-4 flex items-center gap-4">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-gray-800 text-center">{login('or')}</p>
                <hr className="w-full border-gray-300" />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                <ButtonAnimate className="w-full flex items-center justify-center gap-4 py-2.5 px-4 !text-sm !tracking-wide !text-gray-800 border !border-gray-300 !rounded-md !bg-transparent !hover:bg-gray-50 !focus:outline-none">
                  <div className="flex items-center justify-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline" viewBox="0 0 512 512">
                      <path fill="#fbbd00"
                        d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                        data-original="#fbbd00" />
                      <path fill="#0f9d58"
                        d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                        data-original="#0f9d58" />
                      <path fill="#31aa52"
                        d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                        data-original="#31aa52" />
                      <path fill="#3c79e6"
                        d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                        data-original="#3c79e6" />
                      <path fill="#cf2d48"
                        d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                        data-original="#cf2d48" />
                      <path fill="#eb4132"
                        d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                        data-original="#eb4132" />
                    </svg>
                    <span className="text-black">{login('social.google')}</span>
                  </div>
                </ButtonAnimate>
                <ButtonAnimate className="w-full flex items-center justify-center gap-4 py-2.5 px-4 !text-sm !tracking-wide !text-gray-800 border !border-gray-300 !rounded-md !bg-transparent !hover:bg-gray-50 !focus:outline-none">
                  <div className="flex items-center justify-center gap-4">
                    <svg
                      width="20px"
                      className="inline"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                    >
                      <path
                        fill="#1877F2"
                        d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
                      />
                      <path
                        fill="#ffffff"
                        d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
                      />
                    </svg>
                    <span className="text-black">{login('social.facebook')}</span>
                  </div>
                </ButtonAnimate>
              </div>

              <div className='mt-4 text-center' ><p>{login("Signup1")} <Link href="/signup" className='text-blue-600 hover:text-blue-500 hover:underline'>{login('Signup2')}</Link></p></div>
            </div>
          </div>

          </div>
        </div>
        {/* right div */}

        <div className="relative max-h-screen w-1/2 hidden object-cover md:block max-w-[50%] h-full">
          <Image
            src='/Login-bg.jpg'
            alt="login image"
            fill
            className="object-cover"
          />
        </div>

      </div>

    </>
  )
}