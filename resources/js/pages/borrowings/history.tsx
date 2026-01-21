import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index, show } from '@/routes/borrowings';
import { type BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    title: string;
    author: string;
    category: {
        id: number;
        name: string;
    };
}

interface BorrowingDetail {
    id: number;
    book_id: number;
    quantity: number;
    book: Book;
}

interface BorrowingRow {
    id: number;
    borrow_date: string;
    return_date: string | null;
    status: 'borrowed' | 'returned';
    borrowing_details: BorrowingDetail[];
    created_at: string;
}

interface Member {
    id: number;
    name: string;
    member_code: string;
    email: string;
}

interface BorrowingHistoryProps {
    member: Member;
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
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowings', href: index().url },
    { title: 'Borrowing History' },
];

export default function BorrowingHistory({
    member,
    borrowings,
}: BorrowingHistoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Borrowing History - ${member.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeftIcon />
                            Back
                        </Link>
                    </Button>
                    <Heading
                        title={`Borrowing History`}
                        description={`${member.name} (${member.member_code})`}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Member Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>
                                <p className="font-medium">{member.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Member Code
                                </p>
                                <p className="font-medium">
                                    {member.member_code}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="font-medium">{member.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Borrowings
                                </p>
                                <p className="font-medium">
                                    {borrowings.total}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Borrowing History</CardTitle>
                        <CardDescription>
                            All borrowing transactions for this member
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {borrowings.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No borrowing history found.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Borrow Date
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Return Date
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Books
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
                                                <td className="px-4 py-3 align-top">
                                                    <Badge
                                                        variant={
                                                            borrowing.status ===
                                                            'borrowed'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {borrowing.status.charAt(0).toUpperCase() +
                                                            borrowing.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex items-center justify-end">
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
                                                                View Details
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
