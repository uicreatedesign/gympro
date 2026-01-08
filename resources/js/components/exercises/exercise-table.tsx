import { Exercise } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Eye, Image as ImageIcon } from 'lucide-react';

interface Props {
    exercises: Exercise[];
    onView?: (exercise: Exercise) => void;
    onEdit?: (exercise: Exercise) => void;
    onDelete?: (exercise: Exercise) => void;
    onToggleStatus?: (exercise: Exercise) => void;
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

export default function ExerciseTable({ exercises, onView, onEdit, onDelete, onToggleStatus }: Props) {
    if (!exercises || exercises.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No exercises available</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-16">Sr No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Muscle Group</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    {(onView || onEdit || onDelete || onToggleStatus) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {exercises.map((exercise, index) => (
                    <TableRow key={exercise.id} className="hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {exercise.image_primary ? (
                                    <img 
                                        src={`/storage/${exercise.image_primary}`} 
                                        alt={exercise.name}
                                        className="h-8 w-8 rounded object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                )}
                                <span className="font-medium">{exercise.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{exercise.category}</TableCell>
                        <TableCell>{exercise.muscle_group}</TableCell>
                        <TableCell>
                            <Badge className={`capitalize ${difficultyColors[exercise.difficulty]}`}>
                                {exercise.difficulty}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={`capitalize ${statusColors[exercise.status]}`}>
                                {exercise.status}
                            </Badge>
                        </TableCell>
                        {(onView || onEdit || onDelete || onToggleStatus) && (
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onView && (
                                        <Button variant="outline" size="sm" onClick={() => onView(exercise)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button variant="outline" size="sm" onClick={() => onEdit(exercise)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button variant="outline" size="sm" onClick={() => onDelete(exercise)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
