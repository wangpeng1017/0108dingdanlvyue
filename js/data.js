// 模拟数据 - 基于正泰表单资料
const MockData = {
  // 当前登录用户
  currentUser: {
    id: 1,
    username: 'admin',
    name: '张明',
    role: '系统管理员',
    avatar: '张'
  },

  // 订单列表数据
  orders: [
    {
      id: 'SO20250108001',
      customerId: 'C001',
      customerName: '泰国分公司',
      productName: 'PCBA逆变器 Three Phase 50KW/60M',
      productModel: '5443473',
      quantity: 100,
      orderDate: '2025-01-06',
      deliveryDate: '2025-02-15',
      status: '生产中',
      progress: 45,
      priority: '高'
    },
    {
      id: 'SO20250108002',
      customerId: 'C002',
      customerName: '盛能杰ODM',
      productName: 'PCBA逆变器 5KW',
      productModel: '5443474',
      quantity: 200,
      orderDate: '2025-01-05',
      deliveryDate: '2025-02-20',
      status: '待排产',
      progress: 10,
      priority: '中'
    },
    {
      id: 'SO20250108003',
      customerId: 'C003',
      customerName: '安能物流',
      productName: '小功率逆变器 3KW',
      productModel: '5443475',
      quantity: 500,
      orderDate: '2025-01-04',
      deliveryDate: '2025-02-28',
      status: '待确认',
      progress: 0,
      priority: '低'
    },
    {
      id: 'SO20250107001',
      customerId: 'C004',
      customerName: '华南区代理',
      productName: 'PCBA测试板',
      productModel: '8107020428',
      quantity: 150,
      orderDate: '2025-01-03',
      deliveryDate: '2025-01-25',
      status: '已发货',
      progress: 100,
      priority: '高'
    },
    {
      id: 'SO20250106001',
      customerId: 'C005',
      customerName: '西北区客户',
      productName: '贴片电阻',
      productModel: '81070300029',
      quantity: 10000,
      orderDate: '2025-01-02',
      deliveryDate: '2025-01-20',
      status: '已完成',
      progress: 100,
      priority: '中'
    }
  ],

  // 生产计划数据
  productionPlans: [
    {
      id: 'PP20250401',
      productName: 'PCBA逆变器 Three Phase 50KW/60M',
      productModel: '5443473',
      planQuantity: 100,
      completedQuantity: 45,
      startDate: '2025-01-10',
      endDate: '2025-02-10',
      responsible: '李工',
      status: '进行中',
      line: 'A线'
    },
    {
      id: 'PP20250402',
      productName: 'PCBA测试板',
      productModel: '8107020428',
      planQuantity: 200,
      completedQuantity: 200,
      startDate: '2025-01-05',
      endDate: '2025-01-20',
      responsible: '王工',
      status: '已完成',
      line: 'B线'
    },
    {
      id: 'PP20250403',
      productName: '小功率逆变器 3KW',
      productModel: '5443475',
      planQuantity: 500,
      completedQuantity: 0,
      startDate: '2025-01-15',
      endDate: '2025-02-25',
      responsible: '张工',
      status: '未开始',
      line: 'C线'
    }
  ],

  // 生产工单数据 - 基于仓库备料交接单
  workOrders: [
    {
      id: 'WO20250108001',
      orderId: 'SO20250108001',
      productName: 'PCBA逆变器 Three Phase 50KW/60M',
      productModel: '5443473',
      quantity: 100,
      createDate: '2025-01-08',
      status: '生产中',
      materials: [
        { code: '6.0302.209.00', name: '单相桥接线材MWBC01AMWVC9815', required: 38, issued: 38 },
        { code: '6.0302.207.80', name: '交流接线材MWAC 10A15mm', required: 31, issued: 31 },
        { code: '6.0302.201.04D', name: 'DC接线材', required: 47, issued: 45 }
      ]
    },
    {
      id: 'WO20250107001',
      orderId: 'SO20250107001',
      productName: 'PCBA测试板',
      productModel: '8107020428',
      quantity: 150,
      createDate: '2025-01-07',
      status: '已完工',
      materials: [
        { code: '8107030043', name: '贴片电阻', required: 5000, issued: 5000 },
        { code: '8107030029', name: '贴片电阻', required: 10000, issued: 10000 }
      ]
    }
  ],

  // 送检单数据 - 基于仓库送检单
  inspectionOrders: [
    {
      id: 'S001284',
      productName: '贴片电阻',
      materialCode: '8107020428',
      sendQty: 10000,
      inspectQty: 10015.5,
      sendDate: '2025-03-20',
      status: '已合格',
      inspector: '王为',
      sender: '姜玉萍',
      result: '合格'
    },
    {
      id: 'S001285',
      productName: '贴片电阻',
      materialCode: '81070300029',
      sendQty: 5000,
      inspectQty: 5000,
      sendDate: '2025-03-19',
      status: '待检验',
      inspector: '',
      sender: '姜玉萍',
      result: ''
    },
    {
      id: 'S001286',
      productName: '贴片电容',
      materialCode: '845100693p2',
      sendQty: 25000,
      inspectQty: 25000,
      sendDate: '2025-03-18',
      status: '检验中',
      inspector: '王为',
      sender: '张三',
      result: ''
    },
    {
      id: 'S001287',
      productName: '贴片电阻',
      materialCode: '45110693',
      sendQty: 30000,
      inspectQty: 0,
      sendDate: '2025-03-15',
      status: '不合格',
      inspector: '王为',
      sender: '李四',
      result: '不合格'
    }
  ],

  // 领料单数据 - 基于领料单
  materialRequests: [
    {
      id: 'T0001802',
      orderId: 'SO20250108001',
      productName: 'PCBA 12610N',
      materialCode: '103310c',
      spec: 'PCS',
      requestQty: 1,
      actualQty: 1,
      type: '生产耗材',
      applicant: '姜玉萍',
      reviewer: '宋刘',
      warehouse: '龙毅',
      status: '已领取',
      createDate: '2025-03-10'
    },
    {
      id: 'T0001803',
      orderId: 'SO20250108002',
      productName: 'PCBA 测试板',
      materialCode: '104520c',
      spec: 'PCS',
      requestQty: 5,
      actualQty: 5,
      type: '原料',
      applicant: '张明',
      reviewer: '李工',
      warehouse: '王仓管',
      status: '待审核',
      createDate: '2025-03-09'
    },
    {
      id: 'T0001804',
      orderId: 'SO20250108003',
      productName: '逆变器组件',
      materialCode: '205630d',
      spec: 'SET',
      requestQty: 10,
      actualQty: 0,
      type: '材料',
      applicant: '李四',
      reviewer: '',
      warehouse: '',
      status: '待领取',
      createDate: '2025-03-08'
    }
  ],

  // 库存数据
  inventory: [
    {
      materialCode: '8107020428',
      materialName: '贴片电阻 10K',
      spec: '0603',
      unit: 'PCS',
      currentStock: 45200,
      safetyStock: 10000,
      location: 'A-01-01',
      lastUpdate: '2025-01-08'
    },
    {
      materialCode: '81070300029',
      materialName: '贴片电阻 4.7K',
      spec: '0402',
      unit: 'PCS',
      currentStock: 32000,
      safetyStock: 8000,
      location: 'A-01-02',
      lastUpdate: '2025-01-07'
    },
    {
      materialCode: '845100693p2',
      materialName: '贴片电容 100nF',
      spec: '0603',
      unit: 'PCS',
      currentStock: 5000,
      safetyStock: 15000,
      location: 'A-02-01',
      lastUpdate: '2025-01-06',
      warning: true
    },
    {
      materialCode: '6.0302.209.00',
      materialName: '单相桥接线材MWBC01A',
      spec: 'MWVC9815',
      unit: 'PCS',
      currentStock: 1200,
      safetyStock: 500,
      location: 'B-01-01',
      lastUpdate: '2025-01-08'
    }
  ],

  // 采购订单数据
  purchaseOrders: [
    {
      id: 'PO20250108001',
      supplier: '深圳电子元器件有限公司',
      materialCode: '845100693p2',
      materialName: '贴片电容 100nF',
      quantity: 50000,
      unitPrice: 0.02,
      amount: 1000,
      orderDate: '2025-01-06',
      deliveryDate: '2025-01-20',
      status: '已确认',
      arrivedQty: 0
    },
    {
      id: 'PO20250108002',
      supplier: '江苏线材科技有限公司',
      materialCode: '6.0302.209.00',
      materialName: '单相桥接线材',
      quantity: 2000,
      unitPrice: 5.50,
      amount: 11000,
      orderDate: '2025-01-05',
      deliveryDate: '2025-01-18',
      status: '运输中',
      arrivedQty: 0
    },
    {
      id: 'PO20250107001',
      supplier: '广州电阻厂',
      materialCode: '8107020428',
      materialName: '贴片电阻 10K',
      quantity: 100000,
      unitPrice: 0.008,
      amount: 800,
      orderDate: '2025-01-03',
      deliveryDate: '2025-01-10',
      status: '已到货',
      arrivedQty: 100000
    }
  ],

  // 供应商数据
  suppliers: [
    {
      id: 'SUP001',
      name: '深圳电子元器件有限公司',
      contact: '张经理',
      phone: '13800138001',
      email: 'zhang@example.com',
      address: '深圳市宝安区',
      category: '电容',
      rating: 'A',
      status: '合作中'
    },
    {
      id: 'SUP002',
      name: '江苏线材科技有限公司',
      contact: '李经理',
      phone: '13800138002',
      email: 'li@example.com',
      address: '江苏省苏州市',
      category: '线材',
      rating: 'A',
      status: '合作中'
    },
    {
      id: 'SUP003',
      name: '广州电阻厂',
      contact: '王经理',
      phone: '13800138003',
      email: 'wang@example.com',
      address: '广州市番禺区',
      category: '电阻',
      rating: 'B',
      status: '合作中'
    }
  ],

  // 质量检验数据 (IQC)
  iqcRecords: [
    {
      id: 'IQC20250108001',
      poId: 'PO20250107001',
      materialCode: '8107020428',
      materialName: '贴片电阻 10K',
      supplier: '广州电阻厂',
      inspectQty: 100000,
      sampleQty: 200,
      passQty: 198,
      failQty: 2,
      passRate: 99.0,
      inspector: '刘质检',
      inspectDate: '2025-01-10',
      result: '合格',
      remark: '轻微外观缺陷2件，可接收'
    },
    {
      id: 'IQC20250107001',
      poId: 'PO20250105001',
      materialCode: '845100693',
      materialName: '贴片电容 100nF',
      supplier: '深圳电子元器件有限公司',
      inspectQty: 30000,
      sampleQty: 100,
      passQty: 100,
      failQty: 0,
      passRate: 100,
      inspector: '张质检',
      inspectDate: '2025-01-07',
      result: '合格',
      remark: ''
    }
  ],

  // 交付跟踪数据
  deliveryTracking: [
    {
      orderId: 'SO20250107001',
      customerName: '华南区代理',
      productName: 'PCBA测试板',
      quantity: 150,
      deliveryDate: '2025-01-25',
      shipDate: '2025-01-23',
      logistics: '顺丰快递',
      trackingNo: 'SF1234567890',
      status: '已签收',
      signDate: '2025-01-25'
    },
    {
      orderId: 'SO20250108001',
      customerName: '泰国分公司',
      productName: 'PCBA逆变器',
      quantity: 100,
      deliveryDate: '2025-02-15',
      shipDate: '',
      logistics: '',
      trackingNo: '',
      status: '生产中',
      signDate: ''
    }
  ],

  // 仪表盘统计数据
  dashboardStats: {
    todayOrders: 12,
    todayOrdersChange: 20,
    pendingOrders: 8,
    pendingOrdersChange: -5,
    inProduction: 15,
    inProductionChange: 10,
    monthlyDelivery: 156,
    monthlyDeliveryChange: 15,
    deliveryRate: 96.5,
    qualityRate: 99.2
  }
};

// 数据操作方法
const DataService = {
  // 获取订单列表
  getOrders(filters = {}) {
    let result = [...MockData.orders];
    if (filters.status) {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(kw) || 
        o.customerName.toLowerCase().includes(kw) ||
        o.productName.toLowerCase().includes(kw)
      );
    }
    return result;
  },

  // 获取订单详情
  getOrderById(id) {
    return MockData.orders.find(o => o.id === id);
  },

  // 添加订单
  addOrder(order) {
    const newOrder = {
      ...order,
      id: 'SO' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(MockData.orders.length + 1).padStart(3, '0'),
      status: '待确认',
      progress: 0
    };
    MockData.orders.unshift(newOrder);
    return newOrder;
  },

  // 更新订单
  updateOrder(id, data) {
    const index = MockData.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      MockData.orders[index] = { ...MockData.orders[index], ...data };
      return MockData.orders[index];
    }
    return null;
  },

  // 删除订单
  deleteOrder(id) {
    const index = MockData.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      MockData.orders.splice(index, 1);
      return true;
    }
    return false;
  },

  // 获取生产计划
  getProductionPlans(filters = {}) {
    let result = [...MockData.productionPlans];
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    return result;
  },

  // 获取工单列表
  getWorkOrders(filters = {}) {
    let result = [...MockData.workOrders];
    if (filters.status) {
      result = result.filter(w => w.status === filters.status);
    }
    return result;
  },

  // 获取送检单
  getInspectionOrders(filters = {}) {
    let result = [...MockData.inspectionOrders];
    if (filters.status) {
      result = result.filter(i => i.status === filters.status);
    }
    return result;
  },

  // 获取领料单
  getMaterialRequests(filters = {}) {
    let result = [...MockData.materialRequests];
    if (filters.status) {
      result = result.filter(m => m.status === filters.status);
    }
    return result;
  },

  // 获取库存
  getInventory(filters = {}) {
    let result = [...MockData.inventory];
    if (filters.warning) {
      result = result.filter(i => i.currentStock < i.safetyStock);
    }
    return result;
  },

  // 获取采购订单
  getPurchaseOrders(filters = {}) {
    let result = [...MockData.purchaseOrders];
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    return result;
  },

  // 获取供应商
  getSuppliers() {
    return [...MockData.suppliers];
  },

  // 获取IQC记录
  getIQCRecords(filters = {}) {
    let result = [...MockData.iqcRecords];
    if (filters.result) {
      result = result.filter(i => i.result === filters.result);
    }
    return result;
  },

  // 获取交付跟踪
  getDeliveryTracking() {
    return [...MockData.deliveryTracking];
  },

  // 获取仪表盘数据
  getDashboardStats() {
    return { ...MockData.dashboardStats };
  },

  // 获取当前用户
  getCurrentUser() {
    return { ...MockData.currentUser };
  }
};

// 导出
window.MockData = MockData;
window.DataService = DataService;
