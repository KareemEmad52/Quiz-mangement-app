"use client"; // Mark this as a Client Component

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BreadcrumbsProps {
  locale: string;
}

export function Breadcrumbs({ locale }: BreadcrumbsProps) {

  const t = useTranslations("HomePage");

  const pathname = usePathname();
  const pathSegments = pathname.split('/')


  const generateBreadcrumbItems = () => {

    let segment = pathSegments.pop()
    if(segment?.match(/^\d+$/)){
      segment = pathSegments.pop()
    }
    
    if (segment === "home" || segment?.match(/^\d+$/)) {
      return null;
    }


      
    return (
      <React.Fragment key={segment}>
        <BreadcrumbItem>
          <Breadcrumb>{t(segment)}</Breadcrumb>
        </BreadcrumbItem>
      </React.Fragment>
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Breadcrumb>{t('home')}</Breadcrumb>
        </BreadcrumbItem>
        {pathSegments.length >= 4 && (
          <BreadcrumbSeparator>
            {locale === "en" ? <ChevronRight /> : <ChevronLeft />}
          </BreadcrumbSeparator>
        )}
        {generateBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
}