import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index, store } from '@/routes/borrowings';
import { type BreadcrumbItem } from '@/types';

interface MemberOption {
    id: number;
    name: string;
    member_code: string;
    email: string;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface BookOption {
    id: number;
    title: string;
    author: string;
    stock: number;
    category_id: number;
    category: CategoryOption;
}

interface BookSelection {
    book_id: string;
    quantity: string;
}

interface BorrowingCreateProps {
    members: MemberOption[];
    books: BookOption[];
    categories: CategoryOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowings', href: index().url },
    { title: 'New Borrowing', href: store().url },
];

export default function BorrowingCreate({
    members,
    books,
    categories,
}: BorrowingCreateProps) {
    const [memberId, setMemberId] = useState<string>('');
    const [borrowDate, setBorrowDate] = useState<string>(
        new Date().toISOString().split('T')[0],
    );
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [bookSelections, setBookSelections] = useState<BookSelection[]>([
        { book_id: '', quantity: '1' },
    ]);

    const filteredBooks = books.filter((book) => {
        if (selectedCategory === 'all') return true;
        return book.category_id === Number(selectedCategory);
    });

    const addBookSelection = () => {
        setBookSelections([...bookSelections, { book_id: '', quantity: '1' }]);
    };

    const removeBookSelection = (index: number) => {
        setBookSelections(bookSelections.filter((_, i) => i !== index));
    };

    const updateBookSelection = (
        index: number,
        field: 'book_id' | 'quantity',
        value: string,
    ) => {
        const updated = [...bookSelections];
        updated[index] = { ...updated[index], [field]: value };
        setBookSelections(updated);
    };

    const getSelectedBook = (bookId: string) => {
        return books.find((b) => b.id === Number(bookId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Borrowing" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeftIcon />
                            Back
                        </Link>
                    </Button>
                    <Heading
                        title="New Borrowing"
                        description="Create a new book borrowing transaction"
                    />
                </div>

                <Form
                    action={store().url}
                    method="post"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Borrowing Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="member_id">
                                                Member{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <input
                                                type="hidden"
                                                name="member_id"
                                                value={memberId}
                                            />
                                            <Select
                                                value={memberId}
                                                onValueChange={setMemberId}
                                            >
                                                <SelectTrigger id="member_id">
                                                    <SelectValue placeholder="Select a member" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {members.map((member) => (
                                                        <SelectItem
                                                            key={member.id}
                                                            value={String(
                                                                member.id,
                                                            )}
                                                        >
                                                            {member.member_code}{' '}
                                                            - {member.name} (
                                                            {member.email})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.member_id}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="borrow_date">
                                                Borrow Date{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="borrow_date"
                                                name="borrow_date"
                                                type="date"
                                                value={borrowDate}
                                                onChange={(e) =>
                                                    setBorrowDate(e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.borrow_date}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Books</CardTitle>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addBookSelection}
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            Add Book
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Filter by Category</Label>
                                        <Select
                                            value={selectedCategory}
                                            onValueChange={setSelectedCategory}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Categories
                                                </SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(
                                                            category.id,
                                                        )}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {bookSelections.map((selection, index) => {
                                        const selectedBook = getSelectedBook(
                                            selection.book_id,
                                        );
                                        const availableStock =
                                            selectedBook?.stock ?? 0;
                                        const requestedQuantity = Number(
                                            selection.quantity,
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className="grid gap-4 p-4 border rounded-lg"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 grid gap-4 md:grid-cols-2">
                                                        <div className="grid gap-2">
                                                            <Label>
                                                                Book{' '}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <input
                                                                type="hidden"
                                                                name={`books[${index}][book_id]`}
                                                                value={
                                                                    selection.book_id
                                                                }
                                                            />
                                                            <Select
                                                                value={
                                                                    selection.book_id
                                                                }
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    updateBookSelection(
                                                                        index,
                                                                        'book_id',
                                                                        value,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a book" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {filteredBooks
                                                                        .filter(
                                                                            (b) =>
                                                                                b.stock >
                                                                                0,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                book,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        book.id
                                                                                    }
                                                                                    value={String(
                                                                                        book.id,
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        book.title
                                                                                    }{' '}
                                                                                    by{' '}
                                                                                    {
                                                                                        book.author
                                                                                    }{' '}
                                                                                    (Stock:{' '}
                                                                                    {
                                                                                        book.stock
                                                                                    })
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `books.${index}.book_id`
                                                                    ]
                                                                }
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <Label>
                                                                Quantity{' '}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max={availableStock}
                                                                value={
                                                                    selection.quantity
                                                                }
                                                                onChange={(e) =>
                                                                    updateBookSelection(
                                                                        index,
                                                                        'quantity',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                name={`books[${index}][quantity]`}
                                                                required
                                                            />
                                                            {selectedBook && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Available:{' '}
                                                                    {
                                                                        availableStock
                                                                    }{' '}
                                                                    {requestedQuantity >
                                                                    availableStock && (
                                                                        <span className="text-destructive">
                                                                            (Insufficient
                                                                            stock)
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            )}
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `books.${index}.quantity`
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {bookSelections.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeBookSelection(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {errors.books && (
                                        <InputError message={errors.books} />
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    Create Borrowing
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href={index().url}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
