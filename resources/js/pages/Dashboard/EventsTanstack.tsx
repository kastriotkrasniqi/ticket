import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Event } from '@/types';

type PaginatedEvents = {
    data: Event[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
};

type Props = {
    events: PaginatedEvents;
};

const columnHelper = createColumnHelper<Event>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('humanDate', {
        header: 'Date',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('location', {
        header: 'Location',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('available_spots', {
        header: 'Available Spots',
        cell: (info) => info.getValue(),
    }),
];

const breadcrumbs = [
    {
        title: 'Events',
        href: '/tanstack',
    },
];

export default function EventsTanstack({ events }: Props) {
    const table = useReactTable({
        data: events.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />
            <div className="space-y-4 p-6">
                <h1 className="text-3xl font-semibold">Events</h1>
                <div className="overflow-x-auto rounded-lg border shadow-sm">
                    <table className="min-w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="border-b px-4 py-3">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="transition hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="border-b px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <Button asChild disabled={!events.links.prev}>
                            <Link href={events.links.prev ?? ''}>{'←'} Prev</Link>
                        </Button>
                        <span className="text-sm">
                            Page {events.meta.current_page} of {events.meta.last_page}
                        </span>
                        <Button asChild disabled={!events.links.next}>
                            <Link href={events.links.next ?? ''}>Next {'→'}</Link>
                        </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {(events.meta.current_page - 1) * events.meta.per_page + 1} to{' '}
                        {Math.min(events.meta.current_page * events.meta.per_page, events.meta.total)} of {events.meta.total} results
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
