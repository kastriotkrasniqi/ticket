export interface SearchResult {
    current_page: number;
    data: Record
    first_page_url: string;
    from: number;
    last_page: number;
    last_pagePurl: string;
    links: Link[]
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}

export interface Link {
    active: boolean;
    label: string;
    url: string;
}

export interface Record {
    hits: Event[]
    hitsPerPage: number;
    page: number;
    processingTimeMs: number;
    query: string;
    totalHits: number;
    totalPages: number;
}
