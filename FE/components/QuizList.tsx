"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Clock, GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"
import ButtonAnimate from "./Button-animate"
import { Quiz, StatusEnums } from "@/types/types"
import { useRouter } from "@/i18n/routing"


interface QuizListProps {
  searchTerm: string,
  quizData: Quiz[],
  status: string
  sortBy: string
}

export function QuizList({ searchTerm, status, quizData, sortBy }: QuizListProps) {
  const router = useRouter();
  const t = useTranslations("HomePage.AllQuizzesPage");
  const filteredAndSortedQuizzes = useMemo(() => {
    return quizData
      .filter(
        (quiz) =>
          (searchTerm === "" ||
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (status === "all" || quiz.status === status),
      )
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        } else if (sortBy === "oldest") {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else if (sortBy === "duration") {
          return Number(b.duration) - Number(a.duration);
        }
        return 0;
      });
  }, [searchTerm, status, sortBy, quizData]);


  const handleNavigate = (id: string) => {
    router.push(`/home/quiz/${id}`)
  }

  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredAndSortedQuizzes.map((quiz, index) => (
        <motion.div
          key={quiz.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <Card className="hover:shadow-md transition-shadow border border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
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
              <CardDescription className="text-gray-600">{quiz.description}</CardDescription>
              {/* <div className="flex flex-wrap gap-2 mt-2">
                {quiz.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="bg-blue-50 text-primary">
                    {topic}
                  </Badge>
                ))}
              </div> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {t("Duration")}
                    </span>
                    <span className="text-gray-900">{quiz.duration} {t("Minutes")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      {t("Questions")}
                    </span>
                    <span className="text-gray-900">{quiz.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {t("DueDate")}
                    </span>
                    <span className="text-gray-900">{new Date(quiz.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <ButtonAnimate onClick={() => handleNavigate(quiz._id)} className="w-full bg-blue-500 hover:bg-bg-blue-500/90">{t("StartQuiz")}</ButtonAnimate>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

