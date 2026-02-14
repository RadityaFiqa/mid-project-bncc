import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, History, RotateCcwIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import Heading from '@/components/heading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { create, index, show, history } from '@/routes/borrowings';
import { type BreadcrumbItem } from '@/types';

interface MemberOption {
    id: number;
    name: string;
    member_code: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
}

interface BorrowingDetail {
    id: number;
    book_id: number;
    quantity: number;
    book: Book;
}

interface BorrowingRow {
    id: number;
    member_id: number;
    borrow_date: string;
    return_date: string | null;
    status: 'borrowed' | 'returned';
    member: {
        id: number;
        name: string;
        member_code: string;
    };
    borrowing_details: BorrowingDetail[];
    created_at: string;
}

interface BorrowingsIndexProps {
    borrowings: {
        data: BorrowingRow[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    members: MemberOption[];
    filters: {
        status: string | null;
        member_id: string | number | null;
    };
    success?: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Borrowings',
        href: index().url,
    },
];

export default function BorrowingsIndex({
    borrowings,
    members,
    filters,
    success,
    error,
}: BorrowingsIndexProps) {
    const [status, setStatus] = useState<string>(
        filters.status ?? 'all',
    );
    const [memberId, setMemberId] = useState<string>(
        filters.member_id ? String(filters.member_id) : 'all',
    );

    const queryPayload = useMemo(() => {
        return {
            status: status !== 'all' ? status : undefined,
            member_id: memberId !== 'all' ? memberId : undefined,
        };
    }, [status, memberId]);

    const applyFilters = () => {
        router.get(index().url, queryPayload, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setStatus('all');
        setMemberId('all');
        router.get(index().url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowings" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Borrowings"
                        description="Manage book borrowings"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <PlusIcon />
                            New Borrowing
                        </Link>
                    </Button>
                </div>

                {success && (
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-medium mb-2 block">
                                    Status
                                </label>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="borrowed">
                                            Borrowed
                                        </SelectItem>
                                        <SelectItem value="returned">
                                            Returned
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-medium mb-2 block">
                                    Member
                                </label>
                                <Select
                                    value={memberId}
                                    onValueChange={setMemberId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Members" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Members
                                        </SelectItem>
                                        {members.map((member) => (
                                            <SelectItem
                                                key={member.id}
                                                value={String(member.id)}
                                            >
                                                {member.member_code} -{' '}
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={applyFilters}>
                                    Apply Filters
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        {borrowings.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No borrowings found.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Member
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Books
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Borrow Date
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Return Date
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 font-medium text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowings.data.map((borrowing) => (
                                            <tr
                                                key={borrowing.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-3 align-top">
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                borrowing.member
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                borrowing.member
                                                                    .member_code
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="space-y-1">
                                                        {borrowing.borrowing_details.map(
                                                            (detail) => (
                                                                <div
                                                                    key={
                                                                        detail.id
                                                                    }
                                                                    className="text-sm"
                                                                >
                                                                    {
                                                                        detail
                                                                            .book
                                                                            .title
                                                                    }{' '}
                                                                    <span className="text-muted-foreground">
                                                                        (x
                                                                        {
                                                                            detail.quantity
                                                                        })
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-top whitespace-nowrap">
                                                    {new Date(
                                                        borrowing.borrow_date,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 align-top whitespace-nowrap">
                                                    {borrowing.return_date
                                                        ? new Date(
                                                              borrowing.return_date,
                                                          ).toLocaleDateString()
                                                        : '-'}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <Badge
                                                        variant={
                                                            borrowing.status ===
                                                            'borrowed'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {
                                                            borrowing.status.charAt(0).toUpperCase() +
                                                            borrowing.status.slice(1)
                                                        }
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {borrowing.status ===
                                                            'borrowed' && (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={show({
                                                                        borrowing:
                                                                            borrowing.id,
                                                                    }).url}
                                                                >
                                                                    <RotateCcwIcon className="h-4 w-4" />
                                                                    <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                        Return
                                                                        Book
                                                                    </span>
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show({
                                                                    borrowing:
                                                                        borrowing.id,
                                                                }).url}
                                                            >
                                                                <EyeIcon className="h-4 w-4" />
                                                                <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                    View
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={history({
                                                                    member:
                                                                        borrowing.member_id,
                                                                }).url}
                                                            >
                                                                <History className="h-4 w-4" />
                                                                <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                    History
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {borrowings.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {borrowings.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={
                                    link.active ? 'default' : 'outline'
                                }
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url}>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
