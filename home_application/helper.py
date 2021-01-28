# -*- coding: utf-8 -*-
'''
-------------------------------------------------
   File Name：     helper
   Author :        zhongrf
   Date：          2020/11/24
-------------------------------------------------
'''
import datetime
import json

from django.core.paginator import Paginator


class Paging(object):
    """分页"""

    def __init__(self, Qset, num, page):
        self.Qset = Qset
        if num == '':
            num = -1
        if page == '':
            page = 1
            num = -1
        self.page = page
        self.num = num
        if num == -1:
            self.page_obj = self.Qset
        else:
            self.Paginator_obj = Paginator(object_list=self.Qset, per_page=self.num, orphans=0,
                                           allow_empty_first_page=True)
            self.page_obj = self.Paginator_obj.page(
                self.page if self.page <= self.Paginator_obj.num_pages else self.Paginator_obj.num_pages)

    def for_paging(self, result_list):
        if self.num != -1:
            return {'data': result_list, 'now_page': self.page_obj.number, 'total': self.Paginator_obj.count}
        else:
            return {'data': result_list, 'now_page': 1, 'total': len(result_list)}


def now_time():
    """当前时间"""
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def is_empty(s):
    if len(s.strip()) == 0:
        return True
    else:
        return False


def loads_params(request):
    if request.method == "GET":
        params = request.GET
    elif request.method == "POST":
        try:
            params = json.loads(request.body or "{}")
        except Exception as e:
            raise Exception(e)
    else:
        raise Exception("method {} is error".format(request.method))
    return params
