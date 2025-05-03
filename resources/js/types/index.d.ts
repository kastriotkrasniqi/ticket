import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}



  export interface Event {
    id: string
    name: string
    description: string
    location: string
    date: string
    humanDate: string
    price: number
    total_tickets: number
    is_sold_out: boolean
    user_id: string
    image: string
    is_canceled: boolean
    available_spots: number
    available: boolean
    active_offers: number
    purchased_count: number
    is_past_event: boolean
    is_owner: boolean
    user_ticket: Ticket | null
    queue_position: WaitingList | null
  }


  export interface Ticket {
    id: string
    event_id: string
    user_id: string
    status: string
    amount: number
    created_at: string
    updated_at: string
  }


  export interface WaitingList {
    id: string
    event_id: string
    user_id: string
    status: string
    created_at: string
    updated_at: string
    expires_at: number
    position: number
  }
