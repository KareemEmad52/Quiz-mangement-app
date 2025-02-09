'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ currentLocale  , withGlobe }: { currentLocale: string ,withGlobe?:boolean }) {
  const router = useRouter();
  const pathName = usePathname();
  const locales = ["en", "ar"];
  const isRTL = currentLocale === "ar";

  const changeLanguage = (locale: string) => {
    if (locale !== currentLocale) {
      const newPath = pathName.replace(`/${currentLocale}`, `/${locale}`);
      router.push(newPath);
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center gap-3 px-5
          ${isRTL ? 'left-6' : 'right-6'}
        `}
      >
        

        <div className="flex gap-2 items-center">
          {/* {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => changeLanguage(locale)}
              disabled={locale === currentLocale}
              className={`
                px-2 py-1 rounded-lg text-xs font-medium
                transition-all duration-200 ease-out
                ${locale === currentLocale
                  ? 'bg-blue-500 text-white ring-2 ring-blue-500/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                }
                disabled:cursor-not-allowed
              `}
            >
              {locale === 'en' ? 'English' : 'العربية'}
            </button>
          ))} */}

          <button
            onClick={() => changeLanguage("en")}
            disabled={"en" === currentLocale}
            className={`
                px-2 py-1 rounded-lg text-xs font-medium
                transition-all duration-200 ease-out
                ${"en" === currentLocale
                ? 'bg-blue-500 text-white ring-2 ring-blue-500/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }
                disabled:cursor-not-allowed
              `}
          >
            english
          </button>
          <div className="h-4 w-px bg-gray-200" /> {/* Divider */}
          <button
            onClick={() => changeLanguage("ar")}
            disabled={"ar" === currentLocale}
            className={`
                px-2 py-1 rounded-lg text-xs font-medium
                transition-all duration-200 ease-out
                ${"ar" === currentLocale
                ? 'bg-blue-500 text-white ring-2 ring-blue-500/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }
                disabled:cursor-not-allowed
              `}
          >
            العربية
          </button>
          {withGlobe && <Globe className="h-4 w-4 text-blue-500"  />}
          
        </div>
      </div>
    </div>
  );
}