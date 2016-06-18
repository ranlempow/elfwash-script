# ModelView (MVC)


## Member

### Member.typeName
此模型所屬型別的名稱.

### Member.typeLable
此模型所屬型別的顯示名稱.

### Member.**importants**
Type: Array
需要加強顯示的重要屬性名稱列表.

### Member.**alias**
Type: Object
各屬性的顯示名稱.

### Member.**getTitle**()

返回顯示標題.
可以回傳普通字串, jQuery物件.

### Member.**getIcon**()
返回顯示圖示.
可以回傳普通字串, jQuery物件.


## GroupView
### GroupView.**name**
### GroupView.**viewLable**
### GroupView.**modelClass**     
### GroupView.**cmds**

### Command.label
### Command.targets
### Command.prompt
### Command.execute


### GroupView.**co**



## Collection

同一個Collection內只能儲存著同一個型別的Model.
Collection的基本功能接近我們所謂的容器.

### Collection.**add**(models)
models: Object, Model, Array
參數models可以是一個包含所有屬性的字典, 或是一個模型物件.
如果models是一個列表, 則列表中每個元素都是上述兩種型別的其中一種.
**add**會將每個物件加入到Collection中, 這會根據model.id來判斷該物件是否已經存在.
如果該模型物件已經存在Collection之中, 則將模型的屬性更新.

### Collection.**set**(models)
models: Object, Model, Array
參數models的型式與**add**相同.
重新設定整個Collection的內容物.
此方法與**add**非常相似, 唯一的差別在於**set**會移除Collection中不存在於參數models的物件.

### Collection.**remove**(models)
models: Object, String, Model, Array
參數models的型式與**add**大致相同, 多了一個字串型別以表達指定的model.id.
從Collection中移除所有符合的物件.


### Collection.**get**(id)
從Collection中取得指定id的model物件.

### Collection.**size**()
返回Collection所含的物件數量.

### Collection.**each**(iteratee)
iteratee: Function(value, index)

### Collection.**where**(attributes)
attributes: Object

### Collection.**filter**(predicate)
predicate: Function(value)
