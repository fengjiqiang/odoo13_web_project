# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class BookCopy(models.Model):
    _name = 'training.book.copy'
    _description = "书籍副本"

    book_id = fields.Many2one('training.book', string="书籍", ondelete='cascade')
    name = fields.Char(string="副本名称", default=lambda self: _('New'), readonly=True, required=True)
    reference = fields.Char(string="副本编号", default=lambda self: _('New'), readonly=True, required=True)
    book_rent_ids = fields.One2many('book.rent.return', 'copy_id', string="借阅")
    book_rented = fields.Boolean(string="借出", default=False)
    partner_book_ids = fields.Many2many("training.customer")
    book_location = fields.Char(string="馆藏位置")


    # 重写create方法，next_by_code方法指定模型：
    @api.model
    def create(self, vals):
        if vals.get('reference', 'New') == 'New':
            vals['reference'] = self.env['ir.sequence'].next_by_code('training.book.copy') or _('New')
        if vals.get('name', 'New') == 'New':
            vals['name'] = self.env['ir.sequence'].next_by_code('training.book.copy') or _('New')
        return super(BookCopy, self).create(vals)

    _sql_constraints = [
        ('reference_unique', 'UNIQUE(reference)', '编号必须唯一')
    ]
