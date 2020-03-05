"use strict";
(function(window, doc) {
    window.ContextMenu = window.ContextMenu ? window.ContextMenu : {};
    var createMenuItem = function(id, name, callback,seatno) {
        var menuItem = doc.createElement("div");
        menuItem.setAttribute("class", "web-context-menu-item");
        menuItem.setAttribute("id", id);
        var span = doc.createElement("span");
        span.setAttribute("class", "menu-item-name");
        span.innerText = name;
        if (callback && typeof callback === 'function') {
            span.addEventListener("click", function(){
                callback.call(this,seatno);
            });
        }
        var i = doc.createElement("i");
        i.innerText = "▲";
        span.appendChild(i);
        var subContainer = doc.createElement("div");
        subContainer.setAttribute("class", "web-context-menu-items");
        menuItem.appendChild(span);
        menuItem.appendChild(subContainer);
        return menuItem;
    };
    var createLine = function() {
        var line = doc.createElement("div");
        line.setAttribute("class", "menu-item-line");
        return line;
    };
    var createMenu = function(index, menuArr) {
        var menu = doc.createElement("div");
        menu.setAttribute("class", "web-context-menu");
        menu.setAttribute("id", "web-context-menu-" + index);
        // doc.querySelector("body").appendChild(menu);
        $("body")[0].appendChild(menu);
        var menuItemsContainer = doc.createElement("div");
        menuItemsContainer.setAttribute("class", "web-context-menu-items");
        menu.appendChild(menuItemsContainer);
        for (var i = 0; i < menuArr.length; i++) {
            var menuItem = menuArr[i];
            var parent = menuItem.parent;
            var oneMenu = createMenuItem(menuItem.id, menuItem.name, menuItem.callback,menuItem.seatno);
            if (!parent) {
                menuItemsContainer.appendChild(oneMenu);
                menuItemsContainer.appendChild(createLine());
            } else {
                // var parentNode = doc.querySelector("#" + parent + " .web-context-menu-items");
                var parentNode = $("#" + parent + " .web-context-menu-items")[0];
                parentNode.appendChild(oneMenu);
                parentNode.appendChild(createLine());
            }
        }
        var allContainer = menu.querySelectorAll(".web-context-menu-items");
        for (var i = 0; i < allContainer.length; i++) {
            var oneContainer = allContainer[i];
            if (!oneContainer.hasChildNodes()) {
                var iTag = oneContainer.parentElement.querySelector("i")
                iTag.parentElement.removeChild(iTag);
            }
        }
    }
    var showMenu = function(event, menu) {
        menu.style.display = "block";
        var x = event.clientX;
        var y = event.clientY;
        if (y + menu.clientHeight > window.innerHeight) {
            y -= menu.clientHeight;
        }
        if (x + menu.clientWidth > window.innerWidth) {
            x -= menu.clientWidth;
        }
        menu.style.left = x + "px";
        menu.style.top = y + "px";
    };
    ContextMenu.bind = function(selector, menuArr) {
        // var obj = doc.querySelector(selector);
        var obj = $(selector)[0];
        obj.oncontextmenu = function(event) {
            var pageMenus = doc.querySelectorAll(".web-context-menu");
            if (pageMenus) {
                for (var i = 0; i < pageMenus.length; i++) {
                    pageMenus[i].style.display = "none";
                }
            }
            var index = 0;
            var dataMenuIndex = this.getAttribute("data-menu-index");
            if (dataMenuIndex) {
                index = dataMenuIndex;
            } else {
                var allMenu = doc.querySelectorAll(".web-context-menu");
                if (allMenu && allMenu.length) {
                    index = allMenu.length;
                }
                this.setAttribute("data-menu-index", index);
            }
            // var menu = doc.querySelector("#web-context-menu-" + index);
            var menu = $("#web-context-menu-" + index)[0];
            if (!menu || menu.length < 1) {
                createMenu(index, menuArr);
                // menu = doc.querySelector("#web-context-menu-" + index);
                menu = $("#web-context-menu-" + index)[0];
            }
            showMenu(event, menu);
            doc.addEventListener("click", function(e) {
                menu.style.display = "none";
            });
            return false;
        }
        ;
        return false;
    }
    ;
}
)(window, document);
