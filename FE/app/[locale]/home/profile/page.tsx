import ProfileForm from "@/components/Forms/profile-form";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next"
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";


export const generateMetadata = async ({ params }: { params: Promise<any> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Profile' })
  return {
    title: t('meta.title'),
    desc: t('meta.desc'),
  }
}
export default async function ProfilePage({ params }: { params: Promise<any> }) {
  const t =  await  getTranslations("Profile");
  const { locale } = await params;
  return (
    <>
    <div className="flex items-center gap-2 px-6 pt-8 ">
      <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
        <BookOpen className="h-5 w-5 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
    </div>
      <ProfileForm locale={locale} />
    </>
  )
}

