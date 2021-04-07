export enum Path {
  HOME = '/',
  PROFILE = '/profile',
  Settings = '/settings',

  MESSAGE_BROKER_ROOT = '/servicebus',
  MESSAGE_BROKER_QUEUES = '/servicebus/queues',
  MESSAGE_BROKER_TOPICS = '/servicebus/topics',

  USERS_ROOT = '/users',
  USERS_ADD = '/users/add',
  USERS_EDIT = '/users/:id',
}
