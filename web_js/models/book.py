# -*- coding: utf-8 -*-

from odoo import models, fields, api


class Book(models.Model):
    _name = 'training.book'
    _parent_name = "parent_id"
    _description = "书籍"

    name = fields.Char(string="书籍")
    author = fields.Many2one('training.customer', string="作者", store=True)
    year = fields.Date(string='出版时间')
    ISBN = fields.Char(string='ISBN号')
    book_copy_ids = fields.One2many('training.book.copy', 'book_id', string="副本")
