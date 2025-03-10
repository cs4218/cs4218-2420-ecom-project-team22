var pageVueRenderFn = function anonymous() {
  with (this) {
    return _c("div", { attrs: { id: "app" } }, [
      _c(
        "header",
        { attrs: { sticky: "" } },
        [
          _c(
            "navbar",
            {
              attrs: { type: "dark" },
              scopedSlots: _u([
                {
                  key: "brand",
                  fn: function () {
                    return [
                      _c("a", { staticClass: "navbar-brand", attrs: { href: "/index.html", title: "Home" } }, [
                        _v("Virtual Vault"),
                      ]),
                    ];
                  },
                  proxy: true,
                },
                {
                  key: "right",
                  fn: function () {
                    return [
                      _c("li", [
                        _c(
                          "form",
                          { staticClass: "navbar-form" },
                          [
                            _c("searchbar", {
                              attrs: {
                                data: searchData,
                                placeholder: "Search",
                                "on-hit": searchCallback,
                                "menu-align-right": "",
                              },
                            }),
                          ],
                          1
                        ),
                      ]),
                    ];
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _v(" "),
              _c(
                "dropdown",
                {
                  staticClass: "nav-link",
                  scopedSlots: _u([
                    {
                      key: "header",
                      fn: function () {
                        return [_v("Project overview and Labs")];
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1a.html" } }, [
                      _v("Overview"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1b.html" } }, [
                      _v("Setting Up"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1c.html" } }, [
                      _v("Unit Testing"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1d.html" } }, [
                      _v("Debugging"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1e.html" } }, [
                      _v("Code analysis/coverage"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1f.html" } }, [
                      _v("UI testing"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic1g.html" } }, [
                      _v("Load testing"),
                    ]),
                  ]),
                ]
              ),
              _v(" "),
              _c(
                "dropdown",
                {
                  staticClass: "nav-link",
                  scopedSlots: _u([
                    {
                      key: "header",
                      fn: function () {
                        return [_v("Project Requirements")];
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2a.html" } }, [
                      _v("Team formation"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2b.html" } }, [
                      _v("Set up github class room"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2c.html" } }, [
                      _v("Phase 1 requirements"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2d.html" } }, [
                      _v("Phase 2 requirements"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2e.html" } }, [
                      _v("Phase 2 testing"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2f.html" } }, [
                      _v("Submission instructions"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic2g.html" } }, [
                      _v("Report"),
                    ]),
                  ]),
                ]
              ),
              _v(" "),
              _c("li", [
                _c("a", { staticClass: "nav-link", attrs: { href: "/contents/topic3.html" } }, [
                  _v("Project Management"),
                ]),
              ]),
              _v(" "),
              _c(
                "dropdown",
                {
                  staticClass: "nav-link",
                  scopedSlots: _u([
                    {
                      key: "header",
                      fn: function () {
                        return [_v("FAQ")];
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic4a.html" } }, [
                      _v("Tools"),
                    ]),
                  ]),
                  _v(" "),
                  _c("li", [
                    _c("a", { staticClass: "dropdown-item", attrs: { href: "/contents/topic4b.html" } }, [
                      _v("Project"),
                    ]),
                  ]),
                ]
              ),
              _v(" "),
              _c("li", [
                _c("a", { staticClass: "nav-link", attrs: { href: "/contents/topic5.html" } }, [_v("References")]),
              ]),
            ],
            1
          ),
        ],
        1
      ),
      _v(" "),
      _c(
        "div",
        { attrs: { id: "flex-body" } },
        [
          _c("overlay-source", { attrs: { id: "site-nav", "tag-name": "nav", to: "site-nav" } }, [
            _c("div", { staticClass: "site-nav-top" }, [
              _c("div", { staticClass: "fw-bold mb-2", staticStyle: { "font-size": "1.25rem" } }, [_v("Contents")]),
            ]),
            _v(" "),
            _c(
              "div",
              { staticClass: "nav-component slim-scroll" },
              [
                _c(
                  "site-nav",
                  [
                    _c(
                      "overlay-source",
                      {
                        staticClass: "site-nav-list site-nav-list-root",
                        attrs: { "tag-name": "ul", to: "mb-site-nav" },
                      },
                      [
                        _c("li", [
                          _c(
                            "div",
                            {
                              staticClass: "site-nav-default-list-item site-nav-list-item-0",
                              attrs: { onclick: "handleSiteNavClick(this)" },
                            },
                            [_c("a", { attrs: { href: "/index.html" } }, [_v("Home 🏠")])]
                          ),
                        ]),
                        _v(" "),
                        _c("li", [
                          _c(
                            "div",
                            {
                              staticClass: "site-nav-default-list-item site-nav-list-item-0",
                              attrs: { onclick: "handleSiteNavClick(this)" },
                            },
                            [
                              _v("Project overview and Labs \n\n"),
                              _c("div", { staticClass: "site-nav-dropdown-btn-container" }, [
                                _c(
                                  "i",
                                  {
                                    staticClass: "site-nav-dropdown-btn-icon site-nav-rotate-icon",
                                    attrs: {
                                      onclick:
                                        "handleSiteNavClick(this.parentNode.parentNode, false); event.stopPropagation();",
                                    },
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "glyphicon glyphicon-menu-down",
                                      attrs: { "aria-hidden": "true" },
                                    }),
                                  ]
                                ),
                              ]),
                            ]
                          ),
                          _c(
                            "ul",
                            {
                              staticClass:
                                "site-nav-dropdown-container site-nav-dropdown-container-open site-nav-list",
                            },
                            [
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic1a.html" } }, [_v("Overview")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic1b.html" } }, [_v("Setting Up")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic1c.html" } }, [_v("Unit testing")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic1d.html" } }, [_v("Debugging")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [
                                    _c("a", { attrs: { href: "/contents/topic1e.html" } }, [
                                      _v("Code analysis/coverage"),
                                    ]),
                                  ]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic1f.html" } }, [_v("UI testing")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic1g.html" } }, [_v("Load testing")])]
                                ),
                              ]),
                            ]
                          ),
                        ]),
                        _v(" "),
                        _c("li", [
                          _c(
                            "div",
                            {
                              staticClass: "site-nav-default-list-item site-nav-list-item-0",
                              attrs: { onclick: "handleSiteNavClick(this)" },
                            },
                            [
                              _v("Project Requirements \n\n"),
                              _c("div", { staticClass: "site-nav-dropdown-btn-container" }, [
                                _c(
                                  "i",
                                  {
                                    staticClass: "site-nav-dropdown-btn-icon site-nav-rotate-icon",
                                    attrs: {
                                      onclick:
                                        "handleSiteNavClick(this.parentNode.parentNode, false); event.stopPropagation();",
                                    },
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "glyphicon glyphicon-menu-down",
                                      attrs: { "aria-hidden": "true" },
                                    }),
                                  ]
                                ),
                              ]),
                            ]
                          ),
                          _c(
                            "ul",
                            {
                              staticClass:
                                "site-nav-dropdown-container site-nav-dropdown-container-open site-nav-list",
                            },
                            [
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic2a.html" } }, [_v("Team formation")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [
                                    _c("a", { attrs: { href: "/contents/topic2b.html" } }, [
                                      _v("Set up github class room"),
                                    ]),
                                  ]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [
                                    _c("a", { attrs: { href: "/contents/topic2c.html" } }, [
                                      _v("Phase 1 requirements"),
                                    ]),
                                  ]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [
                                    _c("a", { attrs: { href: "/contents/topic2d.html" } }, [
                                      _v("Phase 2 requirements"),
                                    ]),
                                  ]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic2e.html" } }, [_v("Phase 2 testing")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [
                                    _c("a", { attrs: { href: "/contents/topic2f.html" } }, [
                                      _v("Submission instructions"),
                                    ]),
                                  ]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic2g.html" } }, [_v("Report")])]
                                ),
                              ]),
                            ]
                          ),
                        ]),
                        _v(" "),
                        _c("li", [
                          _c(
                            "div",
                            {
                              staticClass: "site-nav-default-list-item site-nav-list-item-0",
                              attrs: { onclick: "handleSiteNavClick(this)" },
                            },
                            [_c("a", { attrs: { href: "/contents/topic3.html" } }, [_v("Project Management")])]
                          ),
                        ]),
                        _v(" "),
                        _c("li", [
                          _c(
                            "div",
                            {
                              staticClass: "site-nav-default-list-item site-nav-list-item-0",
                              attrs: { onclick: "handleSiteNavClick(this)" },
                            },
                            [
                              _v("FAQ \n\n"),
                              _c("div", { staticClass: "site-nav-dropdown-btn-container" }, [
                                _c(
                                  "i",
                                  {
                                    staticClass: "site-nav-dropdown-btn-icon site-nav-rotate-icon",
                                    attrs: {
                                      onclick:
                                        "handleSiteNavClick(this.parentNode.parentNode, false); event.stopPropagation();",
                                    },
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "glyphicon glyphicon-menu-down",
                                      attrs: { "aria-hidden": "true" },
                                    }),
                                  ]
                                ),
                              ]),
                            ]
                          ),
                          _c(
                            "ul",
                            {
                              staticClass:
                                "site-nav-dropdown-container site-nav-dropdown-container-open site-nav-list",
                            },
                            [
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic4a.html" } }, [_v("Tools")])]
                                ),
                              ]),
                              _v(" "),
                              _c("li", [
                                _c(
                                  "div",
                                  {
                                    staticClass: "site-nav-default-list-item site-nav-list-item-1",
                                    attrs: { onclick: "handleSiteNavClick(this)" },
                                  },
                                  [_c("a", { attrs: { href: "/contents/topic4b.html" } }, [_v("Project")])]
                                ),
                              ]),
                            ]
                          ),
                        ]),
                        _v(" "),
                        _c("li", [
                          _c(
                            "div",
                            {
                              staticClass: "site-nav-default-list-item site-nav-list-item-0",
                              attrs: { onclick: "handleSiteNavClick(this)" },
                            },
                            [_c("a", { attrs: { href: "/contents/topic5.html" } }, [_v("References")])]
                          ),
                        ]),
                      ]
                    ),
                  ],
                  1
                ),
              ],
              1
            ),
          ]),
          _v(" "),
          _c(
            "div",
            { attrs: { id: "content-wrapper" } },
            [
              _c("breadcrumb"),
              _v(" "),
              _c("br"),
              _v(" "),
              _m(0),
              _v(" "),
              _c("p", [
                _v(
                  "Debugging is an essential skill for developers to identify and resolve issues in their code efficiently. Visual Studio Code (VS Code) provides powerful debugging features that streamline the debugging process and make it easier to pinpoint and fix errors in your code. In this guide, we'll explore how to leverage VS Code for debugging."
                ),
              ]),
              _v(" "),
              _m(1),
              _v(" "),
              _m(2),
              _v(" "),
              _m(3),
              _v(" "),
              _m(4),
              _v(" "),
              _m(5),
              _v(" "),
              _m(6),
              _v(" "),
              _m(7),
              _v(" "),
              _c("p", [
                _v(
                  "Debugging with Visual Studio Code significantly improves the efficiency of troubleshooting and resolving issues in your code. By mastering VS Code's debugging features, developers can streamline their development workflow and deliver more reliable software."
                ),
              ]),
              _v(" "),
              _m(8),
              _v(" "),
              _c("p", [
                _v(
                  "Debugging complements unit testing by helping developers identify and resolve issues that arise during code execution. It aids in:"
                ),
              ]),
              _v(" "),
              _m(9),
              _v(" "),
              _c("p", [
                _v(
                  "By leveraging debugging alongside unit testing, developers enhance code quality, leading to more stable and maintainable software systems."
                ),
              ]),
            ],
            1
          ),
          _v(" "),
          _c("overlay-source", { attrs: { id: "page-nav", "tag-name": "nav", to: "page-nav" } }, [
            _c(
              "div",
              { staticClass: "nav-component slim-scroll" },
              [
                _c("a", { pre: true, attrs: { class: "navbar-brand page-nav-title", href: "#" } }, [_v("Topics")]),
                _v(" "),
                _c(
                  "overlay-source",
                  {
                    staticClass: "nav nav-pills flex-column my-0 small no-flex-wrap",
                    attrs: { id: "mb-page-nav", "tag-name": "nav", to: "mb-page-nav" },
                  },
                  [
                    _c(
                      "a",
                      {
                        pre: true,
                        attrs: { class: "nav-link py-1", href: "#debugging-with-visual-studio-code-vs-code" },
                      },
                      [_v("Debugging with Visual Studio Code (VS Code)‎")]
                    ),
                    _v(" "),
                    _c("nav", { staticClass: "nav nav-pills flex-column my-0 nested no-flex-wrap" }, [
                      _c(
                        "a",
                        { pre: true, attrs: { class: "nav-link py-1", href: "#setting-up-debugger-in-vs-code" } },
                        [_v("Setting Up Debugger in VS Code‎")]
                      ),
                      _v(" "),
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#basic-debugging-workflow" } }, [
                        _v("Basic Debugging Workflow‎"),
                      ]),
                      _v(" "),
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#advanced-debugging-features" } }, [
                        _v("Advanced Debugging Features‎"),
                      ]),
                      _v(" "),
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#conclusion" } }, [
                        _v("Conclusion‎"),
                      ]),
                    ]),
                  ]
                ),
              ],
              1
            ),
          ]),
          _v(" "),
          _c("scroll-top-button"),
        ],
        1
      ),
      _v(" "),
      _m(10),
    ]);
  }
};
var pageVueStaticRenderFns = [
  function anonymous() {
    with (this) {
      return _c("h1", { attrs: { id: "debugging-with-visual-studio-code-vs-code" } }, [
        _v("Debugging with Visual Studio Code (VS Code)"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#debugging-with-visual-studio-code-vs-code", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "setting-up-debugger-in-vs-code" } }, [
        _v("Setting Up Debugger in VS Code"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#setting-up-debugger-in-vs-code", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ol", [
        _c("li", [
          _c("p", [
            _c("strong", [_v("Install VS Code")]),
            _v(": Download and install Visual Studio Code from the official website ("),
            _c("a", { attrs: { href: "https://code.visualstudio.com/" } }, [_v("https://code.visualstudio.com/")]),
            _v(")."),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Install Necessary Extensions")]),
            _v(
              ': VS Code offers various extensions to enhance the debugging experience. Install extensions like "Debugger for Chrome" for web development or language-specific debuggers for other types of projects.'
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Configure Launch Configuration")]),
            _v(": Create a launch configuration file ("),
            _c("code", { pre: true, attrs: { class: "hljs inline no-lang" } }, [_v("launch.json")]),
            _v(") in your project's "),
            _c("code", { pre: true, attrs: { class: "hljs inline no-lang" } }, [_v(".vscode")]),
            _v(
              " directory. This file defines how VS Code launches your application for debugging. Configure settings such as program entry points, environment variables, and debugging options."
            ),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "basic-debugging-workflow" } }, [
        _v("Basic Debugging Workflow"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#basic-debugging-workflow", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ol", [
        _c("li", [
          _c("p", [
            _c("strong", [_v("Set Breakpoints")]),
            _v(
              ": Place breakpoints in your code at the locations where you suspect issues or want to inspect variables' values during runtime."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Start Debugging Session")]),
            _v(
              ": Use the debugger toolbar in VS Code to start a debugging session. Choose the appropriate configuration from the dropdown menu and click on the play button to launch your application in debug mode."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Debugging Controls")]),
            _v(
              ": Once the debugging session starts, you can use various controls in VS Code to navigate through your code, step over or into functions, and inspect variables' values. Use the debug console to execute expressions and evaluate code snippets."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Watch and Evaluate")]),
            _v(
              ": Utilize the watch panel to monitor the values of specific variables or expressions during runtime. You can also hover over variables in the editor to view their current values."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Inspect Call Stack")]),
            _v(
              ": The call stack panel in VS Code displays the sequence of function calls leading up to the current point in your code. Use it to trace the execution flow and identify the origin of errors."
            ),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "advanced-debugging-features" } }, [
        _v("Advanced Debugging Features"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#advanced-debugging-features", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ol", [
        _c("li", [
          _c("p", [
            _c("strong", [_v("Conditional Breakpoints")]),
            _v(
              ": Set breakpoints with conditions to trigger debugging only when certain conditions are met, such as when a variable's value matches a specific criterion."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Exception Handling")]),
            _v(
              ": Configure VS Code to break on exceptions, allowing you to catch and inspect errors as they occur in your code."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Remote Debugging")]),
            _v(
              ": VS Code supports remote debugging, enabling you to debug applications running on remote servers or devices."
            ),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "conclusion" } }, [
        _v("Conclusion"),
        _c("a", { staticClass: "fa fa-anchor", attrs: { href: "#conclusion", onclick: "event.stopPropagation()" } }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [
        _v("For detailed information on debugging in Visual Studio Code, refer to the official "),
        _c("a", { attrs: { href: "https://code.visualstudio.com/docs/editor/debugging" } }, [
          _v("VS Code documentation"),
        ]),
        _v("."),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [
        _v("1."),
        _c("strong", [_v("Identifying Failed Tests")]),
        _v(
          ": Debugging assists in understanding why unit tests fail by examining code and variables at the time of failure. 2."
        ),
        _c("strong", [_v("Isolating Defects")]),
        _v(
          ": It helps isolate defects by reproducing scenarios that cause failures under specific conditions or edge cases. 3."
        ),
        _c("strong", [_v("Refining Test Cases")]),
        _v(
          ": Debugging can refine unit test cases by revealing scenarios not adequately covered, improving overall test coverage. 4."
        ),
        _c("strong", [_v("Validating Fixes")]),
        _v(
          ": After fixing a bug, debugging validates the effectiveness of the solution by rerunning tests and ensuring the issue is resolved. 5."
        ),
        _c("strong", [_v("Integration with TDD")]),
        _v(
          ": Debugging supports Test-Driven Development (TDD) by helping developers refine test cases and implementation iteratively."
        ),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("footer", [
        _c("div", { staticClass: "text-center" }, [
          _c("small", [
            _v("[Generated by "),
            _c("a", { attrs: { href: "https://markbind.org/" } }, [_v("MarkBind 5.5.2")]),
            _v("]"),
          ]),
        ]),
      ]);
    }
  },
];
