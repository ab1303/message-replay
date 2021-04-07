import { Path, routeTo } from 'src/router';

export enum SideNavMode {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export const MENU = [
  { to: routeTo(Path.MESSAGE_BROKER_QUEUES), label: 'Queues' },
  { to: routeTo(Path.MESSAGE_BROKER_TOPICS), label: 'Topics' },
];
