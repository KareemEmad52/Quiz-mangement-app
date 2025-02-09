import { Award, BarChart, CheckCircle2, CircleCheck, Clock } from "lucide-react"
import ButtonAnimate from "./Button-animate"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useAppStore } from "@/lib/Store/Store"
import { useQuery } from "@tanstack/react-query"
import { SpecificQuizResultsResponse } from "@/types/types"
import { getSpecificQuizResults } from "@/utils/api"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { intervalToDuration } from "date-fns"

const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return "00:00:00"
  
  const duration = intervalToDuration({ 
    start: 0, 
    end: milliseconds 
  })
  
  const padZero = (num: number | undefined): string => 
    (num || 0).toString().padStart(2, '0')
  
  return `${padZero(duration.hours)}:${padZero(duration.minutes)}:${padZero(duration.seconds)}`
}

const QuizSkeleton = () => {
  return (
    <Card className="w-[95%] md:w-[75%] xl:w-[60%] bg-white">
      <CardHeader>
        <div className="flex justify-center items-center gap-3 mb-2">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <hr className="mb-5" />
        <div className="flex justify-center items-center gap-3 mb-2 pt-5">
          <Skeleton className="h-6 w-64" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="p-4 col-span-2 md:col-span-1 rounded-lg border">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 mr-4 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-full col-span-2" />
        </div>
      </CardContent>
    </Card>
  )
}

function QuizFinished({locale, id} : {locale: string, id: string}) {
  const t = useTranslations("Quiz")
  const router = useRouter()
  const isFinished = useAppStore((state) => state.isFinished)
  const retakeQuiz = useAppStore((state) => state.retakeQuiz)
  const timeTaken = useAppStore((state) => state.timeTaken)

  const { data, error, isLoading } = useQuery<SpecificQuizResultsResponse>({
    queryKey: ["quizData", id],
    queryFn: () => getSpecificQuizResults(id as string),
  })

  if (error) {
    const err = error as AxiosError
    if (err.response?.status === 401) {
      toast.error(t("logAgain"), {
        duration: 5000,
        closeButton: true,
      })
    }
  }

  const handleBackToHome = () => {
    if(isFinished) retakeQuiz()
    router.push("/home")
  }

  if (isLoading || !data?.data?.[0]) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <QuizSkeleton />
      </div>
    )
  }

  const { score, quiz } = data.data[0]
  const { noOfQuests } = quiz

  // timeTaken is already in milliseconds from the store, no need to convert
  const formattedTime = formatTime(timeTaken || 0)

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-[95%] md:w-[75%] xl:w-[60%] bg-white">
        <CardHeader>
          <div className="flex justify-center items-center gap-3 mb-2">
            <CircleCheck className="h-14 w-14 text-green-500" />
            <span className="text-3xl font-semibold">{t("submitedSuccessfully")}</span>
          </div>
          <hr className="mb-5" />
          <div className="flex justify-center items-center gap-3 mb-2 pt-5">
            <h2 className="text-2xl">{t("thankSubmission")}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 col-span-2 md:col-span-1 rounded-lg flex items-center">
                <Award className="text-blue-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-600">{t("yourGrade")}</p>
                  <p className="text-2xl font-bold text-blue-700">{score}</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 col-span-2 md:col-span-1 rounded-lg flex items-center">
                <BarChart className="text-green-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-600">{t("score")}</p>
                  <p className="text-2xl font-bold text-green-700">
                    {score} / {noOfQuests}
                  </p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 col-span-2 md:col-span-1 rounded-lg flex items-center">
                <Clock className="text-purple-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-600">{t("TimeTaken")}</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {formattedTime}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 col-span-2 md:col-span-1 rounded-lg flex items-center">
                <CheckCircle2 className="text-yellow-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-600">{t("Accuracy")}</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {((score / noOfQuests) * 100).toFixed(2)} %
                  </p>
                </div>
              </div>
              <ButtonAnimate onClick={handleBackToHome} className="w-full grid col-span-2">
                {t("backToHome")}
              </ButtonAnimate>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizFinished