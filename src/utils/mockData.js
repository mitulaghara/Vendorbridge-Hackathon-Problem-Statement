// src/utils/mockData.js

const INITIAL_USERS = [
  {
    email: "officer@vendorbridge.com",
    password: "officer123",
    name: "Mitul Aghara",
    role: "Procurement Officer",
    avatar: "💼"
  },
  {
    email: "manager@vendorbridge.com",
    password: "manager123",
    name: "Krisha Panchotiya",
    role: "Manager / Approver",
    avatar: "🛡️"
  },
  {
    email: "admin@vendorbridge.com",
    password: "admin123",
    name: "Yashvi Bhut",
    role: "Admin",
    avatar: "⚙️"
  },
  {
    email: "vendor1@vendorbridge.com",
    password: "vendor123",
    name: "Aarav Mehta",
    role: "Vendor",
    company: "Acme Industrial Services",
    category: "Services",
    gst: "27AAAAA1111A1Z1",
    phone: "+91 98765 43210",
    address: "102, Industrial Plaza, Andheri East, Mumbai",
    avatar: "🏭"
  },
  {
    email: "vendor2@vendorbridge.com",
    password: "vendor223",
    name: "Vikram Singh",
    role: "Vendor",
    company: "Zenith IT Solutions",
    category: "IT & Hardware",
    gst: "27BBBBB2222B2Z2",
    phone: "+91 99887 76655",
    address: "Block C, Tech Park, Sector 62, Noida",
    avatar: "💻"
  },
  {
    email: "vendor3@vendorbridge.com",
    password: "vendor323",
    name: "Priya Patel",
    role: "Vendor",
    company: "Apex Logistics",
    category: "Logistics",
    gst: "27CCCCC3333C3Z3",
    phone: "+91 91234 56789",
    address: "G-4, Freight Terminal, Mundra Port, Gujarat",
    avatar: "🚚"
  },
  {
    email: "vendor4@vendorbridge.com",
    password: "vendor423",
    name: "Amit Shah",
    role: "Vendor",
    company: "Global Office Supplies",
    category: "Office Supplies",
    gst: "27DDDDD4444D4Z4",
    phone: "+91 93456 78901",
    address: "12, Stationery Lane, Sadar Bazar, Delhi",
    avatar: "✏️"
  }
];

const INITIAL_VENDORS = [
  {
    id: "v-acme",
    name: "Acme Industrial Services",
    email: "vendor1@vendorbridge.com",
    category: "Services",
    gst: "27AAAAA1111A1Z1",
    phone: "+91 98765 43210",
    address: "102, Industrial Plaza, Andheri East, Mumbai",
    rating: 4.5,
    status: "Active",
    ordersCompleted: 24,
    successRate: 96,
    onTimeDelivery: 92,
  },
  {
    id: "v-zenith",
    name: "Zenith IT Solutions",
    email: "vendor2@vendorbridge.com",
    category: "IT & Hardware",
    gst: "27BBBBB2222B2Z2",
    phone: "+91 99887 76655",
    address: "Block C, Tech Park, Sector 62, Noida",
    rating: 4.9,
    status: "Active",
    ordersCompleted: 45,
    successRate: 98,
    onTimeDelivery: 97,
  },
  {
    id: "v-apex",
    name: "Apex Logistics",
    email: "vendor3@vendorbridge.com",
    category: "Logistics",
    gst: "27CCCCC3333C3Z3",
    phone: "+91 91234 56789",
    address: "G-4, Freight Terminal, Mundra Port, Gujarat",
    rating: 4.2,
    status: "Active",
    ordersCompleted: 18,
    successRate: 90,
    onTimeDelivery: 88,
  },
  {
    id: "v-global",
    name: "Global Office Supplies",
    email: "vendor4@vendorbridge.com",
    category: "Office Supplies",
    gst: "27DDDDD4444D4Z4",
    phone: "+91 93456 78901",
    address: "12, Stationery Lane, Sadar Bazar, Delhi",
    rating: 4.0,
    status: "Active",
    ordersCompleted: 32,
    successRate: 92,
    onTimeDelivery: 94,
  },
  {
    id: "v-nexus",
    name: "Nexus Construction Group",
    email: "nexus@vendorbridge.com",
    category: "Construction",
    gst: "27EEEEE5555E5Z5",
    phone: "+91 94567 89012",
    address: "Nexus Tower, MG Road, Bengaluru",
    rating: 3.8,
    status: "Pending Verification",
    ordersCompleted: 0,
    successRate: 0,
    onTimeDelivery: 0,
  }
];

const INITIAL_RFQS = [
  {
    id: "RFQ-2026-0001",
    title: "High-Performance Developer Laptops",
    category: "IT & Hardware",
    createdDate: "2026-05-15",
    deadline: "2026-06-10",
    description: "Procurement of development-grade hardware for the engineering team expansion.",
    items: [
      { id: 1, name: "Developer Laptops (32GB RAM, 1TB SSD, M3 Pro equivalent)", description: "High-end development laptop", quantity: 10, targetPrice: 150000 },
      { id: 2, name: "Ultra-wide Monitors 34\"", description: "IPS, 144Hz refresh rate, USB-C Power Delivery", quantity: 10, targetPrice: 35000 }
    ],
    assignedVendors: ["v-zenith", "v-global"],
    status: "Quotations Received",
    creator: "Rahul Sharma",
    attachments: [{ name: "hardware_specs_v1.pdf", size: "450 KB" }]
  },
  {
    id: "RFQ-2026-0002",
    title: "Annual Facility Catering Services",
    category: "Services",
    createdDate: "2026-05-20",
    deadline: "2026-06-25",
    description: "Provide lunch service for 150 employees on-site at Head Office cafeteria.",
    items: [
      { id: 1, name: "Buffet Lunch Meal Plan (Daily, Mon-Fri)", description: "3 main courses, healthy options included", quantity: 150, targetPrice: 120 }
    ],
    assignedVendors: ["v-acme"],
    status: "Sent to Vendors",
    creator: "Rahul Sharma",
    attachments: []
  },
  {
    id: "RFQ-2026-0003",
    title: "Warehouse Distribution Freight Logistics",
    category: "Logistics",
    createdDate: "2026-04-10",
    deadline: "2026-05-01",
    description: "Shipping warehouse stock from regional hub to 5 retail distribution centers.",
    items: [
      { id: 1, name: "FCL Container Shipping (Standard 20ft)", description: "Interstate distribution shipping", quantity: 12, targetPrice: 40000 }
    ],
    assignedVendors: ["v-apex"],
    status: "Invoiced",
    creator: "Rahul Sharma",
    attachments: [],
    poNumber: "PO-2026-0003",
    invoiceNumber: "INV-2026-0003",
    approvedQuoteId: "Q-2026-0003-APEX",
    approvedBy: "Sanjay Dutt",
    approvalRemarks: "Apex provided reasonable pricing and reliable logistics track record. Approved."
  }
];

const INITIAL_QUOTATIONS = [
  {
    id: "Q-2026-0001-ZENITH",
    rfqId: "RFQ-2026-0001",
    vendorId: "v-zenith",
    vendorName: "Zenith IT Solutions",
    submittedDate: "2026-05-28",
    items: [
      { itemId: 1, price: 142000, comment: "Spec upgrade: 32GB LPDDR5 RAM" },
      { itemId: 2, price: 32000, comment: "Dell UltraSharp 34" }
    ],
    deliveryDays: 5,
    notes: "Full 3-year onsite hardware replacement warranty and next-business-day support included.",
    status: "Submitted",
    rating: 4.9
  },
  {
    id: "Q-2026-0001-GLOBAL",
    rfqId: "RFQ-2026-0001",
    vendorId: "v-global",
    vendorName: "Global Office Supplies",
    submittedDate: "2026-05-30",
    items: [
      { itemId: 1, price: 148000, comment: "32GB RAM version. Extended delivery on batch 2" },
      { itemId: 2, price: 29500, comment: "LG Curved UltraWide 34WP" }
    ],
    deliveryDays: 10,
    notes: "Subject to stock availability. Standard manufacturer warranty of 1 year.",
    status: "Submitted",
    rating: 4.0
  },
  {
    id: "Q-2026-0003-APEX",
    rfqId: "RFQ-2026-0003",
    vendorId: "v-apex",
    vendorName: "Apex Logistics",
    submittedDate: "2026-04-20",
    items: [
      { itemId: 1, price: 38500, comment: "All insurance and handling costs included in rate" }
    ],
    deliveryDays: 3,
    notes: "Fully insured transit with live GPS dashboard tracking access.",
    status: "Approved",
    rating: 4.2
  }
];

const INITIAL_LOGS = [
  { id: 1, timestamp: "2026-04-10T10:00:00Z", user: "Rahul Sharma", role: "Procurement Officer", action: "RFQ Created", details: "Created RFQ-2026-0003 'Warehouse Distribution Freight Logistics'" },
  { id: 2, timestamp: "2026-04-20T14:30:00Z", user: "Priya Patel", role: "Vendor", action: "Quotation Submitted", details: "Submitted Quotation Q-2026-0003-APEX for RFQ-2026-0003 ($462,000 total)" },
  { id: 3, timestamp: "2026-04-25T11:15:00Z", user: "Rahul Sharma", role: "Procurement Officer", action: "Sent for Approval", details: "Submitted RFQ-2026-0003 quotation from Apex Logistics for management approval" },
  { id: 4, timestamp: "2026-04-26T09:20:00Z", user: "Sanjay Dutt", role: "Manager / Approver", action: "Quotation Approved", details: "Approved Quotation Q-2026-0003-APEX for RFQ-2026-0003. Remarks: Approved." },
  { id: 5, timestamp: "2026-04-26T16:45:00Z", user: "Rahul Sharma", role: "Procurement Officer", action: "PO Generated", details: "Generated Purchase Order PO-2026-0003 for Apex Logistics ($462,000 total)" },
  { id: 6, timestamp: "2026-04-28T10:05:00Z", user: "Rahul Sharma", role: "Procurement Officer", action: "Invoice Generated", details: "Generated Invoice INV-2026-0003 from PO-2026-0003" },
  { id: 7, timestamp: "2026-05-15T09:00:00Z", user: "Rahul Sharma", role: "Procurement Officer", action: "RFQ Created", details: "Created RFQ-2026-0001 'High-Performance Developer Laptops'" },
  { id: 8, timestamp: "2026-05-20T11:00:00Z", user: "Rahul Sharma", role: "Procurement Officer", action: "RFQ Created", details: "Created RFQ-2026-0002 'Annual Facility Catering Services'" },
  { id: 9, timestamp: "2026-05-28T16:22:00Z", user: "Vikram Singh", role: "Vendor", action: "Quotation Submitted", details: "Submitted Quotation Q-2026-0001-ZENITH for RFQ-2026-0001" },
  { id: 10, timestamp: "2026-05-30T10:11:00Z", user: "Amit Shah", role: "Vendor", action: "Quotation Submitted", details: "Submitted Quotation Q-2026-0001-GLOBAL for RFQ-2026-0001" }
];

export const getStoredData = (key, initial) => {
  const data = localStorage.getItem(`vendorbridge_${key}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error parsing localStorage key: ${key}`, e);
    }
  }
  localStorage.setItem(`vendorbridge_${key}`, JSON.stringify(initial));
  return initial;
};

export const setStoredData = (key, data) => {
  localStorage.setItem(`vendorbridge_${key}`, JSON.stringify(data));
};

export const initializeDatabase = (force = false) => {
  if (force || !localStorage.getItem("vendorbridge_users")) {
    localStorage.setItem("vendorbridge_users", JSON.stringify(INITIAL_USERS));
    localStorage.setItem("vendorbridge_vendors", JSON.stringify(INITIAL_VENDORS));
    localStorage.setItem("vendorbridge_rfqs", JSON.stringify(INITIAL_RFQS));
    localStorage.setItem("vendorbridge_quotations", JSON.stringify(INITIAL_QUOTATIONS));
    localStorage.setItem("vendorbridge_logs", JSON.stringify(INITIAL_LOGS));
  }
};

// Global DB manager functions
export const db = {
  getUsers: () => getStoredData("users", INITIAL_USERS),
  setUsers: (users) => setStoredData("users", users),
  
  getVendors: () => getStoredData("vendors", INITIAL_VENDORS),
  setVendors: (vendors) => setStoredData("vendors", vendors),
  
  getRFQs: () => getStoredData("rfqs", INITIAL_RFQS),
  setRFQs: (rfqs) => setStoredData("rfqs", rfqs),
  
  getQuotations: () => getStoredData("quotations", INITIAL_QUOTATIONS),
  setQuotations: (quotes) => setStoredData("quotations", quotes),
  
  getLogs: () => getStoredData("logs", INITIAL_LOGS),
  setLogs: (logs) => setStoredData("logs", logs),

  addLog: (user, role, action, details) => {
    const logs = getStoredData("logs", INITIAL_LOGS);
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user,
      role,
      action,
      details
    };
    const updated = [newLog, ...logs];
    setStoredData("logs", updated);
    return updated;
  },

  resetAll: () => {
    initializeDatabase(true);
    return {
      users: INITIAL_USERS,
      vendors: INITIAL_VENDORS,
      rfqs: INITIAL_RFQS,
      quotations: INITIAL_QUOTATIONS,
      logs: INITIAL_LOGS
    };
  }
};

// Run on import to guarantee layout
initializeDatabase();
