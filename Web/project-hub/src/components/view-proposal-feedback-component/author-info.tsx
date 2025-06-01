import { User } from "lucide-react"

interface AuthorInfoProps {
  name: string
  department: string
  avatar?: string
}

export function AuthorInfo({ name, department, avatar }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[hsl(var(--feedback-border))] transition-colors duration-200">
      <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
        {avatar ? (
          <img src={avatar || "/placeholder.svg"} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <User className="h-5 w-5 feedback-text-muted" />
        )}
      </div>
      <div>
        <p className="font-semibold feedback-text">{name}</p>
        <p className="text-sm feedback-text-muted">{department}</p>
      </div>
    </div>
  )
}
