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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Create Category',
        href: '/categories/create',
    },
];

export default function CategoryCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/categories">
                                <ArrowLeftIcon />
                                Back
                            </Link>
                        </Button>
                    <Heading
                        title="Create Category"
                        description="Add a new book category"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action="/categories"
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
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
                                            Create Category
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
