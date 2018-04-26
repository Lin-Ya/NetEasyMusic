$(function () {
	function log(s) {
		return console.log(s)
	}
	let songId =parseInt(location.search.match(/\bid=([^&]*)/)[1])
	let audio = document.createElement('audio')
	

	//获取歌曲详情
	$.get('//localhost:4000/song/detail?ids=' + songId).then(function (res) {
		if (res.code != 200) {
			alert('网络异常，无法获取歌曲详情，请检查网络')
		} else {
			let songs = res.songs[0]
			setInfo(songs)
		}
	})

	//发送请求获取歌曲，并播放歌曲
	let getsong = $.get('//localhost:4000/music/url?id=' + songId).then(function (res) {
		if(res.code != 200){
			alert('网络异常，无法获取歌曲，请检查网络')
		}else {
			let song = res.data[0]
			playmusic(song)
		}
	})

	//获取歌词
	$.get('//localhost:4000/lyric?id=' + songId).then(function (obj) {
		setLrc(obj)
	})

	


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
	function setInfo(songs) {
		log(songs)
		let name = songs.name;
		let singer = "";
		if (songs.ar.length > 1) {
			songs.ar.map((s) => {
				singer += (s.name + ' / ')
			})
			let length = singer.length - 2;
			singer = singer.toString().substring(0, length)
		} else {
			singer = songs.ar[0].name;
		}
		$('.song-description>h2').text(name + '-' + singer)
		$('.album-cover').attr('src', songs.al.picUrl)
		$('.background').css('background-image', `url(${songs.al.picUrl})`)
	}
	function setLrc(obj) {
		// console.log(obj)
		let { lyric } = obj.lrc; //等同于let a = obj.a 
		let array = lyric.split('\n'); //根据回车分割行政数组。
		let regex = /^\[(.+)\](.*)$/; //正则，匹配中括号内的时间和中括号后的歌词内容

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
	}
	
})