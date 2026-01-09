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
      <!-- 统计卡片 -->
      <div class="dashboard-stat-cards">
        <div class="dashboard-stat-card">
          <div class="stat-circle success">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <rect x="12" y="12" width="24" height="24" rx="2" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">生产订单</div>
            <div class="stat-numbers">
              <span class="stat-current">28</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">156</span>
            </div>
            <div class="stat-subtitle">进行中/已完成</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle warning">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <circle cx="24" cy="24" r="10" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">设备利用率</div>
            <div class="stat-numbers">
              <span class="stat-current">85.6</span>
              <span class="stat-total">%</span>
            </div>
            <div class="stat-subtitle">当前利用率</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle error">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <path d="M24 12L32 28H16L24 12Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">质量问题</div>
            <div class="stat-numbers">
              <span class="stat-current">3</span>
              <span class="stat-divider">/</span>
              <span class="stat-total">127</span>
            </div>
            <div class="stat-subtitle">待处理/已处理</div>
          </div>
        </div>
        
        <div class="dashboard-stat-card">
          <div class="stat-circle info">
            <svg viewBox="0 0 48 48" class="stat-icon">
              <polygon points="24,10 30,22 42,24 33,33 35,45 24,39 13,45 15,33 6,24 18,22" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-title">产能达成率</div>
            <div class="stat-numbers">
              <span class="stat-current">92.3</span>
              <span class="stat-total">%</span>
            </div>
            <div class="stat-subtitle">本月达成率</div>
          </div>
        </div>
      </div>
      
      <!-- 数据可视化 -->
      <div class="dashboard-viz-grid">
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">生产进度</h3>
          </div>
          <div class="viz-content">
            <div class="bar-chart">
              <div class="bar-item">
                <div class="bar-label">产线A</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:88%;background:#52c41a"></div>
                </div>
                <div class="bar-value">88%</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">产线B</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:75%;background:#1890ff"></div>
                </div>
                <div class="bar-value">75%</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">产线C</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:92%;background:#52c41a"></div>
                </div>
                <div class="bar-value">92%</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">产线D</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:65%;background:#faad14"></div>
                </div>
                <div class="bar-value">65%</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">产线E</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:80%;background:#1890ff"></div>
                </div>
                <div class="bar-value">80%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">设备状态</h3>
          </div>
          <div class="viz-content">
            <div class="donut-chart-container">
              <div class="donut-chart">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" stroke-width="20"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#52c41a" stroke-width="20" 
                    stroke-dasharray="188.4 251.2" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#faad14" stroke-width="20" 
                    stroke-dasharray="31.4 251.2" stroke-dashoffset="-188.4" transform="rotate(-90 50 50)"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ff4d4f" stroke-width="20" 
                    stroke-dasharray="31.4 251.2" stroke-dashoffset="-219.8" transform="rotate(-90 50 50)"/>
                </svg>
                <div class="donut-center">
                  <div class="donut-value">45</div>
                  <div class="donut-label">设备总数</div>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item">
                  <span class="legend-dot" style="background:#52c41a"></span>
                  <span class="legend-label">运行中 (30)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background:#faad14"></span>
                  <span class="legend-label">待机 (10)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot" style="background:#ff4d4f"></span>
                  <span class="legend-label">故障 (5)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">产量趋势</h3>
          </div>
          <div class="viz-content">
            <div class="bar-chart">
              <div class="bar-item">
                <div class="bar-label">周一</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:75%;background:#1890ff"></div>
                </div>
                <div class="bar-value">1500</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">周二</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:85%;background:#1890ff"></div>
                </div>
                <div class="bar-value">1700</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">周三</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:90%;background:#1890ff"></div>
                </div>
                <div class="bar-value">1800</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">周四</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:80%;background:#1890ff"></div>
                </div>
                <div class="bar-value">1600</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">周五</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:95%;background:#52c41a"></div>
                </div>
                <div class="bar-value">1900</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">质量指标</h3>
          </div>
          <div class="viz-content">
            <div class="gauge-chart-group">
              <div class="gauge-chart">
                <div class="gauge-value">98.5%</div>
                <div class="gauge-label">合格率</div>
              </div>
              <div class="gauge-chart">
                <div class="gauge-value">1.2%</div>
                <div class="gauge-label">返工率</div>
              </div>
              <div class="gauge-chart">
                <div class="gauge-value">0.3%</div>
                <div class="gauge-label">报废率</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">物料消耗Top5</h3>
          </div>
          <div class="viz-content">
            <div class="bar-chart">
              <div class="bar-item">
                <div class="bar-label">钢材</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:90%;background:#1890ff"></div>
                </div>
                <div class="bar-value">4500kg</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">铝材</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:75%;background:#1890ff"></div>
                </div>
                <div class="bar-value">3750kg</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">塑料</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:60%;background:#1890ff"></div>
                </div>
                <div class="bar-value">3000kg</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">电子元件</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:45%;background:#1890ff"></div>
                </div>
                <div class="bar-value">2250pcs</div>
              </div>
              <div class="bar-item">
                <div class="bar-label">包装材料</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width:30%;background:#1890ff"></div>
                </div>
                <div class="bar-value">1500pcs</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">人员效率</h3>
          </div>
          <div class="viz-content">
            <div class="gauge-chart">
              <div class="gauge-ring" style="--progress:87">
                <div class="gauge-inner">
                  <div class="gauge-percent">87%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
