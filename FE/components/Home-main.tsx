"use client"
import React from 'react'
import { Button } from './ui/button'
import {
  BookOpen,
  Clock,
  History,
  Calendar,
  Trophy,
  ChevronRight,
  GraduationCap,
  ChevronLeft
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { motion } from 'framer-motion'
import ButtonAnimate from './Button-animate'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkQuizSubmition, getAllQuizzes } from "@/utils/api";
import { checkSubmitionResponse, QuizResponse, StatusEnums } from "@/types/types";
import { format, set } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import Image from 'next/image'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { QuizCardSkeleton } from './Skeletons/QuizCard'


const HomeMain = ({ locale }: { locale: string }) => {
  const t = useTranslations("HomePage")
  const { data, isError, error, isLoading } = useQuery<QuizResponse>({
    queryKey: ["quizzes"],
    queryFn: () => getAllQuizzes(),
  })

  if (error) {
    const err = error as AxiosError
    if (err.response?.status === 401) {
      toast.error(t("logAgain"), { duration: 5000, closeButton: true });
    }
  }




  const router = useRouter();
  const dateLocale = locale === "ar" ? ar : enUS
  const [btnLoading , setBtnLoading] = React.useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (id: string) => checkQuizSubmition(id),
    onSuccess: async  (_, id) => {
      router.prefetch(`/home/quiz/${id}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/home/quiz/${id}`);
      setBtnLoading(null);
    }, 
    onError: (error) => {
      const err = error as AxiosError<any>
      toast.error(err?.response?.data.message as string || "Something went wrong");
      setBtnLoading(null);
    }
  });

   const handleNavigate = async (id: string) => {
    console.log("clicked");
    setBtnLoading(id)
    mutation.mutate(id);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Welcome, Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-white rounded-lg p-6 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("QuizPage.WelcomeBack")}</h2>
            <p className="text-muted-foreground">{t("QuizPage.YourLearningProgressIsOnTrack")}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: t("QuizPage.UpcomingQuizzes"),
            value: "3",
            subtitle: t("QuizPage.NextQuizInDays"),
            icon: Clock
          },
          {
            title: t("QuizPage.CompletedQuizzes"),
            value: "12",
            subtitle: `${t("QuizPage.AverageScore")}: 85%`,
            icon: History
          },
          {
            title: t("QuizPage.ActiveCourses"),
            value: "4",
            subtitle: t("QuizPage.InProgress"),
            icon: BookOpen
          },
          {
            title: t("QuizPage.AchievementPoints"),
            value: "850",
            subtitle: t("QuizPage.LevelScholar"),
            icon: Trophy
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Available Quizzes */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t("QuizPage.AvailableQuizzes")}</h3>
          <Link href="/home/available-quiz">
            <Button variant="outline" size="sm">
              {t("QuizPage.ViewAll")} {locale === "en" ? <ChevronRight className="w-4 h-4" /> :
                <ChevronLeft className="w-4 h-4" />}
            </Button>
          </Link>
        </div>

        {/* If Data is Loading, Show Skeletons */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <QuizCardSkeleton />
              </motion.div>
            ))}
          </div>
        )}

        {/* If Error Occurs */}
        {isError || data?.data.length == 0 &&
          <div className="text-red-500 w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 justify-center">
              <Image src="/empty-state.png" width={200} height={200} alt="error" />
              <h1 className="text-xl font-[300] text-gray-900">{t("NoData")}</h1>
            </div>
          </div>}

        {/* If Data is Available */}
        {!isLoading && !isError && data && data?.data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.data.slice(0, 3).map((quiz, index) => (
              <motion.div
                key={quiz.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {quiz.title}
                      </CardTitle>
                      <Badge
                        className={
                          quiz.status === StatusEnums.COMPLETED
                            ? "bg-green-600 text-white hover:bg-green-500"
                            : quiz.status === StatusEnums.IN_PROGRESS
                              ? "bg-gray-700 text-white"
                              : "bg-red-500 text-white hover:bg-red-600"
                        }
                      >
                        {quiz.status}
                      </Badge>
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {t("QuizPage.Duration")}
                          </span>
                          <span>{quiz.duration} {t("QuizPage.Minutes")}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            {t("QuizPage.Questions")}
                          </span>
                          <span>{quiz.questions.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {t("QuizPage.DueDate")}
                          </span>
                          <span>{format(new Date(quiz.deadline), "PPp", { locale: dateLocale })}</span>
                        </div>
                      </div>
                      <ButtonAnimate 
                        onClick={() => handleNavigate(quiz._id)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        loading={btnLoading === quiz._id}
                        disabled={btnLoading === quiz._id}
                        >
                        {t("QuizPage.StartQuiz")}
                      </ButtonAnimate>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>


    </div>
  )
}

export default HomeMain