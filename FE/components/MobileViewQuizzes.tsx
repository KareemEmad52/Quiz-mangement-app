import { GraduationCap, ListOrdered, Mail, MapPin, NotebookTabs, Phone, Timer, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Quiz } from "@/types/types";
import { useTranslations } from "next-intl";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};


export const MobileCardView = ({ quiz , handleDelete ,handleNavigateToEditQuiz }: { quiz: Quiz , handleDelete: (id: string) => void ,handleNavigateToEditQuiz: (id: string) => void }) => {

  const t = useTranslations("AllQuizzes");

return <>
  <Card className="mb-4" key={quiz._id}>
    <CardContent className="pt-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{truncateText(quiz.title, 30)}</span>
        </div>
        <div className="flex items-center gap-2">
          <NotebookTabs className="h-4 w-4 text-blue-500" />
          <span>{quiz.description}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-blue-500" />
          <span>{quiz.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-blue-500" />
          <span>{quiz.questions.length}</span>
        </div>
        <div className="flex items-center justify-center flex-col ">
          <Button onClick={()=> handleDelete(quiz._id)} className="w-full mt-2 hover:bg-red-500 hover:text-white transition-colors duration-300" variant="outline" >
            {t("Delete")}
          </Button>
          <Button onClick={() => handleNavigateToEditQuiz(quiz._id)} className="w-full mt-2 hover:bg-blue-500 hover:text-white transition-colors duration-300" variant="outline">
            {t("EditStudent")}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</>
};