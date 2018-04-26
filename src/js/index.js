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
    //获取最新音乐
    // $.get('../get/newsong.json').then(function (res) {
    //     if (res.code === 200) {
    //         loadNewsong(res.result,$('.remd-songlist')));
    //     } else {
    //         alert('网络异常，无法获取数据，请调试网络环境')
    //     }
    // })
    // //获取推荐歌单
    // $.get('../get/personalized.json').then(function (res) {
    //     if (res.code === 200) {
    //         loadPersonlized(res.result);
    //     } else {
    //         alert('网络异常，无法获取数据，请调试网络环境')
    //     }
    // })


    //获取热歌榜
    $.get('../get/hotsong.json').then(function (res) {
        
        if (res.code === 200) {
            log(res)
            loadHotsong(res.playlist)
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
        result.map(function (obj) {
            let song = obj.song;
            let artists = song.artists||song.ar;
            let ablum = song.ablum.name || song.al.name;
            let singer = "";
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
                    <a href="/song.html?id=${song.id}" class="goplaysong">
                        <h3 class="songName">${song.name}</h3>
                        <div class="songInfo">
                            <svg class="icon SQ" aria-hidden="true">
                            <use xlink: href="#icon-wusunyinzhi"></use>
                            </svg>
                            <span class="songAutor">${singer} - ${ablum}</span>
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

    function loadHotsong(playlist) {
        
    }
})

