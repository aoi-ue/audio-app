import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { UsersResponse } from '@/lib/pocketbase-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/usertable')({
    component: AdminUserTable,
});

type UserWithAdmin = UsersResponse & { isAdmin?: boolean };

export default function AdminUserTable() {
    const [users, setUsers] = useState<UserWithAdmin[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        email: string;
        name: string;
        isAdmin: boolean;
    }>({ email: '', name: '', isAdmin: false });
    const [createForm, setCreateForm] = useState<{
        email: string;
        name: string;
        password: string;
        isAdmin: boolean;
    }>({ email: '', name: '', password: '', isAdmin: false });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const list = await pb.collection('users').getFullList();
        setUsers(list);
    };

    const handleEdit = (user: UserWithAdmin) => {
        setEditingId(user.id);
        setEditForm({
            email: user.email,
            name: user.name || '',
            isAdmin: !!user?.isAdmin,
        });
    };

    const handleUpdate = async (id: string) => {
        await pb.collection('users').update(id, editForm);
        setEditingId(null);
        fetchUsers();
    };

    const handleDelete = async (id: string) => {
        await pb.collection('users').delete(id);
        fetchUsers();
    };

    const handleCreate = async () => {
        await pb.collection('users').create({
            email: createForm.email,
            name: createForm.name,
            password: createForm.password,
            passwordConfirm: createForm.password,
            isAdmin: createForm.isAdmin,
        });
        setCreateForm({
            email: '',
            name: '',
            password: '',
            isAdmin: false,
        });
        fetchUsers();
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <Card className="mb-6 p-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="mb-4">
                            Create New User
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Create New User</SheetTitle>
                        </SheetHeader>
                        <form
                            className="flex flex-col gap-4 mt-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreate();
                            }}
                        >
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="Email"
                                value={createForm.email}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Name"
                                value={createForm.name}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                value={createForm.password}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={createForm.isAdmin}
                                    onCheckedChange={(checked) =>
                                        setCreateForm({
                                            ...createForm,
                                            isAdmin: !!checked,
                                        })
                                    }
                                />
                                <span>Admin</span>
                            </div>
                            <SheetFooter>
                                <Button type="submit">
                                    Create User
                                </Button>
                                <SheetClose asChild>
                                    <Button
                                        variant="outline"
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </Card>
            <Separator />
            <div className="mt-6 grid gap-4">
                {users.map((user) => (
                    <Card
                        key={user.id}
                        className="flex items-center justify-between p-4"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage
                                    src={
                                        user.avatar
                                            ? pb.files.getUrl(
                                                  user,
                                                  user.avatar
                                              )
                                            : undefined
                                    }
                                    alt={user.name || user.email}
                                />
                                <AvatarFallback>
                                    {(user.name ||
                                        user.email ||
                                        'U')[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">
                                    {user.name || user.email}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {user.email}
                                </div>
                                <div className="text-xs">
                                    {user.isAdmin ? 'Admin' : 'User'}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleEdit(user)
                                        }
                                    >
                                        Edit
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Edit user
                                </TooltipContent>
                            </Tooltip>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        Delete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Delete User
                                        </DialogTitle>
                                    </DialogHeader>
                                    <p>
                                        Are you sure you want to
                                        delete{' '}
                                        {user.name || user.email}?
                                    </p>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        More
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            alert(
                                                `User ID: ${user.id}`
                                            )
                                        }
                                    >
                                        Copy User ID
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {editingId === user.id && (
                            <Dialog
                                open={true}
                                onOpenChange={(open) =>
                                    !open && setEditingId(null)
                                }
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Edit User
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form
                                        className="flex flex-col gap-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUpdate(user.id);
                                        }}
                                    >
                                        <Label htmlFor="edit-email">
                                            Email
                                        </Label>
                                        <Input
                                            id="edit-email"
                                            value={editForm.email}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    email: e.target
                                                        .value,
                                                })
                                            }
                                            required
                                        />
                                        <Label htmlFor="edit-name">
                                            Name
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    name: e.target
                                                        .value,
                                                })
                                            }
                                            required
                                        />
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={
                                                    editForm.isAdmin
                                                }
                                                onCheckedChange={(
                                                    checked
                                                ) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        isAdmin:
                                                            !!checked,
                                                    })
                                                }
                                            />
                                            <span>Admin</span>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">
                                                Save
                                            </Button>
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
