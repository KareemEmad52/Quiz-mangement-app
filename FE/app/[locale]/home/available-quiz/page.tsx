"use client"

import React, { useState } from "react"
import { BookOpen, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuizList } from "@/components/QuizList"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query";
import { QuizResponse } from "@/types/types";
import { getAllQuizzes } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import Image from "next/image"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { QuizCardSkeleton } from "@/components/Skeletons/QuizCard"

export default function QuizzesPage({ params }: { params: Promise<any> }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const t = useTranslations("HomePage.AllQuizzesPage");
  const { locale } = React.use(params)
  const { data, isLoading, isError, error } = useQuery<QuizResponse>({
    queryKey: ['quizzes'],
    queryFn: getAllQuizzes,
  })

  if (error) {
    const err = error as AxiosError
    if (err.response?.status === 401) {
      toast.error(t("logAgain"), {
        duration: 5000,
        closeButton: true,
      });
    }
  }


  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("AvailableQuizzes")}</h1>
          </div>

          <div className="flex flex-col gap-4   lg:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search
                className={`absolute ${locale === 'ar' ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
              <Input
                placeholder={t("Search") as string}
                className={`${locale === 'ar' ? 'pr-8' : 'pl-8'} w-full focus-visible:ring-blue-600`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="md:w-[140px] w-full focus:ring-blue-600 focus-visible:ring-blue-600">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("AllLevels")}</SelectItem>
                  <SelectItem value="up_coming">{t("easy")}</SelectItem>
                  <SelectItem value="in_progress">{t("medium")}</SelectItem>
                  <SelectItem value="finished">{t("hard")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="md:w-[140px] w-full focus:ring-blue-600 focus-visible:ring-blue-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("Newest")}</SelectItem>
                  <SelectItem value="oldest">{t("Oldest")}</SelectItem>
                  <SelectItem value="duration">{t("Duration")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t("Filter")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">


        {isError || data?.data.length == 0 && <div className="text-red-500 w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 justify-center">
            <Image src="/empty-state.png" width={200} height={200} alt="error" />
            <h1 className="text-xl font-[300] text-gray-900">{t("NoData")}</h1>
          </div>
        </div>}

        {/* If Data is Loading, Show Skeletons */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
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
        {data && (
          <QuizList searchTerm={searchTerm} status={status} sortBy={sortBy} quizData={data.data} />
        )}
      </div>
    </div>
  )
}

