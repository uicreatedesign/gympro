import { useState } from 'react';
import { Exercise } from '@/types';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exercise?: Exercise;
}

export default function ExerciseFormModal({ open, onOpenChange, exercise }: Props) {
    const [formData, setFormData] = useState({
        name: exercise?.name || '',
        description: exercise?.description || '',
        category: exercise?.category || '',
        muscle_group: exercise?.muscle_group || '',
        difficulty: exercise?.difficulty || 'beginner',
        instructions: exercise?.instructions || '',
        video_url: exercise?.video_url || '',
        equipment_required: exercise?.equipment_required || '',
        duration_seconds: exercise?.duration_seconds || '',
        calories_burned: exercise?.calories_burned || '',
        status: exercise?.status || 'active',
    });

    const [images, setImages] = useState<{ primary?: File; secondary?: File }>({});
    const [previews, setPreviews] = useState<{ primary?: string; secondary?: string }>({
        primary: exercise?.image_primary ? `/storage/${exercise.image_primary}` : undefined,
        secondary: exercise?.image_secondary ? `/storage/${exercise.image_secondary}` : undefined,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'secondary') => {
        const file = e.target.files?.[0];
        if (file) {
            setImages(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => ({ ...prev, [type]: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) form.append(key, value);
        });

        if (images.primary) form.append('image_primary', images.primary);
        if (images.secondary) form.append('image_secondary', images.secondary);

        const url = exercise ? `/exercises/${exercise.id}` : '/exercises';
        
        if (exercise) {
            form.append('_method', 'PUT');
        }

        router.post(url, form as any, {
            onError: (errors) => {
                setErrors(errors as Record<string, string>);
            },
            onSuccess: () => {
                onOpenChange(false);
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{exercise ? 'Edit Exercise' : 'Add Exercise'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Please fix the errors below
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Exercise Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Push-ups"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="e.g., Strength"
                                className={errors.category ? 'border-red-500' : ''}
                            />
                            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="muscle_group">Muscle Group *</Label>
                            <Input
                                id="muscle_group"
                                value={formData.muscle_group}
                                onChange={(e) => setFormData(prev => ({ ...prev, muscle_group: e.target.value }))}
                                placeholder="e.g., Chest"
                                className={errors.muscle_group ? 'border-red-500' : ''}
                            />
                            {errors.muscle_group && <p className="text-sm text-red-500">{errors.muscle_group}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty *</Label>
                            <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}>
                                <SelectTrigger className={errors.difficulty ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.difficulty && <p className="text-sm text-red-500">{errors.difficulty}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the exercise"
                            rows={3}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                            placeholder="Step-by-step instructions"
                            rows={3}
                            className={errors.instructions ? 'border-red-500' : ''}
                        />
                        {errors.instructions && <p className="text-sm text-red-500">{errors.instructions}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="image_primary">Primary Image</Label>
                            <div className="space-y-2">
                                {previews.primary && (
                                    <div className="relative w-full h-32 rounded border border-gray-200 overflow-hidden">
                                        <img src={previews.primary} alt="Primary" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImages(prev => ({ ...prev, primary: undefined }));
                                                setPreviews(prev => ({ ...prev, primary: undefined }));
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm">Upload Image</span>
                                    </div>
                                    <input
                                        id="image_primary"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'primary')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.image_primary && <p className="text-sm text-red-500">{errors.image_primary}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_secondary">Secondary Image</Label>
                            <div className="space-y-2">
                                {previews.secondary && (
                                    <div className="relative w-full h-32 rounded border border-gray-200 overflow-hidden">
                                        <img src={previews.secondary} alt="Secondary" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImages(prev => ({ ...prev, secondary: undefined }));
                                                setPreviews(prev => ({ ...prev, secondary: undefined }));
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm">Upload Image</span>
                                    </div>
                                    <input
                                        id="image_secondary"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'secondary')}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.image_secondary && <p className="text-sm text-red-500">{errors.image_secondary}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="video_url">Video URL (YouTube/Vimeo) - Optional</Label>
                        <Input
                            id="video_url"
                            type="url"
                            value={formData.video_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                            className={errors.video_url ? 'border-red-500' : ''}
                        />
                        {errors.video_url && <p className="text-sm text-red-500">{errors.video_url}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="equipment_required">Equipment</Label>
                            <Input
                                id="equipment_required"
                                value={formData.equipment_required}
                                onChange={(e) => setFormData(prev => ({ ...prev, equipment_required: e.target.value }))}
                                placeholder="e.g., Dumbbells"
                                className={errors.equipment_required ? 'border-red-500' : ''}
                            />
                            {errors.equipment_required && <p className="text-sm text-red-500">{errors.equipment_required}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration_seconds">Duration (seconds)</Label>
                            <Input
                                id="duration_seconds"
                                type="number"
                                value={formData.duration_seconds}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration_seconds: e.target.value }))}
                                placeholder="60"
                                className={errors.duration_seconds ? 'border-red-500' : ''}
                            />
                            {errors.duration_seconds && <p className="text-sm text-red-500">{errors.duration_seconds}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="calories_burned">Calories Burned</Label>
                            <Input
                                id="calories_burned"
                                type="number"
                                value={formData.calories_burned}
                                onChange={(e) => setFormData(prev => ({ ...prev, calories_burned: e.target.value }))}
                                placeholder="50"
                                className={errors.calories_burned ? 'border-red-500' : ''}
                            />
                            {errors.calories_burned && <p className="text-sm text-red-500">{errors.calories_burned}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : exercise ? 'Update Exercise' : 'Create Exercise'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
