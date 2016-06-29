define ['js/system', 'js/logging'], (system, logging) ->
  system.requirePackage(['js/setup-momo'])
  system.setLuaMain('main')
  logging 'info', "run-momo", "this is run-momo.cofffee"

