"use client";

import AddQuestionModel from "@/components/AddQuestionModel";
import UpdateQuizForm from "@/components/Forms/UpdateQuizForm";
import UpdateQuizFormSkeleton from "@/components/Skeletons/updateQuizFormSkeleton";
import { useAppStore } from "@/lib/Store/Store";
import { Quiz, SpecificQuizResponse } from "@/types/types";
import { getSingleQuiz, getSpacificQuizData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CreateNewQuizPage() {
  const t = useTranslations("EditQuiz");
  const { id } = useParams();

  const quizId = Array.isArray(id) ? id[0] : id;

  const { data ,isLoading } = useQuery<SpecificQuizResponse>({
    queryKey: ['singleQuizData', quizId],
    queryFn: () => {
      if (!quizId) {
        throw new Error("Quiz ID is undefined");
      }
      return getSingleQuiz(quizId);
    },
  });



  if (isLoading || !data) {
    return <UpdateQuizFormSkeleton />;
  }

  return (
    <>
      <div className="flex items-center gap-2 px-6 pt-8 ">
        <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
      </div>
      <UpdateQuizForm quiz={data.data as Quiz} key={data.data.questions.length} />
    </>
  );
}