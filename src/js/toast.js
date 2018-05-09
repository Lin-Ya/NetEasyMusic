//使用方法： toast(msg,time)

function toast(msg, time) {
    this.message = msg;
    this.delay = time || 1500;
    this.createTost();
    this.showToast();
}

toast.prototype = {
    createTost: function () {
        //创建jQuery模板
        this.$temp = $(`<div class="toast">${this.message}</div>`)
        $('body').append(this.$temp)
    },
    showToast: function () {
        let _this = this;
        this.$temp.fadeIn(300, function () {
            setTimeout(function () {
                _this.$temp.remove()
            }, _this.delay)
        })
    }
}

function Toast(msg, time) {
    return new toast(msg, time);
}