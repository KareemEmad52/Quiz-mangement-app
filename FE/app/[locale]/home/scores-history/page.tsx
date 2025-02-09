import QuizHistoryPage from "@/components/QuizScoreHistory";
import { getAllQuizzesResults } from "@/utils/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async ({ params }: { params: Promise<any> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.ScoresHistoryPage' })
  return {
    title: t('title'),
    desc: t('desc'),
  }
}


export default async function QuizScoreHistory() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['quizzScoreHistory'],
    queryFn: () => getAllQuizzesResults(),
  })

  return <>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizHistoryPage />
    </HydrationBoundary>
  </>
}