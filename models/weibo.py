from models import Model
from models.comment import Comment


class Weibo(Model):
    """
    微博类
    """
    def __init__(self, form, user_id=-1):
        super().__init__(form)
        self.content = form.get('content', '')
        # 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        self.user_id = form.get('user_id', user_id)

    @classmethod
    def new(cls, form, user_id):
        m = super().new(form)
        m.user_id = user_id
        m.save()
        return m

    @classmethod
    def update(cls,id,form):
        w = cls.find(id)
        valid_names = [
            'content',
        ]
        for key in form:
            if key in valid_names:
                setattr(w, key, form[key])
        w.save()
        return w

    def is_owner(self, id):
        return self.user_id == id

    def comments(self):
        return Comment.find_all(weibo_id=self.id)