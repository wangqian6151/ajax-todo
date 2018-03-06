// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

// 增加一个 weibo
var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(id, callback) {
    var path = `/api/weibo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentAll = function(callback) {
    var path = '/api/comment/all'
    ajax('GET', path, '', callback)
}

// 增加一个 Comment
var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
    var path = `/api/comment/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
// WEIBO DOM
    var w = `
        <div id=weibo${weibo.id} class="weibo-cell" >
            <button data-id=${weibo.id} class="weibo-delete">删除</button>
            <button data-id=${weibo.id} class="weibo-edit">编辑</button>
            <span class="weibo-content">${weibo.content}</span>
            <div class="comment-list">
            </div>
            <div class="comment-add-form">
                <input class="comment-content">
                <br>
                <button data-id=${weibo.id} class="comment-add">添加评论</button>
            </div>
        </div>
    `
    return w
}

var weiboUpdateTemplate = function(weiboId) {
// WEIBO DOM
    var w = `
        <div class="weibo-update-form">
            <input class="weibo-update-input">
            <button data-id=${weiboId} class="weibo-update">更新</button>
        </div>
    `
    return w
}

var commentTemplate = function(comment) {
// COMMENT DOM
    var c = `
        <div class="comment-cell">
            <button data-id=${comment.id} class="comment-edit">编辑评论</button>
            <button data-id=${comment.id} class="comment-delete">删除评论</button>
            <span class="comment-content">${comment.content}</span>
        </div>
    `
    return c
}

var commentUpdateTemplate = function(commentId) {
// COMMENT DOM
    var c = `
        <div class="comment-update-form">
            <input class="comment-update-input">
            <button data-id=${commentId} class="comment-update">更新评论</button>
        </div>
    `
    return c
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    log('insertWeibo数据', weiboCell)
    // 插入 weibo-list
    var weiboList = e('.weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertUpdate = function(edit_button) {
    var weiboId = edit_button.dataset.id
    var weiboCell = weiboUpdateTemplate(weiboId)
    edit_button.parentElement.insertAdjacentHTML('beforeend', weiboCell)
}

var insertComment = function(comment) {
    var commentCell = commentTemplate(comment)
    var weibo_id = comment.weibo_id
    var w = e(`#weibo${weibo_id}`)
    if(w != null) {
//        log('insertComment数据', `#weibo${weibo_id}`, w)
        var weiboCell = w.closest('.weibo-cell')
        var commentList = weiboCell.querySelector('.comment-list')
        commentList.insertAdjacentHTML('beforeend', commentCell)
    } else {
        log('comment没有正确插入comment-list，请刷新网页', `#weibo${weibo_id}`, w)
    }
}

var insertCommentUpdate = function(edit_button) {
    var commentId = edit_button.dataset.id
    var commentCell = commentUpdateTemplate(commentId)
    edit_button.parentElement.insertAdjacentHTML('beforeend', commentCell)
}

var bindEventCommentAdd = function() {
    var weiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-add')) {
            log('点到了 comment添加按钮，id 是', self.dataset.id )
            var commentAddForm = self.closest('.comment-add-form')
            var input = commentAddForm.querySelector('.comment-content')
            var weiboId = self.dataset.id
            var form = {
                weibo_id: weiboId,
                content: input.value,
            }
            apiCommentAdd(form, function(r){
                log('收到comment更新数据', r)
                var comment = JSON.parse(r)
                insertComment(comment)
                input.value = ''
            })
        } else {
            log('点击的不是comment添加按钮******')
        }
    })
}

var bindEventCommentDelete = function() {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-delete')) {
            log('点到了 comment删除按钮，id 是', self.dataset.id )
            var commentId = self.dataset.id
            apiCommentDelete(commentId, function(r) {
                self.parentElement.remove()
            })
        } else {
            log('点击的不是comment删除按钮******')
        }
    })
}

var bindEventCommentEdit = function(){
    var weiboList = e('.weibo-list')
    // 事件响应函数会被传入一个参数, 就是事件本身
    weiboList.addEventListener('click', function(event){
        // 我们可以通过 event.target 来得到被点击的元素
        var self = event.target
        if (self.classList.contains('comment-edit')) {
            log('点到了 comment编辑按钮，id 是', self.dataset.id )
            // 插入编辑输入框
            insertCommentUpdate(self)
        } else {
            log('点击的不是weibo编辑按钮******')
        }
    })
}


var bindEventCommentUpdate = function(){
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-update')) {
            log('点到了 comment更新按钮，id 是', self.dataset.id )
           // var weiboCell = self.closest('.weibo-cell')
            var commentCell = self.closest('.comment-cell')
           // var weiboEdit = weiboCell.querySelector('.weibo-edit')
            var input = commentCell.querySelector('.comment-update-input')
            var commentId = self.dataset.id
          //  var weiboId = weiboEdit.dataset.id
            var form = {
                id: commentId,
            //    weibo_id: weiboId,
                content: input.value,
            }

            apiCommentUpdate(form, function(r){
                log('收到comment更新数据', r)

                var updateForm = commentCell.querySelector('.comment-update-form')
                updateForm.remove()

                var comment = JSON.parse(r)
                var commentContent = commentCell.querySelector('.comment-content')
                commentContent.innerText = comment.content
            })
        } else {
            log('点击的不是comment更新按钮******')
        }
    })
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {
        log('weibo load all', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
}

var loadComments = function() {
    // 调用 ajax api 来载入数据
    apiCommentAll(function(r) {
        console.log('comment load all', r)
        // 解析为 数组
        var comments = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < comments.length; i++) {
            var comment = comments[i]
            log('loadComments收到的数据 ', comment,i)
//            log('loadComments收到的数据comment ', comment.weibo_id,comment.content)
            insertComment(comment)
        }
    })
}


var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('weibo click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
            input.value = ''
        })
    })
}

var bindEventWeiboDelete = function() {
    /*
    给 删除 按钮绑定删除的事件
    1, 绑定事件
    2, 删除整个 weibo-cell 元素
    */
    var weiboList = e('.weibo-list')
    // 事件响应函数会被传入一个参数, 就是事件本身
    weiboList.addEventListener('click', function(event){
        // log('click weibolist', event)
        // 我们可以通过 event.target 来得到被点击的元素
        var self = event.target
        // log('被点击的元素是', self)
        // 通过比较被点击元素的 class 来判断元素是否是我们想要的
        // classList 属性保存了元素的所有 class
        // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
        // log(self.classList)
        // 判断是否拥有某个 class 的方法如下
        if (self.classList.contains('weibo-delete')) {
            log('点到了 weibo删除按钮，id 是', self.dataset.id )
            var weiboId = self.dataset.id
            // 删除 self 的父节点
            // parentElement 可以访问到元素的父节点
            apiWeiboDelete(weiboId, function(r) {
                self.parentElement.remove()
            })
        } else {
            log('点击的不是weibo删除按钮******')
        }
    })
}

var bindEventWeiboEdit = function(){
    var weiboList = e('.weibo-list')
    // 事件响应函数会被传入一个参数, 就是事件本身
    weiboList.addEventListener('click', function(event){
        // log('click weibolist', event)
        // 我们可以通过 event.target 来得到被点击的元素
        var self = event.target
        // log('被点击的元素是', self)
        // 通过比较被点击元素的 class 来判断元素是否是我们想要的
        // classList 属性保存了元素的所有 class
        // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
        // log(self.classList)
        // 判断是否拥有某个 class 的方法如下
        if (self.classList.contains('weibo-edit')) {
            log('点到了 weibo编辑按钮，id 是', self.dataset.id )
            // 插入编辑输入框
            insertUpdate(self)
        } else {
            log('点击的不是weibo编辑按钮******')
        }
    })
}


var bindEventWeiboUpdate = function(){
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('weibo-update')) {
            log('点到了 weibo更新按钮，id 是', self.dataset.id )

            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.weibo-update-input')
            var weiboId = self.dataset.id
            var form = {
                id: weiboId,
                content: input.value,
            }

            apiWeiboUpdate(form, function(r){
                log('收到weibo更新数据', r)

                var updateForm = weiboCell.querySelector('.weibo-update-form')
                updateForm.remove()

                var weibo = JSON.parse(r)
                var weiboContent = weiboCell.querySelector('.weibo-content')
                weiboContent.innerText = weibo.content
            })
        } else {
            log('点击的不是weibo更新按钮******')
        }
    })
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
    loadComments()
}

__main()
