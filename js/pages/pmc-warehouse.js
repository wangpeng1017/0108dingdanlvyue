// PMC管理页面
Pages['production-plan'] = {
    template: `
    <div class="page-header"><h1 class="page-title">生产计划</h1><p class="page-desc">管理生产计划排程</p></div>
    <div class="search-bar">
      <div class="search-item"><label>计划状态</label><select class="form-control form-select" id="search-plan-status"><option value="">全部</option><option value="未开始">未开始</option><option value="进行中">进行中</option><option value="已完成">已完成</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['production-plan'].search()">🔍 搜索</button><button class="btn btn-default" onclick="Pages['production-plan'].reset()">↻ 重置</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['production-plan'].add()">+ 新增计划</button></div></div>
      <div id="plan-table"></div>
    </div>`,
    init() { this.data = DataService.getProductionPlans(); this.renderTable(); },
    renderTable() {
        Table.render('plan-table', {
            columns: [
                { key: 'id', title: '计划编号', width: '120px' },
                { key: 'productName', title: '产品名称', render: v => v.length > 25 ? v.slice(0, 25) + '...' : v },
                { key: 'planQuantity', title: '计划数量', align: 'right', render: v => Format.number(v) },
                { key: 'completedQuantity', title: '完成数量', align: 'right', render: v => Format.number(v) },
                { key: 'startDate', title: '开始日期' },
                { key: 'endDate', title: '结束日期' },
                { key: 'line', title: '产线' },
                { key: 'responsible', title: '负责人' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '未开始': { text: '未开始', type: 'default' }, '进行中': { text: '进行中', type: 'warning' }, '已完成': { text: '已完成', type: 'success' } }) },
                { key: 'actions', title: '操作', width: '120px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['production-plan'].edit('${row.id}')">编辑</button><button class="btn btn-link" style="color:var(--error-color)" onclick="Pages['production-plan'].delete('${row.id}')">删除</button></div>` }
            ],
            data: this.data, showIndex: true
        });
    },
    search() { const s = document.getElementById('search-plan-status').value; this.data = DataService.getProductionPlans({ status: s || undefined }); this.renderTable(); Message.success('搜索完成'); },
    reset() { document.getElementById('search-plan-status').value = ''; this.data = DataService.getProductionPlans(); this.renderTable(); },
    add() {
        Modal.create({
            title: '新增生产计划', size: 'lg',
            content: `<form id="plan-form" class="modal-form">
        <div class="form-row"><label class="form-label required">产品名称</label><div class="form-content"><input type="text" class="form-control" name="productName" required></div></div>
        <div class="form-row"><label class="form-label required">计划数量</label><div class="form-content"><input type="number" class="form-control" name="planQuantity" required></div></div>
        <div class="form-row"><label class="form-label required">开始日期</label><div class="form-content"><input type="date" class="form-control" name="startDate" required></div></div>
        <div class="form-row"><label class="form-label required">结束日期</label><div class="form-content"><input type="date" class="form-control" name="endDate" required></div></div>
        <div class="form-row"><label class="form-label">产线</label><div class="form-content"><select class="form-control form-select" name="line"><option>A线</option><option>B线</option><option>C线</option></select></div></div>
        <div class="form-row"><label class="form-label">负责人</label><div class="form-content"><input type="text" class="form-control" name="responsible"></div></div>
      </form>`,
            onOk: () => { if (!FormValidator.validate(document.getElementById('plan-form'))) return false; Message.success('生产计划创建成功'); }
        });
    },
    edit(id) { Modal.create({ title: '编辑生产计划', content: '<p>编辑表单内容...</p>', onOk: () => Message.success('保存成功') }); },
    delete(id) { Modal.confirm({ title: '删除确认', message: '确定删除此计划？', type: 'danger', onOk: () => Message.success('已删除') }); }
};

// 生产工单页面
Pages['work-order'] = {
    template: `
    <div class="page-header"><h1 class="page-title">生产工单</h1><p class="page-desc">管理生产工单和物料领用</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['work-order'].add()">+ 新增工单</button></div></div>
      <div id="workorder-table"></div>
    </div>`,
    init() {
        Table.render('workorder-table', {
            columns: [
                { key: 'id', title: '工单编号', width: '140px' },
                { key: 'orderId', title: '关联订单' },
                { key: 'productName', title: '产品名称', render: v => v.length > 20 ? v.slice(0, 20) + '...' : v },
                { key: 'quantity', title: '数量', align: 'right' },
                { key: 'createDate', title: '创建日期' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '生产中': { text: '生产中', type: 'warning' }, '已完工': { text: '已完工', type: 'success' }, '待开工': { text: '待开工', type: 'default' } }) },
                { key: 'actions', title: '操作', width: '150px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['work-order'].viewMaterials('${row.id}')">物料清单</button><button class="btn btn-link" onclick="Pages['work-order'].print('${row.id}')">打印</button></div>` }
            ],
            data: DataService.getWorkOrders(), showIndex: true
        });
    },
    add() { Modal.create({ title: '新增生产工单', size: 'lg', content: '<p>工单表单内容...</p>', onOk: () => Message.success('工单创建成功') }); },
    viewMaterials(id) {
        const wo = DataService.getWorkOrders().find(w => w.id === id);
        if (!wo) return;
        Modal.create({
            title: `物料清单 - ${id}`, size: 'lg', showFooter: false,
            content: `<table class="data-table"><thead><tr><th>物料编码</th><th>物料名称</th><th>需求数量</th><th>已发数量</th><th>状态</th></tr></thead><tbody>
        ${wo.materials.map(m => `<tr><td>${m.code}</td><td>${m.name}</td><td>${m.required}</td><td>${m.issued}</td><td>${m.issued >= m.required ? '<span class="status-tag success">已齐套</span>' : '<span class="status-tag warning">待领料</span>'}</td></tr>`).join('')}
      </tbody></table>`
        });
    },
    print(id) { Message.info('正在生成打印预览...'); setTimeout(() => Message.success('打印任务已发送'), 1000); }
};

// 仓库送检单页面
Pages['inspection'] = {
    template: `
    <div class="page-header"><h1 class="page-title">送检单管理</h1><p class="page-desc">管理仓库送检单据</p></div>
    <div class="search-bar">
      <div class="search-item"><label>检验状态</label><select class="form-control form-select" id="search-insp-status"><option value="">全部</option><option value="待检验">待检验</option><option value="检验中">检验中</option><option value="已合格">已合格</option><option value="不合格">不合格</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['inspection'].search()">🔍 搜索</button><button class="btn btn-default" onclick="Pages['inspection'].reset()">↻ 重置</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['inspection'].add()">+ 新增送检单</button></div></div>
      <div id="inspection-table"></div>
    </div>`,
    init() { this.data = DataService.getInspectionOrders(); this.renderTable(); },
    renderTable() {
        Table.render('inspection-table', {
            columns: [
                { key: 'id', title: '送检单号', width: '100px' },
                { key: 'productName', title: '产品名称' },
                { key: 'materialCode', title: '料号' },
                { key: 'sendQty', title: '送检数量', align: 'right', render: v => Format.number(v) },
                { key: 'sendDate', title: '送检日期' },
                { key: 'sender', title: '送检人' },
                { key: 'inspector', title: '检验员' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '待检验': { text: '待检验', type: 'default' }, '检验中': { text: '检验中', type: 'info' }, '已合格': { text: '已合格', type: 'success' }, '不合格': { text: '不合格', type: 'error' } }) },
                { key: 'actions', title: '操作', width: '120px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['inspection'].inspect('${row.id}')">检验</button><button class="btn btn-link" onclick="Pages['inspection'].view('${row.id}')">查看</button></div>` }
            ],
            data: this.data, showIndex: true
        });
    },
    search() { const s = document.getElementById('search-insp-status').value; this.data = DataService.getInspectionOrders({ status: s || undefined }); this.renderTable(); Message.success('搜索完成'); },
    reset() { document.getElementById('search-insp-status').value = ''; this.data = DataService.getInspectionOrders(); this.renderTable(); },
    add() {
        Modal.create({
            title: '新增送检单', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">产品名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">料号</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">送检数量</label><div class="form-content"><input type="number" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">送检人</label><div class="form-content"><input type="text" class="form-control" value="姜玉萍"></div></div>
  </form>`, onOk: () => Message.success('送检单创建成功')
        });
    },
    inspect(id) {
        Modal.create({
            title: '检验录入', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label">检验数量</label><div class="form-content"><input type="number" class="form-control" value="10000"></div></div>
    <div class="form-row"><label class="form-label">检验结果</label><div class="form-content"><div class="radio-group"><label class="radio-item"><input type="radio" name="result" value="合格" checked><span class="radio-circle"></span>合格</label><label class="radio-item"><input type="radio" name="result" value="不合格"><span class="radio-circle"></span>不合格</label></div></div></div>
    <div class="form-row"><label class="form-label">备注</label><div class="form-content"><textarea class="form-control" rows="3"></textarea></div></div>
  </form>`, onOk: () => { Message.success('检验结果已保存'); this.data = DataService.getInspectionOrders(); this.renderTable(); }
        });
    },
    view(id) { Message.info('查看送检单详情: ' + id); }
};

// 领料单页面
Pages['material-request'] = {
    template: `
    <div class="page-header"><h1 class="page-title">领料单管理</h1><p class="page-desc">管理生产物料领用</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['material-request'].add()">+ 新增领料单</button></div></div>
      <div id="material-req-table"></div>
    </div>`,
    init() {
        Table.render('material-req-table', {
            columns: [
                { key: 'id', title: '领料单号', width: '110px' },
                { key: 'orderId', title: '关联订单' },
                { key: 'productName', title: '产品名称' },
                { key: 'materialCode', title: '料号' },
                { key: 'requestQty', title: '申请数量', align: 'right' },
                { key: 'actualQty', title: '实发数量', align: 'right' },
                { key: 'type', title: '类型' },
                { key: 'applicant', title: '申请人' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '已领取': { text: '已领取', type: 'success' }, '待审核': { text: '待审核', type: 'warning' }, '待领取': { text: '待领取', type: 'info' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['material-request'].approve('${row.id}')">审核</button></div>` }
            ],
            data: DataService.getMaterialRequests(), showIndex: true
        });
    },
    add() { Modal.create({ title: '新增领料单', size: 'lg', content: '<p>领料单表单...</p>', onOk: () => Message.success('领料单创建成功') }); },
    approve(id) { Modal.confirm({ title: '审核确认', message: '确认通过此领料申请？', type: 'success', onOk: () => Message.success('审核通过') }); }
};

// 库存查询页面
Pages['inventory'] = {
    template: `
    <div class="page-header"><h1 class="page-title">库存查询</h1><p class="page-desc">查询物料库存信息</p></div>
    <div class="search-bar">
      <div class="search-item"><label>物料编码</label><input type="text" class="form-control" id="search-mat-code" placeholder="请输入物料编码"></div>
      <div class="search-item"><label class="checkbox-item"><input type="checkbox" id="search-warning"><span class="checkbox-box"></span>仅显示库存预警</label></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['inventory'].search()">🔍 搜索</button></div>
    </div>
    <div class="content-card"><div id="inventory-table"></div></div>`,
    init() { this.data = DataService.getInventory(); this.renderTable(); },
    renderTable() {
        Table.render('inventory-table', {
            columns: [
                { key: 'materialCode', title: '物料编码', width: '130px' },
                { key: 'materialName', title: '物料名称' },
                { key: 'spec', title: '规格' },
                { key: 'unit', title: '单位', width: '60px' },
                { key: 'currentStock', title: '当前库存', align: 'right', render: (v, row) => `<span style="color:${row.currentStock < row.safetyStock ? 'var(--error-color)' : 'inherit'}">${Format.number(v)}</span>` },
                { key: 'safetyStock', title: '安全库存', align: 'right', render: v => Format.number(v) },
                { key: 'location', title: '库位', width: '80px' },
                { key: 'lastUpdate', title: '更新时间' },
                { key: 'warning', title: '状态', render: (v, row) => row.currentStock < row.safetyStock ? '<span class="status-tag error">库存不足</span>' : '<span class="status-tag success">正常</span>' }
            ],
            data: this.data, showIndex: true
        });
    },
    search() {
        const code = document.getElementById('search-mat-code').value;
        const warning = document.getElementById('search-warning').checked;
        this.data = DataService.getInventory().filter(i => {
            if (code && !i.materialCode.includes(code)) return false;
            if (warning && i.currentStock >= i.safetyStock) return false;
            return true;
        });
        this.renderTable();
        Message.success('搜索完成');
    }
};
