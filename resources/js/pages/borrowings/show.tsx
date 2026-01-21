import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import borrowingsRoutes from '@/routes/borrowings';
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

interface Borrowing {
    id: number;
    member_id: number;
    borrow_date: string;
    return_date: string | null;
    status: 'borrowed' | 'returned';
    member: {
        id: number;
        name: string;
        member_code: string;
        email: string;
        phone: string | null;
    };
    borrowing_details: BorrowingDetail[];
    created_at: string;
    updated_at: string;
}

interface BorrowingShowProps {
    borrowing: Borrowing;
    success?: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowings', href: index().url },
    { title: 'Borrowing Details' },
];

export default function BorrowingShow({
    borrowing,
    success,
    error,
}: BorrowingShowProps) {
    const [returnDate, setReturnDate] = useState<string>(
        new Date().toISOString().split('T')[0],
    );
    const [showReturnDialog, setShowReturnDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Borrowing #${borrowing.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index().url}>
                                <ArrowLeftIcon />
                                Back
                            </Link>
                        </Button>
                        <Heading
                            title={`Borrowing #${borrowing.id}`}
                            description="Borrowing transaction details"
                        />
                    </div>
                    {borrowing.status === 'borrowed' && (
                        <Dialog
                            open={showReturnDialog}
                            onOpenChange={setShowReturnDialog}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <RotateCcwIcon />
                                    Return Books
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Return Books</DialogTitle>
                                <DialogDescription>
                                    Confirm the return date for this borrowing.
                                    Book stock will be restored automatically.
                                </DialogDescription>
                                <Form
                                    action={borrowingsRoutes.return({
                                        borrowing: borrowing.id,
                                    }).url}
                                    method="post"
                                    onSuccess={() =>
                                        setShowReturnDialog(false)
                                    }
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2 py-4">
                                                <Label htmlFor="return_date">
                                                    Return Date{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="return_date"
                                                    name="return_date"
                                                    type="date"
                                                    value={returnDate}
                                                    onChange={(e) =>
                                                        setReturnDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    min={borrowing.borrow_date}
                                                    required
                                                />
                                                <InputError
                                                    message={errors.return_date}
                                                />
                                            </div>
                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="secondary">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    Confirm Return
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Member Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Name
                                </Label>
                                <p className="text-base font-medium">
                                    {borrowing.member.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Member Code
                                </Label>
                                <p className="text-base">
                                    {borrowing.member.member_code}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Email
                                </Label>
                                <p className="text-base">
                                    {borrowing.member.email}
                                </p>
                            </div>
                            {borrowing.member.phone && (
                                <div>
                                    <Label className="text-sm text-muted-foreground">
                                        Phone
                                    </Label>
                                    <p className="text-base">
                                        {borrowing.member.phone}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Borrowing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Status
                                </Label>
                                <div className="mt-1">
                                    <Badge
                                        variant={
                                            borrowing.status === 'borrowed'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {borrowing.status.charAt(0).toUpperCase() +
                                            borrowing.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Borrow Date
                                </Label>
                                <p className="text-base">
                                    {new Date(
                                        borrowing.borrow_date,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Return Date
                                </Label>
                                <p className="text-base">
                                    {borrowing.return_date
                                        ? new Date(
                                              borrowing.return_date,
                                          ).toLocaleDateString()
                                        : 'Not returned yet'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Created At
                                </Label>
                                <p className="text-base">
                                    {new Date(
                                        borrowing.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Borrowed Books</CardTitle>
                        <CardDescription>
                            {borrowing.borrowing_details.length} book(s) in
                            this borrowing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {borrowing.borrowing_details.map((detail) => (
                                <div
                                    key={detail.id}
                                    className="flex items-start justify-between rounded-lg border p-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {detail.book.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            by {detail.book.author}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Category: {detail.book.category.name}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        Quantity: {detail.quantity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
