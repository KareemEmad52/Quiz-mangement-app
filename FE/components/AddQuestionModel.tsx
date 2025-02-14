"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonAnimate from "./Button-animate";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQuestion, getSpacificQuizData } from "@/utils/api";
import {  AddQuestionToSpecificQuiz } from "@/types/types";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAppStore } from "@/lib/Store/Store";

const AddQuestionModel = ({ quizId  }: { quizId: string }) => {
  const t = useTranslations("EditQuiz");
  const [open, setOpen] = useState(false);

  const addQuestionSchema = z.object({
    title: z.string().min(1, t("QuestionRequired")),
    choices: z.array(z.string().min(1, t("AnswerRequired"))).length(4),
    correctAnswer: z.string().min(1, t("CorrectAnswerRequired")),
  });

  type FormData = z.infer<typeof addQuestionSchema>;
  const queryClient = useQueryClient();
  const token = useAppStore((state) => state.token);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(addQuestionSchema),
    defaultValues: {
      title: "",
      choices: ["", "", "", ""],
      correctAnswer: "",
    },
  });

  const choices = watch("choices");

  const { mutate, status } = useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: AddQuestionToSpecificQuiz }) => 
      addQuestion(quizId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["singleQuizData", quizId] });
      console.log(data);
      toast.success(t("successfullyAdded"));
      reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      const err = error as AxiosError<any>
      toast(err?.response?.data.message as string || "Something went wrong");
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({
      quizId,
      data: {
        ...data,
        correctAnswer: data.choices[parseInt(data.correctAnswer)],
      },
    });
  };

  const isLoading = status === 'pending';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="translate-y-[-100%]">
          <ButtonAnimate
            variant="secondary"
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
          >
            {t("AddQuestion")}
          </ButtonAnimate>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>{t("AddNewQuestion")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              {t("Question")}
            </label>
            <Input
              {...register("title")}
              id="title"
              type="text"
              className="focus-visible:ring-blue-600"
              placeholder={t("EnterQuestion")}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <Input
                  {...register(`choices.${index}`)}
                  placeholder={`${t("Answer")} ${index + 1}`}
                  className="focus-visible:ring-blue-600"
                  disabled={isLoading}
                />
                {errors.choices?.[index] && (
                  <p className="text-red-500 text-sm">
                    {errors.choices[index]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("CorrectAnswer")}
            </label>
            <div className="flex gap-2">
              <Controller
                name="correctAnswer"
                control={control}
                render={({ field }) => (
                  <>
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => field.onChange(index.toString())}
                        disabled={!choices[index] || isLoading}
                        className={cn(
                          "h-8 w-8 rounded-lg border-2 transition-all duration-200",
                          "flex items-center justify-center",
                          "text-lg font-medium",
                          field.value === index.toString()
                            ? "bg-green-500 border-green-600 text-white"
                            : "border-gray-300 hover:border-gray-400",
                          !choices[index] && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          {errors.correctAnswer && (
            <p className="text-red-500 text-sm">{errors.correctAnswer.message}</p>
          )}

          <ButtonAnimate type="submit" className="w-full" loading={isLoading}>
            {t("AddQuestion")}
          </ButtonAnimate>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionModel;