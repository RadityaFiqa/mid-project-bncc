import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { edit, index } from '@/routes/books';
import { type BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    category_id: number;
    title: string;
    author: string;
    isbn: string | null;
    publisher: string | null;
    publication_year: number | null;
    stock: number;
    cover_image: string | null;
    description: string | null;
    category?: { id: number; name: string };
    created_at: string;
    updated_at: string;
}

export default function BookShow({ book, isBorrowed }: { book: Book; isBorrowed: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Books', href: index().url },
        { title: 'Book Details', href: index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Book: ${book.title}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index().url}>
                                <ArrowLeftIcon />
                                Back
                            </Link>
                        </Button>
                        <Heading title={book.title} description="Book details" />
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={edit({ book: book.id }).url}>
                            <PencilIcon />
                            Edit Book
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-32 w-24 overflow-hidden rounded border bg-muted">
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Status</Label>
                                        <div className="mt-1">
                                            {isBorrowed ? (
                                                <Badge variant="destructive">Borrowed</Badge>
                                            ) : (
                                                <Badge variant="secondary">Available</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Stock</Label>
                                        <p className="text-base font-medium">{book.stock}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Author</Label>
                                    <p className="text-base font-medium">{book.author}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Category</Label>
                                    <div className="mt-1">
                                        <Badge variant="outline">{book.category?.name ?? '-'}</Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">ISBN</Label>
                                    <p className="text-base">{book.isbn ?? '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Publication Year</Label>
                                    <p className="text-base">{book.publication_year ?? '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Publisher</Label>
                                    <p className="text-base">{book.publisher ?? '-'}</p>
                                </div>
                            </div>

                            {book.description && (
                                <div>
                                    <Label className="text-sm text-muted-foreground">Description</Label>
                                    <p className="text-base">{book.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm text-muted-foreground">Created At</Label>
                                <p className="text-base">{new Date(book.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">Updated At</Label>
                                <p className="text-base">{new Date(book.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

