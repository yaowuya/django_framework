# -*- coding: utf-8 -*-
'''
-------------------------------------------------
   File Name：     report_service
   Author :        zhongrf
   Date：          2021/1/21
-------------------------------------------------
'''
import os

import imgkit
from django.http import HttpResponse
from django.utils.encoding import escape_uri_path
from pyecharts import options as opts
from pyecharts.charts import Pie, Bar, Grid
from pyecharts.faker import Faker
from pyecharts.render import make_snapshot
from snapshot_phantomjs import snapshot

from django_framework.settings import REPORT_TEMPLATE, BASE_DIR
from home_application.report_manage.report_common import SITUATION_HTML, TH_HTML, TR_HTML, TD_HTML


# def get_base_url():
#     if IS_LOCAL:
#         base_url = 'http://127.0.0.1:8070/static/'
#     else:
#         base_url = STATIC_URL
#     return base_url


def get_report_template():
    with open(REPORT_TEMPLATE, encoding='utf-8') as file:
        file_content = file.read()
    return file_content


def get_exception_situation(base_url):
    img_dict = {
        "exception_img": base_url + "report/situation-exception.png",
        "biz_img": base_url + "report/situation-biz.png",
        "host_img": base_url + "report/situation-host.png",
        "other_img": base_url + "report/situation-other.png",
    }
    text_params = {
        "exception_text": "昨日遗留4个异常，今日新增14个异常，13个异常已关闭，5个未关闭",
        "biz_text": "当前1个业务存在危险异常，2个业务存在警告异常，7个业务未发现异常",
        "host_text": "当前1台主机存在危险异常，3台主机存在警告异常，103台主机未发现异常",
        "other_text": "当前1个实例存在危险异常，57个实例未发现异常"
    }
    html_params = dict(**img_dict, **text_params)
    return SITUATION_HTML.format(**html_params)


def get_exception_type_pie():
    pie_url = os.path.join(BASE_DIR, 'static/report/exception_type_pie.png')
    pie_data = [["告警异常", 10], ["巡检异常", 4], ["基线异常", 3], ["备份异常", 2], ["其他异常", 2]]
    pie_colors = ['#ff761b', '#2873c4', '#ffbd00', '#7f7f7f', '#ffffff']
    pie = Pie(init_opts=opts.InitOpts(width=" 660px", height="420px"))
    pie.add("", pie_data, radius=['40%', '80%'])
    pie.set_colors(pie_colors)
    pie.set_global_opts(
        legend_opts=opts.LegendOpts(
            orient='vertical',
            legend_icon='circle',
            pos_right=10,
            pos_bottom=50,
            textstyle_opts=opts.TextStyleOpts(
                color="#ffffff",
                font_size=13,
                padding=[5, 0]
            )
        )
    )
    pie.set_series_opts(
        label_opts=opts.LabelOpts(
            color="#ffffff",
            font_size=13,
            formatter="{b}: {c}"
        )
    )
    make_snapshot(snapshot, pie.render(), pie_url)


def get_exception_time_bar():
    bar_url = os.path.join(BASE_DIR, 'static/report/exception_time_bar.png')
    bar_x = ['昨日遗留', '0:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00', '5:00-6:00',
             '6:00-7:00', '7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
             '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
             '19:00-20:00', '20:00-21:00', '21:00-22:00', '23:00-24:00']
    bar_y = [4, 1, 1, 3, 4, 3, 3, 2, 1, 4, 1, 1, 3, 4, 3, 0, 2, 1, 3, 4, 3, 0, 2, 1]
    create_bar(bar_url, bar_x, bar_y, 15)


def get_exception_week_bar():
    bar_url = os.path.join(BASE_DIR, 'static/report/exception_week_bar.png')
    bar_x = ['上周遗留', '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    bar_y = [4, 1, 1, 3, 4, 3, 3, 2]
    create_bar(bar_url, bar_x, bar_y, 30)


def create_bar(bar_url, bar_x, bar_y, bar_width):
    bar = Bar()
    bar.add_xaxis(bar_x)
    bar.add_yaxis(
        "",
        bar_y,
        itemstyle_opts=opts.ItemStyleOpts(color="#0068f8"),
        bar_width=bar_width
    )
    bar.set_global_opts(
        xaxis_opts=opts.AxisOpts(
            axistick_opts=opts.AxisTickOpts(
                is_align_with_label=True
            ),
            axislabel_opts=opts.LabelOpts(
                color="#ffffff",
                font_size=13
            )
        ),
        yaxis_opts=opts.AxisOpts(
            axislabel_opts=opts.LabelOpts(
                color="#ffffff",
                font_size=13
            ),
            splitline_opts=opts.SplitLineOpts(
                is_show=True,
                linestyle_opts=opts.LineStyleOpts(width=1, opacity=0.5, type_='solid', color='#ffffff')
            )
        )
    )
    bar.set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    grid = Grid(init_opts=opts.InitOpts(width=" 660px", height="240px"))
    grid.add(bar, grid_opts=opts.GridOpts(pos_left='3%', pos_right='4%', pos_top='3%', pos_bottom='3%',
                                          is_contain_label=True))
    make_snapshot(snapshot, grid.render(), bar_url)


def get_exception_detail_table(params):
    detail_th_list = [
        {
            "name": '业务',
            "value": 'biz',
            "width": 'width-100'
        }, {
            "name": '实例',
            "value": 'inst',
            "width": 'width-160'
        }, {
            "name": '实例类型',
            "value": 'instType',
            "width": 'width-100'
        }, {
            "name": '异常类型',
            "value": 'exType',
            "width": 'width-100'
        }, {
            "name": '产生时间',
            "value": 'whenCreated',
            "width": 'width-100'
        }, {
            "name": '异常状态',
            "value": 'exStatus',
            "width": 'width-100'
        }
    ]
    detail_data = [{
        "biz": '蓝鲸',
        "inst": 'APPO（192.169.1.1）123123213213213梦小明小梦小梦',
        "instType": '主机',
        "exType": '告警',
        "whenCreated": '2020-12-29 03:45',
        "exStatus": '未关闭'
    }, {
        "biz": '蓝鲸',
        "inst": 'APPO（192.169.1.1）小明小梦小梦小明小梦小梦',
        "instType": '主机',
        "exType": '基线',
        "whenCreated": '2020-12-29 03:45',
        "exStatus": '未关闭'
    }, {
        "biz": '蓝鲸',
        "inst": 'BKDATA（192.169.1.3）',
        "instType": '主机',
        "exType": '告警',
        "whenCreated": '2020-12-29 03:45',
        "exStatus": '未关闭'
    }, {
        "biz": '工单系统',
        "inst": 'tomcat01（192.169.1.2)',
        "instType": 'Tomcat',
        "exType": '告警',
        "whenCreated": '2020-12-29 03:45',
        "exStatus": '已关闭'
    }, {
        "biz": '流程系统',
        "inst": 'mongodb02(192.169.2.3)',
        "instType": 'MongoDB',
        "exType": '告警',
        "whenCreated": '2020-12-29 03:45',
        "exStatus": '已关闭'
    }]
    detail_table = create_table(detail_th_list, detail_data, True)
    return detail_table


def get_exception_biz_table():
    biz_th_list = [{
        "name": '业务',
        "value": 'biz',
        "width": '"width"-150'
    }, {
        "name": '运维人员',
        "value": 'operator',
        "width": '"width"-210'
    }, {
        "name": '异常数',
        "value": 'exCount',
        "width": '"width"-150'
    }, {
        "name": '未关闭异常数',
        "value": 'notCloseEx',
        "width": '"width"-150'
    }]

    biz_data = [{
        "biz": '蓝鲸',
        "operator": 'admin()',
        "exCount": 10,
        "notCloseEx": 3
    }, {
        "biz": '工单系统',
        "operator": 'admin(admin)',
        "exCount": 7,
        "notCloseEx": 1
    }, {
        "biz": '流程系统',
        "operator": 'runsen(润森)',
        "exCount": 1,
        "notCloseEx": 1
    }]

    return create_table(biz_th_list, biz_data, False)


def get_exception_inst_table():
    inst_th_list = [{
        "name": '业务',
        "value": 'biz',
        "width": '"width"-150'
    }, {
        "name": '实例',
        "value": 'inst',
        "width": '"width"-210'
    }, {
        "name": '实例类型',
        "value": 'instType',
        "width": '"width"-150'
    }, {
        "name": '异常数',
        "value": 'exCount',
        "width": '"width"-150'
    }]
    inst_data = [{
        "biz": '蓝鲸',
        "inst": 'APPT（192.169.1.2）',
        "instType": '主机',
        "exCount": 3
    }, {
        "biz": '工单系统',
        "inst": 'mongodb02（192.169.2.3）',
        "instType": 'MongoDB',
        "exCount": 0
    }, {
        "biz": '流程系统',
        "inst": 'host04（192.169.3.1）',
        "instType": 'Tomcat',
        "exCount": 3
    }, {
        "biz": '蓝鲸',
        "inst": 'APPT（192.169.1.2）',
        "instType": '主机',
        "exCount": 3
    }, {
        "biz": '蓝鲸',
        "inst": 'APPT（192.169.1.2）',
        "instType": '主机',
        "exCount": 3
    }, {
        "biz": '蓝鲸',
        "inst": 'APPT（192.169.1.2）',
        "instType": '主机',
        "exCount": 3
    }, {
        "biz": '蓝鲸',
        "inst": 'APPT（192.169.1.2）',
        "instType": '主机',
        "exCount": 3
    }, {
        "biz": '蓝鲸',
        "inst": 'APPT（192.169.1.2）',
        "instType": '主机',
        "exCount": 3
    }]
    return create_table(inst_th_list, inst_data, False)


def create_table(th_list, td_list, is_detail):
    table_list = []
    th_item_list = []
    for th in th_list:
        th_item_list.append(TH_HTML.format(th_class=th['width'], th_body=th['name']))
    table_list.append(TR_HTML.format(tr_body="".join(th_item_list)))
    for td in td_list:
        td_item_list = []
        for th in th_list:
            if is_detail and td[th["value"]] == "未关闭":
                span_item = """<span class="text-danger">未关闭</span>"""
            else:
                span_item = """<span>{text}</span>""".format(text=td[th["value"]])
            td_item_list.append(TD_HTML.format(td_class=th['width'], td_body=span_item))
        table_list.append(TR_HTML.format(tr_body="".join(td_item_list)))
    return "".join(table_list)


def download_img(html_string, img_name):
    # if settings.DEBUG:
    #     config = imgkit.config(wkhtmltoimage=r'E:\wkhtmltopdf\bin\wkhtmltoimage.exe')
    # else:
    #     config = imgkit.config(wkhtmltoimage='/usr/local/bin/wkhtmltoimage')
    config = imgkit.config(wkhtmltoimage=r'E:\wkhtmltopdf\bin\wkhtmltoimage.exe')
    img_file = imgkit.from_string(html_string, False, config=config)
    return download_file(img_file, img_name)


def download_file(file_buffer, file_name):
    response = HttpResponse(file_buffer, content_type='APPLICATION/OCTET-STREAM')
    # response['Content-Disposition'] = 'attachment; filename' + urlquote(file_name)
    response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(file_name))
    response['Content-Length'] = len(file_buffer)
    return response
