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
    # rent_ids = fields.Many2many('book.rent.return')
    # 尝试one2many
    rent_ids = fields.One2many('book.rent.return', 'rent_book_id')

    @api.model
    def write_rent_record(self, resid):
        # 副本id
        book_copy_id = self.env['training.book.copy'].search([('id', '=', resid)])
        # 书籍id
        book_id = book_copy_id.book_id
        # 借阅id
        rent_book_id = book_copy_id.book_rent_ids.ids
        book_id.write({'rent_ids': [(6, 0, rent_book_id)]})
