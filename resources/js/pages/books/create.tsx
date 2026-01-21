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
import { index, store } from '@/routes/books';
import { type BreadcrumbItem } from '@/types';

interface CategoryOption {
    id: number;
    name: string;
}

export default function BookCreate({ categories }: { categories: CategoryOption[] }) {
    const [categoryId, setCategoryId] = useState<string>('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Books', href: index().url },
        { title: 'Create Book', href: store().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Book" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeftIcon />
                            Back
                        </Link>
                    </Button>
                    <Heading title="Create Book" description="Add a new book and upload cover" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Book Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={store().url}
                            method="post"
                            encType="multipart/form-data"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
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
                                            <Input id="title" name="title" required autoFocus />
                                            <InputError message={errors.title} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="author">
                                                Author <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="author" name="author" required />
                                            <InputError message={errors.author} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="isbn">ISBN</Label>
                                            <Input id="isbn" name="isbn" />
                                            <InputError message={errors.isbn} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="publisher">Publisher</Label>
                                            <Input id="publisher" name="publisher" />
                                            <InputError message={errors.publisher} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="publication_year">Publication Year</Label>
                                            <Input id="publication_year" name="publication_year" type="number" />
                                            <InputError message={errors.publication_year} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">
                                                Stock <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="stock" name="stock" type="number" min={0} defaultValue={0} required />
                                            <InputError message={errors.stock} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cover_image">Cover Image</Label>
                                        <Input id="cover_image" name="cover_image" type="file" accept="image/*" />
                                        <p className="text-xs text-muted-foreground">Max 2MB. JPG/PNG/WebP supported.</p>
                                        <InputError message={errors.cover_image} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" rows={4} />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button type="submit" disabled={processing}>
                                            Create Book
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

