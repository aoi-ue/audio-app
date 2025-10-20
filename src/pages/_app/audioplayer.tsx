import { createFileRoute } from '@tanstack/react-router';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/_app/audioplayer')({
    component: AudioPlayerPage,
});

const categories = [
    'Music',
    'Podcast',
    'Audiobook',
    'Lecture',
    'Others',
];

type AudioFile = {
    id: string;
    description: string;
    category: string;
    file: string;
};

export default function AudioPlayerPage() {
    const [files, setFiles] = useState<AudioFile[]>([]);
    const [form, setForm] = useState<{
        file: File | null;
        description: string;
        category: string;
    }>({
        file: null,
        description: '',
        category: categories[0],
    });

    const userId = pb.authStore.model?.id;

    useEffect(() => {
        pb.collection('audio_files')
            .getFullList()
            .then((records) => {
                setFiles(
                    records.map((record) => ({
                        id: record.id,
                        description: record.description,
                        category: record.category,
                        file: record.file,
                    }))
                );
            });
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.file || !userId) return;
        const data = new FormData();
        data.append('file', form.file);
        data.append('description', form.description);
        data.append('category', form.category);
        data.append('uploader_id', userId);

        await pb.collection('audio_files').create(data);
        setForm({
            file: null,
            description: '',
            category: categories[0],
        });
        // Refresh list
        pb.collection('audio_files')
            .getFullList({ filter: `uploader_id="${userId}"` })
            .then((records) =>
                setFiles(
                    records.map((record) => ({
                        id: record.id,
                        description: record.description,
                        category: record.category,
                        file: record.file,
                    }))
                )
            );
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Audio Library</h2>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>Upload Audio</Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Upload Audio File</SheetTitle>
                        </SheetHeader>
                        <form
                            onSubmit={handleUpload}
                            className="flex flex-col gap-4 mt-4"
                        >
                            <div>
                                <Label htmlFor="file">
                                    Audio/Video File
                                </Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept="audio/*,video/mp4,video/x-msvideo"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            file:
                                                e.target.files?.[0] ||
                                                null,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description:
                                                e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">
                                    Category
                                </Label>
                                <select
                                    id="category"
                                    className="w-full border rounded px-2 py-1"
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            category: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <SheetFooter>
                                <Button type="submit">Upload</Button>
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
            </div>
            <Separator />
            <div className="grid gap-4 mt-6">
                {files.length === 0 && (
                    <div className="text-muted-foreground">
                        No audio files uploaded yet.
                    </div>
                )}
                {files.map((file) => (
                    <Card
                        key={file.id}
                        className="p-4 flex flex-col gap-2"
                    >
                        <div className="font-semibold">
                            {file.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {file.category}
                        </div>
                        <audio
                            controls
                            src={pb.files.getUrl(file, file.file)}
                            className="mt-2"
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}
