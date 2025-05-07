import { useEffect, useState, type FormEvent } from "react"
import { Head, useForm } from "@inertiajs/react"
import { CalendarIcon, ImageIcon, Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import AppLayout from "@/layouts/client/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function EventForm({ event }: { event?: any }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: event?.name || "",
    description: event?.description || "",
    location: event?.location || "",
    date: new Date(event?.isoDate) || "",
    price: event?.price || "",
    total_tickets: event?.total_tickets || "",
    image: event?.image || null,
  })

  console.log(event?.image);
  useEffect(() => {
    if (event?.date) {
      const parsed = new Date(event.date)
      setSelectedDate(parsed)
    }

    if (event?.image_url) {
      setImagePreview(event.image_url)
    }else{
      setImagePreview(event?.image)
    }
  }, [event])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setData("image", file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setData("date", date.toISOString())
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const method = event ? put : post
    const url = event ? route("events.update", event.id) : route("events.store")

    method(url, {
      onSuccess: () => {
        if (!event) {
          reset()
          setImagePreview(null)
          setSelectedDate(undefined)
        }
      },
    })
  }

  return (
    <AppLayout>
      <Head title={event ? "Edit Event" : "Create Event"} />

      <div className="py-6 md:py-10 px-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">
            {event ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {event ? "Update your event details" : "Fill in the details to create a new event listing"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Form Content */}
            <div className="space-y-8 md:col-span-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the essential details about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Event Name</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Enter event name"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData("description", e.target.value)}
                      placeholder="Describe your event"
                      rows={5}
                      className={errors.description ? "border-destructive" : ""}
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={data.location}
                      onChange={(e) => setData("location", e.target.value)}
                      placeholder="Event venue and address"
                      className={errors.location ? "border-destructive" : ""}
                    />
                    {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Date */}
              <Card>
                <CardHeader>
                  <CardTitle>Date</CardTitle>
                  <CardDescription>When will your event take place?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                            errors.date && "border-destructive",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Tickets and Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Tickets and Pricing</CardTitle>
                  <CardDescription>Set up your ticket availability and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Ticket Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        placeholder="0.00"
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total_tickets">Total Tickets Available</Label>
                      <Input
                        id="total_tickets"
                        type="number"
                        min="1"
                        value={data.total_tickets}
                        onChange={(e) => setData("total_tickets", e.target.value)}
                        placeholder="100"
                        className={errors.total_tickets ? "border-destructive" : ""}
                      />
                      {errors.total_tickets && <p className="text-xs text-destructive">{errors.total_tickets}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Image</CardTitle>
                  <CardDescription>Upload an image for your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={cn(
                        "relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted",
                        errors.image && "border-destructive",
                      )}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                          <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                          <p className="text-xs text-muted-foreground">Recommended size: 1200 x 675 pixels</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                    {errors.image && <p className="mt-2 text-xs text-destructive">{errors.image}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        {event ? "Updating Event..." : "Creating Event..."}
                      </>
                    ) : (
                      event ? "Update Event" : "Create Event"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
