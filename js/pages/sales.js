// 二、销售管理页面模块

// 订单录入
Pages['order-create'] = {
    template: `
    <div class="page-header"><h1 class="page-title">订单录入</h1><p class="page-desc">创建销售订单，支持API接口、文件导入等方式</p></div>
    <div class="content-card">
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <button class="btn btn-primary" onclick="Pages['order-create'].manual()">📝 手工录入</button>
        <button class="btn btn-default" onclick="Pages['order-create'].import()">📥 Excel导入</button>
        <button class="btn btn-default" onclick="Pages['order-create'].api()">🔗 API对接</button>
      </div>
      <div class="card-header"><h3 class="card-title">快速录入</h3></div>
      <form id="order-form" class="modal-form">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-row"><label class="form-label required">订单类型</label><div class="form-content"><select class="form-control form-select" name="orderType">${DataService.getOrderTypes().map(t => `<option>${t.name}</option>`).join('')}</select></div></div>
          <div class="form-row"><label class="form-label required">客户</label><div class="form-content"><select class="form-control form-select" name="customer" onchange="Pages['order-create'].loadConsignees(this.value)">${DataService.getCustomers().map(c => `<option>${c.name}</option>`).join('')}</select></div></div>
          <div class="form-row"><label class="form-label required">收货人</label><div class="form-content"><select class="form-control form-select" name="consignee" id="consignee-select">${DataService.getConsignees().map(c => `<option>${c.name}</option>`).join('')}</select></div></div>
          <div class="form-row"><label class="form-label required">交货日期</label><div class="form-content"><input type="date" class="form-control" name="deliveryDate" required></div></div>
        </div>
        <div class="card-header" style="margin-top:24px"><h3 class="card-title">产品明细</h3><button type="button" class="btn btn-dashed btn-sm" onclick="Pages['order-create'].addLine()">+ 添加行</button></div>
        <table class="data-table" id="order-lines">
          <thead><tr><th>货品编码</th><th>货品名称</th><th>数量</th><th>单价</th><th>金额</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td><select class="form-control form-select" style="width:120px" onchange="Pages['order-create'].selectProduct(this)">${DataService.getProducts().map(p => `<option value="${p.code}">${p.code}</option>`).join('')}</select></td><td>PCBA逆变器50KW三相</td><td><input type="number" class="form-control" style="width:80px" value="1" onchange="Pages['order-create'].calcAmount(this)"></td><td><input type="number" class="form-control" style="width:100px" value="12000"></td><td>¥12,000</td><td><button type="button" class="btn btn-link" style="color:var(--error-color)" onclick="this.closest('tr').remove()">删除</button></td></tr>
          </tbody>
        </table>
        <div style="text-align:right;margin-top:16px;font-size:16px">合计金额：<strong style="color:var(--primary-color);font-size:20px">¥12,000</strong></div>
        <div style="display:flex;justify-content:center;gap:16px;margin-top:24px">
          <button type="button" class="btn btn-primary" onclick="Pages['order-create'].submit()">提交订单</button>
          <button type="button" class="btn btn-default" onclick="Pages['order-create'].saveDraft()">保存草稿</button>
          <button type="reset" class="btn btn-default">重置</button>
        </div>
      </form>
    </div>`,
    init() { },
    loadConsignees(customer) { Message.info('已加载客户 ' + customer + ' 的收货人'); },
    addLine() { const tbody = document.querySelector('#order-lines tbody'); tbody.insertAdjacentHTML('beforeend', `<tr><td><select class="form-control form-select" style="width:120px">${DataService.getProducts().map(p => `<option value="${p.code}">${p.code}</option>`).join('')}</select></td><td>-</td><td><input type="number" class="form-control" style="width:80px" value="1"></td><td><input type="number" class="form-control" style="width:100px" value="0"></td><td>¥0</td><td><button type="button" class="btn btn-link" style="color:var(--error-color)" onclick="this.closest('tr').remove()">删除</button></td></tr>`); },
    selectProduct(el) { const p = DataService.getProducts().find(x => x.code === el.value); if (p) { el.closest('tr').children[1].textContent = p.name; el.closest('tr').querySelector('input[type=number]:last-of-type').value = p.price; } },
    calcAmount(el) { /* calc */ },
    submit() { Modal.confirm({ title: '提交订单', message: '确认提交此订单？订单将进入审核流程。', type: 'success', onOk: () => { Message.success('订单提交成功'); App.loadPage('order-list'); } }); },
    saveDraft() { Message.success('草稿已保存'); },
    manual() { Message.info('已进入手工录入模式'); },
    import() { Modal.create({ title: 'Excel导入', content: `<div style="border:2px dashed var(--border-color);border-radius:8px;padding:40px;text-align:center;color:var(--text-secondary)">📥 拖拽Excel文件到此处或点击上传<br><small>支持 .xlsx, .xls 格式</small></div><div style="margin-top:16px"><a href="#" class="btn btn-link">下载导入模板</a></div>`, onOk: () => Message.success('导入成功，共3条订单') }); },
    api() { Modal.create({ title: 'API对接配置', content: `<p>API接口地址：<code>https://api.example.com/orders</code></p><p>当前状态：<span class="status-tag success">已连接</span></p><p>最后同步：2025-01-08 10:30:00</p>`, showFooter: false }); }
};

// 订单列表
Pages['order-list'] = {
    template: `
    <div class="page-header"><h1 class="page-title">订单列表</h1><p class="page-desc">管理所有销售订单</p></div>
    <div class="search-bar">
      <div class="search-item"><label>订单编号</label><input type="text" class="form-control" id="search-oid" placeholder="请输入"></div>
      <div class="search-item"><label>客户</label><select class="form-control form-select" id="search-customer"><option value="">全部</option>${DataService.getCustomers().map(c => `<option>${c.name}</option>`).join('')}</select></div>
      <div class="search-item"><label>状态</label><select class="form-control form-select" id="search-status"><option value="">全部</option><option>待审核</option><option>已审核</option><option>已拆分</option><option>已发货</option><option>已完成</option><option>已取消</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['order-list'].search()">🔍 搜索</button><button class="btn btn-default" onclick="Pages['order-list'].reset()">↻ 重置</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="App.loadPage('order-create')">+ 新建订单</button><button class="btn btn-default" onclick="Pages['order-list'].batchAudit()">批量审核</button></div><div class="table-toolbar-right"><button class="btn btn-default" onclick="Pages['order-list'].export()">📥 导出</button></div></div>
      <div id="order-table"></div>
      <div id="order-pagination"></div>
    </div>`,
    data: [], currentPage: 1,
    init() { this.data = DataService.getSalesOrders(); this.renderTable(); },
    renderTable() {
        Table.render('order-table', {
            columns: [
                { key: 'id', title: '订单编号', width: '140px' },
                { key: 'orderType', title: '订单类型' },
                { key: 'customer', title: '客户' },
                { key: 'products', title: '产品', render: v => v[0]?.name || '-' },
                { key: 'totalAmount', title: '金额', align: 'right', render: v => Format.currency(v) },
                { key: 'orderDate', title: '订单日期' },
                { key: 'deliveryDate', title: '交货日期' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' }, '已发货': { text: '已发货', type: 'info' }, '已完成': { text: '已完成', type: 'success' }, '已取消': { text: '已取消', type: 'default' } }) },
                {
                    key: 'actions', title: '操作', width: '180px', render: (_, row) => `<div class="table-actions">
          <button class="btn btn-link" onclick="Pages['order-list'].view('${row.id}')">查看</button>
          ${row.status === '待审核' ? `<button class="btn btn-link" onclick="Pages['order-list'].audit('${row.id}')">审核</button>` : ''}
          ${row.status === '已审核' ? `<button class="btn btn-link" onclick="Pages['order-list'].split('${row.id}')">拆分</button>` : ''}
          <button class="btn btn-link" onclick="Pages['order-list'].history('${row.id}')">日志</button>
        </div>` }
            ],
            data: this.data, showCheckbox: true, showIndex: true
        });
        Pagination.render('order-pagination', { current: this.currentPage, pageSize: 10, total: this.data.length, onChange: p => { this.currentPage = p; this.renderTable(); } });
    },
    search() { const status = document.getElementById('search-status').value; this.data = DataService.getSalesOrders({ status: status || undefined }); this.renderTable(); Message.success('搜索完成'); },
    reset() { this.data = DataService.getSalesOrders(); this.renderTable(); },
    view(id) {
        const o = DataService.getSalesOrderById(id); if (!o) return; Modal.create({
            title: '订单详情 - ' + id, size: 'lg', showFooter: false, content: `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div><label style="color:var(--text-secondary)">订单编号</label><div style="font-weight:500">${o.id}</div></div>
      <div><label style="color:var(--text-secondary)">订单类型</label><div>${o.orderType}</div></div>
      <div><label style="color:var(--text-secondary)">客户</label><div>${o.customer}</div></div>
      <div><label style="color:var(--text-secondary)">收货人</label><div>${o.consignee}</div></div>
      <div><label style="color:var(--text-secondary)">订单日期</label><div>${o.orderDate}</div></div>
      <div><label style="color:var(--text-secondary)">交货日期</label><div>${o.deliveryDate}</div></div>
      <div><label style="color:var(--text-secondary)">状态</label><div>${Format.status(o.status, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已完成': { text: '已完成', type: 'success' } })}</div></div>
      <div><label style="color:var(--text-secondary)">金额</label><div style="font-weight:600;color:var(--primary-color)">${Format.currency(o.totalAmount)}</div></div>
    </div>
    <h4 style="margin:24px 0 12px">产品明细</h4>
    <table class="data-table"><thead><tr><th>货品编码</th><th>货品名称</th><th>数量</th><th>单价</th><th>金额</th></tr></thead><tbody>
      ${o.products.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.qty}</td><td>${Format.currency(p.price)}</td><td>${Format.currency(p.qty * p.price)}</td></tr>`).join('')}
    </tbody></table>
  `});
    },
    audit(id) { Modal.confirm({ title: '审核订单', message: '确认审核通过订单 ' + id + '？', type: 'success', onOk: () => { DataService.updateSalesOrder(id, { status: '已审核', auditUser: '张明', auditTime: new Date().toLocaleString() }); this.data = DataService.getSalesOrders(); this.renderTable(); Message.success('审核通过'); } }); },
    split(id) {
        Modal.create({
            title: '订单拆分 - ' + id, size: 'lg', content: `<p>根据收货地址或产品拆分订单：</p>
    <div style="margin:16px 0"><label class="radio-item"><input type="radio" name="split" checked><span class="radio-circle"></span>按收货地址拆分</label></div>
    <div><label class="radio-item"><input type="radio" name="split"><span class="radio-circle"></span>按产品拆分</label></div>
    <p style="margin-top:16px;color:var(--text-secondary)">预计拆分为 2 个子订单</p>`, onOk: () => { DataService.updateSalesOrder(id, { status: '已拆分' }); this.data = DataService.getSalesOrders(); this.renderTable(); Message.success('订单拆分成功'); }
        });
    },
    history(id) {
        Modal.create({
            title: '状态变更记录 - ' + id, showFooter: false, content: `<div class="timeline">
    <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单创建</div><div class="timeline-time">2025-01-06 09:00 - 系统</div></div></div>
    <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单审核通过</div><div class="timeline-time">2025-01-06 14:00 - 李伟</div></div></div>
    <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">等待发货</div><div class="timeline-time">当前状态</div></div></div>
  </div>`});
    },
    batchAudit() { const sel = Table.getSelected('order-table'); if (sel.length === 0) { Message.warning('请选择订单'); return; } Modal.confirm({ title: '批量审核', message: `确认审核通过选中的 ${sel.length} 个订单？`, type: 'success', onOk: () => { sel.forEach(id => DataService.updateSalesOrder(id, { status: '已审核' })); this.data = DataService.getSalesOrders(); this.renderTable(); Message.success('批量审核完成'); } }); },
    export() { Message.success('导出成功'); }
};

// 订单拆分
Pages['order-split'] = {
    template: `
    <div class="page-header"><h1 class="page-title">订单拆分</h1><p class="page-desc">将销售订单拆分为多个发货单</p></div>
    <div class="content-card">
      <p>选择需要拆分的订单：</p>
      <div id="splittable-orders"></div>
    </div>`,
    init() {
        const orders = DataService.getSalesOrders({ status: '已审核' });
        Table.render('splittable-orders', {
            columns: [
                { key: 'id', title: '订单编号' },
                { key: 'customer', title: '客户' },
                { key: 'products', title: '产品', render: v => v[0]?.name },
                { key: 'totalAmount', title: '金额', render: v => Format.currency(v) },
                { key: 'actions', title: '操作', render: (_, row) => `<button class="btn btn-primary btn-sm" onclick="Pages['order-split'].split('${row.id}')">拆分</button>` }
            ],
            data: orders,
            emptyText: '暂无可拆分的订单'
        });
    },
    split(id) { Pages['order-list'].split(id); }
};

// 订单状态跟踪
Pages['order-status'] = {
    template: `
    <div class="page-header"><h1 class="page-title">订单状态跟踪</h1><p class="page-desc">跟踪订单全生命周期状态</p></div>
    <div class="stat-cards">
      <div class="stat-card"><div class="stat-info"><div class="stat-label">待审核</div><div class="stat-value">5</div></div><div class="stat-icon warning">📋</div></div>
      <div class="stat-card"><div class="stat-info"><div class="stat-label">生产中</div><div class="stat-value">8</div></div><div class="stat-icon info">🏭</div></div>
      <div class="stat-card"><div class="stat-info"><div class="stat-label">待发货</div><div class="stat-value">12</div></div><div class="stat-icon primary">📦</div></div>
      <div class="stat-card"><div class="stat-info"><div class="stat-label">已完成</div><div class="stat-value">156</div></div><div class="stat-icon success">✓</div></div>
    </div>
    <div class="content-card">
      <div class="tabs"><div class="tab-list"><div class="tab-item active">全部</div><div class="tab-item">待审核</div><div class="tab-item">生产中</div><div class="tab-item">待发货</div><div class="tab-item">已完成</div></div></div>
      <div id="status-table"></div>
    </div>`,
    init() {
        Table.render('status-table', {
            columns: [
                { key: 'id', title: '订单编号' },
                { key: 'customer', title: '客户' },
                { key: 'deliveryDate', title: '交货日期' },
                { key: 'status', title: '当前状态', render: v => Format.status(v, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' }, '已发货': { text: '已发货', type: 'info' }, '已完成': { text: '已完成', type: 'success' } }) },
                { key: 'actions', title: '操作', render: (_, row) => `<button class="btn btn-link" onclick="Pages['order-list'].history('${row.id}')">查看日志</button>` }
            ],
            data: DataService.getSalesOrders()
        });
    }
};
