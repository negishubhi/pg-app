import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin' | 'tenant'
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  type: text("type").notNull(), // 'single' | 'double' | 'triple'
  rent: integer("rent").notNull(),
  status: text("status").notNull().default("vacant"), // 'occupied' | 'vacant' | 'maintenance'
  amenities: text("amenities").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  roomId: integer("room_id").references(() => rooms.id),
  joinDate: timestamp("join_date").defaultNow(),
  leaveDate: timestamp("leave_date"),
  emergencyContact: text("emergency_contact"),
  idProof: text("id_proof"), // File path
  isActive: boolean("is_active").default(true),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  amount: integer("amount").notNull(),
  month: text("month").notNull(), // 'YYYY-MM'
  status: text("status").notNull().default("pending"), // 'paid' | 'pending' | 'overdue'
  paidAt: timestamp("paid_at"),
  dueDate: timestamp("due_date").notNull(),
  paymentMethod: text("payment_method"), // 'cash' | 'upi' | 'bank_transfer'
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"), // 'low' | 'medium' | 'high'
  status: text("status").notNull().default("open"), // 'open' | 'in_progress' | 'resolved' | 'closed'
  category: text("category"), // 'maintenance' | 'utilities' | 'noise' | 'other'
  resolvedAt: timestamp("resolved_at"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"), // 'low' | 'normal' | 'high'
  targetAudience: text("target_audience").notNull().default("all"), // 'all' | 'specific_room' | 'specific_tenant'
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  joinDate: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Extended types for joins
export type TenantWithUser = Tenant & { user: User };
export type TenantWithUserAndRoom = Tenant & { user: User; room: Room };
export type PaymentWithTenant = Payment & { tenant: TenantWithUser };
export type ComplaintWithTenant = Complaint & { tenant: TenantWithUser };
