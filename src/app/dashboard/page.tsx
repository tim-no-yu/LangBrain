import CreateAvatarForm from "@/components/CreateAvatarForm";
import LogoutButton from "@/components/LogoutButton";

const mockUser = { username: "timyu" };

const conversations = [
  {
    id: "1",
    name: "Sofia",
    lastMessage: "¿Cómo estuvo tu día?",
    timeAgo: "20m ago",
  },
  {
    id: "2",
    name: "Carlos",
    lastMessage: "Muy bien, gracias. ¿Y tú?",
    timeAgo: "1h ago",
  },
  {
    id: "3",
    name: "Valentina",
    lastMessage: "¡Hasta luego! Nos vemos mañana.",
    timeAgo: "3h ago",
  },
  {
    id: "4",
    name: "Miguel",
    lastMessage: "¿Quieres practicar ahora?",
    timeAgo: "Yesterday",
  },
];

function AvatarInitials({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <span className="text-sm font-medium text-zinc-800">
          {mockUser.username}
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
      <ul className="divide-y divide-zinc-100">
        {conversations.map((convo) => (
          <li key={convo.id}>
            <a
              href={`/dashboard/conversations/${convo.id}`}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50"
            >
              <AvatarInitials name={convo.name} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900">
                  {convo.name}
                </p>
                <p className="mt-0.5 truncate text-sm text-zinc-500">
                  {convo.lastMessage}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-xs text-zinc-400">{convo.timeAgo}</span>
                {/* Unread dot — always shown for now */}
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
