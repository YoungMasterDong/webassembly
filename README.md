
# 了解WebAssembly（wasm）的前世今身
## WebAssembly是什么？
### 定义

```
WebAssembly 或者 wasm 是一个可移植、体积小、加载快并且兼容 Web 的全新格式
```
### 例子
当然，我知道，即使你看了定义也不知道WebAssembly到底是什么东西。废话不多说，我们通过一个简单的例子来看看WebAssembly到底是什么。

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/7/166ed3c3acfb3aad~tplv-t2oaga2asx-watermark.awebp)

上图的左侧是用C++实现的求递归的函数。中间是十六进制的Binary Code。右侧是指令文本。可能有人就问，这跟WebAssembly有个屁的关系？其实，中间的十六进制的Binary Code就是WebAssembly。

大家可以看到，其可写性和可读性差到无法想象。那是因为WebAssembly不是用来给各位用手一行一行撸的代码，WebAssembly是一个编译目标。什么是编译目标？当我们写TypeScript的时候，Webpack最后打包生成的JavaScript文件就是编译目标。可能大家已经猜到了，上图的Binary就是左侧的C++代码经过编译器编译之后的结果

### 简要阐释
既然叫WebAssembly，我们拆开来看一下。Assembly(汇编)是一种低级编程语言，它与体系结构的机器级指令有着非常密切的联系。换句话说，它只需一个进程就可以转换为机器可以理解的代码，即机器代码。此转换过程称为汇编。

WebAssembly可以简称为 Web 的汇编。 它是一种类似于汇编语言的低级语言，具有紧凑的二进制格式，使您能够以类似本机的速度运行Web应用程序。 它还为C，C ++和Rust等语言提供了编译目标，从而使客户端应用程序能够以接近本地的性能在Web上运行。

此外，WebAssembly是被设计成JavaScript的一个完善、补充，而不是一个替代品。WebAssembly将很多编程语言带到了Web中。但是JavaScript因其不可思议的能力，仍然将保留现有的地位。使用 WebAssembly JavaScript API，你可以交替地运行来自任一种语言的代码，来回没有任何问题。这为我们提供了利用 WebAssembly 的强大功能和性能以及 JS 的通用性和适应性的应用程序。这为web应用程序打开了一个全新的世界，它可以运行最初并不打算用于web的代码和功能。


## WebAssembly的由来

### 性能瓶颈
在业务需求越来越复杂的现在，前端的开发逻辑越来越复杂，相应的代码量随之变的越来越多。相应的，整个项目的起步的时间越来越长。在性能不好的电脑上，启动一个前端的项目甚至要花上十多秒。这些其实还好，说明前端越来越受到重视，越来越多的人开始进行前端的开发。
但是除了逻辑复杂、代码量大，还有另一个原因是JavaScript这门语言本身的缺陷，JavaScript没有静态变量类型。这门解释型编程语言的作者Brendan Eich，仓促的创造了这门如今被广泛使用的语言，以至于JavaScript的发展史甚至在某种层面上变成了填坑史。为什么说没有静态类型会降低效率。这会涉及到一些JavaScript引擎的一些知识。
### 静态变量类型所带来的问题
![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/7/166ed498c346cec4~tplv-t2oaga2asx-watermark.awebp)
这是Microsoft Edge浏览器的JavaScript引擎ChakraCore的结构。我们来看一看我们的JavaScript代码在引擎中会经历什么。

JavaScript文件会被下载下来。
然后进入Parser，Parser会把代码转化成AST（抽象语法树）.
然后根据抽象语法树，Bytecode Compiler字节码编译器会生成引擎能够直接阅读、执行的字节码。
字节码进入翻译器，将字节码一行一行的翻译成效率十分高的Machine Code.

在项目运行的过程中，引擎会对执行次数较多的function进行优化，引擎将其代码编译成Machine Code后打包送到顶部的Just-In-Time(JIT) Compiler，下次再执行这个function，就会直接执行编译好的Machine Code。但是由于JavaScript的动态变量，上一秒可能是Array，下一秒就变成了Object。那么上一次引擎所做的优化，就失去了作用，此时又要再一次进行优化。

### asm.js出现
所以为了解决这个问题，WebAssembly的前身，asm.js诞生了。asm.js是一个Javascript的严格子集，合理合法的asm.js代码一定是合理合法的JavaScript代码，但是反之就不成立。同WebAssembly一样，asm.js不是用来给各位用手一行一行撸的代码，asm.js是一个编译目标。它的可读性、可读性虽然比WebAssembly好，但是对于开发者来说，仍然是无法接受的。
asm.js强制静态类型，举个例子。

```
function asmJs() {
    'use asm';
    
    let myInt = 0 | 0;
    let myDouble = +1.1;
}

```
为什么asm.js会有静态类型呢？因为像0 | 0这样的，代表这是一个Int的数据，而+1.1则代表这是一个Double的数据。
### asm.js不能解决所有的问题
可能有人有疑问，这问题不是解决了吗？那为什么会有WebAssembly？WebAssembly又解决了什么问题？大家可以再看一下上面的ChakraCore的引擎结构。无论asm.js对静态类型的问题做的再好，它始终逃不过要经过Parser，要经过ByteCode Compiler，而这两步是JavaScript代码在引擎执行过程当中消耗时间最多的两步。而WebAssembly不用经过这两步。这就是WebAssembly比asm.js更快的原因。
### WebAssembly横空出世
所以在2015年，我们迎来了WebAssembly。
#### 特点
##### 高效
WebAssembly 有一套完整的语义，实际上 wasm 是体积小且加载快的二进制格式， 其目标就是充分发挥硬件能力以达到原生执行效率
##### 安全
WebAssembly 运行在一个沙箱化的执行环境中，甚至可以在现有的 JavaScript 虚拟机中实现。在web环境中，WebAssembly将会严格遵守同源策略以及浏览器安全策略。
##### 开放
WebAssembly 设计了一个非常规整的文本格式用来、调试、测试、实验、优化、学习、教学或者编写程序。可以以这种文本格式在web页面上查看wasm模块的源码。
##### 标准
WebAssembly 在 web 中被设计成无版本、特性可测试、向后兼容的。WebAssembly 可以被 JavaScript 调用，进入 JavaScript 上下文，也可以像 Web API 一样调用浏览器的功能。当然，WebAssembly 不仅可以运行在浏览器上，也可以运行在非web环境下。


## WebAssembly的优势
### WebAssembly和asm.js性能对比
下面的图是Unity WebGL使用和不使用WebAssembly的起步时间对比的一个BenchMark，给大家当作一个参考。
可以看到，在FireFox中，WebAssembly和asm.js的性能差异达到了2倍，在Chrome中达到了3倍，在Edge中甚至达到了6倍。通过这些对比也可以从侧面看出，目前所有的主流浏览器都已经支持WebAssembly V1（Node  >= 8.0.0）。
![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/8/166f14622827f306~tplv-t2oaga2asx-watermark.awebp)

### 与JavaScript做对比
我通过代码对比了一下WebAssembly版本和原生JavaScript版本的递归无优化的Fibonacci函数的性能。下面我们分别运行一下两个版本的代码。

经过对比会发现：显然是wasm版本的性能更强。

## WebAssembly在大型项目中的应用
在这里能够举的例子还是很多，比如AutoCAD、GoogleEarth、Unity、Unreal、PSPDKit、WebPack等等。拿其中几个来简单说一下。
### AutoCAD
这是一个用于画图的软件，在很长的一段时间是没有Web的版本的，原因有两个，其一，是Web的性能的确不能满足他们的需求。其二，在WebAssembly没有面世之前，AutoCAD是用C++实现的，要将其搬到Web上，就意味着要重写他们所有的代码，这代价十分的巨大。
而在WebAssembly面世之后，AutoCAD得以利用编译器，将其沉淀了30多年的代码直接编译成WebAssembly，同时性能基于之前的普通Web应用得到了很大的提升。正是这些原因，得以让[AutoCAD](https://web.autocad.com/acad/me)将其应用从Desktop搬到Web中。
### Google Earth
[Google Earth](https://earth.google.com/web/)也就是谷歌地球，因为需要展示很多3D的图像，对性能要求十分高，所以采取了一些Native的技术。最初的时候就连Google Chrome浏览器都不支持Web的版本，需要单独下载Google Earth的Destop应用。而在WebAssembly之后呢，谷歌地球推出了Web的版本。而据说下一个可以运行谷歌地球的浏览器是FireFox。
### Unity和Unreal游戏引擎

这里给两个油管的链接自己体验一下，大家注意科学上网。

- Unity WebGL的戳[这里](https://youtu.be/rIyIlATjNcE)
- Unreal引擎的戳[这里](https://www.youtube.com/watch?v=TwuIRcpeUWE)

## 什么时候使用WebAssembly？
说了这么多，我到底什么时候该使用它呢？总结下来，大部分情况分两个点。

- 对性能有很高要求的App/Module/游戏
- 在Web中使用C/C++/Rust/Go的库。举个简单的例子。如果你要实现的Web版本的Ins或者Facebook， 你想要提高效率。那么就可以把其中对图片进行压缩、解压缩、处理的工具，用C++实现，然后再编译回WebAssembly。

## WebAssembly的几个开发工具
- [AssemblyScript](https://github.com/AssemblyScript/assemblyscript)。支持直接将TypeScript编译成WebAssembly。这对于很多前端同学来说，入门的门槛还是很低的。
- [Emscripten](https://github.com/kripken/emscripten)。可以说是WebAssembly的灵魂工具不为过，上面说了很多编译，这个就是那个编译器。将其他的高级语言，编译成WebAssembly。
- [WABT](https://github.com/WebAssembly/wabt)。是个将WebAssembly在字节码和文本格式相互转换的一个工具，方便开发者去理解这个wasm到底是在做什么事。

## WebAssembly的意义
在我的个人理解上，WebAssembly并没有要替代JavaScript，一统天下的意思。我总结下来就两个点。

- 给了Web更好的性能
- 关于WebAssembly的性能问题，之前也花了很大的篇幅讲过了。而更多的可能，随着WebAssembly的技术越来越成熟，势必会有更多的应用，从Desktop被搬到Web上，这会使本来已经十分强大的Web更加丰富和强大。


## WebAssembly实操
要进行这个实际操作，你需要安装上文提到过的编译器[Emscripten](https://github.com/kripken/emscripten)，然后按照[这个](http://webassembly.org.cn/getting-started/developers-guide/)步骤去安装。以下的步骤都默认为你已经安装了Emscripten。
### WebAssembly在Node中的应用
#### 导入Emscripten环境变量
进入到你的emscripten安装目录，执行以下代码。

```
source emsdk/emsdk_env.sh

```
#### 新建C文件
用C实现一个求和文件hello.c，如下。

```
int add(int a, int b) {
	return a + b;
}

```
#### 使用Emscripten编译C文件
在同样的目录下执行如下代码。

```
emcc hello.c -Os -s WASM=1 -s SIDE_MODULE=1 -o hello.wasm

```
==emcc==就是Emscripten编译器，==hello.c==是我们的输入文件，==-Os==表示这次编译需要优化，==-s WASM=1==表示输出wasm的文件，因为默认的是输出asm.js，==-s SIDE_MODULE=1==表示就只要这一个模块，不要给我其他乱七八糟的代码，==-o hello.wasm==是我们的输出文件。
编译成功之后，当前目录下就会生成hello.wasm。
#### 编写在Node中调用的代码

新建一个js文件hello.js。代码如下。

```
const fs = require('fs');
let src = new Uint8Array(fs.readFileSync('./hello.wasm'));
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
	console.log(result.instance.exports.add(22, 66));
})
.catch(e => console.log(e));

```
##### 相关API

- Memory：可调整大小的 ArrayBuffer ，包含由 WebAssembly 的低级内存访问指令读取和写入的线性字节数组。
- Table：可调整大小的类型化引用数组（例如，函数）。
- 实例：一个模块，其与运行时使用的所有状态配对，包括Memory，Table和一组导入的值（importObject）。
#### 执行hello.js

```
node hello.js

```
然后就可以看到输出的结果88了。
## 总结

- WebAssembly提供了一种以近乎本机的速度在网络上运行，与 javaScript 赋予了Web极大的性能提升
- 可以使用再视频编辑，图像编辑，3D游戏，VR等需要极大性能提升的场景
- WebAssembly并非使用纯手工编写，而是旨在成为C，C ++，Rust等源语言的有效编译目标
- 通过wasm实例/memory/table交换信息，达到运行wasm中的相关代码并得到结果的目的。






