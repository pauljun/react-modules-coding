import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000224',
    title: '小区管理',
    parentId: '100001010007',
    name:'CenterVillageView',
    icon: 'icon-Community_Dark',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/CenterVillage/CenterVillageView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/CenterVillage/view/list.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/CenterVillage/view/list.js')
            )
          )
  },
  {
    id: '100001000223',
    title: '编辑小区',
    parentId: '100001010007',
    name: 'CenterVillageEdit',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/CenterVillage/CenterVillageEdit',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/CenterVillage/view/edit.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/CenterVillage/view/edit.js')
            )
          )
  }
];
