import { QuizInput, QuizOutput } from "@/types/types";

const capitalizeFirstLetter = (str: string) => {
  return str.replace(/^[a-zA-Z]/, (char) => char.toUpperCase());
};

export const convertQuizData = (input: QuizInput): QuizOutput => {
  return {
    title: input.quizTitle,
    description: input.quizDescription,
    duration: parseInt(input.quizDuration, 10),
    questions: input.questions.map((q) => ({
      title: capitalizeFirstLetter(q.text.trim()), 
      type: "mcq",
      choices: q.options.map((option) => capitalizeFirstLetter(option.trim())),
      correctAnswer: capitalizeFirstLetter(q.correctAnswer.trim()),
    })),
    startTime: new Date(input.startTime).toISOString(),
    status: input.status === "in_progress" ? "coming_Soon" : input.status, 
    deadline: new Date(input.dueDate).toISOString(),
  };
};
