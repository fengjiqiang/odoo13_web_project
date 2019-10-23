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
    rent_book_id = fields.Many2one('training.book')

    # @api.depends('rental_date', 'return_date')  # 后端改变 self是新值
    # def _compute_time(self):
    #     for rental in self:
    #         if not (rental.rental_date and rental.return_date):
    #             return
    #         if rental.return_date < rental.rental_date:
    #             raise ValidationError('归还时间不能小于借阅时间')
    #         if rental.rental_date and rental.return_date:
    #             rental.continue_days = str(rental.return_date - rental.rental_date)

    def action_confirm(self):
        book_rent = self.env['training.book.copy'].search([('id', '=', self.copy_id.id)])
        if book_rent:
            book_rent.write({'book_rented': True})
            self.write({'state': 'confirm'})

    def action_draft(self):
        customer_owe = self.env['training.customer'].search([('id', '=', self.customer_id.id)])
        current = fields.Datetime.now()
        remain_days = (datetime.now() - self.rental_date).days
        # print("当前时间: ", current)

        if customer_owe:
            # if self.return_date < current:
            if remain_days > 30:
                # owe_money = (current - self.return_date).days
                owe_money = remain_days - 30
                customer_owe.write({'money': owe_money})
                self.write({'state': 'owe'})
            else:
                self.write({'state': 'complete'})
            self.write({'return_date': current})
            self.write({'continue_days': str(current - self.rental_date)})
            self.copy_id.write({'book_rented': False})
            # raise ValidationError("书籍已逾期") # 影响保存数据
        # self.unlink()

    # @api.onchange('copy_id')
    # def check_rent(self):
    #     rent_search = self.env['book.rent.return'].search([('copy_id', '=', self.copy_id.id)])
    #     # print(type(rent_search))
    #     if rent_search:
    #         raise ValidationError("书已借出")
