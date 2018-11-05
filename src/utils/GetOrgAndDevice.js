import CatchPromise from './CatchPromise';
import {toJS} from 'mobx'
export default function GetOrgAndDevice() {
  const { DeviceStore, OrgStore } = window.GlobalStore;
  return Promise.all([
    CatchPromise(DeviceStore.getCameraList({ page: 1, pageSize: 20000 })),
    CatchPromise(OrgStore.getOrgList())
  ]).then(() => {
    const { orgList } = OrgStore;
    let list = toJS(orgList);
    list.forEach(item => {
      item.deviceCount = DeviceStore.queryCameraCountByIncludeOrgId(item.id);
    });
    OrgStore.setOrgList(list);
  });
}
