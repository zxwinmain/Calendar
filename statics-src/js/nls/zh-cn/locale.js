define({
    'root': {
        'dialog': {
            'loading': '正在加载...',
            'network_broken': '暂时无法连接到服务器，请检查您的网络环境。',
            'button_true': '好的',
            'button_false': '取消',
            'title_ok': '搞定啦!',
            'title_error': '啊!..出错了',
            'title_confirm': '哇!..你确定要这样做?',
            'content_not_completed': '似乎您还未将必要内容输入完整。',
            'time_range_error': '结束时间必须大于开始时间。',
            'file_invalid': '似乎您上传的文件格式有误。',
            'file_no_uploaded': '似乎您没有上传任何文件。',
            'signin_required': '似乎您的用户名或密码并没有输入完整。',
            'signin_invalid_email': '似乎您的邮件地址输入有误，请填写正确的电子邮箱地址。',
            'signin_invalid_password': '为了您的数据安全，密码必须由数字、字母、特殊字符三种中的两种组成，并且不能少于8个字符。',
            'signin_wrong_user_or_password': '您输入的用户名或密码错误。',
            'signin_wrong_account': '您的主体账户无效',
            'invited': '邀请成功，请通知该用户查收邮件。',
            'invite_invalid_email': '您邀请的用户已经存在。',
            'storage_invalid_folder':'这个文件夹的名字已经存在。',
            'storage_folder_not_empty':'这个文件夹并不是空的。',
            'storage_new_file_name': '请输入新的文件名（包含后缀）',
            'storage_new_folder_name': '请输入新的文件夹名称'
        },
        'signin': {
            'title': '欢迎回来',
            'password': '您的密码',
            'signin': '登录',
            'forgot': '不慎遗忘了您的密码?',
            'signup': '注册一个新的账户'
        },
        'calendar': {
            'filter': '筛选',
            'fliter_user_all': '所有用户',
            'fliter_state_all': '所有状态',
            'fliter_state_planned': '计划之中',
            'fliter_state_done': '处理完毕'
        },
        'app': {
            'from': '由',
            'supply': '提供',
            'name': {
                'c34b51304a1a6f45c6f68cc59a50b8e1': '应用定制',
                '7d3f1a78c6acdb7ace8649185df58879': '客户档案',
                '8b8dc074f67a506499caaa2f084ec5b7': '业务机会',
                '8613431293e87fe5671a314be253d5ee': '特别事件'
            }
        },
        'review': {
            'null': '啊? 这一天竟然没有任何动态。',
            'event_created': '新建了一个事件',
            'event_updated': '修改了一个事件',
            'event_done': '完成了一个事件',
            'event_redo': '重新开启了一个事件',
            'event_at': '于'
        },
        'storage': {
            'name': '名称',
            'user': '用户',
            'size': '大小',
            'time': '最后更新',
            'method': '操作',
            'upload': '上传新文件',
            'folder': '文件夹',
            'folder_new': '新建文件夹',
            'download': '下载',
            'delete': '删除',
            'rename': '更名',
            'empty': '暂时还没有任何文件'
        },
        'component_head': {
            'calendar': '日历',
            'review': '回顾',
            'app': '应用',
            'storage': '文件',
            'support': '帮助',
            'client': '客户',
            'deal': '业务',
            'case': '事件'
        },
        'component_window': {
            'common': {
                'button_save': '保存',
                'button_cancel': '取消',
                'button_delete': '删除',
                'font_or': '或者',
                'font_delete': '删除这条数据',
                'title_delete_confirm': '这项操作将彻底删除该数据，并且不可恢复。'
            },
            'settings': {
                'profile': '个人档案',
                'avatar': '更改头像',
                'i18n': '我的语言和时区',
                'system': '系统设置',
                'signout': '退出',
                'profile_email': '您的邮件地址',
                'profile_name': '您的姓名',
                'profile_intro': '个人简介',
                'profile_password': '新的密码',
                'profile_password_default': '如果您不希望修改密码请保持此处空白',
                'avatar_title': '请上传您的头像',
                'avatar_preview': '您的头像预览',
                'locale_language': '系统语言',
                'locale_timezone': '系统时区',
                'system_name': '团队名称',
                'system_members': '团队成员',
                'system_members_invite_input_name': '被邀请人姓名',
                'system_members_invite_input_email': '被邀请人邮件地址',
                'system_members_invite_button': '发出邀请',
                'system_members_delete': '这项操作将停用该帐号，并且不可恢复。',
                'system_members_resetPassword': '这项操作将自动重设该帐号的密码，并且将新密码通过邮件发送到帐号所对应的电子邮件地址。',
                'system_members_administrator_true': '这项操作将赋予该帐号完整的管理员权限。',
                'system_members_administrator_false': '这项操作将取消该帐号完整的管理员权限。',
                'system_members_block_true': '这项操作将禁止该帐号在任何设备上的登录权限。',
                'system_members_block_false': '这项操作将恢复该帐号在任何设备上的登录权限。'
            },
            'calendar': {
                'basic': '基本信息',
                'theme': '事件样式',
                'event_name': '事件标题',
                'event_start': '开始时间',
                'event_end': '结束时间',
                'event_fullday': '全天事件',
                'event_intro': '事件描述',
                'event_class': '事件级别',
                'event_class_important_emergency': '重要并且紧急',
                'event_class_important': '重要但不紧急',
                'event_class_emergency': '紧急但不重要',
                'event_class_common': '不重要不紧急',
                'event_class_personal': '私人事件',
                'event_class_other': '其他事件',
                'event_permission': '事件权限',
                'event_owner': '事件归属',
                'event_public': '公开',
                'event_private': '私有',
                'event_toolbar_bold': '粗体',
                'event_toolbar_italic': '斜体',
                'event_toolbar_h1': '标题',
                'event_toolbar_p': '段落',
                'event_toolbar_list_unordered': '无序列表',
                'event_toolbar_list_ordered': '有序列表'
            }
        }
    }
});