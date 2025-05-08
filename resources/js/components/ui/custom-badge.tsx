import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "warning" | "error"
  className?: string
  withIcon?: boolean
  children?: React.ReactNode
}

export function StatusBadge({ status, className, withIcon = true, children }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      bg: "bg-gradient-to-r from-emerald-500 to-green-500",
      text: "text-white",
      icon: CheckCircle,
      shadow: "shadow-sm shadow-emerald-500/20",
    },
    inactive: {
      bg: "bg-gradient-to-r from-slate-500 to-slate-600",
      text: "text-white",
      icon: CheckCircle,
      shadow: "shadow-sm shadow-slate-500/20",
    },
    pending: {
      bg: "bg-gradient-to-r from-amber-400 to-yellow-500",
      text: "text-white",
      icon: CheckCircle,
      shadow: "shadow-sm shadow-amber-500/20",
    },
    warning: {
      bg: "bg-gradient-to-r from-orange-400 to-orange-500",
      text: "text-white",
      icon: CheckCircle,
      shadow: "shadow-sm shadow-orange-500/20",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-rose-500",
      text: "text-white",
      icon: CheckCircle,
      shadow: "shadow-sm shadow-red-500/20",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all",
        config.bg,
        config.text,
        config.shadow,
        "border border-white/10",
        className,
      )}
    >
      {withIcon && <Icon className="h-3 w-3" />}
      <span>{children || status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </span>
  )
}
