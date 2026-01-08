// 页面模块集合
window.Pages = {};

// 仪表盘页面
Pages.dashboard = {
  template: `
    <div class="page-header">
      <h1 class="page-title">工作台</h1>
      <p class="page-desc">订单履约及交付管理系统</p>
    </div>
    
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">今日订单</div>
          <div class="stat-value" id="stat-today-orders">-</div>
          <div class="stat-change up" id="stat-today-change"></div>
        </div>
        <div class="stat-icon primary">📦</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">待处理订单</div>
          <div class="stat-value" id="stat-pending">-</div>
        </div>
        <div class="stat-icon warning">⏳</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">生产中</div>
          <div class="stat-value" id="stat-production">-</div>
        </div>
        <div class="stat-icon info">🏭</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">本月交付</div>
          <div class="stat-value" id="stat-delivery">-</div>
          <div class="stat-change up" id="stat-delivery-change"></div>
        </div>
        <div class="stat-icon success">✓</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">近期订单</h3>
          <button class="btn btn-link" onclick="App.loadPage('order-list')">查看全部 →</button>
        </div>
        <div id="recent-orders"></div>
      </div>
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">待办事项</h3>
        </div>
        <div id="todo-list">
          <div style="padding:12px 0;border-bottom:1px solid var(--border-light);display:flex;align-items:center;gap:12px">
            <span style="color:var(--warning-color)">⚠</span>
            <span>3个物料库存低于安全库存</span>
            <button class="btn btn-link btn-sm" style="margin-left:auto" onclick="App.loadPage('inventory')">查看</button>
          </div>
          <div style="padding:12px 0;border-bottom:1px solid var(--border-light);display:flex;align-items:center;gap:12px">
            <span style="color:var(--info-color)">📋</span>
            <span>2个送检单待检验</span>
            <button class="btn btn-link btn-sm" style="margin-left:auto" onclick="App.loadPage('inspection')">查看</button>
          </div>
          <div style="padding:12px 0;display:flex;align-items:center;gap:12px">
            <span style="color:var(--success-color)">✓</span>
            <span>5个采购订单已到货待入库</span>
            <button class="btn btn-link btn-sm" style="margin-left:auto" onclick="App.loadPage('purchase-order')">查看</button>
          </div>
        </div>
      </div>
    </div>
  `,

  init() {
    const stats = DataService.getDashboardStats();
    document.getElementById('stat-today-orders').textContent = stats.todayOrders;
    document.getElementById('stat-today-change').textContent = `↑ ${stats.todayOrdersChange}%`;
    document.getElementById('stat-pending').textContent = stats.pendingOrders;
    document.getElementById('stat-production').textContent = stats.inProduction;
    document.getElementById('stat-delivery').textContent = stats.monthlyDelivery;
    document.getElementById('stat-delivery-change').textContent = `↑ ${stats.monthlyDeliveryChange}%`;

    const orders = DataService.getOrders().slice(0, 5);
    Table.render('recent-orders', {
      columns: [
        { key: 'id', title: '订单号', width: '130px' },
        { key: 'customerName', title: '客户' },
        { key: 'productName', title: '产品', render: v => v.length > 15 ? v.slice(0, 15) + '...' : v },
        {
          key: 'status', title: '状态', render: v => Format.status(v, {
            '待确认': { text: '待确认', type: 'default' },
            '待排产': { text: '待排产', type: 'info' },
            '生产中': { text: '生产中', type: 'warning' },
            '已发货': { text: '已发货', type: 'info' },
            '已完成': { text: '已完成', type: 'success' }
          })
        }
      ],
      data: orders
    });
  }
};

// 订单列表页面
Pages['order-list'] = {
  template: `
    <div class="page-header">
      <h1 class="page-title">订单列表</h1>
      <p class="page-desc">管理所有销售订单</p>
    </div>
    
    <div class="search-bar">
      <div class="search-item">
        <label>订单编号</label>
        <input type="text" class="form-control" id="search-order-id" placeholder="请输入订单编号">
      </div>
      <div class="search-item">
        <label>客户名称</label>
        <input type="text" class="form-control" id="search-customer" placeholder="请输入客户名称">
      </div>
      <div class="search-item">
        <label>订单状态</label>
        <select class="form-control form-select" id="search-status">
          <option value="">全部</option>
          <option value="待确认">待确认</option>
          <option value="待排产">待排产</option>
          <option value="生产中">生产中</option>
          <option value="已发货">已发货</option>
          <option value="已完成">已完成</option>
        </select>
      </div>
      <div class="search-actions">
        <button class="btn btn-primary" onclick="Pages['order-list'].search()">🔍 搜索</button>
        <button class="btn btn-default" onclick="Pages['order-list'].reset()">↻ 重置</button>
      </div>
    </div>

    <div class="content-card">
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <button class="btn btn-primary" onclick="Pages['order-list'].add()">+ 新增订单</button>
          <button class="btn btn-default" onclick="Pages['order-list'].batchDelete()">批量删除</button>
        </div>
        <div class="table-toolbar-right">
          <button class="btn btn-default" onclick="Pages['order-list'].export()">📥 导出</button>
        </div>
      </div>
      <div id="order-table"></div>
      <div id="order-pagination"></div>
    </div>
  `,

  data: [],
  currentPage: 1,
  pageSize: 10,

  init() {
    this.data = DataService.getOrders();
    this.renderTable();
  },

  renderTable() {
    const start = (this.currentPage - 1) * this.pageSize;
    const pageData = this.data.slice(start, start + this.pageSize);

    Table.render('order-table', {
      columns: [
        { key: 'id', title: '订单编号', width: '140px' },
        { key: 'customerName', title: '客户名称' },
        { key: 'productName', title: '产品名称', render: v => `<span title="${v}">${v.length > 20 ? v.slice(0, 20) + '...' : v}</span>` },
        { key: 'quantity', title: '数量', align: 'right', render: v => Format.number(v) },
        { key: 'orderDate', title: '订单日期' },
        { key: 'deliveryDate', title: '交付日期' },
        {
          key: 'status', title: '状态', render: v => Format.status(v, {
            '待确认': { text: '待确认', type: 'default' },
            '待排产': { text: '待排产', type: 'info' },
            '生产中': { text: '生产中', type: 'warning' },
            '已发货': { text: '已发货', type: 'info' },
            '已完成': { text: '已完成', type: 'success' }
          })
        },
        {
          key: 'actions', title: '操作', width: '150px', render: (_, row) => `
          <div class="table-actions">
            <button class="btn btn-link" onclick="Pages['order-list'].view('${row.id}')">查看</button>
            <button class="btn btn-link" onclick="Pages['order-list'].edit('${row.id}')">编辑</button>
            <button class="btn btn-link" style="color:var(--error-color)" onclick="Pages['order-list'].delete('${row.id}')">删除</button>
          </div>
        `}
      ],
      data: pageData,
      showCheckbox: true,
      showIndex: true
    });

    Pagination.render('order-pagination', {
      current: this.currentPage,
      pageSize: this.pageSize,
      total: this.data.length,
      onChange: (page) => { this.currentPage = page; this.renderTable(); }
    });
  },

  search() {
    const id = document.getElementById('search-order-id').value;
    const customer = document.getElementById('search-customer').value;
    const status = document.getElementById('search-status').value;

    this.data = DataService.getOrders().filter(o => {
      if (id && !o.id.toLowerCase().includes(id.toLowerCase())) return false;
      if (customer && !o.customerName.includes(customer)) return false;
      if (status && o.status !== status) return false;
      return true;
    });
    this.currentPage = 1;
    this.renderTable();
    Message.success(`搜索完成，共 ${this.data.length} 条记录`);
  },

  reset() {
    document.getElementById('search-order-id').value = '';
    document.getElementById('search-customer').value = '';
    document.getElementById('search-status').value = '';
    this.data = DataService.getOrders();
    this.currentPage = 1;
    this.renderTable();
    Message.info('已重置搜索条件');
  },

  add() {
    Modal.create({
      title: '新增订单',
      size: 'lg',
      content: this.getFormHtml(),
      onOk: () => {
        const form = document.getElementById('order-form');
        if (!FormValidator.validate(form)) return false;
        const data = FormValidator.getData(form);
        DataService.addOrder(data);
        this.data = DataService.getOrders();
        this.renderTable();
        Message.success('订单创建成功');
      }
    });
  },

  edit(id) {
    const order = DataService.getOrderById(id);
    if (!order) return;

    Modal.create({
      title: '编辑订单',
      size: 'lg',
      content: this.getFormHtml(order),
      onOk: () => {
        const form = document.getElementById('order-form');
        if (!FormValidator.validate(form)) return false;
        const data = FormValidator.getData(form);
        DataService.updateOrder(id, data);
        this.data = DataService.getOrders();
        this.renderTable();
        Message.success('订单更新成功');
      }
    });
  },

  view(id) {
    const order = DataService.getOrderById(id);
    if (!order) return;

    Modal.create({
      title: '订单详情',
      size: 'lg',
      showFooter: false,
      content: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div><label style="color:var(--text-secondary)">订单编号</label><div style="margin-top:4px;font-weight:500">${order.id}</div></div>
          <div><label style="color:var(--text-secondary)">客户名称</label><div style="margin-top:4px">${order.customerName}</div></div>
          <div><label style="color:var(--text-secondary)">产品名称</label><div style="margin-top:4px">${order.productName}</div></div>
          <div><label style="color:var(--text-secondary)">产品型号</label><div style="margin-top:4px">${order.productModel}</div></div>
          <div><label style="color:var(--text-secondary)">订单数量</label><div style="margin-top:4px">${Format.number(order.quantity)}</div></div>
          <div><label style="color:var(--text-secondary)">订单状态</label><div style="margin-top:4px">${Format.status(order.status, { '待确认': { text: '待确认', type: 'default' }, '待排产': { text: '待排产', type: 'info' }, '生产中': { text: '生产中', type: 'warning' }, '已发货': { text: '已发货', type: 'info' }, '已完成': { text: '已完成', type: 'success' } })}</div></div>
          <div><label style="color:var(--text-secondary)">订单日期</label><div style="margin-top:4px">${order.orderDate}</div></div>
          <div><label style="color:var(--text-secondary)">交付日期</label><div style="margin-top:4px">${order.deliveryDate}</div></div>
          <div><label style="color:var(--text-secondary)">进度</label><div style="margin-top:8px"><div class="progress" style="width:200px"><div class="progress-bar" style="width:${order.progress}%"></div></div><span style="font-size:12px;color:var(--text-secondary);margin-left:8px">${order.progress}%</span></div></div>
          <div><label style="color:var(--text-secondary)">优先级</label><div style="margin-top:4px">${order.priority}</div></div>
        </div>
      `
    });
  },

  delete(id) {
    Modal.confirm({
      title: '删除确认',
      message: `确定要删除订单 ${id} 吗？此操作不可恢复。`,
      type: 'danger',
      onOk: () => {
        DataService.deleteOrder(id);
        this.data = DataService.getOrders();
        this.renderTable();
        Message.success('订单已删除');
      }
    });
  },

  batchDelete() {
    const selected = Table.getSelected('order-table');
    if (selected.length === 0) {
      Message.warning('请先选择要删除的订单');
      return;
    }
    Modal.confirm({
      title: '批量删除确认',
      message: `确定要删除选中的 ${selected.length} 个订单吗？`,
      type: 'danger',
      onOk: () => {
        selected.forEach(id => DataService.deleteOrder(id));
        this.data = DataService.getOrders();
        this.renderTable();
        Message.success(`已删除 ${selected.length} 个订单`);
      }
    });
  },

  export() {
    ExportCSV.export(this.data, [
      { key: 'id', title: '订单编号' },
      { key: 'customerName', title: '客户名称' },
      { key: 'productName', title: '产品名称' },
      { key: 'quantity', title: '数量' },
      { key: 'orderDate', title: '订单日期' },
      { key: 'deliveryDate', title: '交付日期' },
      { key: 'status', title: '状态' }
    ], '订单列表.csv');
    Message.success('导出成功');
  },

  getFormHtml(data = {}) {
    return `
      <form id="order-form" class="modal-form">
        <div class="form-row"><label class="form-label required">客户名称</label><div class="form-content"><input type="text" class="form-control" name="customerName" value="${data.customerName || ''}" required placeholder="请输入客户名称"></div></div>
        <div class="form-row"><label class="form-label required">产品名称</label><div class="form-content"><input type="text" class="form-control" name="productName" value="${data.productName || ''}" required placeholder="请输入产品名称"></div></div>
        <div class="form-row"><label class="form-label">产品型号</label><div class="form-content"><input type="text" class="form-control" name="productModel" value="${data.productModel || ''}" placeholder="请输入产品型号"></div></div>
        <div class="form-row"><label class="form-label required">订单数量</label><div class="form-content"><input type="number" class="form-control" name="quantity" value="${data.quantity || ''}" required placeholder="请输入订单数量"></div></div>
        <div class="form-row"><label class="form-label required">交付日期</label><div class="form-content"><input type="date" class="form-control" name="deliveryDate" value="${data.deliveryDate || ''}" required></div></div>
        <div class="form-row"><label class="form-label">优先级</label><div class="form-content"><select class="form-control form-select" name="priority"><option value="低" ${data.priority === '低' ? 'selected' : ''}>低</option><option value="中" ${data.priority === '中' ? 'selected' : ''}>中</option><option value="高" ${data.priority === '高' ? 'selected' : ''}>高</option></select></div></div>
      </form>
    `;
  }
};
