import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage().props as any;
    const permissions = auth.permissions || [];

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const hasAnyPermission = (permissionList: string[]): boolean => {
        return permissionList.some(permission => permissions.includes(permission));
    };

    const hasAllPermissions = (permissionList: string[]): boolean => {
        return permissionList.every(permission => permissions.includes(permission));
    };

    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
}
