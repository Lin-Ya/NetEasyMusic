$(function () {
	//获取歌词
	$.get('../lyric.json').then(function (obj) {
		// console.log(obj)
		let {lyric} = obj.lrc; //等同于let a = obj.a 
		let array = lyric.split('\n'); //根据回车分割行政数组。
		let regex = /^\[(.+)\](.*)$/; //正则，匹配中括号内的时间和中括号后的歌词内容

		//如果有翻译歌词，下面就会将翻译歌词和原歌词进行交叉合拼
		// if (obj.tlyric) {
		// 	let tlyric = obj.tlyric.lyric;
		// 	let array2 = tlyric.split('\n');
		// 	console.log(array)
		// 	console.log(array2)
		// }

		//创建歌词数组，每一项都是一段歌词对象，key为time和word
		let lrc_array = array.map(function (string) {
			let matches = string.match(regex);
			//存在null的可能，所以应该加个判断以免报错。
			if (matches) {
				return {
					time: matches[1],
					word: matches[2]
				}
			}
		})
		//根据数组内容生成jQuery对象并插入到指定的节点中。
		lrc_array.map(function (object) {
			if (object) {
				let $p = $('<p>' + object.word + '</p>');
				//同时这些jQuery对象均有data-time的自定义属性，值为对应歌词的时间点。
				$p.attr('data-time', object.time)
				let $lyric = $('.lyric')
				$p.appendTo($lyric.children('.lines'))
			}
		})

	})

	//获取歌曲url
	$.get('../url.json').then(function (res) {
		console.log(res)
		let audio = document.createElement('audio')
		function handle(music_data) {
			let url = music_data.url
			let id = music_data.id
			audio.src = url;
			audio.oncanplay = function () {
				// audio.play();
				$('.page').addClass('playing')
			}
		}
		if(res.code === 200){
			let data = res.data[0]
			handle(data)
		}else {
			console.log(res.code)
			console.log('error')
		}
		$('.disc').on('click', function () {
			console.log(1)
			audio.pause();
			$('.page').removeClass('playing')
		})

		
	})
})