"use client"
import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { CircleAlert } from 'lucide-react'
import ButtonAnimate from './Button-animate'
import {motion} from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'


const QuizNotFound = ({locale}: {locale: string}) => {
  const router = useRouter();
  const t = useTranslations("HomePage.QuizPage")
  
  const handleNaviagte = (path:string) => {
    if(path === "home"){
      router.push(`/home`)
      return
    }
    router.replace(`/home/${path}`)
  }

  return (
    <motion.div initial={{ opacity: 0 ,y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen flex justify-center items-center">
          <Card className="w-[95%] md:w-[75%] xl:w-[60%] bg-white">
            <CardHeader>
              <div className="flex justify-center items-center gap-3 mb-2">
                <CircleAlert className="h-12 w-12 text-red-500" />
                <span className="text-lg md:text-3xl font-semibold">{t("StartQuizFirst")}</span>
              </div>
              <hr className="mb-5" />
              <div className="flex justify-center items-center gap-3 mb-2 pt-5">

                <ButtonAnimate variant="primary" className='!text-sm md:!text-md' onClick={()=> handleNaviagte("available-quiz")} >{t("goToAllQuizzes")}</ButtonAnimate>
                <ButtonAnimate variant="secondary" className='!text-sm md:!text-md' onClick={()=> handleNaviagte("home")}>{t("backToHome")}</ButtonAnimate>
              </div>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </motion.div>
  )
}

export default QuizNotFound