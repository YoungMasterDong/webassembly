const fs = require('fs');
let src = new Uint8Array(fs.readFileSync('./Fibonacci.wasm'));
const env = {
	memoryBase: 0,
	tableBase: 0,
	memory: new WebAssembly.Memory({
		initial: 256
	}),
	table: new WebAssembly.Table({
		initial: 2,
		element: 'anyfunc'
	}),
	abort: () => {throw 'abort';}
}
WebAssembly.instantiate(src, {env: env})
.then(result => {
  console.time('test')
	console.log(result.instance.exports.fib(45));
  console.timeEnd('test')
})
.catch(e => console.log(e));