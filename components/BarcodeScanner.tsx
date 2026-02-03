'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Loader2, ScanBarcode } from 'lucide-react'
import { toast } from 'sonner'
import Webcam from 'react-webcam'

interface BarcodeScannerProps {
    onBarcodeDetected: (barcode: string) => void
}

export default function BarcodeScanner({ onBarcodeDetected }: BarcodeScannerProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const webcamRef = useRef<Webcam>(null)
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const startScanning = () => {
        setIsScanning(true)
        setIsLoading(true)
    }

    const stopScanning = () => {
        setIsScanning(false)
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current)
            scanIntervalRef.current = null
        }
    }

    const handleWebcamReady = useCallback(() => {
        setIsLoading(false)

        // Start barcode detection
        if ('BarcodeDetector' in window) {
            const barcodeDetector = new (window as any).BarcodeDetector({
                formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
            })

            scanIntervalRef.current = setInterval(async () => {
                if (webcamRef.current && webcamRef.current.video) {
                    try {
                        const video = webcamRef.current.video
                        if (video.readyState === video.HAVE_ENOUGH_DATA) {
                            const barcodes = await barcodeDetector.detect(video)
                            if (barcodes.length > 0) {
                                const barcode = barcodes[0].rawValue
                                console.log('Barcode detected:', barcode)
                                onBarcodeDetected(barcode)
                                stopScanning()
                                toast.success('Barcode detected!', {
                                    description: `Code: ${barcode}`
                                })
                            }
                        }
                    } catch (error) {
                        console.error('Barcode detection error:', error)
                    }
                }
            }, 100) // Check every 100ms
        } else {
            toast.info('Barcode scanning not supported', {
                description: 'Your browser does not support barcode detection. Please use Chrome or Edge.'
            })
            stopScanning()
        }
    }, [onBarcodeDetected])

    const handleWebcamError = (error: string | DOMException) => {
        console.error('Webcam error:', error)
        toast.error('Camera access denied', {
            description: 'Please allow camera access to scan barcodes.'
        })
        setIsLoading(false)
        setIsScanning(false)
    }

    return (
        <div>
            {!isScanning ? (
                <button
                    onClick={startScanning}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ScanBarcode className="w-5 h-5" />
                    )}
                    Scan Barcode
                </button>
            ) : (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-2xl w-full">
                        <button
                            onClick={stopScanning}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative rounded-xl overflow-hidden">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                    facingMode: 'environment' // Use back camera on mobile
                                }}

                                onUserMedia={handleWebcamReady}
                                onUserMediaError={handleWebcamError}
                                className="w-full h-auto rounded-xl"
                            />

                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                </div>
                            )}

                            {/* Scanning overlay */}
                            {!isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-64 border-4 border-primary rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>

                                        {/* Scanning line animation */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div className="h-1 bg-primary animate-scan-line"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-center mt-4 text-muted-foreground">
                            Position the barcode within the frame
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
