// file: app/server-error/page.tsx

'use client';

interface ServerErrorProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ServerError({ searchParams }: ServerErrorProps) {
  const errorMessage = searchParams.message || 'An unknown error occurred';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">500 - Server Error</h1>
      <p className="mb-4 text-xl">Oops! Something went wrong on our end.</p>
      <p className="mb-6 text-lg text-red-600">{errorMessage}</p>
      <button
        onClick={() => (window.location.href = '/')}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Go back to homepage
      </button>
    </div>
  );
}
