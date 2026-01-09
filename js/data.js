// 模拟数据 - 按规格书3.2要求 (每类数据10条以上)
const MockData = {
  currentUser: { id: 1, username: 'admin', name: '张明', role: '系统管理员', avatar: '张' },

  // 一、主数据管理
  // 1.1 用户管理 (12条)
  users: [
    { id: 'U001', username: 'zhangming', name: '张明', role: '系统管理员', department: '信息部', phone: '13800138001', email: 'zhang@chint.com', status: '启用', createTime: '2024-01-01' },
    { id: 'U002', username: 'liwei', name: '李伟', role: '销售主管', department: '销售部', phone: '13800138002', email: 'li@chint.com', status: '启用', createTime: '2024-01-05' },
    { id: 'U003', username: 'wangfang', name: '王芳', role: '仓库管理员', department: '仓储部', phone: '13800138003', email: 'wang@chint.com', status: '启用', createTime: '2024-02-01' },
    { id: 'U004', username: 'zhaoqiang', name: '赵强', role: '计划员', department: 'PMC部', phone: '13800138004', email: 'zhao@chint.com', status: '禁用', createTime: '2024-03-01' },
    { id: 'U005', username: 'chenhong', name: '陈红', role: '销售专员', department: '销售部', phone: '13800138005', email: 'chen@chint.com', status: '启用', createTime: '2024-03-15' },
    { id: 'U006', username: 'liujun', name: '刘军', role: '采购主管', department: '采购部', phone: '13800138006', email: 'liu@chint.com', status: '启用', createTime: '2024-04-01' },
    { id: 'U007', username: 'yangmei', name: '杨梅', role: '质量主管', department: '品质部', phone: '13800138007', email: 'yang@chint.com', status: '启用', createTime: '2024-04-15' },
    { id: 'U008', username: 'huangbo', name: '黄波', role: '生产主管', department: '生产部', phone: '13800138008', email: 'huang@chint.com', status: '启用', createTime: '2024-05-01' },
    { id: 'U009', username: 'zhouli', name: '周丽', role: '财务主管', department: '财务部', phone: '13800138009', email: 'zhou@chint.com', status: '启用', createTime: '2024-05-15' },
    { id: 'U010', username: 'wugang', name: '吴刚', role: '物流专员', department: '物流部', phone: '13800138010', email: 'wu@chint.com', status: '启用', createTime: '2024-06-01' },
    { id: 'U011', username: 'sunying', name: '孙颖', role: '客服专员', department: '客服部', phone: '13800138011', email: 'sun@chint.com', status: '启用', createTime: '2024-06-15' },
    { id: 'U012', username: 'maxin', name: '马欣', role: '技术支持', department: '技术部', phone: '13800138012', email: 'ma@chint.com', status: '禁用', createTime: '2024-07-01' }
  ],

  // 1.2 角色管理 (10条)
  roles: [
    { id: 'R001', name: '系统管理员', code: 'admin', description: '拥有系统全部权限', permissions: ['用户管理', '角色管理', '规则管理', '全部数据'], userCount: 1, status: '启用' },
    { id: 'R002', name: '销售主管', code: 'sales_manager', description: '销售订单管理权限', permissions: ['订单录入', '订单审核', '交货单管理', '报表查看'], userCount: 3, status: '启用' },
    { id: 'R003', name: '仓库管理员', code: 'warehouse', description: '仓库及库存管理权限', permissions: ['仓库管理', '库存查看', '出入库操作'], userCount: 5, status: '启用' },
    { id: 'R004', name: '计划员', code: 'planner', description: 'S&OP计划管理权限', permissions: ['需求计划', '协调计划', '执行跟踪'], userCount: 2, status: '启用' },
    { id: 'R005', name: '销售专员', code: 'sales_rep', description: '销售录入权限', permissions: ['订单录入', '客户查看'], userCount: 8, status: '启用' },
    { id: 'R006', name: '采购主管', code: 'purchase_manager', description: '采购管理权限', permissions: ['采购订单', '供应商管理'], userCount: 2, status: '启用' },
    { id: 'R007', name: '质量主管', code: 'quality_manager', description: '质量管理权限', permissions: ['来料检验', '质量报表'], userCount: 3, status: '启用' },
    { id: 'R008', name: '生产主管', code: 'production_manager', description: '生产管理权限', permissions: ['生产计划', '工单管理'], userCount: 4, status: '启用' },
    { id: 'R009', name: '财务人员', code: 'finance', description: '财务查看权限', permissions: ['报表查看', '金额统计'], userCount: 3, status: '启用' },
    { id: 'R010', name: '访客', code: 'guest', description: '只读权限', permissions: ['数据查看'], userCount: 0, status: '禁用' }
  ],

  // 1.3 规则管理 (12条)
  rules: [
    { id: 'RULE001', name: '订单自动审核规则', type: '业务规则', condition: '订单金额≤10000且客户等级=A', action: '自动审核通过', status: '启用', priority: 1 },
    { id: 'RULE002', name: '库存预警规则', type: '预警规则', condition: '库存数量<安全库存', action: '触发库存预警', status: '启用', priority: 1 },
    { id: 'RULE003', name: '交期预警规则', type: '预警规则', condition: '距离交期≤3天且未发货', action: '触发交期预警', status: '启用', priority: 2 },
    { id: 'RULE004', name: '订单拆分规则', type: '业务规则', condition: '多个收货地址', action: '自动拆分订单', status: '禁用', priority: 3 },
    { id: 'RULE005', name: '大额订单审核', type: '业务规则', condition: '订单金额≥100万', action: '需总经理审批', status: '启用', priority: 1 },
    { id: 'RULE006', name: '紧急订单处理', type: '业务规则', condition: '订单类型=紧急', action: '优先排产', status: '启用', priority: 1 },
    { id: 'RULE007', name: '新客户审核', type: '业务规则', condition: '客户首次下单', action: '需信用审核', status: '启用', priority: 2 },
    { id: 'RULE008', name: '生产延期预警', type: '预警规则', condition: '实际进度<计划进度20%', action: '触发生产预警', status: '启用', priority: 1 },
    { id: 'RULE009', name: '物料短缺预警', type: '预警规则', condition: '物料需求>可用库存', action: '触发采购预警', status: '启用', priority: 1 },
    { id: 'RULE010', name: '质量不合格处理', type: '业务规则', condition: 'IQC合格率<95%', action: '启动供应商整改', status: '启用', priority: 2 },
    { id: 'RULE011', name: '自动发货通知', type: '业务规则', condition: '交货单发货', action: '发送短信通知', status: '启用', priority: 3 },
    { id: 'RULE012', name: '超期订单提醒', type: '预警规则', condition: '订单超期未完成', action: '每日提醒负责人', status: '启用', priority: 2 }
  ],

  // 2.1 仓库管理 (10条)
  warehouses: [
    { id: 'WH001', code: 'WH-HZ-01', name: '杭州成品仓', type: '成品仓', address: '杭州市余杭区', manager: '王芳', phone: '0571-88888888', capacity: 10000, used: 6500, status: '正常' },
    { id: 'WH002', code: 'WH-HZ-02', name: '杭州原材料仓', type: '原材料仓', address: '杭州市余杭区', manager: '李明', phone: '0571-88888889', capacity: 15000, used: 12000, status: '正常' },
    { id: 'WH003', code: 'WH-SH-01', name: '上海分仓', type: '成品仓', address: '上海市浦东新区', manager: '张华', phone: '021-66666666', capacity: 5000, used: 3200, status: '正常' },
    { id: 'WH004', code: 'WH-SZ-01', name: '深圳分仓', type: '成品仓', address: '深圳市南山区', manager: '陈伟', phone: '0755-77777777', capacity: 8000, used: 5500, status: '正常' },
    { id: 'WH005', code: 'WH-HZ-03', name: '杭州半成品仓', type: '半成品仓', address: '杭州市余杭区', manager: '刘芳', phone: '0571-88888890', capacity: 6000, used: 4200, status: '正常' },
    { id: 'WH006', code: 'WH-BJ-01', name: '北京分仓', type: '成品仓', address: '北京市朝阳区', manager: '赵磊', phone: '010-55555555', capacity: 4000, used: 2800, status: '正常' },
    { id: 'WH007', code: 'WH-GZ-01', name: '广州分仓', type: '成品仓', address: '广州市天河区', manager: '黄明', phone: '020-44444444', capacity: 6000, used: 4100, status: '正常' },
    { id: 'WH008', code: 'WH-CD-01', name: '成都分仓', type: '成品仓', address: '成都市高新区', manager: '周强', phone: '028-33333333', capacity: 3000, used: 1800, status: '正常' },
    { id: 'WH009', code: 'WH-HZ-04', name: '杭州不良品仓', type: '不良品仓', address: '杭州市余杭区', manager: '孙丽', phone: '0571-88888891', capacity: 1000, used: 350, status: '正常' },
    { id: 'WH010', code: 'WH-WH-01', name: '武汉分仓', type: '成品仓', address: '武汉市洪山区', manager: '马龙', phone: '027-22222222', capacity: 4500, used: 2900, status: '停用' }
  ],

  // 2.2 货品管理 (15条)
  products: [
    { id: 'P001', code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', category: '逆变器', unit: '台', spec: '50KW/三相', weight: 35, price: 12000, safetyStock: 50, status: '正常' },
    { id: 'P002', code: 'INV-5K-1P', name: '小功率逆变器5KW', category: '逆变器', unit: '台', spec: '5KW/单相', weight: 8, price: 3500, safetyStock: 100, status: '正常' },
    { id: 'P003', code: 'INV-3K-1P', name: '小功率逆变器3KW', category: '逆变器', unit: '台', spec: '3KW/单相', weight: 5, price: 2500, safetyStock: 150, status: '正常' },
    { id: 'P004', code: 'PCBA-TEST', name: 'PCBA测试板', category: '配件', unit: '片', spec: '标准', weight: 0.2, price: 180, safetyStock: 500, status: '正常' },
    { id: 'P005', code: 'INV-100K-3P', name: 'PCBA逆变器100KW三相', category: '逆变器', unit: '台', spec: '100KW/三相', weight: 65, price: 22000, safetyStock: 30, status: '正常' },
    { id: 'P006', code: 'INV-10K-1P', name: '中功率逆变器10KW', category: '逆变器', unit: '台', spec: '10KW/单相', weight: 15, price: 5800, safetyStock: 80, status: '正常' },
    { id: 'P007', code: 'INV-20K-3P', name: '中功率逆变器20KW三相', category: '逆变器', unit: '台', spec: '20KW/三相', weight: 22, price: 7500, safetyStock: 60, status: '正常' },
    { id: 'P008', code: 'MOD-CTRL', name: '控制模块', category: '配件', unit: '个', spec: 'V2.0', weight: 0.5, price: 450, safetyStock: 200, status: '正常' },
    { id: 'P009', code: 'CAP-1000UF', name: '电解电容1000uF', category: '元器件', unit: '个', spec: '1000uF/450V', weight: 0.08, price: 15, safetyStock: 5000, status: '正常' },
    { id: 'P010', code: 'RES-SMD', name: '贴片电阻套件', category: '元器件', unit: '套', spec: '0603/1%', weight: 0.01, price: 25, safetyStock: 3000, status: '正常' },
    { id: 'P011', code: 'CABLE-DC', name: 'DC连接线缆', category: '配件', unit: '条', spec: '4mm²/3m', weight: 0.3, price: 35, safetyStock: 1000, status: '正常' },
    { id: 'P012', code: 'FAN-COOL', name: '散热风扇', category: '配件', unit: '个', spec: '120mm', weight: 0.15, price: 28, safetyStock: 800, status: '正常' },
    { id: 'P013', code: 'CASE-50K', name: '50KW机箱外壳', category: '结构件', unit: '套', spec: '标准', weight: 12, price: 580, safetyStock: 100, status: '正常' },
    { id: 'P014', code: 'DISP-LCD', name: '液晶显示屏', category: '配件', unit: '块', spec: '4.3寸', weight: 0.12, price: 120, safetyStock: 300, status: '正常' },
    { id: 'P015', code: 'TRANS-HV', name: '高压变压器', category: '元器件', unit: '个', spec: '380V/48V', weight: 8, price: 850, safetyStock: 150, status: '正常' }
  ],

  // 2.3 服务商管理 (12条)
  serviceProviders: [
    { id: 'SP001', code: 'SUP-001', name: '深圳电子元器件有限公司', type: '供应商', category: '电子元器件', contact: '张经理', phone: '13800138001', rating: 'A', status: '合作中' },
    { id: 'SP002', code: 'SUP-002', name: '江苏线材科技有限公司', type: '供应商', category: '线材', contact: '李经理', phone: '13800138002', rating: 'A', status: '合作中' },
    { id: 'SP003', code: 'CAR-001', name: '顺丰速运', type: '承运商', category: '快递', contact: '王主管', phone: '95338', rating: 'A', status: '合作中' },
    { id: 'SP004', code: 'CAR-002', name: '德邦物流', type: '承运商', category: '物流', contact: '赵主管', phone: '95353', rating: 'B', status: '合作中' },
    { id: 'SP005', code: 'SUP-003', name: '浙江钣金制造有限公司', type: '供应商', category: '结构件', contact: '陈经理', phone: '13800138005', rating: 'A', status: '合作中' },
    { id: 'SP006', code: 'SUP-004', name: '广东PCB科技有限公司', type: '供应商', category: 'PCB', contact: '刘经理', phone: '13800138006', rating: 'B', status: '合作中' },
    { id: 'SP007', code: 'CAR-003', name: '中通快递', type: '承运商', category: '快递', contact: '黄主管', phone: '95311', rating: 'B', status: '合作中' },
    { id: 'SP008', code: 'SUP-005', name: '上海半导体有限公司', type: '供应商', category: '半导体', contact: '周经理', phone: '13800138008', rating: 'A', status: '合作中' },
    { id: 'SP009', code: 'CAR-004', name: '京东物流', type: '承运商', category: '物流', contact: '吴主管', phone: '950616', rating: 'A', status: '合作中' },
    { id: 'SP010', code: 'SUP-006', name: '东莞塑胶制品有限公司', type: '供应商', category: '塑胶件', contact: '孙经理', phone: '13800138010', rating: 'B', status: '合作中' },
    { id: 'SP011', code: 'SUP-007', name: '宁波电机有限公司', type: '供应商', category: '电机', contact: '马经理', phone: '13800138011', rating: 'A', status: '暂停' },
    { id: 'SP012', code: 'CAR-005', name: '圆通速递', type: '承运商', category: '快递', contact: '郑主管', phone: '95554', rating: 'C', status: '合作中' }
  ],

  // 2.4 客户管理 (12条)
  customers: [
    { id: 'C001', code: 'CUST-001', name: '泰国分公司', type: '内部客户', level: 'A', contact: 'Mr.Smith', phone: '+66-123456', email: 'smith@thailand.com', address: 'Bangkok, Thailand', status: '正常' },
    { id: 'C002', code: 'CUST-002', name: '盛能杰ODM', type: 'ODM客户', level: 'A', contact: '陈总', phone: '13900139001', email: 'chen@snj.com', address: '深圳市南山区', status: '正常' },
    { id: 'C003', code: 'CUST-003', name: '华南区代理', type: '代理商', level: 'B', contact: '林经理', phone: '13900139002', email: 'lin@agent.com', address: '广州市天河区', status: '正常' },
    { id: 'C004', code: 'CUST-004', name: '越南分公司', type: '内部客户', level: 'A', contact: 'Mr.Nguyen', phone: '+84-123456', email: 'nguyen@vietnam.com', address: 'Hanoi, Vietnam', status: '正常' },
    { id: 'C005', code: 'CUST-005', name: '华东区代理', type: '代理商', level: 'A', contact: '王经理', phone: '13900139005', email: 'wang@agent.com', address: '上海市浦东新区', status: '正常' },
    { id: 'C006', code: 'CUST-006', name: '德国客户GmbH', type: '终端客户', level: 'A', contact: 'Mr.Mueller', phone: '+49-123456', email: 'mueller@germany.com', address: 'Berlin, Germany', status: '正常' },
    { id: 'C007', code: 'CUST-007', name: '西北区代理', type: '代理商', level: 'B', contact: '张经理', phone: '13900139007', email: 'zhang@agent.com', address: '西安市高新区', status: '正常' },
    { id: 'C008', code: 'CUST-008', name: '阳光电源', type: 'OEM客户', level: 'A', contact: '李总', phone: '13900139008', email: 'li@sungrow.com', address: '合肥市高新区', status: '正常' },
    { id: 'C009', code: 'CUST-009', name: '印度分公司', type: '内部客户', level: 'B', contact: 'Mr.Patel', phone: '+91-123456', email: 'patel@india.com', address: 'Mumbai, India', status: '正常' },
    { id: 'C010', code: 'CUST-010', name: '华北区代理', type: '代理商', level: 'B', contact: '赵经理', phone: '13900139010', email: 'zhao@agent.com', address: '北京市朝阳区', status: '正常' },
    { id: 'C011', code: 'CUST-011', name: '日本客户株式会社', type: '终端客户', level: 'A', contact: 'Mr.Tanaka', phone: '+81-123456', email: 'tanaka@japan.com', address: 'Tokyo, Japan', status: '正常' },
    { id: 'C012', code: 'CUST-012', name: '澳洲代理', type: '代理商', level: 'B', contact: 'Mr.Brown', phone: '+61-123456', email: 'brown@australia.com', address: 'Sydney, Australia', status: '暂停' }
  ],

  // 2.5 合同管理 (10条)
  contracts: [
    { id: 'CON001', code: 'HT-2025-001', name: '泰国分公司年度采购合同', type: '销售合同', customer: '泰国分公司', amount: 5000000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' },
    { id: 'CON002', code: 'HT-2025-002', name: '盛能杰ODM合作协议', type: '销售合同', customer: '盛能杰ODM', amount: 3000000, startDate: '2025-01-01', endDate: '2025-06-30', status: '生效中' },
    { id: 'CON003', code: 'CG-2025-001', name: '顺丰年度物流服务合同', type: '服务合同', customer: '顺丰速运', amount: 500000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' },
    { id: 'CON004', code: 'HT-2025-003', name: '华南区代理框架协议', type: '销售合同', customer: '华南区代理', amount: 2000000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' },
    { id: 'CON005', code: 'CG-2025-002', name: '深圳电子元器件采购合同', type: '采购合同', customer: '深圳电子元器件有限公司', amount: 1500000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' },
    { id: 'CON006', code: 'HT-2025-004', name: '德国客户销售合同', type: '销售合同', customer: '德国客户GmbH', amount: 800000, startDate: '2025-02-01', endDate: '2025-07-31', status: '生效中' },
    { id: 'CON007', code: 'CG-2025-003', name: '德邦物流服务合同', type: '服务合同', customer: '德邦物流', amount: 300000, startDate: '2025-01-01', endDate: '2025-12-31', status: '生效中' },
    { id: 'CON008', code: 'HT-2024-010', name: '阳光电源OEM合同', type: '销售合同', customer: '阳光电源', amount: 4500000, startDate: '2024-07-01', endDate: '2025-06-30', status: '待续签' },
    { id: 'CON009', code: 'CG-2024-005', name: '浙江钣金供货合同', type: '采购合同', customer: '浙江钣金制造有限公司', amount: 800000, startDate: '2024-06-01', endDate: '2025-05-31', status: '生效中' },
    { id: 'CON010', code: 'HT-2024-008', name: '越南分公司年度合同', type: '销售合同', customer: '越南分公司', amount: 2500000, startDate: '2024-01-01', endDate: '2024-12-31', status: '已过期' }
  ],

  // 2.6 订单类型管理 (8条)
  orderTypes: [
    { id: 'OT001', code: 'NORMAL', name: '标准订单', description: '常规销售订单', auditRule: '需审核', splitRule: '允许拆分', customers: ['全部'], status: '启用' },
    { id: 'OT002', code: 'URGENT', name: '紧急订单', description: '加急处理订单', auditRule: '快速审核', splitRule: '不允许拆分', customers: ['A级客户'], status: '启用' },
    { id: 'OT003', code: 'SAMPLE', name: '样品订单', description: '样品寄送订单', auditRule: '需审核', splitRule: '不允许拆分', customers: ['全部'], status: '启用' },
    { id: 'OT004', code: 'OEM', name: 'OEM订单', description: 'OEM客户定制订单', auditRule: '需审核', splitRule: '允许拆分', customers: ['OEM客户'], status: '启用' },
    { id: 'OT005', code: 'ODM', name: 'ODM订单', description: 'ODM客户定制订单', auditRule: '需审核', splitRule: '允许拆分', customers: ['ODM客户'], status: '启用' },
    { id: 'OT006', code: 'INTERNAL', name: '内部调拨', description: '内部公司调拨', auditRule: '自动审核', splitRule: '允许拆分', customers: ['内部客户'], status: '启用' },
    { id: 'OT007', code: 'REPAIR', name: '维修订单', description: '售后维修订单', auditRule: '需审核', splitRule: '不允许拆分', customers: ['全部'], status: '启用' },
    { id: 'OT008', code: 'REPLACE', name: '换货订单', description: '质量问题换货', auditRule: '快速审核', splitRule: '不允许拆分', customers: ['全部'], status: '启用' }
  ],

  // 2.7 收货人管理 (12条)
  consignees: [
    { id: 'CS001', name: 'Mr.Smith', customer: '泰国分公司', phone: '+66-123456', address: 'Bangkok Factory, Thailand', isDefault: true, status: '正常' },
    { id: 'CS002', name: '陈经理', customer: '盛能杰ODM', phone: '13900139001', address: '深圳市南山区科技园', isDefault: true, status: '正常' },
    { id: 'CS003', name: '林经理', customer: '华南区代理', phone: '13900139002', address: '广州市天河区体育中心', isDefault: true, status: '正常' },
    { id: 'CS004', name: 'Mr.Nguyen', customer: '越南分公司', phone: '+84-123456', address: 'Hanoi Industrial Zone, Vietnam', isDefault: true, status: '正常' },
    { id: 'CS005', name: '王主管', customer: '华东区代理', phone: '13900139005', address: '上海市浦东新区张江', isDefault: true, status: '正常' },
    { id: 'CS006', name: '李仓管', customer: '华东区代理', phone: '13900139006', address: '上海市嘉定区仓库', isDefault: false, status: '正常' },
    { id: 'CS007', name: 'Mr.Mueller', customer: '德国客户GmbH', phone: '+49-123456', address: 'Berlin Warehouse, Germany', isDefault: true, status: '正常' },
    { id: 'CS008', name: '张经理', customer: '西北区代理', phone: '13900139007', address: '西安市高新区创业园', isDefault: true, status: '正常' },
    { id: 'CS009', name: '李总', customer: '阳光电源', phone: '13900139008', address: '合肥市高新区工业园', isDefault: true, status: '正常' },
    { id: 'CS010', name: '赵仓管', customer: '阳光电源', phone: '13900139009', address: '合肥市经开区仓储中心', isDefault: false, status: '正常' },
    { id: 'CS011', name: 'Mr.Patel', customer: '印度分公司', phone: '+91-123456', address: 'Mumbai Warehouse, India', isDefault: true, status: '正常' },
    { id: 'CS012', name: '赵经理', customer: '华北区代理', phone: '13900139010', address: '北京市朝阳区望京', isDefault: true, status: '正常' }
  ],

  // 二、销售管理 - 销售订单 (15条)
  salesOrders: [
    { id: 'SO2025010001', orderType: '标准订单', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 100, price: 12000 }], totalAmount: 1200000, orderDate: '2025-01-06', deliveryDate: '2025-02-15', status: '已审核', auditUser: '李伟', auditTime: '2025-01-06 14:00' },
    { id: 'SO2025010002', orderType: '紧急订单', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-5K-1P', name: '小功率逆变器5KW', qty: 200, price: 3500 }], totalAmount: 700000, orderDate: '2025-01-05', deliveryDate: '2025-01-20', status: '待审核', auditUser: '', auditTime: '' },
    { id: 'SO2025010003', orderType: '标准订单', customer: '华南区代理', consignee: '林经理', products: [{ code: 'INV-3K-1P', name: '小功率逆变器3KW', qty: 500, price: 2500 }], totalAmount: 1250000, orderDate: '2025-01-04', deliveryDate: '2025-02-28', status: '已拆分', auditUser: '李伟', auditTime: '2025-01-04 16:00' },
    { id: 'SO2025010004', orderType: '标准订单', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'PCBA-TEST', name: 'PCBA测试板', qty: 1000, price: 180 }], totalAmount: 180000, orderDate: '2025-01-03', deliveryDate: '2025-01-25', status: '已发货', auditUser: '李伟', auditTime: '2025-01-03 10:00' },
    { id: 'SO2025010005', orderType: 'ODM订单', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 50, price: 12000 }], totalAmount: 600000, orderDate: '2025-01-02', deliveryDate: '2025-01-30', status: '已完成', auditUser: '李伟', auditTime: '2025-01-02 09:00' },
    { id: 'SO2025010006', orderType: '标准订单', customer: '越南分公司', consignee: 'Mr.Nguyen', products: [{ code: 'INV-100K-3P', name: 'PCBA逆变器100KW三相', qty: 30, price: 22000 }], totalAmount: 660000, orderDate: '2025-01-06', deliveryDate: '2025-02-20', status: '已审核', auditUser: '李伟', auditTime: '2025-01-06 15:00' },
    { id: 'SO2025010007', orderType: '标准订单', customer: '华东区代理', consignee: '王主管', products: [{ code: 'INV-10K-1P', name: '中功率逆变器10KW', qty: 150, price: 5800 }], totalAmount: 870000, orderDate: '2025-01-05', deliveryDate: '2025-02-10', status: '待审核', auditUser: '', auditTime: '' },
    { id: 'SO2025010008', orderType: '紧急订单', customer: '德国客户GmbH', consignee: 'Mr.Mueller', products: [{ code: 'INV-20K-3P', name: '中功率逆变器20KW三相', qty: 80, price: 7500 }], totalAmount: 600000, orderDate: '2025-01-04', deliveryDate: '2025-01-25', status: '已审核', auditUser: '张明', auditTime: '2025-01-04 09:00' },
    { id: 'SO2025010009', orderType: 'OEM订单', customer: '阳光电源', consignee: '李总', products: [{ code: 'MOD-CTRL', name: '控制模块', qty: 500, price: 450 }], totalAmount: 225000, orderDate: '2025-01-03', deliveryDate: '2025-02-05', status: '已发货', auditUser: '李伟', auditTime: '2025-01-03 11:00' },
    { id: 'SO2025010010', orderType: '样品订单', customer: '日本客户株式会社', consignee: 'Mr.Tanaka', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 2, price: 12000 }], totalAmount: 24000, orderDate: '2025-01-07', deliveryDate: '2025-01-15', status: '待审核', auditUser: '', auditTime: '' },
    { id: 'SO2025010011', orderType: '标准订单', customer: '西北区代理', consignee: '张经理', products: [{ code: 'INV-5K-1P', name: '小功率逆变器5KW', qty: 100, price: 3500 }], totalAmount: 350000, orderDate: '2025-01-06', deliveryDate: '2025-02-25', status: '已审核', auditUser: '李伟', auditTime: '2025-01-06 16:00' },
    { id: 'SO2025010012', orderType: '内部调拨', customer: '印度分公司', consignee: 'Mr.Patel', products: [{ code: 'INV-3K-1P', name: '小功率逆变器3KW', qty: 200, price: 2500 }], totalAmount: 500000, orderDate: '2025-01-05', deliveryDate: '2025-02-18', status: '已审核', auditUser: '系统', auditTime: '2025-01-05 08:00' },
    { id: 'SO2025010013', orderType: '标准订单', customer: '华北区代理', consignee: '赵经理', products: [{ code: 'INV-10K-1P', name: '中功率逆变器10KW', qty: 60, price: 5800 }], totalAmount: 348000, orderDate: '2025-01-07', deliveryDate: '2025-02-28', status: '待审核', auditUser: '', auditTime: '' },
    { id: 'SO2025010014', orderType: '标准订单', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'DISP-LCD', name: '液晶显示屏', qty: 500, price: 120 }], totalAmount: 60000, orderDate: '2025-01-07', deliveryDate: '2025-01-20', status: '已审核', auditUser: '李伟', auditTime: '2025-01-07 10:00' },
    { id: 'SO2025010015', orderType: '维修订单', customer: '华南区代理', consignee: '林经理', products: [{ code: 'MOD-CTRL', name: '控制模块', qty: 20, price: 450 }], totalAmount: 9000, orderDate: '2025-01-08', deliveryDate: '2025-01-12', status: '待审核', auditUser: '', auditTime: '' }
  ],

  // 三、交货单管理 (12条)
  deliveryOrders: [
    { id: 'DO2025010001', salesOrderId: 'SO2025010004', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'PCBA-TEST', name: 'PCBA测试板', qty: 1000 }], carrier: '顺丰速运', trackingNo: 'SF1234567890', createTime: '2025-01-20', shipTime: '2025-01-21', status: '已签收' },
    { id: 'DO2025010002', salesOrderId: 'SO2025010005', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 50 }], carrier: '德邦物流', trackingNo: 'DB9876543210', createTime: '2025-01-25', shipTime: '2025-01-26', status: '已签收' },
    { id: 'DO2025010003', salesOrderId: 'SO2025010001', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 100 }], carrier: '', trackingNo: '', createTime: '2025-01-08', shipTime: '', status: '待发货' },
    { id: 'DO2025010004', salesOrderId: 'SO2025010009', customer: '阳光电源', consignee: '李总', products: [{ code: 'MOD-CTRL', name: '控制模块', qty: 500 }], carrier: '京东物流', trackingNo: 'JD2025010004', createTime: '2025-01-28', shipTime: '2025-01-29', status: '运输中' },
    { id: 'DO2025010005', salesOrderId: 'SO2025010006', customer: '越南分公司', consignee: 'Mr.Nguyen', products: [{ code: 'INV-100K-3P', name: 'PCBA逆变器100KW三相', qty: 30 }], carrier: '', trackingNo: '', createTime: '2025-01-08', shipTime: '', status: '待发货' },
    { id: 'DO2025010006', salesOrderId: 'SO2025010008', customer: '德国客户GmbH', consignee: 'Mr.Mueller', products: [{ code: 'INV-20K-3P', name: '中功率逆变器20KW三相', qty: 80 }], carrier: '顺丰速运', trackingNo: 'SF2025010006', createTime: '2025-01-10', shipTime: '2025-01-11', status: '运输中' },
    { id: 'DO2025010007', salesOrderId: 'SO2025010003', customer: '华南区代理', consignee: '林经理', products: [{ code: 'INV-3K-1P', name: '小功率逆变器3KW', qty: 250 }], carrier: '德邦物流', trackingNo: 'DB2025010007', createTime: '2025-01-15', shipTime: '2025-01-16', status: '运输中' },
    { id: 'DO2025010008', salesOrderId: 'SO2025010003', customer: '华南区代理', consignee: '林经理', products: [{ code: 'INV-3K-1P', name: '小功率逆变器3KW', qty: 250 }], carrier: '', trackingNo: '', createTime: '2025-01-15', shipTime: '', status: '待发货' },
    { id: 'DO2025010009', salesOrderId: 'SO2025010011', customer: '西北区代理', consignee: '张经理', products: [{ code: 'INV-5K-1P', name: '小功率逆变器5KW', qty: 100 }], carrier: '', trackingNo: '', createTime: '2025-01-08', shipTime: '', status: '待发货' },
    { id: 'DO2025010010', salesOrderId: 'SO2025010012', customer: '印度分公司', consignee: 'Mr.Patel', products: [{ code: 'INV-3K-1P', name: '小功率逆变器3KW', qty: 200 }], carrier: '', trackingNo: '', createTime: '2025-01-08', shipTime: '', status: '待发货' },
    { id: 'DO2025010011', salesOrderId: 'SO2025010014', customer: '泰国分公司', consignee: 'Mr.Smith', products: [{ code: 'DISP-LCD', name: '液晶显示屏', qty: 500 }], carrier: '顺丰速运', trackingNo: 'SF2025010011', createTime: '2025-01-08', shipTime: '2025-01-09', status: '运输中' },
    { id: 'DO2024120001', salesOrderId: 'SO2024120050', customer: '盛能杰ODM', consignee: '陈经理', products: [{ code: 'INV-50K-3P', name: 'PCBA逆变器50KW三相', qty: 100 }], carrier: '德邦物流', trackingNo: 'DB2024120001', createTime: '2024-12-25', shipTime: '2024-12-26', status: '已签收' }
  ],

  // 四、S&OP计划 - 需求计划 (10条)
  sopDemands: [
    { id: 'DM202501', period: '2025年1月', product: 'INV-50K-3P', productName: 'PCBA逆变器50KW三相', orderQty: 180, forecastQty: 50, totalDemand: 230, stock: 80, gap: 150, priority: '高' },
    { id: 'DM202502', period: '2025年1月', product: 'INV-5K-1P', productName: '小功率逆变器5KW', orderQty: 300, forecastQty: 100, totalDemand: 400, stock: 150, gap: 250, priority: '高' },
    { id: 'DM202503', period: '2025年1月', product: 'INV-3K-1P', productName: '小功率逆变器3KW', orderQty: 700, forecastQty: 200, totalDemand: 900, stock: 400, gap: 500, priority: '中' },
    { id: 'DM202504', period: '2025年1月', product: 'INV-100K-3P', productName: 'PCBA逆变器100KW三相', orderQty: 30, forecastQty: 20, totalDemand: 50, stock: 25, gap: 25, priority: '中' },
    { id: 'DM202505', period: '2025年1月', product: 'INV-10K-1P', productName: '中功率逆变器10KW', orderQty: 210, forecastQty: 80, totalDemand: 290, stock: 120, gap: 170, priority: '高' },
    { id: 'DM202506', period: '2025年1月', product: 'INV-20K-3P', productName: '中功率逆变器20KW三相', orderQty: 80, forecastQty: 40, totalDemand: 120, stock: 60, gap: 60, priority: '中' },
    { id: 'DM202507', period: '2025年1月', product: 'MOD-CTRL', productName: '控制模块', orderQty: 520, forecastQty: 200, totalDemand: 720, stock: 350, gap: 370, priority: '中' },
    { id: 'DM202508', period: '2025年1月', product: 'PCBA-TEST', productName: 'PCBA测试板', orderQty: 1000, forecastQty: 500, totalDemand: 1500, stock: 800, gap: 700, priority: '低' },
    { id: 'DM202509', period: '2025年1月', product: 'DISP-LCD', productName: '液晶显示屏', orderQty: 500, forecastQty: 300, totalDemand: 800, stock: 450, gap: 350, priority: '低' },
    { id: 'DM202510', period: '2025年2月', product: 'INV-50K-3P', productName: 'PCBA逆变器50KW三相', orderQty: 200, forecastQty: 100, totalDemand: 300, stock: 0, gap: 300, priority: '高' }
  ],

  sopPlans: [
    { id: 'SP202501', version: 'V1.0', period: '2025年1月', createTime: '2025-01-05', status: '已确认', creator: '赵强', summary: '1月需求计划已与生产协调确认' },
    { id: 'SP202502', version: 'V1.0', period: '2025年2月', createTime: '2025-01-20', status: '待确认', creator: '赵强', summary: '2月需求计划初版，待销售确认' }
  ],

  // 五、报表模板 (8条)
  reportTemplates: [
    { id: 'RPT001', name: '销售订单月报', type: '订单报表', fields: ['订单号', '客户', '产品', '金额', '状态'], createUser: '张明', createTime: '2024-12-01', status: '启用' },
    { id: 'RPT002', name: '交货及时率报表', type: 'OT报表', fields: ['订单号', '客户', '计划交期', '实际交期', '是否及时'], createUser: '张明', createTime: '2024-12-01', status: '启用' },
    { id: 'RPT003', name: '客户订单汇总', type: '汇总报表', fields: ['客户', '订单数', '总金额', '完成率'], createUser: '李伟', createTime: '2024-12-15', status: '启用' },
    { id: 'RPT004', name: '产品销售分析', type: '分析报表', fields: ['产品', '销售数量', '销售金额', '同比增长'], createUser: '张明', createTime: '2024-12-20', status: '启用' },
    { id: 'RPT005', name: '库存周转报表', type: '库存报表', fields: ['产品', '期初库存', '入库', '出库', '期末库存'], createUser: '王芳', createTime: '2024-12-25', status: '启用' },
    { id: 'RPT006', name: '供应商绩效报表', type: '采购报表', fields: ['供应商', '交货及时率', '质量合格率', '综合评分'], createUser: '刘军', createTime: '2025-01-01', status: '启用' },
    { id: 'RPT007', name: '生产进度报表', type: '生产报表', fields: ['订单号', '产品', '计划数量', '完成数量', '完成率'], createUser: '黄波', createTime: '2025-01-05', status: '启用' },
    { id: 'RPT008', name: '跨公司合并报表', type: '财务报表', fields: ['公司', '销售额', '成本', '毛利', '毛利率'], createUser: '周丽', createTime: '2025-01-08', status: '启用' }
  ],

  // 仪表盘统计
  dashboardStats: {
    todayOrders: 12, pendingAudit: 5, inDelivery: 8, completedMonth: 156,
    onTimeRate: 96.5, orderAmount: 5200000, demandGap: 570
  }
};

// 数据服务 - 支持 LocalStorage 持久化
const DataService = {
  // 初始化数据
  init() {
    // 如果是首次运行,初始化演示数据
    if (StorageService.initDemoData()) {
      // 保存所有初始数据到 LocalStorage
      this.saveAllData();
    }
  },

  // 保存所有数据到 LocalStorage
  saveAllData() {
    StorageService.save('users', MockData.users);
    StorageService.save('roles', MockData.roles);
    StorageService.save('rules', MockData.rules);
    StorageService.save('warehouses', MockData.warehouses);
    StorageService.save('products', MockData.products);
    StorageService.save('serviceProviders', MockData.serviceProviders);
    StorageService.save('customers', MockData.customers);
    StorageService.save('contracts', MockData.contracts);
    StorageService.save('orderTypes', MockData.orderTypes);
    StorageService.save('consignees', MockData.consignees);
    StorageService.save('salesOrders', MockData.salesOrders);
    StorageService.save('deliveryOrders', MockData.deliveryOrders);
    StorageService.save('sopDemands', MockData.sopDemands);
    StorageService.save('sopPlans', MockData.sopPlans);
    StorageService.save('reportTemplates', MockData.reportTemplates);
    StorageService.save('dashboardStats', MockData.dashboardStats);
  },

  // 获取方法
  getUsers: (f = {}) => {
    const users = StorageService.load('users', MockData.users);
    return users.filter(u => !f.status || u.status === f.status);
  },
  getRoles: () => StorageService.load('roles', MockData.roles),
  getRules: () => StorageService.load('rules', MockData.rules),
  getWarehouses: () => StorageService.load('warehouses', MockData.warehouses),
  getProducts: () => StorageService.load('products', MockData.products),
  getServiceProviders: (f = {}) => {
    const providers = StorageService.load('serviceProviders', MockData.serviceProviders);
    return providers.filter(s => !f.type || s.type === f.type);
  },
  getCustomers: () => StorageService.load('customers', MockData.customers),
  getContracts: () => StorageService.load('contracts', MockData.contracts),
  getOrderTypes: () => StorageService.load('orderTypes', MockData.orderTypes),
  getConsignees: () => StorageService.load('consignees', MockData.consignees),
  getSalesOrders: (f = {}) => {
    const orders = StorageService.load('salesOrders', MockData.salesOrders);
    return orders.filter(o => !f.status || o.status === f.status);
  },
  getSalesOrderById: (id) => {
    const orders = StorageService.load('salesOrders', MockData.salesOrders);
    return orders.find(o => o.id === id);
  },
  getDeliveryOrders: (f = {}) => {
    const orders = StorageService.load('deliveryOrders', MockData.deliveryOrders);
    return orders.filter(d => !f.status || d.status === f.status);
  },
  getSOPDemands: () => StorageService.load('sopDemands', MockData.sopDemands),
  getSOPPlans: () => StorageService.load('sopPlans', MockData.sopPlans),
  getReportTemplates: () => StorageService.load('reportTemplates', MockData.reportTemplates),
  getDashboardStats: () => StorageService.load('dashboardStats', MockData.dashboardStats),
  getCurrentUser: () => ({ ...MockData.currentUser }),

  // 销售订单操作
  addSalesOrder: (order) => {
    const orders = StorageService.load('salesOrders', MockData.salesOrders);
    const newOrder = {
      ...order,
      id: 'SO' + Date.now(),
      status: '待审核',
      orderDate: new Date().toISOString().slice(0, 10),
      deliveryOrders: [] // 关联的交货单
    };
    orders.unshift(newOrder);
    StorageService.save('salesOrders', orders);
    return newOrder;
  },
  updateSalesOrder: (id, data) => {
    const orders = StorageService.load('salesOrders', MockData.salesOrders);
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...data };
      StorageService.save('salesOrders', orders);
      return orders[idx];
    }
    return null;
  },
  deleteSalesOrder: (id) => {
    const orders = StorageService.load('salesOrders', MockData.salesOrders);
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders.splice(idx, 1);
      StorageService.save('salesOrders', orders);
      return true;
    }
    return false;
  },

  // 交货单操作
  addDeliveryOrder: (order) => {
    const orders = StorageService.load('deliveryOrders', MockData.deliveryOrders);
    const newOrder = {
      ...order,
      id: 'DO' + Date.now(),
      status: '待发货',
      createTime: new Date().toISOString().slice(0, 10)
    };
    orders.unshift(newOrder);
    StorageService.save('deliveryOrders', orders);

    // 如果有关联的销售订单,更新订单的交货单列表
    if (order.salesOrderId) {
      const salesOrders = StorageService.load('salesOrders', MockData.salesOrders);
      const soIdx = salesOrders.findIndex(o => o.id === order.salesOrderId);
      if (soIdx !== -1) {
        if (!salesOrders[soIdx].deliveryOrders) {
          salesOrders[soIdx].deliveryOrders = [];
        }
        salesOrders[soIdx].deliveryOrders.push(newOrder.id);
        StorageService.save('salesOrders', salesOrders);
      }
    }

    return newOrder;
  },
  updateDeliveryOrder: (id, data) => {
    const orders = StorageService.load('deliveryOrders', MockData.deliveryOrders);
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...data };
      StorageService.save('deliveryOrders', orders);
      return orders[idx];
    }
    return null;
  },

  // 主数据更新方法
  updateUser: (id, data) => {
    const users = StorageService.load('users', MockData.users);
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      StorageService.save('users', users);
      return users[idx];
    }
    return null;
  },
  updateRole: (id, data) => {
    const roles = StorageService.load('roles', MockData.roles);
    const idx = roles.findIndex(r => r.id === id);
    if (idx !== -1) {
      roles[idx] = { ...roles[idx], ...data };
      StorageService.save('roles', roles);
      return roles[idx];
    }
    return null;
  },
  updateRule: (id, data) => {
    const rules = StorageService.load('rules', MockData.rules);
    const idx = rules.findIndex(r => r.id === id);
    if (idx !== -1) {
      rules[idx] = { ...rules[idx], ...data };
      StorageService.save('rules', rules);
      return rules[idx];
    }
    return null;
  },
  updateWarehouse: (id, data) => {
    const warehouses = StorageService.load('warehouses', MockData.warehouses);
    const idx = warehouses.findIndex(w => w.id === id);
    if (idx !== -1) {
      warehouses[idx] = { ...warehouses[idx], ...data };
      StorageService.save('warehouses', warehouses);
      return warehouses[idx];
    }
    return null;
  },
  updateProduct: (id, data) => {
    const products = StorageService.load('products', MockData.products);
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data };
      StorageService.save('products', products);
      return products[idx];
    }
    return null;
  },
  updateServiceProvider: (id, data) => {
    const providers = StorageService.load('serviceProviders', MockData.serviceProviders);
    const idx = providers.findIndex(p => p.id === id);
    if (idx !== -1) {
      providers[idx] = { ...providers[idx], ...data };
      StorageService.save('serviceProviders', providers);
      return providers[idx];
    }
    return null;
  },
  updateCustomer: (id, data) => {
    const customers = StorageService.load('customers', MockData.customers);
    const idx = customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      customers[idx] = { ...customers[idx], ...data };
      StorageService.save('customers', customers);
      return customers[idx];
    }
    return null;
  },
  updateOrderType: (id, data) => {
    const orderTypes = StorageService.load('orderTypes', MockData.orderTypes);
    const idx = orderTypes.findIndex(t => t.id === id);
    if (idx !== -1) {
      orderTypes[idx] = { ...orderTypes[idx], ...data };
      StorageService.save('orderTypes', orderTypes);
      return orderTypes[idx];
    }
    return null;
  },
  updateConsignee: (id, data) => {
    const consignees = StorageService.load('consignees', MockData.consignees);
    const idx = consignees.findIndex(c => c.id === id);
    if (idx !== -1) {
      consignees[idx] = { ...consignees[idx], ...data };
      StorageService.save('consignees', consignees);
      return consignees[idx];
    }
    return null;
  }
};

window.MockData = MockData;
window.DataService = DataService;

// 页面加载时初始化数据
document.addEventListener('DOMContentLoaded', () => {
  DataService.init();
});

