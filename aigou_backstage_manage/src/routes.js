import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import BrandTable from './views/product/brandTable.vue'
import ProductType from './views/product/productType.vue'
import Product from './views/product/product.vue'
import specification from './views/product/specification.vue'
import typeTemplate from './views/product/specification2.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        leaf: true,//只有一个节点
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    //{ path: '/main', component: Main },npm
    {
        path: '/',
        component: Home,
        name: '商品模块',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/brand', component: BrandTable, name: '品牌管理'},
            { path: '/p_type', component: ProductType, name: '类型管理' },
            { path: '/product', component: Product, name: '商品管理' },
            { path: '/specification', component: specification, name: '商品类型属性管理' },
            { path: '/typeTemplate', component: typeTemplate, name: '模板管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '平台管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;