// 模拟数据 - 按规格书3.2要求
const MockData = {
  currentUser: { id: 1, username: 'admin', name: '张明', role: '系统管理员', avatar: '张' },

  // 一、主数据管理
  // 1.1 用户管理
  users: [
    { id: 'U001', username: 'zhangming', name: '张明', role: '系统管理员', department: '信息部', phone: '13800138001', email: 'zhang@chint.com', status: '启用', createTime: '2024-01-01' },
    { id: 'U002', username: 'liwei', name: '李伟', role: '销售主管', department: '销售部', phone: '13800138002', email: 'li@chint.com', status: '启用', createTime: '2024-01-05' },
    { id: 'U003', username: 'wangfang', name: '王芳', role: '仓库管理员', department: '仓储部', phone: '13800138003', email: 'wang@chint.com', status: '启用', createTime: '2024-02-01' },
    { id: 'U004', username: 'zhaoqiang', name: '赵强', role: '计划员', department: 'PMC部', phone: '13800138004', email: 'zhao@chint.com', status: '禁用', createTime: '2024-03-01' }
  ],

  // 1.2 角色管理
  roles: [
    { id: 'R001', name: '系统管理员', code: 'admin', description: '拥有系统全部权限', permissions: ['用户管理', '角色管理', '规则管理', '全部数据'], userCount: 1, status: '启用' },
    { id: 'R002', name: '销售主管', code: 'sales_manager', description: '销售订单管理权限', permissions: ['订单录入', '订单审核', '交货单管理', '报表查看'], userCount: 3, status: '启用' },
    { id: 'R003', name: '仓库管理员', code: 'warehouse', description: '仓库及库存管理权限', permissions: ['仓库管理', '库存查看', '出入库操作'], userCount: 5, status: '启用' },
    { id: 'R004', name: '计划员', code: 'planner', description: 'S&OP计划管理权限', permissions: ['需求计划', '协调计划', '执行跟踪'], userCount: 2, status: '启用' }
  ],

  // 1.3 规则管理
  rules: [
    { id: 'RULE001', name: '订单自动审核规则', type: '业务规则', condition: '订单金额≤10000且客户等级=A', action: '自动审核通过', status: '启用', priority: 1 },
    { id: 'RULE002', name: '库存预警规则', type: '预警规则', condition: '库存数量<安全库存', action: '触发库存预警', status: '启用', priority: 1 },
    { id: 'RULE003', name: '交期预警规则', type: '预警规则', condition: '距离交期≤3天且未发货', action: '触发交期预警', status: '启用', priority: 2 },
    { id: 'RULE004', name: '订单拆分规则', type: '业务规则', condition: '多个收货地址', action: '自动拆分订单', status: '禁用', priority: 3 }
  ],

  // 2.1 仓库管理
  warehouses: [
    { id: 'WH001', code: 'WH-HZ-01', name: '杭州成品仓', type: '成品仓', address: '杭州市余杭区', manager: '王芳', phone: '0571-88888888', capacity: 10000, used: 6500, status: '正常' },
    { id: 'WH002', code: 'WH-HZ-02', name: '杭州原材料仓', type: '原材料仓', address: '杭州市余杭区', manager: '李明', phone: '0571-88888889', capacity: 15000, used: 12000, status: '正常' },
    { id: 'WH003', code: 'WH-SH-01', name: '上海分仓', type: '成品仓', address: '上海市浦东新区', manager: '张华', phone: '021-66666666', capacity: 5000, used: 3200, status: '正常' }
  ],

  // 2.2 货品管理
  products: [
    { id: 'P001', code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', category: '逆变器', unit: '台', spec: '50KW/三相', weight: 35, price: 12000, safetyStock: 50, status: '正常' },
    { id: 'P002', code: 'INV-5K-1P', name: '小功率逆变器5KW', category: '逆变器', unit: '台', spec: '5KW/单相', weight: 8, price: 3500, safetyStock: 100, status: '正常' },
    { id: 'P003', code: 'INV-3K-1P', name: '小功率逆变器3KW', category: '逆变器', unit: '台', spec: '3KW/单相', weight: 5, price: 2500, safetyStock: 150, status: '正常' },
    { id: 'P004', code: 'PCBA-TEST', name: 'PCBA测试板', category: '配件', unit: '片', spec: '标准', weight: 0.2, price: 180, safetyStock: 500, status: '正常' }
  ],

  // 2.3 服务商管理（供应商+承运商）
  serviceProviders: [
    { id: 'SP001', code: 'SUP-001', name: '深圳电子元器件有限公司', type: '供应商', category: '电子元器件', contact: '张经理', phone: '13800138001', rating: 'A', status: '合作中' },
    { id: 'SP002', code: 'SUP-002', name: '江苏线材科技有限公司', type: '供应商', category: '线材', contact: '李经理', phone: '13800138002', rating: 'A', status: '合作中' },
    { id: 'SP003', code: 'CAR-001', name: '顺丰速运', type: '承运商', category: '快递', contact: '王主管', phone: '95338', rating: 'A', status: '合作中' },
    { id: 'SP004', code: 'CAR-002', name: '德邦物流', type: '承运商', category: '物流', contact: '赵主管', phone: '95353', rating: 'B', status: '合作中' }
  ],

  // 2.4 客户管理
  customers: [
    { id: 'C001', code: 'CUST-001', name: '泰国分公司', type: '内部客户', level: 'A', contact: 'Mr.Smith', phone: '+66-123456', email: 'smith@thailand.com', address: 'Bangkok, Thailand', status: '正常' },
    { id: 'C002', code: 'CUST-002', name: '盛能杰ODM', type: 'ODM客户', level: 'A', contact: '陈总', phone: '13900139001', email: 'chen@snj.com', address: '深圳市南山区', status: '正常' },
    { id: 'C003', code: 'CUST-003', name: '华南区代理', type: '代理商', level: 'B', contact: '林经理', phone: '13900139002', email: 'lin@agent.com', address: '广州市天河区', status: '正常' }
  ],

  // 2.5 合同管理
  contracts: [
    { id: 'CON001', code: 'HT-2025-001', name: '泰国分公司年度采购合同', type: '销售合同', customer: '泰国分公司', amount: 5000000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' },
    { id: 'CON002', code: 'HT-2025-002', name: '盛能杰ODM合作协议', type: '销售合同', customer: '盛能杰ODM', amount: 3000000, startDate: '2025-01-01', endDate: '2025-06-30', status: '生效中' },
    { id: 'CON003', code: 'CG-2025-001', name: '顺丰年度物流服务合同', type: '服务合同', customer: '顺丰速运', amount: 500000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' }
  ],

  // 2.6 订单类型管理
  orderTypes: [
    { id: 'OT001', code: 'NORMAL', name: '标准订单', description: '常规销售订单', auditRule: '需审核', splitRule: '允许拆分', customers: ['全部'], status: '启用' },
    { id: 'OT002', code: 'URGENT', name: '紧急订单', description: '加急处理订单', auditRule: '快速审核', splitRule: '不允许拆分', customers: ['A级客户'], status: '启用' },
    { id: 'OT003', code: 'SAMPLE', name: '样品订单', description: '样品寄送订单', auditRule: '需审核', splitRule: '不允许拆分', customers: ['全部'], status: '启用' }
  ],

  // 2.7 收货人管理
  consignees: [
    { id: 'CS001', name: 'Mr.Smith', customer: '泰国分公司', phone: '+66-123456', address: 'Bangkok Factory, Thailand', isDefault: true, status: '正常' },
    { id: 'CS002', name: '陈经理', customer: '盛能杰ODM', phone: '13900139001', address: '深圳市南山区科技园', isDefault: true, status: '正常' },
    { id: 'CS003', name: '林经理', customer: '华南区代理', phone: '13900139002', address: '广州市天河区体育中心', isDefault: true, status: '正常' }
  ],

  // 二、销售管理 - 销售订单
  salesOrders: [
    { id: 'SO2025010001', orderType: '标准订单', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 100, price: 12000 }], totalAmount: 1200000, orderDate: '2025-01-06', deliveryDate: '2025-02-15', status: '已审核', auditUser: '李伟', auditTime: '2025-01-06 14:00' },
    { id: 'SO2025010002', orderType: '紧急订单', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-5K-1P', name: '小功率逆变器5KW', qty: 200, price: 3500 }], totalAmount: 700000, orderDate: '2025-01-05', deliveryDate: '2025-01-20', status: '待审核', auditUser: '', auditTime: '' },
    { id: 'SO2025010003', orderType: '标准订单', customer: '华南区代理', consignee: '林经理', products: [{ code: 'INV-3K-1P', name: '小功率逆变器3KW', qty: 500, price: 2500 }], totalAmount: 1250000, orderDate: '2025-01-04', deliveryDate: '2025-02-28', status: '已拆分', auditUser: '李伟', auditTime: '2025-01-04 16:00' },
    { id: 'SO2025010004', orderType: '标准订单', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'PCBA-TEST', name: 'PCBA测试板', qty: 1000, price: 180 }], totalAmount: 180000, orderDate: '2025-01-03', deliveryDate: '2025-01-25', status: '已发货', auditUser: '李伟', auditTime: '2025-01-03 10:00' },
    { id: 'SO2025010005', orderType: '标准订单', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 50, price: 12000 }], totalAmount: 600000, orderDate: '2025-01-02', deliveryDate: '2025-01-30', status: '已完成', auditUser: '李伟', auditTime: '2025-01-02 09:00' }
  ],

  // 三、交货单管理
  deliveryOrders: [
    { id: 'DO2025010001', salesOrderId: 'SO2025010004', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'PCBA-TEST', name: 'PCBA测试板', qty: 1000 }], carrier: '顺丰速运', trackingNo: 'SF1234567890', createTime: '2025-01-20', shipTime: '2025-01-21', status: '已签收' },
    { id: 'DO2025010002', salesOrderId: 'SO2025010005', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 50 }], carrier: '德邦物流', trackingNo: 'DB9876543210', createTime: '2025-01-25', shipTime: '2025-01-26', status: '已签收' },
    { id: 'DO2025010003', salesOrderId: 'SO2025010001', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 100 }], carrier: '', trackingNo: '', createTime: '2025-01-08', shipTime: '', status: '待发货' }
  ],

  // 四、S&OP计划
  sopDemands: [
    { id: 'DM202501', period: '2025年1月', product: 'INV-50K-3P', productName: 'PCBA逆变器50KW三相', orderQty: 150, forecastQty: 50, totalDemand: 200, stock: 80, gap: 120, priority: '高' },
    { id: 'DM202502', period: '2025年1月', product: 'INV-5K-1P', productName: '小功率逆变器5KW', orderQty: 200, forecastQty: 100, totalDemand: 300, stock: 150, gap: 150, priority: '高' },
    { id: 'DM202503', period: '2025年1月', product: 'INV-3K-1P', productName: '小功率逆变器3KW', orderQty: 500, forecastQty: 200, totalDemand: 700, stock: 400, gap: 300, priority: '中' }
  ],

  sopPlans: [
    { id: 'SP202501', version: 'V1.0', period: '2025年1月', createTime: '2025-01-05', status: '已确认', creator: '赵强', summary: '1月需求计划已与生产协调确认' }
  ],

  // 五、报表模板
  reportTemplates: [
    { id: 'RPT001', name: '销售订单月报', type: '订单报表', fields: ['订单号', '客户', '产品', '金额', '状态'], createUser: '张明', createTime: '2024-12-01', status: '启用' },
    { id: 'RPT002', name: '交货及时率报表', type: 'OT报表', fields: ['订单号', '客户', '计划交期', '实际交期', '是否及时'], createUser: '张明', createTime: '2024-12-01', status: '启用' },
    { id: 'RPT003', name: '客户订单汇总', type: '汇总报表', fields: ['客户', '订单数', '总金额', '完成率'], createUser: '李伟', createTime: '2024-12-15', status: '启用' }
  ],

  // 仪表盘统计
  dashboardStats: {
    todayOrders: 12, pendingAudit: 5, inDelivery: 8, completedMonth: 156,
    onTimeRate: 96.5, orderAmount: 5200000, demandGap: 570
  }
};

// 数据服务
const DataService = {
  getUsers: (f = {}) => MockData.users.filter(u => !f.status || u.status === f.status),
  getRoles: () => [...MockData.roles],
  getRules: () => [...MockData.rules],
  getWarehouses: () => [...MockData.warehouses],
  getProducts: () => [...MockData.products],
  getServiceProviders: (f = {}) => MockData.serviceProviders.filter(s => !f.type || s.type === f.type),
  getCustomers: () => [...MockData.customers],
  getContracts: () => [...MockData.contracts],
  getOrderTypes: () => [...MockData.orderTypes],
  getConsignees: () => [...MockData.consignees],
  getSalesOrders: (f = {}) => MockData.salesOrders.filter(o => !f.status || o.status === f.status),
  getSalesOrderById: (id) => MockData.salesOrders.find(o => o.id === id),
  getDeliveryOrders: (f = {}) => MockData.deliveryOrders.filter(d => !f.status || d.status === f.status),
  getSOPDemands: () => [...MockData.sopDemands],
  getSOPPlans: () => [...MockData.sopPlans],
  getReportTemplates: () => [...MockData.reportTemplates],
  getDashboardStats: () => ({ ...MockData.dashboardStats }),
  getCurrentUser: () => ({ ...MockData.currentUser }),

  addSalesOrder: (order) => {
    const newOrder = { ...order, id: 'SO' + Date.now(), status: '待审核', orderDate: new Date().toISOString().slice(0, 10) };
    MockData.salesOrders.unshift(newOrder);
    return newOrder;
  },
  updateSalesOrder: (id, data) => {
    const idx = MockData.salesOrders.findIndex(o => o.id === id);
    if (idx !== -1) { MockData.salesOrders[idx] = { ...MockData.salesOrders[idx], ...data }; return MockData.salesOrders[idx]; }
    return null;
  },
  deleteSalesOrder: (id) => {
    const idx = MockData.salesOrders.findIndex(o => o.id === id);
    if (idx !== -1) { MockData.salesOrders.splice(idx, 1); return true; }
    return false;
  },
  addDeliveryOrder: (order) => {
    const newOrder = { ...order, id: 'DO' + Date.now(), status: '待发货', createTime: new Date().toISOString().slice(0, 10) };
    MockData.deliveryOrders.unshift(newOrder);
    return newOrder;
  }
};

window.MockData = MockData;
window.DataService = DataService;
