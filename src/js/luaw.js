define(['luajs'], function (Lua) {

  var _array_metatable = Lua.lua_newtable(false, '__newindex', function(table, key, value) {
    if (!Number.isInteger(key)) {
      throw new Error("array index needs integer");
    }
    if ( key < (table.arraymode ? 0: 0)) {
      throw new Error("array index needs great then zero");
    }
    Lua.lua_rawset(table, key, value);
    //table.uints[key] = value;
  });

  Lua.lua_wrap = function(object) {
    if (object === undefined || object === null) {
      return object;
    }
    if (object.str && object.uints) {
      return object;
    }
    if (typeof object == 'object') {
      var luatable = Lua.lua_newtable();
      if (Array.isArray(object)) {
        luatable.metatable = _array_metatable;
        for (var key in object) {
          Lua.lua_tableset(luatable, parseInt(key) + 1, lua_wrap(object[key]));
        }
      } else {
        for (var key in object) {
          Lua.lua_tableset(luatable, key, lua_wrap(object[key]));
        }
      }
      return luatable;
    }
    if (typeof object == 'function' && !object._wrapped_origin) {
      function wrapper() {
        var ret = object.apply(this, arguments);
        return [lua_wrap(ret)];
      }
      wrapper._wrapped_origin = object;
      return wrapper
    }
    return object;
  }

  Lua.lua_unwrap = function(object) {
    if (object === undefined || object === null) {
      return object;
    }
    if (Array.isArray(object)) {
      return object.map(lua_unwrap);
    }
    if (typeof object == 'object') {
      if (object.metatable && object.metatable ==  _array_metatable) {
        var arr = [];
        for (var key in object.uints) {
          var idx = key - 1;
          arr[idx] = lua_unwrap(object.uints[key]);
        }
        return arr;
      } else {
        if (object.str) {
          var obj = {}
          for (var key in object.str) {
            obj[key] = lua_unwrap(object.str[key]);
          }
          return obj
        }
      }
      return null;
    }
    return object;
  }
  
  Lua.lua_tablesetw = function() {
    var args = Array.prototype.slice.call(arguments);
    args[2] = lua_wrap(args[2]);
    return Lua.lua_tableset.apply(this, args);
  }
  
  Lua.lua_tablegetw = function() {
    return lua_unwrap(Lua.lua_tableget.apply(this, arguments));
  }

  Lua.lua_tablegetcallw = function() {
    return lua_unwrap(Lua.lua_tablegetcall.apply(this, arguments));
  }





  Lua.lua_preload_packages = {};

  Lua.lua_createmodule_no_global = function(name) {
    var t = Lua.lua_newtable();
    Lua.lua_tableset(t, "_NAME", name);
    Lua.lua_tableset(t, "_M", t);
    Lua.lua_tableset(t, "_PACKAGE", name.split(".").slice(0, -1).join("."));
    return t;
  }

  Lua.lua_preload_from_code = function(name, code) {
    var t = Lua.lua_createmodule_no_global(name)
    Lua.lua_preload_packages[name] = {code:code, t:t};
  }

  Lua.lua_load_from_preload = function(name) {
    if (!(name in Lua.lua_preload_packages)) {
      return null;
    }
    var pre = Lua.lua_preload_packages[name]
    var G = Lua.lua_load(pre.code)();
    if (!pre.t.metatable) {
      pre.t.metatable = lua_newtable();
    }
    console.log(pre.t)
    pre.t.metatable.str['__index'] = G;
    return pre.t
  }

  Lua.lua_module = function(name) {
    var t = lua_tableget(lua_packages, name);
    console.log(t)
    if (t == null) {
      t = lua_load_from_preload(name);
    }
    if (t == null) {
      throw new Error("Module " + name + " not found. Module must be loaded before use.");
    }
    return t;
  }

  return Lua;
});