// 三、交货单管理页面模块

// 交货单创建
Pages['delivery-create'] = {
    template: `
    <div class="page-header"><h1 class="page-title">交货单创建</h1><p class="page-desc">根据已审核销售订单创建交货单</p></div>
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">选择销售订单</h3></div>
      <div id="available-orders"></div>
      <div style="margin-top:16px;display:flex;gap:8px">
        <button class="btn btn-primary" onclick="Pages['delivery-create'].createBatch()">批量创建交货单</button>
        <button class="btn btn-default" onclick="Pages['delivery-create'].createSingle()">单个创建</button>
      </div>
    </div>`,
    init() {
        const orders = DataService.getSalesOrders().filter(o => ['已审核', '已拆分'].includes(o.status));
        Table.render('available-orders', {
            columns: [
                { key: 'id', title: '订单编号' },
                { key: 'customer', title: '客户' },
                { key: 'consignee', title: '收货人' },
                { key: 'products', title: '产品', render: v => v[0]?.name },
                { key: 'deliveryDate', title: '交货日期' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' } }) }
            ],
            data: orders, showCheckbox: true,
            emptyText: '暂无可创建交货单的订单'
        });
    },
    createBatch() {
        const sel = Table.getSelected('available-orders');
        if (sel.length === 0) { Message.warning('请选择订单'); return; }
        Modal.confirm({
            title: '批量创建交货单',
            message: `确认为选中的 ${sel.length} 个订单创建交货单？`,
            type: 'success',
            onOk: () => {
                sel.forEach(id => {
                    const o = DataService.getSalesOrderById(id);
                    if (o) DataService.addDeliveryOrder({ salesOrderId: id, customer: o.customer, consignee: o.consignee, products: o.products });
                });
                Message.success(`已创建 ${sel.length} 个交货单`);
                App.loadPage('delivery-list');
            }
        });
    },
    createSingle() {
        Modal.create({
            title: '创建交货单',
            size: 'lg',
            content: `<form class="modal-form">
        <div class="form-row"><label class="form-label required">关联销售订单</label><div class="form-content"><select class="form-control form-select">${DataService.getSalesOrders().filter(o => ['已审核', '已拆分'].includes(o.status)).map(o => `<option value="${o.id}">${o.id} - ${o.customer}</option>`).join('')}</select></div></div>
        <div class="form-row"><label class="form-label required">承运商</label><div class="form-content"><select class="form-control form-select">${DataService.getServiceProviders({ type: '承运商' }).map(s => `<option>${s.name}</option>`).join('')}</select></div></div>
        <div class="form-row"><label class="form-label">备注</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
      </form>`,
            onOk: () => { Message.success('交货单创建成功'); App.loadPage('delivery-list'); }
        });
    }
};

// 交货单列表
Pages['delivery-list'] = {
    template: `
    <div class="page-header"><h1 class="page-title">交货单列表</h1><p class="page-desc">管理所有交货单</p></div>
    <div class="search-bar">
      <div class="search-item"><label>交货单号</label><input type="text" class="form-control" placeholder="请输入"></div>
      <div class="search-item"><label>状态</label><select class="form-control form-select"><option value="">全部</option><option>待发货</option><option>运输中</option><option>已签收</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['delivery-list'].search()">🔍 搜索</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="App.loadPage('delivery-create')">+ 创建交货单</button></div></div>
      <div id="delivery-table"></div>
    </div>`,
    init() {
        Table.render('delivery-table', {
            columns: [
                { key: 'id', title: '交货单号', width: '140px' },
                { key: 'salesOrderId', title: '关联订单' },
                { key: 'customer', title: '客户' },
                { key: 'consignee', title: '收货人' },
                { key: 'carrier', title: '承运商', render: v => v || '-' },
                { key: 'trackingNo', title: '运单号', render: v => v || '-' },
                { key: 'createTime', title: '创建时间' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '待发货': { text: '待发货', type: 'warning' }, '运输中': { text: '运输中', type: 'info' }, '已签收': { text: '已签收', type: 'success' } }) },
                {
                    key: 'actions', title: '操作', width: '150px', render: (_, row) => `<div class="table-actions">
          <button class="btn btn-link" onclick="Pages['delivery-list'].view('${row.id}')">查看</button>
          ${row.status === '待发货' ? `<button class="btn btn-link" onclick="Pages['delivery-list'].ship('${row.id}')">发货</button>` : ''}
          ${row.status === '运输中' ? `<button class="btn btn-link" onclick="Pages['delivery-list'].sign('${row.id}')">签收</button>` : ''}
        </div>` }
            ],
            data: DataService.getDeliveryOrders(), showIndex: true
        });
    },
    search() { Message.success('搜索完成'); },
    view(id) { Message.info('查看交货单详情: ' + id); },
    ship(id) {
        Modal.create({
            title: '发货登记',
            content: `<form class="modal-form">
        <div class="form-row"><label class="form-label required">承运商</label><div class="form-content"><select class="form-control form-select">${DataService.getServiceProviders({ type: '承运商' }).map(s => `<option>${s.name}</option>`).join('')}</select></div></div>
        <div class="form-row"><label class="form-label required">运单号</label><div class="form-content"><input type="text" class="form-control" required placeholder="请输入运单号"></div></div>
        <div class="form-row"><label class="form-label">备注</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
      </form>`,
            onOk: () => { Message.success('发货成功'); this.init(); }
        });
    },
    sign(id) {
        Modal.confirm({
            title: '确认签收',
            message: '确认该交货单已签收？',
            type: 'success',
            onOk: () => { Message.success('签收确认成功'); this.init(); }
        });
    }
};

// 交货单关联追溯
Pages['delivery-trace'] = {
    template: `
    <div class="page-header"><h1 class="page-title">关联追溯</h1><p class="page-desc">追溯订单-交货单-出库单关联关系</p></div>
    <div class="content-card">
      <div class="search-bar" style="background:transparent;padding:0;margin-bottom:16px">
        <div class="search-item"><label>单据编号</label><input type="text" class="form-control" id="trace-input" placeholder="输入订单号、交货单号或出库单号"></div>
        <div class="search-actions"><button class="btn btn-primary" onclick="Pages['delivery-trace'].trace()">🔍 追溯</button></div>
      </div>
      <div id="trace-result"></div>
    </div>`,
    init() { document.getElementById('trace-result').innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:40px">请输入单据编号进行追溯查询</p>'; },
    trace() {
        const input = document.getElementById('trace-input').value;
        if (!input) { Message.warning('请输入单据编号'); return; }

        // 模拟追溯结果
        document.getElementById('trace-result').innerHTML = `
      <h4 style="margin-bottom:16px">追溯结果</h4>
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
        <div style="background:var(--primary-light);border:1px solid var(--primary-color);border-radius:8px;padding:16px;min-width:200px">
          <div style="color:var(--text-secondary);font-size:12px">销售订单</div>
          <div style="font-weight:600;font-size:16px;margin:4px 0">SO2025010001</div>
          <div style="font-size:12px">泰国分公司 | ¥1,200,000</div>
          <div class="status-tag info" style="margin-top:8px">已审核</div>
        </div>
        <div style="font-size:24px;color:var(--text-disabled)">→</div>
        <div style="background:#f6ffed;border:1px solid #b7eb8f;border-radius:8px;padding:16px;min-width:200px">
          <div style="color:var(--text-secondary);font-size:12px">交货单</div>
          <div style="font-weight:600;font-size:16px;margin:4px 0">DO2025010003</div>
          <div style="font-size:12px">顺丰速运 | SF1234567890</div>
          <div class="status-tag warning" style="margin-top:8px">待发货</div>
        </div>
        <div style="font-size:24px;color:var(--text-disabled)">→</div>
        <div style="background:var(--background-light);border:1px solid var(--border-color);border-radius:8px;padding:16px;min-width:200px">
          <div style="color:var(--text-secondary);font-size:12px">出库单</div>
          <div style="font-weight:600;font-size:16px;margin:4px 0">CK2025010003</div>
          <div style="font-size:12px">杭州成品仓 | 100台</div>
          <div class="status-tag default" style="margin-top:8px">待出库</div>
        </div>
      </div>
      <h4 style="margin:24px 0 16px">操作记录</h4>
      <div class="timeline">
        <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单创建</div><div class="timeline-time">2025-01-06 09:00 - 系统自动</div></div></div>
        <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单审核通过</div><div class="timeline-time">2025-01-06 14:00 - 李伟</div></div></div>
        <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">创建交货单</div><div class="timeline-time">2025-01-08 10:00 - 王芳</div></div></div>
        <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">等待发货</div><div class="timeline-time">当前状态</div></div></div>
      </div>
    `;
    }
};
