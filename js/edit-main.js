
require(['jquery', 'bootstrap', 'hiddenbar', 'domReady!'], 
  function ($) {

  var data = [
      {id: 1, title: "test"},
      {id: 2, title: "foo bar"}
  ];
  var columns = [
      {name: "id", type: "string"},
      {name: "title", type: "string"}
  ];
  
  var objectTableSchema = {
    abc: [
      {name: "id", type: "string", help: "hahaha"},
      {name: "title", type: "string"}
    ],
  
  }
  var objectTable = {
    abc: [
      {id: 1, title: "test"},
      {id: 2, title: "foo bar"}
    ],
  
  }
  
  // 載入資料檔
  $("#table-list > * > .list-group-item").click(function(el) {
    const tableName = $(this).html();
    // TODO: 載入物件表到編輯器中
    var grid = $(".level1.sen-grid").grid(
          objectTable[tableName],
          objectTableSchema[tableName]
    );
    init_grid(grid);
  })
  
  
  function init_grid(grid) {
    grid.registerEditor(BasicEditor);

    grid.events.on("editor:save", function(data, $cell) {
      console.info("save cell:", data, $cell);
    });
    grid.events.on("editor:load", function(data, $cell) {
      //console.info("set value in editor:", data, $cell);
    });
    grid.events.on("cell:select", function($cell) {
      console.info("active cell:", $cell);
    });
    grid.events.on("cell:clear", function(oldValue, $cell) {
      console.info("clear cell:", oldValue, $cell);
    });
    grid.events.on("cell:deactivate", function($cell) {
      console.info("cell deactivate:", $cell);
    });
    grid.events.on("row:select", function($row) {
      console.info("row select:", $row);
    });
    grid.events.on("row:remove", function(data, row, $row) {
      console.info("row remove:", data, row, $row);
    });
    grid.events.on("row:mark", function($row) {
      console.info("row mark:", $row);
    });
    grid.events.on("row:unmark", function($row) {
      console.info("row unmark:", $row);
    });
    grid.events.on("row:save", function(data, $row, source) {
      console.info("row save:", source, data);
      // save row via ajax or any other way
      // simulate delay caused by ajax and set row as saved
      setTimeout(function() {
        grid.setRowSaved($row);
      }, 1000);
    });
    
    grid.render();
  }
  
  
  $('.dropdown-toggle').dropdown()
});