
import { relations } from 'drizzle-orm';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255}).notNull().unique(),
    username: varchar('usernama', { length: 100}).notNull().unique(),
    password: varchar('password', { length: 255}).notNull(),
    firstName: varchar('first_name', { length: 100}),
    lastName: varchar('last_name', { length: 100}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const habits = pgTable('habits', {
    id: uuid('id').primaryKey().defaultRandom().notNull(), 
    userId: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    frequency: varchar('frequency', { length: 50 }).notNull().default('1'), // times per day
    isActive: boolean('is_active').default(true).notNull(),
    targetCount: integer('target_count').default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const enteries = pgTable('entries', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    habitId: uuid('habit_id').references(() => habits.id, {onDelete: 'cascade'}).notNull(),
   conplationDate: timestamp('completion_date').notNull(),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   note: text('note'),
})

export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().defaultRandom(), 
    name: varchar('name', { length: 50 }).notNull().unique(),
    color: varchar('color', { length: 20 }).default('#6b7280'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habitsTags = pgTable('habits_tags', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    habitId: uuid('habit_id').references(() => habits.id, {onDelete: 'cascade'}).notNull(),
    tagId: uuid('tag_id').references(() => tags.id, {onDelete: 'cascade'}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userRelationships = relations(users, ({many}) => ({
    habits: many(habits),
}))

export const habitsRelationships = relations(habits, ({one, many}) => ({
    user: one(users, {
        fields: [habits.userId],
        references: [users.id],
    }),
    entries: many(enteries),
    habitsTags: many(habitsTags),
}))

export const entriesRelationships = relations(enteries, ({one}) => ({
    habits: one(habits, {
        fields: [enteries.habitId],
        references: [habits.id],
    })
}))

export const tagsRelationships = relations(tags, ({many}) => ({
    habitsTags: many(habitsTags),
}))

export const habitsTagsRelationships = relations(habitsTags, ({one}) => ({
    habit: one(habits, {
        fields: [habitsTags.habitId],
        references: [habits.id],
    }),
    tag: one(tags, {
        fields: [habitsTags.tagId],
        references: [tags.id],
    })
}))


export type User = typeof users.$inferSelect;
export type Habits = typeof habits.$inferSelect;
export type Entry = typeof enteries.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type HabitsTags = typeof habitsTags.$inferSelect;

export const createUserSchema = createInsertSchema(users);
export const selectUserSchema = createInsertSchema(users);