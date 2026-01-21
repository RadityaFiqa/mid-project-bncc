import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';

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
import { create, destroy, edit, index } from '@/routes/members';
import { type BreadcrumbItem } from '@/types';

interface MemberRow {
    id: number;
    member_code: string;
    name: string;
    email: string;
    phone: string | null;
    join_date: string;
    active_borrowings_count: number;
    created_at: string;
}

interface MembersIndexProps {
    members: {
        data: MemberRow[];
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
        title: 'Members',
        href: index().url,
    },
];

export default function MembersIndex({ members, success, error }: MembersIndexProps) {
    const handleDelete = (memberId: number) => {
        router.delete(destroy({ member: memberId }).url, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading title="Members" description="Manage library members" />
                    <Button asChild>
                        <Link href={create().url}>
                            <PlusIcon />
                            Add Member
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
                        {members.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No members found.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Code
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Phone
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Join Date
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Active Borrowings
                                            </th>
                                            <th className="px-4 py-3 font-medium text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.data.map((m) => (
                                            <tr
                                                key={m.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-3 align-top">
                                                    <span className="font-mono text-xs">
                                                        {m.member_code}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 align-top font-medium">
                                                    {m.name}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    {m.email}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    {m.phone ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 align-top whitespace-nowrap text-xs text-muted-foreground">
                                                    {new Date(m.join_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    {m.active_borrowings_count > 0 ? (
                                                        <Badge variant="destructive">
                                                            {m.active_borrowings_count}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">0</Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={edit({ member: m.id }).url}>
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
                                                                    disabled={m.active_borrowings_count > 0}
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                    <span className="sr-only sm:not-sr-only sm:ml-1">
                                                                        Delete
                                                                    </span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogTitle>
                                                                    Delete Member
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Are you sure you want to delete "{m.name}"?
                                                                    {m.active_borrowings_count > 0 && (
                                                                        <span className="mt-2 block text-destructive">
                                                                            This member still has {m.active_borrowings_count} active borrowing(s) and cannot be deleted.
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
                                                                        onClick={() => handleDelete(m.id)}
                                                                        disabled={m.active_borrowings_count > 0}
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

                {members.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {members.links.map((link, i) => (
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

