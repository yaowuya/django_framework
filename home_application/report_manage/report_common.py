# -*- coding: utf-8 -*-
'''
-------------------------------------------------
   File Name：     report_common
   Author :        zhongrf
   Date：          2021/1/21
-------------------------------------------------
'''
TR_HTML = """<tr>{tr_body}</tr>"""
TH_HTML = """<th class="{th_class}">{th_body}</th>"""
TD_HTML = """<td class="{td_class}">{td_body}</td>"""
SITUATION_HTML = """
        <div class="mb-23">
           <div class="dr-exs-item mr-15">
              <img src="{exception_img}" alt="">
              <p class="img-title">异常</p>
              <p class="dr-exs-item-text">{exception_text}</p>
            </div>
            <div class="dr-exs-item">
              <img src="{biz_img}" alt="">
              <p class="img-title">业务</p>
              <p class="dr-exs-item-text">{biz_text}</p>
            </div>
        </div>
        <div>
           <div class="dr-exs-item mr-15">
              <img src="{host_img}" alt="">
              <p class="img-title">主机实例</p>
              <p class="dr-exs-item-text">{host_text}</p>
           </div>
           <div class="dr-exs-item">
              <img src="{other_img}" alt="">
              <p class="img-title">其他类型实例</p>
              <p class="dr-exs-item-text">{other_text}</p>
           </div>
        </div>
    """
