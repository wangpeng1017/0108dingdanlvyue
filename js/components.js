// 消息提示组件
const Message = {
    container: null,
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'message-container';
            document.body.appendChild(this.container);
        }
    },
    show(text, type = 'info', duration = 3000) {
        this.init();
        const icons = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' };
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `<span class="message-icon">${icons[type]}</span><span class="message-text">${text}</span>`;
        this.container.appendChild(message);
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, duration);
    },
    success(text) { this.show(text, 'success'); },
    warning(text) { this.show(text, 'warning'); },
    error(text) { this.show(text, 'error'); },
    info(text) { this.show(text, 'info'); }
};

// 模态框组件
const Modal = {
    currentModal: null,
    create(options) {
        const { title = '标题', content = '', size = '', showFooter = true, okText = '确定', cancelText = '取消', onOk = null, onCancel = null, className = '' } = options;
        const overlay = document.createElement('div');
        overlay.className = `modal-overlay ${className}`;
        overlay.innerHTML = `
      <div class="modal ${size ? 'modal-' + size : ''}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" title="关闭">×</button>
        </div>
        <div class="modal-body">${content}</div>
        ${showFooter ? `<div class="modal-footer"><button class="btn btn-default modal-cancel">${cancelText}</button><button class="btn btn-primary modal-ok">${okText}</button></div>` : ''}
      </div>`;
        document.body.appendChild(overlay);
        const close = () => { overlay.classList.remove('show'); setTimeout(() => overlay.remove(), 300); this.currentModal = null; };
        overlay.querySelector('.modal-close').addEventListener('click', () => { if (onCancel) onCancel(); close(); });
        overlay.querySelector('.modal-cancel')?.addEventListener('click', () => { if (onCancel) onCancel(); close(); });
        overlay.querySelector('.modal-ok')?.addEventListener('click', () => { if (onOk && onOk() === false) return; close(); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) { if (onCancel) onCancel(); close(); } });
        requestAnimationFrame(() => overlay.classList.add('show'));
        this.currentModal = overlay;
        return overlay;
    },
    confirm(options) {
        const { title = '确认', message = '确定要执行此操作吗？', type = 'warning', okText = '确定', cancelText = '取消', onOk = null, onCancel = null } = options;
        const icons = { warning: '⚠', danger: '⚠', success: '✓' };
        return this.create({
            title, className: 'confirm-modal', okText, cancelText, onOk, onCancel,
            content: `<div class="confirm-content"><span class="confirm-icon ${type}">${icons[type]}</span><div class="confirm-message"><div class="confirm-desc">${message}</div></div></div>`
        });
    },
    close() { if (this.currentModal) { this.currentModal.classList.remove('show'); setTimeout(() => { if (this.currentModal) { this.currentModal.remove(); this.currentModal = null; } }, 300); } }
};

// 表格组件
const Table = {
    render(containerId, options) {
        const { columns = [], data = [], showCheckbox = false, showIndex = false, emptyText = '暂无数据' } = options;
        const container = document.getElementById(containerId);
        if (!container) return;
        if (data.length === 0) { container.innerHTML = `<div class="table-empty"><div class="table-empty-icon">📋</div><div>${emptyText}</div></div>`; return; }
        container.innerHTML = `<div class="table-container"><table class="data-table"><thead><tr>
      ${showCheckbox ? '<th style="width:40px"><input type="checkbox" class="select-all"></th>' : ''}
      ${showIndex ? '<th style="width:60px">序号</th>' : ''}
      ${columns.map(c => `<th style="${c.width ? 'width:' + c.width : ''}" class="${c.align ? 'text-' + c.align : ''}">${c.title}</th>`).join('')}
    </tr></thead><tbody>
      ${data.map((row, i) => `<tr data-id="${row.id || i}">
        ${showCheckbox ? '<td><input type="checkbox" class="row-checkbox"></td>' : ''}
        ${showIndex ? `<td class="text-center">${i + 1}</td>` : ''}
        ${columns.map(c => { let v = row[c.key]; if (c.render) v = c.render(v, row, i); return `<td class="${c.align ? 'text-' + c.align : ''}">${v ?? '-'}</td>`; }).join('')}
      </tr>`).join('')}
    </tbody></table></div>`;
        if (showCheckbox) {
            const selectAll = container.querySelector('.select-all');
            const cbs = container.querySelectorAll('.row-checkbox');
            selectAll.addEventListener('change', e => cbs.forEach(c => c.checked = e.target.checked));
            cbs.forEach(c => c.addEventListener('change', () => selectAll.checked = Array.from(cbs).every(x => x.checked)));
        }
    },
    getSelected(containerId) {
        const container = document.getElementById(containerId);
        return container ? Array.from(container.querySelectorAll('.row-checkbox:checked')).map(c => c.closest('tr').dataset.id) : [];
    }
};

// 分页组件
const Pagination = {
    render(containerId, options) {
        const { current = 1, pageSize = 10, total = 0, onChange = null } = options;
        const container = document.getElementById(containerId);
        if (!container) return;
        const totalPages = Math.ceil(total / pageSize);
        let pages = totalPages <= 7 ? Array.from({ length: totalPages }, (_, i) => i + 1) :
            current <= 4 ? [1, 2, 3, 4, 5, '...', totalPages] :
                current >= totalPages - 3 ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages] :
                    [1, '...', current - 1, current, current + 1, '...', totalPages];
        container.innerHTML = `<div class="pagination">
      <span class="pagination-info">共 ${total} 条</span>
      <button class="pagination-btn" ${current === 1 ? 'disabled' : ''} data-page="${current - 1}">‹</button>
      ${pages.map(p => p === '...' ? '<span class="pagination-btn" style="border:none">...</span>' : `<button class="pagination-btn ${p === current ? 'active' : ''}" data-page="${p}">${p}</button>`).join('')}
      <button class="pagination-btn" ${current === totalPages ? 'disabled' : ''} data-page="${current + 1}">›</button>
    </div>`;
        container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => { const p = parseInt(btn.dataset.page); if (p && p !== current && p >= 1 && p <= totalPages && onChange) onChange(p); });
        });
    }
};

// 加载状态
const Loading = {
    show(container) {
        if (typeof container === 'string') container = document.getElementById(container);
        if (!container) return;
        container.style.position = 'relative';
        const o = document.createElement('div'); o.className = 'loading-overlay'; o.innerHTML = '<div class="loading-spinner"></div>';
        container.appendChild(o);
    },
    hide(container) {
        if (typeof container === 'string') container = document.getElementById(container);
        container?.querySelector('.loading-overlay')?.remove();
    }
};

// 表单工具
const FormValidator = {
    validate(form) {
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
            input.classList.remove('error');
            input.parentElement.querySelector('.error-message')?.remove();
            if (!input.value.trim()) {
                valid = false; input.classList.add('error');
                const err = document.createElement('span'); err.className = 'error-message';
                err.textContent = '此字段为必填项'; err.style.cssText = 'color:var(--error-color);font-size:12px;display:block;margin-top:4px';
                input.parentElement.appendChild(err);
            }
        });
        return valid;
    },
    getData(form) {
        const data = {};
        form.querySelectorAll('input,select,textarea').forEach(i => {
            if (i.name) data[i.name] = i.type === 'checkbox' ? i.checked : i.type === 'radio' ? (i.checked ? i.value : data[i.name]) : i.value;
        });
        return data;
    },
    setData(form, data) { Object.keys(data).forEach(k => { const i = form.querySelector(`[name="${k}"]`); if (i) i.type === 'checkbox' ? i.checked = data[k] : i.value = data[k]; }); },
    reset(form) { form.reset(); form.querySelectorAll('.error').forEach(e => e.classList.remove('error')); form.querySelectorAll('.error-message').forEach(e => e.remove()); }
};

// 格式化工具
const Format = {
    date(d) { if (!d) return '-'; const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`; },
    number(n) { return n == null ? '-' : Number(n).toLocaleString('zh-CN'); },
    currency(n) { return n == null ? '-' : '¥' + Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2 }); },
    percent(n) { return n == null ? '-' : n + '%'; },
    status(s, map) { const c = map[s] || { text: s, type: 'default' }; return `<span class="status-tag ${c.type}">${c.text}</span>`; }
};

// CSV导出
const ExportCSV = {
    export(data, columns, filename = 'export.csv') {
        let csv = '\uFEFF' + columns.map(c => c.title).join(',') + '\n';
        data.forEach(row => { csv += columns.map(c => { let v = row[c.key] ?? ''; v = String(v).replace(/"/g, '""'); return v.includes(',') ? `"${v}"` : v; }).join(',') + '\n'; });
        const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); link.download = filename; link.click();
    }
};

window.Message = Message; window.Modal = Modal; window.Table = Table; window.Pagination = Pagination;
window.Loading = Loading; window.FormValidator = FormValidator; window.Format = Format; window.ExportCSV = ExportCSV;
