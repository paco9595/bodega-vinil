'use client'

import React, { useMemo } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { Vinyl } from '@/lib/types/tables'
import { DiscogsRelease } from '@/lib/types/DiscogsRelease'
import { Disc, DollarSign, Music, Users } from 'lucide-react'

interface CollectionStatsProps {
    vinyls: Vinyl[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1']

export default function CollectionStats({ vinyls }: CollectionStatsProps) {
    const stats = useMemo(() => {
        const owned = vinyls.filter(v => v.owned)

        // Value metrics (using lowest_price in USD from discogs data if available)
        let totalVal = 0
        let minVal = 0
        let maxVal = 0
        let valCount = 0

        const genreCounts: Record<string, number> = {}
        const artistCounts: Record<string, number> = {}

        owned.forEach(v => {
            const data = v.release_data as unknown as DiscogsRelease
            if (!data) return

            // Genres
            data.genres?.forEach(g => {
                genreCounts[g] = (genreCounts[g] || 0) + 1
            })

            // Artists
            const artistName = v.artist
            artistCounts[artistName] = (artistCounts[artistName] || 0) + 1

            // Value
            if (data.lowest_price) {
                totalVal += data.lowest_price
                valCount++
                if (minVal === 0 || data.lowest_price < minVal) minVal = data.lowest_price
                if (data.lowest_price > maxVal) maxVal = data.lowest_price
            }
        })

        const genreData = Object.entries(genreCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8) // Top 8 genres

        const artistData = Object.entries(artistCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // Top 10 artists

        const avgVal = valCount > 0 ? totalVal / valCount : 0

        return {
            totalItems: owned.length,
            totalValue: totalVal,
            avgValue: avgVal,
            maxValue: maxVal,
            genreData,
            artistData
        }
    }, [vinyls])

    if (stats.totalItems === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                <Music className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-bold mb-2">No stats available</h3>
                <p className="text-muted-foreground">Add items to your collection to see insights.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-lg">
                            <Disc className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Albums</p>
                            <h3 className="text-2xl font-bold">{stats.totalItems}</h3>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Est. Total Value</p>
                            <h3 className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Value</p>
                            <h3 className="text-2xl font-bold">${stats.avgValue.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <Users className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Top Artist</p>
                            <h3 className="text-xl font-bold truncate max-w-[150px]" title={stats.artistData[0]?.name}>
                                {stats.artistData[0]?.name || '-'}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Genre Distribution */}
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-6">Genre Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.genreData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {stats.genreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Artists Configuration */}
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-6">Top Artists</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.artistData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={100}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                    {stats.artistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
