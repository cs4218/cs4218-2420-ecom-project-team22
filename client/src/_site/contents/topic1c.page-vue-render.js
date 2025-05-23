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
                  "Unit testing is a crucial aspect of software development aimed at verifying the functionality of individual units or components of a software application. It involves isolating these units and subjecting them to various test scenarios to ensure their correctness."
                ),
              ]),
              _v(" "),
              _m(1),
              _v(" "),
              _m(2),
              _v(" "),
              _c("p", [_v("To begin unit testing with Jest in your project, follow these steps:")]),
              _v(" "),
              _m(3),
              _v(" "),
              _m(4),
              _v(" "),
              _c("p", [
                _v(
                  "Let's consider a Login component. You can write unit tests to verify its functionality without actually interacting with the UI. For instance, you can test if the login function handles user authentication properly or if it renders the login form correctly. A positive and negative test case for Register component has been created for your reference."
                ),
              ]),
              _v(" "),
              _c(
                "panel",
                {
                  attrs: { type: "primary" },
                  scopedSlots: _u([
                    {
                      key: "header",
                      fn: function () {
                        return [_c("p", [_v("Exercises")])];
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _v(" "),
                  _c("h3", { attrs: { id: "unit-testing-exercises" } }, [
                    _v("Unit testing Exercises"),
                    _c("a", {
                      staticClass: "fa fa-anchor",
                      attrs: { href: "#unit-testing-exercises", onclick: "event.stopPropagation()" },
                    }),
                  ]),
                  _v(" "),
                  _c("p", [
                    _v(
                      "Two unit test cases, a positive test case and a negative test case for the register component, are provided for you in the "
                    ),
                    _c("code", { pre: true }, [_v("auth")]),
                    _v(" folder in the file "),
                    _c("code", { pre: true }, [_v("Register.test.js")]),
                    _v(". Your task is to come up with at least three unit test cases for the login component."),
                  ]),
                  _v(" "),
                  _c("p", [
                    _v(
                      "For reference, you can find the provided test cases and the login component at the following link: "
                    ),
                    _c(
                      "a",
                      { attrs: { href: "https://github.com/rahulprasad01/ecom/tree/main/client/src/pages/Auth" } },
                      [_v("Auth Tests")]
                    ),
                  ]),
                ]
              ),
              _v(" "),
              _m(5),
              _v(" "),
              _c("p", [
                _v(
                  "Unit testing plays a vital role in software development by identifying bugs early in the development cycle, thereby enhancing the reliability and stability of the application. By thoroughly testing individual units and components, developers can ensure that the entire system functions as expected and catches errors before they propagate into production."
                ),
              ]),
              _v(" "),
              _m(6),
              _v(" "),
              _m(7),
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
                    _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#unit-testing-with-jest" } }, [
                      _v("Unit Testing with Jest‎"),
                    ]),
                    _v(" "),
                    _c("nav", { staticClass: "nav nav-pills flex-column my-0 nested no-flex-wrap" }, [
                      _c("a", { pre: true, attrs: { class: "nav-link py-1", href: "#getting-started-with-jest" } }, [
                        _v("Getting Started with Jest‎"),
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
      _m(8),
    ]);
  }
};
var pageVueStaticRenderFns = [
  function anonymous() {
    with (this) {
      return _c("h1", { attrs: { id: "unit-testing-with-jest" } }, [
        _v("Unit Testing with Jest"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#unit-testing-with-jest", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [
        _c("a", { attrs: { href: "https://jestjs.io/" } }, [_v("Jest")]),
        _v(
          " is a popular JavaScript testing framework widely used for unit testing. It offers a simple and efficient way to write and execute tests in JavaScript projects."
        ),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("h2", { attrs: { id: "getting-started-with-jest" } }, [
        _v("Getting Started with Jest"),
        _c("a", {
          staticClass: "fa fa-anchor",
          attrs: { href: "#getting-started-with-jest", onclick: "event.stopPropagation()" },
        }),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("ol", [
        _c("li", [
          _c("p", [
            _c("strong", [_v("Install Jest")]),
            _v(": Use your preferred package manager to install Jest. For instance, with npm:"),
          ]),
          _v(" "),
          _c("pre", [
            _c("code", { pre: true, attrs: { class: "hljs bash" } }, [
              _c("span", [_v("npm install --save-dev jest\n")]),
            ]),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Write Tests")]),
            _v(
              ": Create test files for your components or units where you define test cases to evaluate their behavior."
            ),
          ]),
        ]),
        _v(" "),
        _c("li", [
          _c("p", [
            _c("strong", [_v("Run Tests")]),
            _v(
              ": Execute your tests using Jest to ensure that your components meet the expected behavior. You can run the tests by using the command "
            ),
            _c("code", { pre: true, attrs: { class: "hljs inline no-lang" } }, [_v("npm run test")]),
            _v(" in the root of the directory."),
          ]),
        ]),
      ]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [_c("strong", [_v("Example Unit Tests")])]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [_c("strong", [_v("Finding Bugs and Ensuring Reliability")])]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [_c("strong", [_v("Further Learning")])]);
    }
  },
  function anonymous() {
    with (this) {
      return _c("p", [
        _v("To delve deeper into unit testing with Jest and enhance your testing skills, you can explore the "),
        _c("a", { attrs: { href: "https://jestjs.io/docs/getting-started" } }, [_v("Jest documentation")]),
        _v(
          ". It provides comprehensive guides and resources to help you master the art of unit testing in JavaScript projects."
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
