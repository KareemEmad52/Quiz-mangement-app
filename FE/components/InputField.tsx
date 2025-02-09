import React, { useState } from 'react'
import { Input } from './ui/input'
import { Eye, EyeOff, User } from 'lucide-react'
import { Control, Field, FieldError } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { useParams } from 'next/navigation';

interface InputFieldProps {
  placeholder: string;
  name: string;
  label: string;
  icon?: React.ReactNode;
  type?: string;
  control: Control<any>;
  error: FieldError | undefined;
  value?: string;
}


const InputField = ({ control, name, label, icon, type, placeholder, error }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const params = useParams()
  const isRTL = params.locale === 'ar'
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "password" ?
              <div className="relative">
                {/* Icon Position  */}
                <div className={`absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`}>
                  {icon ? icon : <User className="h-4 w-4" />}
                </div>
                <Input
                  {...field}
                  value={field.value}
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  className={`w-full 
                    ${isRTL ? 'pl-10 pr-8' : 'pr-10 pl-8'} 
                    bg-white
                    ${error ? "focus-visible:ring-red-500" : "focus-visible:ring-blue-600"}`}
                />
                {/*  */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 py-2 hover:bg-transparent`}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div> : <div className="relative bg-white">
                <div className={`absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`}>
                  {icon ? icon : <User className="h-4 w-4" />}
                </div>
                <Input
                  {...field}
                  type={type || "text"}
                  placeholder={placeholder}
                  className={`w-full ${isRTL ? 'pl-10 pr-8' : 'pr-10 pl-8'}  bg-white ${error ? "focus-visible:ring-red-500" : "focus-visible:ring-blue-500"}`} />
              </div>}

          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputField