"use client"

import { useState } from "react"
import { Head } from "@inertiajs/react"
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  Download,
  MapPinIcon,
  QrCodeIcon,
  SearchIcon,
  TicketIcon,
} from "lucide-react"
import { format } from "date-fns"

import AppLayout from "@/layouts/client/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/custom-badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link,router } from "@inertiajs/react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Ticket } from "@/types"


interface MyTicketsProps {
  tickets: {
    data: Ticket[]
    meta: {
      current_page: number
      last_page: number
      total: number
      per_page: number
    }
  }
}

export default function MyTickets({ tickets }: MyTicketsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [sortBy, setSortBy] = useState("date-asc")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  // Filter tickets based on search query with null checks
  const filteredTickets = tickets.data.filter((ticket) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    const eventName = ticket.event?.name?.toLowerCase() || ""
    const eventLocation = ticket.event?.location?.toLowerCase() || ""

    return eventName.includes(query) || eventLocation.includes(query)
  })

  // Filter tickets based on selected tab
  const getFilteredTickets = () => {
    const now = new Date()

    return filteredTickets.filter((ticket) => {
      // Skip tickets with missing event data
      if (!ticket.event?.date) return false

      const eventDate = new Date(ticket.event.date)

      if (selectedTab === "upcoming") {
        return eventDate > now && ticket.status !== "canceled"
      } else if (selectedTab === "past") {
        return eventDate < now || ticket.status === "used"
      } else if (selectedTab === "canceled") {
        return ticket.status === "canceled"
      }

      return true
    })
  }

  // Sort tickets with null checks
  const sortedTickets = [...getFilteredTickets()].sort((a, b) => {
    if (sortBy === "date-asc") {
      const dateA = a.event?.date ? new Date(a.event.date).getTime() : 0
      const dateB = b.event?.date ? new Date(b.event.date).getTime() : 0
      return dateA - dateB
    } else if (sortBy === "date-desc") {
      const dateA = a.event?.date ? new Date(a.event.date).getTime() : 0
      const dateB = b.event?.date ? new Date(b.event.date).getTime() : 0
      return dateB - dateA
    } else if (sortBy === "name-asc") {
      const nameA = a.event?.name || ""
      const nameB = b.event?.name || ""
      return nameA.localeCompare(nameB)
    } else if (sortBy === "name-desc") {
      const nameA = a.event?.name || ""
      const nameB = b.event?.name || ""
      return nameB.localeCompare(nameA)
    } else if (sortBy === "price-asc") {
      return (a.amount || 0) - (b.amount || 0)
    } else if (sortBy === "price-desc") {
      return (b.amount || 0) - (a.amount || 0)
    }
    return 0
  })

  // Format date for display with error handling
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "EEE, MMM d, yyyy • h:mm a")
    } catch (error) {
      return "Date unavailable"
    }
  }

  // Show QR code dialog
  const showQrCode = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setQrDialogOpen(true)
  }



  return (
    <AppLayout>
      <Head title="My Tickets" />

      <div className="p-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">My Tickets</h1>
          <p className="mt-2 text-muted-foreground">Manage all your purchased tickets</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
                <SelectItem value="date-desc">Date (Latest first)</SelectItem>
                <SelectItem value="name-asc">Event Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Event Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">amount (Low to High)</SelectItem>
                <SelectItem value="price-desc">amount (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="upcoming" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="text-xs sm:text-sm">
              Past
            </TabsTrigger>
            <TabsTrigger value="canceled" className="text-xs sm:text-sm">
              Canceled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            <TicketsList tickets={sortedTickets} showQrCode={showQrCode} />
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <TicketsList tickets={sortedTickets} showQrCode={showQrCode} />
          </TabsContent>

          <TabsContent value="canceled" className="mt-0">
            <TicketsList tickets={sortedTickets} showQrCode={showQrCode} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {tickets.meta.last_page > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href={`/my-tickets?page=${Math.max(1, tickets.meta.current_page - 1)}`} />
              </PaginationItem>

              {Array.from({ length: tickets.meta.last_page }).map((_, index) => {
                const page = index + 1

                // Show first page, last page, and pages around current page
                if (
                  page === 1 ||
                  page === tickets.meta.last_page ||
                  (page >= tickets.meta.current_page - 1 && page <= tickets.meta.current_page + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink href={`/my-tickets?page=${page}`} isActive={page === tickets.meta.current_page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                // Show ellipsis for gaps
                if (page === 2 || page === tickets.meta.last_page - 1) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  href={`/my-tickets?page=${Math.min(tickets.meta.last_page, tickets.meta.current_page + 1)}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ticket QR Code</DialogTitle>
              <DialogDescription>Show this QR code at the event entrance for scanning</DialogDescription>
            </DialogHeader>

            {selectedTicket && (
              <div className="flex flex-col items-center justify-center space-y-4 p-4">
                <div className="rounded-lg border bg-white p-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedTicket.id}`}
                    alt="Ticket QR Code"
                    className="h-48 w-48"
                  />
                </div>

                <div className="text-center">
                  <p className="font-mono text-sm">{selectedTicket.id}</p>
                  <p className="mt-1 text-sm font-medium">{selectedTicket.event?.name || "Event"}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTicket.event?.date ? formatEventDate(selectedTicket.event.date) : "Date unavailable"}
                  </p>
                </div>


              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

// Tickets list component
function TicketsList({ tickets, showQrCode }: { tickets: Ticket[]; showQrCode: (ticket: Ticket) => void }) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <TicketIcon className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No tickets found</h3>
        <p className="mt-1 text-sm text-muted-foreground">You don't have any tickets in this category</p>
        <Button asChild className="mt-4">
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          showQrCode={showQrCode}
        />
      ))}
    </div>
  )
}

// Ticket card component
function TicketCard({
  ticket,
  showQrCode,
}: {
  ticket: Ticket;
  showQrCode: (ticket: Ticket) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <StatusBadge status="active" />
      case "used":
        return <StatusBadge status="inactive" />
      case "expired":
        return <StatusBadge status="warning" />
      case "canceled":
        return <StatusBadge status="error" />
      default:
        return <StatusBadge status="pending" />
    }
  }

  // Safe date formatting with error handling
  const safeFormatDate = (dateString: string | undefined, formatString: string) => {
    if (!dateString) return "Date unavailable"
    try {
      return format(new Date(dateString), formatString)
    } catch (error) {
      return "Date unavailable"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr]">
          {/* Event Image (full height on mobile, fixed width on desktop) */}
          <div className="relative aspect-video md:aspect-auto md:h-full">
            <img
              src={ticket.event?.image || "/placeholder.svg?height=200&width=400"}
              alt={ticket.event?.name || "Event"}
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
          </div>

          {/* Ticket Details */}
          <div className="flex flex-col p-4 md:p-6">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <Link
                  href={ticket.event?.id ? `/events/${ticket.event.id}` : "#"}
                  className={`text-lg font-bold md:text-xl ${ticket.event?.id ? "hover:underline" : ""}`}
                >
                  {ticket.event?.name || "Event Name Unavailable"}
                </Link>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>
                    {ticket.event?.date ? safeFormatDate(ticket.event.date, "EEE, MMM d, yyyy") : "Date unavailable"}
                  </span>
                  {ticket.event?.date && (
                    <>
                      <span className="mx-1">•</span>
                      <ClockIcon className="mr-1 h-4 w-4" />
                      <span>{safeFormatDate(ticket.event.date, "h:mm a")}</span>
                    </>
                  )}
                </div>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  <span>{ticket.event?.location || "Location unavailable"}</span>
                </div>
              </div>
              <div>{getStatusBadge(ticket.status)}</div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Ticket Type</p>
                <p className="font-medium">{ticket.id || "Standard"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ticket #</p>
                <p className="font-mono font-medium">{ticket.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Purchase Date</p>
                <p className="font-medium">
                  {ticket.purchased_at ? safeFormatDate(ticket.purchased_at, "MMM d, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">amount Paid</p>
                <p className="font-medium">${(ticket.amount || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => showQrCode(ticket)}
                  disabled={ticket.status === "canceled" || !ticket.id}
                >
                  <QrCodeIcon className="mr-1 h-4 w-4" />
                  View QR Code
                </Button>
                <Button variant="outline" size="sm" className="flex items-center" asChild>
                  <Link href={`/tickets/${ticket.id}`}>
                    View Details
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

                <Button size="sm"
                onClick={() => window.open(`/tickets/${ticket.id}/pdf`, '_blank')}
                variant="outline"
                >
                <Download className="mr-2 h-4 w-4" />
                Save as PDF
                </Button>
                            </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
