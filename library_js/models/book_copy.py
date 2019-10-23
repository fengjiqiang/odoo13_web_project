# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class BookCopy(models.Model):
    _name = 'training.book.copy'
    _description = "书籍副本"
    # _inherits = {'training.book': 'book_id'}

    book_id = fields.Many2one('training.book', string="书籍", delegate=True, ondelete='cascade')
    name = fields.Char(string="副本名称", default=lambda self: _('New'), readonly=True, required=True)
    reference = fields.Char(string="副本编号", default=lambda self: _('New'), readonly=True, required=True)
    book_rent_ids = fields.One2many('book.rent.return', 'copy_id', string="借阅")
    book_rented = fields.Boolean(string="借出", default=False)
    partner_book_ids = fields.Many2many("training.customer")

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

    @api.model
    def write_cus(self, resid):
        # 借阅记录id
        rent_book_id = self.env['book.rent.return'].search([('id', '=', resid)])
        # 副本id
        book_copy_id = rent_book_id.copy_id
        # 借阅人id
        cus_id = rent_book_id.customer_id.id
        # book_copy_id.write({'partner_book_ids': cus_id})
        book_copy_id.write({'partner_book_ids': [(6, 0, [cus_id])]})
