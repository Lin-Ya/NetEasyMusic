$(function () {
	let id =parseInt(location.search.match(/\bid=([^&]*)/)[1])
	$.get('../newsong.json').then(function (res) {
		let songs = res;
		let song = songs.filter( (s)=> s.id === id )[0]
		playmusic(song)
	})


	//获取歌词
	$.get('../lyric.json').then(function (obj) {
		// console.log(obj)
		let { lyric } = obj.lrc; //等同于let a = obj.a 
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
	// $.get('../url.json').then(function (res) {
	// 	console.log(res)
	// 	if (res.code === 200) {
	// 		let data = res.data[0]
	// 		playmusic(data)
	// 	} else {
	// 		console.log(res.code)
	// 		console.log('error')
	// 	}
	// })
	let audio = document.createElement('audio')
	function playmusic(music_data) {
		let url = music_data.url
		let id = music_data.id
		audio.src = url;
		audio.oncanplay = function () {
			audio.play();
			$('.page').addClass('playing')
		}
		//播放暂停按钮
		$('.disc').on('click', function () {
			console.log('暂停了')
			audio.pause();
			$('.page').removeClass('playing').addClass('paused')
		})
		$('.play-btn').on('click', function () {
			event.stopPropagation();
			console.log('播放了')
			audio.play();
			$('.page').removeClass('paused').addClass('playing')
		})
	}



})