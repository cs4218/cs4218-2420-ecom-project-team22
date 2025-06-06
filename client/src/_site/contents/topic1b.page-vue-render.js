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
              _m(1),
              _v(" "),
              _c("p", [_v("Before setting up the project, ensure you have knowledge of Node.js and React.")]),
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
              _c("p", [_v("Follow these steps to set up MongoDB for your project:")]),
              _v(" "),
              _m(7),
              _v(" "),
              _m(8),
              _v(" "),
              _c("p", [
                _v(
                  "To download and use the MERN (MongoDB, Express.js, React.js, Node.js) app from GitHub, follow these general steps:"
                ),
              ]),
              _v(" "),
              _m(9),
              _v(" "),
              _m(10),
              _v(" "),
              _m(11),
              _v(" "),
              _m(12),
              _v(" "),
              _m(13),
              _v(" "),
              _m(14),
              _v(" "),
              _m(15),
              _v(" "),
              _m(16),
              _v(" "),
              _c("box", { staticClass: "bg-info text-dark", attrs: { type: "tip" } }, [
                _c("p", [
                  _c("strong", [_v("Enhance Your Knowledge: Explore React and Node.js!")]),
                  _v("\nAre you eager to expand your skills in React? Delve into the official "),
                  _c("a", { attrs: { href: "https://react.dev/learn" } }, [_v("React documentation")]),
                  _v(" for comprehensive learning resources."),
                ]),
                _v(" "),
                _c("p", [
                  _v("Looking to deepen your understanding of Node.js? Begin your journey with the insightful "),
                  _c("a", { attrs: { href: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" } }, [
                    _v("Introduction to Node.js"),
                  ]),
                  _v(" guide."),
                ]),
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
                      { pre: true, attrs: { class: "nav-link py-1", href: "#setting-up-the-existing-project" } },
                      [_v("Setting Up the Existing Project‎")]
                    ),
                    _v(" "),
                    _c("nav", { staticClass: "nav nav-pills flex-column my-0 nested no-flex-wrap" }, [
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#prerequisite-knowledge" } }, [
                        _v("Prerequisite Knowledge‎"),
                      ]),
                      _v(" "),
                      _c("nav", { staticClass: "nav nav-pills flex-column my-0 nested no-flex-wrap" }, [
                        _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#installing-node-js" } }, [
                          _v("Installing Node.js‎"),
                        ]),
                        _v(" "),
                        _c(
                          "a",
                          { pre: true, attrs: { class: "nav-link py-1", href: "#using-visual-studio-code-vscode" } },
                          [_v("Using Visual Studio Code (VSCode)‎")]
                        ),
                      ]),
                      _v(" "),
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#mongodb-setup" } }, [
                        _v("MongoDB Setup‎"),
                      ]),
                    ]),
                    _v(" "),
                    _c(
                      "a",
                      {
                        pre: true,
                        attrs: { class: "nav-link py-1", href: "#downloading-and-using-a-mern-app-from-github" },
                      },
                      [_v("Downloading and Using a MERN App from GitHub‎")]
                    ),
                    _v(" "),
                    _c("nav", { staticClass: "nav nav-pills flex-column my-0 nested no-flex-wrap" }, [
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#1-clone-the-repository" } }, [
                        _v("1. Clone the Repository‎"),
                      ]),
                      _v(" "),
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#2-install-dependencies" } }, [
                        _v("2. Install Dependencies‎"),
                      ]),
                      _v(" "),
                      _c(
                        "a",
                        { pre: true, attrs: { class: "nav-link py-1", href: "#3-set-up-environment-variables" } },
                        [_v("3. Set Up Environment Variables‎")]
                      ),
                      _v(" "),
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#4-running-the-application" } }, [
                        _v("4. Running the Application‎"),
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
      _m(17),
    ]);
  }
};
var pageVueStaticRenderFns = [
  function anonymous() {
    with (this) {
      return _c("h1", { attrs: { id: "setting-up-the-existing-project" } }, [
        _v("Setting Up the Existing Project"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#setting-up-the-existing-project", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "prerequisite-knowledge" } }, [
        _v("Prerequisite Knowledge"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#prerequisite-knowledge", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h3", { attrs: { id: "installing-node-js" } }, [
        _v("Installing Node.js"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#installing-node-js", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ol", [
        _c("li", [
          _c("strong", [_v("Download and Install Node.js")]),
          _v(":\n"),
          _c("ul", [
            _c("li", [
              _v("Visit "),
              _c("a", { attrs: { href: "https://nodejs.org" } }, [_v("nodejs.org")]),
              _v(" to download and install Node.js."),
            ]),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("strong", [_v("Verify Installation")]),
          _v(":\n"),
          _c("ul", [
            _c("li", [
              _v("Open your terminal and check the installed versions of Node.js and npm:"),
              _c("pre", [
                _c("code", { pre: true, attrs: { class: "hljs" } }, [
                  _c("span", [_v("node -v\n")]),
                  _c("span", [_v("npm -v\n")]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h3", { attrs: { id: "using-visual-studio-code-vscode" } }, [
        _v("Using Visual Studio Code (VSCode)"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#using-visual-studio-code-vscode", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ul", [
        _c("li", [_c("strong", [_v("Preferred Editor")]), _v(": Visual Studio Code (VSCode)")]),
        _v(" "),
        _c("li", [
          _c("strong", [_v("Recommended Extensions")]),
          _v(":\n"),
          _c("ol", [
            _c("li", [_v("ES7+ for modern JavaScript syntax support.")]),
            _v(" "),
            _c("li", [_v("Auto Close Tag for automatically closing HTML tags.")]),
            _v(" "),
            _c("li", [_v("ESLint for linting JavaScript code.")]),
            _v(" "),
            _c("li", [_v("HTML to JSX for converting HTML to JSX syntax.")]),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "mongodb-setup" } }, [
        _v("MongoDB Setup"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#mongodb-setup", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ol", [
        _c("li", [
          _c("p", [_c("strong", [_v("Download MongoDB Compass")]), _v(":")]),
          _v(" "),
          _c("ul", [
            _c("li", [_v("Download MongoDB Compass for your operating system from the official MongoDB website.")]),
            _v(" "),
            _c("li", [_v("Sign up or log in to MongoDB Atlas.")]),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [_c("strong", [_v("Create a New Shared Cluster")]), _v(":")]),
          _v(" "),
          _c("ul", [_c("li", [_v("After logging in, create a new shared cluster and name it accordingly.")])]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [_c("strong", [_v("Create a New Database")]), _v(":")]),
          _v(" "),
          _c("ul", [_c("li", [_v("Within the cluster, create a new database for your project.")])]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [_c("strong", [_v("Configure Database Access")]), _v(":")]),
          _v(" "),
          _c("ul", [
            _c("li", [
              _v('Navigate to "Database Access" under "Security" and create a new user with appropriate permissions.'),
            ]),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [_c("strong", [_v("Whitelist IP Address")]), _v(":")]),
          _v(" "),
          _c("ul", [
            _c("li", [
              _v(
                'Go to "Network Access" and whitelist your IP address (e.g., 0.0.0.0) to allow access from your machine.'
              ),
            ]),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [_c("strong", [_v("Connect to the Database")]), _v(":")]),
          _v(" "),
          _c("ul", [
            _c("li", [_v('Click on "Connect" and choose "Connect with MongoDB Compass".')]),
            _v(" "),
            _c("li", [
              _v(
                "Copy the connection string and add it to your project's .env file, replacing username and password placeholders."
              ),
            ]),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [_c("strong", [_v("Establish Connection with MongoDB Compass")]), _v(":")]),
          _v(" "),
          _c("ul", [
            _c("li", [
              _v("Open MongoDB Compass, paste the connection string, and establish a connection to your cluster."),
            ]),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h1", { attrs: { id: "downloading-and-using-a-mern-app-from-github" } }, [
        _v("Downloading and Using a MERN App from GitHub"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#downloading-and-using-a-mern-app-from-github", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "1-clone-the-repository" } }, [
        _v("1. Clone the Repository"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#1-clone-the-repository", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ul", [
        _c("li", [_v("Go to the GitHub repository of the MERN app.")]),
        _v(" "),
        _c("li", [_v('Click on the "Code" button and copy the URL of the repository.')]),
        _v(" "),
        _c("li", [_v("Open your terminal or command prompt.")]),
        _v(" "),
        _c("li", [
          _v(
            "Use the `git clone` command followed by the repository URL to clone the repository to your local machine.\n```\ngit clone <repository_url>\n```"
          ),
        ]),
        _v(" "),
        _c("li", [_v("Navigate into the cloned directory.")]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "2-install-dependencies" } }, [
        _v("2. Install Dependencies"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#2-install-dependencies", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ul", [
        _c("li", [_v("Navigate into the backend directory (where `package.json` file for the backend is located).")]),
        _v(" "),
        _c("li", [_v("Run `npm install` to install backend dependencies.")]),
        _v(" "),
        _c("li", [
          _v("Navigate into the frontend directory (where `package.json` file for the frontend is located)."),
        ]),
        _v(" "),
        _c("li", [_v("Run `npm install` to install frontend dependencies.")]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "3-set-up-environment-variables" } }, [
        _v("3. Set Up Environment Variables"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#3-set-up-environment-variables", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ul", [
        _c("li", [
          _v("Check if there are any environment variables required for the app (e.g., database connection URI)."),
        ]),
        _v(" "),
        _c("li", [_v("Create a `.env` file in the backend directory and set the required environment variables.")]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "4-running-the-application" } }, [
        _v("4. Running the Application"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#4-running-the-application", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ul", [
        _c("li", [_v("Open your web browser.")]),
        _v(" "),
        _c("li", [_v("Navigate to `http://localhost:3000` to access the application.")]),
        _v(" "),
        _c("li", [_v("Use `npm run dev` to run the app, which starts the development server.")]),
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
