from models.comment import Comment
from models.user import User
from models.weibo import Weibo
from routes import (
    redirect,
    http_response,
    current_user,
    login_required,
)
from utils import template, log


# 微博相关页面
def index(request):
    u = current_user(request)
    body = template('weibo_index.html')
    return http_response(body)

def route_dict():
    r = {
        '/weibo/index': login_required(index),
    }
    return r
