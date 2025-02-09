"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import ButtonAnimate from "../Button-animate"
import { useTranslations } from "next-intl"
import { ConvertedUpdatedQuiz, EditQuizResponse, OriginalUpdatedQuiz, Quiz } from "@/types/types"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMutation } from "@tanstack/react-query"
import { updateQuiz } from "@/utils/api"
import { Axios, AxiosError } from "axios"
import { toast } from "sonner"
import { useState } from "react"



interface UpdateQuizFormProps {
  quiz: Quiz
}

export default function UpdateQuizForm({ quiz }: UpdateQuizFormProps) {
  const router = useRouter()
  const t = useTranslations("EditQuiz")
  const [isLoading, setIsLoading] = useState(false);

  // Define the schema using zod
  const quizSchema = z.object({
    quizTitle: z.string().min(1, t("QuizTitleRequired")),
    quizDescription: z.string().min(1, t("QuizDescriptionRequired")),
    quizDuration: z.number().min(1, t("DurationRequired")),
    dueDate: z.string().datetime(t("DueDateRequired")),
    questions: z.array(
      z.object({
        id: z.string().optional(),
        text: z.string().min(1, t("QuestionRequired")),
        options: z.array(z.string().min(1, t("AnswerRequired"))).length(4),
        correctAnswer: z.string().min(1, t("CorrectAnswerRequired")).refine((value) => value !== "", t("CorrectAnswerRequired")),
      })
    ),
  })


  type QuizFormValues = z.infer<typeof quizSchema>

  const { control, handleSubmit, register, setValue, watch, formState: { errors ,isDirty } } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      quizTitle: quiz.title,
      quizDescription: quiz.description,
      quizDuration: quiz.duration,
      dueDate: quiz.deadline,
      questions: quiz.questions.map((question, index) => ({
        id: question._id,
        text: question.title,
        options: question.choices,
        correctAnswer: question.correctAnswer
      }))
    },
  })

  const watchQuestions = watch("questions")


  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const convertQuizFormat = (quiz: OriginalUpdatedQuiz): ConvertedUpdatedQuiz => {
    return {
      title: quiz.quizTitle,
      description: quiz.quizDescription,
      duration: quiz.quizDuration,
      questions: quiz.questions.map(({ id,text, options, correctAnswer }) => ({
        _id: id,
        title: text,
        choices: options,
        correctAnswer: correctAnswer,
      })),
      startTime: "2025-02-03T10:00:00Z",
      status: "coming_Soon",
      deadline: quiz.dueDate,
    };
  };


  const { mutate } = useMutation<EditQuizResponse, AxiosError, ConvertedUpdatedQuiz>({
    mutationFn: (data: ConvertedUpdatedQuiz) => updateQuiz(data, quiz._id),
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success(data.message)
      }
    },
    onError: (error) => {
      const errorMessage = (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) ? (error.response.data as { message: string }).message : "Something went wrong";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  })

  const onSubmit = (data: QuizFormValues) => {
    setIsLoading(true);
    mutate(convertQuizFormat(data as OriginalUpdatedQuiz));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("QuizDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quizTitle">{t("QuizTitle")}</Label>
              <Input
                id="quizTitle"
                className="focus-visible:ring-blue-600"
                {...register("quizTitle")}
              />
              {errors.quizTitle && <span className="text-red-500">{errors.quizTitle.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quizDescription">{t("QuizDesc")}</Label>
              <Textarea
                id="quizDescription"
                className="focus-visible:ring-blue-600"
                {...register("quizDescription")}
              />
              {errors.quizDescription && <span className="text-red-500">{errors.quizDescription.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="QuizDuration">{t("QuizDuration")}</Label>
              <Input
                id="QuizDuration"
                className="focus-visible:ring-blue-600"
                type="text"
                {...register("quizDuration", {
                  valueAsNumber: true
                })}
              />
              {errors.quizDuration && <span className="text-red-500">{errors.quizDuration.message}</span>}
            </div>

            <div className="space-y-2 flex flex-col gap-2 ">
              <Label htmlFor="dueDate" >{t("DueDate")}</Label>
              <Popover>
                <PopoverTrigger asChild >
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-[240px] justify-start text-left font-normal",
                      !watch("dueDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {watch("dueDate") ? format(new Date(watch("dueDate")), "PPP") : <span>{t("PickDate")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("dueDate") ? new Date(watch("dueDate")) : undefined}
                    onSelect={(date) => {
                      setValue("dueDate", date?.toISOString() || "")
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dueDate && <span className="text-red-500">{errors.dueDate.message}</span>}
            </div>

          </CardContent>
        </Card>
      </motion.div>

      {fields.map((question, questionIndex) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: questionIndex * 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("Question")} {questionIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">{t("questionID")}</Label>
                <Input
                  id="id"
                  className="focus-visible:ring-blue-600"
                  value={question.id}
                  readOnly
                  disabled
                  {...register(`questions.${questionIndex}.id`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`question-${questionIndex}`}>{t("Question")}</Label>
                <Input
                  id={`question-${questionIndex}`}
                  className="focus-visible:ring-blue-600"
                  {...register(`questions.${questionIndex}.text`)}
                />
                {errors.questions?.[questionIndex]?.text && (
                  <span className="text-red-500">{errors.questions[questionIndex]?.text?.message}</span>
                )}
              </div>
              {question.options.map((answer, answerIndex) => (
                <div key={answerIndex} className="space-y-2">
                  <Label htmlFor={`question-${questionIndex}-answer-${answerIndex}`}>{t("Answer")} {answerIndex + 1}</Label>
                  <div className="flex space-x-2 gap-2">
                    <Input
                      id={`question-${questionIndex}-answer-${answerIndex}`}
                      className="focus-visible:ring-blue-600"
                      {...register(`questions.${questionIndex}.options.${answerIndex}`)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={watchQuestions[questionIndex].options[answerIndex] === ""}
                      className={`${watchQuestions[questionIndex].correctAnswer === answer && watchQuestions[questionIndex].correctAnswer !== "" ? "bg-green-600 text-white hover:bg-green-500 hover:text-white" : ""}`}
                      onClick={() => {
                        setValue(`questions.${questionIndex}.correctAnswer`, answer)
                      }}
                    >
                      {watchQuestions[questionIndex].correctAnswer === answer && watchQuestions[questionIndex].options[answerIndex] !== "" ? t("Correct") : t("MarkAsCorrect")}
                    </Button>
                  </div>
                  {errors.questions?.[questionIndex]?.options?.[answerIndex] && (
                    <span className="text-red-500">{errors.questions[questionIndex]?.options[answerIndex]?.message}</span>
                  )}
                </div>
              ))}
              {errors.questions?.[questionIndex]?.correctAnswer && (
                <span className="text-red-500">{errors.questions[questionIndex]?.correctAnswer?.message}</span>
              )}
            </CardContent>
            <CardFooter>
              <Button type="button" variant="destructive" onClick={() => remove(questionIndex)}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("RemoveQuestion")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      <div className="flex justify-end">
        {/* <ButtonAnimate variant="secondary" type="button" >
          <div className="flex items-center justify-center gap-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("AddQuestion")}
          </div>
        </ButtonAnimate> */}
        <ButtonAnimate type="submit" loading={isLoading} disabled={!isDirty}>{t("generateQuiz")}</ButtonAnimate>
      </div>
    </form>
  )
}