$(function () {
	$.get('../lyric.json').then(function (obj) {
		console.log(obj)
		let { lyric } = obj.lrc;          //等同于let a = obj.a 
		let array = lyric.split('\n');  //根据回车分割行政数组。
		let regex = /^\[(.+)\](.*)$/;   //正则，匹配中括号内的时间和中括号后的歌词内容

		let lrc_array = array.map(function (string) {
			let matches = string.match(regex);
			//存在null的可能，所以应该加个判断以免报错。
			if (matches) {
				return { time: matches[1], word: matches[2] }
			}
		})
		
		//根据数组内容生成jQuery对象并插入到指定的节点中。
		lrc_array.map(function (object) {
			if (object) {
				let $p = $('<p>' + object.word + '</p>');
				//同时这些jQuery对象均有data-time的自定义属性，值为对应歌词的时间点。
				$p.attr('data-time',object.time)
				let $lyric = $('.lyric')
				$p.appendTo($lyric)
			}
		})

	})
})