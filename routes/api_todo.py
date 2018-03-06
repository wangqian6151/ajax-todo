from utils import log
from routes import (
    json_response,
    login_required,
    current_user,
    redirect,
)
from models.todo import Todo


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    todo_list = Todo.all()
    # 要转换为 dict 格式才行
    todos = [t.json() for t in todo_list]
    return json_response(todos)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    # 创建一个 todo
    t = Todo.new(form)
    # 把创建好的 todo 返回给浏览器
    log('todo_json', t.json())
    return json_response(t.json())


def delete(request):
    todo_id = int(request.query.get('id'))
    t = Todo.delete(todo_id)
    return json_response(t.json())


def update(request):
    form = request.json()
    todo_id = int(form.get('id'))
    t = Todo.update(todo_id, form)
    return json_response(t.json())


def same_user_required(route_function):

    def f(request):
        log('same user required', request)
        u = current_user(request)
        if request.method == 'GET':
            todo_id = int(request.query.get('id'))
        else:
            todo_id = int(request.form().get('id'))
        t = Todo.find(todo_id)
        if t.is_owner(u.id):
            return route_function(request)
        else:
            return redirect('/login')

    return f

def route_dict():
    d = {
        '/api/todo/all': all,
        '/api/todo/add': add,
        '/api/todo/delete': delete,
        '/api/todo/update': update,
    }
    return d
