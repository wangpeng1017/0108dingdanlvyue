// 采购订单页面
Pages['purchase-order'] = {
    template: `
    <div class="page-header"><h1 class="page-title">采购订单</h1><p class="page-desc">管理采购订单</p></div>
    <div class="search-bar">
      <div class="search-item"><label>订单状态</label><select class="form-control form-select" id="search-po-status"><option value="">全部</option><option value="待确认">待确认</option><option value="已确认">已确认</option><option value="运输中">运输中</option><option value="已到货">已到货</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['purchase-order'].search()">🔍 搜索</button><button class="btn btn-default" onclick="Pages['purchase-order'].reset()">↻ 重置</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['purchase-order'].add()">+ 新增采购单</button></div></div>
      <div id="po-table"></div>
    </div>`,
    init() { this.data = DataService.getPurchaseOrders(); this.renderTable(); },
    renderTable() {
        Table.render('po-table', {
            columns: [
                { key: 'id', title: '采购单号', width: '140px' },
                { key: 'supplier', title: '供应商', render: v => v.length > 15 ? v.slice(0, 15) + '...' : v },
                { key: 'materialName', title: '物料名称' },
                { key: 'quantity', title: '数量', align: 'right', render: v => Format.number(v) },
                { key: 'amount', title: '金额', align: 'right', render: v => Format.currency(v) },
                { key: 'orderDate', title: '下单日期' },
                { key: 'deliveryDate', title: '交期' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '待确认': { text: '待确认', type: 'default' }, '已确认': { text: '已确认', type: 'info' }, '运输中': { text: '运输中', type: 'warning' }, '已到货': { text: '已到货', type: 'success' } }) },
                { key: 'actions', title: '操作', width: '140px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['purchase-order'].receive('${row.id}')">收货</button><button class="btn btn-link" onclick="Pages['purchase-order'].edit('${row.id}')">编辑</button></div>` }
            ],
            data: this.data, showIndex: true
        });
    },
    search() { const s = document.getElementById('search-po-status').value; this.data = DataService.getPurchaseOrders({ status: s || undefined }); this.renderTable(); Message.success('搜索完成'); },
    reset() { document.getElementById('search-po-status').value = ''; this.data = DataService.getPurchaseOrders(); this.renderTable(); },
    add() {
        Modal.create({
            title: '新增采购订单', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">供应商</label><div class="form-content"><select class="form-control form-select" required>${DataService.getSuppliers().map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div></div>
    <div class="form-row"><label class="form-label required">物料名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">采购数量</label><div class="form-content"><input type="number" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">单价</label><div class="form-content"><input type="number" step="0.01" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">交期</label><div class="form-content"><input type="date" class="form-control" required></div></div>
  </form>`, onOk: () => Message.success('采购订单创建成功')
        });
    },
    receive(id) { Modal.confirm({ title: '确认收货', message: '确认该采购订单已到货？', type: 'success', onOk: () => Message.success('收货确认成功') }); },
    edit(id) { Modal.create({ title: '编辑采购订单', content: '<p>编辑表单...</p>', onOk: () => Message.success('保存成功') }); }
};

// 供应商管理页面
Pages['supplier'] = {
    template: `
    <div class="page-header"><h1 class="page-title">供应商管理</h1><p class="page-desc">管理供应商信息</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['supplier'].add()">+ 新增供应商</button></div></div>
      <div id="supplier-table"></div>
    </div>`,
    init() {
        Table.render('supplier-table', {
            columns: [
                { key: 'id', title: '供应商编码', width: '110px' },
                { key: 'name', title: '供应商名称' },
                { key: 'contact', title: '联系人' },
                { key: 'phone', title: '联系电话' },
                { key: 'category', title: '供应类别' },
                { key: 'rating', title: '评级', render: v => `<span style="color:${v === 'A' ? 'var(--success-color)' : v === 'B' ? 'var(--warning-color)' : 'var(--error-color)'};font-weight:600">${v}</span>` },
                { key: 'status', title: '状态', render: v => Format.status(v, { '合作中': { text: '合作中', type: 'success' }, '暂停': { text: '暂停', type: 'warning' } }) },
                { key: 'actions', title: '操作', width: '120px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['supplier'].edit('${row.id}')">编辑</button><button class="btn btn-link" onclick="Pages['supplier'].view('${row.id}')">详情</button></div>` }
            ],
            data: DataService.getSuppliers(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增供应商', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">供应商名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">联系人</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">联系电话</label><div class="form-content"><input type="text" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">邮箱</label><div class="form-content"><input type="email" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">供应类别</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">地址</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
  </form>`, onOk: () => Message.success('供应商创建成功')
        });
    },
    edit(id) { Modal.create({ title: '编辑供应商', content: '<p>编辑表单...</p>', onOk: () => Message.success('保存成功') }); },
    view(id) { Message.info('查看供应商详情: ' + id); }
};

// IQC来料检验页面
Pages['iqc'] = {
    template: `
    <div class="page-header"><h1 class="page-title">来料检验(IQC)</h1><p class="page-desc">管理来料质量检验</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['iqc'].add()">+ 新增检验</button></div></div>
      <div id="iqc-table"></div>
    </div>`,
    init() {
        Table.render('iqc-table', {
            columns: [
                { key: 'id', title: '检验单号', width: '140px' },
                { key: 'poId', title: '采购单号' },
                { key: 'materialName', title: '物料名称' },
                { key: 'supplier', title: '供应商', render: v => v.length > 12 ? v.slice(0, 12) + '...' : v },
                { key: 'inspectQty', title: '检验数量', align: 'right', render: v => Format.number(v) },
                { key: 'passRate', title: '合格率', align: 'right', render: v => `<span style="color:${v >= 98 ? 'var(--success-color)' : v >= 95 ? 'var(--warning-color)' : 'var(--error-color)'}">${v}%</span>` },
                { key: 'inspector', title: '检验员' },
                { key: 'inspectDate', title: '检验日期' },
                { key: 'result', title: '结果', render: v => Format.status(v, { '合格': { text: '合格', type: 'success' }, '不合格': { text: '不合格', type: 'error' }, '待复检': { text: '待复检', type: 'warning' } }) },
                { key: 'actions', title: '操作', width: '100px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['iqc'].view('${row.id}')">详情</button></div>` }
            ],
            data: DataService.getIQCRecords(), showIndex: true
        });
    },
    add() {
        Modal.create({
            title: '新增IQC检验', size: 'lg', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">采购单号</label><div class="form-content"><select class="form-control form-select" required>${DataService.getPurchaseOrders().map(p => `<option value="${p.id}">${p.id} - ${p.materialName}</option>`).join('')}</select></div></div>
    <div class="form-row"><label class="form-label required">检验数量</label><div class="form-content"><input type="number" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label required">抽样数量</label><div class="form-content"><input type="number" class="form-control" required></div></div>
    <div class="form-row"><label class="form-label">检验员</label><div class="form-content"><input type="text" class="form-control" value="刘质检"></div></div>
  </form>`, onOk: () => Message.success('IQC检验单创建成功')
        });
    },
    view(id) {
        const rec = DataService.getIQCRecords().find(r => r.id === id);
        if (!rec) return;
        Modal.create({
            title: 'IQC检验详情', size: 'lg', showFooter: false,
            content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div><label style="color:var(--text-secondary)">检验单号</label><div style="margin-top:4px;font-weight:500">${rec.id}</div></div>
        <div><label style="color:var(--text-secondary)">采购单号</label><div style="margin-top:4px">${rec.poId}</div></div>
        <div><label style="color:var(--text-secondary)">物料名称</label><div style="margin-top:4px">${rec.materialName}</div></div>
        <div><label style="color:var(--text-secondary)">供应商</label><div style="margin-top:4px">${rec.supplier}</div></div>
        <div><label style="color:var(--text-secondary)">检验数量</label><div style="margin-top:4px">${Format.number(rec.inspectQty)}</div></div>
        <div><label style="color:var(--text-secondary)">抽样数量</label><div style="margin-top:4px">${rec.sampleQty}</div></div>
        <div><label style="color:var(--text-secondary)">合格数</label><div style="margin-top:4px">${rec.passQty}</div></div>
        <div><label style="color:var(--text-secondary)">不合格数</label><div style="margin-top:4px">${rec.failQty}</div></div>
        <div><label style="color:var(--text-secondary)">合格率</label><div style="margin-top:4px;font-weight:500;color:${rec.passRate >= 98 ? 'var(--success-color)' : 'var(--warning-color)'}">${rec.passRate}%</div></div>
        <div><label style="color:var(--text-secondary)">检验结果</label><div style="margin-top:4px">${Format.status(rec.result, { '合格': { text: '合格', type: 'success' }, '不合格': { text: '不合格', type: 'error' } })}</div></div>
        <div style="grid-column:span 2"><label style="color:var(--text-secondary)">备注</label><div style="margin-top:4px">${rec.remark || '-'}</div></div>
      </div>`
        });
    }
};

// 交付跟踪页面
Pages['order-tracking'] = {
    template: `
    <div class="page-header"><h1 class="page-title">交付跟踪</h1><p class="page-desc">跟踪订单交付状态</p></div>
    <div class="content-card">
      <div id="tracking-table"></div>
    </div>`,
    init() {
        Table.render('tracking-table', {
            columns: [
                { key: 'orderId', title: '订单编号', width: '140px' },
                { key: 'customerName', title: '客户名称' },
                { key: 'productName', title: '产品名称' },
                { key: 'quantity', title: '数量', align: 'right' },
                { key: 'deliveryDate', title: '计划交付' },
                { key: 'shipDate', title: '发货日期', render: v => v || '-' },
                { key: 'logistics', title: '物流方式', render: v => v || '-' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '生产中': { text: '生产中', type: 'warning' }, '待发货': { text: '待发货', type: 'info' }, '运输中': { text: '运输中', type: 'info' }, '已签收': { text: '已签收', type: 'success' } }) },
                { key: 'actions', title: '操作', width: '120px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['order-tracking'].viewTimeline('${row.orderId}')">进度</button><button class="btn btn-link" onclick="Pages['order-tracking'].ship('${row.orderId}')">发货</button></div>` }
            ],
            data: DataService.getDeliveryTracking(), showIndex: true
        });
    },
    viewTimeline(id) {
        Modal.create({
            title: '订单进度 - ' + id, showFooter: false,
            content: `<div class="timeline">
        <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单创建</div><div class="timeline-time">2025-01-06 09:00</div></div></div>
        <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单确认</div><div class="timeline-time">2025-01-06 10:30</div></div></div>
        <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">开始生产</div><div class="timeline-time">2025-01-08 08:00</div></div></div>
        <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">生产中</div><div class="timeline-time">进行中...</div><div class="timeline-desc">当前完成进度: 45%</div></div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">生产完成</div><div class="timeline-time">待完成</div></div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">发货</div><div class="timeline-time">待发货</div></div></div>
      </div>`
        });
    },
    ship(id) {
        Modal.create({
            title: '发货登记', content: `<form class="modal-form">
    <div class="form-row"><label class="form-label required">物流方式</label><div class="form-content"><select class="form-control form-select"><option>顺丰快递</option><option>德邦物流</option><option>自提</option></select></div></div>
    <div class="form-row"><label class="form-label">运单号</label><div class="form-content"><input type="text" class="form-control"></div></div>
    <div class="form-row"><label class="form-label">备注</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
  </form>`, onOk: () => Message.success('发货登记成功')
        });
    }
};
