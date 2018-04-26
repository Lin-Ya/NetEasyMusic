$(function () {
    //首页tab切换
    $('.tabs').on('click', 'li', function (e) {
        let $li = $(e.currentTarget);
        let index = $li.index();
        $li.addClass('click').addClass('active').siblings().removeClass('active')
        $('.content').children().eq(index).addClass('active').siblings().removeClass('active')
    })

    function log(s) {
        return console.log(s)
    }
    // 获取最新音乐
    $.get('../get/newsong.json').then(function (res) {
        if (res.code === 200) {
            // loadNewsong(res.result,$('.remd .remd-songlist'));
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
        for(let i=0 ;i<6; i++){
            songLists[i] = result[i];
        }
        log(songLists)
        songLists.map((list)=>{
            let count = '';
            count = Math.ceil((list.playCount/10000).toFixed(2));
            let danwei = '';
        
            if (count.toString().length>5){
                count = (count / 10000).toFixed(1);
                danwei = '亿'
            }else {
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

    function loadNewsong(result,$target) {
        log('================')
        log(result)
        result.map(function (obj,index) {
            let number = (index+1).toString();
            debugger
            //todo，根据number添加到歌曲系列中作为排名，如果是插入到首页的话，记得给CSS添加样式为display：none；
            let song,id,artists,album,singer,name;
            if(obj.song){
                song = obj.song
                id = song.id
                artists = song.artists
                album = song.album.name
                singer = "";
                name = song.name
            }else {
                id = obj.id;
                artists = obj.ar;
                album = obj.al.name;
                singer = "";
                name = obj.name;
            }
            // let song = obj.song || obj;
            // let id = song.id||obj.id;
            // let artists = song.artists||obj.ar;
            // let album = song.album.name || obj.al.name;
            // let singer = "";
            // let name = song.name || obj.name;
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
                    </a >
                </li >
            `);
            $li.appendTo($target);
            $('.loadingGif').remove();
        })
    }

    function loadHotsong(res) {
        let {playlist} = res;
        log(playlist);
        let list = res.privileges.splice(0,20)
        let top20 = [];
        for(let i=0; i<20; i++){
            playlist.tracks.map((s)=>{
                if(s.id === list[i].id){
                    top20.push(s);
                }
            })
        }
        loadNewsong(top20,$('.bang_list'));
    }
})

