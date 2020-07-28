let dataTables = DataTables.default;

Vue.component('tabel-detail', {
    template: '#tabel-detail-template',
    components: {dataTables},
    data: function () {
        return {
            tableData: [],
            dialogFormVisible: false,
            form: {
                name: '',
                index: ''
            },
            formType: 'create',
            formTitle: '添加数据',
            ruleForm: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
              },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            },
            options: [{
                value: '选项1',
                label: '黄金糕'
              }, {
                value: '选项2',
                label: '双皮奶'
              }, {
                value: '选项3',
                label: '蚵仔煎'
              }, {
                value: '选项4',
                label: '龙须面'
              }, {
                value: '选项5',
                label: '北京烤鸭'
              }],
              value: ''
        }
    },
    mounted: function () {
        this.getCategories();
    },
    methods: {
        getActionsDef: function () {
            let self = this;
            return {
                width: 5,
                def: [{
                    name: '添加数据',
                    handler() {
                        self.formType = 'create';
                        self.formTitle = '添加数据';
                        self.form.name = '';
                        self.form.index = '';
                        self.dialogFormVisible = true;
                    },
                    icon: 'plus'
                }]
            }
        },
        getPaginationDef: function () {
            return {
                pageSize: 10,
                pageSizes: [10, 20, 50]
            }
        },
        getRowActionsDef: function () {
            let self = this;
            return [{
                type: 'primary',
                handler(row) {
                    self.formType = 'edit';
                    self.form.name = row.name;
                    self.form.index = row.index;
                    self.formTitle = '编辑数据';
                    self.dialogFormVisible = true;
                },
                name: '编辑'
            }, {
                type: 'danger',
                handler(row) {
                    if (row.flag === 'true') {
                        self.$message.success("该信息不能删除！")
                    } else {
                        self.$confirm('确认删除该数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function () {
                            let url = Flask.url_for("delete", {name: row.name, index: row.index});
                            axios.delete(url).then(function (response) {
                                self.getCategories();
                                self.$message.success("删除成功！")
                            }).catch(self.showError)
                        });

                    }
                },
                name: '删除'
            }]
        },
        getCategories: function () {
            let url = Flask.url_for("get_base_data");
            let self = this;
            axios.get(url).then(function (response) {
                self.tableData = response.data.results;
            });
        },
        createOrUpdate: function () {
            let self = this;
            if (self.form.name === '') {
                self.$message.error('数据不能为空！');
                return
            }
            if (self.formType === 'create') {
                let url = Flask.url_for("add");
                axios.post(url, {
                    name: self.form.name
                }).then(function (response) {
                    self.getCategories();
                    self.dialogFormVisible = false;
                    self.$message.success('添加成功！')
                }).catch(self.showError);
            } else {
                let url = Flask.url_for("update", {});
                axios.put(url, {
                    name: self.form.name,
                    index: self.form.index
                }).then(function (response) {
                    self.getCategories();
                    self.dialogFormVisible = false;
                    self.$message.success('修改成功！')
                }).catch(self.showError);
            }
        },
        showError: function (error) {
            let response = error.response;
            this.$message.error(response.data.message);
        }
    }
});

new Vue({
    el: '#vue-app'
});