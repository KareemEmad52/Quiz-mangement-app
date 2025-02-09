import * as yup from "yup";

export const submitQuizValidationSchema = yup.object().shape({
  body: yup
    .object()
    .shape({
      answers: yup.array().of(yup.object().shape({ questionId: yup.string().required("questionId is required"), selected: yup.string().required("selected is required") })),
    })
    .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
  params: yup.object({ quizId: yup.string().required() }),
  query: yup
    .object()
    .noUnknown(true, "Unknown fields are not allowed ${unknown}"),
});