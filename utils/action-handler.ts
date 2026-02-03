import { toast } from "sonner"

/**
 * Executes an async function (like a Server Action) and handles errors by displaying a toast.
 * @param action The async function to execute.
 * @param errorMessage The message to display if an error occurs.
 * @returns The result of the action, or null if an error occurred.
 */
export async function handleAction<T>(
    action: () => Promise<T>,
    errorMessage: string = "Ha ocurrido un error inesperado."
): Promise<T | null> {
    try {
        return await action()
    } catch (error) {
        console.error("Action failed:", error)
        toast.error(errorMessage, {
            description: error instanceof Error ? error.message : "Inténtalo de nuevo más tarde."
        })
        return null
    }
}
