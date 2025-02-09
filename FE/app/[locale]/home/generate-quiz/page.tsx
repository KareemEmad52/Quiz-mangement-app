import CreateQuizForm from "@/components/Forms/CreateQuizForm"
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<any> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GenerateQuiz' });

  return {
    title: t('meta.title'),
    description: t('meta.desc'),
  };
}

export default async function CreateNewQuizPage() {
    const t = await getTranslations("GenerateQuiz");
  return (
    <>
      <div className="flex items-center gap-2 px-6 pt-8 ">
        <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
      </div>
      <CreateQuizForm />
    </>
  )
}

