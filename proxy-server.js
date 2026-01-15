const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3003;

// PPS API 代理配置
const ppsProxy = createProxyMiddleware({
  target: 'http://47.92.163.169',
  changeOrigin: true,
  pathRewrite: {
    '^/api/pps': '/mes-api/pps-api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PPS Proxy] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[PPS Proxy Error]', err.message);
    res.status(500).json({ success: false, message: '代理请求失败: ' + err.message });
  }
});

// 使用代理
app.use('/api/pps', ppsProxy);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pps-proxy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`PPS 代理服务启动成功!`);
  console.log(`- HTTP: http://8.130.182.148:${PORT}`);
  console.log(`- 健康检查: http://8.130.182.148:${PORT}/health`);
});
