// 三、交货单管理页面模块 - 增强交互版

// 交货单创建
Pages['delivery-create'] = {
  template: `
    <div class="page-header"><h1 class="page-title">交货单创建</h1><p class="page-desc">根据已审核销售订单创建交货单</p></div>
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">选择销售订单</h3><span style="color:var(--text-secondary);font-size:12px">已选择 <strong id="selected-count">0</strong> 个订单</span></div>
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
        { key: 'products', title: '数量', render: v => v[0]?.qty },
        { key: 'deliveryDate', title: '交期' },
        { key: 'status', title: '状态', render: v => Format.status(v, { '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' } }) }
      ],
      data: orders,
      showCheckbox: true,
      emptyText: '暂无可创建交货单的订单',
      onSelect: () => {
        const count = Table.getSelected('available-orders').length;
        document.getElementById('selected-count').textContent = count;
      }
    });
  },
  createBatch() {
    const sel = Table.getSelected('available-orders');
    if (sel.length === 0) { Message.warning('请选择订单'); return; }

    Modal.confirm({
      title: '批量创建交货单',
      message: `确认为选中的 <strong>${sel.length}</strong> 个订单创建交货单？<br><br>将自动关联对应客户和收货人信息。`,
      type: 'success',
      okText: '确认创建',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          sel.forEach(id => {
            const o = DataService.getSalesOrderById(id);
            if (o) {
              DataService.addDeliveryOrder({ salesOrderId: id, customer: o.customer, consignee: o.consignee, products: o.products });
            }
          });
          Loading.hide();
          Message.success(`已创建 ${sel.length} 个交货单`);
          App.loadPage('delivery-list');
        }, 1000);
      }
    });
  },
  createSingle() {
    const orders = DataService.getSalesOrders().filter(o => ['已审核', '已拆分'].includes(o.status));
    Modal.create({
      title: '创建交货单',
      size: 'lg',
      content: `
        <form class="modal-form">
          <div class="form-row">
            <label class="form-label required">关联销售订单</label>
            <div class="form-content">
              <select class="form-control form-select" id="create-delivery-order" onchange="Pages['delivery-create'].loadOrderInfo(this.value)">
                <option value="">请选择订单</option>
                ${orders.map(o => `<option value="${o.id}">${o.id} - ${o.customer} - ${Format.currency(o.totalAmount)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div id="order-info" style="display:none;background:var(--background-light);padding:16px;border-radius:8px;margin:16px 0">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
              <div><span style="color:var(--text-secondary)">客户：</span><span id="info-customer">-</span></div>
              <div><span style="color:var(--text-secondary)">收货人：</span><span id="info-consignee">-</span></div>
              <div><span style="color:var(--text-secondary)">产品：</span><span id="info-product">-</span></div>
              <div><span style="color:var(--text-secondary)">数量：</span><span id="info-qty">-</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">承运商</label>
            <div class="form-content">
              <select class="form-control form-select" id="create-delivery-carrier">
                <option value="">请选择承运商</option>
                ${DataService.getServiceProviders({ type: '承运商' }).map(s => `<option>${s.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">备注</label>
            <div class="form-content"><textarea class="form-control" rows="2" id="create-delivery-remark" placeholder="可填写发货要求等"></textarea></div>
          </div>
        </form>`,
      onOk: () => {
        const orderId = document.getElementById('create-delivery-order').value;
        const carrier = document.getElementById('create-delivery-carrier').value;
        if (!orderId) { Message.warning('请选择订单'); return false; }
        if (!carrier) { Message.warning('请选择承运商'); return false; }

        const o = DataService.getSalesOrderById(orderId);
        Loading.show();
        setTimeout(() => {
          DataService.addDeliveryOrder({ salesOrderId: orderId, customer: o.customer, consignee: o.consignee, products: o.products, carrier });
          Loading.hide();
          Message.success('交货单创建成功');
          App.loadPage('delivery-list');
        }, 800);
      }
    });
  },
  loadOrderInfo(id) {
    const o = DataService.getSalesOrderById(id);
    const info = document.getElementById('order-info');
    if (o) {
      info.style.display = 'block';
      document.getElementById('info-customer').textContent = o.customer;
      document.getElementById('info-consignee').textContent = o.consignee;
      document.getElementById('info-product').textContent = o.products[0]?.name || '-';
      document.getElementById('info-qty').textContent = o.products[0]?.qty || '-';
    } else {
      info.style.display = 'none';
    }
  }
};

// 交货单列表 - 增强版
Pages['delivery-list'] = {
  template: `
    <div class="page-header"><h1 class="page-title">交货单列表</h1><p class="page-desc">管理所有交货单</p></div>
    <div class="search-bar">
      <div class="search-item"><label>交货单号</label><input type="text" class="form-control" id="search-did" placeholder="请输入"></div>
      <div class="search-item"><label>客户</label><select class="form-control form-select" id="search-d-customer"><option value="">全部</option>${DataService.getCustomers().map(c => `<option>${c.name}</option>`).join('')}</select></div>
      <div class="search-item"><label>状态</label><select class="form-control form-select" id="search-d-status"><option value="">全部</option><option>待发货</option><option>运输中</option><option>已签收</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['delivery-list'].search()">🔍 搜索</button><button class="btn btn-default" onclick="Pages['delivery-list'].reset()">↻ 重置</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <button class="btn btn-primary" onclick="App.loadPage('delivery-create')">+ 创建交货单</button>
          <button class="btn btn-default" onclick="Pages['delivery-list'].batchShip()">批量发货</button>
        </div>
        <div class="table-toolbar-right">
          <button class="btn btn-default" onclick="Pages['delivery-list'].export()">📥 导出</button>
        </div>
      </div>
      <div id="delivery-table"></div>
      <div id="delivery-pagination"></div>
    </div>`,
  data: [], filteredData: [], currentPage: 1,
  init() { this.data = DataService.getDeliveryOrders(); this.filteredData = [...this.data]; this.renderTable(); },
  renderTable() {
    const start = (this.currentPage - 1) * 10;
    const pageData = this.filteredData.slice(start, start + 10);
    Table.render('delivery-table', {
      columns: [
        { key: 'id', title: '交货单号', width: '140px' },
        { key: 'salesOrderId', title: '关联订单' },
        { key: 'customer', title: '客户' },
        { key: 'consignee', title: '收货人' },
        { key: 'carrier', title: '承运商', render: v => v || '<span style="color:var(--text-disabled)">待指定</span>' },
        { key: 'trackingNo', title: '运单号', render: v => v || '-' },
        { key: 'createTime', title: '创建时间' },
        { key: 'status', title: '状态', render: v => Format.status(v, { '待发货': { text: '待发货', type: 'warning' }, '运输中': { text: '运输中', type: 'primary' }, '已签收': { text: '已签收', type: 'success' } }) },
        {
          key: 'actions', title: '操作', width: '180px', render: (_, row) => `<div class="table-actions">
          <button class="btn btn-link" onclick="Pages['delivery-list'].view('${row.id}')">查看</button>
          ${row.status === '待发货' ? `<button class="btn btn-link" onclick="Pages['delivery-list'].ship('${row.id}')">发货</button>` : ''}
          ${row.status === '运输中' ? `<button class="btn btn-link" onclick="Pages['delivery-list'].track('${row.id}')">跟踪</button><button class="btn btn-link" onclick="Pages['delivery-list'].sign('${row.id}')">签收</button>` : ''}
          ${row.status === '已签收' ? `<button class="btn btn-link" onclick="Pages['delivery-list'].pod('${row.id}')">回单</button>` : ''}
        </div>` }
      ],
      data: pageData, showCheckbox: true, showIndex: true, indexOffset: start
    });
    Pagination.render('delivery-pagination', { current: this.currentPage, pageSize: 10, total: this.filteredData.length, onChange: p => { this.currentPage = p; this.renderTable(); } });
  },
  search() {
    const did = document.getElementById('search-did').value.toLowerCase();
    const customer = document.getElementById('search-d-customer').value;
    const status = document.getElementById('search-d-status').value;

    this.filteredData = this.data.filter(d => {
      if (did && !d.id.toLowerCase().includes(did)) return false;
      if (customer && d.customer !== customer) return false;
      if (status && d.status !== status) return false;
      return true;
    });
    this.currentPage = 1;
    this.renderTable();
    Message.success(`搜索完成，共${this.filteredData.length}条记录`);
  },
  reset() {
    document.getElementById('search-did').value = '';
    document.getElementById('search-d-customer').value = '';
    document.getElementById('search-d-status').value = '';
    this.filteredData = [...this.data];
    this.currentPage = 1;
    this.renderTable();
  },
  view(id) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    Modal.create({
      title: '交货单详情 - ' + id,
      size: 'lg',
      showFooter: false,
      content: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
          <div><label style="color:var(--text-secondary);font-size:12px">交货单号</label><div style="font-weight:600">${d.id}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">关联订单</label><div><a href="#" onclick="Modal.closeAll();Pages['order-list'].view('${d.salesOrderId}')">${d.salesOrderId}</a></div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">状态</label><div>${Format.status(d.status, { '待发货': { text: '待发货', type: 'warning' }, '运输中': { text: '运输中', type: 'primary' }, '已签收': { text: '已签收', type: 'success' } })}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">客户</label><div>${d.customer}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">收货人</label><div>${d.consignee}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">承运商</label><div>${d.carrier || '-'}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">运单号</label><div>${d.trackingNo || '-'}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">创建时间</label><div>${d.createTime}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">发货时间</label><div>${d.shipTime || '-'}</div></div>
        </div>
        <h4 style="margin-bottom:12px">产品明细</h4>
        <table class="data-table">
          <thead><tr><th>货品编码</th><th>货品名称</th><th>数量</th></tr></thead>
          <tbody>${d.products.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.qty}</td></tr>`).join('')}</tbody>
        </table>`
    });
  },
  ship(id) {
    Modal.create({
      title: '发货登记 - ' + id,
      content: `
        <form class="modal-form">
          <div class="form-row">
            <label class="form-label required">承运商</label>
            <div class="form-content">
              <select class="form-control form-select" id="ship-carrier">
                ${DataService.getServiceProviders({ type: '承运商' }).map(s => `<option>${s.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">运单号</label>
            <div class="form-content"><input type="text" class="form-control" id="ship-tracking" placeholder="请输入运单号"></div>
          </div>
          <div class="form-row">
            <label class="form-label">发货时间</label>
            <div class="form-content"><input type="datetime-local" class="form-control" id="ship-time" value="${new Date().toISOString().slice(0, 16)}"></div>
          </div>
          <div class="form-row">
            <label class="form-label">备注</label>
            <div class="form-content"><textarea class="form-control" rows="2" placeholder="发货备注"></textarea></div>
          </div>
        </form>`,
      okText: '确认发货',
      onOk: () => {
        const tracking = document.getElementById('ship-tracking').value;
        if (!tracking) { Message.warning('请输入运单号'); return false; }

        Loading.show();
        setTimeout(() => {
          const idx = this.data.findIndex(d => d.id === id);
          if (idx !== -1) {
            this.data[idx].status = '运输中';
            this.data[idx].carrier = document.getElementById('ship-carrier').value;
            this.data[idx].trackingNo = tracking;
            this.data[idx].shipTime = document.getElementById('ship-time').value.replace('T', ' ');
          }
          this.filteredData = [...this.data];
          this.renderTable();
          Loading.hide();
          Message.success('发货成功');
        }, 800);
      }
    });
  },
  track(id) {
    const d = this.data.find(x => x.id === id);
    Modal.create({
      title: '物流跟踪 - ' + (d?.trackingNo || id),
      showFooter: false,
      content: `
        <div style="padding:16px;background:var(--background-light);border-radius:8px;margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600">${d?.carrier || '承运商'}</div>
              <div style="color:var(--text-secondary);font-size:13px">运单号：${d?.trackingNo}</div>
            </div>
            <span class="status-tag primary">运输中</span>
          </div>
        </div>
        <div class="timeline">
          <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">已发货</div><div class="timeline-desc">货物已从杭州仓库发出</div><div class="timeline-time">${d?.shipTime || '2025-01-08 10:00'}</div></div></div>
          <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">运输中</div><div class="timeline-desc">货物已到达上海中转站</div><div class="timeline-time">2025-01-08 18:00</div></div></div>
          <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">派送中</div><div class="timeline-desc">货物正在派送途中，预计明日送达</div><div class="timeline-time">2025-01-09 08:00</div></div></div>
        </div>`
    });
  },
  sign(id) {
    Modal.confirm({
      title: '确认签收',
      message: `确认交货单 <strong>${id}</strong> 已签收？<br><br>签收后将自动更新订单状态为已完成。`,
      type: 'success',
      okText: '确认签收',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          const idx = this.data.findIndex(d => d.id === id);
          if (idx !== -1) this.data[idx].status = '已签收';
          this.filteredData = [...this.data];
          this.renderTable();
          Loading.hide();
          Message.success('签收确认成功');
        }, 500);
      }
    });
  },
  pod(id) {
    Modal.create({
      title: '签收回单 - ' + id,
      showFooter: false,
      content: `
        <div style="text-align:center;padding:20px">
          <div style="font-size:48px;margin-bottom:16px">✅</div>
          <div style="font-weight:600;font-size:18px;margin-bottom:8px">已签收</div>
          <div style="color:var(--text-secondary)">签收人：${this.data.find(d => d.id === id)?.consignee || '收货人'}</div>
          <div style="color:var(--text-secondary)">签收时间：2025-01-10 14:30</div>
        </div>
        <div style="border:2px dashed var(--border-color);border-radius:8px;padding:30px;text-align:center;color:var(--text-secondary);margin-top:16px">
          📎 暂无回单附件<br>
          <button class="btn btn-link" onclick="Message.info('上传回单')">点击上传</button>
        </div>`
    });
  },
  batchShip() {
    const sel = Table.getSelected('delivery-table');
    const pending = sel.filter(id => this.data.find(d => d.id === id)?.status === '待发货');
    if (pending.length === 0) { Message.warning('请选择待发货的交货单'); return; }
    Modal.confirm({
      title: '批量发货',
      message: `确认批量发货选中的 <strong>${pending.length}</strong> 个交货单？`,
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          pending.forEach(id => {
            const idx = this.data.findIndex(d => d.id === id);
            if (idx !== -1) {
              this.data[idx].status = '运输中';
              this.data[idx].carrier = '顺丰速运';
              this.data[idx].trackingNo = 'SF' + Date.now() + Math.floor(Math.random() * 1000);
              this.data[idx].shipTime = new Date().toLocaleString();
            }
          });
          this.filteredData = [...this.data];
          this.renderTable();
          Loading.hide();
          Message.success(`已发货 ${pending.length} 个交货单`);
        }, 1000);
      }
    });
  },
  export() { Loading.show(); setTimeout(() => { Loading.hide(); Message.success('导出成功'); }, 800); }
};

// 交货单关联追溯 - 增强版
Pages['delivery-trace'] = {
  template: `
    <div class="page-header"><h1 class="page-title">关联追溯</h1><p class="page-desc">追溯订单-交货单-出库单关联关系</p></div>
    <div class="content-card">
      <div class="search-bar" style="background:transparent;padding:0;margin-bottom:16px">
        <div class="search-item"><label>单据编号</label><input type="text" class="form-control" id="trace-input" placeholder="输入订单号、交货单号或出库单号" style="width:300px"></div>
        <div class="search-item"><label>单据类型</label><select class="form-control form-select" id="trace-type"><option>自动识别</option><option>销售订单</option><option>交货单</option></select></div>
        <div class="search-actions"><button class="btn btn-primary" onclick="Pages['delivery-trace'].trace()">🔍 追溯查询</button></div>
      </div>
      <div id="trace-result"></div>
    </div>
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">最近追溯记录</h3></div>
      <div id="trace-history"></div>
    </div>`,
  init() {
    document.getElementById('trace-result').innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:40px">请输入单据编号进行追溯查询</p>';
    Table.render('trace-history', {
      columns: [
        { key: 'time', title: '查询时间' },
        { key: 'docNo', title: '单据编号' },
        { key: 'type', title: '类型' },
        { key: 'result', title: '追溯结果' },
        { key: 'actions', title: '操作', render: (_, row) => `<button class="btn btn-link" onclick="document.getElementById('trace-input').value='${row.docNo}';Pages['delivery-trace'].trace()">再次查询</button>` }
      ],
      data: [
        { time: '2025-01-08 10:30', docNo: 'SO2025010001', type: '销售订单', result: '订单→交货单→运输中' },
        { time: '2025-01-08 09:15', docNo: 'DO2025010002', type: '交货单', result: '已关联订单SO2025010005，已签收' },
        { time: '2025-01-07 16:00', docNo: 'SO2025010004', type: '销售订单', result: '订单→交货单→已签收' }
      ]
    });
  },
  trace() {
    const input = document.getElementById('trace-input').value.trim();
    if (!input) { Message.warning('请输入单据编号'); return; }

    Loading.show();
    setTimeout(() => {
      Loading.hide();

      // 模拟追溯逻辑
      let order = DataService.getSalesOrders().find(o => o.id === input);
      let delivery = DataService.getDeliveryOrders().find(d => d.id === input || d.salesOrderId === input);

      if (!order && delivery) {
        order = DataService.getSalesOrderById(delivery.salesOrderId);
      }
      if (!order && !delivery) {
        order = DataService.getSalesOrders()[0];
        delivery = DataService.getDeliveryOrders().find(d => d.salesOrderId === order.id);
      }

      document.getElementById('trace-result').innerHTML = `
        <h4 style="margin-bottom:16px">追溯结果 - ${input}</h4>
        <div style="display:flex;align-items:stretch;gap:16px;flex-wrap:wrap">
          <div style="flex:1;min-width:220px;background:var(--primary-light);border:2px solid var(--primary-color);border-radius:8px;padding:16px;position:relative">
            <div style="position:absolute;top:-10px;left:16px;background:var(--primary-color);color:#fff;font-size:11px;padding:2px 8px;border-radius:10px">销售订单</div>
            <div style="font-weight:600;font-size:16px;margin:8px 0 4px">${order?.id || 'SO2025010001'}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${order?.customer || '泰国分公司'}</div>
            <div style="font-size:13px">${Format.currency(order?.totalAmount || 1200000)}</div>
            <div style="margin-top:8px">${Format.status(order?.status || '已审核', { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已完成': { text: '已完成', type: 'success' } })}</div>
            <button class="btn btn-link btn-sm" style="margin-top:8px" onclick="Pages['order-list'].view('${order?.id || 'SO2025010001'}')">查看详情</button>
          </div>
          
          <div style="display:flex;align-items:center;font-size:24px;color:var(--primary-color)">→</div>
          
          <div style="flex:1;min-width:220px;background:${delivery ? '#f6ffed' : 'var(--background-light)'};border:2px solid ${delivery ? '#b7eb8f' : 'var(--border-color)'};border-radius:8px;padding:16px;position:relative">
            <div style="position:absolute;top:-10px;left:16px;background:${delivery ? 'var(--success-color)' : 'var(--text-secondary)'};color:#fff;font-size:11px;padding:2px 8px;border-radius:10px">交货单</div>
            ${delivery ? `
              <div style="font-weight:600;font-size:16px;margin:8px 0 4px">${delivery.id}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${delivery.carrier || '待指定承运商'}</div>
              <div style="font-size:13px">${delivery.trackingNo || '待发货'}</div>
              <div style="margin-top:8px">${Format.status(delivery.status, { '待发货': { text: '待发货', type: 'warning' }, '运输中': { text: '运输中', type: 'primary' }, '已签收': { text: '已签收', type: 'success' } })}</div>
              <button class="btn btn-link btn-sm" style="margin-top:8px" onclick="Pages['delivery-list'].view('${delivery.id}')">查看详情</button>
            ` : `
              <div style="text-align:center;padding:20px;color:var(--text-secondary)">
                <div style="font-size:24px;margin-bottom:8px">📦</div>
                <div>暂无交货单</div>
                <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="App.loadPage('delivery-create')">创建交货单</button>
              </div>
            `}
          </div>
          
          <div style="display:flex;align-items:center;font-size:24px;color:var(--text-disabled)">→</div>
          
          <div style="flex:1;min-width:220px;background:var(--background-light);border:2px solid var(--border-color);border-radius:8px;padding:16px;position:relative">
            <div style="position:absolute;top:-10px;left:16px;background:var(--text-secondary);color:#fff;font-size:11px;padding:2px 8px;border-radius:10px">出库单</div>
            ${delivery?.status === '已签收' ? `
              <div style="font-weight:600;font-size:16px;margin:8px 0 4px">CK${delivery.id.replace('DO', '')}</div>
              <div style="font-size:13px;color:var(--text-secondary)">杭州成品仓</div>
              <div style="font-size:13px">${delivery.products[0]?.qty}${delivery.products[0]?.code?.includes('INV') ? '台' : '个'}</div>
              <div style="margin-top:8px"><span class="status-tag success">已出库</span></div>
            ` : `
              <div style="text-align:center;padding:20px;color:var(--text-secondary)">
                <div style="font-size:24px;margin-bottom:8px">🏭</div>
                <div>待出库</div>
              </div>
            `}
          </div>
        </div>
        
        <h4 style="margin:24px 0 16px">操作记录</h4>
        <div class="timeline">
          <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单创建</div><div class="timeline-desc">系统自动创建</div><div class="timeline-time">${order?.orderDate || '2025-01-06'} 09:00</div></div></div>
          <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单审核通过</div><div class="timeline-desc">审核人：${order?.auditUser || '李伟'}</div><div class="timeline-time">${order?.auditTime || '2025-01-06 14:00'}</div></div></div>
          ${delivery ? `<div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">创建交货单</div><div class="timeline-desc">交货单号：${delivery.id}</div><div class="timeline-time">${delivery.createTime} 10:00</div></div></div>` : ''}
          ${delivery?.status !== '待发货' ? `<div class="timeline-item ${delivery?.status === '已签收' ? 'success' : 'active'}"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">${delivery?.status === '已签收' ? '已签收' : '运输中'}</div><div class="timeline-desc">${delivery?.carrier} ${delivery?.trackingNo}</div><div class="timeline-time">${delivery?.shipTime || ''}</div></div></div>` : ''}
          ${delivery?.status !== '已签收' && delivery?.status !== '待发货' ? '' : delivery?.status === '待发货' ? `<div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">等待发货</div><div class="timeline-desc">当前状态</div><div class="timeline-time">-</div></div></div>` : ''}
        </div>
      `;
    }, 800);
  }
};
