# -*- coding: utf-8 -*-
'''
-------------------------------------------------
   File Name：     urls
   Author :        zhongrf
   Date：          2020/11/30
-------------------------------------------------
'''
from django.conf.urls import url
from . import report_views

urlpatterns = [
    url(r'^export_pdf$', report_views.export_pdf),
    url(r'^export_img$', report_views.export_img),
    url(r'^report_to_image$', report_views.report_to_image),
    url(r'^test_report$', report_views.test_report),
]
