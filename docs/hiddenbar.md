# HiddenBar

這個套件可以讓你管理介面中上方的工具列選單.


## 建立與選取

在此HiddenBar套件裡, 建立新物件與選擇舊物件的方法是一樣的
```
HiddenBar('a');
HiddenBar('a');
```
執行第1行的```HiddenBar('a')```後, 將會建立id為```'a'```的工具列.
接下來執行到第2行的```HiddenBar('a')```時, 由於```'a'```工具列已存在, 所以不會重複建立第二個.
這兩行的回傳值都是```'a'```工具列, 因此你可以利用javascript中常見的鎖鍊呼叫來建立整條工具列.


建立工具列之後, 可以在其中加入按鈕或選單物件, 同樣的建立或選取之後會回傳該對象.
```
HiddenBar('a').button('b1');
HiddenBar('a').menu('b2');
```

選單物件同樣的可以加入按鈕或是子選單
```
HiddenBar('a').menu('b2').button('c1');
HiddenBar('a').menu('b2').menu('c2');
```

下面這些方法同樣用來建立或選取物件, 他們的意義都一樣只是對象的型別不同.

#### **HiddenBar**(options)
#### HiddenObject.**button**(options)
#### HiddenObject.**menu**(options)
#### HiddenObject.**group**(options)

### **options**
Type: String, Object

上一段所提到的各種建立與選取方法都同樣有options這個參數, 當這個參數為字串時, 其代表的意義是對象的id, 其它的的選項將設為預設值.
當options是個字典時, options中的各項參數會被拿來設定對象物件.
呼叫之後, 如果options.id已經存在於父物件中, 則返回在父物件中找到的對象, 並且利用options的各項選項將該對象重新設定.
反之, 如果options.id不存在於父物件中, 則利用options的各項選項來建立新的物件, 並且返回新建立的對象.

以下為options中可用的選項以及它們所代表的意義.

### Options.**id**
Type: String
物件的識別代號, 此代號在同一個階層裡面不能重複.
**id**在物件創立時就該指定, 一但建立之後就無法改變.
**id**只能由單純的英文字母與```'-'```所組成.


### Options.**right**
Type: Boolean
Default: false

只對工具列有用的選項, 決定工具列將靠在畫面的左方或是右方.


### Options.**label**
Type: String, jQuery
Default: same as id
物件對外顯示的標籤名稱.

### Options.**value**
Type: String
Default: same as **id**
物件蘊含的隱藏値. 這個值可能可以在其他地方被使用.

### Options.**icon**
Type: String, jQuery
物件對外顯示的圖示.

### Options.**package**
Type: String
物件所屬的套件名稱.
指定套件名稱的好處在於: 卸載整個套件時, 可以一次刪除被卸載套件之前在系統中創立的所有物件.


### Options.**position**
Type: String, Object
Default: "last"
物件所加入的位置, 可選的值有

  - ```"first"```: 在最前方加入
  - ```"last"```: 在最後方加入
  - ```{first: id}```: 加入在特定的群組最前方
  - ```{last: id}```: 加入在特定的群組最後方
  - ```{before: id}```: 加入在特定的物件之前
  - ```{after: id}```: 加入在特定的物件之後

### Options.**click**
Type: Function(event, id, value)
物件被按下後所執行的函數.





## HiddenObject都同樣擁有的方法

### HiddenObject.**remove**()

將此物件移除, 並返回父物件.

### HiddenObject.**parent**()

返回父物件.
但是, 用HiddenBar呼叫這個方法將會返回null.

### HiddenObject.**set**(options)

將options的選項設定到對象身上.
與選取時不同的是, options之中選項缺省的情況下, 用的是對象之前舊有的選項值.

### HiddenObject.**click**(handler)

等同於```HiddenObject.set({click: handler})```


### 更多範例

下面各行程式碼都是錯誤的, 如果可以瞭解他們錯誤的原因, 那將會更加瞭解本套件的用法.

```javascript
HiddenBar('a').button();
HiddenBar('a').button('');
HiddenBar('a').button({id: ''});
HiddenBar('a').button({label: 'b'});
HiddenBar('a').button('b').menu('c');
HiddenBar('a').button('b').button('c');
HiddenBar('a').button('b').group('c');
HiddenBar('a').HiddenBar('b');
```
第1行很單純的是因為沒有指定任何參數.
第2-4行錯誤的原因同樣是因為id不能為空, 而且id必須合法.
第5-7行都是因為按鈕之中無法再加入其他物件, 也就是按鈕物件必須是末端.
第8行是因為工具列必須為在最上層, 工具列沒辦法再包含工具列.


下列程式碼將會建立有三個按鈕的工具列
```javascript
HiddenBar('a').button('b1').click(func1)
     .parent().button('b2').click(func2)
     .parent().button('b3').click(func3);
```

下列的程式碼效果同樣為建立有三個按鈕的工具列, 只是寫法上使用了迴圈.
```javascript
var option_list = ['b1', 'b2', 'b3'];
var bar = HiddenBar('a');
for (var i in option_list) {
  bar.button(option_list[i]);
}
```

下列的程式碼將會被之前建立的三個按鈕找出來並刪除
```javascript
HiddenBar('a').button('b1').remove()
              .button('b2').remove()
              .button('b3').remove();
```



## 命名空間

### HiddenBar.**package**(name)

建立一個專屬的命名空間.

### HiddenBar.**removeAll**()


移除該名稱空間所有的物件.
以下將簡單的展示命名空間的用法

```javascript
HiddenBar = HiddenBar.package('mypkg');
HiddenBar('a1').button('b');
HiddenBar('a2').button('b');
HiddenBar.removeAll();
```
最後一行將會把, 2-3行所建立的兩個工具列全部刪除.

