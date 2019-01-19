<template>
    <div>
    <section>
        <!--工具条-->
        <el-row>
            <el-col :span="12">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.keyword" placeholder="关键字" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getSpecificationPages">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="specifications" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                          style="width: 100%;"
                          @row-click="showSpecOption"
                    >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="specName" label="规格名称"  sortable>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                                   :total="total" style="float:right;">
                    </el-pagination>
                </el-col>
                <!--编辑界面-->
                <el-dialog title="编辑规格" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
                    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                        <el-form-item label="规格名称" prop="name">
                            <el-input v-model="editForm.specName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog title="新增规格" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
                    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                        <el-form-item label="规格名称" prop="name">
                            <el-input v-model="addForm.specName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
            </el-col>
            <!--规格选项-->
            <el-col :span="12">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="optionFilters">
                        <el-form-item>
                            <el-button type="primary" @click="handleAddOption">+</el-button> &nbsp;&nbsp;&nbsp;规格详细属性
                        </el-form-item>
                    </el-form>

                </el-col>

                <!--列表-->
                <el-table :data="specificationOptions" highlight-current-row v-loading="optionListLoading" @selection-change="optionSelsChange"
                          style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="index" label="排序标识"  sortable>
                    </el-table-column>
                    <el-table-column prop="optionName" label="规格选项名称"  sortable>
                    </el-table-column>

                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" @click="handleEditOption(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDelOption(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="optionBatchRemove" :disabled="this.optionSels.length===0">批量删除</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleOptionCurrentChange"
                                   :total="optionTotal" style="float:right;">
                    </el-pagination>
                </el-col>

                <!--编辑界面-->
                <el-dialog title="编辑" :visible.sync="editOptionFormVisible" v-model="editOptionFormVisible" :close-on-click-modal="false">
                    <el-form :model="editOptionForm" label-width="80px" :rules="editOptionFormRules" ref="editOptionForm">
                        <el-form-item label="品牌名称" prop="name">
                            <el-input v-model="editOptionForm.optionName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="英文名">
                            <el-input v-model="editOptionForm.index" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editOptionFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editOptionSubmit" :loading="editOptionLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog title="新增" :visible.sync="addOptionFormVisible" v-model="addOptionFormVisible" :close-on-click-modal="false">
                    <el-form :model="addOptionForm" label-width="80px" :rules="addOptionFormRules" ref="addOptionForm">
                        <el-form-item label="属性名称">
                            <el-input v-model="addOptionForm.optionName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="标识">
                            <el-input v-model="addOptionForm.index" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addOptionFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addOptionSubmit" :loading="addOptionLoading">提交</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </section>
    </div>
</template>


<script>
    import {getSpecificationPage, removeSpecification, batchRemoveSpecification, editSpecification, addSpecification} from '../../api/api';
    import {getSpecificationOptionPage, removeSpecificationOption, batchRemoveSpecificationOption, editSpecificationOption, addSpecificationOption,getSpecificationOptions} from '../../api/api';
    export default {
        data: function () {
            return {
                pid:'',
                optionFilters: {
                    keyword: ''
                },
                filters: {
                    keyword: ''
                },
                specifications: [],
                specificationOptions: [],
                specOptionDatas:[],
                total: 0,
                page: 1,
                optionTotal: 0,
                optonPage: 1,
                listLoading: false,
                optionListLoading: false,
                sels: [],//列表选中列
                optionSels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    optionName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id:0,
                    specName:''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    specName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    specName:''
                },

                editOptionFormVisible: false,//编辑界面是否显示
                editOptionLoading: false,
                editOptionFormRules: {
                    optionName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editOptionForm: {
                    id:0,
                    specId:0,
                    optionName:'',
                    index:''
                },
                addOptionFormVisible: false,//新增界面是否显示
                addOptionLoading: false,
                addOptionFormRules: {
                    optionName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addOptionForm: {
                    specId:0,
                    optionName:'',
                    index:''
                }
            }
        },
        methods: {
            showSpecOption(row, event, column){
                console.log(row);
                let id = row.id;
                this.initSpecificationOptionPages(id);
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getSpecificationPages();
            },
            handleOptionCurrentChange(val) {
                this.optonPage = val;
                this.getSpecificationOptionPages();
            },
            //获取规格列表
            getSpecificationPages() {
                let para = {
                    pageNum: this.page,
                    // pageNum: 1,
                    pageSize: 10,
                    keyword: this.filters.keyword
                };
                this.listLoading = true;
                console.log(para);
                getSpecificationPage(para).then(({data}) => {
                    this.total = data.total;
                    this.specifications = data.lists;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeSpecification(para).then(({res}) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSpecificationPages();
                    });
                }).catch(() => {

                });
            },


            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addForm.specName='';
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            console.log(para);
                            para.updateTime = new Date();
                            editSpecification(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getSpecificationPages();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addSpecification(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getSpecificationPages();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                //var ids = this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
                var ids = this.sels.map(item => item.id).join(",");
                console.log(ids);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = ids;
                    batchRemoveSpecification(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSpecificationPages();
                    });
                }).catch(() => {

                });
            },

            handleOptionCurrentChange(val) {
                this.optonPage = val;
                this.getSpecificationOptionPages();
            },
            //获取规格列表
            getSpecificationOptionPages() {
                let para = {
                    pageNum: this.optonPage,
                    // pageNum: 1,
                    pageSize: 13,
                    keyword: this.optionFilters.keyword
                };
                this.optionListLoading = false;
                getSpecificationOptions().then(({data}) => {
                    this.specOptionDatas=data;
                });
            },
            initSpecificationOptionPages(id){
                let temp=[],j=0;
                this.pid = id;
                console.log(this.pid);
                this.optionListLoading=true;
                for (let i=0;i<this.specOptionDatas.length;i++){
                    if(id==this.specOptionDatas[i].specId){
                        console.log(this.specOptionDatas[i]);
                        temp[j]=this.specOptionDatas[i];
                        j++;
                    }
                }
                this.optionTotal = j;
                this.specificationOptions = temp;
                this.optionListLoading = false;

            },
            //删除
            handleDelOption: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.optionListLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeSpecificationOption(para).then(({res}) => {
                        this.optionListLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSpecificationOptionPages();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEditOption: function (index, row) {
                this.editOptionFormVisible = true;
                this.editOptionForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAddOption: function () {
                this.addOptionFormVisible = true;
                this.addOptionForm.specId = this.pid;
            },
            //编辑
            editOptionSubmit: function () {
                this.$refs.editOptionForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editOptionLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editOptionForm);
                            editSpecificationOption(para).then((res) => {
                                this.editOptionLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editOptionForm'].resetFields();
                                this.editOptionFormVisible = false;
                                this.getSpecificationOptionPages();
                            });
                        });
                    }
                });
            },
            //新增
            addOptionSubmit: function () {
                this.$refs.addOptionForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addOptionLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addOptionForm);
                            console.log(this.addOptionForm)
                            addSpecificationOption(para).then((res) => {
                                this.addOptionLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addOptionForm'].resetFields();
                                this.addOptionFormVisible = false;
                                this.getSpecificationOptionPages();
                                this.initSpecificationOptionPages(res.data.resultObj.specId);
                            });
                        });
                    }
                });
            },
            optionSelsChange: function (optionSels) {
                this.optionSels = optionSels;
            },
            //批量删除
            optionBatchRemove: function () {
                //var ids = this.optionSels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
                var ids = this.optionSels.map(item => item.id).join(",");
                console.log(ids);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.optionListLoading = true;
                    //NProgress.start();
                    let para = ids;
                    batchRemoveSpecificationOption(para).then((res) => {
                        this.optionListLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSpecificationOptionPages();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getSpecificationPages();
            this.getSpecificationOptionPages();
        }
    }

</script>

<style>

</style>





