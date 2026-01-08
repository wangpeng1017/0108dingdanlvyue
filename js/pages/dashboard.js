// 仪表盘首页
Pages['dashboard'] = {
  template: `
    <div class="page-header">
      <h1 class="page-title">工作台</h1>
      <p class="page-desc">订单履约及交付管理系统</p>
    </div>
    
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">今日订单</div>
          <div class="stat-value">12</div>
          <div class="stat-trend up">↑ 20%</div>
        </div>
        <div class="stat-icon primary">📦</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">待审核</div>
          <div class="stat-value">5</div>
        </div>
        <div class="stat-icon warning">📋</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">待发货</div>
          <div class="stat-value">8</div>
        </div>
        <div class="stat-icon info">🚚</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">本月完成</div>
          <div class="stat-value">156</div>
          <div class="stat-trend up">↑ 15%</div>
        </div>
        <div class="stat-icon success">✓</div>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-top:24px">
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">近期订单</h3>
          <a class="btn btn-link" onclick="App.loadPage('order-list')">查看全部 →</a>
        </div>
        <div id="recent-orders"></div>
      </div>
      
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">待办事项</h3>
          <span style="font-size:12px;color:var(--text-secondary)">共 <strong style="color:var(--primary-color)">16</strong> 项</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="todo-card" onclick="App.loadPage('order-list')" style="cursor:pointer;border-left:3px solid var(--warning-color)">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);display:flex;align-items:center;justify-content:center;font-size:24px">📋</div>
              <div style="flex:1">
                <div style="font-weight:500;color:var(--text-primary);margin-bottom:4px">订单待审核</div>
                <div style="font-size:12px;color:var(--text-secondary)">需要尽快处理审核流程</div>
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:32px;padding:0 10px;background:var(--warning-color);color:#fff;border-radius:16px;font-weight:600;font-size:14px">5</span>
                <span style="color:var(--primary-color);font-size:20px">›</span>
              </div>
            </div>
          </div>
          
          <div class="todo-card" onclick="App.loadPage('sop-tracking')" style="cursor:pointer;border-left:3px solid var(--error-color)">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);display:flex;align-items:center;justify-content:center;font-size:24px">⚠️</div>
              <div style="flex:1">
                <div style="font-weight:500;color:var(--text-primary);margin-bottom:4px;display:flex;align-items:center;gap:6px">
                  交期预警
                  <span style="font-size:10px;padding:2px 6px;background:var(--error-color);color:#fff;border-radius:10px">紧急</span>
                </div>
                <div style="font-size:12px;color:var(--text-secondary)">有订单可能延期交付</div>
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:32px;padding:0 10px;background:var(--error-color);color:#fff;border-radius:16px;font-weight:600;font-size:14px">3</span>
                <span style="color:var(--primary-color);font-size:20px">›</span>
              </div>
            </div>
          </div>
          
          <div class="todo-card" onclick="App.loadPage('delivery-list')" style="cursor:pointer;border-left:3px solid var(--info-color)">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);display:flex;align-items:center;justify-content:center;font-size:24px">🚚</div>
              <div style="flex:1">
                <div style="font-weight:500;color:var(--text-primary);margin-bottom:4px">交货单待发货</div>
                <div style="font-size:12px;color:var(--text-secondary)">安排物流发货</div>
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:32px;padding:0 10px;background:var(--info-color);color:#fff;border-radius:16px;font-weight:600;font-size:14px">8</span>
                <span style="color:var(--primary-color);font-size:20px">›</span>
              </div>
            </div>
          </div>
          
          <div class="todo-card" onclick="App.loadPage('sop-coordinate')" style="cursor:pointer;border-left:3px solid var(--success-color)">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);display:flex;align-items:center;justify-content:center;font-size:24px">📊</div>
              <div style="flex:1">
                <div style="font-weight:500;color:var(--text-primary);margin-bottom:4px">S&OP计划待确认</div>
                <div style="font-size:12px;color:var(--text-secondary)">本周计划需要协调确认</div>
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <span style="color:var(--primary-color);font-size:20px">›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px">
      <div class="content-card">
        <div class="card-header"><h3 class="card-title">订单状态分布</h3></div>
        <div style="display:flex;justify-content:center;align-items:center;gap:24px;padding:20px">
          <div style="width:140px;height:140px;border-radius:50%;background:conic-gradient(var(--success-color) 0% 40%, var(--warning-color) 40% 55%, var(--info-color) 55% 75%, var(--primary-color) 75% 100%);position:relative">
            <div style="position:absolute;inset:35px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column">
              <div style="font-size:24px;font-weight:600">200</div>
              <div style="font-size:12px;color:var(--text-secondary)">总订单</div>
            </div>
          </div>
          <div style="font-size:13px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="width:12px;height:12px;background:var(--success-color);border-radius:2px"></span>已完成 80单 (40%)</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="width:12px;height:12px;background:var(--warning-color);border-radius:2px"></span>待审核 30单 (15%)</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="width:12px;height:12px;background:var(--info-color);border-radius:2px"></span>生产中 40单 (20%)</div>
            <div style="display:flex;align-items:center;gap:8px"><span style="width:12px;height:12px;background:var(--primary-color);border-radius:2px"></span>待发货 50单 (25%)</div>
          </div>
        </div>
      </div>
      
      <div class="content-card">
        <div class="card-header"><h3 class="card-title">交货及时率</h3></div>
        <div style="text-align:center;padding:20px">
          <div style="font-size:56px;font-weight:600;color:var(--success-color)">96.5%</div>
          <div style="color:var(--text-secondary);margin-top:8px">本月交货及时率</div>
          <div style="display:flex;justify-content:center;gap:40px;margin-top:24px">
            <div><div style="font-size:20px;font-weight:500">156</div><div style="font-size:12px;color:var(--text-secondary)">按时交付</div></div>
            <div><div style="font-size:20px;font-weight:500;color:var(--error-color)">6</div><div style="font-size:12px;color:var(--text-secondary)">延期交付</div></div>
          </div>
        </div>
      </div>
    </div>
  `,
  init() {
    // 渲染近期订单表格
    Table.render('recent-orders', {
      columns: [
        { key: 'id', title: '订单编号' },
        { key: 'customer', title: '客户' },
        { key: 'products', title: '产品', render: v => v[0]?.name?.slice(0, 15) || '-' },
        { key: 'totalAmount', title: '金额', align: 'right', render: v => Format.currency(v) },
        {
          key: 'status', title: '状态', render: v => Format.status(v, {
            '待审核': { text: '待审核', type: 'warning' },
            '已审核': { text: '已审核', type: 'info' },
            '已拆分': { text: '已拆分', type: 'info' },
            '已发货': { text: '已发货', type: 'info' },
            '已完成': { text: '已完成', type: 'success' },
            '已取消': { text: '已取消', type: 'default' }
          })
        }
      ],
      data: DataService.getSalesOrders().slice(0, 5)
    });
  }
};
