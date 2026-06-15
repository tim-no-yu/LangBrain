import CreateAvatarForm from "@/components/CreateAvatarForm";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { getConversations } from "@/lib/queries";

function AvatarInitials({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const conversations = await getConversations();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <span className="text-sm font-medium text-zinc-800">
          {user?.email}
        </span>
        <LogoutButton />
      </div>

      {/* Title */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <h1 className="text-xl font-semibold text-zinc-900">Messages</h1>
        <div className="flex items-center gap-2">
          <CreateAvatarForm />
          <a
            href="/chat"
            className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            + New chat
          </a>
        </div>
      </div>

      {/* Conversation list */}
      {conversations.length === 0 ? (
        <p className="px-6 py-8 text-sm text-zinc-400">
          No conversations yet. Create an avatar to get started!
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {conversations.map((convo) => {
            const displayName = convo.title ?? convo.avatar?.name ?? "Untitled";
            return (
              <li key={convo.id}>
                <a
                  href={`/dashboard/conversations/${convo.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50"
                >
                  <AvatarInitials name={displayName} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      {displayName}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-zinc-500">
                      No messages yet
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs text-zinc-400">
                      {formatTimeAgo(convo.updated_at)}
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
