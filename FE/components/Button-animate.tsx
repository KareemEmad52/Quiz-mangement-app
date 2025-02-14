"use client"

import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ButtonAnimateProps {
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loadingText?: string;
  icon?: React.ReactNode;
  animateScale?: number
}

const ButtonAnimate = ({ 
  loading = false,
  disabled = false,
  children,
  className,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loadingText,
  icon,
  animateScale
}: ButtonAnimateProps) => {

  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-500 text-white",
    secondary: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  }


  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg"
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading && !disabled && onClick) {
      onClick(e)
    }
  }

  const LoadingSpinner = () => (
    <svg
      className="w-4 h-4 stroke-current animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_9023_61563_1)">
        <path
          d="M14.6437 2.05426C11.9803 1.2966 9.01686 1.64245 6.50315 3.25548C1.85499 6.23817 0.504864 12.4242 3.48756 17.0724C6.47025 21.7205 12.6563 23.0706 17.3044 20.088C20.4971 18.0393 22.1338 14.4793 21.8792 10.9444"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_9023_61563_1">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  return (
    <motion.button
      type={type}
      className={clsx(
        "flex justify-center items-center rounded-md shadow-sm font-medium",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none ",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      whileTap={{ scale: animateScale || 0.95 }}
      disabled={loading || disabled}
      onClick={handleClick}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {loading ? (
        <>
        <div className='flex justify-center items-center gap-2'>
          <LoadingSpinner />
          <span className="ml-2">
            {loadingText || children}
          </span>
          </div>
        </>
      ) : (
        <>
          {icon && <span className="ml-2">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  )
}

export default ButtonAnimate