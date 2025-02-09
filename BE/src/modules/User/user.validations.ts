
import * as yup from 'yup';
export const getUserByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});
 