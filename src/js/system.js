define(['power-assert', 'js/luaw', 'js/logging'], 
function (assert, Lua, logging) {
	var system = {
		LuaVM: null,
		lua_main: 'main',
		lua_module_paths: [],
		package_paths: [],
		loaded_packags: {},
	}
	system.requireLuaModule = function(module_paths) {
		system.lua_module_paths = system.lua_module_paths.concat(module_paths);
	}
	// TODO: resolve dependency?
	system.requirePackage = function(package_paths) {
		system.package_paths = system.package_paths.concat(package_paths);
	}
	system.setLuaMain = function(module_name) {
		system.lua_main = module_name;
	}
	system.reload = system.init = function(initfunc) {

		for (var i in system.loaded_packags) {
  		if (system.loaded_packags[i].finalize) system.loaded_packags[i].finalize();
  	}

		for(var i in system.package_paths) {
			require.undef(system.package_paths[i]);
		}
    require(system.package_paths, function() {
    	system.lua_module_paths = [];
    	system.loaded_packags = {};
    	var packages = arguments;
    	for (var i in packages) {
    		if (packages[i].setup) packages[i].setup();
    		system.loaded_packags[system.package_paths[i]] = packages[i];
    	}
    	// TODO: 同一個module不同implement的問題

    	require(['lua/lua_modules'], function(modules) {
    		// TODO: ...
    		var extra_pkg = [];
	      for (var name in modules) {
	      	extra_pkg.push(modules[name][0].path)
      	}

	    	console.log(system.lua_module_paths)
	    	Lua.load(extra_pkg.concat(system.lua_module_paths), function() {
	    		if (system.lua_main) {
		    		system.LuaVM = Lua.lua_module(system.lua_main);
		  		}
		  		console.log('--------------')
		  		console.log(system.lua_main)
		  		if (initfunc) {
		  			for (var i in system.loaded_packags) {
		  				if (system.loaded_packags[i].init) system.loaded_packags[i].init();
		  			}
		  			initfunc();
		  		}
  			});

    	});
    });
	}
	return system;
});
