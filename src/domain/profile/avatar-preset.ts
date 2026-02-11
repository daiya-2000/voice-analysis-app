import type { ComponentProps } from 'react';

import type { MaterialIcons } from '@expo/vector-icons';

export type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface AvatarPreset {
  id: string;
  label: string;
  iconName: MaterialIconName;
  backgroundColor: string;
  accentColor: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'forest',
    label: 'Forest',
    iconName: 'park',
    backgroundColor: '#193326',
    accentColor: '#2BEE6C',
  },
  {
    id: 'orbit',
    label: 'Orbit',
    iconName: 'public',
    backgroundColor: '#21303E',
    accentColor: '#68C4FF',
  },
  {
    id: 'spark',
    label: 'Spark',
    iconName: 'auto-awesome',
    backgroundColor: '#372A1B',
    accentColor: '#FFB457',
  },
  {
    id: 'pulse',
    label: 'Pulse',
    iconName: 'favorite',
    backgroundColor: '#3A1E26',
    accentColor: '#FF7FA1',
  },
  {
    id: 'logic',
    label: 'Logic',
    iconName: 'psychology',
    backgroundColor: '#20243D',
    accentColor: '#9BA8FF',
  },
  {
    id: 'echo',
    label: 'Echo',
    iconName: 'graphic-eq',
    backgroundColor: '#1F3430',
    accentColor: '#54D7BE',
  },
];
