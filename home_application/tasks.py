# -*- coding: utf-8 -*-

# @Time : 2021-1-15 14:00
# @Author : WangZhen
"""
# celery 任务示例
#
# 本地启动celery命令: python manage.py celery worker -l info
# 周期性任务还需要启动celery调度命令：python manage.py celery beat -l info
python manage.py celery worker -l info
python manage.py celery beat -l info
"""
import base64
import json
import asyncio
import time
import aiohttp
import requests
import datetime

from celery import task
from celery.schedules import crontab
from celery.task import periodic_task
from djcelery.models import CrontabSchedule
from djcelery.schedulers import DatabaseScheduler


from django.db import transaction
from django.conf import settings
from aiohttp import ClientConnectorError


# @periodic_task(run_every=crontab(minute=0, hour=4))
# def run_init_cmdb():
#     init_cmdb_to_local()
