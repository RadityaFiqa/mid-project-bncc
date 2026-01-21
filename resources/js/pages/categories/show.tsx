import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon, BookOpenIcon } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    title: string;
    author: string;
    stock: number;
}

interface Category {
    id: number;
    name: string;
    description: string | null;
    books_count: number;
    books?: Book[];
    created_at: string;
    updated_at: string;
}

interface CategoryShowProps {
    category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Category Details',
    },
];

export default function CategoryShow({ category }: CategoryShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category: ${category.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/categories">
                                <ArrowLeftIcon />
                                Back
                            </Link>
                        </Button>
                        <Heading
                            title={category.name}
                            description="Category details and books"
                        />
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={`/categories/${category.id}/edit`}>
                            <PencilIcon />
                            Edit Category
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Name
                                </Label>
                                <p className="text-base font-medium">
                                    {category.name}
                                </p>
                            </div>
                            {category.description && (
                                <div>
                                    <Label className="text-sm text-muted-foreground">
                                        Description
                                    </Label>
                                    <p className="text-base">
                                        {category.description}
                                    </p>
                                </div>
                            )}
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Total Books
                                </Label>
                                <div className="mt-1">
                                    <Badge variant="secondary">
                                        {category.books_count} books
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Created At
                                </Label>
                                <p className="text-base">
                                    {new Date(
                                        category.created_at
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    Updated At
                                </Label>
                                <p className="text-base">
                                    {new Date(
                                        category.updated_at
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {category.books && category.books.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Books</CardTitle>
                                <CardDescription>
                                    Latest books in this category
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {category.books.map((book) => (
                                        <div
                                            key={book.id}
                                            className="flex items-start justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {book.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    by {book.author}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                Stock: {book.stock}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(!category.books || category.books.length === 0) && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BookOpenIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    No books in this category yet.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
