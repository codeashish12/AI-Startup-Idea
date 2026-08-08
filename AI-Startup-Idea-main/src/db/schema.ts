import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or unique user ID string
  email: text('email').notNull(),
  name: text('name'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// User Profiles table
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  name: text('name'),
  age: integer('age'),
  education: text('education'),
  skills: jsonb('skills'),
  experience: text('experience'),
  income: text('income'),
  savings: text('savings'),
  city: text('city'),
  availableTime: text('available_time'),
  riskTolerance: text('risk_tolerance'),
  goalsSummary: text('goals_summary'),
  interests: jsonb('interests'),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Simulations table
export const simulations = pgTable('simulations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  goalCategory: text('goal_category').notNull(),
  goalTitle: text('goal_title').notNull(),
  goalDetails: jsonb('goal_details'),
  userProfile: jsonb('user_profile'),
  simulationResult: jsonb('simulation_result').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Reports table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  simulationId: text('simulation_id').references(() => simulations.id),
  goalTitle: text('goal_title').notNull(),
  reportData: jsonb('report_data').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// FDF (Future Decision Framework) Versions table
export const fdfVersions = pgTable('fdf_versions', {
  id: serial('id').primaryKey(),
  version: text('version').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  config: jsonb('config').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.uid],
    references: [profiles.userId]
  }),
  simulations: many(simulations),
  reports: many(reports)
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.uid]
  })
}));

export const simulationsRelations = relations(simulations, ({ one, many }) => ({
  user: one(users, {
    fields: [simulations.userId],
    references: [users.uid]
  }),
  reports: many(reports)
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.uid]
  }),
  simulation: one(simulations, {
    fields: [reports.simulationId],
    references: [simulations.id]
  })
}));
