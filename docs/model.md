## Changelog



### UserProfile 使用者資料

```
/**
 * 使用者的一般資料
 * @constructor
 * @member {int} playingMinite - 玩家總共遊玩的分鐘數.
 * @member {int} money - 玩家擁有的代幣.
 * @member {int} coin - 玩家擁有的商城幣.
 */
```


### ElfTable 妖精資料庫

```
/**
 * 
 * 此物件在執行期是唯讀的, 僅供查詢.
 * @constructor
 * @member {dict} table - 妖精表.
 *   @member {string} id - 妖精代號.
 *   @member {string} name - 妖精中文名稱, 此屬性不再lua中出現, 因為lua不支援utf-8.
 */
```


### FurnishTable 擺設資料庫
```
/**
 * 
 * 此物件在執行期是唯讀的, 僅供查詢.
 * @constructor
 * @member {dict} table - 擺設表.
 *   @member {string} id - 擺設代號.
 *   @member {string} name - 擺設中文名稱, 此屬性不再lua中出現, 因為lua不支援utf-8.
 */
```

 
### EventRecords 事件記錄表

```
/**
 * Debug用途的事件表
 * @constructor
 * @member {list} records - 紀錄表.
 *   @member {string} event - 英文事件名稱.
 *   @member {string} message - 中文事件說明, 此屬性不再lua中出現, 因為lua不支援utf-8.
 *   @member {int} time - 發生時間.
 *   @member {string} status - 'success', 'fail' 簡單描述事件是否成功.
 *   @member {dict} result - 處理的結果.
 */
```


### ElfCollection 妖精收集簿

```
/**
 * 玩家的妖精收藏簿, 玩家與妖精的互動都紀錄在這裡.
 * @constructor
 * @member {list} table - 妖精表.
 *   @member {string} id - 妖精代號.
 *   @member {int} washCount - 事件說明.
 *   @member {float} loyalty - 好感度.
 *   @member {float} moneyReward - 洗出後的代幣獎勵, 運行時可能還會先做一些運算.
 */
```


### ElfDirector 妖精指揮

```
/**
 * 決定何時妖精將進出房間
 * @constructor
 * @member {int} now - readonly, 現在時間, epoch 表示法.
 * @member {int} lastEnter - 上次妖精飛入時間.
 * @function-action {void} decision() - 決策 
 */
```


### HideElfsAtRoom 房內未現身妖精

```
/**
 * 
 * @constructor
 * @member {list} hides - 房內未現身妖精.
 *   @member {int} no - 房內編號.
 *   @member {string} elf - 此妖精的妖精代號.
 *   @member {int} EnterTime - 進入時間, epoch 表示法.
 * @function-action {void} wash(int no) - 洗出妖精.
 * @function-action {void} place(string elf) - 飛入妖精.
 */
```


### ShowUpElfsAtRoom 房內已現身妖精

```
/**
 * 
 * @constructor
 * @member {list} showUps - 房內未現身妖精.
 *   @member {int} no - 房內編號.
 *   @member {string} elf - 此妖精的妖精代號.
 *   @member {int} enterTime - 進入時間, epoch 表示法.
 *   @member {int} showUpTime - 現身時間, epoch 表示法.
 * @function-action {void} remove(int no) - 逐出妖精
 */

```


### FurnishAtRoom 房間佈置

```
/**
 * 
 * @constructor
 * @member {int-list} furnishs - 房間佈置.
 * @function-action {void} remove(int furnish) - 收回擺設
 */
```


### FurnishCollection 擺設倉庫
```
/**
 * 
 * @constructor
 * @member {list} furnishs - 持有的擺設品
 *   @member {int} no - 倉庫內編號
 *   @member {float} durable - 耐久度
 * @function {int-list} getPlaceable() - 取得可放置的擺設
 * @function-action {void} place(int no) - 放置擺設
 */
```

### Shop 商店
```
/**
 * 
 * @constructor
 * @function {string-list} getBuyables() - 取得可購買的物品
 * @function-action {void} buy(string) - 購買物品
 * @function {void} toggleDebugMode() - 可免費購買全部物品
 */
```
