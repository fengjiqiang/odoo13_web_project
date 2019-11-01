# -*- coding: utf-8 -*-
{
    'name': 'web_sample',
    'version': '1.0',
    'summary': 'web presentation',
    'sequence': 25,
    'category': '',
    'website': 'https://www.odoo.com',
    'images': [],
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/list_template.xml',
        'views/product_category_views.xml',
        'views/product_views.xml',
        'views/purchase_order_views.xml',
        'views/customer_views.xml',
        'data/demo_data.xml',
        'views/menu_views.xml',
    ],
    'demo': [],
    'qweb': [],
    'installable': True,
    'application': True,
    'auto_install': False,
}