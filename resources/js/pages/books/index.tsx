import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import Heading from '@/components/heading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { create, index, show, edit as editBook, destroy } from '@/routes/books';
import { type BreadcrumbItem } from '@/types';

interface CategoryOption {
    id: number;
    name: string;
}

interface BookRow {
    id: number;
    title: string;
    author: string;
    isbn: string | null;
    stock: number;
    cover_image: string | null;
    category: { id: number; name: string };
    is_borrowed: boolean;
    created_at: string;
}

interface BooksIndexProps {
    books: {
        data: BookRow[];
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
    categories: CategoryOption[];
    filters: {
        q: string;
        category_id: string | number | null;
    };
    success?: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: index().url,
    },
];

export default function BooksIndex({ books, categories, filters, success, error }: BooksIndexProps) {
    const [q, setQ] = useState(filters.q ?? '');
    const [categoryId, setCategoryId] = useState<string>(
        filters.category_id ? String(filters.category_id) : 'all',
    );

    const queryPayload = useMemo(() => {
        return {
            q: q || undefined,
            category_id: categoryId !== 'all' ? categoryId : undefined,
        };
    }, [q, categoryId]);

    const applyFilters = () => {
        router.get(index().url, queryPayload, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setQ('');
        setCategoryId('all');
        router.get(index().url, {}, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (bookId: number) => {
        router.delete(destroy({ book: bookId }).url, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading title="Books" description="Manage books, filter, and search" />
                    <Button asChild>
                        <Link href={create().url}>
                            <PlusIcon />
                            Add Book
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
                    <CardContent className="py-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div className="grid flex-1 gap-3 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                            placeholder="Search by title or author..."
                                            className="pl-9"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') applyFilters();
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Category
                                    </label>
                                    <Select
                                        value={categoryId}
                                        onValueChange={setCategoryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All categories
                                            </SelectItem>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear
                                </Button>
                                <Button onClick={applyFilters}>Apply</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        {books.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No books found.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Cover
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Title
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Author
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Category
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Stock
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
                                        {books.data.map((book) => (
                                            <tr
                                                key={book.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-3 align-top">
                                                    <div className="h-14 w-10 overflow-hidden rounded border bg-muted">
                                                        {book.cover_image ? (
                                                            <img
                                                                src={`/storage/${book.cover_image}`}
                                                                alt={book.title}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="font-medium">
                                                        {book.title}
                                                    </div>
                                                    {book.isbn && (
                                                        <div className="text-xs text-muted-foreground">
                                                            ISBN: {book.isbn}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    {book.author}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <Badge variant="outline">
                                                        {book.category?.name ?? '-'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    {book.stock}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    {book.is_borrowed ? (
                                                        <Badge variant="destructive">
                                                            Borrowed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Available
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={show({ book: book.id }).url}>
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
                                                            <Link href={editBook({ book: book.id }).url}>
                                                                <PencilIcon className="h-4 w-4" />
                                                                <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    disabled={book.is_borrowed}
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                    <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                        Delete
                                                                    </span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogTitle>
                                                                    Delete Book
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Are you sure you want to delete "{book.title}"?
                                                                    This action cannot be undone.
                                                                    {book.is_borrowed && (
                                                                        <span className="mt-2 block text-destructive">
                                                                            This book is currently borrowed and cannot be deleted.
                                                                        </span>
                                                                    )}
                                                                </DialogDescription>
                                                                <DialogFooter className="gap-2">
                                                                    <DialogClose asChild>
                                                                        <Button variant="secondary">
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() => handleDelete(book.id)}
                                                                        disabled={book.is_borrowed}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
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

                {books.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {books.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url} preserveScroll>
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

