"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import ButtonAnimate from "../Button-animate"
import { useTranslations } from "next-intl"
import { z } from "zod"
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, set } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { CreateQuizResponse, QuizOutput, StatusEnums } from "@/types/types"
import { Query, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { createNewQuiz, getAllQuizzes } from "@/utils/api"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { convertQuizData } from "@/utils/helpers"
import { useState } from "react"



export default function CreateQuizForm() {

  const t = useTranslations("GenerateQuiz")
  const quizSchema = z.object({
    quizTitle: z.string().min(1, { message: t("QuizTitleRequired") }),
    quizDescription: z.string().min(1, { message: t("QuizDescriptionRequired") }),
    quizDuration: z.string().min(1, { message: t("DurationRequired") }),
    dueDate: z.string().datetime(t("DueDateRequired")),
    startTime: z.string().datetime({ message: t("StartTimeRequired") }),
    status: z.enum([StatusEnums.COMING_SOON, StatusEnums.COMPLETED, StatusEnums.IN_PROGRESS], { message: t("StatusRequired") }),
    questions: z.array(
      z.object({
        text: z.string().min(1, { message: t("QuestionRequired") }),
        options: z.array(z.string().min(1, { message: t("AnswerRequired") })).length(4),
        correctAnswer: z.string().min(1, { message: t("CorrectAnswerRequired") }).refine((value) => value !== "^", { message: t("CorrectAnswerRequired") }),
      })
    ),
  })

  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const { mutate } = useMutation<CreateQuizResponse, Error, QuizOutput>({
    mutationFn: (data: QuizOutput) => createNewQuiz(data),
    onSuccess: async (data) => {
      await queryClient.prefetchQuery({ queryKey: ['quizzes'] ,queryFn: getAllQuizzes, })
      toast.success(t("Added"));
      reset();
      // router.push('/teacher/quizzes');
    },
    onError: (error) => {
      const err = error as AxiosError<any>
      toast.error(err?.response?.data.message as string || "Something went wrong");
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  type QuizFormValues = z.infer<typeof quizSchema>
  const router = useRouter()

  const { control, handleSubmit, register, setValue, watch, formState: { errors }, reset } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      quizTitle: "",
      quizDescription: "",
      dueDate: "",
      questions: [{
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "^"
      }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  console.log(errors);

  const onSubmit = (data: QuizFormValues) => {
    
    setLoading(true)
    const newData = convertQuizData(data)
    mutate(newData)
  }

  const handleCorrectAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const questions = watch("questions")
    const selectedAnswer = questions[questionIndex].options[answerIndex]

    setValue(`questions.${questionIndex}.correctAnswer`, selectedAnswer, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
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
              <Input id="quizTitle" className="focus-visible:ring-blue-600" {...register("quizTitle")} />
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
              <Label htmlFor="quizDuration">{t("QuizDuration")}</Label>
              <Input id="quizDuration" className="focus-visible:ring-blue-600" {...register("quizDuration")} />
              {errors.quizDuration && <span className="text-red-500">{errors.quizDuration.message}</span>}
            </div>
            <div className="space-y-2 flex flex-col gap-2 ">
              <Label htmlFor="dueDate" >{t("DueDate")}</Label>
              <Popover>
                <PopoverTrigger asChild >
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-full justify-start text-left font-normal",
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


            <div className="space-y-2 flex flex-col gap-2 ">
              <Label htmlFor="dueDate" >{t("status")}</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full focus:ring-blue-600 focus-visible:ring-blue-600">
                      <SelectValue placeholder={t('selectStatus')} className="placeholder:text-gray-400" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={StatusEnums.COMPLETED}>{StatusEnums.COMPLETED}</SelectItem>
                      <SelectItem value={StatusEnums.IN_PROGRESS}>{StatusEnums.IN_PROGRESS}</SelectItem>
                      <SelectItem value={StatusEnums.COMING_SOON}>{StatusEnums.COMING_SOON}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <span className="text-red-500">{errors.status.message}</span>}
            </div>


            <div className="space-y-2 flex flex-col gap-2 ">
              <Label htmlFor="startTime" >{t("StartTime")}</Label>
              <Popover>
                <PopoverTrigger asChild >
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-full justify-start text-left font-normal",
                      !watch("startTime") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {watch("startTime") ? format(new Date(watch("startTime")), "PPP") : <span>{t("PickDate")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("startTime") ? new Date(watch("startTime")) : undefined}
                    onSelect={(date) => {
                      setValue("startTime", date?.toISOString() || "")
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startTime && <span className="text-red-500">{errors.startTime.message}</span>}
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
              {[0, 1, 2, 3].map((answerIndex) => (
                <div key={answerIndex} className="space-y-2">
                  <Label htmlFor={`question-${questionIndex}-answer-${answerIndex}`}>
                    {t("Answer")} {answerIndex + 1}
                  </Label>
                  <div className="flex space-x-2 gap-2">
                    <Input
                      id={`question-${questionIndex}-answer-${answerIndex}`}
                      className="focus-visible:ring-blue-600"
                      {...register(`questions.${questionIndex}.options.${answerIndex}`)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={watch(`questions.${questionIndex}.options.${answerIndex}`) === ""}
                      className={`${watch(`questions.${questionIndex}.correctAnswer`) === watch(`questions.${questionIndex}.options.${answerIndex}`) &&
                        watch(`questions.${questionIndex}.options.${answerIndex}`) !== ""
                        ? "bg-green-600 text-white hover:bg-green-500 hover:text-white"
                        : ""
                        }`}
                      onClick={() => handleCorrectAnswerSelect(questionIndex, answerIndex)}
                    >
                      {watch(`questions.${questionIndex}.correctAnswer`) === watch(`questions.${questionIndex}.options.${answerIndex}`) &&
                        watch(`questions.${questionIndex}.options.${answerIndex}`) !== ""
                        ? t("Correct")
                        : t("MarkAsCorrect")}
                    </Button>
                  </div>
                  {errors.questions?.[questionIndex]?.options?.[answerIndex] && (
                    <span className="text-red-500">
                      {errors.questions[questionIndex]?.options[answerIndex]?.message}
                    </span>
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

      <div className="flex justify-between">
        <ButtonAnimate
          variant="secondary"
          type="button"
          onClick={() =>
            append({
              text: "",
              options: ["", "", "", ""],
              correctAnswer: "^"
            })
          }
        >
          <div className="flex items-center justify-center gap-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("AddQuestion")}
          </div>
        </ButtonAnimate>
        <ButtonAnimate type="submit" loading={loading} disabled={loading}>{t("generateQuiz")}</ButtonAnimate>
      </div>
    </form>
  )
}
