from utils import log
from routes import json_response
from routes import (
    redirect,
    http_response,
    current_user,
    login_required,
)
from models.comment import Comment
from models.weibo import Weibo



# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    weibo_list = Weibo.all()
    # 要转换为 dict 格式才行
    weibos = [t.json() for t in weibo_list]
    return json_response(weibos)

def comment_all(request):
    comment_list = Comment.all()
    # 要转换为 dict 格式才行
    comments = [t.json() for t in comment_list]
    return json_response(comments)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里用新增加的 json 函数来获取格式化后的 json 数据
    u = current_user(request)
    form = request.json()
    # 创建一个 weibo
    t = Weibo.new(form,u.id)
    # 把创建好的 weibo 返回给浏览器
    return json_response(t.json())


def comment_add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里用新增加的 json 函数来获取格式化后的 json 数据
    u = current_user(request)
    form = request.json()
    # 创建一个 weibo
    t = Comment.new(form, u.id)
    # 把创建好的 weibo 返回给浏览器
    return json_response(t.json())

def comment_delete(request):
    comment_id = int(request.query.get('id'))
    t = Comment.delete(comment_id)
    return json_response(t.json())


def delete(request):
    weibo_id = int(request.query.get('id'))
    t = Weibo.delete(weibo_id)
    return json_response(t.json())


def update(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    t = Weibo.update(weibo_id, form)
    return json_response(t.json())


def comment_update(request):
    form = request.json()
    comment_id = int(form.get('id'))
    t = Comment.update(comment_id, form)
    return json_response(t.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
        '/api/comment/all': comment_all,
        '/api/comment/add': comment_add,
        '/api/comment/delete': comment_delete,
        '/api/comment/update': comment_update,
    }
    return d
