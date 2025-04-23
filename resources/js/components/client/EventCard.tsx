
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Event } from "@/types"

export default function Component({ event }: { event: Event }) {
  return (
    <Card className="w-full max-w-md">
      <img
        src={event.image ?? "/images/default-event.jpg"}
        alt="Event Image"
        className="rounded-t-lg object-cover"
        width="400"
        height="200"
        style={{ aspectRatio: "400/200", objectFit: "cover" }}
      />
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{ event.name }</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>{event.humanDate}</span>
            <LocateIcon className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {event.description}
          <br />
          Remaining Tickets: {event.remaining_tickets} / {event.total_tickets}
        </p>
        <Button className="w-full">Buy Ticket</Button>
      </CardContent>
    </Card>
  )
}

function CalendarDaysIcon(props :React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}


function LocateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  )
}
