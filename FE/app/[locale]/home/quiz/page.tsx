import { useAppStore } from '@/lib/Store/Store';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const { locale } = await params; 
  const t = await getTranslations({ locale, namespace: 'Quiz' });

  return {
    title: t('meta.title'),
    description: t('meta.desc'),
  };
}



const Page = () => {

  // const currentQuizID = useAppStore((state) => state.currentQuizID);
  // console.log(currentQuizID);
  
  return (
    <div>page</div>
  )
}

export default Page