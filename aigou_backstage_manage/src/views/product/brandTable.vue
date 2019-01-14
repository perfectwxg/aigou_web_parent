<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
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
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
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
                            style="width: 75%">
                    </el-cascader>
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
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
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
                <el-form-item label="品牌描述">
                    <el-input v-model="addForm.description" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<el-upload action="/product/brand/imgUpload"-->
                    <!--list-type="picture-card"-->
                    <!--accept="image/*"-->
                    <!--:limit="imgLimit"-->
                    <!--:file-list="productImgs"-->
                    <!--:multiple="isMultiple"-->
                    <!--:on-preview="handlePictureCardPreview"-->
                    <!--:on-remove="handleRemove"-->
                    <!--:on-success="handleAvatarSuccess"-->
                    <!--:before-upload="beforeAvatarUpload"-->
                    <!--:on-exceed="handleExceed"-->
                    <!--:on-error="imgUploadError">-->
                    <!--<i class="el-icon-plus"></i>-->
                    <!--</el-upload>-->
                    <!--<el-dialog :visible.sync="dialogVisible">-->
                        <!--<img width="100%" :src="dialogImageUrl" alt="">-->
                    <!--</el-dialog>-->

                <!--</el-form-item>-->
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
                dialogVisible: false,
                productImgs: [],
                isMultiple: true,
                imgLimit: 1,
                imageUrl:'',
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
                    productType:{},
                    logo:''
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
                    logo:'',
                }

            }
        },
        methods: {
            setBrandType:function () {
              let t  =document.getElementById("#brandType");
              console.log(t);
            },
            handleRemove(file, fileList) {//移除图片
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {//预览图片时调用
                console.log(file);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            setProductTypeID:function (value) {
              this.addForm.productTypeId=value[value.length-1];
            },
            setProductTypeID2:function (value) {
                this.editForm.productTypeId=value[value.length-1]
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
            imgUploadError(err, file, fileList){//图片上传失败调用
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
                    console.log(this.total);
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
                this.editFormVisible = true;
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

</style>







