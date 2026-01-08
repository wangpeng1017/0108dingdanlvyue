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
                parent.previousElementSibling?.querySelector('.nav-arrow')?.classList.add('expanded');
            }
        }
    },

    updateBreadcrumb(page) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const pageNames = {
            'dashboard': '首页',
            'order-list': '订单管理 / 订单列表',
            'order-tracking': '订单管理 / 交付跟踪',
            'production-plan': 'PMC管理 / 生产计划',
            'work-order': 'PMC管理 / 生产工单',
            'inspection': '仓库管理 / 送检单',
            'material-request': '仓库管理 / 领料单',
            'inventory': '仓库管理 / 库存查询',
            'purchase-order': '采购管理 / 采购订单',
            'supplier': '采购管理 / 供应商',
            'iqc': '质量管理 / 来料检验'
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
