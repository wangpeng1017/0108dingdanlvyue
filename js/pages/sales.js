// 二、销售管理页面模块 - PPS预测提报版

// PPS API 配置 - 使用相对路径，通过 nginx 代理
const PPS_API = {
  // API 路径（相对路径，与页面同域名）
  path: '/api/pps/forecast/ppsBaseIncrementalForecast/otherAdd',

  // 获取完整的 API URL（自动使用页面同域名）
  get url() {
    // 使用当前页面的协议和域名，只需要拼接路径
    return window.location.origin + this.path;
  },

  // Token
  token: ''
};

// 订单录入 - PPS预测提报
Pages['order-create'] = {
  template: `
    <div class="page-header"><h1 class="page-title">PPS预测提报</h1><p class="page-desc">增量预测提报手工录入</p></div>
    <div class="content-card">
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <button class="btn btn-primary" onclick="Pages['order-create'].manual()">📝 手工录入</button>
        <button class="btn btn-default" onclick="Pages['order-create'].import()">📥 Excel导入</button>
        <button class="btn btn-default" onclick="Pages['order-create'].api()">🔗 API对接</button>
      </div>
      <div class="card-header"><h3 class="card-title">快速录入</h3></div>
      <form id="order-form" class="modal-form">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-row">
            <label class="form-label required">预测版本号</label>
            <div class="form-content">
              <input type="text" class="form-control" name="forecastVersion" id="forecastVersion" value="FC202601_V2.0" placeholder="如: FC202601_V2.0">
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">客户编号</label>
            <div class="form-content">
              <input type="text" class="form-control" name="customerCode" id="customerCode" value="CS03" placeholder="如: CS03" onchange="Pages['order-create'].onCustomerChange()">
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">客户名称</label>
            <div class="form-content">
              <input type="text" class="form-control" name="customerName" id="customerName" value="客户01" placeholder="客户名称">
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">要货月份</label>
            <div class="form-content">
              <input type="month" class="form-control" name="month" id="month" value="2026-02">
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">要货需求日</label>
            <div class="form-content">
              <input type="date" class="form-control" name="day" id="day" placeholder="具体需求日">
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">概率</label>
            <div class="form-content">
              <select class="form-control form-select" name="probability" id="probability">
                <option value="high">高概率 (high)</option>
                <option value="medium">中概率 (medium)</option>
                <option value="low">低概率 (low)</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label required">是否纳入预测</label>
            <div class="form-content">
              <select class="form-control form-select" name="hasForecast" id="hasForecast">
                <option value="1">是</option>
                <option value="0">否</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">备注</label>
            <div class="form-content">
              <input type="text" class="form-control" name="remark" id="remark" placeholder="备注信息">
            </div>
          </div>
        </div>
        <div class="card-header" style="margin-top:24px">
          <h3 class="card-title">产品明细</h3>
          <button type="button" class="btn btn-dashed btn-sm" onclick="Pages['order-create'].addLine()">+ 添加行</button>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table" id="order-lines">
            <thead>
              <tr>
                <th>物料编号</th>
                <th>物料名称</th>
                <th>规格型号</th>
                <th>产品大类</th>
                <th>产品中类</th>
                <th>产品小类</th>
                <th>计划策略</th>
                <th>分档</th>
                <th>数量</th>
                <th>单位</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div style="display:flex;justify-content:center;gap:16px;margin-top:24px">
          <button type="button" class="btn btn-primary" onclick="Pages['order-create'].submit()">提交预测</button>
          <button type="button" class="btn btn-default" onclick="Pages['order-create'].saveDraft()">保存草稿</button>
          <button type="button" class="btn btn-default" onclick="Pages['order-create'].reset()">重置</button>
        </div>
      </form>
    </div>`,

  productData: [
    {
      materialCode: '10101010001',
      materialName: 'TOP 1212哑光封装',
      specification: 'XF-ADB1212-T-SASA-LC',
      productLarge: 'CPDL_001',
      productLargeText: 'TOP',
      productMedium: 'CPZL_1212',
      productMediumText: '1212',
      productSmall: 'CPXL_001',
      productSmallText: 'XF-ADB1212-T',
      planningStrategy: 'CP',
      binCode: 'A',
      unit: 'Pcs',
      unitName: 'Pcs'
    }
  ],

  customerData: [
    { code: 'CS01', name: '客户01' },
    { code: 'CS02', name: '客户02' },
    { code: 'CS03', name: '客户03' },
    { code: 'CS04', name: '正泰电源' }
  ],

  init() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthStr = nextMonth.toISOString().slice(0, 7);
    document.getElementById('month').value = monthStr;
    const version = 'FC202601_V2.0';
    document.getElementById('forecastVersion').value = version;
    this.addLine();
  },

  onCustomerChange() {
    const code = document.getElementById('customerCode').value;
    const customer = this.customerData.find(c => c.code === code);
    if (customer) {
      document.getElementById('customerName').value = customer.name;
    }
  },

  addLine() {
    const tbody = document.querySelector('#order-lines tbody');
    const p = this.productData[0];
    tbody.insertAdjacentHTML('beforeend', `
      <tr data-index="${tbody.children.length}">
        <td>
          <select class="form-control form-select" style="width:130px" onchange="Pages['order-create'].selectProduct(this)">
            ${this.productData.map(pr => '<option value="' + pr.materialCode + '" data-code="' + pr.materialCode + '" data-name="' + pr.materialName + '" data-spec="' + pr.specification + '" data-large="' + pr.productLargeText + '" data-medium="' + pr.productMediumText + '" data-small="' + pr.productSmallText + '" data-strategy="' + pr.planningStrategy + '" data-bin="' + pr.binCode + '" data-unit="' + pr.unitName + '">' + pr.materialCode + '</option>').join('')}
          </select>
        </td>
        <td class="material-name">${p?.materialName || '-'}</td>
        <td class="specification">${p?.specification || '-'}</td>
        <td class="product-large">${p?.productLargeText || '-'}</td>
        <td class="product-medium">${p?.productMediumText || '-'}</td>
        <td class="product-small">${p?.productSmallText || '-'}</td>
        <td class="planning-strategy">${p?.planningStrategy || '-'}</td>
        <td class="bin-code">${p?.binCode || '-'}</td>
        <td><input type="number" class="form-control qty-input" style="width:100px" value="20000000" min="1" step="1000"></td>
        <td class="unit">${p?.unitName || '-'}</td>
        <td><button type="button" class="btn btn-link" style="color:var(--error-color)" onclick="this.closest('tr').remove()">删除</button></td>
      </tr>
    `);
  },

  selectProduct(el) {
    const opt = el.options[el.selectedIndex];
    const row = el.closest('tr');
    row.querySelector('.material-name').textContent = opt.dataset.name || '-';
    row.querySelector('.specification').textContent = opt.dataset.spec || '-';
    row.querySelector('.product-large').textContent = opt.dataset.large || '-';
    row.querySelector('.product-medium').textContent = opt.dataset.medium || '-';
    row.querySelector('.product-small').textContent = opt.dataset.small || '-';
    row.querySelector('.planning-strategy').textContent = opt.dataset.strategy || '-';
    row.querySelector('.bin-code').textContent = opt.dataset.bin || '-';
    row.querySelector('.unit').textContent = opt.dataset.unit || '-';
  },

  submit() {
    const forecastVersion = document.getElementById('forecastVersion').value.trim();
    const customerCode = document.getElementById('customerCode').value.trim();
    const customerName = document.getElementById('customerName').value.trim();
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const probability = document.getElementById('probability').value;
    const hasForecast = document.getElementById('hasForecast').value;
    const remark = document.getElementById('remark').value.trim();

    if (!forecastVersion) { Message.warning('请输入预测版本号'); return; }
    if (!customerCode) { Message.warning('请输入客户编号'); return; }
    if (!customerName) { Message.warning('请输入客户名称'); return; }
    if (!month) { Message.warning('请选择要货月份'); return; }

    const products = [];
    document.querySelectorAll('#order-lines tbody tr').forEach(row => {
      const select = row.querySelector('select');
      const opt = select.options[select.selectedIndex];
      const qty = parseInt(row.querySelector('.qty-input').value) || 0;
      if (qty > 0) {
        products.push({
          forecastVersion: forecastVersion,
          customerCode: customerCode,
          customerName: customerName,
          materialCode: opt.dataset.code || opt.value,
          materialName: opt.dataset.name || '',
          specification: opt.dataset.spec || '',
          productLarge: 'CPDL_001',
          productLargeText: opt.dataset.large || '',
          productMedium: 'CPZL_1212',
          productMediumText: opt.dataset.medium || '',
          productSmall: 'CPXL_001',
          productSmallText: opt.dataset.small || '',
          planningStrategy: opt.dataset.strategy || '',
          binCode: opt.dataset.bin || '',
          qty: qty,
          unit: 'Pcs',
          unitName: opt.dataset.unit || '',
          month: month,
          day: day,
          probability: probability,
          hasForecast: hasForecast,
          remark: remark
        });
      }
    });

    if (products.length === 0) { Message.warning('请添加产品明细'); return; }

    Modal.confirm({
      title: '提交预测确认',
      message: '确认提交预测提报？<br><br>预测版本：' + forecastVersion + '<br>客户：' + customerName + '(' + customerCode + ')<br>要货月份：' + month + '<br>产品数：' + products.length + '项',
      type: 'success',
      onOk: () => {
        this.submitToAPI(products);
      }
    });
  },

  async submitToAPI(products) {
    Loading.show();
    const results = [];
    for (const product of products) {
      try {
        const response = await fetch(PPS_API.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': PPS_API.token || localStorage.getItem('pps_token') || ''
          },
          body: JSON.stringify(product)
        });
        const result = await response.json();
        results.push({ product, result });
      } catch (error) {
        results.push({ product, error: error.message });
      }
    }
    Loading.hide();
    const successCount = results.filter(r => !r.error).length;
    const failCount = results.length - successCount;
    if (failCount === 0) {
      Message.success('提交成功！共 ' + results.length + ' 条记录');
      this.reset();
    } else {
      Message.warning('提交完成：成功 ' + successCount + ' 条，失败 ' + failCount + ' 条');
    }
  },

  saveDraft() {
    const draftData = {
      forecastVersion: document.getElementById('forecastVersion').value,
      customerCode: document.getElementById('customerCode').value,
      customerName: document.getElementById('customerName').value,
      month: document.getElementById('month').value
    };
    localStorage.setItem('pps_forecast_draft', JSON.stringify(draftData));
    Message.success('草稿已保存');
  },

  reset() {
    document.getElementById('forecastVersion').value = 'FC202601_V2.0';
    document.getElementById('customerCode').value = 'CS03';
    document.getElementById('customerName').value = '客户01';
    document.getElementById('month').value = new Date().toISOString().slice(0, 7);
    document.getElementById('day').value = '';
    document.getElementById('probability').value = 'high';
    document.getElementById('hasForecast').value = '1';
    document.getElementById('remark').value = '';
    document.querySelector('#order-lines tbody').innerHTML = '';
    this.addLine();
    Message.info('表单已重置');
  },

  manual() { Message.info('已进入手工录入模式'); },

  import() {
    Modal.create({
      title: 'Excel导入预测',
      content: '<div style="border:2px dashed var(--border-color);border-radius:8px;padding:40px;text-align:center;color:var(--text-secondary);cursor:pointer">📥 拖拽Excel文件到此处或点击上传<br><small>支持 .xlsx, .xls 格式</small></div>',
      okText: '关闭',
      onOk: () => {}
    });
  },

  api() {
    const currentUrl = PPS_API.url;
    const status = '<span class="status-tag success">运行中</span>';
    Modal.create({
      title: 'API对接配置',
      showFooter: false,
      content: `
        <div class="modal-form">
          <div class="form-row"><label class="form-label">代理服务</label><div class="form-content">${status}</div></div>
          <div class="form-row"><label class="form-label">接口地址</label><div class="form-content"><input type="text" class="form-control" value="${currentUrl}" readonly></div></div>
          <div class="form-row"><label class="form-label">说明</label><div class="form-content" style="font-size:13px;color:var(--text-secondary)">通过阿里云代理服务器转发请求到PPS API<br>HTTP: 端口3003 | HTTPS: 端口3443</div></div>
        </div>
      `
    });
  }
};




// 订单列表 - PPS预测记录
Pages['order-list'] = {
  mockData: [
    { id: 'ORD202601150001', forecastVersion: 'FC202601_V2.0', customerCode: 'CS03', customerName: '客户03', month: '2026-01', status: '已提交', submitTime: '2026-01-15 10:30:00', itemCount: 2, totalQty: 40000000 },
    { id: 'ORD202601150002', forecastVersion: 'FC202601_V2.0', customerCode: 'CS04', customerName: '正泰电源', month: '2026-01', status: '处理中', submitTime: '2026-01-15 11:15:00', itemCount: 3, totalQty: 60000000 },
    { id: 'ORD202601140001', forecastVersion: 'FC202601_V1.0', customerCode: 'CS01', customerName: '客户01', month: '2026-01', status: '已完成', submitTime: '2026-01-14 16:20:00', itemCount: 1, totalQty: 20000000 },
    { id: 'ORD202601140002', forecastVersion: 'FC202601_V1.0', customerCode: 'CS02', customerName: '客户02', month: '2026-01', status: '已完成', submitTime: '2026-01-14 09:45:00', itemCount: 2, totalQty: 35000000 },
    { id: 'ORD202601130001', forecastVersion: 'FC202601_V1.0', customerCode: 'CS03', customerName: '客户03', month: '2026-01', status: '已关闭', submitTime: '2026-01-13 14:30:00', itemCount: 1, totalQty: 15000000 },
  ],

  template: `
    <div class="page-header"><h1 class="page-title">预测提报记录</h1><p class="page-desc">管理所有PPS预测提报记录</p></div>
    <div class="content-card">
      <div class="card-header">
        <h3 class="card-title">记录列表</h3>
        <div style="display:flex;gap:8px">
          <input type="text" class="form-control" style="width:200px" placeholder="搜索预测版本号/客户..." id="searchInput">
          <button class="btn btn-primary" onclick="Pages['order-list'].search()">搜索</button>
          <button class="btn btn-default" onclick="Pages['order-list'].refresh()">刷新</button>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>订单编号</th>
              <th>预测版本</th>
              <th>客户</th>
              <th>要货月份</th>
              <th>产品数</th>
              <th>总数量</th>
              <th>状态</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="order-table-body"></tbody>
        </table>
      </div>
      <div class="table-footer" style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
        <span style="color:var(--text-secondary)">共 <span id="total-count">0</span> 条记录</span>
        <div class="pagination" style="display:flex;gap:8px">
          <button class="btn btn-sm btn-default" onclick="Pages['order-list'].prevPage()">上一页</button>
          <span style="padding:4px 12px">第 <span id="current-page">1</span> 页</span>
          <button class="btn btn-sm btn-default" onclick="Pages['order-list'].nextPage()">下一页</button>
        </div>
      </div>
    </div>`,

  currentPage: 1,
  pageSize: 10,

  init() { this.render(); },

  render() {
    const tbody = document.getElementById('order-table-body');
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageData = this.mockData.slice(start, end);

    if (pageData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-secondary)">暂无数据</td></tr>';
      document.getElementById('total-count').textContent = '0';
      return;
    }

    tbody.innerHTML = pageData.map(item => {
      const statusClass = { '已提交': 'warning', '处理中': 'info', '已完成': 'success', '已关闭': 'default' }[item.status] || 'default';
      return `<tr><td>${item.id}</td><td>${item.forecastVersion}</td><td>${item.customerName} (${item.customerCode})</td><td>${item.month}</td><td>${item.itemCount}</td><td>${item.totalQty.toLocaleString()}</td><td><span class="status-tag ${statusClass}">${item.status}</span></td><td>${item.submitTime}</td><td><button class="btn btn-link" onclick="Pages['order-list'].viewDetail('${item.id}')">查看</button><button class="btn btn-link" style="color:var(--primary-color)" onclick="Pages['order-list'].export('${item.id}')">导出</button></td></tr>`;
    }).join('');
    document.getElementById('total-count').textContent = this.mockData.length;
    document.getElementById('current-page').textContent = this.currentPage;
  },

  search() { Message.info('搜索功能演示'); },
  refresh() { Message.success('数据已刷新'); this.render(); },
  prevPage() { if (this.currentPage > 1) { this.currentPage--; this.render(); } },
  nextPage() { const maxPage = Math.ceil(this.mockData.length / this.pageSize); if (this.currentPage < maxPage) { this.currentPage++; this.render(); } },
  viewDetail(id) { const item = this.mockData.find(d => d.id === id); Modal.create({ title: '订单详情', content: '<div class="modal-form"><div class="form-row"><label class="form-label">订单编号</label><div class="form-content">' + (item?.id || '-') + '</div></div><div class="form-row"><label class="form-label">预测版本</label><div class="form-content">' + (item?.forecastVersion || '-') + '</div></div><div class="form-row"><label class="form-label">客户</label><div class="form-content">' + (item?.customerName || '-') + '</div></div><div class="form-row"><label class="form-label">状态</label><div class="form-content">' + (item?.status || '-') + '</div></div></div>' }); },
  export(id) { Message.success('导出订单: ' + id); }
};

// 订单拆分
Pages['order-split'] = {
  mockData: [
    { id: 'SPLIT001', sourceOrder: 'ORD202601150001', productName: 'TOP 1212哑光封装', originalQty: 40000000, splitPlan: [20000000, 20000000], status: '待拆分' },
    { id: 'SPLIT002', sourceOrder: 'ORD202601150002', productName: 'TOP 1212哑光封装', originalQty: 60000000, splitPlan: [30000000, 30000000], status: '已拆分' },
    { id: 'SPLIT003', sourceOrder: 'ORD202601140001', productName: 'XF-ADB1212-T-SASA-LC', originalQty: 20000000, splitPlan: [10000000, 10000000], status: '已完成' },
  ],

  template: `
    <div class="page-header"><h1 class="page-title">订单拆分</h1><p class="page-desc">将大批量订单拆分为多个小批次</p></div>
    <div class="content-card">
      <div class="card-header">
        <h3 class="card-title">待拆分订单</h3>
        <button class="btn btn-primary" onclick="Pages['order-split'].showSplitModal()">+ 新增拆分</button>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>拆分单号</th>
              <th>源订单</th>
              <th>产品名称</th>
              <th>原始数量</th>
              <th>拆分方案</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="split-table-body"></tbody>
        </table>
      </div>
    </div>`,

  init() { this.render(); },

  render() {
    const tbody = document.getElementById('split-table-body');
    tbody.innerHTML = this.mockData.map(item => {
      const statusClass = item.status === '已完成' ? 'success' : item.status === '已拆分' ? 'info' : 'warning';
      return `<tr><td>${item.id}</td><td>${item.sourceOrder}</td><td>${item.productName}</td><td>${item.originalQty.toLocaleString()}</td><td>${item.splitPlan.map(q => q.toLocaleString()).join(' + ')}</td><td><span class="status-tag ${statusClass}">${item.status}</span></td><td><button class="btn btn-link" onclick="Pages['order-split'].edit('${item.id}')">编辑</button><button class="btn btn-link" onclick="Pages['order-split'].execute('${item.id}')">执行</button></td></tr>`;
    }).join('');
  },

  showSplitModal() { Modal.create({ title: '新增拆分', content: '<div class="modal-form"><div class="form-row"><label class="form-label">源订单</label><div class="form-content"><select class="form-control"><option>ORD202601150001</option><option>ORD202601150002</option></select></div></div><div class="form-row"><label class="form-label">拆分数量</label><div class="form-content"><input type="number" class="form-control" placeholder="输入拆分后的数量"></div></div></div>', onOk: () => { Message.success('拆分单已创建'); } }); },
  edit(id) { Message.info('编辑拆分单: ' + id); },
  execute(id) { Modal.confirm({ title: '确认执行拆分', message: '确认执行拆分单 ' + id + ' ？', type: 'warning', onOk: () => { Message.success('拆分执行成功'); } }); }
};

// 订单状态跟踪
Pages['order-status'] = {
  mockData: [
    { id: 'ORD202601150001', currentStep: 3, steps: [
      { name: '订单创建', status: 'completed', time: '2026-01-15 10:30:00' },
      { name: 'PPS审核', status: 'completed', time: '2026-01-15 10:35:00' },
      { name: '生产计划', status: 'active', time: '2026-01-15 11:00:00' },
      { name: '物料准备', status: 'pending', time: '' },
      { name: '生产执行', status: 'pending', time: '' },
      { name: '质量检验', status: 'pending', time: '' },
      { name: '入库', status: 'pending', time: '' },
      { name: '发货', status: 'pending', time: '' },
    ]},
    { id: 'ORD202601150002', currentStep: 2, steps: [
      { name: '订单创建', status: 'completed', time: '2026-01-15 11:15:00' },
      { name: 'PPS审核', status: 'active', time: '2026-01-15 11:20:00' },
      { name: '生产计划', status: 'pending', time: '' },
      { name: '物料准备', status: 'pending', time: '' },
      { name: '生产执行', status: 'pending', time: '' },
      { name: '质量检验', status: 'pending', time: '' },
      { name: '入库', status: 'pending', time: '' },
      { name: '发货', status: 'pending', time: '' },
    ]},
    { id: 'ORD202601140001', currentStep: 6, steps: [
      { name: '订单创建', status: 'completed', time: '2026-01-14 16:20:00' },
      { name: 'PPS审核', status: 'completed', time: '2026-01-14 16:25:00' },
      { name: '生产计划', status: 'completed', time: '2026-01-14 17:00:00' },
      { name: '物料准备', status: 'completed', time: '2026-01-14 18:00:00' },
      { name: '生产执行', status: 'completed', time: '2026-01-14 22:00:00' },
      { name: '质量检验', status: 'active', time: '2026-01-15 08:00:00' },
      { name: '入库', status: 'pending', time: '' },
      { name: '发货', status: 'pending', time: '' },
    ]},
  ],

  template: `
    <div class="page-header"><h1 class="page-title">订单状态跟踪</h1><p class="page-desc">实时跟踪订单执行进度</p></div>
    <div class="content-card">
      <div class="card-header">
        <h3 class="card-title">订单列表</h3>
        <div style="display:flex;gap:8px;align-items:center">
          <select class="form-control" style="width:150px" id="orderSelect" onchange="Pages['order-status'].selectOrder(this.value)">
            <option value="">选择订单...</option>
          </select>
          <button class="btn btn-default" onclick="Pages['order-status'].refresh()">刷新</button>
        </div>
      </div>
      <div id="status-content">
        <div class="empty-state" style="text-align:center;padding:60px;color:var(--text-secondary)">
          <div style="font-size:48px;margin-bottom:16px">📋</div>
          <p>请选择一个订单查看状态</p>
        </div>
      </div>
    </div>`,

  selectedOrderId: null,

  init() { this.populateOrderSelect(); },

  populateOrderSelect() {
    const select = document.getElementById('orderSelect');
    if (!select) return;
    select.innerHTML = '<option value="">选择订单...</option>' + this.mockData.map(item => `<option value="${item.id}">${item.id}</option>`).join('');
  },

  selectOrder(orderId) {
    if (!orderId) {
      document.getElementById('status-content').innerHTML = '<div class="empty-state" style="text-align:center;padding:60px;color:var(--text-secondary)"><div style="font-size:48px;margin-bottom:16px">📋</div><p>请选择一个订单查看状态</p></div>';
      return;
    }
    this.selectedOrderId = orderId;
    this.render();
  },

  render() {
    const order = this.mockData.find(d => d.id === this.selectedOrderId);
    if (!order) return;
    const statusContent = document.getElementById('status-content');
    statusContent.innerHTML = '<div style="margin-bottom:24px"><h4 style="margin:0 0 8px 0">订单号: ' + order.id + '</h4><p style="margin:0;color:var(--text-secondary)">当前进度: ' + order.currentStep + ' / ' + order.steps.length + '</p></div><div class="step-timeline" style="display:flex;flex-direction:column;gap:12px">' + order.steps.map((step, index) => { const statusIcon = { 'completed': '✅', 'active': '🔄', 'pending': '⏳' }[step.status]; const statusClass = { 'completed': 'success', 'active': 'info', 'pending': 'default' }[step.status]; return '<div class="step-item" style="display:flex;align-items:center;gap:16px;padding:12px;background:var(--bg-secondary);border-radius:8px;' + (step.status === 'active' ? 'border:1px solid var(--primary-color);' : '') + '"><div style="font-size:24px;width:40px;text-align:center">' + statusIcon + '</div><div style="flex:1"><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:500">步骤 ' + (index + 1) + ': ' + step.name + '</span><span class="status-tag ' + statusClass + '">' + (step.status === 'completed' ? '已完成' : step.status === 'active' ? '进行中' : '待处理') + '</span></div>' + (step.time ? '<div style="font-size:13px;color:var(--text-secondary);margin-top:4px">' + step.time + '</div>' : '') + '</div></div>'; }).join('') + '</div>';
  },

  refresh() { if (this.selectedOrderId) { Message.success('状态已刷新'); this.render(); } }
};