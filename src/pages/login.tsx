export default function Login() {
    return (
        <div className="bg-[var(--card-bg-color)] min-h-screen flex items-center justify-center font-display antialiased">
            <div className="relative z-10 w-full max-w-[480px] px-6">
                <div className="login-card rounded-2xl p-8 md:p-14 flex flex-col items-center">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl">
                            <span className="material-symbols-outlined text-white text-5xl" style={{ color: "var(--text-title-color)" }}>album</span>
                        </div>
                        <h1 className="text-white tracking-tight text-4xl font-bold leading-tight text-center">
                            VinylVault
                        </h1>
                        <h2 className="text-white/50 text-lg font-medium leading-tight tracking-tight text-center mt-2">
                            Your collection, digitized.
                        </h2>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <button className="flex items-center justify-center gap-3 w-full h-14 bg-spotify hover:bg-[#1ed760] text-white rounded-full font-bold text-base transition-all duration-200 transform hover:scale-[1.01] shadow-lg shadow-spotify/10">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.307c-.218.358-.682.474-1.04.256-2.872-1.755-6.486-2.152-10.743-1.176-.41.094-.817-.16-.91-.57-.094-.41.16-.816.57-.91 4.654-1.065 8.647-.618 11.867 1.348.358.218.474.682.256 1.052zm1.468-3.264c-.274.446-.856.59-1.302.315-3.287-2.02-8.303-2.603-12.185-1.424-.505.153-1.04-.136-1.194-.64-.153-.505.136-1.04.64-1.194 4.437-1.347 10.007-.696 13.726 1.594.446.274.59.856.315 1.302v-.053zm.126-3.41c-3.94-2.338-10.437-2.555-14.226-1.403-.604.183-1.246-.168-1.428-.772-.183-.604.168-1.246.772-1.428 4.343-1.318 11.516-1.06 16.03 1.62.544.322.723 1.025.401 1.57-.322.544-1.025.723-1.57.401l.02-.018z"></path>
                            </svg>
                            <span className="truncate">Continue with Spotify</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 w-full h-14 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-bold text-base transition-all duration-200 transform hover:scale-[1.01] shadow-lg">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span className="truncate">Continue with Google</span>
                        </button>
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/5 w-full text-center">
                        <p className="text-white/40 text-xs leading-relaxed max-w-[280px] mx-auto">
                            By signing in, you agree to our
                            <a className="text-white/70 hover:text-white hover:underline font-semibold px-1" href="#">Terms of Service</a>
                            and
                            <a className="text-white/70 hover:text-white hover:underline font-semibold pl-1" href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center gap-8">
                    <a className="text-white/30 hover:text-white/80 transition-colors text-xs uppercase tracking-widest font-bold" href="#">Need help?</a>
                    <a className="text-white/30 hover:text-white/80 transition-colors text-xs uppercase tracking-widest font-bold" href="#">About</a>
                </div>
            </div>

        </div>

    )
}