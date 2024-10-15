function n(s, e, t, i, a, f, b, p) {
  var l = typeof s == "function" ? s.options : s;
  return e && (l.render = e, l.staticRenderFns = t, l._compiled = !0), {
    exports: s,
    options: l
  };
}
const o = {
  name: "SweetModal",
  props: {
    title: {
      type: String,
      required: !1,
      default: ""
    },
    overlayTheme: {
      type: String,
      required: !1,
      default: "light"
    },
    modalTheme: {
      type: String,
      required: !1,
      default: "light"
    },
    blocking: {
      type: Boolean,
      required: !1,
      default: !1
    },
    pulseOnBlock: {
      type: Boolean,
      required: !1,
      default: !0
    },
    icon: {
      type: String,
      required: !1,
      default: ""
    },
    hideCloseButton: {
      type: Boolean,
      required: !1,
      default: !1
    },
    enableMobileFullscreen: {
      type: Boolean,
      required: !1,
      default: !0
    },
    width: {
      type: [Number, String],
      required: !1,
      default: null
    }
  },
  mounted() {
    this.tabs = this.$children.filter((s) => s.cmpName && s.cmpName == "tab"), this.has_tabs && (this.currentTab = this._changeTab(this.tabs[0])), document.addEventListener("keyup", this._onDocumentKeyup);
  },
  beforeDestroy() {
    this._unlockBody(), document.removeEventListener("keyup", this._onDocumentKeyup);
  },
  data() {
    return {
      visible: !1,
      is_open: !1,
      is_bouncing: !1,
      tabs: [],
      backups: {
        body: {
          height: null,
          overflow: null
        }
      }
    };
  },
  computed: {
    has_title() {
      return this.title || this.$slots.title;
    },
    has_tabs() {
      return this.tabs.length > 0;
    },
    has_content() {
      return this.$slots.default;
    },
    current_tab() {
      return this.tabs.filter((s) => s.active === !0)[0];
    },
    overlay_classes() {
      return [
        "sweet-modal-overlay",
        "theme-" + this.overlayTheme,
        "sweet-modal-clickable",
        {
          "is-visible": this.visible,
          blocking: this.blocking
        }
      ];
    },
    modal_classes() {
      return [
        "sweet-modal",
        "theme-" + this.modalTheme,
        {
          "has-title": this.has_title,
          "has-tabs": this.has_tabs,
          "has-content": this.has_content,
          "has-icon": this.icon,
          "is-mobile-fullscreen": this.enableMobileFullscreen,
          "is-visible": this.visible,
          "is-alert": this.icon && !this.has_tabs || !this.icon && !this.title && !this.$slots.title,
          bounce: this.is_bouncing
        }
      ];
    },
    modal_style() {
      let s = this.width, e = null;
      return s !== null && (Number(s) == s && (s = s + "px"), e = "none"), {
        width: s,
        maxWidth: e
      };
    }
  },
  methods: {
    /**
     * Open the dialog
     * Emits an event 'open'
     *
     * @param tabId string     Optional id or index of initial tab element.
     */
    open(s = null) {
      if (s && this.has_tabs) {
        let e = this.tabs.filter((t) => t.id === s);
        if (e.length > 0)
          this.currentTab = this._changeTab(e[0]);
        else {
          let t = this.tabs[s];
          t && (this.currentTab = this._changeTab(t));
        }
      }
      this.is_open = !0, this._lockBody(), this._animateIcon(), setTimeout(() => this.visible = !0, 30), this.$emit("open");
    },
    /**
     * Close the dialog
     * Emits an event 'close'
     */
    close() {
      this.visible = !1, this._unlockBody(), setTimeout(() => this.is_open = !1, 300), this.$emit("close");
    },
    /**
     * Bounce the modal.
     */
    bounce() {
      this.is_bouncing = !0, setTimeout(() => this.is_bouncing = !1, 330);
    },
    /**********************
        INTERNAL METHODS
     **********************/
    _lockBody() {
      document.body.style.height = "100%", document.body.style.overflow = "hidden";
    },
    _unlockBody() {
      document.body.style.height = this.backups.body.height, document.body.style.overflow = this.backups.body.overflow;
    },
    _onOverlayClick(s) {
      (!s.target.classList || s.target.classList.contains("sweet-modal-clickable")) && (this.blocking ? this.pulseOnBlock && this.bounce() : this.close());
    },
    _onDocumentKeyup(s) {
      s.keyCode == 27 && (this.blocking ? this.pulseOnBlock && this.bounce() : this.close());
    },
    _changeTab(s) {
      this.tabs.map((e) => e.active = e == s), this.currentTab = s;
    },
    _getClassesForTab(s) {
      return [
        "sweet-modal-tab",
        {
          active: s.active,
          disabled: s.disabled
        }
      ];
    },
    _animateIcon() {
      if (this.icon)
        switch (this.icon) {
          case "success":
            setTimeout(() => {
              this._applyClasses(this.$refs.icon_success, {
                "": ["animate"],
                ".sweet-modal-tip": ["animateSuccessTip"],
                ".sweet-modal-long": ["animateSuccessLong"]
              });
            }, 80);
            break;
          case "warning":
            this._applyClasses(this.$refs.icon_warning, {
              "": ["pulseWarning"],
              ".sweet-modal-body": ["pulseWarningIns"],
              ".sweet-modal-dot": ["pulseWarningIns"]
            });
            break;
          case "error":
            setTimeout(() => {
              this._applyClasses(this.$refs.icon_error, {
                "": ["animateErrorIcon"],
                ".sweet-modal-x-mark": ["animateXMark"]
              });
            }, 80);
            break;
        }
    },
    /**
     * Apply classes from the classMap to $ref or children of $ref, a native
     * DOMElement.
     *
     * ClassMap:
     * {
     *     'selector': [ 'class1', 'class2', ... ]
     * }
     *
     * Empty Selector selects $ref.
     *
     * @param DOMNode $ref     Element to apply classes to or children of that element
     * @param Object  classMap Class Map which elements get which classes (see doc)
     */
    _applyClasses(s, e) {
      for (let t in e) {
        let i = e[t], a;
        t == "" ? a = s : a = s.querySelector(t), a.classList.remove(...i), a.classList.add(...i);
      }
    }
  }
};
var c = function() {
  var e = this, t = e._self._c;
  return t("div", { directives: [{ name: "show", rawName: "v-show", value: e.is_open, expression: "is_open" }], class: e.overlay_classes, on: { click: e._onOverlayClick } }, [t("div", { class: e.modal_classes, style: e.modal_style }, [t("div", { staticClass: "sweet-box-actions" }, [e._t("box-action"), e.hideCloseButton ? e._e() : t("div", { staticClass: "sweet-action-close", on: { click: e.close } }, [t("svg", { attrs: { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" } }, [t("path", { attrs: { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z", fill: "#292c34" } })])])], 2), e.has_title || e.has_tabs ? t("div", { staticClass: "sweet-title" }, [e.has_tabs && !e.has_title ? [t("ul", { staticClass: "sweet-modal-tabs" }, e._l(e.tabs, function(i) {
    return t("li", { class: e._getClassesForTab(i) }, [t("a", { attrs: { href: "#" }, on: { click: function(a) {
      return a.preventDefault(), e._changeTab(i);
    } } }, [t("div", { staticClass: "sweet-modal-valign" }, [i.icon ? t("span", { staticClass: "sweet-modal-tab-icon", domProps: { innerHTML: e._s(i.icon) } }) : e._e(), t("span", { staticClass: "sweet-modal-tab-title" }, [e._v(e._s(i.title))])])])]);
  }), 0)] : e._e(), e.has_title ? [e.title ? t("h2", { domProps: { innerHTML: e._s(e.title) } }) : e._e(), e._t("title")] : e._e()], 2) : e._e(), e.has_title && e.has_tabs ? t("ul", { staticClass: "sweet-modal-tabs" }, e._l(e.tabs, function(i) {
    return t("li", { class: e._getClassesForTab(i) }, [t("a", { attrs: { href: "#" }, on: { click: function(a) {
      return a.preventDefault(), e._changeTab(i);
    } } }, [t("div", { staticClass: "sweet-modal-valign" }, [i.icon ? t("span", { staticClass: "sweet-modal-tab-icon", domProps: { innerHTML: e._s(i.icon) } }) : e._e(), t("span", { staticClass: "sweet-modal-tab-title" }, [e._v(e._s(i.title))])])])]);
  }), 0) : e._e(), t("div", { ref: "content", staticClass: "sweet-content" }, [e.icon == "error" ? t("div", { ref: "icon_error", staticClass: "sweet-modal-icon sweet-modal-error" }, [e._m(0)]) : e._e(), e.icon == "warning" ? t("div", { ref: "icon_warning", staticClass: "sweet-modal-icon sweet-modal-warning" }, [t("span", { staticClass: "sweet-modal-body" }), t("span", { staticClass: "sweet-modal-dot" })]) : e._e(), e.icon == "info" ? t("div", { ref: "icon_info", staticClass: "sweet-modal-icon sweet-modal-info" }) : e._e(), e.icon == "success" ? t("div", { ref: "icon_success", staticClass: "sweet-modal-icon sweet-modal-success" }, [t("span", { staticClass: "sweet-modal-line sweet-modal-tip" }), t("span", { staticClass: "sweet-modal-line sweet-modal-long" }), t("div", { staticClass: "sweet-modal-placeholder" }), t("div", { staticClass: "sweet-modal-fix" })]) : e._e(), e.$slots.default ? t("div", { staticClass: "sweet-content-content" }, [e._t("default")], 2) : e._e()]), e.$slots.button ? t("div", { staticClass: "sweet-buttons" }, [e._t("button")], 2) : e._e()])]);
}, r = [function() {
  var s = this, e = s._self._c;
  return e("span", { staticClass: "sweet-modal-x-mark" }, [e("span", { staticClass: "sweet-modal-line sweet-modal-left" }), e("span", { staticClass: "sweet-modal-line sweet-modal-right" })]);
}], d = /* @__PURE__ */ n(
  o,
  c,
  r
);
const w = d.exports, u = {
  props: {
    title: {
      type: String,
      required: !0
    },
    id: {
      type: String,
      required: !0
    },
    icon: {
      type: String,
      required: !1,
      default: null
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  data() {
    return {
      active: !1
    };
  },
  computed: {
    cmpName() {
      return "tab";
    }
  }
};
var h = function() {
  var e = this, t = e._self._c;
  return t("div", { class: ["sweet-modal-tab", { active: e.active }] }, [e._t("default")], 2);
}, _ = [], m = /* @__PURE__ */ n(
  u,
  h,
  _
);
const v = m.exports;
export {
  w as SweetModal,
  v as SweetModalTab
};
