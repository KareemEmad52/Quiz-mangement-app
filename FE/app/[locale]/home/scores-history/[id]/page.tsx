"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Calendar, Award, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SpecificQuizResultsResponse, StatusEnums } from "@/types/types";
import { getSpecificQuizResults } from "@/utils/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton from shadcn

export default function QuizDetailsPage() {
  const { id } = useParams();
  const t = useTranslations("HomePage.ScoresHistoryPage.QuizPage");

  const { data, error, isLoading } = useQuery<SpecificQuizResultsResponse>({
    queryKey: ["quizData", id],
    queryFn: () => getSpecificQuizResults(id as string),
  });

  if (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      toast.error(t("logAgain"), {
        duration: 5000,
        closeButton: true,
      });
    }
  }

  if (error || data?.data.length === 0) {
    return (
      <div className="text-red-500 w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 justify-center">
          <Image src="/empty-state.png" width={200} height={200} alt="error" />
          <h1 className="text-xl font-[300] text-gray-900">{t("NoData")}</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-8">
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-64 rounded bg-gray-200" />
                  <Skeleton className="h-6 w-24 rounded bg-gray-200" />
                </div>
                <Skeleton className="h-4 w-96 rounded bg-gray-200 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-6 w-full rounded bg-gray-200" />
                  <Skeleton className="h-6 w-full rounded bg-gray-200" />
                  <Skeleton className="h-6 w-full rounded bg-gray-200" />
                  <Skeleton className="h-6 w-full rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48 rounded bg-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <Skeleton className="h-6 w-64 rounded bg-gray-200 mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, optionIndex) => (
                          <Skeleton key={optionIndex} className="h-12 w-full rounded bg-gray-200" />
                        ))}
                      </div>
                      <Skeleton className="h-6 w-24 rounded bg-gray-200 mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-8">
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">{data.data[0].quiz.title}</CardTitle>
                  <Badge
                    className={
                      data.data[0].quiz.status === StatusEnums.COMPLETED
                        ? "bg-green-600 text-white hover:bg-green-500"
                        : data.data[0].quiz.status === StatusEnums.IN_PROGRESS
                          ? "bg-gray-700 text-white"
                          : "bg-red-500 text-white hover:bg-red-600"
                    }
                  >
                    {data.data[0].quiz.status}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">{data.data[0].quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t("Score")}:</span> {((data.data[0].score / data.data[0].quiz.noOfQuests) * 100).toFixed(2)} %
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t("CorrectAnswers")}:</span> {data.data[0].score}/{data.data[0].quiz.noOfQuests}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t("Duration")}:</span> {data.data[0].quiz.duration} {t("Minutes")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t("DateTaken")}:</span> {new Date(data.data[0].submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("DetailedResults")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {data.data[0].answers.map((result, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold mb-2">{result.question.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.question.choices.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-md border ${
                              option === result.answer
                                ? option !== result.question.correctAnswer
                                  ? "bg-red-100 border-red-500"
                                  : "bg-green-100 border-green-500"
                                : "bg-gray-100 border-gray-300"
                            }`}
                          >
                            <span
                              className={`font-medium ${
                                option === result.question.correctAnswer
                                  ? "text-green-700"
                                  : option === result.answer
                                  ? "text-red-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            {option === result.answer && <span className="ml-2 text-red-600">(Your answer)</span>}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Badge
                          className={`${
                            result.answer === result.question.correctAnswer
                              ? "bg-green-600 hover:bg-green-500"
                              : "bg-red-600 hover:bg-red-500"
                          }`}
                        >
                          {result.answer === result.question.correctAnswer ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }
}