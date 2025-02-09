import HomeMain from "@/components/Home-main"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import {getAllQuizzes} from "@/utils/api";



const Home = async ({ params }: { params: Promise<any> }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['quizzes'],
    queryFn: () => getAllQuizzes(),
  })

  const { locale } = await params

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeMain locale={locale}/>
      </HydrationBoundary>
    </>
  )
}

export default Home