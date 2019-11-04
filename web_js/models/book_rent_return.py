# -*- coding: utf-8 -*-

from datetime import datetime
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class BookSentReturn(models.Model):
    _name = "book.rent.return"
    _description = "借阅"
    _inherit = ['mail.thread', 'mail.activity.mixin']

    copy_id = fields.Many2one('training.book.copy', string="书籍")
    book_reference = fields.Char(related='copy_id.reference', string="编号")
    customer_id = fields.Many2one('training.customer', string="借阅人", track_visibility='always')
    rental_date = fields.Datetime(string="借阅时间", default=fields.Datetime.now, track_visibility='always')
    return_date = fields.Datetime(string="归还时间", track_visibility='always')
    continue_days = fields.Char(string='持续时间')
    state = fields.Selection([
        ('draft', '草稿'),
        ('confirm', '借出'),
        ('owe', '逾期'),
        ('complete', '完成'),
    ], string='状态', copy=False, default='draft')
    book_rented = fields.Boolean(string="借出", default=False)
    # rent_book_id = fields.Many2one('training.book')


    def action_confirm(self):
        book_rent = self.env['training.book.copy'].search([('id', '=', self.copy_id.id)])
        if book_rent:
            book_rent.write({'book_rented': True})
            self.write({'state': 'confirm'})

    def action_draft(self):
        customer_owe = self.env['training.customer'].search([('id', '=', self.customer_id.id)])
        current = fields.Datetime.now()
        remain_days = (datetime.now() - self.rental_date).days

        if customer_owe:
            if remain_days > 30:
                owe_money = remain_days - 30
                customer_owe.write({'money': owe_money})
                self.write({'state': 'owe'})
            else:
                self.write({'state': 'complete'})
            self.write({'return_date': current})
            self.write({'continue_days': str(current - self.rental_date)})
            self.copy_id.write({'book_rented': False})
    
    @api.model
    def search_read(self,domain=None, fields=None, offset=0, limit=None, order=None):
        res = super(BookSentReturn,self).search_read(domain,fields,offset,limit,order)
        return res
