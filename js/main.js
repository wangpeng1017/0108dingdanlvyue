// 页面模块容器 - 必须在页面脚本加载前定义
window.Pages = window.Pages || {};

// 主应用逻辑
const App = {
    currentPage: 'dashboard',

    init() {
        this.bindNavigation();
        this.bindUserMenu();
        this.loadPage(this.currentPage);
    },

    bindNavigation() {
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.loadPage(page);
            });
        });

        // 子菜单展开
        document.querySelectorAll('.nav-link[data-submenu]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = link.nextElementSibling;
                const arrow = link.querySelector('.nav-arrow');
                if (submenu) {
                    submenu.classList.toggle('expanded');
                    arrow?.classList.toggle('expanded');
                }
            });
        });

        // 折叠侧边栏
        document.querySelector('.toggle-sidebar')?.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('sidebar-collapsed');
            document.querySelector('.main-container').classList.toggle('sidebar-collapsed');
        });
    },

    bindUserMenu() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.addEventListener('click', () => {
                dropdown.parentElement.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                if (!dropdown.parentElement.contains(e.target)) {
                    dropdown.parentElement.classList.remove('open');
                }
            });
        }
    },

    loadPage(page) {
        this.currentPage = page;
        this.updateActiveNav(page);
        this.updateBreadcrumb(page);

        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;

        Loading.show(pageContent);

        setTimeout(() => {
            const pageModule = window.Pages?.[page];
            if (pageModule) {
                pageContent.innerHTML = pageModule.template;
                pageModule.init?.();
            } else {
                pageContent.innerHTML = `<div class="content-card"><h2>页面开发中...</h2><p>当前页面: ${page}</p></div>`;
            }
            Loading.hide(pageContent);
        }, 200);
    },

    updateActiveNav(page) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            const parent = activeLink.closest('.nav-submenu');
            if (parent) {
                parent.classList.add('expanded');
                const parentNav = parent.previousElementSibling;
                parentNav?.querySelector('.nav-arrow')?.classList.add('expanded');
                parentNav?.classList.add('active');

                // 更新顶部标签页
                this.updateHeaderTabs(parent, page);
            } else {
                // 隐藏标签页(一级菜单)
                document.getElementById('header-tabs').style.display = 'none';
            }
        }
    },

    updateHeaderTabs(submenu, activePage) {
        const headerTabs = document.getElementById('header-tabs');
        if (!headerTabs || !submenu) return;

        // 获取所有子菜单项
        const subLinks = submenu.querySelectorAll('.nav-link[data-page]');
        if (subLinks.length === 0) {
            headerTabs.style.display = 'none';
            return;
        }

        // 页面图标映射
        const pageIcons = {
            // 主数据管理
            'user-management': '👤',
            'role-management': '👥',
            'rule-management': '📋',
            'warehouse-master': '🏭',
            'product-master': '📦',
            'service-provider': '🚚',
            'customer-master': '🏢',
            'contract-management': '📄',
            'order-type': '📑',
            'consignee': '📍',
            // 销售管理
            'order-create': '➕',
            'order-list': '📊',
            'order-split': '✂️',
            'order-status': '📈',
            // 交货单管理
            'delivery-create': '🆕',
            'delivery-list': '📋',
            'delivery-trace': '🔍',
            // S&OP计划
            'sop-data': '📊',
            'sop-demand': '📈',
            'sop-coordinate': '🤝',
            'sop-tracking': '👁️',
            // 报表分析
            'report-template': '📝',
            'report-query': '🔍'
        };

        // 只显示当前激活的标签
        const activeLink = Array.from(subLinks).find(link => link.dataset.page === activePage);
        if (!activeLink) {
            headerTabs.style.display = 'none';
            return;
        }

        const page = activeLink.dataset.page;
        const text = activeLink.textContent.trim();
        const icon = pageIcons[page] || '📄';

        headerTabs.innerHTML = `<div class="tab-item active" data-page="${page}">${icon && `<span class="tab-icon">${icon}</span>`}${text}</div>`;
        headerTabs.style.display = 'flex';
    },

    updateBreadcrumb(page) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const pageNames = {
            'dashboard': '首页',
            // 主数据管理
            'user-management': '主数据管理 / 用户管理',
            'role-management': '主数据管理 / 角色管理',
            'rule-management': '主数据管理 / 规则管理',
            'warehouse-master': '主数据管理 / 仓库管理',
            'product-master': '主数据管理 / 货品管理',
            'service-provider': '主数据管理 / 服务商管理',
            'customer-master': '主数据管理 / 客户管理',
            'contract-management': '主数据管理 / 合同管理',
            'order-type': '主数据管理 / 订单类型管理',
            'consignee': '主数据管理 / 收货人管理',
            // 销售管理
            'order-create': '销售管理 / 订单录入',
            'order-list': '销售管理 / 订单列表',
            'order-split': '销售管理 / 订单拆分',
            'order-status': '销售管理 / 订单状态跟踪',
            // 交货单管理
            'delivery-create': '交货单管理 / 交货单创建',
            'delivery-list': '交货单管理 / 交货单列表',
            'delivery-trace': '交货单管理 / 关联追溯',
            // S&OP计划
            'sop-data': 'S&OP计划 / 数据收集',
            'sop-demand': 'S&OP计划 / 需求计划',
            'sop-coordinate': 'S&OP计划 / 协调计划',
            'sop-tracking': 'S&OP计划 / 执行跟踪',
            // 报表分析
            'report-template': '报表分析 / 报表模板',
            'report-query': '报表分析 / 报表查询'
        };

        const parts = (pageNames[page] || page).split(' / ');
        breadcrumb.innerHTML = parts.map((p, i) =>
            `<span class="breadcrumb-item">${p}</span>${i < parts.length - 1 ? '<span class="breadcrumb-separator">/</span>' : ''}`
        ).join('');
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;

