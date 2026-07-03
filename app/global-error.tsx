"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-paper font-sans">
        <div className="mx-auto max-w-sm px-6 text-center">
          <p className="font-serif text-2xl font-medium text-ink">Something wilted</p>
          <p className="mt-2 text-sm text-body">
            {error.message ||
              "We couldn't reach your garden data. Check your connection and try again."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
