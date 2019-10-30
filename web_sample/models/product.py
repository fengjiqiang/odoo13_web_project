# -*- coding: utf-8 -*-

from odoo import api, fields, models, _, tools
from odoo.exceptions import ValidationError

class Product(models.Model):
    _name = "web.product"
    _description = "Web Product"
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = "name"
    
    
    name = fields.Char(string='Name', index=True, required=True, translate=True)
    sequence = fields.Integer('Sequence', default=1)

    categ_id = fields.Many2one('web.product.category', 'Product Category',
        change_default=True, required=True)

    list_price = fields.Float(string='Sales Price', default=1.0, digits='Product Price')
    active = fields.Boolean(string='Active', default=True)
    product_order_id = fields.Many2one('web.purchase.order')
