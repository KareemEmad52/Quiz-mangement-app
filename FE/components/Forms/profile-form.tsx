"use client";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Lock, Mail, X } from "lucide-react"; // Added X icon for remove button
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ButtonAnimate from "../Button-animate";
import { useAppStore } from "@/lib/Store/Store";
import { z } from "zod";
import { UserGender } from "@/types/types";
import InputField from "../InputField";
import { toast } from "sonner";
import { useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

export default function ProfileForm({ locale }: { locale: string }) {
  const t = useTranslations("Profile");
  const user = useAppStore((state) => state.user);

  const profileSchema = z.object({
    name: z.string().min(3, { message: t("validation.name.min") }).max(50, { message: t("validation.name.max") }),
    email: z.string().email({ message: t("validation.email") }),
    password: z.string().min(6, { message: t("validation.password.min") }).max(50, { message: t("validation.password.max") }),
    gender: z.enum([UserGender.MALE, UserGender.FEMALE], { message: t("validation.gender") }),
    image: z.any().optional(),
  });

  const methods = useForm<z.infer<typeof profileSchema>>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      password: "",
      gender: user.gender as UserGender || UserGender.MALE,
      image: null,
    },
  });

  const { register, handleSubmit, formState: { isSubmitting, errors, isDirty }, setValue, watch, control } = methods;

  const profileImage = watch("image");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
    }
  };

  const handleImageRemove = () => {
    setValue("image", null);
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!isDirty) {
      toast.error(t("validation.update"), {
        position: "top-center",
      });
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form Data:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("gender", user.gender as UserGender || UserGender.MALE);
    }
  }, [setValue, user]);

  return (
    <FormProvider {...methods}>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="container mx-auto px-6 py-8"
      >
        <Card>
          <CardHeader>{/* <CardTitle>Personal Information</CardTitle> */}</CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center md:justify-start">
              <div className="relative inline-block">
                <Avatar className="md:w-36 md:h-36 w-24 h-24">
                  <AvatarImage
                    src={profileImage ? URL.createObjectURL(profileImage) : "/placeholder.png"}
                    alt={watch("name")}
                  />
                  <AvatarFallback>{watch("name")?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Label htmlFor="image-upload" className="cursor-pointer absolute bottom-0">
                  <div
                    className={`absolute bottom-0 ${locale === "en" ? "left-0" : "right-0"
                      } bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-500/90 transition-colors`}
                  >
                    <Camera className="w-4 h-4" />
                  </div>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                  onChange={handleImageUpload}
                />
                {profileImage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageRemove();
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <InputField
                control={control}
                placeholder={t("namePlaceHolder")}
                type="text"
                label={t("name")}
                name="name"
                error={errors.name}
              />
            </div>
            <div className="space-y-2">
              <InputField
                control={control}
                placeholder={t("emailPlaceHolder")}
                type="email"
                label={t("email")}
                name="email"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email}
              />
            </div>
            <div className="space-y-2">
              <InputField
                control={control}
                placeholder={t("passwordPlaceHolder")}
                type="password"
                label={t("password")}
                name="password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender">{t("gender")}</label>
              <Controller
                control={control}
                name="gender"
                defaultValue={user.gender as UserGender || UserGender.MALE}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full focus-visible:ring-blue-600 focus:ring-1 focus:ring-blue-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("gender")}</SelectLabel>
                        <SelectItem value={UserGender.MALE}>Male</SelectItem>
                        <SelectItem value={UserGender.FEMALE}>Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <ButtonAnimate type="submit" disabled={isSubmitting}>
              {isSubmitting ? `${t("updating")}...` : t("update")}
            </ButtonAnimate>
          </CardFooter>
        </Card>
      </motion.form>
    </FormProvider>
  );
}