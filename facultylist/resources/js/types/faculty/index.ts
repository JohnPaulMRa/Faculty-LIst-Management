import type { PrivateFaculty } from './private-faculty';
import type { PublicFaculty } from './public-faculty';

export * from './base';
export * from './public-faculty';
export * from './private-faculty';
export * from './constants';

export type Faculty = PrivateFaculty | PublicFaculty;
