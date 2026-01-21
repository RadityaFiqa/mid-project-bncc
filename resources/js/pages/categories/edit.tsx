import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface CategoryEditProps {
    category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Edit Category',
    },
];

export default function CategoryEdit({ category }: CategoryEditProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/categories">
                                <ArrowLeftIcon />
                                Back
                            </Link>
                        </Button>
                    <Heading
                        title="Edit Category"
                        description="Update category information"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={`/categories/${category.id}`}
                            method="patch"
                            className="space-y-6"
                        >
                            {({ processing, errors, recentlySuccessful }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={category.name}
                                            placeholder="e.g., Fiction, Non-Fiction"
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={category.description || ''}
                                            placeholder="Enter category description..."
                                            rows={4}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Update Category
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/categories">
                                                Cancel
                                            </Link>
                                        </Button>
                                        {recentlySuccessful && (
                                            <span className="text-sm text-green-600">
                                                Saved
                                            </span>
                                        )}
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
