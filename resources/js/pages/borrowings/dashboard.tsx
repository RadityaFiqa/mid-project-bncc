import { Head, Link } from '@inertiajs/react';
import {
    BookOpenIcon,
    CalendarIcon,
    LibraryIcon,
    UsersIcon,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

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
import { index } from '@/routes/borrowings';
import { type BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    title: string;
    author: string;
}

interface BorrowingDetail {
    id: number;
    book: Book;
}

interface Borrowing {
    id: number;
    borrow_date: string;
    member: {
        id: number;
        name: string;
        member_code: string;
    };
    borrowing_details: BorrowingDetail[];
}

interface TopBorrowedBook {
    id: number;
    title: string;
    author: string;
    total_borrowed: number;
}

interface MonthlyBorrowing {
    month: string;
    borrowings: number;
}

interface StatusDistribution {
    name: string;
    value: number;
    color: string;
}

interface BooksByCategory {
    name: string;
    value: number;
}

interface BorrowingDashboardProps {
    stats: {
        total_borrowings: number;
        active_borrowings: number;
        returned_borrowings: number;
        total_books_borrowed: number;
        total_members: number;
        active_members: number;
        total_books: number;
        available_books: number;
    };
    recentBorrowings: Borrowing[];
    topBorrowedBooks: TopBorrowedBook[];
    monthlyBorrowings: MonthlyBorrowing[];
    statusDistribution: StatusDistribution[];
    booksByCategory: BooksByCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowings', href: index().url },
    { title: 'Dashboard' },
];

export default function BorrowingDashboard({
    stats,
    recentBorrowings,
    topBorrowedBooks,
    monthlyBorrowings,
    statusDistribution,
    booksByCategory,
}: BorrowingDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowing Dashboard" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Borrowing Dashboard"
                        description="Statistics and overview of borrowing activities"
                    />
                    <Button variant="outline" asChild>
                        <Link href={index().url}>View All Borrowings</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Borrowings
                            </CardTitle>
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_borrowings}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time transactions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Borrowings
                            </CardTitle>
                            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active_borrowings}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Currently borrowed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Members
                            </CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active_members}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Out of {stats.total_members} total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Books Borrowed
                            </CardTitle>
                            <LibraryIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_books_borrowed}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Currently out
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Borrowings</CardTitle>
                            <CardDescription>
                                Latest 5 borrowing transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentBorrowings.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No recent borrowings.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentBorrowings.map((borrowing) => (
                                        <div
                                            key={borrowing.id}
                                            className="flex items-start justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {borrowing.member.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {borrowing.member.member_code}{' '}
                                                    •{' '}
                                                    {new Date(
                                                        borrowing.borrow_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {borrowing.borrowing_details.length}{' '}
                                                    book(s)
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/borrowings/${borrowing.id}`}
                                                >
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Borrowed Books</CardTitle>
                            <CardDescription>
                                Most frequently borrowed books
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topBorrowedBooks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No data available.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {topBorrowedBooks.map((book, index) => (
                                        <div
                                            key={book.id}
                                            className="flex items-start justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary">
                                                        #{index + 1}
                                                    </Badge>
                                                    <p className="text-sm font-medium">
                                                        {book.title}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    by {book.author}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {book.total_borrowed} times
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Borrowings</CardTitle>
                            <CardDescription>
                                Borrowings trend for the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyBorrowings}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="borrowings"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        name="Borrowings"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status Distribution</CardTitle>
                            <CardDescription>
                                Borrowed vs Returned borrowings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusDistribution.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {booksByCategory.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Books Borrowed by Category</CardTitle>
                            <CardDescription>
                                Top 5 categories by total books borrowed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={booksByCategory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        fill="hsl(var(--primary))"
                                        name="Books Borrowed"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Summary Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Returned Borrowings
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.returned_borrowings}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Books
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.total_books}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Available Books
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.available_books}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Members
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.total_members}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
