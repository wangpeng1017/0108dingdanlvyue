// 四、S&OP计划模块

// 数据收集
Pages['sop-data'] = {
    template: `
    <div class="page-header"><h1 class="page-title">数据收集</h1><p class="page-desc">自动抓取订单、库存、产能数据</p></div>
    <div class="stat-cards">
      <div class="stat-card"><div class="stat-info"><div class="stat-label">待处理订单</div><div class="stat-value">${DataService.getSalesOrders().length}</div></div><div class="stat-icon primary">📦</div></div>
      <div class="stat-card"><div class="stat-info"><div class="stat-label">成品库存</div><div class="stat-value">6,500</div></div><div class="stat-icon success">🏭</div></div>
      <div class="stat-card"><div class="stat-info"><div class="stat-label">日产能</div><div class="stat-value">200</div><div class="stat-trend up">台/天</div></div><div class="stat-icon warning">⚙️</div></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">订单数据</h3><button class="btn btn-default btn-sm" onclick="Pages['sop-data'].syncOrders()">🔄 同步</button></div>
      <div id="sop-orders"></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">库存数据</h3><span style="color:var(--text-secondary);font-size:12px">最后同步: 2025-01-08 10:00</span></div>
      <table class="data-table">
        <thead><tr><th>货品编码</th><th>货品名称</th><th>当前库存</th><th>安全库存</th><th>状态</th></tr></thead>
        <tbody>
          ${DataService.getProducts().map(p => `<tr><td>${p.code}</td><td>${p.name}</td><td>${Math.floor(Math.random() * 200) + 50}</td><td>${p.safetyStock}</td><td><span class="status-tag ${Math.random() > 0.3 ? 'success' : 'warning'}">${Math.random() > 0.3 ? '正常' : '预警'}</span></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">产能数据</h3><span style="color:var(--text-secondary);font-size:12px">数据来源: 生产管理系统</span></div>
      <table class="data-table">
        <thead><tr><th>生产线</th><th>产品</th><th>日产量</th><th>可排产天数</th><th>状态</th></tr></thead>
        <tbody>
          <tr><td>A线</td><td>INV-50K-3P (50KW逆变器)</td><td>30台</td><td>20天</td><td><span class="status-tag success">正常</span></td></tr>
          <tr><td>B线</td><td>INV-5K-1P (5KW逆变器)</td><td>80台</td><td>25天</td><td><span class="status-tag success">正常</span></td></tr>
          <tr><td>C线</td><td>INV-3K-1P (3KW逆变器)</td><td>100台</td><td>22天</td><td><span class="status-tag warning">维护中</span></td></tr>
        </tbody>
      </table>
    </div>`,
    init() {
        Table.render('sop-orders', {
            columns: [
                { key: 'id', title: '订单编号' },
                { key: 'customer', title: '客户' },
                { key: 'products', title: '产品', render: v => v[0]?.code },
                { key: 'products', title: '数量', render: v => v[0]?.qty },
                { key: 'deliveryDate', title: '交货日期' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '待审核': { text: '待审核', type: 'warning' }, '已审核': { text: '已审核', type: 'info' }, '已拆分': { text: '已拆分', type: 'info' } }) }
            ],
            data: DataService.getSalesOrders().filter(o => ['待审核', '已审核', '已拆分'].includes(o.status))
        });
    },
    syncOrders() { Loading.show(); setTimeout(() => { Loading.hide(); Message.success('订单数据同步完成'); }, 1000); }
};

// 需求计划
Pages['sop-demand'] = {
    template: `
    <div class="page-header"><h1 class="page-title">需求计划</h1><p class="page-desc">按产品汇总需求，进行优先级排序</p></div>
    <div class="search-bar">
      <div class="search-item"><label>计划周期</label><select class="form-control form-select" id="demand-period"><option>2025年1月</option><option>2025年2月</option><option>2025年Q1</option></select></div>
      <div class="search-actions"><button class="btn btn-primary" onclick="Pages['sop-demand'].generate()">生成需求计划</button></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">需求汇总</h3><button class="btn btn-default btn-sm" onclick="Pages['sop-demand'].addForecast()">+ 录入预测</button></div>
      <div id="demand-table"></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">优先级排序</h3></div>
      <p style="color:var(--text-secondary);margin-bottom:16px">根据客户等级、交期紧急度自动排序，可手动调整</p>
      <div id="priority-list">
        <div style="display:flex;align-items:center;padding:12px;background:var(--background-light);border-radius:4px;margin-bottom:8px;cursor:move">
          <span style="width:30px;color:var(--error-color);font-weight:600">1</span>
          <span style="flex:1">SO2025010002 - 盛能杰ODM - 紧急订单 - 交期: 2025-01-20</span>
          <span class="status-tag error">紧急</span>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--background-light);border-radius:4px;margin-bottom:8px;cursor:move">
          <span style="width:30px;color:var(--warning-color);font-weight:600">2</span>
          <span style="flex:1">SO2025010001 - 泰国分公司 - A级客户 - 交期: 2025-02-15</span>
          <span class="status-tag warning">高优先</span>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--background-light);border-radius:4px;margin-bottom:8px;cursor:move">
          <span style="width:30px;color:var(--text-secondary);font-weight:600">3</span>
          <span style="flex:1">SO2025010003 - 华南区代理 - B级客户 - 交期: 2025-02-28</span>
          <span class="status-tag info">普通</span>
        </div>
      </div>
    </div>`,
    init() {
        Table.render('demand-table', {
            columns: [
                { key: 'product', title: '货品编码' },
                { key: 'productName', title: '货品名称' },
                { key: 'orderQty', title: '订单需求', align: 'right' },
                { key: 'forecastQty', title: '预测需求', align: 'right' },
                { key: 'totalDemand', title: '总需求', align: 'right', render: v => `<strong>${v}</strong>` },
                { key: 'stock', title: '当前库存', align: 'right' },
                { key: 'gap', title: '缺口', align: 'right', render: v => `<span style="color:${v > 0 ? 'var(--error-color)' : 'var(--success-color)'}">${v > 0 ? '-' + v : 0}</span>` },
                { key: 'priority', title: '优先级', render: v => Format.status(v, { '高': { text: '高', type: 'error' }, '中': { text: '中', type: 'warning' }, '低': { text: '低', type: 'default' } }) }
            ],
            data: DataService.getSOPDemands()
        });
    },
    generate() { Loading.show(); setTimeout(() => { Loading.hide(); Message.success('需求计划已生成'); }, 1000); },
    addForecast() {
        Modal.create({
            title: '录入市场预测',
            content: `<form class="modal-form">
        <div class="form-row"><label class="form-label required">货品</label><div class="form-content"><select class="form-control form-select">${DataService.getProducts().map(p => `<option>${p.code} - ${p.name}</option>`).join('')}</select></div></div>
        <div class="form-row"><label class="form-label required">预测数量</label><div class="form-content"><input type="number" class="form-control" required></div></div>
        <div class="form-row"><label class="form-label">备注</label><div class="form-content"><textarea class="form-control" rows="2" placeholder="预测依据说明"></textarea></div></div>
      </form>`,
            onOk: () => Message.success('预测数据已录入')
        });
    }
};

// 协调计划
Pages['sop-coordinate'] = {
    template: `
    <div class="page-header"><h1 class="page-title">协调计划</h1><p class="page-desc">销售与生产协调，达成共识计划</p></div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">协调会议</h3><button class="btn btn-primary btn-sm" onclick="Pages['sop-coordinate'].newMeeting()">+ 发起协调</button></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div style="flex:1;min-width:300px;border:1px solid var(--border-color);border-radius:8px;padding:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px">
            <span style="font-weight:600">2025年1月需求协调会</span>
            <span class="status-tag success">已确认</span>
          </div>
          <p style="color:var(--text-secondary);font-size:13px;margin-bottom:8px">参与人：销售部-李伟、PMC-赵强、生产-王磊</p>
          <p style="font-size:13px">结论：1月需求计划已确认，生产线C延期维护后可满足需求。</p>
          <div style="margin-top:12px"><button class="btn btn-link btn-sm">查看详情</button><button class="btn btn-link btn-sm">版本记录</button></div>
        </div>
      </div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">需求与产能匹配</h3></div>
      <table class="data-table">
        <thead><tr><th>产品</th><th>需求数量</th><th>可用库存</th><th>月产能</th><th>匹配结果</th><th>调整方案</th></tr></thead>
        <tbody>
          <tr><td>INV-50K-3P</td><td>200</td><td>80</td><td>600</td><td><span class="status-tag success">可满足</span></td><td>-</td></tr>
          <tr><td>INV-5K-1P</td><td>300</td><td>150</td><td>2000</td><td><span class="status-tag success">可满足</span></td><td>-</td></tr>
          <tr><td>INV-3K-1P</td><td>700</td><td>400</td><td>2200</td><td><span class="status-tag warning">需协调</span></td><td><button class="btn btn-link btn-sm" onclick="Pages['sop-coordinate'].adjust()">调整</button></td></tr>
        </tbody>
      </table>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">历史协调记录</h3></div>
      <div id="coordinate-history"></div>
    </div>`,
    init() {
        Table.render('coordinate-history', {
            columns: [
                { key: 'id', title: '版本' },
                { key: 'period', title: '计划周期' },
                { key: 'createTime', title: '创建时间' },
                { key: 'creator', title: '创建人' },
                { key: 'status', title: '状态', render: v => Format.status(v, { '已确认': { text: '已确认', type: 'success' }, '待确认': { text: '待确认', type: 'warning' } }) },
                { key: 'actions', title: '操作', render: () => `<button class="btn btn-link">查看</button><button class="btn btn-link">对比</button>` }
            ],
            data: DataService.getSOPPlans()
        });
    },
    newMeeting() {
        Modal.create({
            title: '发起协调会议',
            size: 'lg',
            content: `<form class="modal-form">
        <div class="form-row"><label class="form-label required">会议主题</label><div class="form-content"><input type="text" class="form-control" value="2025年2月需求协调会"></div></div>
        <div class="form-row"><label class="form-label required">参与人员</label><div class="form-content">
          <div style="display:flex;flex-wrap:wrap;gap:8px">${['销售部-李伟', 'PMC-赵强', '生产-王磊', '仓储-王芳'].map(n => `<label class="checkbox-item"><input type="checkbox" checked><span class="checkbox-box"></span>${n}</label>`).join('')}</div>
        </div></div>
        <div class="form-row"><label class="form-label">会议时间</label><div class="form-content"><input type="datetime-local" class="form-control"></div></div>
        <div class="form-row"><label class="form-label">议题说明</label><div class="form-content"><textarea class="form-control" rows="3"></textarea></div></div>
      </form>`,
            onOk: () => Message.success('协调会议已发起')
        });
    },
    adjust() {
        Modal.create({
            title: '调整方案',
            content: `<form class="modal-form">
        <div class="form-row"><label class="form-label">调整类型</label><div class="form-content">
          <div class="radio-group">
            <label class="radio-item"><input type="radio" name="adjust" checked><span class="radio-circle"></span>调整交货日期</label>
            <label class="radio-item"><input type="radio" name="adjust"><span class="radio-circle"></span>优先排产</label>
            <label class="radio-item"><input type="radio" name="adjust"><span class="radio-circle"></span>分批交付</label>
          </div>
        </div></div>
        <div class="form-row"><label class="form-label">调整说明</label><div class="form-content"><textarea class="form-control" rows="3" placeholder="请说明调整原因和具体方案"></textarea></div></div>
      </form>`,
            onOk: () => Message.success('调整方案已记录')
        });
    }
};

// 执行跟踪
Pages['sop-tracking'] = {
    template: `
    <div class="page-header"><h1 class="page-title">执行跟踪</h1><p class="page-desc">实时跟踪计划执行情况，预警异常</p></div>
    
    <div class="stat-cards">
      <div class="stat-card"><div class="stat-info"><div class="stat-label">计划执行率</div><div class="stat-value">85%</div></div><div class="stat-icon success">📊</div></div>
      <div class="stat-card" style="border-color:var(--warning-color)"><div class="stat-info"><div class="stat-label">延期预警</div><div class="stat-value" style="color:var(--warning-color)">3</div></div><div class="stat-icon warning">⚠️</div></div>
      <div class="stat-card"><div class="stat-info"><div class="stat-label">库存预警</div><div class="stat-value" style="color:var(--error-color)">2</div></div><div class="stat-icon error">📉</div></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">预警信息</h3></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;align-items:center;padding:12px;background:#fff2f0;border:1px solid #ffccc7;border-radius:4px">
          <span style="margin-right:12px;font-size:18px">⚠️</span>
          <div style="flex:1">
            <div style="font-weight:500">交期预警：SO2025010002</div>
            <div style="font-size:13px;color:var(--text-secondary)">距离交期还剩12天，生产进度仅完成35%，存在延期风险</div>
          </div>
          <button class="btn btn-default btn-sm" onclick="Pages['sop-tracking'].handleAlert('SO2025010002')">处理</button>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:#fffbe6;border:1px solid #ffe58f;border-radius:4px">
          <span style="margin-right:12px;font-size:18px">📉</span>
          <div style="flex:1">
            <div style="font-weight:500">库存预警：INV-5K-1P</div>
            <div style="font-size:13px;color:var(--text-secondary)">当前库存120台，低于安全库存150台</div>
          </div>
          <button class="btn btn-default btn-sm" onclick="Message.info('已转采购部门处理')">处理</button>
        </div>
      </div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">生产进度跟踪</h3></div>
      <div id="production-progress"></div>
    </div>
    
    <div class="content-card">
      <div class="card-header"><h3 class="card-title">异常日志</h3></div>
      <div id="exception-log"></div>
    </div>`,
    init() {
        // 生产进度
        document.getElementById('production-progress').innerHTML = `
      <table class="data-table">
        <thead><tr><th>订单编号</th><th>产品</th><th>数量</th><th>已完成</th><th>进度</th><th>预计完成</th></tr></thead>
        <tbody>
          <tr><td>SO2025010001</td><td>INV-50K-3P</td><td>100</td><td>45</td><td><div style="background:var(--border-light);border-radius:4px;height:8px;width:120px"><div style="background:var(--primary-color);height:100%;width:45%;border-radius:4px"></div></div></td><td>2025-02-10</td></tr>
          <tr><td>SO2025010002</td><td>INV-5K-1P</td><td>200</td><td>70</td><td><div style="background:var(--border-light);border-radius:4px;height:8px;width:120px"><div style="background:var(--warning-color);height:100%;width:35%;border-radius:4px"></div></div></td><td><span style="color:var(--error-color)">2025-01-25 (延期风险)</span></td></tr>
          <tr><td>SO2025010003</td><td>INV-3K-1P</td><td>500</td><td>400</td><td><div style="background:var(--border-light);border-radius:4px;height:8px;width:120px"><div style="background:var(--success-color);height:100%;width:80%;border-radius:4px"></div></div></td><td>2025-02-20</td></tr>
        </tbody>
      </table>
    `;

        // 异常日志
        document.getElementById('exception-log').innerHTML = `
      <table class="data-table">
        <thead><tr><th>时间</th><th>类型</th><th>描述</th><th>处理人</th><th>状态</th></tr></thead>
        <tbody>
          <tr><td>2025-01-08 09:30</td><td>生产延期</td><td>C线设备故障，影响INV-3K-1P生产</td><td>王磊</td><td><span class="status-tag success">已处理</span></td></tr>
          <tr><td>2025-01-07 14:00</td><td>物料短缺</td><td>电容库存不足，影响5条订单</td><td>采购部</td><td><span class="status-tag warning">处理中</span></td></tr>
        </tbody>
      </table>
    `;
    },
    handleAlert(orderId) {
        Modal.create({
            title: '处理预警 - ' + orderId,
            content: `<form class="modal-form">
        <div class="form-row"><label class="form-label">处理方式</label><div class="form-content"><select class="form-control form-select"><option>加急排产</option><option>协调交期</option><option>部分发货</option></select></div></div>
        <div class="form-row"><label class="form-label">处理说明</label><div class="form-content"><textarea class="form-control" rows="3"></textarea></div></div>
      </form>`,
            onOk: () => Message.success('预警处理完成')
        });
    }
};
