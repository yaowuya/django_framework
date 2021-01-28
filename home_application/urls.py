# -*- coding: utf-8 -*-
'''
-------------------------------------------------
   File Name：     urls
   Author :        zhongrf
   Date：          2021/1/28
-------------------------------------------------
'''

from django.conf.urls import url, include

from . import views

urlpatterns = (
    url(r"^$", views.home),
    url(r"^hello_world/$", views.hello_world),
    url(r"^report/", include('home_application.report_manage.urls')),
)
