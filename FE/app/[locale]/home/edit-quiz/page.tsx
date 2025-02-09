import AllQuizzesTable from '@/components/allQuizzesTable';
import { Quiz } from '@/types/types';
import { getTranslations } from 'next-intl/server';
import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllQuizzes } from '@/utils/api';


export const generateMetadata = async ({ params }: { params: Promise<any> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AllQuizzes' });
  return {
    title: t("meta.title"),
    description: t("meta.desc"),
  };
};


const page = async ({ params }: { params: Promise<any> }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['quizzes'],
    queryFn: () => getAllQuizzes(),
  })
  const { locale } = await params;
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllQuizzesTable locale={locale} />
    </HydrationBoundary>
  )
}

export default page