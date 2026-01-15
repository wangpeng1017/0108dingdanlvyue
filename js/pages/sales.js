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
  template: `
    <div class="page-header"><h1 class="page-title">预测提报记录</h1><p class="page-desc">管理所有PPS预测提报记录</p></div>
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">记录列表</h3></div>
      <div id="order-table"><div class="table-empty">暂无数据</div></div>
    </div>`,
  init() {
    document.getElementById('order-table').innerHTML = '<div class="table-empty">暂无数据</div>';
  }
};

Pages['order-split'] = {
  template: '<div class="page-header"><h1 class="page-title">订单拆分</h1></div>',
  init() {}
};

Pages['order-status'] = {
  template: '<div class="page-header"><h1 class="page-title">订单状态跟踪</h1></div>',
  init() {}
};
