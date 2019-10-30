# -*- coding: utf-8 -*-

from odoo import api, fields, models, _, tools
from odoo.exceptions import ValidationError, UserError

class PurchaseOrder(models.Model):
    _name = "web.purchase.order"
    _description = "Web Purchase Order"
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'date_order desc, id desc'

    name = fields.Char(string='Order Reference', required=True, index=True, copy=False, default='New')
    date_order = fields.Datetime(string='Order Date', required=True, index=True, copy=False, default=fields.Datetime.now)
    date_approve = fields.Datetime(string='Confirmation Date', readonly=1, index=True, copy=False)
    
    order_line = fields.One2many('web.purchase.order.line', 'order_id', string='Order Lines', copy=True)

    # There is no inverse function on purpose since the date may be different on each line
    date_planned = fields.Datetime(string='Receipt Date', index=True)
    # product_id = fields.Many2one('web.product', related='order_line.product_id', string='Product', readonly=False)
    customer_id = fields.Many2one('web.customer', string="Customer")
    product_line = fields.One2many('web.product', 'product_order_id', string='Product Lines', copy=True)

    @api.model
    def write_product_record(self, resid):
        # order line id
        order_line_id = self.env['web.purchase.order.line'].search([('id', '=', resid)])
        # order id
        order_id = order_line_id.order_id
        # product id
        product_id = order_line_id.product_id.ids
        # 写入表中
        order_id.write({'product_line': [(6, 0, product_id)]})
