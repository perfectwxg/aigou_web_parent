<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProductPages">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleViewProperties">配置显示属性</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSkuProperties">配置SKU属性</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table @row-click="selectRow" :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="创建时间:">
                            <span>{{ props.row.createTime }}</span>
                        </el-form-item>

                        <el-form-item label="更新时间:">
                            <span>{{ props.row.updateTime }}</span>
                        </el-form-item>
                        <el-form-item label="副名称:">
                            <span>{{ props.row.subName }}</span>
                        </el-form-item>
                        <el-form-item label="商品编码:">
                            <span>{{ props.row.code }}</span>
                        </el-form-item>
                        <el-form-item label="商品类型:">
                            <span>{{ props.row.productType.name }}</span>
                        </el-form-item>
                        <el-form-item label="上架时间:">
                            <span>{{ props.row.onSaleTime }}</span>
                        </el-form-item>
                        <el-form-item label="下架时间:">
                            <span>{{ props.row.offSaleTime }}</span>
                        </el-form-item>
                        <!--<el-form-item label="品牌:">-->
                            <!--<span>{{ props.row.brand.name }}</span>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="状态:">-->
                            <!--<span>{{ props.row.state }}</span>-->
                        <!--</el-form-item>-->
                        <el-form-item label="最高价:">
                            <span>{{ props.row.maxPrice }}</span>
                        </el-form-item>
                        <el-form-item label="最低价:">
                            <span>{{ props.row.minPrice }}</span>
                        </el-form-item>
                        <el-form-item label="销量:">
                            <span>{{ props.row.saleCount }}</span>
                        </el-form-item>
                        <el-form-item label="浏览量:">
                            <span>{{ props.row.viewCount }}</span>
                        </el-form-item>
                        <el-form-item label="评论数:">
                            <span>{{ props.row.commontCount }}</span>
                        </el-form-item>
                        <el-form-item label="评分:">
                            <span>{{ props.row.commotScore }}</span>
                        </el-form-item>
                        <el-form-item label="好评数:">
                            <span>{{ props.row.goodCommentCount }}</span>
                        </el-form-item>
                        <el-form-item label="差评数:">
                            <span>{{ props.row.badCommentCount }}</span>
                        </el-form-item>
                        <el-form-item label="">
                            <span></span>
                        </el-form-item>
                        <el-form-item label="摘要:" style="width: 100%;">
                            <span style="width: 100%">{{ props.row.viewProperties }}</span>
                        </el-form-item>
                        <el-form-item label="">
                            <span></span>
                        </el-form-item>
                        <el-form-item label="">
                            <span></span>
                        </el-form-item>
                        <el-form-item label="">
                            <span></span>
                        </el-form-item>
                        <el-form-item label="详情描述" style="width: 100%;">
                            <span style="width: 100%">{{ props.row.productExt.description }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="商品名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="code" label="商品编码">
            </el-table-column>
            <el-table-column prop="productType.name" label="商品类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="state" label="商品状态" :formatter="formatState">
            </el-table-column>
            <el-table-column prop="brand.name" label="品牌" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="onSaleTime" label="上架时间">
            </el-table-column>
            <el-table-column prop="offSaleTime" label="下架时间">
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="warning" @click="handleEdit(scope.$index, scope.row)">上架</el-button>
                    <el-button size="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        <!--设置商品显示属性界面-->
        <el-dialog title="设置商品显示属性" :visible.sync="viewPropertiesFormVisible" :close-on-click-modal="false">
                <el-card class="box-card">
                    <div v-for="property in viewProperties">
                        <el-row :gutter="2">
                            <el-col :span="3">{{property.name}}<div class="grid-content bg-purple"></div></el-col>
                            <el-col :span="20" style="margin-top: 5px"><el-input v-model="property.selectValue" auto-complete="off"></el-input>
                                <div class="grid-content bg-purple"></div></el-col>
                        </el-row>
                    </div>
                </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="viewPropertiesFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="viewPropertiesSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--设置商品显示属性界面-->
        <el-dialog title="设置商品SKU属性" :visible.sync="skuPropertiesFormVisible" :close-on-click-modal="false">
            <el-card class="box-card">
                <div v-for="property in skuProperties">
                        <div v-for="i in property.skuValue.length+1" :key="i">
                    <el-col :span="5"><span style="font-size: 15px">{{property.name}}</span><div class="grid-content bg-purple"></div></el-col>
                            <el-input style="width: 60%;margin-top: 7px" v-model="property.skuValue[i-1]" auto-complete="off"></el-input>
                            <el-button type="danger" @click="property.skuValue.splice(i-1,1)" icon="el-icon-delete" plain>删除</el-button>
                            <div class="grid-content bg-purple"></div>
                        </div>
                </div>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="viewPropertiesFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="viewPropertiesSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑商品" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="副名称">
                    <el-input v-model="editForm.subName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品品牌"  v-model="editForm.brandId">
                    <el-select v-model="selectBrand" filterable placeholder="请选择品牌"  @change="setBrandID2">
                        <el-option
                                v-for="item in brandOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品类型" v-model="editForm.productTypeId">
                    <el-cascader
                            placeholder="请选择商品类型"
                            filterable
                            change-on-select
                            clearable
                            :options="productTypes"
                            v-model="selectType"
                            @change="setProductTypeID2"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="editForm.productExt.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="详情" prop="richContent">
                    <quill-editor
                            v-model="editForm.productExt.richContent"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            @change="onEditorChange($event)">
                    </quill-editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面  -->
        <el-dialog title="新增商品" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="副名称">
                    <el-input v-model="addForm.subName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品品牌"  v-model="addForm.brandId">
                        <el-select v-model="selectBrand" filterable placeholder="请选择品牌"  @change="setBrandID">
                            <el-option
                                    v-for="item in brandOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="商品类型" v-model="addForm.productTypeId">
                    <el-cascader
                            placeholder="请选择商品类型"
                            filterable
                            change-on-select
                            clearable
                            :options="productTypes"
                            v-model="selectType"
                            @change="setProductTypeID"
                            style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="addForm.productExt.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="详情" prop="richContent">
                    <quill-editor
                            v-model="addForm.productExt.richContent"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            @change="onEditorChange($event)">
                    </quill-editor>
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
    import Vue from 'vue';
    import  VueQuillEditor from 'vue-quill-editor';

    Vue.use(VueQuillEditor);
    // require styles 引入样式
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {getProductPage, removeProduct, batchRemoveProduct, editProduct, addProduct, getProductTypes} from '../../api/api';

    export default {
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },
        data: function () {
            return {
                viewPropertiesFormVisible:false,
                skuPropertiesFormVisible:false,
                currentRow:[],
                viewProperties:[],
                skuProperties:[],
                editorOption:{},
                brandOptions:[],
                dialogImageUrl: '',
                dialogVisible: false,
                productImgs: [],
                isMultiple: true,
                imgLimit: 1,
                imageUrl: '',
                selectBrand:'',
                filters: {
                    keyword: ''
                },
                selectType: [],
                productTypes: [],
                products: [],
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
                    subName: '',
                    productTypeId: 0,
                    brandId: 0,
                    productExt:{},
                    productTypeId: '',
                    viewProperties: '',
                },
                //配置显示界面数据
                viewPropertiesForm:{
                    viewProperties:[]
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'}
                    ]
                },
                //新增界面数据 名称  副名称 品牌 类型  描述   详情（ext）
                addForm: {
                    name: '',
                    subName: '',
                    productTypeId: 0,
                    brandId: 0,
                    productExt:{},
                    productTypeId: '',
                    viewProperties: '',
                }

            }
        },
        methods: {
            viewPropertiesSubmit:function () {
                let productId = this.currentRow.id;
                let params = {"productId":productId,"specifications":this.viewProperties};
                //将显示属性保存到product中
                this.$http.post('/product/product/addViewProperties',params)
                    .then(res=>{
                        if (res.data.success){
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.viewPropertiesFormVisible=false;
                        }
                    })
            },
            selectRow:function (row, event, column) {
                this.currentRow = row;
            },
            onEditorBlur(){//失去焦点事件
            },
            onEditorFocus(){//获得焦点事件
            },
            onEditorChange(){//内容改变事件
            },
            formatState: function (row, column) {
                return row.state == 1 ? '已上架' : row.sex == 0 ? '未上架' : '未知';
            },
            handleRemove(file, fileList) {//移除图片
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {//预览图片时调用
                console.log(file);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            setBrandID:function (value) {
                this.addForm.brandId = value;
            },
            setBrandID2:function (value) {
                this.editForm.brandId = value;
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
                this.getProductPages();
            },
            getBrandList(){
                this.$http.get('/product/brand/list').then(res=>{
                    this.brandOptions = res.data;
                })
            },
            //获取商品列表
            getProductPages() {
                let para = {
                    pageNum: this.page,
                    // pageNum: 1,
                    pageSize: 10,
                    keyword: this.filters.keyword
                };
                this.listLoading = true;
                //NProgress.start();
                console.debug(para);
                getProductPage(para).then(({data}) => {
                    this.total = data.total;
                    console.log(this.total);
                    this.products = data.lists;
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
                    removeProduct(para).then(({res}) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProductPages();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.fileList2=[];
                this.editFormVisible = true;
                this.selectBrand = row.brand.name;
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
            handleViewProperties:function () {
                console.log(this.currentRow);
                let rowId = this.currentRow.id;
                //选中行
                if (!rowId){
                    //未选中
                    this.$message({
                        message: '请选择中商品后操作',
                        type: 'warning'
                    });
                    return false;
                }
                //选中,通过id获取显示属性字段 /specification/product/viewProperties/product/{id}
                this.$http.get('/product/specification/product/viewProperties/product/'+rowId)
                    .then(res=>{
                        this.viewProperties = res.data;
                    })

                this.viewPropertiesFormVisible=true;
            },
            handleSkuProperties:function () {
                let rowId = this.currentRow.id;
                //选中行
                if (!rowId){
                    //未选中
                    this.$message({
                        message: '请选择中商品后操作',
                        type: 'warning'
                    });
                    return false;
                }
                //选中,通过id获取显示属性字段 /specification/product/viewProperties/product/{id}
                this.$http.get('/product/specification/product/skuProperties/product/'+rowId)
                    .then(res=>{
                        this.skuProperties = res.data;
                    })

                this.skuPropertiesFormVisible=true;
            },
            //显示新增界面
            handleAdd: function () {
                // this.addForm={};
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
                            para.updateTime=new Date();
                            editProduct(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getProductPages();
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
                            para.createTime=new Date();
                            addProduct(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getProductPages();
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
                    batchRemoveProduct(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProductPages();
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
            this.getProductPages();
            this.getProductTypes();
            this.getBrandList();

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
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item{
        margin-right: 0;
        margin-bottom: 0;
        width: 33%;
    }
</style>







