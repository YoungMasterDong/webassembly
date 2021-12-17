let fib = function(n) {
  if(n <= 2) {
      return 1
  }
  return fib(n-2) + fib(n-1)
}
console.time('test');
console.log(fib(45));
console.timeEnd('test');