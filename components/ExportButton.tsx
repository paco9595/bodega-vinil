'use client'
import { useState, useEffect, useRef } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { Vinyl } from '@/lib/types/tables';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportButtonProps {
    collection: Vinyl[];
    className?: string;
}

export default function ExportButton({ collection, className = '' }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const exportJSON = () => {
        const dataStr = JSON.stringify(collection, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'my_collection.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        setIsOpen(false);
    };

    const exportCSV = () => {
        const headers = ['Title', 'Artist', 'Year', 'Format', 'Discogs ID', 'Added At'];
        const csvContent = [
            headers.join(','),
            ...collection.map(v => {
                const title = v.title ? v.title.replace(/"/g, '""') : '';
                const artist = v.artist ? v.artist.replace(/"/g, '""') : '';
                const year = v.year || '';
                const format = v.format || '';
                const discogsId = v.discogs_id || '';
                const createdAt = v.created_at ? new Date(v.created_at).toLocaleDateString() : '';
                return `"${title}","${artist}","${year}","${format}","${discogsId}","${createdAt}"`;
            })
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', 'my_collection.csv');
        linkElement.click();
        setIsOpen(false);
    };

    if (!collection || collection.length === 0) return null;

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:bg-zinc-800 transition-colors"
                title="Export Collection"
            >
                <Download className="w-5 h-5" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-50 p-1"
                    >
                        <button
                            onClick={exportCSV}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4 text-emerald-500" />
                            Export as CSV
                        </button>
                        <button
                            onClick={exportJSON}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <FileJson className="w-4 h-4 text-amber-500" />
                            Export as JSON
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
