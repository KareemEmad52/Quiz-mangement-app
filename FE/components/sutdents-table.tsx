"use client";

import React, { useState } from "react";
import { BookOpen, Search, Filter, Mail, User, Trash, Pencil, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/utils/api";
import { Student } from "@/types/types";
import { DesktopTableEditQuizSkeleton, MobileCardEditQuizSkeleton } from "./Skeletons/EditQuizSkeletons";
import Image from "next/image";



export default function StudentsTable({ locale }: { locale: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const t = useTranslations("Students");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  const filteredStudents = data?.data.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...(filteredStudents || [])].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "gender") {
      return parseInt(a.gender) - parseInt(b.gender);
    }
    return 0;
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleDelete = () => {
    setShowDeleteAlert(true);
  };


  // Mobile Card View Component
  const MobileCardView = ({ student }: { student: Student }) => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{truncateText(student.name, 30)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleUser className="h-4 w-4 text-blue-500" />
            <span>{student.gender}</span>
          </div>
          <div className="flex items-center justify-center flex-col ">
            <Button onClick={handleDelete} className="w-full mt-2 hover:bg-red-500 hover:text-white transition-colors duration-300" variant="outline" >
              {t("Delete")}
            </Button>
            <Button className="w-full mt-2 hover:bg-blue-500 hover:text-white transition-colors duration-300" variant="outline">
              {t("EditStudent")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader className={`${locale === "ar" ? "items-start" : ""}`}>
            <AlertDialogTitle>{t("alertTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("alertMessage")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-3 items-center`}>
            <AlertDialogCancel className="m-0">{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-500 m-0">
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Title */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search
                className={`absolute ${locale === "ar" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-muted-foreground`}
              />
              <Input
                placeholder={t("Search") as string}
                className={`${locale === "ar" ? "pr-8" : "pl-8"} w-full focus-visible:ring-blue-600`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px] focus:ring-blue-600 focus-visible:ring-blue-600">
                  <SelectValue placeholder={t("SortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t("SortByName")}</SelectItem>
                  <SelectItem value="age">{t("sortByGender")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                {t("Filter")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? (
            <>
              {/* Mobile View Skeleton */}
              <div className="md:hidden">
                {[...Array(3)].map((_, index) => (
                  <MobileCardEditQuizSkeleton key={index} />
                ))}
              </div>

              {/* Desktop View Skeleton */}
              <DesktopTableEditQuizSkeleton />
            </>
          ) : <>

            {/* Mobile View (Card Layout) */}
            <div className="md:hidden">
              {sortedStudents.map((student) => (
                <MobileCardView key={student.id} student={student} />
              ))}
            </div>

            {/* Desktop View (Table Layout) */}
            <div className="hidden md:block overflow-hidden rounded-lg shadow-sm">
              <div className="overflow-x-auto bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={`w-[30%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Name")}</TableHead>
                      <TableHead className={`w-[20%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Email")}</TableHead>
                      <TableHead className={`w-[20%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Gender")}</TableHead>
                      <TableHead className={`w-[20%] ${locale === "ar" ? "text-right" : "text-left"}`}>{t("Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium" title={student.name}>
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Button size="icon" variant="ghost" onClick={handleDelete} className="  hover:bg-red-500 hover:text-white transition-colors duration-300">
                              <Trash className="h-8 w-8" />
                            </Button>
                            <Button size="icon" variant="ghost" className="  hover:bg-blue-600 hover:text-white transition-colors duration-300">
                              <Pencil className="h-8 w-8" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

          </>}





        </motion.div>
      </div>
    </div>
  );
}