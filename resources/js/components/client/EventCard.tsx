import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Link } from "@inertiajs/react"
import { type Event } from "@/types"

export function EventCard({ event }: { event: Event }) {

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
        />
        {event.is_canceled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="destructive" className="text-lg px-3 py-1.5">
              Canceled
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <Link href={`/events/${event.id}`} className="hover:underline">
            <h3 className="text-lg font-bold line-clamp-1">{event.name}</h3>
          </Link>
          <Badge variant="outline" className="ml-2 whitespace-nowrap">
            ${event.price.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>{event.humanDate}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPinIcon className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <TicketIcon className="mr-1 h-4 w-4" />
          <span>
            {event.is_canceled ? "Not available" : `${event.remaining_tickets} tickets left`}
          </span>
        </div>
        <Link
          href={`/events/${event.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  )
}
