"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Lock } from "lucide-react"
import InputField from "../InputField"
import ButtonAnimate from "../Button-animate"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Cookies from "js-cookie";
import { useAppStore } from "@/lib/Store/Store"
import { jwtDecode } from "jwt-decode"
import { LoginData, LoginResponse, User } from "@/types/types"
import { useMutation } from "@tanstack/react-query"
import { login as LoginFn } from "@/utils/api"
import { toast } from "sonner"
import { AxiosError } from "axios"

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmVlbWVtYWRAZ21haWwuY29tIiwiX2lkIjoiNjZhMjU2ZjBhOTRhM2M5NTY0MWE5MGE4IiwibmFtZSI6ImthcmVlbSBFbWFkIiwicHJvZmlsZVBpY3R1cmUiOnsiX2lkIjoiNjZhMjU2ZjBhOTRhM2M5NTY0MWE5MGE2IiwicGF0aCI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2Ruc3Zpc3V3dy9pbWFnZS91cGxvYWQvdjE3MjE5MTUxMjAvd3h0cndodGp0eGJ5d3N2amhwa3YuanBnIn0sInJvbGUiOiJhZG1pbiIsInByb2R1Y3RDYXJ0Q291bnQiOjAsImlhdCI6MTczNzk4NDIzOH0.6F76p0MxgL8WE1RKD8YM7a-qrJIHo7WSiv0dwCpNCCQ"

export default function LoginForm() {

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const login = useTranslations("Login")
  const setUser = useAppStore((state) => state.setUser)
  const setToken = useAppStore((state)=> state.SetToken)
  const formSchema = z.object({
    email: z.string()
      .email({
        message: login('validation.email')
      }),
    password: z.string()
      .min(6, {
        message: login('validation.password.min')
      })
      .max(50, {
        message: login('validation.password.max')
      })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  const { mutate } = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: (data: LoginData) => LoginFn(data),
    onSuccess: async (data) => {
      const user: User = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        gender: data.data.user.gender
      };

      // Set token and role in cookies
      Cookies.set("user", JSON.stringify({ token: data.data.token, role: data.data.user.role }), {
        expires: 7,
        path: "/",
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "strict"
      });

      setToken(data.data.token);

      // Prefetch the home page after adding token in cookies to avoid middleware blocks
      router.prefetch('/home');

      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Update user state
      setUser(data.data.user);

      toast.success(data.message,{
        duration: 1000
      });

      router.push('/home');
    },
    onError: (err) => {
      const error = err as AxiosError<any>
      toast.error((error.response?.data as any).message as string || "Something went wrong")
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    mutate(values);
  }



  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <InputField
          control={form.control}
          placeholder={login('email')}
          type="text"
          label={login('email')}
          name='email'
          error={form.formState.errors.email}
        />

        <InputField
          control={form.control}
          placeholder={login('password')}
          type="password"
          label={login('password')}
          name="password"
          icon={<Lock className="w-4 h-4" />}
          error={form.formState.errors.password}
        />
        <ButtonAnimate loading={loading} disabled={loading} className="w-full" type="submit">
          {login('btn')}
        </ButtonAnimate>
      </form>
    </Form>
  )
}