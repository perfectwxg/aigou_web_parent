<template>
    <section>
        <el-row>
            <el-col :span="10">
                <el-tree
                        :data="treeData"
                        :props=treeProps
                        accordion
                        @node-click="handleNodeClick">
                </el-tree>
            </el-col>
            <el-col :span="14">
                <!--工具条-->
                <el-row :span="14" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="handleAddSpec">添加商品属性</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onlyViewProperties">只看显示属性</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onlySkuProperties">只看SKU属性</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row>
                    <el-table :data="viewPropertiesTable" highlight-current-row v-loading="viewPropertiesLoading"
                              empty-text="当前数据没有，请先选择商品类型哦！！！"
                              style="width: 100%;">
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="name" label="属性名称">
                        </el-table-column>
                        <el-table-column prop="sku" label="属性类型" :formatter="formatProperty"
                                         :filters="[{text:'普通属性',value: true},{text: 'sku属性', value: false}]">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-col>
        </el-row>
        <!--新增界面-->
        <el-dialog title="新增商品属性" :visible.sync="addPropertiesVisible"  v-model="addPropertiesForm"
                   :close-on-click-modal="false">
            <el-form :model="addPropertiesForm" label-width="80px" ref="addPropertiesForm">
                <el-form-item label="属性名称">
                    <el-input v-model="addPropertiesForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性类型">
                    <el-select v-model="addPropertiesForm.sku" placeholder="请选择属性类型">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addPropertiesVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addPropertiesSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑商品属性" :visible.sync="editPropertiesVisible"  v-model="editPropertiesForm"
                   :close-on-click-modal="false">
            <el-form :model="editPropertiesForm" label-width="80px" ref="editPropertiesForm">
                <el-form-item label="属性名称">
                    <el-input v-model="editPropertiesForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性类型">
                    <el-select v-model="editPropertiesForm.sku" placeholder="请选择属性类型">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editPropertiesVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editPropertiesSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    value: 1,
                    label: '普通显示属性'
                }, {
                    value: 0,
                    label: 'sku属性'
                }],
                addLoading:false,
                editLoading:false,
                viewPropertiesLoading: false,
                addPropertiesVisible: false,
                editPropertiesVisible: false,
                treeData: [],
                currentNode: [],
                viewPropertiesTable: [],
                treeProps: {
                    id: 'id',
                    label: 'name',
                    children: 'children'
                },
                addPropertiesForm: {
                    name: '',
                    sku: 0,
                    productTypeId: null,
                },
                editPropertiesForm: {
                    id:null,
                    name: '',
                    sku: 0,
                    productTypeId: null,
                }
            };
        },
        methods: {
            handleDel(index, row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.viewPropertiesLoading = true;
                    //NProgress.start();
                    let specId = row.id;
                    this.$http.delete('/product/specification/delete/'+specId).then(({res}) => {
                        this.viewPropertiesLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.handleNodeClick(this.currentNode);
                    });
                }).catch(() => {

                });
            },
            handleEdit(index,row){
                this.editPropertiesVisible = true;
                // this.editPropertiesForm = Object.assign({}, row);
                this.editPropertiesForm.id=row.id;
                this.editPropertiesForm.name=row.name;
                this.editPropertiesForm.productTypeId=row.productTypeId;
                if (row.sku){
                    this.editPropertiesForm.sku=1;
                }else{
                    this.editPropertiesForm.sku=0;
                }
            },
            //编辑
            editPropertiesSubmit: function () {
                this.$refs.editPropertiesForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editPropertiesForm);
                            console.log(para);
                            this.$http.post('/product/specification/save',para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editPropertiesForm'].resetFields();
                                this.editPropertiesVisible = false;
                                this.handleNodeClick(this.currentNode);
                            });
                        });
                    }
                });
            },
            formatProperty(row, column) {
                if (row.sku) {
                    return '显示属性';
                } else {
                    return 'sku属性';
                }
            },
            handleAddSpec() {
                let productTypeId = this.currentNode.id;
                if (!productTypeId) {
                    this.$message({
                        message: '请选择商品类型后再操作！！！',
                        type: 'warning'
                    });
                    return false;
                }
                this.addPropertiesForm.productTypeId = productTypeId;
                this.addPropertiesVisible = true;
            },
            //新增
            addPropertiesSubmit: function () {
                this.$refs.addPropertiesForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认给‘'+this.currentNode.name+'’吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addPropertiesForm);
                            // console.log(para)
                            this.$http.post('/product/specification/save',para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addPropertiesForm'].resetFields();
                                this.addPropertiesVisible = false;
                                this.handleNodeClick(this.currentNode);
                            });
                        });
                    }
                });
            },
            onlyViewProperties() {
                let productTypeId = this.currentNode.id;
                if (!productTypeId) {
                    this.$message({
                        message: '请选择商品类型后再操作！！！',
                        type: 'warning'
                    });
                    return false;
                }
                //获取类型的显示属性
                this.$http.get('/product/specification/productType/viewProperties/' + productTypeId)
                    .then(({data}) => {
                        this.viewPropertiesLoading = true;
                        this.viewPropertiesTable = data;
                        this.viewPropertiesLoading = false;

                    })
            },
            onlySkuProperties() {
                console.log(this.currentNode)
                let productTypeId = this.currentNode.id;
                if (!productTypeId) {
                    this.$message({
                        message: '请选择商品类型后再操作！！！',
                        type: 'warning'
                    });
                    return false;
                }
                //获取类型的sku属性
                this.$http.get('/product/specification/productType/skuProperties/' + productTypeId)
                    .then(({data}) => {
                        this.viewPropertiesLoading = true;
                        this.viewPropertiesTable = data;
                        this.viewPropertiesLoading = false;

                    })
            },
            handleNodeClick(data) {
                this.currentNode = data;
                let productTypeId = data.id;
                //获取类型的属性
                this.$http.get('/product/specification/productType/' + productTypeId)
                    .then(({data}) => {
                        this.viewPropertiesLoading = true;
                        this.viewPropertiesTable = data;
                        console.log(this.viewPropertiesTable)
                        this.viewPropertiesLoading = false;

                    })
            },
            getProductTypeTreeData() {
                this.$http.get('/product//productType/getProductTree')
                    .then(res => {
                        this.treeData = res.data;

                    })
            }
        },
        //页面加载完毕了执行
        mounted() {
            //获取数据
            this.getProductTypeTreeData();
        }
    };
</script>