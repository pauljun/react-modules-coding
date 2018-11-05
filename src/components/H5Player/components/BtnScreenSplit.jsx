import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
const MenuItem = Menu.Item;

// 分屏下拉菜单设置
const screenSplitMap = [
  { 'label': '单屏', 'value': 1, 'icon': 'danfenping' },
  { 'label': '4分屏', 'value': 4, 'icon': 'sifenping' },
  { 'label': '9分屏', 'value': 9, 'icon': 'jiufenping' },
  { 'label': '16分屏', 'value': 16, 'icon': 'shiliufenping' }
]

// 分屏功能按钮
const BtnScreenSplit = ({ screenNum, setScreenNum, maxScreenNum = 9 }) => {
  const randomId = 'btn-'+ new Date()*1;
  const useableScreen = screenSplitMap.filter(v => v.value <= maxScreenNum)
  const currScreenNum = useableScreen.find(v => v.value === screenNum);
  const overlay = (
    <Menu onClick={setScreenNum}>
      {useableScreen.map(v =>
        <MenuItem key={JSON.stringify(v)}>
          <Icon type={v.icon} />
          {v.label} 
        </MenuItem>
      )}
    </Menu>
  );
  return (
    <span id={randomId}>
      <Dropdown 
        overlay={overlay} 
        trigger={['click']}
        getPopupContainer={() => document.getElementById(randomId)}
      >
        <a className='ant-dropdown-link'>
          <Icon type={currScreenNum.icon} />{currScreenNum.label}
        </a>
      </Dropdown>
    </span>
  )
}
export default BtnScreenSplit;