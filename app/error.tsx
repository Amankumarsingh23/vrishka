"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center">
      <p className="font-serif text-h2 text-ink">Something wilted</p>
      <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-body">
        {error.message || "We couldn't load this page. Check your connection and try again."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-paper transition-colors hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
