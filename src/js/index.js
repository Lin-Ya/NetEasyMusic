$(function () {
    $.get('../get/newsong.json').then(function (res) {
        let newsong = res;
        console.log(res);
        if (res.code === 200) {
            loadNewsong(res.result);
        } else {
            alert('网络异常，无法获取数据，请调试网络环境')
        }
    })

    function loadNewsong(result) {
        result.map(function (obj) {
            let song = obj.song;
            console.log(song)
            let artists = song.artists;

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
                            <span class="songAutor">${singer} - ${song.album.name}</span>
                        </div>
                            <svg class="icon playbtn" aria-hidden="true">
                                <use xlink: href="#icon-play-circled"></use>
                            </svg >
                    </a >
                </li >
            `);

            $li.appendTo('.remd-songlist');
            $('.loadingGif').remove();

        })
    }

})

