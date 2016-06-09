define(function() {
var code = "" +
    "\n" +
    "local a=10\n" +
    "local x=20\n" +
    "my_func = function(a)\n" +
    "  return x + a\n" +
    "end\n" +
    "g = my_func\n" +
    "\n" +
    "ElfDirector_decision = function(self)\n" +
    "  print(obj.b)\n" +
    "  local arr = newarray()\n" +
    "  arr[2] = arr2[1]\n" +
    "  return arr\n" +
    "end\n" +
    "\n" +
    "";
  return {code:code};
});