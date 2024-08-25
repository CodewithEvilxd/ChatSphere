const Logo = () => {
    return (
        <div className="flex p-5 justify-start items-center gap-3">
            <svg
                id="chat-logo"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#8338ec", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#e0e0e0", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="url(#grad1)" />
                <path
                    d="M18 24C18 22.3431 19.3431 21 21 21H43C44.6569 21 46 22.3431 46 24V36C46 37.6569 44.6569 39 43 39H29L23 45V39H21C19.3431 39 18 37.6569 18 36V24Z"
                    fill="#8338ec"
                    stroke="#6c1f6c"
                    strokeWidth="2"
                />
                <circle cx="26" cy="28" r="3" fill="#fff" />
                <circle cx="32" cy="28" r="3" fill="#fff" />
                <circle cx="38" cy="28" r="3" fill="#fff" />
            </svg>
            <span className="text-3xl font-semibold text-[#8338ec]">ChatSQL</span>
        </div>
    );
};

export default Logo;
