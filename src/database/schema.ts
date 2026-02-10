import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at')
    .notNull()
    .$defaultFn(() => Date.now())
    .$onUpdateFn(() => Date.now()),
});

// Export Note to use as an interface in your app
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
