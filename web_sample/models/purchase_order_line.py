# -*- coding: utf-8 -*-

from odoo import api, fields, models, _, tools

class PurchaseOrderLine(models.Model):
    _name = 'web.purchase.order.line'
    _description = 'Purchase Order Line'
    _order = 'order_id, sequence, id'

    name = fields.Text(string='Description')
    sequence = fields.Integer(string='Sequence', default=10)
    product_qty = fields.Float(string='Quantity', digits='Product Unit of Measure', required=True)

    date_planned = fields.Datetime(string='Scheduled Date', index=True)
    
    product_id = fields.Many2one('web.product', string='Product', change_default=True)

    price_unit = fields.Float(string='Unit Price', related='product_id.list_price', required=True, digits='Product Price')

    order_id = fields.Many2one('web.purchase.order', string='Order Reference', index=True, required=True, ondelete='cascade')

    # partner_id = fields.Many2one('res.partner', related='order_id.partner_id', string='Partner', readonly=True, store=True)
    date_order = fields.Datetime(related='order_id.date_order', string='Order Date', readonly=True)

    display_type = fields.Selection([
        ('line_section', "Section"),
        ('line_note', "Note")], default=False, help="Technical field for UX purpose.")
