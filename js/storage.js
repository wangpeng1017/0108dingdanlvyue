// 数据持久化服务 - 使用 LocalStorage
const StorageService = {
    // 存储键前缀
    PREFIX: 'chint_demo_',

    /**
     * 保存数据到 LocalStorage
     * @param {string} key - 存储键
     * @param {any} data - 要保存的数据
     */
    save(key, data) {
        try {
            const fullKey = this.PREFIX + key;
            const jsonData = JSON.stringify(data);
            localStorage.setItem(fullKey, jsonData);
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            Message.error('数据保存失败');
            return false;
        }
    },

    /**
     * 从 LocalStorage 加载数据
     * @param {string} key - 存储键
     * @param {any} defaultValue - 默认值(如果不存在)
     * @returns {any} 加载的数据或默认值
     */
    load(key, defaultValue = null) {
        try {
            const fullKey = this.PREFIX + key;
            const jsonData = localStorage.getItem(fullKey);
            if (jsonData === null) {
                return defaultValue;
            }
            return JSON.parse(jsonData);
        } catch (error) {
            console.error('加载数据失败:', error);
            return defaultValue;
        }
    },

    /**
     * 删除指定键的数据
     * @param {string} key - 存储键
     */
    remove(key) {
        try {
            const fullKey = this.PREFIX + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    },

    /**
     * 清空所有数据
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    },

    /**
     * 检查是否存在指定键
     * @param {string} key - 存储键
     * @returns {boolean}
     */
    exists(key) {
        const fullKey = this.PREFIX + key;
        return localStorage.getItem(fullKey) !== null;
    },

    /**
     * 获取所有存储的键
     * @returns {string[]}
     */
    getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.PREFIX))
            .map(key => key.replace(this.PREFIX, ''));
    },

    /**
     * 初始化演示数据
     * 如果 LocalStorage 中没有数据,则使用默认演示数据初始化
     */
    initDemoData() {
        // 检查是否已经初始化过
        if (this.exists('initialized')) {
            console.log('数据已初始化,跳过');
            return false;
        }

        console.log('首次运行,初始化演示数据...');

        // 标记已初始化
        this.save('initialized', true);
        this.save('init_time', new Date().toISOString());

        return true;
    },

    /**
     * 重置为演示数据
     * 清空所有数据并重新初始化
     */
    resetDemoData() {
        this.clear();
        this.initDemoData();
        Message.success('演示数据已重置');
        // 刷新页面以重新加载数据
        setTimeout(() => window.location.reload(), 500);
    },

    /**
     * 导出所有数据为 JSON
     * @returns {object}
     */
    exportData() {
        const data = {};
        const keys = this.getAllKeys();
        keys.forEach(key => {
            data[key] = this.load(key);
        });
        return data;
    },

    /**
     * 从 JSON 导入数据
     * @param {object} data - 要导入的数据
     */
    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.save(key, data[key]);
            });
            Message.success('数据导入成功');
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            Message.error('数据导入失败');
            return false;
        }
    }
};
