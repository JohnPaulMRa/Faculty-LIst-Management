import { PublicFaculty } from './public-faculty';
import { PrivateFaculty } from './private-faculty';

export * from './base';
export * from './public-faculty';
export * from './private-faculty';
export * from './constants';

export type Faculty = PrivateFaculty | PublicFaculty;
