'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Loader2, Check, X } from "lucide-react"

type ProfileNameEditorProps = {
    initialName: string
}

export default function ProfileNameEditor({ initialName }: ProfileNameEditorProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(initialName)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    const cancelEdit = () => {
        setName(initialName)
        setError("")
        setIsEditing(false)
    }

    const saveName = async () => {
        const trimmed = name.trim()
        if (trimmed.length < 2) {
            setError("El nombre debe tener al menos 2 caracteres.")
            return
        }

        setSaving(true)
        setError("")
        try {
            const res = await fetch("/api/profile/name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: trimmed }),
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "No se pudo actualizar el nombre.")
            }

            setIsEditing(false)
            router.refresh()
        } catch (err) {
            console.error(err)
            setError("No se pudo actualizar el nombre.")
        } finally {
            setSaving(false)
        }
    }

    if (!isEditing) {
        return (
            <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <Pencil className="w-4 h-4" />
                Editar
            </button>
        )
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <div className="flex items-center gap-2 w-full">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    className="h-8 px-2 rounded-md bg-white/5 border border-white/15 text-sm w-full min-w-0"
                    placeholder="Tu nombre"
                />
                <button
                    type="button"
                    onClick={saveName}
                    disabled={saving}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-white/15 hover:bg-white/10 disabled:opacity-60"
                    title="Guardar nombre"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-white/15 hover:bg-white/10 disabled:opacity-60"
                    title="Cancelar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
        </div>
    )
}
