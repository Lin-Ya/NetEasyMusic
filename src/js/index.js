$(function () {
    function log(s) {
        return console.log(s)
    }
    let suggesting = false;



    //事件的处理将来需要抽离封装为一个组件
    //首页tab切换
    $('.tabs').on('click', 'li', function (e) {
        let $li = $(e.currentTarget);
        let index = $li.index();
        $li.addClass('click').addClass('active').siblings().removeClass('active')
        $('.content').children().eq(index).addClass('active').siblings().removeClass('active')
    })

    //搜索页面的功能
    $('.search input').on('input', function (e) {
        //拼接搜索建议内容
        $('.search .input .close').show();
        $('.search').addClass('show_suggest')
        $('.search .search_content').text('搜索"' + $('.search input').val() + '"')
        log($('.search input').val())
        setTimeout(() => {
            // getSuggest($('.search input').val())
        }, 1500)
        //当input的值为空的时候，清楚提示
        while ($('.search input').val() === "") {
            resetSearch();
            break;
        }
    })

    $('.search .input .close').on('click', function () {
        $('.search input').val('');
        $('.search .input .close').hide();
        resetSearch();
    })

    $('.search .history svg.delete').on('click', function (e) {
        e.stopPropagation()
        $(e.currentTarget).parent().remove()
    });
    $('.search .suggest>p').on('click', function () {
        getSearch($('.search input').val())
    });
    //待补充一个，就是当点击提示列表中的任意一个提示内容的时候，自动补全并搜索
    $('.search .input .sousuo').on('click', function () {
        getSearch($('.search input').val())
    })
    $('.search input').on('keypress', function (e) {
        if (e.keyCode === 13) {
            getSearch($('.search input').val())
        }
    })

    function resetSearch() {
        $('section.search').removeClass('show_suggest').removeClass('show_result');
        $('.search_list').children().remove();
        $('.result_multimatch').children().remove();
    }




    function getSuggest(keyword) {
        //search是一个字符串
        //正常来说应该是下面这种
        // $.get('//localhost:4000/search/suggest?keywords=' + search)
        //开发环境改为get/search_suggest.json
        if (keyword === "") {
            return;
        }
        if (!suggesting) {
            suggesting = true;
            setTimeout(() => {
                $.get('//localhost:4000/search/suggest?keywords=' + keyword).then(function (res) {
                    suggesting = false;
                    if (res.code === 200) {
                        let match = res.result.allMatch;
                        let length = match.length;
                        $('.suggest_list').children().remove();
                        for (let i = 0; i < length; i++) {
                            let content = match[i].keyword;
                            let $li = $(`
                            <li>
                            <svg class="icon sousuo" aria-hidden="true">
                            <use xlink:href="#icon-sousuo"></use>
                            </svg>
                            <p>${content}</p>
                            </li>`);
                            $li.appendTo('.suggest_list');
                        }
                    }
                })
            }, 1200)
        } else {
            log(1)
            return;
        }
    }

    function getSearch(keyword) {
        //这是个获取最佳匹配的函数。
        // $.get('//localhost:4000/search/multimatch?keywords='+keyword)
        if (!keyword) {
            return;
        }
        $.get('../get/search_multimatch.json').then(function (res) {
            //
            if (res.code !== 200) {
                alert('无法连接服务器，请检查当前网络环境')
                return;
            } else if (res.result.orders.length === 0) {
                return; //没有最佳匹配内容。
            }
            let {
                artist,
                mv
            } = res.result;
            let $p = $(`<p>最佳匹配</p>`);
            $p.appendTo('.result_multimatch')
            if (artist) {
                let $artistNode = $(`
                    <div class="match match_artist" data_id="${artist[0].id}" id="error">
                        <img src="${artist[0].img1v1Url || artists[0].picUrl}">
                        <div class="info">
                            <p class="info_sing_name">
                                歌手：${artist[0].name}
                            </p>
                        </div>
                            <svg class="icon arrow" aria-hidden="true">
                                <use xlink: href="#icon-arrow"></use>
                            </svg>
                    </div>
                `);
                $artistNode.appendTo('.result_multimatch')
            }
            if (mv) {
                let $mvNode = $(`
                    <div class="match match_mv" data_id="${mv[0].id}" id="error">
                        <img src="${mv[0].cover}">
                            <div class="info">
                                <p>
                                    ${mv[0].name}
                                </p>
                            <span>${mv[0].artistName}</span>
                        </div>
                        <svg class="icon arrow" aria-hidden="true">
                            <use xlink: href="#icon-arrow"></use>
                        </svg>
                        <svg class="icon playbtn" aria - hidden="true" >
                            <use xlink: href="#icon-play-circled"></use>
                        </svg>
                    </div>`);
                $mvNode.appendTo('.result_multimatch')
            }
        })
        $.get('../get/search_get.json').then(function (res) {
            if (res.code !== 200) {
                alert('无法连接服务器，请检查当前网络环境')
                return;
            }
            let {songs} = res.result;
            for(let i=0,length=songs.length; i<length; i++){
                let id,name,singer,album;
                id=songs[i].id;
                name=songs[i].name;
                album=songs[i].album.name;
                singer = songs[i].artists[0].name;
                let $li = $(`
                    <li>
                        <a href="/song.html?id=${id}" class="goplaysong">
                            <div class="song">
                                <h3 class="songName">${name}</h3>
                                <div class="songInfo">
                                    <svg class="icon SQ" aria-hidden="true">
                                    <use xlink: href="#icon-wusunyinzhi"></use>
                                    </svg>
                                    <span class="songAutor">${singer} - ${album}</span>
                                </div>
                                <svg class="icon playbtn" aria-hidden="true">
                                    <use xlink: href="#icon-play-circled"></use>
                                </svg >
                            </div>
                        </a>
                    </li >
                `);
                $li.appendTo($('.search_list'))
            }
        })
        $('.search').addClass('show_result').removeClass('show_suggest')
        let $searchHistoryNode = $(`
            <li>
                <svg class="icon history" aria-hidden="true">
                    <use xlink:href="#icon-lishijilu"></use>
                </svg>
                <p>${keyword}</p>
                <svg class="icon delete" aria-hidden="true">
                    <use xlink:href="#icon-delete"></use>
                </svg>
            </li>`
        )
        $searchHistoryNode.prependTo($('.history>ol'))
    }





















    // 获取最新音乐
    $.get('../get/newsong.json').then(function (res) {
        if (res.code === 200) {
            loadNewsong(res.result, $('.remd .remd-songlist'));
        } else {
            alert('网络异常，无法获取数据，请调试网络环境')
        }
    })
    //获取推荐歌单
    $.get('../get/personalized.json').then(function (res) {
        if (res.code === 200) {
            loadPersonlized(res.result);
        } else {
            alert('网络异常，无法获取数据，请调试网络环境')
        }
    })

    //获取热歌榜
    $.get('../get/hotsong.json').then(function (res) {
        if (res.code === 200) {
            loadHotsong(res)
        } else {
            alert('网络异常，无法获取数据，请调试网络环境')
        }
    })



    function loadPersonlized(result) {
        let songLists = [];
        for (let i = 0; i < 6; i++) {
            songLists[i] = result[i];
        }
        log(songLists)
        songLists.map((list) => {
            let count = '';
            count = Math.ceil((list.playCount / 10000).toFixed(2));
            let danwei = '';

            if (count.toString().length > 5) {
                count = (count / 10000).toFixed(1);
                danwei = '亿'
            } else {
                danwei = '万'
            }

            let $li = $(`
                <li>
                    <a href="?id="${list.id}">
                        <img src="${list.picUrl}" class="songlistCove">
                            <p class="songlistName">${list.name}</p>
                        <div class="colletCount">${count}${danwei}</div>
                    </a>
                </li>
            `)
            $li.appendTo('.remd-ol');
            $('.remd-ol .loadingGif').remove();
        })
    }

    function loadNewsong(songArray, $target) {
        log('================')
        log(songArray)
        songArray.map(function (obj, index) {
            let number = (index + 1).toString();
            if (number.length === 1) {
                number = '0' + number;
            }
            let song, id, artists, album, singer, name;
            if (obj.song) {
                song = obj.song
                id = song.id
                artists = song.artists
                album = song.album.name
                singer = "";
                name = song.name
            } else {
                id = obj.id;
                artists = obj.ar;
                album = obj.al.name;
                singer = "";
                name = obj.name;
            }
            if (artists.length > 1) {
                artists.map((s) => {
                    singer += (s.name + ' / ')
                })
                let length = singer.length - 2;
                singer = singer.toString().substring(0, length)
            } else {
                singer = artists[0].name;
            }
            let $li = $(`
                <li>
                    <a href="/song.html?id=${id}" class="goplaysong">
                        <div class="index">${number}</div>
						<div class="song">
                            <h3 class="songName">${name}</h3>
                            <div class="songInfo">
                                <svg class="icon SQ" aria-hidden="true">
                                <use xlink: href="#icon-wusunyinzhi"></use>
                                </svg>
                                <span class="songAutor">${singer} - ${album}</span>
                            </div>
                            <svg class="icon playbtn" aria-hidden="true">
                                <use xlink: href="#icon-play-circled"></use>
                            </svg >
                        </div>
                    </a>
                </li >
            `);
            if (Number(number) < 4) {
                $li.find('.index').css('color', '#D83A36')
            }
            $li.appendTo($target);
            $('.loadingGif').remove();
        })
    }

    function loadHotsong(res) {
        let {
            playlist
        } = res;
        log(playlist);
        let list = res.privileges.splice(0, 20)
        let top20 = [];
        for (let i = 0; i < 20; i++) {
            playlist.tracks.map((s) => {
                if (s.id === list[i].id) {
                    top20.push(s);
                }
            })
        }
        loadNewsong(top20, $('.bang_list'));
    }
})