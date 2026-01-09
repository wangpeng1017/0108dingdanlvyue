// 仪表盘首页
Pages['dashboard'] = {
  template: `
    <div class="page-header">
      <h1 class="page-title">工作台</h1>
      <p class="page-desc">订单履约及交付管理系统</p>
    </div>
    
    <!-- 驾驶舱标签页 -->
    <div class="dashboard-tabs">
      <div class="tab-item active" data-tab="sales">销售驾驶舱</div>
      <div class="tab-item" data-tab="production">生产驾驶舱</div>
    </div>
    
    <!-- 销售驾驶舱内容 -->
    <div class="tab-content active" data-content="sales">
      <!-- 统计卡片 -->
      <div class="dashboard-stat-cards">
        <div class="dashboard-stat-card">
          <div class="stat-circle primary">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <path d="M24 8L28 16H36L30 22L32 30L24 26L16 30L18 22L12 16H20L24 8Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">到货请求</div>
            <div class="stat-numbers">
              <span class="stat-current">3</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">1</span>
            </div>
            <div class="stat-subtitle">待处理/已处理</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle info">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <circle cx="24" cy="24" r="12" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">来料检验</div>
            <div class="stat-numbers">
              <span class="stat-current">51</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">48</span>
            </div>
            <div class="stat-subtitle">待检验/已检验</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle error">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <path d="M24 12L12 36H36L24 12Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">发货请求</div>
            <div class="stat-numbers">
              <span class="stat-current">2</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">3</span>
            </div>
            <div class="stat-subtitle">待发货/已发货</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle warning">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <rect x="16" y="16" width="16" height="16" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">转料申请</div>
            <div class="stat-numbers">
              <span class="stat-current">4</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">3</span>
            </div>
            <div class="stat-subtitle">待转料/已转料</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle pink">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <path d="M18 24L24 18L30 24L24 30L18 24Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">上架任务</div>
            <div class="stat-numbers">
              <span class="stat-current">2</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">0</span>
            </div>
            <div class="stat-subtitle">待上架/已上架</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle blue">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <rect x="12" y="12" width="24" height="24" rx="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">拣货任务</div>
            <div class="stat-numbers">
              <span class="stat-current">0</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">0</span>
            </div>
            <div class="stat-subtitle">待拣货/已拣货</div>
          </div>
        </div>
      </div>
      
      <!-- 数据可视化卡片 -->
      <div class="dashboard-viz-grid">
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">库龄分布</h3>
          </div>
          <div class="viz-content">
            <div class="donut-chart">
              <div class="donut-ring" style="background:conic-gradient(#52c41a 0% 100%)">
                <div class="donut-hole">
                  <div class="donut-value">100%</div>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item">
                  <span class="legend-dot" style="background:#ff4d4f"></span>
                  <span class="legend-label">0-30天</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background:#262626"></span>
                  <span class="legend-label">31-60天</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background:#1890ff"></span>
                  <span class="legend-label">61-90天</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background:#faad14"></span>
                  <span class="legend-label">91-180天</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background:#52c41a"></span>
                  <span class="legend-label">180天+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">仓库利用率</h3>
          </div>
          <div class="viz-content">
            <div class="gauge-chart-group">
              <div class="gauge-chart">
                <div class="gauge-value">0%</div>
                <div class="gauge-label">现场零部件</div>
              </div>
              <div class="gauge-chart">
                <div class="gauge-value">0%</div>
                <div class="gauge-label">原材料</div>
              </div>
              <div class="gauge-chart">
                <div class="gauge-value">0%</div>
                <div class="gauge-label">备品备件</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">库存周转率Top5</h3>
          </div>
          <div class="viz-content">
            <div class="bar-chart">
              <div class="bar-item">
                <div class="bar-label">主板</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">...</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">...</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">...</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">物料</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">有效期预警量</h3>
          </div>
          <div class="viz-content">
            <div class="gauge-chart">
              <div class="gauge-ring" style="--progress:0">
                <div class="gauge-inner">
                  <div class="gauge-percent">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">库存占用Top5</h3>
          </div>
          <div class="viz-content">
            <div class="bar-chart">
              <div class="bar-item">
                <div class="bar-label">主板</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">...</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">...</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">...</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">物料</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:0%"></div>
                </div>
                <div class="bar-value">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 生产驾驶舱内容 -->
    <div class="tab-content" data-content="production">
      <div style="padding:60px;text-align:center;color:var(--text-secondary)">
        <div style="font-size:48px;margin-bottom:16px">🏭</div>
        <div style="font-size:16px">生产驾驶舱数据开发中...</div>
      </div>
    </div>
  `,
  init() {
    // 标签页切换
    const tabs = document.querySelectorAll('.dashboard-tabs .tab-item');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // 更新标签页激活状态
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 更新内容区激活状态
        contents.forEach(c => {
          if (c.dataset.content === targetTab) {
            c.classList.add('active');
          } else {
            c.classList.remove('active');
          }
        });
      });
    });
  }
};
