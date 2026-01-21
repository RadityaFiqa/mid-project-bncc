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
import { index, store } from '@/routes/members';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Members', href: index().url },
    { title: 'Create Member', href: store().url },
];

export default function MemberCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Member" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeftIcon />
                            Back
                        </Link>
                    </Button>
                    <Heading
                        title="Register Member"
                        description="Member code will be generated automatically"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Member Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form action={store().url} method="post" className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="name" name="name" required autoFocus />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="email" name="email" type="email" required />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input id="phone" name="phone" />
                                            <InputError message={errors.phone} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="join_date">Join Date</Label>
                                            <Input id="join_date" name="join_date" type="date" />
                                            <p className="text-xs text-muted-foreground">
                                                Leave empty to use today.
                                            </p>
                                            <InputError message={errors.join_date} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea id="address" name="address" rows={3} />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button type="submit" disabled={processing}>
                                            Register Member
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

