import * as migration_20260826_131741_add_posts from './20260826_131741_add_posts';

export const migrations = [
  {
    up: migration_20260826_131741_add_posts.up,
    down: migration_20260826_131741_add_posts.down,
    name: '20260826_131741_add_posts'
  },
];
