import * as migration_20260826_131741_add_posts from './20260826_131741_add_posts';
import * as migration_20260912_142500_add_admin_name from './20260912_142500_add_admin_name';

export const migrations = [
  {
    up: migration_20260826_131741_add_posts.up,
      down: migration_20260826_131741_add_posts.down,
      name: '20260826_131741_add_posts'
    },
    {
      up: migration_20260912_142500_add_admin_name.up,
      down: migration_20260912_142500_add_admin_name.down,
      name: '20260912_142500_add_admin_name'
    },
  ];
