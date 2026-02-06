export default function HeroIllustration() {
    return (
        <div className="relative w-full h-full overflow-hidden bg-secondary">
            {/* Abstract Gradient Blob */}
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#2dd4bf]/20 rounded-full blur-3xl opacity-60 animate-fade-in mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#bef264]/30 rounded-full blur-3xl opacity-60 animate-fade-in mix-blend-multiply delay-1000"></div>

            {/* Illustration Container */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-center">
                <div className="relative w-full max-w-md aspect-square animate-slide-up">
                    {/* Custom Scalable Vector Graphics */}
                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#bef264" /> {/* Lime */}
                                <stop offset="100%" stopColor="#2dd4bf" /> {/* Teal */}
                            </linearGradient>
                        </defs>

                        {/* Background Glow */}
                        <circle cx="200" cy="200" r="160" fill="white" fillOpacity="0.4" />
                        <circle cx="200" cy="200" r="130" fill="url(#logoGrad)" opacity="0.15" />

                        {/* Composition */}
                        <rect x="120" y="80" width="160" height="220" rx="16" fill="white" className="shadow-lg" />

                        {/* Lines */}
                        <rect x="140" y="110" width="60" height="10" rx="4" fill="#dcfce7" /> {/* Light green */}
                        <rect x="140" y="140" width="120" height="6" rx="3" fill="#f1f5f9" />
                        <rect x="140" y="156" width="120" height="6" rx="3" fill="#f1f5f9" />
                        <rect x="140" y="172" width="120" height="6" rx="3" fill="#f1f5f9" />
                        <rect x="140" y="188" width="80" height="6" rx="3" fill="#f1f5f9" />

                        {/* Big Abstract Curve similar to logo */}
                        <path d="M100 300 Q200 200 300 300" stroke="url(#logoGrad)" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.8" />

                        {/* Pencil Element */}
                        <g transform="translate(260, 260) rotate(-45)">
                            <rect x="0" y="0" width="12" height="60" rx="2" fill="#0d9488" />
                            <path d="M0 60 L6 70 L12 60 Z" fill="#fcd34d" />
                        </g>
                    </svg>
                </div>

                <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground/90">
                    Quản Trị Hệ Thống
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-sm">
                    Công cụ quản lý toàn diện cho ứng dụng NoteVui. Theo dõi, đồng bộ và vận hành hiệu quả.
                </p>
            </div>
        </div>
    );
}
