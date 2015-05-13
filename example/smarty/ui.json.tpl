{
    "button": {
        "id": "button",
        "type": "Button",
        "text": "this is a button"
    },
    "textbox": {
        "id": "textbox",
        "type": "TextBox",
        "placeholder": "this is a textbox"
    },
    "select": {
        "id": "select",
        "type": "Select",
        "emptyText": "select a type"
    },
    "tab": {
        "id": "tab",
        "type": "Tab",
        "plugins": ["TabBar"],
        "datasource": [
            {
                "text": "CSS控件",
                "panel": "#panel1"
            },
            {
                "text": "UI控件拆分",
                "panel": "#panel2"
            },
            {
                "text": "UI栅格化设计",
                "panel": "#panel3"
            },
            {
                "text": "新UI设计规范",
                "panel": "#panel4"
            }
        ],
        "activeIndex": 1
    },
    "rating": {
        "id": "rating",
        "type": "Rating",
        "max": 5,
        "value": 2
    },
    "boxGroup": {
        "id": "boxGroup",
        "type": "BoxGroup",
        "boxType": "radio",
        "styleClass": "radio-point",
        "datasource": [
            {
                "value": 0,
                "name": "不限"
            },
            {
                "value": 1,
                "name": "中关村-上地"
            },
            {
                "value": 2,
                "name": "亚运村"
            },
            {
                "value": 3,
                "name": "北京南站商圈超长"
            }
        ],
        "value": [1,2]
    },
    "pager": {
        "id": "pager",
        "type": "Pager",
        "page": 5,
        "first": 1,
        "total": 10,
        "showCount": 5
    }
}
