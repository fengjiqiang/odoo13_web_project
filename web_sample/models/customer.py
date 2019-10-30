# -*- coding: utf-8 -*-

from odoo import api, fields, models, _, tools
from odoo.exceptions import ValidationError

class Customer(models.Model):
    _name = 'web.customer'
    
    name = fields.Char(index=True)
    display_name = fields.Char(compute='_compute_display_name', store=True, index=True)
    date = fields.Date(string='birth',index=True)
    ref = fields.Char(string='Reference', index=True)
    comment = fields.Text(string='Notes')

    active = fields.Boolean(default=True)
    employee = fields.Boolean(help="Check this box if this contact is an Employee.")
    function = fields.Char(string='Job Position')
    # type = fields.Selection(
    #     [('contact', 'Contact'),
    #      ('invoice', 'Invoice Address'),
    #      ('delivery', 'Delivery Address'),
    #      ('other', 'Other Address'),
    #      ("private", "Private Address"),
    #     ], string='Address Type',
    #     default='contact',
    #     help="Invoice & Delivery addresses are used in sales orders. Private addresses are only visible by authorized users.")
    street = fields.Char()
    street2 = fields.Char()
    zip = fields.Char(string='zip code',change_default=True)
    city = fields.Char()
    email = fields.Char()
    phone = fields.Char()
    mobile = fields.Char()
    color = fields.Integer(string='Color Index', default=0)
    company_name = fields.Char(string='Company Name')

