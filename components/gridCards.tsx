'use client'

import Link from "next/link";
import { motion } from "framer-motion";

export default function GridCards({ vinyls }: { vinyls: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vinyls.map((vinyl, index) => (
                <motion.div
                    key={vinyl.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link href={`/collection/album/${vinyl.id}`} className="rounded-lg p-4 flex flex-col items-center md:items-start group" >
                        <div className="relative overflow-hidden rounded-3xl mb-3">
                            <img
                                src={vinyl.cover_image}
                                alt={vinyl.title}
                                className="h-64 object-cover rounded-3xl transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h2 className="text-lg font-bold">{vinyl.title}</h2>
                        <p className="text-sm text-muted-foreground">{vinyl.artist}</p>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}