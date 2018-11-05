//摄像机状态
export const DeviceState = [
  { value: '-1', label: '全部' },
  { value: '1', label: '在线' },
  { value: '0', label: '离线' }
];

export const DeviceLocation = [
  { value: '-1', label: '全部' },
  { value: '0', label: '未设置' },
  { value: '1', label: '已设置' }
];

/* 摄像机类型 */
export const CameraType = [
  { value: '-1', label: '全部' },
  { value: '100604', label: '智能枪机' },
  { value: '100602', label: '球机' },
  { value: '100603', label: '抓拍机' }
];

export const CameraAndSoldierType = [
  { value: '-1', label: '全部' },
  { value: '100604', label: '智能枪机' },
  { value: '100602', label: '球机' },
  { value: '100603', label: '抓拍机' },
  { value: '100605', label: '单兵' },
];

/* 所有设备类型 */
export const DeviceAndMjType = [
  ...CameraType,
  { value: '103501,103502', label: '门禁' }
];

/* 所有设备类型 */
export const DeviceType = [
  ...CameraType,
  { value: '100605', label: '单兵' },
  { value: '103406', label: '门禁' },
  { value: '103407', label: '闸机' }
];
