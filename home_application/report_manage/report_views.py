# -*- coding: utf-8 -*-
'''
-------------------------------------------------
   File Name：     report_views
   Author :        zhongrf
   Date：          2021/1/18
-------------------------------------------------
'''
import pdfkit
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django_framework.settings import EXPORT_FILE
from home_application.helper import now_time
from home_application.report_manage.report_service import *


@csrf_exempt
def export_pdf(request):
    try:
        content = request.POST.get("content")
        html_string = format_export_string(content)
        file_name = "test-" + now_time() + ".pdf"
        options = {
            'page-size': 'A4',
            'encoding': "UTF-8",
            "javascript-delay": "5000",
            "margin-top": "0",
            "margin-bottom": "0",
            "margin-left": "0",
            "margin-right": "0",
            'quiet': ""
        }
        # if settings.DEBUG:
        #     configuration = pdfkit.configuration(wkhtmltopdf=r'E:\wkhtmltopdf\bin\wkhtmltopdf.exe')
        # else:
        #     configuration = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')
        configuration = pdfkit.configuration(wkhtmltopdf=r'E:\wkhtmltopdf\bin\wkhtmltopdf.exe')
        pdf_path = False
        pdf_file = pdfkit.from_string(html_string, pdf_path, options=options, configuration=configuration)
        return download_file(pdf_file, file_name)
    except Exception as e:
        print(e)
        return JsonResponse({"result": False, "message": str(e)})


@csrf_exempt
def export_img(request):
    try:
        content = request.POST.get("content")
        html_string = format_export_string(content)
        img_name = "日报-" + now_time() + ".png"
        # if settings.DEBUG:
        #     config = imgkit.config(wkhtmltoimage=r'E:\wkhtmltopdf\bin\wkhtmltoimage.exe')
        # else:
        #     config = imgkit.config(wkhtmltoimage='/usr/local/bin/wkhtmltoimage')
        config = imgkit.config(wkhtmltoimage=r'E:\wkhtmltopdf\bin\wkhtmltoimage.exe')
        img_file = imgkit.from_string(html_string, False, config=config)
        return download_file(img_file, img_name)
    except Exception as e:
        print(e)
        return JsonResponse({"result": False, "message": str(e)})


def format_export_string(content):
    export_file = open(EXPORT_FILE, encoding='utf-8')
    file_content = export_file.read()
    export_file.close()
    html_content = content.replace("&amp;", "&").replace("&gt;", ">") \
        .replace('&quot;', '"') \
        .replace("&#039;", r"'") \
        .replace("&lt;", "<") \
        .replace("&nbsp;", " ") \
        .replace("\n", '') \
        .replace("\r", "").strip()
    return str(file_content).replace('{body_content}', html_content)


def report_to_image(request):
    try:
        base_url = "http://" + request.get_host() + "/static/"
        report_content = get_report_template()
        report_situation = get_exception_situation(base_url)
        except_detail_table = get_exception_detail_table('')
        exception_biz_table = get_exception_biz_table()
        exception_inst_table = get_exception_inst_table()
        report_params = {
            "report_css": base_url + 'report/report.css',
            "report_header_img": base_url + "report/report-header.jpg",
            "report_header_date": "12月27日",
            "exception_situation": report_situation,
            "exception_type_pie": base_url + "report/exception_type_pie.png",
            "exception_week_bar": base_url + "report/exception_week_bar.png",
            "exception_time_bar": base_url + "report/exception_time_bar.png",
            "exception_detail_table": except_detail_table,
            "exception_biz_table": exception_biz_table,
            "exception_inst_table": exception_inst_table,
            "report_footer_logo": base_url + "report/logo.png"
        }
        report_content = report_content.format(**report_params)
        # get_exception_type_pie()
        # get_exception_time_bar()
        # get_exception_week_bar()
        return download_img(report_content, "日报-" + now_time() + ".png")
    except Exception as e:
        print(e)
        return JsonResponse({"result": False, "message": str(e)})


def test_report(request):
    try:
        res = get_exception_detail_table("")
        return JsonResponse({"result": True, "data": res})
    except Exception as e:
        print(e)
        return JsonResponse({"result": False, "message": str(e)})
