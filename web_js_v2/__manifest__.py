# -*- coding: utf-8 -*-
{
    'name': "图书馆",
    'summary': "web js v2",
    'description': "图书馆",
    'author': "Ethan Feng",
    'website': "http://www.yourcompany.com",
    'category': 'Uncategorized',
    'version': '0.1',
    'depends': ['base', 'mail'],
    # 菜单放在最后面
    'data': [
        'static/src/xml/list_template.xml',
        'security/ir.model.access.csv',
        'data/demo_data.xml',
        'views/book_views.xml',
        'views/book_copy_views.xml',
        'views/book_rent_return_views.xml',
        'views/customer_views.xml',
        'data/ir_sequence_data.xml',
        'views/training_library_menu.xml',
    ],
    'js': [],
    'css': [],
    'installable': True,
    'auto_install': False,
    'application': True,
}