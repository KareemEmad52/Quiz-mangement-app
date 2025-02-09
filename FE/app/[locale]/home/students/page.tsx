import StudentsTable from '@/components/sutdents-table';
import { getAllStudents } from '@/utils/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import React from 'react'

export const generateMetadata = async ({ params }: { params: Promise<any> }) => {
  const { locale } = await params;
  const t = await getTranslations({locale , namespace: 'Students'});
  return {
    title: t("meta.title"),
    description: t("meta.desc"),
  };
};


const page = async ({ params }: { params: Promise<any> }) => {
  const t = await getTranslations("Profile");
  const { locale } = await params;
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentsTable locale={locale} />
    </HydrationBoundary>
  )
}

export default page