import { usePage } from '@inertiajs/react';

export function usePermissions(): string[] {
    const { userPermissions } = usePage().props as any;
    return Array.isArray(userPermissions) ? userPermissions : [];
}

export function useHasPermission() {
    const permissions = usePermissions();
    
    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const hasAnyPermission = (perms: string[]): boolean => {
        return perms.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (perms: string[]): boolean => {
        return perms.every(permission => hasPermission(permission));
    };

    const canView = (module: string): boolean => {
        return hasPermission(`view_${module}`);
    };

    const canCreate = (module: string): boolean => {
        return hasPermission(`create_${module}`);
    };

    const canEdit = (module: string): boolean => {
        return hasPermission(`edit_${module}`);
    };

    const canDelete = (module: string): boolean => {
        return hasPermission(`delete_${module}`);
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canView,
        canCreate,
        canEdit,
        canDelete,
        permissions,
    };
}