import type { ROLE } from '../constants';

export type RoleId = (typeof ROLE)[keyof typeof ROLE];

export const checkAccess = (access: RoleId[], userRole: RoleId): boolean =>
	access.includes(userRole);
