// 一、主数据管理页面模块

// 用户管理
Pages['user-management'] = {
    template: `
    <div class="page-header"><h1 class="page-title">用户管理</h1><p class="page-desc">管理系统用户账号和权限</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['user-management'].add()">+ 新增用户</button></div></div>
      <div id="user-table"></div>
    </div>`,
    init() {
        Table.render('user-table', {
            columns: [
                { key: 'id', title: '用户ID', width: '80px' },
                { key: 'username', title: '用户名' },
                { key: 'name', title: '姓名' },
                { key: 'role', title: '角色' },
                { key: 'department', title: '部门' },
                { key: 'phone', title: '手机号' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '启用': { text: '启用', type: 'success' }, '禁用': { text: '禁用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '150px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['user-management'].edit('${row.id}')">编辑</button><button class="btn btn-link" onclick="Pages['user-management'].resetPwd('${row.id}')">重置密码</button></div>` }
            ],
            data: DataService.getUsers(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增用户', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">用户名</label><div class="form-content"><input type="text" class="form-control" required placeholder="登录账号"></div></div>
    <div class="form-row"><label class="form-label required">姓名</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">角色</label><div class="form-content"><select class="form-control form-select">${DataService.getRoles().map(r => `<option>${r.name}</option>`).join('')}</select></div></div>
    <div class="form-row"><label class="form-label required">部门</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">手机号</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">邮箱</label><div class="form-content"><input type="email" class="form-control"></div></div>
  </form>`, onOk: () => Message.success('用户创建成功')
        });
    },
    edit(id) {
        const user = DataService.getUsers().find(u => u.id === id);
        if (!user) return;
        Modal.create({
            title: '编辑用户', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">用户名</label><div class="form-content"><input type="text" class="form-control" id="edit-username" value="${user.username}" required readonly style="background:#f5f5f5"></div></div>
    <div class="form-row"><label class="form-label required">姓名</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${user.name}" required></div></div>
    <div class="form-row"><label class="form-label required">角色</label><div class="form-content"><select class="form-control form-select" id="edit-role">${DataService.getRoles().map(r => `<option ${r.name === user.role ? 'selected' : ''}>${r.name}</option>`).join('')}</select></div></div>
    <div class="form-row"><label class="form-label required">部门</label><div class="form-content"><input type="text" class="form-control" id="edit-department" value="${user.department}" required></div></div>
    <div class="form-row"><label class="form-label required">手机号</label><div class="form-content"><input type="text" class="form-control" id="edit-phone" value="${user.phone}" required></div></div>
    <div class="form-row"><label class="form-label">邮箱</label><div class="form-content"><input type="email" class="form-control" id="edit-email" value="${user.email || ''}"></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    role: document.getElementById('edit-role').value,
                    department: document.getElementById('edit-department').value,
                    phone: document.getElementById('edit-phone').value,
                    email: document.getElementById('edit-email').value
                };
                DataService.updateUser(id, updatedData);
                Pages['user-management'].init();
                Message.success('用户信息已更新');
            }
        });
    },
    resetPwd(id) { Modal.confirm({ title: '重置密码', message: '确定重置该用户密码？', type: 'warning', onOk: () => Message.success('密码已重置为初始密码') }); }
};

// 角色管理
Pages['role-management'] = {
    template: `
    <div class="page-header"><h1 class="page-title">角色管理</h1><p class="page-desc">管理系统角色和权限配置</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['role-management'].add()">+ 新增角色</button></div></div>
      <div id="role-table"></div>
    </div>`,
    init() {
        Table.render('role-table', {
            columns: [
                { key: 'id', title: '角色ID', width: '80px' },
                { key: 'name', title: '角色名称' },
                { key: 'code', title: '角色编码' },
                { key: 'description', title: '描述' },
                { key: 'permissions', title: '权限', render: v => v.slice(0, 3).join('、') + (v.length > 3 ? '...' : '') },
                { key: 'userCount', title: '用户数', align: 'center' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '启用': { text: '启用', type: 'success' }, '禁用': { text: '禁用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '150px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['role-management'].editPerm('${row.id}')">权限配置</button><button class="btn btn-link" onclick="Pages['role-management'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getRoles(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增角色', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">角色名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">角色编码</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">描述</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
  </form>`, onOk: () => Message.success('角色创建成功')
        });
    },
    edit(id) {
        const role = DataService.getRoles().find(r => r.id === id);
        if (!role) return;
        Modal.create({
            title: '编辑角色', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">角色名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${role.name}" required></div></div>
    <div class="form-row"><label class="form-label required">角色编码</label><div class="form-content"><input type="text" class="form-control" id="edit-code" value="${role.code}" required readonly style="background:#f5f5f5"></div></div>
    <div class="form-row"><label class="form-label">描述</label><div class="form-content"><textarea class="form-control" id="edit-description" rows="2">${role.description || ''}</textarea></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    description: document.getElementById('edit-description').value
                };
                DataService.updateRole(id, updatedData);
                Pages['role-management'].init();
                Message.success('角色信息已更新');
            }
        });
    },
    editPerm(id) {
        Modal.create({
            title: '权限配置', size: 'lg', content: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
    ${['用户管理', '角色管理', '规则管理', '仓库管理', '货品管理', '客户管理', '订单录入', '订单审核', '订单拆分', '交货单管理', 'S&OP计划', '报表查看', '报表导出', '系统设置'].map(p => `<label class="checkbox-item"><input type="checkbox" ${Math.random() > 0.5 ? 'checked' : ''}><span class="checkbox-box"></span>${p}</label>`).join('')}
  </div>`, onOk: () => Message.success('权限配置已保存')
        });
    }
};

// 规则管理
Pages['rule-management'] = {
    template: `
    <div class="page-header"><h1 class="page-title">规则管理</h1><p class="page-desc">管理系统业务规则和预警规则</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['rule-management'].add()">+ 新增规则</button></div></div>
      <div id="rule-table"></div>
    </div>`,
    init() {
        Table.render('rule-table', {
            columns: [
                { key: 'id', title: '规则ID', width: '100px' },
                { key: 'name', title: '规则名称' },
                { key: 'type', title: '类型' },
                { key: 'condition', title: '触发条件' },
                { key: 'action', title: '执行动作' },
                { key: 'priority', title: '优先级', align: 'center' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '启用': { text: '启用', type: 'success' }, '禁用': { text: '禁用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '120px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['rule-management'].edit('${row.id}')">编辑</button><button class="btn btn-link" onclick="Pages['rule-management'].toggle('${row.id}')">切换</button></div>` }
            ],
            data: DataService.getRules(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增规则', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">规则名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">规则类型</label><div class="form-content"><select class="form-control form-select"><option>业务规则</option><option>预警规则</option></select></div></div>
    <div class="form-row"><label class="form-label required">触发条件</label><div class="form-content"><textarea class="form-control" rows="2" required placeholder="如: 订单金额≤10000且客户等级=A"></textarea></div></div>
    <div class="form-row"><label class="form-label required">执行动作</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">优先级</label><div class="form-content"><input type="number" class="form-control" value="1"></div></div>
  </form>`, onOk: () => Message.success('规则创建成功')
        });
    },
    edit(id) {
        const rule = DataService.getRules().find(r => r.id === id);
        if (!rule) return;
        Modal.create({
            title: '编辑规则', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">规则名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${rule.name}" required></div></div>
    <div class="form-row"><label class="form-label required">规则类型</label><div class="form-content"><select class="form-control form-select" id="edit-type"><option ${rule.type === '业务规则' ? 'selected' : ''}>业务规则</option><option ${rule.type === '预警规则' ? 'selected' : ''}>预警规则</option></select></div></div>
    <div class="form-row"><label class="form-label required">触发条件</label><div class="form-content"><textarea class="form-control" id="edit-condition" rows="2" required placeholder="如: 订单金额≤10000且客户等级=A">${rule.condition}</textarea></div></div>
    <div class="form-row"><label class="form-label required">执行动作</label><div class="form-content"><input type="text" class="form-control" id="edit-action" value="${rule.action}" required></div></div>
    <div class="form-row"><label class="form-label">优先级</label><div class="form-content"><input type="number" class="form-control" id="edit-priority" value="${rule.priority}"></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    type: document.getElementById('edit-type').value,
                    condition: document.getElementById('edit-condition').value,
                    action: document.getElementById('edit-action').value,
                    priority: parseInt(document.getElementById('edit-priority').value)
                };
                DataService.updateRule(id, updatedData);
                Pages['rule-management'].init();
                Message.success('规则已更新');
            }
        });
    },
    toggle(id) { Message.success('规则状态已切换'); }
};

// 仓库管理
Pages['warehouse-master'] = {
    template: `
    <div class="page-header"><h1 class="page-title">仓库管理</h1><p class="page-desc">管理仓库基础信息</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['warehouse-master'].add()">+ 新增仓库</button></div></div>
      <div id="warehouse-table"></div>
    </div>`,
    init() {
        Table.render('warehouse-table', {
            columns: [
                { key: 'code', title: '仓库编码', width: '110px' },
                { key: 'name', title: '仓库名称' },
                { key: 'type', title: '类型' },
                { key: 'address', title: '地址' },
                { key: 'manager', title: '负责人' },
                { key: 'capacity', title: '容量', align: 'right', render: v => Format.number(v) },
                { key: 'used', title: '已用', align: 'right', render: (v, row) => `<span style="color:${v / row.capacity > 0.8 ? 'var(--warning-color)' : 'inherit'}">${Format.number(v)}</span>` },
                { key: 'status', title: '状态', render: v => Format.status(v, { '正常': { text: '正常', type: 'success' }, '停用': { text: '停用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['warehouse-master'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getWarehouses(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增仓库', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">仓库编码</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">仓库名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">类型</label><div class="form-content"><select class="form-control form-select"><option>成品仓</option><option>原材料仓</option><option>半成品仓</option></select></div></div>
    <div class="form-row"><label class="form-label">地址</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">负责人</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">容量</label><div class="form-content"><input type="number" class="form-control"></div></div>
  </form>`, onOk: () => Message.success('仓库创建成功')
        });
    },
    edit(id) {
        const warehouse = DataService.getWarehouses().find(w => w.id === id);
        if (!warehouse) return;
        Modal.create({
            title: '编辑仓库', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">仓库编码</label><div class="form-content"><input type="text" class="form-control" id="edit-code" value="${warehouse.code}" required readonly style="background:#f5f5f5"></div></div>
    <div class="form-row"><label class="form-label required">仓库名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${warehouse.name}" required></div></div>
    <div class="form-row"><label class="form-label required">类型</label><div class="form-content"><select class="form-control form-select" id="edit-type"><option ${warehouse.type === '成品仓' ? 'selected' : ''}>成品仓</option><option ${warehouse.type === '原材料仓' ? 'selected' : ''}>原材料仓</option><option ${warehouse.type === '半成品仓' ? 'selected' : ''}>半成品仓</option></select></div></div>
    <div class="form-row"><label class="form-label">地址</label><div class="form-content"><input type="text" class="form-control" id="edit-address" value="${warehouse.address}"></div></div>
    <div class="form-row"><label class="form-label">负责人</label><div class="form-content"><input type="text" class="form-control" id="edit-manager" value="${warehouse.manager}"></div></div>
    <div class="form-row"><label class="form-label">容量</label><div class="form-content"><input type="number" class="form-control" id="edit-capacity" value="${warehouse.capacity}"></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    type: document.getElementById('edit-type').value,
                    address: document.getElementById('edit-address').value,
                    manager: document.getElementById('edit-manager').value,
                    capacity: parseInt(document.getElementById('edit-capacity').value)
                };
                DataService.updateWarehouse(id, updatedData);
                Pages['warehouse-master'].init();
                Message.success('仓库信息已更新');
            }
        });
    }
};

// 货品管理
Pages['product-master'] = {
    template: `
    <div class="page-header"><h1 class="page-title">货品管理</h1><p class="page-desc">管理货品主数据，包括属性、分类、包装等信息</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['product-master'].add()">+ 新增货品</button><button class="btn btn-default" onclick="Pages['product-master'].import()">📥 导入</button></div></div>
      <div id="product-table"></div>
    </div>`,
    init() {
        Table.render('product-table', {
            columns: [
                { key: 'code', title: '货品编码', width: '120px' },
                { key: 'name', title: '货品名称' },
                { key: 'category', title: '分类' },
                { key: 'spec', title: '规格' },
                { key: 'unit', title: '单位', width: '60px' },
                { key: 'price', title: '单价', align: 'right', render: v => Format.currency(v) },
                { key: 'safetyStock', title: '安全库存', align: 'right' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '正常': { text: '正常', type: 'success' }, '停用': { text: '停用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['product-master'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getProducts(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增货品', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">货品编码</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">货品名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">分类</label><div class="form-content"><select class="form-control form-select"><option>逆变器</option><option>配件</option><option>包装材料</option></select></div></div>
    <div class="form-row"><label class="form-label">规格</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">单位</label><div class="form-content"><input type="text" class="form-control" value="台"></div></div>
    <div class="form-row"><label class="form-label">单价</label><div class="form-content"><input type="number" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">安全库存</label><div class="form-content"><input type="number" class="form-control"></div></div>
  </form>`, onOk: () => Message.success('货品创建成功')
        });
    },
    edit(id) {
        const product = DataService.getProducts().find(p => p.id === id);
        if (!product) return;
        Modal.create({
            title: '编辑货品', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">货品编码</label><div class="form-content"><input type="text" class="form-control" id="edit-code" value="${product.code}" required readonly style="background:#f5f5f5"></div></div>
    <div class="form-row"><label class="form-label required">货品名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${product.name}" required></div></div>
    <div class="form-row"><label class="form-label required">分类</label><div class="form-content"><select class="form-control form-select" id="edit-category"><option ${product.category === '逆变器' ? 'selected' : ''}>逆变器</option><option ${product.category === '配件' ? 'selected' : ''}>配件</option><option ${product.category === '包装材料' ? 'selected' : ''}>包装材料</option></select></div></div>
    <div class="form-row"><label class="form-label">规格</label><div class="form-content"><input type="text" class="form-control" id="edit-spec" value="${product.spec || ''}"></div></div>
    <div class="form-row"><label class="form-label">单位</label><div class="form-content"><input type="text" class="form-control" id="edit-unit" value="${product.unit}"></div></div>
    <div class="form-row"><label class="form-label">单价</label><div class="form-content"><input type="number" class="form-control" id="edit-price" value="${product.price}"></div></div>
    <div class="form-row"><label class="form-label">安全库存</label><div class="form-content"><input type="number" class="form-control" id="edit-safetyStock" value="${product.safetyStock}"></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    category: document.getElementById('edit-category').value,
                    spec: document.getElementById('edit-spec').value,
                    unit: document.getElementById('edit-unit').value,
                    price: parseFloat(document.getElementById('edit-price').value),
                    safetyStock: parseInt(document.getElementById('edit-safetyStock').value)
                };
                DataService.updateProduct(id, updatedData);
                Pages['product-master'].init();
                Message.success('货品信息已更新');
            }
        });
    },
    import() { Message.info('请选择Excel文件导入...'); }
};

// 服务商管理
Pages['service-provider'] = {
    template: `
    <div class="page-header"><h1 class="page-title">服务商管理</h1><p class="page-desc">管理供应商及承运商信息</p></div>
    <div class="tabs"><div class="tab-list"><div class="tab-item active" onclick="Pages['service-provider'].switchTab('供应商')">供应商</div><div class="tab-item" onclick="Pages['service-provider'].switchTab('承运商')">承运商</div></div></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['service-provider'].add()">+ 新增服务商</button></div></div>
      <div id="provider-table"></div>
    </div>`,
    currentTab: '供应商',
    init() { this.renderTable(); },
    switchTab(tab) { this.currentTab = tab; document.querySelectorAll('.tab-item').forEach((t, i) => t.classList.toggle('active', i === (tab === '供应商' ? 0 : 1))); this.renderTable(); },
    renderTable() {
        const type = this.currentTab === '供应商' ? '供应商' : '承运商';
        Table.render('provider-table', {
            columns: [
                { key: 'code', title: '编码', width: '100px' },
                { key: 'name', title: '名称' },
                { key: 'category', title: '类别' },
                { key: 'contact', title: '联系人' },
                { key: 'phone', title: '电话' },
                { key: 'rating', title: '评级', render: v => `<span style="color:${v === 'A' ? 'var(--success-color)' : v === 'B' ? 'var(--warning-color)' : 'var(--error-color)'};font-weight:600">${v}</span>` },
                { key: 'status', title: '状态', render: v => Format.status(v, { '合作中': { text: '合作中', type: 'success' }, '暂停': { text: '暂停', type: 'warning' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['service-provider'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getServiceProviders({ type }), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增服务商', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">类型</label><div class="form-content"><select class="form-control form-select"><option>供应商</option><option>承运商</option></select></div></div>
    <div class="form-row"><label class="form-label required">名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">类别</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label required">联系人</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">电话</label><div class="form-content"><input type="text" class="form-control" required></div></div>
  </form>`, onOk: () => Message.success('服务商创建成功')
        });
    },
    edit(id) {
        const provider = DataService.getServiceProviders().find(p => p.id === id);
        if (!provider) return;
        Modal.create({
            title: '编辑服务商', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">类型</label><div class="form-content"><select class="form-control form-select" id="edit-type"><option ${provider.type === '供应商' ? 'selected' : ''}>供应商</option><option ${provider.type === '承运商' ? 'selected' : ''}>承运商</option></select></div></div>
    <div class="form-row"><label class="form-label required">名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${provider.name}" required></div></div>
    <div class="form-row"><label class="form-label">类别</label><div class="form-content"><input type="text" class="form-control" id="edit-category" value="${provider.category}"></div></div>
    <div class="form-row"><label class="form-label required">联系人</label><div class="form-content"><input type="text" class="form-control" id="edit-contact" value="${provider.contact}" required></div></div>
    <div class="form-row"><label class="form-label required">电话</label><div class="form-content"><input type="text" class="form-control" id="edit-phone" value="${provider.phone}" required></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    type: document.getElementById('edit-type').value,
                    name: document.getElementById('edit-name').value,
                    category: document.getElementById('edit-category').value,
                    contact: document.getElementById('edit-contact').value,
                    phone: document.getElementById('edit-phone').value
                };
                DataService.updateServiceProvider(id, updatedData);
                Pages['service-provider'].renderTable();
                Message.success('服务商信息已更新');
            }
        });
    }
};

// 客户管理
Pages['customer-master'] = {
    template: `
    <div class="page-header"><h1 class="page-title">客户管理</h1><p class="page-desc">管理客户信息，支持联系人绑定</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['customer-master'].add()">+ 新增客户</button></div></div>
      <div id="customer-table"></div>
    </div>`,
    init() {
        Table.render('customer-table', {
            columns: [
                { key: 'code', title: '客户编码', width: '100px' },
                { key: 'name', title: '客户名称' },
                { key: 'type', title: '类型' },
                { key: 'level', title: '等级', render: v => `<span style="color:${v === 'A' ? 'var(--success-color)' : v === 'B' ? 'var(--warning-color)' : 'inherit'};font-weight:600">${v}级</span>` },
                { key: 'contact', title: '联系人' },
                { key: 'phone', title: '电话' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '正常': { text: '正常', type: 'success' }, '停用': { text: '停用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '150px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['customer-master'].contacts('${row.id}')">联系人</button><button class="btn btn-link" onclick="Pages['customer-master'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getCustomers(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增客户', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">客户编码</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">客户名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">类型</label><div class="form-content"><select class="form-control form-select"><option>内部客户</option><option>ODM客户</option><option>代理商</option><option>终端客户</option></select></div></div>
    <div class="form-row"><label class="form-label">等级</label><div class="form-content"><select class="form-control form-select"><option>A</option><option>B</option><option>C</option></select></div></div>
    <div class="form-row"><label class="form-label">联系人</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">电话</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">地址</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
  </form>`, onOk: () => Message.success('客户创建成功')
        });
    },
    edit(id) {
        const customer = DataService.getCustomers().find(c => c.id === id);
        if (!customer) return;
        Modal.create({
            title: '编辑客户', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">客户编码</label><div class="form-content"><input type="text" class="form-control" id="edit-code" value="${customer.code}" required readonly style="background:#f5f5f5"></div></div>
    <div class="form-row"><label class="form-label required">客户名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${customer.name}" required></div></div>
    <div class="form-row"><label class="form-label required">类型</label><div class="form-content"><select class="form-control form-select" id="edit-type"><option ${customer.type === '内部客户' ? 'selected' : ''}>内部客户</option><option ${customer.type === 'ODM客户' ? 'selected' : ''}>ODM客户</option><option ${customer.type === '代理商' ? 'selected' : ''}>代理商</option><option ${customer.type === '终端客户' ? 'selected' : ''}>终端客户</option></select></div></div>
    <div class="form-row"><label class="form-label">等级</label><div class="form-content"><select class="form-control form-select" id="edit-level"><option ${customer.level === 'A' ? 'selected' : ''}>A</option><option ${customer.level === 'B' ? 'selected' : ''}>B</option><option ${customer.level === 'C' ? 'selected' : ''}>C</option></select></div></div>
    <div class="form-row"><label class="form-label">联系人</label><div class="form-content"><input type="text" class="form-control" id="edit-contact" value="${customer.contact}"></div></div>
    <div class="form-row"><label class="form-label">电话</label><div class="form-content"><input type="text" class="form-control" id="edit-phone" value="${customer.phone}"></div></div>
    <div class="form-row"><label class="form-label">地址</label><div class="form-content"><textarea class="form-control" id="edit-address" rows="2">${customer.address || ''}</textarea></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    type: document.getElementById('edit-type').value,
                    level: document.getElementById('edit-level').value,
                    contact: document.getElementById('edit-contact').value,
                    phone: document.getElementById('edit-phone').value,
                    address: document.getElementById('edit-address').value
                };
                DataService.updateCustomer(id, updatedData);
                Pages['customer-master'].init();
                Message.success('客户信息已更新');
            }
        });
    },
    contacts(id) { Modal.create({ title: '联系人管理', size: 'lg', content: `<table class="data-table"><thead><tr><th>姓名</th><th>电话</th><th>邮箱</th><th>职务</th><th>操作</th></tr></thead><tbody><tr><td>陈经理</td><td>13900139001</td><td>chen@example.com</td><td>采购总监</td><td><button class="btn btn-link">编辑</button></td></tr></tbody></table><button class="btn btn-dashed" style="width:100%;margin-top:16px">+ 添加联系人</button>`, showFooter: false }); }
};

// 合同管理
Pages['contract-management'] = {
    template: `
    <div class="page-header"><h1 class="page-title">合同管理</h1><p class="page-desc">管理客户及服务商合同，支持附件管理</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['contract-management'].add()">+ 新增合同</button></div></div>
      <div id="contract-table"></div>
    </div>`,
    init() {
        Table.render('contract-table', {
            columns: [
                { key: 'code', title: '合同编号', width: '120px' },
                { key: 'name', title: '合同名称' },
                { key: 'type', title: '类型' },
                { key: 'customer', title: '客户/服务商' },
                { key: 'amount', title: '金额', align: 'right', render: v => Format.currency(v) },
                { key: 'startDate', title: '开始日期' },
                { key: 'endDate', title: '结束日期' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '生效中': { text: '生效中', type: 'success' }, '已过期': { text: '已过期', type: 'default' }, '待生效': { text: '待生效', type: 'warning' } }) },
                { key: 'actions', title: '操作', width: '150px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['contract-management'].view('${row.id}')">查看</button><button class="btn btn-link" onclick="Pages['contract-management'].files('${row.id}')">附件</button></div>` }
            ],
            data: DataService.getContracts(), showIndex: true
        });
    },
    add() { Modal.create({ title: '新增合同', size: 'lg', content: '<p>合同表单...</p>', onOk: () => Message.success('合同创建成功') }); },
    view(id) { Message.info('查看合同详情'); },
    files(id) { Modal.create({ title: '附件管理', content: `<div style="border:2px dashed var(--border-color);border-radius:8px;padding:40px;text-align:center;color:var(--text-secondary)">📎 拖拽文件到此处或点击上传<br><small>支持 PDF、Word、Excel 格式</small></div><div style="margin-top:16px"><div style="display:flex;align-items:center;padding:8px;border:1px solid var(--border-light);border-radius:4px;margin-bottom:8px">📄 合同正文.pdf <span style="margin-left:auto;color:var(--text-secondary)">2.3MB</span><button class="btn btn-link btn-sm">下载</button></div></div>`, showFooter: false }); }
};

// 订单类型管理
Pages['order-type'] = {
    template: `
    <div class="page-header"><h1 class="page-title">订单类型管理</h1><p class="page-desc">管理不同订单类型及其处理规则</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['order-type'].add()">+ 新增类型</button></div></div>
      <div id="ordertype-table"></div>
    </div>`,
    init() {
        Table.render('ordertype-table', {
            columns: [
                { key: 'code', title: '类型编码', width: '100px' },
                { key: 'name', title: '类型名称' },
                { key: 'description', title: '描述' },
                { key: 'auditRule', title: '审核规则' },
                { key: 'splitRule', title: '拆分规则' },
                { key: 'customers', title: '适用客户', render: v => v.join('、') },
                { key: 'status', title: '状态', render: v => Format.status(v, { '启用': { text: '启用', type: 'success' }, '禁用': { text: '禁用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['order-type'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getOrderTypes(), showIndex: true
        });
    },
    add() { Modal.create({ title: '新增订单类型', content: '<p>类型表单...</p>', onOk: () => Message.success('类型创建成功') }); },
    edit(id) {
        const orderType = DataService.getOrderTypes().find(t => t.id === id);
        if (!orderType) return;
        Modal.create({
            title: '编辑订单类型', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">类型编码</label><div class="form-content"><input type="text" class="form-control" id="edit-code" value="${orderType.code}" required readonly style="background:#f5f5f5"></div></div>
    <div class="form-row"><label class="form-label required">类型名称</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${orderType.name}" required></div></div>
    <div class="form-row"><label class="form-label">描述</label><div class="form-content"><textarea class="form-control" id="edit-description" rows="2">${orderType.description || ''}</textarea></div></div>
    <div class="form-row"><label class="form-label">审核规则</label><div class="form-content"><input type="text" class="form-control" id="edit-auditRule" value="${orderType.auditRule}"></div></div>
    <div class="form-row"><label class="form-label">拆分规则</label><div class="form-content"><input type="text" class="form-control" id="edit-splitRule" value="${orderType.splitRule}"></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    description: document.getElementById('edit-description').value,
                    auditRule: document.getElementById('edit-auditRule').value,
                    splitRule: document.getElementById('edit-splitRule').value
                };
                DataService.updateOrderType(id, updatedData);
                Pages['order-type'].init();
                Message.success('订单类型已更新');
            }
        });
    }
};

// 收货人管理
Pages['consignee'] = {
    template: `
    <div class="page-header"><h1 class="page-title">收货人管理</h1><p class="page-desc">管理收货人基础信息</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['consignee'].add()">+ 新增收货人</button></div></div>
      <div id="consignee-table"></div>
    </div>`,
    init() {
        Table.render('consignee-table', {
            columns: [
                { key: 'id', title: 'ID', width: '80px' },
                { key: 'name', title: '收货人姓名' },
                { key: 'customer', title: '所属客户' },
                { key: 'phone', title: '联系电话' },
                { key: 'address', title: '收货地址' },
                { key: 'isDefault', title: '默认', render: v => v ? '✓' : '' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '正常': { text: '正常', type: 'success' }, '停用': { text: '停用', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['consignee'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: DataService.getConsignees(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增收货人', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">所属客户</label><div class="form-content"><select class="form-control form-select">${DataService.getCustomers().map(c => `<option>${c.name}</option>`).join('')}</select></div></div>
    <div class="form-row"><label class="form-label required">收货人姓名</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">联系电话</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">收货地址</label><div class="form-content"><textarea class="form-control" rows="2" required></textarea></div></div>
    <div class="form-row"><label class="form-label">设为默认</label><div class="form-content"><label class="checkbox-item"><input type="checkbox"><span class="checkbox-box"></span>默认收货人</label></div></div>
  </form>`, onOk: () => Message.success('收货人创建成功')
        });
    },
    edit(id) {
        const consignee = DataService.getConsignees().find(c => c.id === id);
        if (!consignee) return;
        Modal.create({
            title: '编辑收货人', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">所属客户</label><div class="form-content"><select class="form-control form-select" id="edit-customer">${DataService.getCustomers().map(c => `<option ${c.name === consignee.customer ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div></div>
    <div class="form-row"><label class="form-label required">收货人姓名</label><div class="form-content"><input type="text" class="form-control" id="edit-name" value="${consignee.name}" required></div></div>
    <div class="form-row"><label class="form-label required">联系电话</label><div class="form-content"><input type="text" class="form-control" id="edit-phone" value="${consignee.phone}" required></div></div>
    <div class="form-row"><label class="form-label required">收货地址</label><div class="form-content"><textarea class="form-control" id="edit-address" rows="2" required>${consignee.address}</textarea></div></div>
    <div class="form-row"><label class="form-label">设为默认</label><div class="form-content"><label class="checkbox-item"><input type="checkbox" id="edit-isDefault" ${consignee.isDefault ? 'checked' : ''}><span class="checkbox-box"></span>默认收货人</label></div></div>
  </form>`, onOk: () => {
                const updatedData = {
                    customer: document.getElementById('edit-customer').value,
                    name: document.getElementById('edit-name').value,
                    phone: document.getElementById('edit-phone').value,
                    address: document.getElementById('edit-address').value,
                    isDefault: document.getElementById('edit-isDefault').checked
                };
                DataService.updateConsignee(id, updatedData);
                Pages['consignee'].init();
                Message.success('收货人信息已更新');
            }
        });
    }
};
