// 二、销售管理页面模块 - 增强交互版

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
          <div class="form-row"><label class="form-label required">订单类型</label><div class="form-content"><select class="form-control form-select" name="orderType" id="create-orderType">${DataService.getOrderTypes().map(t => `<option value="${t.name}">${t.name}</option>`).join('')}</select></div></div>
          <div class="form-row"><label class="form-label required">客户</label><div class="form-content"><select class="form-control form-select" name="customer" id="create-customer" onchange="Pages['order-create'].loadConsignees(this.value)">${DataService.getCustomers().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div></div>
          <div class="form-row"><label class="form-label required">收货人</label><div class="form-content"><select class="form-control form-select" name="consignee" id="create-consignee"></select></div></div>
          <div class="form-row"><label class="form-label required">交货日期</label><div class="form-content"><input type="date" class="form-control" name="deliveryDate" id="create-deliveryDate" required></div></div>
        </div>
        <div class="card-header" style="margin-top:24px"><h3 class="card-title">产品明细</h3><button type="button" class="btn btn-dashed btn-sm" onclick="Pages['order-create'].addLine()">+ 添加行</button></div>
        <table class="data-table" id="order-lines">
          <thead><tr><th>货品编码</th><th>货品名称</th><th>数量</th><th>单价</th><th>金额</th><th>操作</th></tr></thead>
          <tbody></tbody>
          <tfoot><tr><td colspan="4" style="text-align:right;font-weight:500">合计金额：</td><td colspan="2"><strong id="total-amount" style="color:var(--primary-color);font-size:18px">¥0</strong></td></tr></tfoot>
        </table>
        <div style="display:flex;justify-content:center;gap:16px;margin-top:24px">
          <button type="button" class="btn btn-primary" onclick="Pages['order-create'].submit()">提交订单</button>
          <button type="button" class="btn btn-default" onclick="Pages['order-create'].saveDraft()">保存草稿</button>
          <button type="button" class="btn btn-default" onclick="Pages['order-create'].reset()">重置</button>
        </div>
      </form>
    </div>`,
  init() {
    this.loadConsignees(DataService.getCustomers()[0]?.name);
    this.addLine();
    document.getElementById('create-deliveryDate').value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  },
  loadConsignees(customer) {
    const consignees = DataService.getConsignees().filter(c => c.customer === customer);
    const select = document.getElementById('create-consignee');
    select.innerHTML = consignees.map(c => `<option value="${c.name}">${c.name} - ${c.address.slice(0, 20)}</option>`).join('');
    if (consignees.length === 0) select.innerHTML = '<option>请先添加收货人</option>';
  },
  addLine() {
    const tbody = document.querySelector('#order-lines tbody');
    const products = DataService.getProducts();
    const p = products[0];
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td><select class="form-control form-select" style="width:140px" onchange="Pages['order-create'].selectProduct(this)">${products.map(pr => `<option value="${pr.code}" data-name="${pr.name}" data-price="${pr.price}">${pr.code}</option>`).join('')}</select></td>
        <td class="product-name">${p?.name || '-'}</td>
        <td><input type="number" class="form-control" style="width:80px" value="1" min="1" onchange="Pages['order-create'].calcTotal()"></td>
        <td><input type="number" class="form-control" style="width:100px" value="${p?.price || 0}" onchange="Pages['order-create'].calcTotal()"></td>
        <td class="line-amount">¥${Format.number(p?.price || 0)}</td>
        <td><button type="button" class="btn btn-link" style="color:var(--error-color)" onclick="this.closest('tr').remove();Pages['order-create'].calcTotal()">删除</button></td>
      </tr>
    `);
    this.calcTotal();
  },
  selectProduct(el) {
    const opt = el.options[el.selectedIndex];
    const row = el.closest('tr');
    row.querySelector('.product-name').textContent = opt.dataset.name;
    row.querySelectorAll('input[type=number]')[1].value = opt.dataset.price;
    this.calcTotal();
  },
  calcTotal() {
    let total = 0;
    document.querySelectorAll('#order-lines tbody tr').forEach(row => {
      const qty = parseInt(row.querySelectorAll('input')[0].value) || 0;
      const price = parseFloat(row.querySelectorAll('input')[1].value) || 0;
      const amount = qty * price;
      row.querySelector('.line-amount').textContent = Format.currency(amount);
      total += amount;
    });
    document.getElementById('total-amount').textContent = Format.currency(total);
  },
  submit() {
    const orderType = document.getElementById('create-orderType').value;
    const customer = document.getElementById('create-customer').value;
    const consignee = document.getElementById('create-consignee').value;
    const deliveryDate = document.getElementById('create-deliveryDate').value;

    if (!deliveryDate) { Message.warning('请选择交货日期'); return; }

    const products = [];
    document.querySelectorAll('#order-lines tbody tr').forEach(row => {
      const code = row.querySelector('select').value;
      const name = row.querySelector('.product-name').textContent;
      const qty = parseInt(row.querySelectorAll('input')[0].value) || 0;
      const price = parseFloat(row.querySelectorAll('input')[1].value) || 0;
      if (qty > 0) products.push({ code, name, qty, price });
    });

    if (products.length === 0) { Message.warning('请添加产品明细'); return; }

    const totalAmount = products.reduce((s, p) => s + p.qty * p.price, 0);

    Modal.confirm({
      title: '提交订单确认',
      message: `确认提交订单？<br><br>客户：${customer}<br>收货人：${consignee}<br>产品数：${products.length}项<br>总金额：${Format.currency(totalAmount)}`,
      type: 'success',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          DataService.addSalesOrder({ orderType, customer, consignee, products, totalAmount, deliveryDate });
          Loading.hide();
          Message.success('订单提交成功，等待审核');
          App.loadPage('order-list');
        }, 800);
      }
    });
  },
  saveDraft() { Message.success('草稿已保存'); },
  reset() {
    document.querySelector('#order-lines tbody').innerHTML = '';
    this.addLine();
    document.getElementById('total-amount').textContent = '¥0';
    Message.info('表单已重置');
  },
  manual() { Message.info('已进入手工录入模式'); },
  import() {
    Modal.create({
      title: 'Excel导入订单',
      content: `
        <div style="border:2px dashed var(--border-color);border-radius:8px;padding:40px;text-align:center;color:var(--text-secondary);cursor:pointer" onclick="Message.info('模拟：选择文件对话框')">
          📥 拖拽Excel文件到此处或点击上传<br><small>支持 .xlsx, .xls 格式</small>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;align-items:center">
          <a href="#" class="btn btn-link" onclick="Message.success('模板下载成功')">📄 下载导入模板</a>
          <span style="color:var(--text-secondary);font-size:12px">首次导入请先下载模板</span>
        </div>
        <div style="margin-top:16px;padding:12px;background:var(--background-light);border-radius:4px">
          <div style="font-weight:500;margin-bottom:8px">导入说明：</div>
          <ul style="margin:0;padding-left:20px;font-size:13px;color:var(--text-secondary)">
            <li>必填字段：客户名称、货品编码、数量、交货日期</li>
            <li>客户名称需与系统中客户一致</li>
            <li>每行一个产品明细</li>
          </ul>
        </div>`,
      okText: '开始导入',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          Loading.hide();
          Message.success('导入成功，共3条订单');
        }, 1500);
      }
    });
  },
  api() {
    Modal.create({
      title: 'API对接配置',
      showFooter: false,
      content: `
        <div class="modal-form">
          <div class="form-row"><label class="form-label">接口地址</label><div class="form-content"><input type="text" class="form-control" value="https://api.erp.com/orders" readonly></div></div>
          <div class="form-row"><label class="form-label">认证方式</label><div class="form-content"><span class="status-tag success">OAuth 2.0</span></div></div>
          <div class="form-row"><label class="form-label">连接状态</label><div class="form-content"><span class="status-tag success">已连接</span></div></div>
          <div class="form-row"><label class="form-label">最后同步</label><div class="form-content">2025-01-08 10:30:00</div></div>
          <div class="form-row"><label class="form-label">同步频率</label><div class="form-content">每15分钟</div></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-primary" onclick="Loading.show();setTimeout(()=>{Loading.hide();Message.success('同步完成，获取5条新订单')},1500)">立即同步</button>
          <button class="btn btn-default" onclick="Message.info('配置界面')">修改配置</button>
        </div>`
    });
  }
};

// 订单列表 - 增强版
Pages['order-list'] = {
  template: `
    <div class="page-header"><h1 class="page-title">订单列表</h1><p class="page-desc">管理所有销售订单</p></div>
    <div class="search-bar">
      <div class="search-item"><label>订单编号</label><input type="text" class="form-control" id="search-oid" placeholder="请输入订单号"></div>
      <div class="search-item"><label>客户</label><select class="form-control form-select" id="search-customer"><option value="">全部</option>${DataService.getCustomers().map(c => `<option>${c.name}</option>`).join('')}</select></div>
      <div class="search-item"><label>状态</label><select class="form-control form-select" id="search-status"><option value="">全部</option><option>待审核</option><option>已审核</option><option>已拆分</option><option>已发货</option><option>已完成</option><option>已取消</option></select></div>
      <div class="search-item"><label>订单日期</label><input type="date" class="form-control" id="search-date-start" style="width:130px"> - <input type="date" class="form-control" id="search-date-end" style="width:130px"></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['order-list'].search()">🔍 搜索</button><button class="btn btn-default" onclick="Pages['order-list'].reset()">↻ 重置</button></div>
    </div>
    <div class="content-card">
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <button class="btn btn-primary" onclick="App.loadPage('order-create')">+ 新建订单</button>
          <button class="btn btn-default" onclick="Pages['order-list'].batchAudit()">批量审核</button>
          <button class="btn btn-default" onclick="Pages['order-list'].batchDelete()">批量删除</button>
        </div>
        <div class="table-toolbar-right">
          <button class="btn btn-default" onclick="Pages['order-list'].export()">📥 导出Excel</button>
          <button class="btn btn-default" onclick="Pages['order-list'].print()">🖨️ 打印</button>
        </div>
      </div>
      <div id="order-table"></div>
      <div id="order-pagination"></div>
    </div>`,
  data: [], filteredData: [], currentPage: 1, pageSize: 10,
  init() { this.data = DataService.getSalesOrders(); this.filteredData = [...this.data]; this.renderTable(); },
  renderTable() {
    const start = (this.currentPage - 1) * this.pageSize;
    const pageData = this.filteredData.slice(start, start + this.pageSize);
    Table.render('order-table', {
      columns: [
        { key: 'id', title: '订单编号', width: '140px' },
        { key: 'orderType', title: '订单类型' },
        { key: 'customer', title: '客户' },
        { key: 'products', title: '产品', render: v => v[0]?.name || '-' },
        { key: 'totalAmount', title: '金额', align: 'right', render: v => Format.currency(v) },
        { key: 'orderDate', title: '订单日期' },
        { key: 'deliveryDate', title: '交货日期' },
        { key: 'status', title: '状态', render: v => Format.status(v, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' }, '已发货': { text: '已发货', type: 'primary' }, '已完成': { text: '已完成', type: 'success' }, '已取消': { text: '已取消', type: 'default' } }) },
        {
          key: 'actions', title: '操作', width: '200px', render: (_, row) => `<div class="table-actions">
          <button class="btn btn-link" onclick="Pages['order-list'].view('${row.id}')">查看</button>
          ${row.status === '待审核' ? `<button class="btn btn-link" onclick="Pages['order-list'].audit('${row.id}')">审核</button><button class="btn btn-link" onclick="Pages['order-list'].edit('${row.id}')">编辑</button>` : ''}
          ${row.status === '已审核' ? `<button class="btn btn-link" onclick="Pages['order-list'].split('${row.id}')">拆分</button>` : ''}
          <button class="btn btn-link" onclick="Pages['order-list'].history('${row.id}')">日志</button>
          ${['待审核', '已审核'].includes(row.status) ? `<button class="btn btn-link" style="color:var(--error-color)" onclick="Pages['order-list'].delete('${row.id}')">删除</button>` : ''}
        </div>` }
      ],
      data: pageData, showCheckbox: true, showIndex: true, indexOffset: start
    });
    Pagination.render('order-pagination', { current: this.currentPage, pageSize: this.pageSize, total: this.filteredData.length, onChange: p => { this.currentPage = p; this.renderTable(); } });
  },
  search() {
    const oid = document.getElementById('search-oid').value.toLowerCase();
    const customer = document.getElementById('search-customer').value;
    const status = document.getElementById('search-status').value;
    const dateStart = document.getElementById('search-date-start').value;
    const dateEnd = document.getElementById('search-date-end').value;

    this.filteredData = this.data.filter(o => {
      if (oid && !o.id.toLowerCase().includes(oid)) return false;
      if (customer && o.customer !== customer) return false;
      if (status && o.status !== status) return false;
      if (dateStart && o.orderDate < dateStart) return false;
      if (dateEnd && o.orderDate > dateEnd) return false;
      return true;
    });
    this.currentPage = 1;
    this.renderTable();
    Message.success(`搜索完成，共${this.filteredData.length}条记录`);
  },
  reset() {
    document.getElementById('search-oid').value = '';
    document.getElementById('search-customer').value = '';
    document.getElementById('search-status').value = '';
    document.getElementById('search-date-start').value = '';
    document.getElementById('search-date-end').value = '';
    this.filteredData = [...this.data];
    this.currentPage = 1;
    this.renderTable();
    Message.info('已重置搜索条件');
  },
  view(id) {
    const o = DataService.getSalesOrderById(id);
    if (!o) return;
    Modal.create({
      title: '订单详情 - ' + id,
      size: 'lg',
      showFooter: false,
      content: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
          <div><label style="color:var(--text-secondary);font-size:12px">订单编号</label><div style="font-weight:600;font-size:16px">${o.id}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">订单类型</label><div>${o.orderType}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">状态</label><div>${Format.status(o.status, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已完成': { text: '已完成', type: 'success' } })}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">客户</label><div>${o.customer}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">收货人</label><div>${o.consignee}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">金额</label><div style="font-weight:600;color:var(--primary-color);font-size:18px">${Format.currency(o.totalAmount)}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">订单日期</label><div>${o.orderDate}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">交货日期</label><div>${o.deliveryDate}</div></div>
          <div><label style="color:var(--text-secondary);font-size:12px">审核信息</label><div>${o.auditUser ? o.auditUser + ' ' + o.auditTime : '-'}</div></div>
        </div>
        <h4 style="margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border-light)">产品明细</h4>
        <table class="data-table">
          <thead><tr><th>货品编码</th><th>货品名称</th><th>数量</th><th>单价</th><th>金额</th></tr></thead>
          <tbody>${o.products.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${p.qty}</td><td>${Format.currency(p.price)}</td><td>${Format.currency(p.qty * p.price)}</td></tr>`).join('')}</tbody>
          <tfoot><tr><td colspan="4" style="text-align:right;font-weight:500">合计</td><td style="font-weight:600">${Format.currency(o.totalAmount)}</td></tr></tfoot>
        </table>
        <div style="display:flex;gap:8px;margin-top:24px;justify-content:center">
          ${o.status === '待审核' ? `<button class="btn btn-primary" onclick="Modal.closeAll();Pages['order-list'].audit('${o.id}')">审核通过</button>` : ''}
          <button class="btn btn-default" onclick="Message.success('已复制订单信息')">复制</button>
          <button class="btn btn-default" onclick="Message.success('打印预览')">打印</button>
        </div>`
    });
  },
  edit(id) {
    const o = DataService.getSalesOrderById(id);
    if (!o) return;
    Modal.create({
      title: '编辑订单 - ' + id,
      size: 'lg',
      content: `
        <form class="modal-form">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-row"><label class="form-label">订单类型</label><div class="form-content"><select class="form-control form-select" id="edit-orderType">${DataService.getOrderTypes().map(t => `<option ${t.name === o.orderType ? 'selected' : ''}>${t.name}</option>`).join('')}</select></div></div>
            <div class="form-row"><label class="form-label">客户</label><div class="form-content"><input type="text" class="form-control" value="${o.customer}" readonly style="background:#f5f5f5"></div></div>
            <div class="form-row"><label class="form-label">收货人</label><div class="form-content"><input type="text" class="form-control" id="edit-consignee" value="${o.consignee}"></div></div>
            <div class="form-row"><label class="form-label">交货日期</label><div class="form-content"><input type="date" class="form-control" id="edit-deliveryDate" value="${o.deliveryDate}"></div></div>
          </div>
          <h4 style="margin:24px 0 12px">产品明细</h4>
          <table class="data-table"><thead><tr><th>货品编码</th><th>货品名称</th><th>数量</th><th>单价</th></tr></thead>
          <tbody>${o.products.map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td><input type="number" class="form-control" style="width:80px" value="${p.qty}"></td><td><input type="number" class="form-control" style="width:100px" value="${p.price}"></td></tr>`).join('')}</tbody></table>
        </form>`,
      onOk: () => {
        DataService.updateSalesOrder(id, {
          orderType: document.getElementById('edit-orderType').value,
          consignee: document.getElementById('edit-consignee').value,
          deliveryDate: document.getElementById('edit-deliveryDate').value
        });
        this.data = DataService.getSalesOrders();
        this.filteredData = [...this.data];
        this.renderTable();
        Message.success('订单更新成功');
      }
    });
  },
  audit(id) {
    const o = DataService.getSalesOrderById(id);
    Modal.confirm({
      title: '审核订单',
      message: `确认审核通过订单 <strong>${id}</strong>？<br><br>客户：${o?.customer}<br>金额：${Format.currency(o?.totalAmount)}`,
      type: 'success',
      okText: '通过',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          DataService.updateSalesOrder(id, { status: '已审核', auditUser: '张明', auditTime: new Date().toLocaleString() });
          this.data = DataService.getSalesOrders();
          this.filteredData = [...this.data];
          this.renderTable();
          Loading.hide();
          Message.success('审核通过');
        }, 500);
      }
    });
  },
  delete(id) {
    Modal.confirm({
      title: '删除订单',
      message: `确定删除订单 <strong>${id}</strong>？此操作不可恢复。`,
      type: 'error',
      okText: '确认删除',
      onOk: () => {
        DataService.deleteSalesOrder(id);
        this.data = DataService.getSalesOrders();
        this.filteredData = [...this.data];
        this.renderTable();
        Message.success('订单已删除');
      }
    });
  },
  split(id) {
    const o = DataService.getSalesOrderById(id);
    Modal.create({
      title: '订单拆分 - ' + id,
      size: 'lg',
      content: `
        <p style="margin-bottom:16px">将订单 <strong>${id}</strong> 拆分为多个子订单：</p>
        <div class="form-row" style="margin-bottom:16px">
          <label class="form-label">拆分方式</label>
          <div class="form-content">
            <div class="radio-group">
              <label class="radio-item"><input type="radio" name="split" value="address" checked><span class="radio-circle"></span>按收货地址拆分</label>
              <label class="radio-item"><input type="radio" name="split" value="product"><span class="radio-circle"></span>按产品拆分</label>
              <label class="radio-item"><input type="radio" name="split" value="qty"><span class="radio-circle"></span>按数量拆分</label>
            </div>
          </div>
        </div>
        <div style="background:var(--background-light);padding:16px;border-radius:8px">
          <div style="font-weight:500;margin-bottom:12px">拆分预览：</div>
          <div style="display:flex;gap:16px">
            <div style="flex:1;padding:12px;background:#fff;border:1px solid var(--border-color);border-radius:4px">
              <div style="font-weight:500">子订单1</div>
              <div style="font-size:13px;color:var(--text-secondary)">${o?.products[0]?.name} x ${Math.ceil((o?.products[0]?.qty || 0) / 2)}</div>
              <div style="font-weight:500;color:var(--primary-color)">${Format.currency((o?.totalAmount || 0) / 2)}</div>
            </div>
            <div style="flex:1;padding:12px;background:#fff;border:1px solid var(--border-color);border-radius:4px">
              <div style="font-weight:500">子订单2</div>
              <div style="font-size:13px;color:var(--text-secondary)">${o?.products[0]?.name} x ${Math.floor((o?.products[0]?.qty || 0) / 2)}</div>
              <div style="font-weight:500;color:var(--primary-color)">${Format.currency((o?.totalAmount || 0) / 2)}</div>
            </div>
          </div>
        </div>`,
      okText: '确认拆分',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          DataService.updateSalesOrder(id, { status: '已拆分' });
          this.data = DataService.getSalesOrders();
          this.filteredData = [...this.data];
          this.renderTable();
          Loading.hide();
          Message.success('订单拆分成功，生成2个子订单');
        }, 800);
      }
    });
  },
  history(id) {
    Modal.create({
      title: '状态变更记录 - ' + id,
      showFooter: false,
      content: `
        <div class="timeline">
          <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单创建</div><div class="timeline-desc">系统自动创建订单</div><div class="timeline-time">2025-01-06 09:00:00</div></div></div>
          <div class="timeline-item success"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">订单审核通过</div><div class="timeline-desc">审核人：李伟，备注：资料齐全，予以通过</div><div class="timeline-time">2025-01-06 14:00:00</div></div></div>
          <div class="timeline-item info"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">创建交货单</div><div class="timeline-desc">关联交货单：DO2025010001</div><div class="timeline-time">2025-01-07 10:00:00</div></div></div>
          <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title">等待发货</div><div class="timeline-desc">当前状态</div><div class="timeline-time">-</div></div></div>
        </div>`
    });
  },
  batchAudit() {
    const sel = Table.getSelected('order-table');
    if (sel.length === 0) { Message.warning('请选择需要审核的订单'); return; }
    const pending = sel.filter(id => DataService.getSalesOrderById(id)?.status === '待审核');
    if (pending.length === 0) { Message.warning('所选订单均非待审核状态'); return; }
    Modal.confirm({
      title: '批量审核',
      message: `确认批量审核通过选中的 <strong>${pending.length}</strong> 个订单？`,
      type: 'success',
      onOk: () => {
        Loading.show();
        setTimeout(() => {
          pending.forEach(id => DataService.updateSalesOrder(id, { status: '已审核', auditUser: '张明', auditTime: new Date().toLocaleString() }));
          this.data = DataService.getSalesOrders();
          this.filteredData = [...this.data];
          this.renderTable();
          Loading.hide();
          Message.success(`已审核通过 ${pending.length} 个订单`);
        }, 800);
      }
    });
  },
  batchDelete() {
    const sel = Table.getSelected('order-table');
    if (sel.length === 0) { Message.warning('请选择需要删除的订单'); return; }
    Modal.confirm({
      title: '批量删除',
      message: `确定删除选中的 <strong>${sel.length}</strong> 个订单？此操作不可恢复！`,
      type: 'error',
      onOk: () => {
        sel.forEach(id => DataService.deleteSalesOrder(id));
        this.data = DataService.getSalesOrders();
        this.filteredData = [...this.data];
        this.renderTable();
        Message.success(`已删除 ${sel.length} 个订单`);
      }
    });
  },
  export() {
    Loading.show();
    setTimeout(() => {
      Loading.hide();
      Message.success(`导出成功，共${this.filteredData.length}条记录`);
    }, 1000);
  },
  print() { Message.info('正在生成打印预览...'); }
};

// 订单拆分
Pages['order-split'] = {
  template: `
    <div class="page-header"><h1 class="page-title">订单拆分</h1><p class="page-desc">将销售订单拆分为多个交货单</p></div>
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">可拆分订单</h3><span style="color:var(--text-secondary);font-size:12px">仅显示已审核状态的订单</span></div>
      <div id="splittable-orders"></div>
    </div>`,
  init() {
    const orders = DataService.getSalesOrders({ status: '已审核' });
    Table.render('splittable-orders', {
      columns: [
        { key: 'id', title: '订单编号' },
        { key: 'customer', title: '客户' },
        { key: 'products', title: '产品', render: v => v[0]?.name },
        { key: 'products', title: '数量', render: v => v[0]?.qty },
        { key: 'totalAmount', title: '金额', render: v => Format.currency(v) },
        { key: 'deliveryDate', title: '交货日期' },
        { key: 'actions', title: '操作', render: (_, row) => `<button class="btn btn-primary btn-sm" onclick="Pages['order-list'].split('${row.id}')">拆分</button>` }
      ],
      data: orders,
      emptyText: '暂无可拆分的订单'
    });
  }
};

// 订单状态跟踪
Pages['order-status'] = {
  template: `
    <div class="page-header"><h1 class="page-title">订单状态跟踪</h1><p class="page-desc">跟踪订单全生命周期状态</p></div>
    <div class="stat-cards">
      <div class="stat-card" onclick="Pages['order-status'].filterByStatus('待审核')"><div class="stat-info"><div class="stat-label">待审核</div><div class="stat-value" id="stat-pending">0</div></div><div class="stat-icon warning">📋</div></div>
      <div class="stat-card" onclick="Pages['order-status'].filterByStatus('已审核')"><div class="stat-info"><div class="stat-label">待发货</div><div class="stat-value" id="stat-approved">0</div></div><div class="stat-icon info">📦</div></div>
      <div class="stat-card" onclick="Pages['order-status'].filterByStatus('已发货')"><div class="stat-info"><div class="stat-label">运输中</div><div class="stat-value" id="stat-shipping">0</div></div><div class="stat-icon primary">🚚</div></div>
      <div class="stat-card" onclick="Pages['order-status'].filterByStatus('已完成')"><div class="stat-info"><div class="stat-label">已完成</div><div class="stat-value" id="stat-completed">0</div></div><div class="stat-icon success">✓</div></div>
    </div>
    <div class="content-card">
      <div class="tabs"><div class="tab-list">
        <div class="tab-item active" onclick="Pages['order-status'].filterByStatus('')">全部</div>
        <div class="tab-item" onclick="Pages['order-status'].filterByStatus('待审核')">待审核</div>
        <div class="tab-item" onclick="Pages['order-status'].filterByStatus('已审核')">已审核</div>
        <div class="tab-item" onclick="Pages['order-status'].filterByStatus('已发货')">运输中</div>
        <div class="tab-item" onclick="Pages['order-status'].filterByStatus('已完成')">已完成</div>
      </div></div>
      <div id="status-table"></div>
    </div>`,
  currentStatus: '',
  init() {
    const orders = DataService.getSalesOrders();
    document.getElementById('stat-pending').textContent = orders.filter(o => o.status === '待审核').length;
    document.getElementById('stat-approved').textContent = orders.filter(o => ['已审核', '已拆分'].includes(o.status)).length;
    document.getElementById('stat-shipping').textContent = orders.filter(o => o.status === '已发货').length;
    document.getElementById('stat-completed').textContent = orders.filter(o => o.status === '已完成').length;
    this.renderTable(orders);
  },
  filterByStatus(status) {
    this.currentStatus = status;
    document.querySelectorAll('.tab-item').forEach((t, i) => t.classList.toggle('active',
      (status === '' && i === 0) || (status === '待审核' && i === 1) || (status === '已审核' && i === 2) || (status === '已发货' && i === 3) || (status === '已完成' && i === 4)
    ));
    const orders = status ? DataService.getSalesOrders({ status }) : DataService.getSalesOrders();
    this.renderTable(orders);
  },
  renderTable(data) {
    Table.render('status-table', {
      columns: [
        { key: 'id', title: '订单编号' },
        { key: 'customer', title: '客户' },
        { key: 'totalAmount', title: '金额', render: v => Format.currency(v) },
        { key: 'orderDate', title: '订单日期' },
        { key: 'deliveryDate', title: '交货日期' },
        { key: 'status', title: '当前状态', render: v => Format.status(v, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' }, '已发货': { text: '已发货', type: 'primary' }, '已完成': { text: '已完成', type: 'success' } }) },
        { key: 'actions', title: '操作', render: (_, row) => `<button class="btn btn-link" onclick="Pages['order-list'].view('${row.id}')">查看</button><button class="btn btn-link" onclick="Pages['order-list'].history('${row.id}')">日志</button>` }
      ],
      data
    });
  }
};
