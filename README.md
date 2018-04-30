---
style: ocean
---
402_使用jQuery仿制网易云音乐移动端
===
2018年4月20日15:18:13
这是一个项目笔记，用于记录制作这个项目的点点滴滴。

***

## 明确需求
![原型图](http://imagizer.imageshack.us/a/img922/9923/oNCOFn.png)
左一开始：主页（推荐音乐）、热歌榜、搜索、歌单和播放界面。

## 制作历程
### 自定义一个工作流 
我选择了browser-sync，因为这个项目比较轻量（不需要引入很多的模块），所以就直接用一个browoser-sync配合开发实时刷新就行了。项目完成以后再用打包工具build一个dist就好了~~

### 旋转的光盘
到底是怎么实现光盘旋转？CSS动画，利用keyframes：
```css
@keyframes circle {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.disc {
	animation:circle 20s infinite linear;
	/*选择动画，circle；时间；无限循环；线性变化*/
}
```
1. 父容器`page`，上半层为点唱机`disc-container`容器，下半层为歌曲信息`song-description`。（把各个img素材添加进去。）
2. 底部为两个按钮连接，用一个div包裹`links`容器。（mock数据）
3. 给`page`一个满屏的高度，100vh。三个部分由上到下列式排布，用flax吧。然后根据判断就给各个img设置宽高。

### 歌词
1. 先拿到歌词请求。利用开发者工具里面的network > filter > XHR拿到请求。复制一份，用来mock一份歌词。保存为json文件。
2. 引入jQuery，发送一个ajax请求刚刚保存的lyric.json并把响应打出来（promise）
3. 对lyr进行处理。（lyr指的是响应里面的key为lyric的值。lyr = object.lyric）
这是一个字符串，我们通过以回车为分隔符（‘\n’）组成一个新的数组打出来。
效果如下：
![效果图](https://ws4.sinaimg.cn/large/006tKfTcgy1fqmwv4gba4j30h80d5n7e.jpg)
4. 用到正则，匹配中括号里面的时间和后面的歌词内容。然后利用正则的api捕获内容返回给array。注意，这里用到map，是对array里面的每一项string进行match。
5. 把array的内容生成html的P标签插入document中，属性是时间。
6. 高度为显示三行歌词的高度。设置好字体大小，居中。
7. 设置好active样式，给歌词lyric设定一个固定高度，给歌词片段p设置行高。
8. 歌词播放的时候调整lines（就是存放歌词的div）的transform的样式。
### 播放
1. 拿到歌曲的src
2. 把audio的各种api熟悉一下（播放、暂停、获取当前时间、audio的事件）
3. 当歌曲播放的时候，上方转盘跟着旋转。
4. 添加播放按钮（这里我使用了图片）。
### 暂停
1. 点击唱片，`audio.pause()`，同时移除表示playing的状态class。
### 首页
首页的制作相对简单些。
1. logo从官方的网页剪下来，是一个svg（透明的，加个背景色就能看见了。）
2. 完成其CSS样式（这个就比较费时间和功夫了）
3. 获取几首歌作为样本。可以选择放在七牛用来mock ajax请求。
4. mock一个song.json，然后把html上写死了的节点删除。根据返回的json拼接成html并插入到dom上。
5. 首页载入以后，在相应数据到来之前，应该显示一个loading的动画表示正在加载数据；当数据到来以后渲染页面元素，并移除loading动画，目的就是为了提升用户体验。（可以用gif，也可以旋转一个svg图标。）
6. 发送ajax请求，根据响应对跳转链接的地址进行拼接，同时对歌曲信息进行拼接。（ES6模板字符串）
![代码截图](https://ws2.sinaimg.cn/large/006tNc79gy1fqp9g2dl1ej30gx0bm404.jpg)
7. 拼接完毕以后就渲染到html上，并把载入动画移除。
![效果图](https://ws1.sinaimg.cn/large/006tNc79gy1fqp9kgjenrg309y0gox6r.gif)
8. 点击以后，就会跳转到`./song.html`，同时附带上歌曲的id。在`song.js`上，根据`location.search`获得歌曲的id。（需要用正则匹配）
```js
location.search.match(/\bid=([^&]*)/)[1]
```
### 热歌榜
其实热歌榜的难度不大，里面的歌曲载入可以服用前面首页的loadmusic，所以就略过吧。

### 搜索
1. 需要对api进行修改，把搜索建议的目标地址改一下，改为suggest/keyword  如果响应里面的`code===200`，说明成功了。
![效果](https://ws2.sinaimg.cn/large/006tKfTcgy1fqs4ewmiy5g306s0bn4qw.gif)
2. 搜索提示可点击、热搜tag可点击。

### 歌词滚动
1. 首先要获取当前歌曲的进度时间：`audio.currentTime`得到的是当前播放进度的秒数（注意，需要设置定时每隔500毫秒获取一次）
2. 转换为正常的时间显示`01:25`，实质是把分钟数和秒数拼接一起，需要解决的就是数字的取整，判断是否需要加`0`。
```js
setInterval(()=>{
	let  nowScends  =  audio.currentTime;
	let  minutes  =  ~~(nowScends/60)
	let  scends  =  ~~(nowScends%60)
	let  currentTime  = `${padTime(minutes)}:${padTime(scends)}`;
 },300)
function  padTime(number)  {
      return  number>10?number+'':'0'+number
    }
```
3. 实现歌词滚动的代码：
```js
let  $lrcArray  =  $('.lyric .lines>p'); //这里取的是每一段歌词的集合。
let  lrcLength  =  $lrcArray.length;
for(let  i=0;  i<lrcLength;  i++){
	let  $whitchLines  =  $lrcArray.eq(i);	//指应当显示的歌词行
	let  $nextLines  =  $lrcArray.eq(i+1);	//指接下来要显示的歌词行
	
	//当没有下一段歌词的时候，意味歌曲播放到最后，return。
	if($nextLines.length  ===  0){            
		return;
	}else if($whitchLines.attr('data-time')  <  currentTime  &&  $nextLines.attr('data-time')>currentTime){
		//遍历所有歌词，针对其属性`data-time`与当前的`currentTime`进行比较，如果当前时间比`i`的`data-time`大，比`i+1`的小，说明此时歌词应该是在`i`与`i+1`之间，应该显示$whitchLines的内容。
		$whitchLines.addClass('active').siblings().removeClass('active')
		let  gap  =  $whitchLines.offset().top  -  $('.lines').offset().top  ;
		log('gap ='+  gap)
		//因为歌词显示区域的高度是显示五行歌词，那么中间的高度就是总高度的五分之三
		let  middle  =  $('.lyric').height()  /  5  *  2
		$('.lines').css('transform',`translateY(-${gap-middle}px)`)
	}
}
```


## 难点记录与解决历程
	1. `处理歌词data,需要会用正则来对字符串进行分割。`
	解决：可以利用在线正则网站好好设计一遍你的正则表达式。
	2. `对播放动画进行设计，实现播放暂停的时候唱片旋转角度不会归零。`
解决：使用 `animation-play-state: paused `
	3. `mock数据会很繁琐。`
解决：七牛存储
	4. `搜索框提示`和`搜索显示内容的节流`
	5. `歌词滚动`
解决：要想好好歌词显示的逻辑：
	- 确定歌曲时间戳（`audio.currentTime`）
	- 根据时间戳匹配歌词(遍历歌词节点，根据歌词节点的`data-time`属性与时间戳进行比较，当时间戳位于两行歌词的`data-time`之间，高亮上一条歌词)
	- 滚动歌词（`transform:translateY`）
