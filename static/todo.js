// TODO API
// 获取所有 todo
var apiTodoAll = function(callback) {
    var path = '/api/todo/all'
    ajax('GET', path, '', callback)
}

// 增加一个 todo
var apiTodoAdd = function(form, callback) {
    var path = '/api/todo/add'
    ajax('POST', path, form, callback)
}

var apiTodoUpdate = function(form, callback) {
    var path = '/api/todo/update'
    ajax('POST', path, form, callback)
}

var apiTodoDelete = function(id,callback) {
    var path = `/api/todo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

// TODO DOM
var todoTemplate = function(todo) {
    var t = `
        <div class="todo-cell">
            <button data-id=${todo.id} class="todo-delete">删除</button>
            <button data-id=${todo.id} class="todo-edit">编辑</button>
            <span class= "todo-task">${todo.task} </span>
            <p class="todo-time">${todo.created_time}</p>
        </div>
    `
    return t
}


var todoUpdateTemplate = function(todoId) {
    var t = `
        <div class="todo-update-form">
            <input class="todo-update-input">
            <button data-id=${todoId} class="todo-update">更新</button>
        </div>
    `
    return t
}


var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    // 插入 todo-list
    var todoList = e('.todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}


var insertUpdate = function(edit_button) {
    var todoId = edit_button.dataset.id
    // 插入 todo-list
    var editCell = todoUpdateTemplate(todoId)
    edit_button.parentElement.insertAdjacentHTML('beforeend', editCell)
}


var loadTodos = function() {
    // 调用 ajax api 来载入数据
    apiTodoAll(function(r) {
        console.log('load all', r)
        // 解析为 数组
        var todos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            insertTodo(todo)
        }
    })
}

var bindEventTodoAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-todo')
        var task = input.value
        log('click add', task)
        var form = {
            task: task,
        }
        apiTodoAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            log('todo_r',r)
            var todo = JSON.parse(r)
            insertTodo(todo)
            input.value = ''
        })
    })
}


var bindEventTodoDelete = function(){
    var todoList = e('.todo-list')
 // 事件响应函数会被传入一个参数, 就是事件本身
 todoList.addEventListener('click', function(event){
     // log('click todolist', event)
     // 我们可以通过 event.target 来得到被点击的元素
     var self = event.target
     // log('被点击的元素是', self)
     // 通过比较被点击元素的 class 来判断元素是否是我们想要的
     // classList 属性保存了元素的所有 class
     // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
     // log(self.classList)
     // 判断是否拥有某个 class 的方法如下
     if (self.classList.contains('todo-delete')) {
         log('点到了 删除按钮',self.dataset.id)
         var todoId = self.dataset.id
         // 删除 self 的父节点
         // parentElement 可以访问到元素的父节点

         apiTodoDelete(todoId,function(r) {
            self.parentElement.remove()
        })
     } else {
         // log('点击的不是删除按钮******')
     }
 })
}

var bindEventTodoEdit = function(){
 var todoList = e('.todo-list')
 // 事件响应函数会被传入一个参数, 就是事件本身
 todoList.addEventListener('click', function(event){
     // log('click todolist', event)
     // 我们可以通过 event.target 来得到被点击的元素
     var self = event.target
     // log('被点击的元素是', self)
     // 通过比较被点击元素的 class 来判断元素是否是我们想要的
     // classList 属性保存了元素的所有 class
     // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
     // log(self.classList)
     // 判断是否拥有某个 class 的方法如下
     if (self.classList.contains('todo-edit')) {
         log('点到了 编辑按钮',self.dataset.id)
         var todoId = self.dataset.id
         //插入编辑输入框
         insertUpdate(self)
     } else {
         // log('点击的不是吧编辑按钮******')
     }
 })

}

var bindEventTodoUpdate = function(){
 var todoList = e('.todo-list')
 // 事件响应函数会被传入一个参数, 就是事件本身
 todoList.addEventListener('click', function(event){

     // 我们可以通过 event.target 来得到被点击的元素
     var self = event.target

     // 判断是否拥有某个 class 的方法如下
     if (self.classList.contains('todo-update')) {
         log('点到了 更新按钮',self.dataset.id)
         var todoCell = self.closest('.todo-cell')
         var input = todoCell.querySelector('.todo-update-input')
         var todoId = self.dataset.id
         var form = {
            id: todoId,
            task: input.value,

         }
         apiTodoUpdate(form,function(r){
            log('收到更新数据',r)

            var updateForm = todoCell.querySelector('.todo-update-form')
            updateForm.remove()

            var todo = JSON.parse(r)
            var todoTask = todoCell.querySelector('.todo-task')
            var todoTime = todoCell.querySelector('.todo-time')
            todoTask.innerText = todo.task
            todoTime.innerText = todo.updated_time
         })
     } else {
         // log('点击的不是更新按钮******')
     }
 })

}

var bindEvents = function() {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()

}

var __main = function() {
    bindEvents()
    loadTodos()
}

__main()

