"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Question, QuizAnswersDto, QuizSubmissionResponse, type Quiz } from "@/types/types";
import { motion } from "framer-motion";
import { Award, BarChart, Brain, CheckCircle2, CircleAlert, CircleCheck, Clock, GraduationCap, Target, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/lib/Store/Store";
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
import React, { useEffect, useState } from "react";
import ButtonAnimate from "@/components/Button-animate";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import QuizTimer from "./quiz-timer";
import { format, set } from 'date-fns'
import { useMutation } from "@tanstack/react-query";
import { quizSubmit } from "@/utils/api";
import QuizFinished from "./QuizFinished";
import {AxiosError} from "axios";
import {toast} from "sonner";

interface QuizProps {
  quizData: Quiz;
  locale: string;
}

const Quiz = ({ quizData, locale }: QuizProps) => {
  const t = useTranslations("Quiz");
  const router = useRouter();
  const { currentQuestion: currentQuestionIndex, quizId, answers, isFinished, setAnswer, nextQuestion, prevQuestion, submitQuiz ,retakeQuiz } = useAppStore((state) => state);
  const [showSubmitAlert, setShowSubmitAlert] = useState<boolean>(false);
  const [isActiveQuiz, setIsActiveQuiz] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate, data } = useMutation<QuizSubmissionResponse, Error, string>({
    mutationFn: (id) => {
      const quizAnswers: QuizAnswersDto = {
        answers: Object.entries(answers).map(([questionId, selected]) => ({
          questionId,
          selected,
        })),
      };
      return quizSubmit(quizAnswers, id);
    },
    onSuccess: ()=>{
      submitQuiz();
    },
    onError: (error) => {
      const err = error as AxiosError<any>
      toast.error(err?.response?.data.message as string || "Something went wrong");
    },
    onSettled: ()=>{
      setIsLoading(false);
    }
  });

  useEffect(() => {
    // Start the quiz when component mounts    
    const canStart = useAppStore.getState().startQuiz(
      quizData._id.toString(),
      quizData.duration
    );

    if (!canStart) {
      setIsActiveQuiz(true)
      return;
    }

    // Check time remaining when tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        useAppStore.getState().updateTimeRemaining();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quizData._id, quizData.duration, router, t]);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    setAnswer(currentQuestion._id.toString(), option);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion._id]) {
      nextQuestion();
    }
  };

  const handlePrevQuestion = () => {
    prevQuestion();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowSubmitAlert(false);
    mutate(quizId as string);
    // router.push(`/home`);
  };



  const handleGoToActiveQuiz = () => {
    router.push(`/home/quiz/${quizId}`);
  };

  const showSubmitConfirmation = () => {
    setShowSubmitAlert(true);
  };

  if (isActiveQuiz) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Card className="w-[95%] md:w-[75%] xl:w-[60%] bg-white">
          <CardHeader>
            <div className="flex justify-center items-center gap-3 mb-2">
              <CircleAlert className="h-14 w-14 text-yellow-400" />
              <span className="text-3xl font-semibold">{t("completeActiveQuiz")}</span>
            </div>
            <hr className="mb-5" />
            <div className="flex justify-center items-center gap-3 mb-2 pt-5">

              <ButtonAnimate variant="primary" onClick={handleGoToActiveQuiz} >{t("goToActiveQuiz")}</ButtonAnimate>
              <ButtonAnimate variant="secondary" >{t("backToHome")}</ButtonAnimate>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">

            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {isFinished  && (
        <QuizFinished locale={locale} id={quizId as string} />
      )}
      

      {!isFinished && quizData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen flex justify-center items-center mb-16 mt-10">
          <Card className="w-[95%] md:w-[75%] xl:w-[60%] bg-white">
            <CardHeader>

              <div className="grid gap-4 mb-3">
                {/* Quiz Header */}
                <div className="flex justify-between">
                  <div className="flex justify-start items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold">{quizData.title}</span>
                      <span className="text-sm font-normal text-gray-500 antialiased">{quizData.description}</span>
                    </div>
                  </div>
                  <QuizTimer />
                </div>

                {/* Quiz Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2 anything">
                    <span>{t("progree")}</span>
                    <span>
                      {currentQuestionIndex + 1} {t("of")} {quizData.questions.length}
                    </span>
                  </div>
                  <Progress
                    // value={25}  
                    value={((currentQuestionIndex + 1) / quizData.questions.length) * 100}
                    className="rtl:scale-x-[-1] h-[10px] "
                  />
                </div>

                {/* Quiz Stats */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{t("TimeLeft")}</span>
                          <span className="font-medium">{quizData.duration} {t("Minutes")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{t("Difficulty")}:</span>
                          <Badge variant="secondary">{quizData.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <BarChart className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{t("NumOfQ")}:</span>
                          <span className="font-medium">{quizData.questions.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{t("DueDate")}:</span>
                          <Badge variant="secondary">{format(new Date(quizData.deadline), "PP")}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <motion.h1 className="text-xl md:text-3xl mb-5">{currentQuestion.title}</motion.h1>
              <div className="w-full flex justify-center items-center flex-col gap-5">
                {currentQuestion.choices.map((option, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 * index }} className="w-full">
                    <ButtonAnimate
                      variant={answers[currentQuestion._id] === option ? "primary" : "secondary"}
                      onClick={() => handleSelectOption(option)}
                      className={`${answers[currentQuestion._id] === option ? "!bg-blue-600" : ""} w-full justify-start text-left h-auto py-3 px-4`}
                    >
                      {option}
                    </ButtonAnimate>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <ButtonAnimate disabled={currentQuestionIndex === 0 || isLoading}  onClick={handlePrevQuestion} variant="secondary">
                  {t("previos")}
                </ButtonAnimate>
                {currentQuestionIndex === quizData.questions.length - 1 ? (
                  <>
                    <AlertDialog open={showSubmitAlert} onOpenChange={setShowSubmitAlert}>
                      <AlertDialogContent>
                        <AlertDialogHeader className={`${locale === "ar" ? "items-start" : ""}`}>
                          <AlertDialogTitle>{t("alertTitle")}</AlertDialogTitle>
                          <AlertDialogDescription>{t("alertMessage")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-3 items-center`}>
                          <AlertDialogCancel className="m-0">{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-blue-600 hover:bg-blue-500 m-0"
                            onClick={handleSubmit}
                          >
                            {t("confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <ButtonAnimate disabled={!(currentQuestionIndex === quizData.questions.length - 1) || isLoading} onClick={showSubmitConfirmation} variant="secondary" loading={isLoading}>
                      {t("submit")}
                    </ButtonAnimate>
                  </>
                ) : (
                  <ButtonAnimate disabled={(currentQuestionIndex === quizData.questions.length - 1) || !answers[currentQuestion._id]} onClick={handleNextQuestion} variant="secondary">
                    {t("next")}
                  </ButtonAnimate>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </>
  );
};

export default Quiz;