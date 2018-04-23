# NetEasyMusic
## 明确需求
![原型图](http://imagizer.imageshack.us/a/img922/9923/oNCOFn.png)
左一开始：主页（推荐音乐）、热歌榜、搜索、歌单和播放界面。

## 制作历程
### 自定义一个工作流 
我选择了browser-sync，因为这个项目比较轻量（不需要引入很多的模块），所以就直接用一个browoser-sync配合开发实时刷新就行了。项目完成以后再build一个dist就行了~~

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

## 难点记录与解决历程