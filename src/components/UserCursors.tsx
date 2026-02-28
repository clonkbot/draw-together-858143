import { User } from './types';

interface UserCursorsProps {
  users: User[];
}

export function UserCursors({ users }: UserCursorsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {users.map((user) => (
        <div
          key={user.id}
          className="absolute transition-all duration-100 ease-out"
          style={{
            left: user.x,
            top: user.y,
            transform: 'translate(-2px, -2px)',
          }}
        >
          {/* Cursor */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-lg"
          >
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
              fill={user.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          {/* Name tag */}
          <div
            className="absolute left-5 top-4 px-2 py-0.5 rounded-full text-white text-xs font-body font-semibold whitespace-nowrap shadow-md"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
          {/* Drawing indicator */}
          <div
            className="absolute -left-1 -top-1 w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: user.color }}
          />
        </div>
      ))}
    </div>
  );
}
