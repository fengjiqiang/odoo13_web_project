odoo.define('bicon_list_view_button', function (require) {
    "use strict";
//这些是调⽤需要的模块
    var ListView = require('web.ListView');
    var viewRegistry = require('web.view_registry');
    var ListController = require('web.ListController');
//这块代码是继承ListController在原来的基础上进⾏扩展
    var BiConListController = ListController.extend({
        renderButtons: function () {
            console.log('进进⼊⼊按按钮钮渲渲染染⽅⽅法法！！');
            this._super.apply(this, arguments);
            if (this.$buttons) {
//这⾥找到刚才定义的class名为create_by_dept的按钮
                var btn = this.$buttons.find('.create_by_dept');
                var btn_release_by_container = this.$buttons.find('.release_by_container');
//给按钮绑定click事件和⽅法create_data_by_dept
                btn.on('click', this.proxy('create_data_by_dept'));
                btn_release_by_container.on('click', this.proxy('create_release_by_container'));
            }


        },
        create_data_by_dept: function () {
            var self = this;
            console.log('进进⼊⼊了了按按钮钮绑绑定定的的⽅⽅法法⾥⾥⾯⾯！！！！！！');
//这⾥是获取tree视图中选中的数据的记录集
            var records = _.map(self.selectedRecords, function (id) {
                return self.model.localData[id];
            });
console.log("数据id：" + _.pluck(records, 'res_id'));
//获取到数据集中每条数据的对应数据库id集合
            var ids = _.pluck(records, 'res_id');
//通过rpc调⽤路由为/cheshi/hello的controller中的⽅法
// this._rpc({
// route: '/cheshi/hello',
// params: {}
// });
//通过rpc调⽤bs.warehouse模块中的my_function⽅法
            this._rpc({
                model: 'book.rent.return',
                method: 'action_confirm',
                args: [ids],
            }).then(function () {
                 location.reload();
            });
        },
        create_release_by_container: function () {
            var self = this;
            var records =  _.map(self.selectedRecords, function (id) {
                return self.model.localData[id];
            });
            var ids = _.pluck(records, 'res_id');
            this._rpc({
                model:'book.rent.return',
                method:'action_confirm',
                args:[ids],
            }).then(function () {
                location.reload();
            })
        },
    });
//这块代码是继承ListView在原来的基础上进⾏扩展
//这块⼀般只需要在config中添加上⾃⼰的Model,Renderer,Controller
//这⾥我就对原来的Controller进⾏了扩展编写，所以就配置了⼀下BiConListController
    var BiConListView = ListView.extend({
        config: _.extend({}, ListView.prototype.config, {
            Controller: BiConListController,
        }),
    });
//这⾥⽤来注册编写的视图BiConListView，第⼀个字符串是注册名到时候需要根据注册名调⽤视图
    viewRegistry.add('bicon_list_view_button', BiConListView);
    return BiConListView;
});
