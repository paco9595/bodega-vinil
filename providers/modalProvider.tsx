'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import SpinRecord from '@/components/SpinRecord';
import useCollection from '@/hooks/useGetCollection';

interface ModalContextType {
    openSpinRecord: () => void;
    isSpinning: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const { collection } = useCollection({ sort: 'title' });
    const [spinTrigger, setSpinTrigger] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const openSpinRecord = () => {
        setSpinTrigger(prev => prev + 1);
    };

    return (
        <ModalContext.Provider value={{ openSpinRecord, isSpinning }}>
            {children}
            {/* The SpinRecord modal is rendered here, accessible from anywhere */}
            <SpinRecord vinyls={collection} trigger={spinTrigger} onSpinStateChange={setIsSpinning} />
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
