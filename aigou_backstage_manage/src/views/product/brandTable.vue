<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getBrandPages">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="brands" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  :row-class-name="tableRowClassName"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="120" sortable>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="120" sortable>
            </el-table-column>
            <el-table-column prop="name" label="品牌名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="englishName" label="英文名" width="120">
            </el-table-column>
            <el-table-column prop="productType.name" label="品牌类型" min-width="180">
            </el-table-column>
            <el-table-column prop="description" label="品牌类型" min-width="180">
            </el-table-column>
            <el-table-column prop="logo" label="LOGO" min-width="180">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
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
        <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="品牌名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input v-model="editForm.englishName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌类型" v-model="editForm.productTypeId">
                    <el-cascader
                            placeholder="请选择类型"
                            filterable
                            change-on-select
                            clearable
                            :options="productTypes"
                            @change="setProductTypeID2"
                            v-model="selectType"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="品牌LOGO" v-model="editForm.logo">
                    <el-upload
                            class="upload-demo"
                            action="http://localhost:9988/services/common/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleLogoSave2"
                            :file-list="fileList2"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="品牌描述">
                    <el-input v-model="editForm.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="品牌名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input v-model="addForm.englishName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌类型" v-model="addForm.productTypeId">
                    <el-cascader
                            placeholder="请选择品牌类型"
                            filterable
                            change-on-select
                            clearable
                            :options="productTypes"
                            v-model="selectType"
                            @change="setProductTypeID"
                            style="width: 75%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="品牌LOGO" v-model="addForm.logo">
                    <el-upload
                            class="upload-demo"
                            action="http://localhost:9988/services/common/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleLogoSave"
                            :file-list="fileList2"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="品牌描述">
                    <el-input v-model="addForm.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getBrandPage, removeBrand, batchRemoveBrand, editBrand, addBrand, getProductTypes} from '../../api/api';

    export default {
        data: function () {
            return {
                dialogImageUrl: '',
                fileList2: [],
                dialogVisible: false,
                isMultiple: true,
                imgLimit: 1,
                imageUrl: '',
                filters: {
                    keyword: ''
                },
                selectType: [],
                productTypes: [],
                brands: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    englishName: '',
                    createTime: '',
                    firstLetter: '',
                    description: '',
                    productTypeId: '',
                    productType: {},
                    logo: ''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    englishName: '',
                    createTime: '',
                    firstLetter: '',
                    description: '',
                    productTypeId: '',
                    logo: '',
                }

            }
        },
        methods: {
            handleLogoSave: function (response, file, fileList) {
                let temp=[];
                temp.push(
                    {
                        "name":file.name,
                        "url":response.resultObj
                    }
                )
                this.addForm.logo = JSON.stringify(temp);
            },
            handleLogoSave2: function (response, file, fileList) {
                let temp=[];
                temp.push(
                    {
                        "name":file.name,
                        "url":response.resultObj
                    }
                )
                this.editForm.log(response)
            },
            handleRemove(file, fileList) {
                console.log(file);
                let filePath = this.editForm.logo;
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
            handlePreview(file) {
                console.log(file);
            },
            setBrandType: function () {
                let t = document.getElementById("#brandType");
                console.log(t);
            },
            setProductTypeID: function (value) {
                this.addForm.productTypeId = value[value.length - 1];
            },
            setProductTypeID2: function (value) {
                this.editForm.productTypeId = value[value.length - 1]
            },

            beforeAvatarUpload(file) {//文件上传之前调用做一些拦截限制
                console.log(file);
                const isJPG = true;
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                //   this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleAvatarSuccess(res, file) {//图片上传成功
                console.log(res);
                console.log(file);
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleExceed(files, fileList) {//图片上传超过数量限制
                this.$message.error('上传图片不能超过6张!');
                console.log(file, fileList);
            },
            imgUploadError(err, file, fileList) {//图片上传失败调用
                console.log(err)
                this.$message.error('上传图片失败!');
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getBrandPages();
            },
            //获取品牌列表
            getBrandPages() {
                let para = {
                    pageNum: this.page,
                    // pageNum: 1,
                    pageSize: 13,
                    keyword: this.filters.keyword
                };
                this.listLoading = true;
                //NProgress.start();
                console.debug(para);
                getBrandPage(para).then(({data}) => {
                    this.total = data.total;
                    this.brands = data.lists;
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
                    removeBrand(para).then(({res}) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBrandPages();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.fileList2=[];
                this.editFormVisible = true;
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
                this.editForm = Object.assign({}, row);
            },
            //获取品牌类型
            getProductTypes: function () {
                getProductTypes().then(({data}) => {
                    this.productTypes = productTypeTree(data);
                }).catch(res => {
                    console.log('出错了');
                });
            },
            //显示新增界面
            handleAdd: function () {
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
                            editBrand(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getBrandPages();
                            });
                        });
                    }
                });
            },
            //品牌类型选择结构处理
            productTypeTree: function (arr) {
                //console.log(arr.length);
                if (!arr || !arr.length) return;
                return arr.map(item =>
                    //console.log(item.id);
                    ({
                        id: item.id,
                        name: item.name,
                        children: this.typeTree(item.children)
                    })
                )
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            para.createTime = new Date();
                            addBrand(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getBrandPages();
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
                    batchRemoveBrand(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBrandPages();
                    });
                }).catch(() => {

                });
            },
            getParentProductType: function () {
                this.$http.get('/product/productType/getParentProductType').then(res => {
                    this.options = res.data;
                })
            },
            // 筛选变色
            tableRowClassName({row, rowIndex}) {
                if (row.name.search(this.filters.keyword) > 0) {
                    return 'warning-row';
                } else if (row.englishName.search(this.filters.keyword) > 0) {
                    return 'warning-row';
                }
                return '';
            }
        },
        mounted() {
            this.getBrandPages();
            this.getProductTypes();
        }
    }

    var productTypeTree = (arr) => {
        //console.log(arr.length);
        if (!arr || !arr.length) return;
        return arr.map(item =>
            //console.log(item.id);
            ({
                value: item.id,
                label: item.name,
                children: productTypeTree(item.children)
            })
        )
    }

</script>

<style scoped>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>







