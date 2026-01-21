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
import { index, update } from '@/routes/members';
import { type BreadcrumbItem } from '@/types';

interface Member {
    id: number;
    member_code: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    join_date: string;
}

export default function MemberEdit({ member }: { member: Member }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Members', href: index().url },
        { title: 'Edit Member', href: update({ member: member.id }).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Member" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeftIcon />
                            Back
                        </Link>
                    </Button>
                    <Heading title="Edit Member" description={member.member_code} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Member Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={update({ member: member.id }).url}
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input type="hidden" name="_method" value="PATCH" />

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="name" name="name" defaultValue={member.name} required autoFocus />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-destructive">*</span>
                                            </Label>
                                            <Input id="email" name="email" type="email" defaultValue={member.email} required />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input id="phone" name="phone" defaultValue={member.phone ?? ''} />
                                            <InputError message={errors.phone} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="join_date">Join Date</Label>
                                            <Input id="join_date" name="join_date" type="date" defaultValue={member.join_date} />
                                            <InputError message={errors.join_date} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea id="address" name="address" rows={3} defaultValue={member.address ?? ''} />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button type="submit" disabled={processing}>
                                            Update Member
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

