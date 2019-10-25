# -*- coding: utf-8 -*-

from odoo import fields, models


class Partner(models.Model):
    _name = 'training.customer'

    name = fields.Char(string="名字")
    money = fields.Integer(string="欠款金额")
    op_type = fields.Selection(
        [('partner', '读者'), ('author', '作者')], string='类型', default='partner')
    customer_rent_ids = fields.One2many('book.rent.return', 'customer_id', string="借阅")
    book_author_ids = fields.One2many('training.book', 'author', sting="书籍")
