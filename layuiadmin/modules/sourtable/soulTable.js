layui.define(["table", "tableFilter", "tableChild", "tableMerge"], function(exports) {
    var tableFilter = layui.tableFilter
      , tableChild = layui.tableChild
      , tableMerge = layui.tableMerge
      , $ = layui.$
      , table = layui.table
      , HIDE = "layui-hide"
      , isFirst = !0
      , mod = {
        render: function(e) {
            var t = localStorage.getItem(location.pathname + location.hash + e.id);
            e.filter && e.filter.cache && isFirst && t ? (e.cols = this.deepParse(t),
            isFirst = !1,
            table.reload(e.id, e)) : (tableFilter.render(e),
            tableChild.render(e),
            tableMerge.render(e),
            e.fixTotal && this.fixTotal(e),
            (void 0 === e.drag || e.drag) && this.drag(e),
            e.rowDrag && this.rowDrag(e),
            (void 0 === e.autoColumnWidth || e.autoColumnWidth) && this.autoColumnWidth(e),
            this.contextmenu(e),
            (void 0 === e.fixResize || e.fixResize) && this.fixResizeRightFixed(e),
            e.overflow && this.overflow(e),
            this.fixFixedScroll(e))
        },
        export: function(e, t) {
            tableFilter.export(e.config || e, t)
        },
        getCssRule: function(e, i, l) {
            var t = e.elem.next().find("style")[0]
              , a = t.sheet || t.styleSheet || {}
              , n = a.cssRules || a.rules;
            layui.each(n, function(e, t) {
                if (t.selectorText === ".laytable-cell-" + i)
                    return l(t),
                    !0
            })
        },
        autoColumnWidth: function(l) {
            var s = this
              , e = $(l.elem)
              , t = e.next().children(".layui-table-box").children(".layui-table-header").children("table").children("thead").children("tr").children("th")
              , i = e.next().children(".layui-table-box").children(".layui-table-fixed").children(".layui-table-header").children("table").children("thead").children("tr").children("th")
              , c = e.next().children(".layui-table-box").children(".layui-table-body").children("table").children("tbody").children("tr");
            function a(e, t, i) {
                var l = t.data("field")
                  , a = t.data("key");
                if (!(1 < t.attr("colspan")) && i) {
                    var n = t.text().width(t.css("font")) + 21
                      , o = t.css("font");
                    c.children('td[data-field="' + l + '"]').each(function(e, t) {
                        var i = $(this).text().width(o);
                        n < i && (n = i)
                    }),
                    n += 32,
                    s.getCssRule(e, a, function(e) {
                        e.style.width = n + "px"
                    });
                    for (var r = 0; r < e.cols.length; r++)
                        for (var d = 0; d < e.cols[r].length; d++)
                            if (e.cols[r][d].field === l) {
                                e.cols[r][d].width = n;
                                break
                            }
                }
            }
            String.prototype.width = function(e) {
                var t = e || $("body").css("font")
                  , i = $("<div>" + this + "</div>").css({
                    position: "absolute",
                    float: "left",
                    "white-space": "nowrap",
                    visibility: "hidden",
                    font: t
                }).appendTo($("body"))
                  , l = i.width();
                return i.remove(),
                l
            }
            ,
            (void 0 === l.autoColumnWidth || void 0 === l.autoColumnWidth.dblclick || l.autoColumnWidth.dblclick) && t.add(i).on("dblclick", function(e) {
                var t = $(this)
                  , i = e.clientX - t.offset().left;
                a(l, t, 0 < t.parents(".layui-table-fixed-r").length ? i <= 10 : t.width() - i <= 10)
            }),
            l.autoColumnWidth && l.autoColumnWidth.init && t.add(i).each(function(e) {
                Array.isArray(l.autoColumnWidth.init) && -1 === l.autoColumnWidth.init.indexOf($(this).attr("data-field")) || a(l, $(this), !0)
            })
        },
        drag: function(F) {
            if (!(1 < F.cols.length)) {
                var R = this
                  , e = $(F.elem)
                  , W = e.next().children(".layui-table-box")
                  , s = $.merge(W.children(".layui-table-header").children("table"), W.children(".layui-table-fixed").children(".layui-table-header").children("table"))
                  , z = W.children(".layui-table-fixed").children(".layui-table-body").children("table")
                  , c = W.children(".layui-table-body").children("table")
                  , T = $.merge(W.children(".layui-table-body").children("table"), z)
                  , X = e.next().children(".layui-table-total").children("table")
                  , E = e.next().children(".layui-table-total").children("table.layui-table-total-fixed")
                  , h = e.next().children(".layui-table-total").children("table:eq(0)")
                  , D = F.id
                  , _ = "simple" === F.drag || F.drag && "simple" === F.drag.type
                  , N = F.drag && F.drag.toolbar
                  , O = !1
                  , P = !1;
                if (!s.attr("drag")) {
                    if (s.attr("drag", !0),
                    N) {
                        W.append('<div class="soul-drag-bar"><div data-type="left">左固定</div><div data-type="none">不固定</div><div data-type="right">右固定</div></div>');
                        var q = W.children(".soul-drag-bar");
                        q.children("div").on("mouseenter", function() {
                            $(this).addClass("active")
                        }).on("mouseleave", function() {
                            $(this).removeClass("active")
                        })
                    }
                    s.find("th").each(function() {
                        var k = $(this)
                          , w = k.data("field")
                          , S = k.data("key");
                        if (S) {
                            var e = S.split("-")
                              , d = F.cols[e[1]][e[2]]
                              , C = e[1] + "-" + e[2]
                              , I = 0 < k.parents(".layui-table-fixed").length;
                            $(this).find("span:first,.laytable-cell-checkbox").css("cursor", "move").on("mousedown", function(e) {
                                if (0 === e.button) {
                                    e.preventDefault();
                                    var b = k.clone().css("visibility", "hidden")
                                      , t = k.position().left
                                      , y = k.offset().top
                                      , v = e.clientX - t
                                      , x = k.parents("tr:eq(0)").css("background-color")
                                      , m = k.width()
                                      , r = $(this)
                                      , g = d.fixed;
                                    P = !0,
                                    $(document).bind("selectstart", function() {
                                        return !1
                                    }),
                                    $("body").on("mousemove", function(e) {
                                        if (P && b) {
                                            W.removeClass("no-left-border"),
                                            O || (N && (q.attr("data-type", g || "none"),
                                            q.addClass("active")),
                                            k.after(b),
                                            k.addClass("isDrag").css({
                                                position: "absolute",
                                                "z-index": 1,
                                                "border-left": "1px solid #e6e6e6",
                                                "background-color": x,
                                                width: m + 1
                                            }),
                                            _ || ((I ? z : T).find('td[data-key="' + S + '"]').each(function() {
                                                $(this).after($(this).clone().css("visibility", "hidden").attr("data-clone", "")),
                                                $(this).addClass("isDrag").css({
                                                    position: "absolute",
                                                    "z-index": 1,
                                                    "border-left": "1px solid #e6e6e6",
                                                    "background-color": $(this).css("background-color"),
                                                    width: m + 1
                                                })
                                            }),
                                            0 < X.length && (I ? E : X).find('td[data-key="' + S + '"]').each(function() {
                                                $(this).after($(this).clone().css("visibility", "hidden").attr("data-clone", "")),
                                                $(this).addClass("isDrag").css({
                                                    position: "absolute",
                                                    "z-index": 1,
                                                    "background-color": $(this).parents("tr:eq(0)").css("background-color"),
                                                    width: m + 1
                                                })
                                            }))),
                                            O = !0;
                                            var t, i, l, a, n, o = e.clientX - v, r = b.prev().prev(), d = 0 < r.length, s = d ? r.data("key").split("-") : [], c = b.next().hasClass("layui-table-patch") ? [] : b.next(), h = 0 < c.length, u = h ? c.data("key").split("-") : [], f = d && b.position().left - o > r.width() / 2, p = h && o - b.position().left > c.width() / 2;
                                            if (Math.abs(b.position().left - o),
                                            0 < b.position().left - o ? !d || !!g != !!F.cols[s[1]][s[2]].fixed : !h || !!g != !!F.cols[u[1]][u[2]].fixed)
                                                return k.css("left", b.position().left),
                                                T.find('td[data-key="' + S + '"][data-clone]').each(function(e) {
                                                    $(this).prev().css("left", b.position().left)
                                                }),
                                                0 < X.length && X.find('td[data-key="' + S + '"][data-clone]').each(function(e) {
                                                    $(this).prev().css("left", b.position().left)
                                                }),
                                                void W.addClass("no-left-border");
                                            if (k.css("left", o),
                                            f) {
                                                for (b.after(r),
                                                $("#soul-columns" + D + ">li[data-value=" + w + "]").after($("#soul-columns" + D + ">li[data-value=" + w + "]").prev()),
                                                l = 0; l < F.cols.length; l++) {
                                                    for (a = 0; a < F.cols[l].length; a++)
                                                        if (F.cols[l][a].key === C) {
                                                            t = l,
                                                            i = a;
                                                            break
                                                        }
                                                    if (void 0 !== t && void 0 !== i)
                                                        break
                                                }
                                                n = F.cols[t][i - 1],
                                                F.cols[t][i - 1] = F.cols[t][i],
                                                F.cols[t][i] = n,
                                                F.filter && F.filter.cache && localStorage.setItem(location.pathname + location.hash + F.id, R.deepStringify(F.cols))
                                            } else if (p) {
                                                for (b.prev().before(c),
                                                $("#soul-columns" + D + ">li[data-value=" + w + "]").before($("#soul-columns" + D + ">li[data-value=" + w + "]").next()),
                                                l = 0; l < F.cols.length; l++) {
                                                    for (a = 0; a < F.cols[l].length; a++)
                                                        if (F.cols[l][a].key === C) {
                                                            t = l,
                                                            i = a;
                                                            break
                                                        }
                                                    if (void 0 !== t && void 0 !== i)
                                                        break
                                                }
                                                n = F.cols[t][i + 1],
                                                F.cols[t][i + 1] = F.cols[t][i],
                                                F.cols[t][i] = n,
                                                F.filter && F.filter.cache && localStorage.setItem(location.pathname + location.hash + F.id, R.deepStringify(F.cols))
                                            }
                                            T.find('td[data-key="' + S + '"][data-clone]').each(function() {
                                                $(this).prev().css("left", o),
                                                f ? 0 !== $(this).prev().prev().length && $(this).after($(this).prev().prev()) : p && 0 !== $(this).next().length && $(this).prev().before($(this).next())
                                            }),
                                            0 < X.length && X.find('td[data-key="' + S + '"][data-clone]').each(function() {
                                                $(this).prev().css("left", o),
                                                f ? 0 !== $(this).prev().prev().length && $(this).after($(this).prev().prev()) : p && 0 !== $(this).next().length && $(this).prev().before($(this).next())
                                            }),
                                            e.clientY - y < -15 ? (0 === $("#column-remove").length && $("body").append('<i id="column-remove" class="layui-red layui-icon layui-icon-delete"></i>'),
                                            $("#column-remove").css({
                                                top: e.clientY - $("#column-remove").height() / 2,
                                                left: e.clientX - $("#column-remove").width() / 2,
                                                "font-size": y - e.clientY + "px"
                                            }),
                                            $("#column-remove").show()) : $("#column-remove").hide()
                                        }
                                    }).on("mouseup", function() {
                                        if ($(document).unbind("selectstart"),
                                        $("body").off("mousemove").off("mouseup"),
                                        P && b) {
                                            if (P = !1,
                                            O) {
                                                "checkbox" !== d.type && r.on("click", function(e) {
                                                    e.stopPropagation()
                                                }),
                                                O = !1,
                                                W.removeClass("no-left-border"),
                                                k.removeClass("isDrag").css({
                                                    position: "relative",
                                                    "z-index": "inherit",
                                                    left: "inherit",
                                                    "border-left": "inherit",
                                                    width: "inherit",
                                                    "background-color": "inherit"
                                                }),
                                                k.next().remove();
                                                var t = k.prev().data("key");
                                                if (g) {
                                                    var e = W.children(".layui-table-header").children("table").find('th[data-key="' + S + '"]');
                                                    t ? e.parent().children('th[data-key="' + t + '"]').after(e) : "right" === g ? 0 < k.siblings().length && W.children(".layui-table-header").children("table").find('th[data-key="' + k.next().data("key") + '"]').prev().after(e) : (e.parent().prepend('<th class="layui-hide"></th>'),
                                                    e.parent().children("th:first").after(e),
                                                    e.parent().children("th:first").remove())
                                                }
                                                if (_ ? (T.find('td[data-key="' + S + '"]').each(function() {
                                                    if (t)
                                                        $(this).parent().children('td[data-key="' + t + '"]').after($(this));
                                                    else if ("right" === g) {
                                                        if (0 < k.siblings().length) {
                                                            var e = $(this).parent().children('td[data-key="' + k.next().data("key") + '"]').prev();
                                                            0 < e.length ? e.after($(this)) : ($(this).parent().prepend('<td class="layui-hide"></td>'),
                                                            $(this).parent().children("td:first").after($(this)),
                                                            $(this).parent().children("td:first").remove())
                                                        }
                                                    } else
                                                        $(this).parent().prepend('<td class="layui-hide"></td>'),
                                                        $(this).parent().children("td:first").after($(this)),
                                                        $(this).parent().children("td:first").remove()
                                                }),
                                                0 < X.length && X.find('td[data-key="' + S + '"]').each(function() {
                                                    if (t)
                                                        $(this).parent().children('td[data-key="' + t + '"]').after($(this));
                                                    else if ("right" === g) {
                                                        var e = $(this).parent().children('td[data-key="' + k.next().data("key") + '"]').prev();
                                                        0 < e.length ? e.after($(this)) : ($(this).parent().prepend('<td class="layui-hide"></td>'),
                                                        $(this).parent().children("td:first").after($(this)),
                                                        $(this).parent().children("td:first").remove())
                                                    } else
                                                        $(this).parent().prepend('<td class="layui-hide"></td>'),
                                                        $(this).parent().children("td:first").after($(this)),
                                                        $(this).parent().children("td:first").remove()
                                                })) : I ? (c.find('td[data-key="' + S + '"]').each(function() {
                                                    if (t)
                                                        $(this).parent().children('td[data-key="' + t + '"]').after($(this));
                                                    else if ("right" === g) {
                                                        if (0 < k.siblings().length) {
                                                            var e = $(this).parent().children('td[data-key="' + k.next().data("key") + '"]').prev();
                                                            0 < e.length ? e.after($(this)) : ($(this).parent().prepend('<td class="layui-hide"></td>'),
                                                            $(this).parent().children("td:first").after($(this)),
                                                            $(this).parent().children("td:first").remove())
                                                        }
                                                    } else
                                                        $(this).parent().prepend('<td class="layui-hide"></td>'),
                                                        $(this).parent().children("td:first").after($(this)),
                                                        $(this).parent().children("td:first").remove()
                                                }),
                                                z.find('td[data-key="' + S + '"][data-clone]').each(function() {
                                                    $(this).prev().removeClass("isDrag").css({
                                                        position: "relative",
                                                        "z-index": "inherit",
                                                        left: "inherit",
                                                        "border-left": "inherit",
                                                        width: "inherit",
                                                        "background-color": "inherit"
                                                    }),
                                                    $(this).remove()
                                                }),
                                                0 < X.length && (h.find('td[data-key="' + S + '"]').each(function() {
                                                    if (t)
                                                        $(this).parent().children('td[data-key="' + t + '"]').after($(this));
                                                    else if ("right" === g) {
                                                        var e = $(this).parent().children('td[data-key="' + k.next().data("key") + '"]').prev();
                                                        0 < e.length ? e.after($(this)) : ($(this).parent().prepend('<td class="layui-hide"></td>'),
                                                        $(this).parent().children("td:first").after($(this)),
                                                        $(this).parent().children("td:first").remove())
                                                    } else
                                                        $(this).parent().prepend('<td class="layui-hide"></td>'),
                                                        $(this).parent().children("td:first").after($(this)),
                                                        $(this).parent().children("td:first").remove()
                                                }),
                                                E.find('td[data-key="' + S + '"][data-clone]').each(function() {
                                                    $(this).prev().removeClass("isDrag").css({
                                                        position: "relative",
                                                        "z-index": "inherit",
                                                        left: "inherit",
                                                        width: "inherit",
                                                        "background-color": "inherit"
                                                    }),
                                                    $(this).remove()
                                                }))) : (T.find('td[data-key="' + S + '"][data-clone]').each(function() {
                                                    $(this).prev().removeClass("isDrag").css({
                                                        position: "relative",
                                                        "z-index": "inherit",
                                                        left: "inherit",
                                                        width: "inherit",
                                                        "background-color": "inherit"
                                                    }),
                                                    $(this).remove()
                                                }),
                                                0 < X.length && X.find('td[data-key="' + S + '"][data-clone]').each(function() {
                                                    $(this).prev().removeClass("isDrag").css({
                                                        position: "relative",
                                                        "z-index": "inherit",
                                                        left: "inherit",
                                                        width: "inherit",
                                                        "background-color": "inherit"
                                                    }),
                                                    $(this).remove()
                                                })),
                                                b = null,
                                                N) {
                                                    if (0 < q.children(".active").length && q.children(".active").attr("data-type") !== q.attr("data-type")) {
                                                        var i, l, a, n, o = q.children(".active").attr("data-type");
                                                        for (i = 0; i < F.cols.length; i++)
                                                            for (l = 0; l < F.cols[i].length; l++)
                                                                "right" === o || "none" === o && "right" === q.attr("data-type") ? void 0 === n && ("right" === F.cols[i][l].fixed ? n = {
                                                                    x: i,
                                                                    y: l
                                                                } : l === F.cols[i].length - 1 && (n = {
                                                                    x: i,
                                                                    y: l + 1
                                                                })) : void 0 !== n || F.cols[i][l].fixed && "right" !== F.cols[i][l].fixed || (n = {
                                                                    x: i,
                                                                    y: l
                                                                }),
                                                                F.cols[i][l].key === C && (a = {
                                                                    x: i,
                                                                    y: l
                                                                });
                                                        d.fixed = "none" !== o && o,
                                                        a.y !== n.y && (F.cols[a.x].splice(a.y, 1),
                                                        a.y < n.y && (n.y -= 1),
                                                        F.cols[n.x].splice(n.y, 0, d),
                                                        F.filter && F.filter.cache && localStorage.setItem(location.pathname + location.hash + F.id, R.deepStringify(F.cols))),
                                                        table.reload(D)
                                                    }
                                                    q.removeClass("active")
                                                }
                                            } else
                                                r.unbind("click");
                                            $("#column-remove").is(":visible") && (s.find("thead>tr>th[data-key=" + S + "]").addClass(HIDE),
                                            T.find('tbody>tr>td[data-key="' + S + '"]').addClass(HIDE),
                                            X.find('tbody>tr>td[data-key="' + S + '"]').addClass(HIDE),
                                            d.hide = !0,
                                            F.filter && F.filter.cache && localStorage.setItem(location.pathname + location.hash + F.id, R.deepStringify(F.cols)),
                                            $("#soul-columns" + D).find('li[data-value="' + w + '"]>input').prop("checked", !1),
                                            tableFilter.resize(F)),
                                            $("#column-remove").hide()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        },
        rowDrag: function(s) {
            var v = this
              , x = $(s.elem)
              , m = x.next().children(".layui-table-box")
              , i = m.children(".layui-table-fixed").children(".layui-table-body").children("table")
              , l = m.children(".layui-table-body").children("table")
              , e = $.merge(m.children(".layui-table-body").children("table"), i)
              , c = s.id
              , g = !1
              , a = s.rowDrag.trigger || "row"
              , t = "row" === a ? e.children("tbody").children("tr") : e.find(a)

              ,autosortList = s.rowDrag.autosortList || [];

            "row" !== a && e.find(a).css("cursor", "move"),
            t.on("mousedown", function(e) {

                if (autosortList.size!=0){
                    var id = $(e.currentTarget).parent().parent().parent().attr("id");
                    if(!autosortList.has(+id)){
                        // console.log(id,autosortList)
                        return;
                    }
                }
                
                if (0 === e.button) {
                    var r = "row" === a ? $(this) : $(this).parents("tr:eq(0)")
                      , d = parseInt(r.data("index"))
                      , u = l.children("tbody").children("tr[data-index=" + d + "]")
                      , f = u.clone().css("visibility", "hidden")
                      , p = i.children("tbody").children("tr[data-index=" + d + "]")
                      , b = m.children(".layui-table-body").scrollTop()
                      , t = r.position().top
                      , y = e.clientY - t;
                    $("body").on("mousemove", function(e) {
                        if (!g) {
                            g = !0;
                            var t = x.next().find("style")[0]
                              , i = t.sheet || t.styleSheet || {};
                            v.addCSSRule(i, ".layui-table-view .layui-table td", "cursor: move"),
                            v.addCSSRule(i, ".layui-table tr", "transition: none"),
                            m.addClass("noselect"),
                            u.after(f),
                            u.css({
                                position: "absolute",
                                "z-index": 1
                            }),
                            p.each(function() {
                                $(this).after($(this).clone().css("visibility", "hidden")),
                                $(this).css({
                                    position: "absolute",
                                    "z-index": 102
                                })
                            })
                        }
                        var l = e.clientY - y + (m.children(".layui-table-body").scrollTop() - b)
                          , a = f.position().top
                          , n = u.prev()
                          , o = 0 < n.length
                          , r = f.next()
                          , d = 0 < r.length
                          , s = o && a - l > n.height() / 2
                          , c = d && l - a > r.height() / 2;
                        if (0 < a - l ? !o : !d)
                            return u.css("top", a),
                            void p.each(function() {
                                $(this).css("top", a)
                            });
                        function h(e, t) {
                            var i = parseInt(e.data("index")) + t;
                            return e.data("index", i),
                            e.attr("data-index", i),
                            e
                        }
                        u.css("top", l),
                        p.each(function() {
                            $(this).css("top", l)
                        }),
                        s ? (h(u, -1),
                        f.after(h(n, 1)),
                        p.each(function() {
                            h($(this), -1),
                            $(this).next().after(h($(this).prev(), 1))
                        })) : c && (h(u, 1).before(h(r, -1)),
                        p.each(function() {
                            h($(this), 1),
                            $(this).before(h($(this).next().next(), -1))
                        }))
                    }).on("mouseup", function(e) {
                        if ($("body").off("mousemove").off("mouseup"),
                        g) {
                            g = !1,
                            m.removeClass("noselect"),
                            u.css({
                                position: "inherit",
                                "z-index": "inherit"
                            }),
                            u.next().remove(),
                            p.each(function() {
                                $(this).css({
                                    position: "inherit",
                                    "z-index": "inherit"
                                }),
                                $(this).next().remove()
                            });
                            var t = x.next().find("style")[0]
                              , i = t.sheet || t.styleSheet || {}
                              , l = i.cssRules || i.rules;
                            layui.each(l, function(e, t) {
                                ".layui-table-view .layui-table td" === t.selectorText && (t.style.cursor = "default")
                            });
                            var a = r.index();
                            if (a !== d && "function" == typeof s.rowDrag.done) {
                                var n = layui.table.cache[c]
                                  , o = n.splice(d, 1)[0];
                                n.splice(a, 0, o),
                                s.rowDrag.done.call(s, {
                                    row: o,
                                    newIndex: a,
                                    oldIndex: d,
                                    cache: n
                                })
                            }
                        }
                    })
                }
            })
        },
        fixTableRemember: function(e, t) {
            e.filter && e.filter.cache && (t && t.rule && (e.cols[t.rule.selectorText.split("-")[3]][t.rule.selectorText.split("-")[4]].width = t.rule.style.width.replace("px", "")),
            localStorage.setItem(location.pathname + location.hash + e.id, this.deepStringify(e.cols)))
        },
        overflow: function(e) {
            var t = {};
            if ("string" == typeof e.overflow)
                t = {
                    type: e.overflow
                };
            else {
                if ("object" != typeof e.overflow)
                    return;
                t = e.overflow
            }
            var n, o, i = $(e.elem).next().find(".layui-table-body"), l = t.hoverTime || 0, r = t.color || "white", d = t.bgColor || "black", s = t.minWidth || 300, c = t.maxWidth || 300;
            if ("tips" === t.type) {
                function a(e) {
                    clearTimeout(o);
                    var t = $(this)
                      , i = t.children(".layui-table-cell")
                      , l = i.outerWidth()
                      , a = l < s ? s : c < l ? c : l;
                    t.data("off") || (e ? layer.close(n) : i.prop("scrollWidth") > l && (n = layer.tips('<span style="color: ' + r + '">' + $(this).text() + "</span>", this, {
                        tips: [1, d],
                        maxWidth: a,
                        time: 0
                    })))
                }
                i.off("mouseenter", "td").on("mouseenter", "td", function() {
                    var e = this;
                    o = setTimeout(function() {
                        a.call(e)
                    }, l)
                }).on("mouseleave", "td", function() {
                    a.call(this, "hide")
                })
            } else
                "title" === t.type && i.off("mouseenter", "td").on("mouseenter", "td", function() {
                    var e = $(this)
                      , t = e.children(".layui-table-cell");
                    e.data("off") || t.prop("scrollWidth") > t.outerWidth() && t.attr("title", $(this).text())
                })
        },
        contextmenu: function(h) {
            for (var e = $(h.elem), t = e.next().children(".layui-table-box"), i = $.merge(t.children(".layui-table-header").children("table"), t.children(".layui-table-fixed").children(".layui-table-header").children("table")), l = t.children(".layui-table-fixed").children(".layui-table-body").children("table"), a = $.merge(t.children(".layui-table-body").children("table"), l), n = e.next().children(".layui-table-total").children("table"), u = h.id, o = {
                header: {
                    box: i,
                    tag: "th",
                    opts: h.contextmenu ? h.contextmenu.header : "",
                    cols: {}
                },
                body: {
                    box: a,
                    tag: "td",
                    opts: h.contextmenu ? h.contextmenu.body : "",
                    cols: {},
                    isBody: !0
                },
                total: {
                    box: n,
                    tag: "td",
                    opts: h.contextmenu ? h.contextmenu.total : "",
                    cols: {}
                }
            }, r = !1, d = 0; d < h.cols.length; d++)
                for (var s = 0; s < h.cols[d].length; s++)
                    h.cols[d][s].contextmenu && (r = !0,
                    o.header.cols[h.cols[d][s].key] = h.cols[d][s].contextmenu.header,
                    o.body.cols[h.cols[d][s].key] = h.cols[d][s].contextmenu.body,
                    o.total.cols[h.cols[d][s].key] = h.cols[d][s].contextmenu.total);
            if (h.contextmenu || r) {
                for (var c in o)
                    !function(i) {
                        o[i].box.find(o[i].tag).on("contextmenu", function(e) {
                            $("#soul-table-contextmenu-wrapper").remove(),
                            $("body").append('<div id="soul-table-contextmenu-wrapper"></div>'),
                            $("#soul-table-contextmenu-wrapper").on("click", function(e) {
                                e.stopPropagation()
                            });
                            var t = o[i].cols[$(this).data("key").substr($(this).data("key").indexOf("-") + 1)];
                            return !1 !== t && (t && 0 < t.length ? (f($("#soul-table-contextmenu-wrapper"), e.clientX, e.clientY, t, $(this), o[i].box, o[i].tag, o[i].isBody),
                            !1) : !1 !== o[i].opts && (o[i].opts && 0 < o[i].opts.length ? (f($("#soul-table-contextmenu-wrapper"), e.clientX, e.clientY, o[i].opts, $(this), o[i].box, o[i].tag, o[i].isBody),
                            !1) : void 0))
                        })
                    }(c);
                $("body").on("click", function() {
                    $("#soul-table-contextmenu-wrapper").remove()
                })
            }
            function f(e, t, i, l, o, r, d, s) {
                var a, n = [];
                for (n.push('<ul class="soul-table-contextmenu">'),
                a = 0; a < l.length; a++)
                    n.push('<li data-index="' + a + '" class="' + (l[a].children && 0 < l[a].children.length ? "contextmenu-children" : "") + '">'),
                    l[a].icon ? n.push('<i class="prefixIcon ' + l[a].icon + '" />') : n.push('<i class="prefixIcon" />'),
                    n.push(l[a].name),
                    l[a].children && 0 < l[a].children.length && n.push('<i class="endIcon layui-icon layui-icon-right" />'),
                    n.push("</li>");
                n.push("</ul>"),
                e.append(n.join(""));
                var c = e.children().last();
                for (i + c.outerHeight() > $("body").prop("scrollHeight") && (i -= c.outerHeight()) < 0 && (i = 0),
                "left" === e.parent().data("direction") && 0 < e.offset().left - c.outerWidth() ? (t = -c.outerWidth(),
                c.data("direction", "left")) : t + c.outerWidth() + e.offset().left > $("body").prop("scrollWidth") && ((t = t - c.outerWidth() - e.outerWidth()) + e.offset().left < 0 && (t = -e.offset().left),
                c.data("direction", "left")),
                c.css({
                    top: i + "px",
                    left: t + "px"
                }),
                a = 0; a < l.length; a++)
                    "function" == typeof l[a].click && function(t) {
                        e.children(".soul-table-contextmenu:last").children('li[data-index="' + t + '"]').on("click", function() {
                            var e = o.parents("tr:eq(0)").data("index")
                              , a = r.find('tr[data-index="' + e + '"]')
                              , n = layui.table.cache[u][e];
                            l[t].click.call(h, {
                                cell: o,
                                elem: "th" === d ? o : s ? r.children("tbody").children('tr[data-index="' + e + '"]').children('[data-key="' + o.data("key") + '"]') : r.find('[data-key="' + o.data("key") + '"]'),
                                trElem: r.children("tbody").children('tr[data-index="' + e + '"]'),
                                text: o.text(),
                                field: o.data("field"),
                                del: s ? function() {
                                    table.cache[u][e] = [],
                                    a.remove(),
                                    table.resize(u)
                                }
                                : "",
                                update: s ? function(e) {
                                    e = e || {},
                                    layui.each(e, function(i, e) {
                                        if (i in n) {
                                            var l, t = a.children('td[data-field="' + i + '"]');
                                            n[i] = e,
                                            table.eachCols(u, function(e, t) {
                                                t.field == i && t.templet && (l = t.templet)
                                            }),
                                            t.children(".layui-table-cell").html(l ? "function" == typeof l ? l(n) : layui.laytpl($(l).html() || e).render(n) : e),
                                            t.data("content", e)
                                        }
                                    })
                                }
                                : "",
                                row: s ? n : {}
                            }),
                            $("#soul-table-contextmenu-wrapper").remove()
                        })
                    }(a);
                e.children(".soul-table-contextmenu:last").children("li").on("mouseenter", function(e) {
                    e.stopPropagation(),
                    $(this).siblings(".contextmenu-children").children("ul").remove(),
                    $(this).hasClass("contextmenu-children") && f($(this), $(this).outerWidth(), $(this).position().top, l[$(this).data("index")].children, o, r, d, s)
                })
            }
        },
        fixTotal: function(e) {
            var t = $(e.elem)
              , i = t.next().children(".layui-table-total")
              , l = t.next().find("style")[0]
              , a = l.sheet || l.styleSheet || {};
            if (0 < i.length) {
                var n = t.next().children(".layui-table-box")
                  , o = n.children(".layui-table-fixed-l").children(".layui-table-body").children("table").children("tbody").children("tr:eq(0)").children("td")
                  , r = n.children(".layui-table-fixed-r").children(".layui-table-body").children("table").children("tbody").children("tr:eq(0)").children("td")
                  , d = [];
                i.children(".layui-table-total-fixed").remove(),
                0 < o.length && (this.addCSSRule(a, ".layui-table-total-fixed-l .layui-table-patch", "display: none"),
                t.next().css("position", "relative"),
                d.push('<table style="position: absolute;background-color: #fff;left: 0;top: ' + (i.position().top + 1) + 'px" cellspacing="0" cellpadding="0" border="0" class="layui-table layui-table-total-fixed layui-table-total-fixed-l"><tbody><tr>'),
                o.each(function() {
                    $(this).data("key") && d.push(i.children("table:eq(0)").find('[data-key="' + $(this).data("key") + '"]').prop("outerHTML"))
                }),
                d.push("</tr></tbody></table>"),
                i.append(d.join(""))),
                0 < r.length && (this.addCSSRule(a, ".layui-table-total-fixed-r td:first-child", "border-left:1px solid #e6e6e6"),
                this.addCSSRule(a, ".layui-table-total-fixed-r td:last-child", "border-left: none"),
                t.next().css("position", "relative"),
                (d = []).push('<table style="position: absolute;background-color: #fff;right: 0;top: ' + (i.position().top + 1) + 'px" cellspacing="0" cellpadding="0" border="0" class="layui-table layui-table-total-fixed layui-table-total-fixed-r"><tbody><tr>'),
                r.each(function() {
                    d.push(i.children("table:eq(0)").find('[data-key="' + $(this).data("key") + '"]').prop("outerHTML"))
                }),
                d.push("</tr></tbody></table>"),
                i.append(d.join("")))
            }
        },
        fixResizeRightFixed: function(l) {
            var i, a = this, e = $(l.elem).next().children(".layui-table-box").children(".layui-table-fixed-r").children(".layui-table-header").children("table"), n = {}, o = $("body"), t = $(document), r = "layui-table-sort", d = "layui-table-sort-invalid";
            0 < e.length && (e.find("th").off("mousemove").on("mousemove", function(e) {
                var t = $(this)
                  , i = t.offset().left
                  , l = e.clientX - i;
                t.data("unresize") || n.resizeStart || (t.width() - l <= 10 && o.css("cursor", "initial"),
                n.allowResize = l <= 10,
                o.css("cursor", n.allowResize ? "col-resize" : ""))
            }).off("mousedown").on("mousedown", function(e) {
                var i = $(this);
                if (n.allowResize) {
                    i.find("." + r).removeClass(r).addClass(d);
                    var t = i.data("key");
                    e.preventDefault(),
                    n.resizeStart = !0,
                    n.offset = [e.clientX, e.clientY],
                    a.getCssRule(l, t, function(e) {
                        var t = e.style.width || i.outerWidth();
                        n.rule = e,
                        n.ruleWidth = parseFloat(t),
                        n.othis = i,
                        n.minWidth = i.data("minwidth") || l.cellMinWidth
                    })
                }
            }),
            t.on("mousemove", function(e) {
                if (n.resizeStart) {
                    if (layui.soulTable.fixTableRemember(l, n),
                    e.preventDefault(),
                    n.rule) {
                        var t = n.ruleWidth - e.clientX + n.offset[0];
                        t < n.minWidth && (t = n.minWidth),
                        n.rule.style.width = t + "px"
                    }
                    i = 1
                }
            }).on("mouseup", function(e) {
                n.resizeStart && setTimeout(function() {
                    n.othis.find("." + d).removeClass(d).addClass(r),
                    o.css("cursor", ""),
                    n = {},
                    a.scrollPatch(l)
                }, 30),
                2 === i && (i = null)
            }))
        },
        fixFixedScroll: function(e) {
            var t = $(e.elem)
              , i = t.next().children(".layui-table-box").children(".layui-table-fixed")
              , l = t.next().children(".layui-table-box").children(".layui-table-main");
            i.on("mouseenter", function() {
                $(this).children(".layui-table-body").addClass("soul-fixed-scroll").on("scroll", function() {
                    var e = $(this).scrollTop();
                    l.scrollTop(e)
                })
            }).on("mouseleave", function() {
                $(this).children(".layui-table-body").removeClass("soul-fixed-scroll").off("scroll")
            })
        },
        scrollPatch: function(e) {
            var t = $(e.elem)
              , i = t.next().children(".layui-table-box").children(".layui-table-header")
              , l = t.next().children(".layui-table-total")
              , a = t.next().children(".layui-table-box").children(".layui-table-main")
              , n = t.next().children(".layui-table-box").children(".layui-table-fixed")
              , o = t.next().children(".layui-table-box").children(".layui-table-fixed-r")
              , r = a.children("table")
              , d = a.width() - a.prop("clientWidth")
              , s = a.height() - a.prop("clientHeight")
              , c = r.outerWidth() - a.width()
              , h = function(e) {
                if (d && s) {
                    if (!(e = e.eq(0)).find(".layui-table-patch")[0]) {
                        var t = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>');
                        t.find("div").css({
                            width: d
                        }),
                        e.find("tr").append(t)
                    }
                } else
                    e.find(".layui-table-patch").remove()
            };
            h(i),
            h(l);
            var u = a.height() - s;
            n.find(".layui-table-body").css("height", r.height() >= u ? u : "auto"),
            o[0 < c ? "removeClass" : "addClass"](HIDE),
            o.css("right", d - 1)
        },
        copy: function(e) {
            var t;
            e ? ((t = document.createElement("div")).id = "tempTarget",
            t.style.opacity = "0",
            t.innerText = e,
            document.body.appendChild(t)) : t = document.querySelector("#" + id);
            try {
                var i = document.createRange();
                i.selectNode(t),
                window.getSelection().removeAllRanges(),
                window.getSelection().addRange(i),
                document.execCommand("copy"),
                window.getSelection().removeAllRanges()
            } catch (e) {
                console.log("复制失败")
            }
            e && t.parentElement.removeChild(t)
        },
        addCSSRule: function(e, t, i, l) {
            "insertRule"in e ? e.insertRule(t + "{" + i + "}", l) : "addRule"in e && e.addRule(t, i, l)
        },
        deepStringify: function(e) {
            var i = "[[JSON_FUN_PREFIX_"
              , l = "_JSON_FUN_SUFFIX]]";
            return JSON.stringify(e, function(e, t) {
                return "function" == typeof t ? i + t.toString() + l : t
            })
        },
        deepParse: function(str) {
            var JSON_SERIALIZE_FIX = {
                PREFIX: "[[JSON_FUN_PREFIX_",
                SUFFIX: "_JSON_FUN_SUFFIX]]"
            };
            return JSON.parse(str, function(key, value) {
                return "string" == typeof value && 0 < value.indexOf(JSON_SERIALIZE_FIX.SUFFIX) && 0 === value.indexOf(JSON_SERIALIZE_FIX.PREFIX) ? eval("(" + value.replace(JSON_SERIALIZE_FIX.PREFIX, "").replace(JSON_SERIALIZE_FIX.SUFFIX, "") + ")") : value
            }) || {}
        },
        clearFilter: function(e) {
            tableFilter.clearFilter(e)
        },
        cache: tableFilter.cache
    };
    exports("soulTable", mod)
});
