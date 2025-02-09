import NotFound from "@/app/[locale]/not-found";
import Quiz from "@/components/Quiz";
import QuizNotFound from "@/components/quiz-notFound";
import { Question, Quiz as QuizType, SpecificQuizResponse } from "@/types/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSpacificQuizData } from "@/utils/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";


// Define metadata
export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Quiz' });

  return {
    title: t('meta.title'),
    description: t('meta.desc'),
  };
}



export default async function QuizPage({ params }: { params: Promise<any> }) {
  const queryClient = new QueryClient();
  const { locale, id } = await params;

  const cookieStore = await cookies()
  const user = cookieStore.get('user')
  if (!user || id === "null") return <QuizNotFound locale={locale} />
  const { token } = JSON.parse(user.value)




  let quizData: SpecificQuizResponse | null = null;
  let error = false;

  try {
    // Prefetch quiz data on the server
    quizData = await queryClient.fetchQuery<SpecificQuizResponse>({
      queryKey: ['quizData', id, token],
      queryFn: () => getSpacificQuizData(id, token),
    },
  );
  } catch (err) {
    console.error("Error fetching quiz data:", err);
    error = true;
  }

  // If there's an error or no quiz data, return the QuizNotFound component
  if (error || !quizData) {
    return <QuizNotFound locale={locale} />;
  } else if (quizData.data) {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Quiz quizData={quizData.data} locale={locale} />
      </HydrationBoundary>
    );
  }


}