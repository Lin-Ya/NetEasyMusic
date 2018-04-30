$(function () {
	let songId = parseInt(location.search.match(/\bid=([^&]*)/)[1])
	let audio = document.createElement('audio')
	audio.loop = true;

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
		if (res.code != 200) {
			alert('网络异常，无法获取歌曲，请检查网络')
		} else {
			let song = res.data[0]
			playmusic(song)
		}
	})

	//获取歌词
	$.get('//localhost:4000/lyric?id=' + songId).then(function (res) {
		if (res.code !== 200) {
			alert('无法获取歌词，请检查当前网络环境')
		} else if (res.nolyric) {
			let $p = $('<p>纯音乐，无歌词</p>')
			$p.appendTo($('.lines'))
		} else {
			let {
				lyric
			} = res.lrc; //等同于let a = obj.a		
			setLrc(lyric)
		}
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
		//监听歌词变化
	}

	function setInfo(songs) {
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

	function setLrc(lyric) {
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
		//监听歌词的滚动，实现高亮。每三百毫秒监听一次歌曲进度时间
		setInterval(()=>{
			let nowScends = audio.currentTime;
			let minutes = ~~(nowScends/60)
			let scends = (nowScends%60)
			let currentTime = `${padTime(minutes)}:${padTime(scends)}`;
			let $lrcArray = $('.lyric .lines>p'); 	//这里取的是每一段歌词的集合。
			let lrcLength = $lrcArray.length;
			
			for(let i=0; i<lrcLength; i++){
				let $whitchLines = $lrcArray.eq(i);
				let $nextLines = $lrcArray.eq(i+1);
				//当没有下一段歌词的时候，意味歌曲播放到最后，return。
				if($nextLines.length === 0){			
					return;
				}else if($whitchLines.attr('data-time') < currentTime && $nextLines.attr('data-time')>currentTime){
					$whitchLines.addClass('active').siblings().removeClass('active')
					let gap = $whitchLines.offset().top - $('.lines').offset().top ;
					//因为歌词显示区域的高度是显示五行歌词，那么中间的高度就是总高度的五分之三
					let middle = $('.lyric').height() / 5 * 2
					$('.lines').css('transform',`translateY(-${gap-middle}px)`)
				}
			}
		},300)
		
	}

	function padTime(number) {
		return number>10?number+'':'0'+number
	}

})