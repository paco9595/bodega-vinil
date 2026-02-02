import Link from "next/link";

export default function GridCards({ vinyls }: { vinyls: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vinyls.map((vinyl) => (
                <Link key={vinyl.id} href={`/collection/album/${vinyl.id}`} className="rounded-lg p-4 flex flex-col items-center md:items-start" >
                    <img src={vinyl.cover_image} alt={vinyl.title} className="h-64 object-cover rounded-3xl" />
                    <h2 className="text-lg font-bold">{vinyl.title}</h2>
                    <p className="text-sm text-muted-foreground">{vinyl.artist}</p>
                </Link>
            ))}
        </div>
    )
}