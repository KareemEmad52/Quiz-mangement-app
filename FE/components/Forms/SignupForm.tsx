"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Lock } from "lucide-react"
import InputField from "../InputField"
import ButtonAnimate from "../Button-animate"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query"
import { signup } from "@/utils/api"
import {SignupData, UserGender} from "@/types/types"
import { AxiosError } from "axios"
import { toast } from "sonner"




export default function SignupForm() {

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations("Signup")
  const { mutate } = useMutation({
    mutationFn: (data: SignupData) => signup(data),
    onSuccess: ({ data }) => {
      toast.success(data.message);
      router.push('/login');
    },
    onError: (err) => {
      const error = err as AxiosError<any>      
      toast.error((error.response?.data as any).message as string || "Something went wrong")
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  const formSchema = z.object({
    name: z.string()
      .min(2, {
        message: t('validation.name.min')
      })
      .max(50, {
        message: t('validation.name.max')
      }),
    email: z.string().email({
      message: t('validation.email')
    }),
    password: z.string()
      .min(6, {
        message: t('validation.password.min')
      })
      .max(50, {
        message: t('validation.password.max')
      }),
    gender: z.enum([UserGender.MALE, UserGender.FEMALE], {
      message: t('validation.gender')
    })
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    router.prefetch("/login")
    mutate(values)
  }



  return (
    <Form {...form} >
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <InputField
          control={form.control}
          placeholder={t('name')}
          type="text"
          label={t('name')}
          name='name'
          error={form.formState.errors.name}
        />

        <InputField
          control={form.control}
          placeholder={t('email')}
          type="text"
          label={t('email')}
          name='email'
          error={form.formState.errors.email}
        />

        <InputField
          control={form.control}
          placeholder={t('password')}
          type="password"
          label={t('password')}
          name="password"
          icon={<Lock className="w-4 h-4" />}
          error={form.formState.errors.password}
        />


        <Controller
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${form.formState.errors.gender && "text-destructive"}`}>{t('gender')}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full focus:ring-blue-600 focus-visible:ring-blue-600">
                    <SelectValue placeholder={t('selectGender')} className="placeholder:text-gray-400" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>
                {form.formState.errors.gender && form.formState.errors.gender.message}
              </FormMessage>
            </FormItem>
          )}
        />




        <ButtonAnimate loading={loading} disabled={loading} className="w-full" type="submit">
          {t('btn')}
        </ButtonAnimate>
      </form>
    </Form >
  )
}
