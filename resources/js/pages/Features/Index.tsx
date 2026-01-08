import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';

interface Feature {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    status: 'active' | 'inactive';
    created_at: string;
}

interface Props {
    features: Feature[];
}

export default function Features({ features: initialFeatures }: Props) {
    const { auth } = usePage().props as any;
    const [openDialog, setOpenDialog] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
        status: 'active',
    });

    const canCreate = auth.permissions.includes('create_plans');
    const canEdit = auth.permissions.includes('edit_plans');
    const canDelete = auth.permissions.includes('delete_plans');

    const handleOpenDialog = (feature?: Feature) => {
        if (feature) {
            setEditingFeature(feature);
            setFormData({
                name: feature.name,
                description: feature.description || '',
                icon: feature.icon || '',
                status: feature.status,
            });
        } else {
            setEditingFeature(null);
            setFormData({
                name: '',
                description: '',
                icon: '',
                status: 'active',
            });
        }
        setOpenDialog(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingFeature) {
            router.put(`/features/${editingFeature.id}`, formData, {
                onSuccess: () => {
                    setOpenDialog(false);
                    setEditingFeature(null);
                },
            });
        } else {
            router.post('/features', formData, {
                onSuccess: () => {
                    setOpenDialog(false);
                    setFormData({
                        name: '',
                        description: '',
                        icon: '',
                        status: 'active',
                    });
                },
            });
        }
    };

    const handleDelete = () => {
        if (featureToDelete) {
            router.delete(`/features/${featureToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setFeatureToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Features" />

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Plan Features</h1>
                        <p className="text-muted-foreground">Manage gym features for membership plans</p>
                    </div>
                    {canCreate && (
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button onClick={() => handleOpenDialog()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Feature
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingFeature
                                            ? 'Update the feature details'
                                            : 'Create a new feature for your gym plans'}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Feature Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Swimming Pool"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe this feature..."
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="icon">Icon Name</Label>
                                        <Input
                                            id="icon"
                                            placeholder="e.g., waves, dumbbell, users"
                                            value={formData.icon}
                                            onChange={(e) =>
                                                setFormData({ ...formData, icon: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    status: value as 'active' | 'inactive',
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setOpenDialog(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingFeature ? 'Update' : 'Create'} Feature
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {initialFeatures.map((feature) => (
                        <Card key={feature.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                                        <CardDescription className="text-xs mt-1">
                                            {feature.slug}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={
                                            feature.status === 'active' ? 'default' : 'secondary'
                                        }
                                    >
                                        {feature.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                {feature.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                )}
                                {feature.icon && (
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-semibold">Icon:</span> {feature.icon}
                                    </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                    {canEdit && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenDialog(feature)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive"
                                            onClick={() => {
                                                setFeatureToDelete(feature);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {initialFeatures.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No features yet</h3>
                            <p className="text-muted-foreground text-center mt-2">
                                Create your first feature to get started
                            </p>
                            {canCreate && (
                                <Button
                                    className="mt-4"
                                    onClick={() => handleOpenDialog()}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Feature
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Feature</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{featureToDelete?.name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
