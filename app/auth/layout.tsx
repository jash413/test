// File: app/auth/layout.tsx

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Company Info */}
      <div className="hidden flex-col justify-between bg-[hsl(var(--sidebar-bg))] text-foreground lg:flex lg:w-1/2">
        <div className="p-12">
          <svg
            className="h-12 w-auto text-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <div className="mt-20">
            <h1 className="mb-4 text-4xl font-bold ">Welcome to Buildify AI</h1>
            <p className="text-xl">
              Revolutionize your construction projects with AI-powered
              management.
            </p>
          </div>
        </div>
        <div className="p-12">
          <p>&copy; 2023 Buildify AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Auth Content */}
      <div className="flex w-full items-center justify-center bg-background p-12 text-foreground lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
