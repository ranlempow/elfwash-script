define(['js/system'], 
function (system) {
  system.requirePackage([
    'js/lua-setup',
  ]);
  system.setLuaMain('main');
});


// 確定co.add的功能 -> {merge: true}
// 重載js, lua, data, model 使用'.'做為lua判斷資料夾的方式
// hidden-bar 移到js
// hidden-bar icon
// hidden-bar menu-no-click
// (group名稱)group.label
// 收集lua範例

// TODO: lua binding
// TODO: modulize loading
// TODO: 撰寫API
// TODO: hidden-bar .set()
// TODO: hidden-bar package="" then remove
// TODO: hidden-bar group=divder+header, add_to_group
// TODO: hidden-bar bar-icon
// TODO: 中文化: 錯誤訊息, 型別名稱
// TODO: cmds快速鍵
// TODO: hidden-bar lazy
// TODO: 解說用UI
// TODO: hidden-bar 好用功能: list, chackbox