"use client";

import React, { useState } from "react";
import { BookOpen, Search, Filter, Phone, Mail, MapPin, GraduationCap, User, Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteQuizResponse, Quiz, QuizResponse } from "@/types/types";
import { useRouter } from "@/i18n/routing";
import { deleteQuiz, getAllQuizzes } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { MobileCardView } from "./MobileViewQuizzes";
import { DesktopSkeletonTable } from "./Skeletons/WebViewQuizzes";
import { MobileSkeletonCard } from "./Skeletons/MobileViewQuizzes";
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"



interface QuizTableProps {
  locale: string,
}


export default function AllQuizzesTable({ locale }: QuizTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const t = useTranslations("AllQuizzes");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const dateLocale = locale === "ar" ? ar : enUS
  const router = useRouter()
  const queryClient = useQueryClient()
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


  const {mutateAsync} = useMutation<DeleteQuizResponse,Error, string>({
    mutationFn: (id) => deleteQuiz(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] , refetchType: "all" });
    },
    onError: (error) => {
      const err = error as AxiosError<any>
      toast.error(err?.response?.data.message as string || "Something went wrong")
    },onSettled: () => {
      setLoading(false)
    }
  })


  const filteredQuizzes = data?.data ? data.data.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "duration") {
      return a.duration - b.duration;
    } else if (sortBy === "deadline") {
      return a.deadline.localeCompare(b.deadline);
    }
    return 0;
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteAlert(true);
  };

  const handleDeleteQuiz = (id: string) => {
    const promise = mutateAsync(id); // Use mutateAsync to get a promise
  
    toast.promise(promise, {
      loading: 'Deleting quiz...',
      success: (data) => {
        return `Quiz deleted successfully`;
      },
      error: (error) => {
        const err = error as AxiosError<any>;
        return err?.response?.data.message as string || "Something went wrong";
      },
    });
  };

  const handleNavigateToEditQuiz = (quizId: string) => {
    router.push(`/home/edit-quiz/${quizId}`)
  }


  // Mobile Card View Component


  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader className={`${locale === "ar" ? "items-start" : ""}`}>
            <AlertDialogTitle>{t("alertTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("alertMessage")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-3 items-center`}>
            <AlertDialogCancel className="mt-0">{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-500 m-0" onClick={() => handleDeleteQuiz(deleteId)}>
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Title */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search
                className={`absolute ${locale === "ar" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-muted-foreground`}
              />
              <Input
                placeholder={t("Search") as string}
                className={`${locale === "ar" ? "pr-8" : "pl-8"} w-full focus-visible:ring-blue-600`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px] focus:ring-blue-600 focus-visible:ring-blue-600">
                  <SelectValue placeholder={t("SortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">{t("SortByTitle")}</SelectItem>
                  <SelectItem value="duration">{t("SortByDuration")}</SelectItem>
                  <SelectItem value="deadline">{t("SortByDate")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                {t("Filter")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {isLoading ? <>
            {/* Mobile Skeleton */}
            <div className="md:hidden">
              {[...Array(3)].map((_, index) => (
                <MobileSkeletonCard key={index} />
              ))}
            </div>

            {/* Desktop Skeleton */}
            <DesktopSkeletonTable />
          </> : <>
            {/* Mobile View (Card Layout) */}
            <div className="md:hidden">
              {sortedQuizzes.map((quiz) => (
                <MobileCardView key={quiz._id} quiz={quiz} handleDelete={handleDelete} handleNavigateToEditQuiz={handleNavigateToEditQuiz}/>
              ))}
            </div>

            {/* Desktop View (Table Layout) */}
            <div className="hidden md:block overflow-hidden rounded-lg shadow-sm">
              <div className="overflow-x-auto bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={`w-[30%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Title")}</TableHead>
                      <TableHead className={`w-[20%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Duration")}</TableHead>
                      <TableHead className={`w-[20%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("deadline")}</TableHead>
                      <TableHead className={`w-[10%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("numberOfQuestions")}</TableHead>
                      <TableHead className={`w-[20%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedQuizzes.map((quiz) => (
                      <TableRow key={quiz._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium" title={quiz.title}>
                          {truncateText(quiz.title, 20)}
                        </TableCell>
                        <TableCell>{quiz.duration}</TableCell>
                        <TableCell>{format(new Date(quiz.deadline), "PPp", { locale: dateLocale })}</TableCell>
                        <TableCell>{quiz.questions.length}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(quiz._id)} className="  hover:bg-red-500 hover:text-white transition-colors duration-300">
                              <Trash className="h-8 w-8" />
                            </Button>
                            <Button onClick={() => handleNavigateToEditQuiz(quiz._id)} size="icon" variant="ghost" className="  hover:bg-blue-600 hover:text-white transition-colors duration-300">
                              <Pencil className="h-8 w-8" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

          </>}


        </motion.div>
      </div>
    </div>
  );
}