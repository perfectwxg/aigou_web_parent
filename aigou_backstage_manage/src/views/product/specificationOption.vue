<el-col :span="12">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="optionFilters">
            <el-form-item>
                <el-input v-model="optionFilters.keyword" placeholder="关键字" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="getSpecificationOptionPages">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAddOption">新增</el-button>
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
        <el-table-column prop="specName" label="规格名称"  sortable>
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
                <el-input v-model="editOptionForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="英文名">
                <el-input v-model="editOptionForm.englishName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="品牌描述">
                <el-input v-model="editOptionForm.description" auto-complete="off"></el-input>
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
            <el-form-item label="品牌名称" prop="name">
                <el-input v-model="addOptionForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="英文名">
                <el-input v-model="addOptionForm.englishName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="品牌描述">
                <el-input v-model="addOptionForm.description" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addOptionFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addOptionSubmit" :loading="addOptionLoading">提交</el-button>
        </div>
    </el-dialog>
</el-col>

<script>
    import {getSpecificationOptionPage, removeSpecificationOption, optionBatchRemoveSpecificationOption, editSpecificationOption, addSpecificationOption} from '../../api/api';

    export default {
        data: function () {
            return {
                optionFilters: {
                    keyword: ''
                },
                specificationOptions: [],
                optionTotal: 0,
                optonPage: 1,
                optionListLoading: false,
                optionSels: [],//列表选中列

                editOptionFormVisible: false,//编辑界面是否显示
                editOptionLoading: false,
                editOptionFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editOptionForm: {
                },
                addOptionFormVisible: false,//新增界面是否显示
                addOptionLoading: false,
                addOptionFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addOptionForm: {
                }

            }
        },
        methods: {
            handleOptionRemove(file, fileList) {
                console.log(file);
                let filePath = this.editOptionForm.logo;
                this.$http.delete("/common/del?filePath=" + filePath)
                    .then(res => {
                        if (res.data.success) {
                            this.$message({
                                message: '移除成功!',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '移除失败!',
                                type: 'error'
                            });
                        }
                    })
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
                this.optionListLoading = true;
                getSpecificationOptionPage(para).then(({data}) => {
                    console.log(data);
                    this.optionTotal = data.optionTotal;
                    this.specificationOptions = data.lists;
                    this.optionListLoading = false;
                    //NProgress.done();
                });
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
                this.fileList2=[];
                this.editOptionFormVisible = true;
                //回显示logo
                this.fileList2.push(
                    {
                        "url": "http://47.106.74.129/" + JSON.parse(row.logo)[0].url,
                        "name":JSON.parse(row.logo)[0].name
                    });
                //获取原类型字符串回显
                let type_str = row.productType.path;
                let type_arr = type_str.split('.');
                //解析为双向绑定数据
                for (let i = 1; i < type_arr.length - 1; i++) {
                    this.selectType[i - 1] = parseInt(type_arr[i]);
                }
                this.editOptionForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAddOption: function () {
                this.addOptionFormVisible = true;

            },
            //编辑
            editOptionSubmit: function () {
                this.$refs.editOptionForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editOptionLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editOptionForm);
                            console.log(para);
                            para.updateTime = new Date();
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
                            para.createTime = new Date();
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
                    optionBatchRemoveSpecificationOption(para).then((res) => {
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
            this.getSpecificationOptionPages();
        }
    }

</script>