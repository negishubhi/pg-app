import { 
  users, rooms, tenants, payments, complaints, announcements,
  type User, type InsertUser,
  type Room, type InsertRoom,
  type Tenant, type InsertTenant, type TenantWithUser, type TenantWithUserAndRoom,
  type Payment, type InsertPayment, type PaymentWithTenant,
  type Complaint, type InsertComplaint, type ComplaintWithTenant,
  type Announcement, type InsertAnnouncement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Room operations
  getAllRooms(): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  getRoomByNumber(number: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, updates: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;

  // Tenant operations
  getAllTenants(): Promise<TenantWithUserAndRoom[]>;
  getTenant(id: number): Promise<TenantWithUserAndRoom | undefined>;
  getTenantByUserId(userId: number): Promise<TenantWithUserAndRoom | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, updates: Partial<InsertTenant>): Promise<Tenant | undefined>;

  // Payment operations
  getAllPayments(): Promise<PaymentWithTenant[]>;
  getPaymentsByTenant(tenantId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined>;

  // Complaint operations
  getAllComplaints(): Promise<ComplaintWithTenant[]>;
  getComplaintsByTenant(tenantId: number): Promise<Complaint[]>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: number, updates: Partial<InsertComplaint>): Promise<Complaint | undefined>;

  // Announcement operations
  getAllAnnouncements(): Promise<Announcement[]>;
  getActiveAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalRooms: number;
    activeTenants: number;
    monthlyRevenue: number;
    pendingComplaints: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private rooms: Map<number, Room> = new Map();
  private tenants: Map<number, Tenant> = new Map();
  private payments: Map<number, Payment> = new Map();
  private complaints: Map<number, Complaint> = new Map();
  private announcements: Map<number, Announcement> = new Map();
  private currentId: number = 1;

  constructor() {
    // Initialize with some default data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentId++,
      email: "admin@pgmanager.com",
      password: "admin123",
      role: "admin",
      name: "Admin User",
      phone: "+91 98765 43210",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create some rooms
    const room1: Room = {
      id: this.currentId++,
      number: "101",
      type: "single",
      rent: 2500,
      status: "occupied",
      amenities: ["AC", "WiFi", "Attached Bathroom", "Study Table"],
      createdAt: new Date(),
    };
    this.rooms.set(room1.id, room1);

    const room2: Room = {
      id: this.currentId++,
      number: "102",
      type: "double",
      rent: 3000,
      status: "vacant",
      amenities: ["WiFi", "Shared Bathroom", "Wardrobe"],
      createdAt: new Date(),
    };
    this.rooms.set(room2.id, room2);

    const room3: Room = {
      id: this.currentId++,
      number: "103",
      type: "triple",
      rent: 2000,
      status: "occupied",
      amenities: ["WiFi", "Shared Bathroom", "Study Table"],
      createdAt: new Date(),
    };
    this.rooms.set(room3.id, room3);

    const room4: Room = {
      id: this.currentId++,
      number: "201",
      type: "single",
      rent: 2800,
      status: "maintenance",
      amenities: ["AC", "WiFi", "Attached Bathroom", "Balcony"],
      createdAt: new Date(),
    };
    this.rooms.set(room4.id, room4);

    // Create tenant users
    const tenantUser1: User = {
      id: this.currentId++,
      email: "john@example.com",
      password: "tenant123",
      role: "tenant",
      name: "John Doe",
      phone: "+91 98765 43211",
      createdAt: new Date(),
    };
    this.users.set(tenantUser1.id, tenantUser1);

    const tenantUser2: User = {
      id: this.currentId++,
      email: "sarah@example.com",
      password: "tenant123",
      role: "tenant",
      name: "Sarah Wilson",
      phone: "+91 98765 43212",
      createdAt: new Date(),
    };
    this.users.set(tenantUser2.id, tenantUser2);

    // Create tenants
    const tenant1: Tenant = {
      id: this.currentId++,
      userId: tenantUser1.id,
      roomId: room1.id,
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      leaveDate: null,
      emergencyContact: "+91 98765 43213",
      idProof: "aadhar.jpg",
      isActive: true,
    };
    this.tenants.set(tenant1.id, tenant1);

    const tenant2: Tenant = {
      id: this.currentId++,
      userId: tenantUser2.id,
      roomId: room3.id,
      joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      leaveDate: null,
      emergencyContact: "+91 98765 43214",
      idProof: "passport.jpg",
      isActive: true,
    };
    this.tenants.set(tenant2.id, tenant2);

    // Create sample payments
    const payment1: Payment = {
      id: this.currentId++,
      tenantId: tenant1.id,
      amount: 2500,
      month: "2024-12",
      status: "paid",
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      dueDate: new Date(2024, 11, 1), // December 1, 2024
      paymentMethod: "upi",
      transactionId: "TXN123456789",
      createdAt: new Date(),
    };
    this.payments.set(payment1.id, payment1);

    const payment2: Payment = {
      id: this.currentId++,
      tenantId: tenant2.id,
      amount: 2000,
      month: "2024-12",
      status: "pending",
      paidAt: null,
      dueDate: new Date(2024, 11, 1), // December 1, 2024
      paymentMethod: null,
      transactionId: null,
      createdAt: new Date(),
    };
    this.payments.set(payment2.id, payment2);

    const payment3: Payment = {
      id: this.currentId++,
      tenantId: tenant1.id,
      amount: 2500,
      month: "2024-11",
      status: "paid",
      paidAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      dueDate: new Date(2024, 10, 1), // November 1, 2024
      paymentMethod: "bank_transfer",
      transactionId: "TXN987654321",
      createdAt: new Date(),
    };
    this.payments.set(payment3.id, payment3);

    // Create sample complaints
    const complaint1: Complaint = {
      id: this.currentId++,
      tenantId: tenant1.id,
      title: "AC not working properly",
      description: "The air conditioning unit in room 101 is making strange noises and not cooling effectively. Please send maintenance to check.",
      priority: "high",
      status: "in_progress",
      category: "maintenance",
      resolvedAt: null,
      adminNotes: "Technician scheduled for tomorrow morning",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    };
    this.complaints.set(complaint1.id, complaint1);

    const complaint2: Complaint = {
      id: this.currentId++,
      tenantId: tenant2.id,
      title: "WiFi connectivity issues",
      description: "Internet connection is very slow and frequently disconnects in room 103. This is affecting my work from home.",
      priority: "medium",
      status: "open",
      category: "utilities",
      resolvedAt: null,
      adminNotes: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    };
    this.complaints.set(complaint2.id, complaint2);

    // Create sample announcements
    const announcement1: Announcement = {
      id: this.currentId++,
      title: "Monthly Maintenance Notice",
      content: "Dear residents, we will be conducting routine maintenance of the water pumps and electrical systems on December 15th from 10 AM to 2 PM. Please plan accordingly. Water supply will be restored by 3 PM.",
      priority: "high",
      targetAudience: "all",
      isActive: true,
      createdBy: adminUser.id,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    };
    this.announcements.set(announcement1.id, announcement1);

    const announcement2: Announcement = {
      id: this.currentId++,
      title: "Holiday Celebration",
      content: "Join us for a festive celebration in the common area on December 25th at 6 PM. Snacks and refreshments will be provided. Looking forward to celebrating together!",
      priority: "normal",
      targetAudience: "all",
      isActive: true,
      createdBy: adminUser.id,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    };
    this.announcements.set(announcement2.id, announcement2);

    const announcement3: Announcement = {
      id: this.currentId++,
      title: "New House Rules",
      content: "Please note the updated house rules: 1) Quiet hours are from 10 PM to 7 AM, 2) No smoking in rooms or common areas, 3) Visitors must register at reception. Thank you for your cooperation.",
      priority: "normal",
      targetAudience: "all",
      isActive: true,
      createdBy: adminUser.id,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    };
    this.announcements.set(announcement3.id, announcement3);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getRoomByNumber(number: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(room => room.number === number);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const room: Room = {
      ...insertRoom,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.rooms.set(room.id, room);
    return room;
  }

  async updateRoom(id: number, updates: Partial<InsertRoom>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  async getAllTenants(): Promise<TenantWithUserAndRoom[]> {
    const tenants = Array.from(this.tenants.values());
    return tenants.map(tenant => ({
      ...tenant,
      user: this.users.get(tenant.userId!)!,
      room: this.rooms.get(tenant.roomId!)!,
    })).filter(t => t.user && t.room);
  }

  async getTenant(id: number): Promise<TenantWithUserAndRoom | undefined> {
    const tenant = this.tenants.get(id);
    if (!tenant) return undefined;
    
    const user = this.users.get(tenant.userId!);
    const room = this.rooms.get(tenant.roomId!);
    
    if (!user || !room) return undefined;
    
    return { ...tenant, user, room };
  }

  async getTenantByUserId(userId: number): Promise<TenantWithUserAndRoom | undefined> {
    const tenant = Array.from(this.tenants.values()).find(t => t.userId === userId);
    if (!tenant) return undefined;
    
    const user = this.users.get(tenant.userId!);
    const room = this.rooms.get(tenant.roomId!);
    
    if (!user || !room) return undefined;
    
    return { ...tenant, user, room };
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const tenant: Tenant = {
      ...insertTenant,
      id: this.currentId++,
      joinDate: new Date(),
    };
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  async updateTenant(id: number, updates: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const tenant = this.tenants.get(id);
    if (!tenant) return undefined;
    
    const updatedTenant = { ...tenant, ...updates };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }

  async getAllPayments(): Promise<PaymentWithTenant[]> {
    const payments = Array.from(this.payments.values());
    return payments.map(payment => {
      const tenant = this.tenants.get(payment.tenantId!);
      const user = tenant ? this.users.get(tenant.userId!) : undefined;
      
      return {
        ...payment,
        tenant: tenant && user ? { ...tenant, user } : undefined as any,
      };
    }).filter(p => p.tenant);
  }

  async getPaymentsByTenant(tenantId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.tenantId === tenantId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      ...insertPayment,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...updates };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getAllComplaints(): Promise<ComplaintWithTenant[]> {
    const complaints = Array.from(this.complaints.values());
    return complaints.map(complaint => {
      const tenant = this.tenants.get(complaint.tenantId!);
      const user = tenant ? this.users.get(tenant.userId!) : undefined;
      
      return {
        ...complaint,
        tenant: tenant && user ? { ...tenant, user } : undefined as any,
      };
    }).filter(c => c.tenant);
  }

  async getComplaintsByTenant(tenantId: number): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(c => c.tenantId === tenantId);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const complaint: Complaint = {
      ...insertComplaint,
      id: this.currentId++,
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.complaints.set(complaint.id, complaint);
    return complaint;
  }

  async updateComplaint(id: number, updates: Partial<InsertComplaint>): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;
    
    const updatedComplaint = { ...complaint, ...updates };
    this.complaints.set(id, updatedComplaint);
    return updatedComplaint;
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).filter(a => a.isActive);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const announcement: Announcement = {
      ...insertAnnouncement,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.announcements.set(announcement.id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement = { ...announcement, ...updates };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }

  async getDashboardStats(): Promise<{
    totalRooms: number;
    activeTenants: number;
    monthlyRevenue: number;
    pendingComplaints: number;
  }> {
    const totalRooms = this.rooms.size;
    const activeTenants = Array.from(this.tenants.values()).filter(t => t.isActive).length;
    const monthlyRevenue = Array.from(this.rooms.values())
      .filter(r => r.status === "occupied")
      .reduce((sum, room) => sum + room.rent, 0);
    const pendingComplaints = Array.from(this.complaints.values())
      .filter(c => c.status === "open").length;

    return {
      totalRooms,
      activeTenants,
      monthlyRevenue,
      pendingComplaints,
    };
  }
}

export const storage = new MemStorage();
