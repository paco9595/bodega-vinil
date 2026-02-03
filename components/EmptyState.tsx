import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionLink?: string
    onAction?: () => void
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionLink,
    onAction
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white/5 p-4 rounded-full mb-6">
                <Icon className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8 text-balance">
                {description}
            </p>

            {actionLabel && (actionLink || onAction) && (
                actionLink ? (
                    <Link
                        href={actionLink}
                        className="px-6 py-2.5 bg-primary text-black font-medium rounded-full hover:bg-primary/90 transition-colors"
                    >
                        {actionLabel}
                    </Link>
                ) : (
                    <button
                        onClick={onAction}
                        className="px-6 py-2.5 bg-primary text-black font-medium rounded-full hover:bg-primary/90 transition-colors"
                    >
                        {actionLabel}
                    </button>
                )
            )}
        </div>
    )
}
