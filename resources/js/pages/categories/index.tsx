import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    description: string | null;
    books_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoriesIndexProps {
    categories: {
        data: Category[];
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
    success?: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function CategoriesIndex({
    categories,
    success,
    error,
}: CategoriesIndexProps) {
    const handleDelete = (categoryId: number) => {
        router.delete(`/categories/${categoryId}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by flash message
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Categories"
                        description="Manage book categories"
                    />
                    <Button asChild>
                        <Link href="/categories/create">
                            <PlusIcon />
                            Add Category
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
                    <CardContent className="p-0">
                        {categories.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No categories found. Create your first
                                    category to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Description
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Books
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Created At
                                            </th>
                                            <th className="px-4 py-3 font-medium text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.data.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-3 align-top">
                                                    <div className="font-medium">
                                                        {category.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-top max-w-md">
                                                    <div className="line-clamp-2 text-muted-foreground">
                                                        {category.description ||
                                                            '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <Badge variant="secondary">
                                                        {category.books_count}{' '}
                                                        books
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 align-top whitespace-nowrap text-xs text-muted-foreground">
                                                    {new Date(
                                                        category.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/categories/${category.id}`}
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
                                                                href={`/categories/${category.id}/edit`}
                                                            >
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
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                    <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                        Delete
                                                                    </span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogTitle>
                                                                    Delete
                                                                    Category
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Are you sure
                                                                    you want to
                                                                    delete "
                                                                    {
                                                                        category.name
                                                                    }
                                                                    "? This
                                                                    action
                                                                    cannot be
                                                                    undone.
                                                                    {category.books_count >
                                                                        0 && (
                                                                        <span className="mt-2 block text-destructive">
                                                                            Warning:{' '}
                                                                            {
                                                                                category.books_count
                                                                            }{' '}
                                                                            book(s)
                                                                            are
                                                                            still
                                                                            linked
                                                                            to
                                                                            this
                                                                            category.
                                                                            You
                                                                            cannot
                                                                            delete
                                                                            it.
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
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                category.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            category.books_count >
                                                                            0
                                                                        }
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

                {categories.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {categories.links.map((link, index) => (
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
