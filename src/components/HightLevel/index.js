import React from 'react';
import './index.scss';

export default function HighLevel({
  keyword,
  name,
  highLevelclassName = 'high-level',
  highLevelStyle = {}
}) {
  if (!keyword) {
    return name;
  }
  let newStrArr = [];
  let currentIndex = 0;
  let reg = new RegExp(`${keyword}`, 'ig');
  let result;
  while ((result = reg.exec(name)) !== null) {
    if (result.index === 0) {
      newStrArr.push('<keyword>');
    } else {
      newStrArr.push(name.substr(currentIndex, result.index - currentIndex));
      newStrArr.push('<keyword>');
    }
    currentIndex = result.index + keyword.length;
  }
  if (currentIndex < name.length) {
    newStrArr.push(name.substr(currentIndex));
  }
  return (
    <React.Fragment>
      {newStrArr.map(
        (item,index) =>
          item === '<keyword>' ? (
            <span key={index} style={highLevelStyle} className={highLevelclassName}>{keyword}</span>
          ) : (
            item
          )
      )}
    </React.Fragment>
  );
}
