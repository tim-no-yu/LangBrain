export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Welcome back
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Ready to practice your Spanish today?
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Lessons</p>
            <p className="mt-1 text-3xl font-semibold text-black dark:text-zinc-50">0</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Day streak</p>
            <p className="mt-1 text-3xl font-semibold text-black dark:text-zinc-50">0</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Words learned</p>
            <p className="mt-1 text-3xl font-semibold text-black dark:text-zinc-50">0</p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Start a lesson
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Chat with your AI tutor and practice real-life Spanish conversations.
          </p>
          <button className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-300">
            Begin practice
          </button>
        </div>

      </div>
    </div>
  );
}
