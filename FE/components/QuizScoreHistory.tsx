"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { getAllQuizzesResults } from "@/utils/api"
import { QuizWithResultsResponse, StatusEnums } from "@/types/types"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { DesktopSkeletonQuizHistory } from "./Skeletons/QuizHistoryWebView"
import { QuizHistoryMobileSkeleton } from "./Skeletons/QuizHistoryMobileView"
import Image from "next/image"



export default function QuizHistoryPage() {
  const [sortBy, setSortBy] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const t = useTranslations("HomePage.ScoresHistoryPage")

  const { data, isLoading, isError, error } = useQuery<QuizWithResultsResponse>({
    queryKey: ['quizzScoreHistory'],
    queryFn: getAllQuizzesResults
  })
  console.log(data);
  

  if (error) {
    const err = error as AxiosError
    if (err.response?.status === 401) {
      toast.error(t("logAgain"), {
        duration: 5000,
        closeButton: true,
      });
    }
  }


  const sortedQuizHistory = [...(data?.data || [])].sort((a, b) => {
    if (sortBy === "score") {
      return b.score - a.score;
    } else if (sortBy === "SubmittedAt") {
      return Date.parse(b.submittedAt) - Date.parse(a.submittedAt);
    }
    return 0;
  });

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>

          <div className="flex justify-end mb-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] sm:w-[180px] focus:ring-blue-600 focus-visible:ring-blue-600">
                <SelectValue placeholder={t("SortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">{t("SortByScore")}</SelectItem>
                <SelectItem value="SubmittedAt">{t("SubmittedAt")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>



      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 sm:px-6 py-4 sm:py-8"
      >
        {isLoading ? (
          <>
            <div className="hidden lg:block">
              <DesktopSkeletonQuizHistory />
            </div>
            <div className="lg:hidden">
              <QuizHistoryMobileSkeleton />
            </div>
          </>
        ) : (
          <>
            {isError || data?.data.length === 0 ? <div className="text-red-500 w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 justify-center">
                <Image src="/empty-state.png" width={200} height={200} alt="error" />
                <h1 className="text-xl font-[300] text-gray-900">{t("NoData")}</h1>
              </div>
            </div> :
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-center">
                        <TableHead className="text-center">{t("QuizTitle")}</TableHead>
                        <TableHead className="text-center">{t("Subject")}</TableHead>
                        <TableHead className="text-center">{t("Duration")}</TableHead>
                        <TableHead className="text-center">{t("SubmitAt")}</TableHead>
                        <TableHead className="text-center">{t("Score")}</TableHead>
                        <TableHead className="text-center">{t("Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedQuizHistory.map((submitted) => (
                        <TableRow
                          key={submitted._id}
                          className="hover:bg-gray-200 text-center"
                        >
                          <TableCell className="font-medium">
                            {submitted.quiz.title}
                          </TableCell>
                          <TableCell>{submitted.quiz.description}</TableCell>
                          <TableCell>{submitted.quiz.duration}</TableCell>
                          <TableCell>
                            {new Date(submitted.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {((submitted.score/submitted.quiz.questions.length)*100).toFixed(2)} %
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/home/scores-history/${submitted.quiz._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("ViewDetails")}
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden space-y-4">
                  {sortedQuizHistory.map((submitted) => (
                    <div
                      key={submitted._id}
                      className="bg-white rounded-lg shadow p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {submitted.quiz.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {submitted.quiz.description}
                          </p>
                        </div>
                        <Badge
                          className={
                            submitted.quiz.status === StatusEnums.COMPLETED
                              ? "bg-green-600 text-white hover:bg-green-500"
                              : submitted.quiz.status === StatusEnums.IN_PROGRESS
                                ? "bg-gray-700 text-white"
                                : "bg-red-500 text-white hover:bg-red-600"
                          }
                        >
                          {submitted.quiz.status}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">{t("Duration")}</p>
                          <p className="font-medium">{submitted.quiz.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t("Score")}</p>
                          <p className="font-medium">{((submitted.score/submitted.quiz.questions.length)*100).toFixed(2)} %</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t("SubmitAt")}</p>
                          <p className="font-medium">
                            {new Date(submitted.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full" variant="outline" size="sm" asChild>
                          <Link href={`/home/scores-history/${submitted.quiz._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("ViewDetails")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          </>
        )}
      </motion.div>
    </div>
  )
}