"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            richColors={true}
            icons={{
                success: (
                    <CircleCheckIcon className="size-6 pr-2" />
                ),
                info: (
                    <InfoIcon className="size-6 pr-2" />
                ),
                warning: (
                    <TriangleAlertIcon className="size-6 pr-2" />
                ),
                error: (
                    <OctagonXIcon className="size-6 pr-2" />
                ),
                loading: (
                    <Loader2Icon className="size-6 animate-spin pr-2" />
                ),
            }}
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    "--border-radius": "var(--radius)",
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: "cn-toast",
                    success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
                    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800",
                    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800",
                    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
