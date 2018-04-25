$(function () {
    $.get('../newsong.json').then(function (res) {
        let newsong = res;
        setTimeout(function () {
            newsong.forEach((obj)=>{
                let $li = $(`
                    <li>
                        <a href="/song.html?id=${obj.id}" class="goplaysong">
                            <h3 class="songName">${obj.name}</h3>
                            <div class="songInfo">
                                <svg class="icon SQ" aria-hidden="true">
                                <use xlink: href="#icon-wusunyinzhi"></use>
                                </svg>
                                <span class="songAutor">${obj.artisit} - ${obj.album}</span>
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
        },1000)
    })
})

