import { Exercise } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageSwitcher from './image-switcher';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exercise: Exercise;
}

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
};

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300',
};

export default function ViewExerciseModal({ open, onOpenChange, exercise }: Props) {
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return null;
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)([^\s&]+)/)?.[1];
        if (url.includes('vimeo')) {
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const embedUrl = exercise.video_url ? getYouTubeEmbedUrl(exercise.video_url) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{exercise.name}</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                        {exercise.video_url && <TabsTrigger value="video">Video</TabsTrigger>}
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Category</p>
                                    <p className="text-base font-semibold">{exercise.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Muscle Group</p>
                                    <p className="text-base font-semibold">{exercise.muscle_group}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Difficulty</p>
                                    <Badge className={`capitalize ${difficultyColors[exercise.difficulty]}`}>
                                        {exercise.difficulty}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Status</p>
                                    <Badge className={`capitalize ${statusColors[exercise.status]}`}>
                                        {exercise.status}
                                    </Badge>
                                </div>
                            </div>

                            {exercise.description && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{exercise.description}</p>
                                </div>
                            )}

                            {exercise.instructions && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Instructions</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{exercise.instructions}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-6">
                                {exercise.equipment_required && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Equipment</p>
                                        <p className="text-sm">{exercise.equipment_required}</p>
                                    </div>
                                )}

                                {exercise.duration_seconds && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Duration</p>
                                        <p className="text-sm">{Math.floor(exercise.duration_seconds / 60)}m {exercise.duration_seconds % 60}s</p>
                                    </div>
                                )}

                                {exercise.calories_burned && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Calories</p>
                                        <p className="text-sm">{exercise.calories_burned} kcal</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="images" className="space-y-4">
                        {(exercise.image_primary || exercise.image_secondary) && (
                            <ImageSwitcher imagePrimary={exercise.image_primary} imageSecondary={exercise.image_secondary} />
                        )}
                    </TabsContent>

                    {exercise.video_url && embedUrl && (
                        <TabsContent value="video" className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="aspect-video rounded overflow-hidden bg-black">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={embedUrl}
                                            title={exercise.name}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
