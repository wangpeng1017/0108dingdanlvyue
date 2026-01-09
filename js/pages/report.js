// 五、报表分析模块

// 报表模板管理
Pages['report-template'] = {
  template: `
    <div class="page-header"><h1 class="page-title">报表模板</h1><p class="page-desc">可视化报表模板设计与管理</p></div>
    <div class="content-card">
      <div class="table-toolbar"><div class="table-toolbar-left"><button class="btn btn-primary" onclick="Pages['report-template'].create()">+ 新建模板</button></div></div>
      <div id="template-table"></div>
    </div>`,
  init() {
    Table.render('template-table', {
      columns: [
        { key: 'id', title: '模板ID', width: '100px' },
        { key: 'name', title: '模板名称' },
        { key: 'type', title: '类型' },
        { key: 'fields', title: '字段', render: v => v.slice(0, 3).join('、') + (v.length > 3 ? '...' : '') },
        { key: 'createUser', title: '创建人' },
        { key: 'createTime', title: '创建时间' },
        { key: 'status', title: '状态', render: v => Format.status(v, { '启用': { text: '启用', type: 'success' }, '禁用': { text: '禁用', type: 'default' } }) },
        { key: 'actions', title: '操作', width: '180px', render: (_, row) => `<div class="table-actions"><button class="btn btn-link" onclick="Pages['report-template'].design('${row.id}')">设计</button><button class="btn btn-link" onclick="Pages['report-template'].preview('${row.id}')">预览</button><button class="btn btn-link" onclick="Pages['report-template'].edit('${row.id}')">编辑</button></div>` }
      ],
      data: DataService.getReportTemplates(), showIndex: true
    });
  },
  create() {
    Modal.create({
      title: '新建报表模板',
      size: 'lg',
      content: `<form class="modal-form">
        <div class="form-row"><label class="form-label required">模板名称</label><div class="form-content"><input type="text" class="form-control" required></div></div>
        <div class="form-row"><label class="form-label required">报表类型</label><div class="form-content"><select class="form-control form-select"><option>订单报表</option><option>OT报表</option><option>汇总报表</option><option>明细报表</option></select></div></div>
        <div class="form-row"><label class="form-label">描述</label><div class="form-content"><textarea class="form-control" rows="2"></textarea></div></div>
      </form>`,
      onOk: () => { Message.success('模板创建成功'); Pages['report-template'].design('new'); }
    });
  },
  design(id) {
    Modal.create({
      title: '报表设计器',
      size: 'lg',
      content: `
        <div style="display:flex;gap:16px;height:400px">
          <div style="width:200px;border:1px solid var(--border-color);border-radius:4px;padding:12px;overflow-y:auto">
            <div style="font-weight:500;margin-bottom:12px">可用字段</div>
            ${['订单号', '客户名称', '产品名称', '产品编码', '数量', '单价', '金额', '订单日期', '交货日期', '状态', '创建人', '审核人'].map(f => `<div style="padding:6px 8px;background:var(--background-light);border-radius:4px;margin-bottom:4px;cursor:move;font-size:13px" draggable="true">📊 ${f}</div>`).join('')}
          </div>
          <div style="flex:1;border:1px dashed var(--border-color);border-radius:4px;padding:16px;background:var(--background-light)">
            <div style="text-align:center;color:var(--text-secondary);padding:40px 0">
              <div style="font-size:48px;margin-bottom:16px">📋</div>
              <p>拖拽左侧字段到此处设计报表</p>
              <p style="font-size:12px">支持设置字段顺序、格式、计算公式等</p>
            </div>
          </div>
          <div style="width:200px;border:1px solid var(--border-color);border-radius:4px;padding:12px">
            <div style="font-weight:500;margin-bottom:12px">属性设置</div>
            <div class="form-row" style="margin-bottom:8px"><label style="font-size:12px">字段名</label><input type="text" class="form-control form-control-sm" placeholder="选择字段后显示"></div>
            <div class="form-row" style="margin-bottom:8px"><label style="font-size:12px">对齐方式</label><select class="form-control form-select form-control-sm"><option>左对齐</option><option>居中</option><option>右对齐</option></select></div>
            <div class="form-row" style="margin-bottom:8px"><label style="font-size:12px">格式化</label><select class="form-control form-select form-control-sm"><option>文本</option><option>数字</option><option>金额</option><option>日期</option></select></div>
            <div class="form-row"><label style="font-size:12px">计算公式</label><input type="text" class="form-control form-control-sm" placeholder="如: SUM(金额)"></div>
          </div>
        </div>
      `,
      okText: '保存模板',
      onOk: () => Message.success('模板保存成功')
    });
  },
  preview(id) {
    Modal.create({
      title: '报表预览',
      size: 'lg',
      showFooter: false,
      content: `
        <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:500">销售订单月报 - 2025年1月</span>
          <div><button class="btn btn-default btn-sm" onclick="Message.success('已导出Excel')">📥 导出Excel</button><button class="btn btn-default btn-sm" onclick="Message.success('已导出PDF')">📄 导出PDF</button></div>
        </div>
        <table class="data-table">
          <thead><tr><th>订单号</th><th>客户</th><th>产品</th><th>金额</th><th>状态</th></tr></thead>
          <tbody>
            ${DataService.getSalesOrders().map(o => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.products[0]?.name || '-'}</td><td>${Format.currency(o.totalAmount)}</td><td>${o.status}</td></tr>`).join('')}
          </tbody>
          <tfoot><tr><td colspan="3" style="text-align:right;font-weight:500">合计</td><td style="font-weight:600;color:var(--primary-color)">${Format.currency(DataService.getSalesOrders().reduce((s, o) => s + o.totalAmount, 0))}</td><td></td></tr></tfoot>
        </table>
      `
    });
  },
  edit(id) { Modal.create({ title: '编辑模板', content: '<p>编辑模板信息...</p>', onOk: () => Message.success('保存成功') }); }
};

// 报表查询与分析
Pages['report-query'] = {
  template: `
    <div class="page-header"><h1 class="page-title">报表查询</h1><p class="page-desc">多维度报表查询与数据分析</p></div>
    
    <div class="search-bar">
      <div class="search-item"><label>报表类型</label><select class="form-control form-select" id="report-type" onchange="Pages['report-query'].changeType()"><option value="order">销售订单报表</option><option value="ot">OT交货及时率</option><option value="customer">客户汇总报表</option></select></div>
      <div class="search-item"><label>时间范围</label><div style="display:flex;align-items:center;gap:8px"><input type="date" class="form-control" style="width:130px" value="2025-01-01"><span style="color:var(--text-secondary)">-</span><input type="date" class="form-control" style="width:130px" value="2025-01-31"></div></div>
      <div class="search-item"><label>客户</label><select class="form-control form-select"><option value="">全部</option>${DataService.getCustomers().map(c => `<option>${c.name}</option>`).join('')}</select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['report-query'].query()">🔍 查询</button><button class="btn btn-default" onclick="Pages['report-query'].export()">📥 导出</button></div>
    </div>
    
    <div class="content-card" id="report-charts" style="display:none">
      <div class="card-header"><h3 class="card-title">数据图表</h3></div>
      <div id="chart-container" style="display:flex;gap:24px;flex-wrap:wrap"></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">报表数据</h3></div>
      <div id="report-result"></div>
    </div>`,
  init() {
    this.renderOrderReport();
  },
  changeType() {
    const type = document.getElementById('report-type').value;
    if (type === 'order') this.renderOrderReport();
    else if (type === 'ot') this.renderOTReport();
    else if (type === 'customer') this.renderCustomerReport();
  },
  renderOrderReport() {
    document.getElementById('report-charts').style.display = 'block';
    document.getElementById('chart-container').innerHTML = `
      <div style="flex:1;min-width:300px;text-align:center">
        <div style="font-weight:500;margin-bottom:16px">订单状态分布</div>
        <div style="display:flex;justify-content:center;align-items:center;gap:8px">
          <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--success-color) 0% 40%, var(--warning-color) 40% 60%, var(--info-color) 60% 80%, var(--primary-color) 80% 100%);position:relative">
            <div style="position:absolute;inset:30px;background:#fff;border-radius:50%"></div>
          </div>
          <div style="text-align:left;font-size:13px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="width:12px;height:12px;background:var(--success-color);border-radius:2px"></span>已完成 40%</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="width:12px;height:12px;background:var(--warning-color);border-radius:2px"></span>待审核 20%</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="width:12px;height:12px;background:var(--info-color);border-radius:2px"></span>已审核 20%</div>
            <div style="display:flex;align-items:center;gap:8px"><span style="width:12px;height:12px;background:var(--primary-color);border-radius:2px"></span>其他 20%</div>
          </div>
        </div>
      </div>
      <div style="flex:1;min-width:300px;text-align:center">
        <div style="font-weight:500;margin-bottom:16px">月度订单金额趋势</div>
        <div style="display:flex;align-items:flex-end;justify-content:center;gap:16px;height:120px">
          ${[60, 80, 70, 90, 85, 95].map((h, i) => `<div style="display:flex;flex-direction:column;align-items:center"><div style="width:30px;height:${h}px;background:var(--primary-color);border-radius:4px 4px 0 0"></div><span style="font-size:11px;margin-top:4px">${i + 1}月</span></div>`).join('')}
        </div>
      </div>
    `;

    Table.render('report-result', {
      columns: [
        { key: 'id', title: '订单编号' },
        { key: 'customer', title: '客户' },
        { key: 'products', title: '产品', render: v => v[0]?.name },
        { key: 'totalAmount', title: '金额', align: 'right', render: v => Format.currency(v) },
        { key: 'orderDate', title: '订单日期' },
        { key: 'deliveryDate', title: '交货日期' },
        { key: 'status', title: '状态', render: v => Format.status(v, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已完成': { text: '已完成', type: 'success' } }) }
      ],
      data: DataService.getSalesOrders()
    });
  },
  renderOTReport() {
    document.getElementById('report-charts').style.display = 'block';
    document.getElementById('chart-container').innerHTML = `
      <div style="flex:1;min-width:300px;text-align:center">
        <div style="font-weight:500;margin-bottom:16px">交货及时率</div>
        <div style="font-size:48px;font-weight:600;color:var(--success-color)">96.5%</div>
        <div style="color:var(--text-secondary)">本月交货及时率</div>
      </div>
      <div style="flex:1;min-width:300px;text-align:center">
        <div style="font-weight:500;margin-bottom:16px">延期订单</div>
        <div style="font-size:48px;font-weight:600;color:var(--error-color)">3</div>
        <div style="color:var(--text-secondary)">本月延期订单数</div>
      </div>
    `;

    document.getElementById('report-result').innerHTML = `
      <table class="data-table">
        <thead><tr><th>订单编号</th><th>客户</th><th>计划交期</th><th>实际交期</th><th>延期天数</th><th>是否及时</th></tr></thead>
        <tbody>
          <tr><td>SO2025010005</td><td>盛能杰ODM</td><td>2025-01-30</td><td>2025-01-28</td><td>0</td><td><span class="status-tag success">及时</span></td></tr>
          <tr><td>SO2025010004</td><td>泰国分公司</td><td>2025-01-25</td><td>2025-01-25</td><td>0</td><td><span class="status-tag success">及时</span></td></tr>
          <tr><td>SO2024120010</td><td>华南区代理</td><td>2024-12-30</td><td>2025-01-02</td><td>3</td><td><span class="status-tag error">延期</span></td></tr>
        </tbody>
      </table>
    `;
  },
  renderCustomerReport() {
    document.getElementById('report-charts').style.display = 'block';
    document.getElementById('chart-container').innerHTML = `
      <div style="flex:1;min-width:300px;text-align:center">
        <div style="font-weight:500;margin-bottom:16px">客户订单金额占比</div>
        <div style="display:flex;justify-content:center;gap:16px">
          ${[{ name: '泰国分公司', val: 45, color: 'var(--primary-color)' }, { name: '盛能杰ODM', val: 35, color: 'var(--success-color)' }, { name: '华南区代理', val: 20, color: 'var(--warning-color)' }].map(c => `<div style="text-align:center"><div style="width:60px;height:60px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600">${c.val}%</div><div style="font-size:12px;margin-top:8px">${c.name}</div></div>`).join('')}
        </div>
      </div>
    `;

    document.getElementById('report-result').innerHTML = `
      <table class="data-table">
        <thead><tr><th>客户</th><th>订单数</th><th>总金额</th><th>已完成金额</th><th>完成率</th></tr></thead>
        <tbody>
          <tr><td>泰国分公司</td><td>5</td><td>¥2,380,000</td><td>¥1,200,000</td><td><span style="color:var(--success-color)">50.4%</span></td></tr>
          <tr><td>盛能杰ODM</td><td>3</td><td>¥1,300,000</td><td>¥600,000</td><td><span style="color:var(--warning-color)">46.2%</span></td></tr>
          <tr><td>华南区代理</td><td>2</td><td>¥1,250,000</td><td>¥0</td><td><span style="color:var(--text-secondary)">0%</span></td></tr>
        </tbody>
        <tfoot><tr style="font-weight:500"><td>合计</td><td>10</td><td>¥4,930,000</td><td>¥1,800,000</td><td>36.5%</td></tr></tfoot>
      </table>
    `;
  },
  query() { Loading.show(); setTimeout(() => { Loading.hide(); Message.success('查询完成'); }, 500); },
  export() { Message.success('报表导出成功'); }
};
