<template>
    <section>
        <el-row :gutter="30">
            <el-col :span="12">
                <button type="button" class="el-button el-button--default el-button--mini"><!----><!----><span>+</span></button>
                <el-table :data="specData" class="tb-edit" style="width: 100%" highlight-current-row
                          @row-click="handleCurrentChange">
                    <el-table-column label="规格名称">
                        <template scope="scope">
                            <el-input size="small" v-model="scope.row.specName" placeholder="请输入内容"
                                      @change="handleEdit(scope.$index, scope.row)"></el-input>
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                            <el-button size="small" @click="handleAddOption(scope.$index, scope.row)">添加属性</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <el-table :data="specData" class="tb-edit" style="width: 100%" highlight-current-row
                          @row-click="handleCurrentChange">
                    <el-table-column label="规格名称" width="180">
                        <template scope="scope">
                            <el-input size="small" v-model="scope.row.specName" placeholder="请输入内容"
                                      @change="handleEdit(scope.$index, scope.row)"></el-input>
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                            <el-button size="small" @click="handleAddOption(scope.$index, scope.row)">添加规格属性</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {
        getSpecificationPage,
        removeSpecification,
        batchRemoveSpecification,
        editSpecification,
        addSpecification
    } from '../../api/api';
    import {
        getSpecificationOptionPage,
        removeSpecificationOption,
        batchRemoveSpecificationOption,
        editSpecificationOption,
        addSpecificationOption,
        getSpecificationOptions
    } from '../../api/api';

    export default {
        data: function () {
            return {
                specData: [],
                filters: {
                    keyword: ''
                },
                total: 0,
                page: 1,
            }
        },
        methods: {
            handleCurrentChange(row, event, column) {
                console.log(row, event, column, event.currentTarget)
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
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
                    this.specData = data.lists;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            handleAddOption(index,row){
                console.log(index);
                console.log(row);
            }
        },
        mounted() {
            this.getSpecificationPages();
            this.getSpecificationOptionPages();
        }
    }

</script>

<style>
    * {
        margin: 0;
        padding: 0
    }
    body {
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        overflow: auto;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
    }
    .tb-edit .el-input {
        display: block;
    }
    .tb-edit .current-row .el-input {
        display: block
    }
    .tb-edit .current-row .el-input+span {
        display: none;
    }
</style>