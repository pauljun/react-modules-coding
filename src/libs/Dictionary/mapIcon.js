import znqj from 'src/assets/img/mapicon/znqj.svg';
import qj from 'src/assets/img/mapicon/qj.svg';
import zpj from 'src/assets/img/mapicon/zpj.svg';
import mj from 'src/assets/img/mapicon/mj.svg';
import zj from 'src/assets/img/mapicon/zj.svg';
import db from 'src/assets/img/mapicon/db.svg';

/**根据设备类型和状态获取设备展示图标 */
export const getCameraTypeIcon = (type, status) => {
  const onLine = status * 1 === 1;
  let option = {};
  switch (+type) {
    case 100602:
      option.url = qj;
      option.color = !onLine ? '#ccc' : 'rgba(43, 153, 255, 1)';
      option.bgColor = !onLine ? '#ccc' : '#17bc84';
      break;
    case 100603:
      option.url = zpj;
      option.color = !onLine ? '#ccc' : 'rgba(193, 100, 207, 1)';
      option.bgColor = !onLine ? '#ccc' : '#17bc84';
      break;
    case 100605:
      option.url = db;
      option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
      option.bgColor = !onLine ? '#ccc' : '#17bc84';
      break;
    case 103406:
      option.url = mj;
      option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
      option.bgColor = !onLine ? '#ccc' : '#17bc84';
      break;
    case 103407:
      option.url = zj;
      option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
      option.bgColor = !onLine ? '#ccc' : '#17bc84';
      break;
    default:
      option.url = znqj;
      option.color = !onLine ? '#ccc' : 'rgba(255, 156, 84, 1)';
      option.bgColor = !onLine ? '#ccc' : '#17bc84';
      break;
  }
  return option;
};
