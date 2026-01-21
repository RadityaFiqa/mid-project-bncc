import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index, update, show } from '@/routes/books';
import { type BreadcrumbItem } from '@/types';

interface CategoryOption {
    id: number;
    name: string;
}

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
}

export default function BookEdit({
    book,
    categories,
}: {
    book: Book;
    categories: CategoryOption[];
}) {
    const [categoryId, setCategoryId] = useState<string>(String(book.category_id));

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Books', href: index().url },
        { title: 'Edit Book', href: update({ book: book.id }).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeftIcon />
                            Back
                        </Link>
                    </Button>
                    <Heading title="Edit Book" description="Update book information" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Book Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={update({ book: book.id }).url}
                            method="post"
                            encType="multipart/form-data"
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* method spoofing */}
                                    <input type="hidden" name="_method" value="PATCH" />

                                    <div className="grid gap-2">
                                        <Label htmlFor="category_id">
                                            Category <span className="text-destructive">*</span>
                                        </Label>
                                        <input type="hidden" name="category_id" value={categoryId} />
                                        <Select value={categoryId} onValueChange={setCategoryId}>
                                            <SelectTrigger id="category_id">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">
                                                Title <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="title" name="title" defaultValue={book.title} required autoFocus />
                                            <InputError message={errors.title} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="author">
                                                Author <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="author" name="author" defaultValue={book.author} required />
                                            <InputError message={errors.author} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="isbn">ISBN</Label>
                                            <Input id="isbn" name="isbn" defaultValue={book.isbn ?? ''} />
                                            <InputError message={errors.isbn} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="publisher">Publisher</Label>
                                            <Input id="publisher" name="publisher" defaultValue={book.publisher ?? ''} />
                                            <InputError message={errors.publisher} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="publication_year">Publication Year</Label>
                                            <Input
                                                id="publication_year"
                                                name="publication_year"
                                                type="number"
                                                defaultValue={book.publication_year ?? ''}
                                            />
                                            <InputError message={errors.publication_year} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">
                                                Stock <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="stock" name="stock" type="number" min={0} defaultValue={book.stock} required />
                                            <InputError message={errors.stock} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cover_image">Cover Image</Label>
                                        {book.cover_image && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-20 w-14 overflow-hidden rounded border bg-muted">
                                                    <img
                                                        src={`/storage/${book.cover_image}`}
                                                        alt={book.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={show({ book: book.id }).url}>View details</Link>
                                                </Button>
                                            </div>
                                        )}
                                        <Input id="cover_image" name="cover_image" type="file" accept="image/*" />
                                        <p className="text-xs text-muted-foreground">Upload a new cover to replace the existing one (optional).</p>
                                        <InputError message={errors.cover_image} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            defaultValue={book.description ?? ''}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button type="submit" disabled={processing}>
                                            Update Book
                                        </Button>
                                        <Button type="button" variant="outline" asChild>
                                            <Link href={index().url}>Cancel</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

