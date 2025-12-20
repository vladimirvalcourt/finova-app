import Link from "next/link";

export default function OfflinePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-8 rounded-full bg-surface p-6 shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                >
                    <path d="M10.75 14.83a5.95 5.95 0 0 0-2.43.34" />
                    <path d="M12 2a9.92 9.92 0 0 0-4.06.87" />
                    <path d="M2 2l20 20" />
                    <path d="M17.48 12.56A10 10 0 0 0 7.9 2.52" />
                    <path d="M8.88 20.37A9.94 9.94 0 0 0 12 22a10 10 0 0 0 10-10 .76.76 0 0 0-.06-.3" />
                </svg>
            </div>
            <h1 className="mb-4 font-serif text-3xl font-bold text-text-primary">
                You're Offline
            </h1>
            <p className="mb-8 max-w-md text-text-secondary">
                It looks like you've lost your internet connection. Finova works best when you're online, but you can still view your cached pages.
            </p>
            <Link
                href="/"
                className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
            >
                Try Again
            </Link>
        </div>
    );
}
