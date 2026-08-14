/* @ds-bundle: {"format":3,"namespace":"CrescendoDesignSystem_a31e43","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"IconBadge","sourcePath":"components/layout/Card.jsx"},{"name":"FooterBand","sourcePath":"components/layout/FooterBand.jsx"},{"name":"SlideFooter","sourcePath":"components/layout/SlideFooter.jsx"},{"name":"Stat","sourcePath":"components/layout/Stat.jsx"},{"name":"StatRow","sourcePath":"components/layout/Stat.jsx"}],"sourceHashes":{"components/core/Button.jsx":"c8b01c2bc35b","components/core/Tag.jsx":"9846c71728f3","components/layout/Card.jsx":"f13c425ce9c9","components/layout/FooterBand.jsx":"25f6bdca20c9","components/layout/SlideFooter.jsx":"1f2c11243a29","components/layout/Stat.jsx":"e0ae063a813e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CrescendoDesignSystem_a31e43 = window.CrescendoDesignSystem_a31e43 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Crescendo Button.
 * Variants: primary (lime), dark (brand black), ghost (outline), link.
 * Calm interactions — color shift on hover, slight darken on press. No bounce.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  as = "button",
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: "13px",
      padding: "8px 14px",
      gap: "6px"
    },
    md: {
      fontSize: "15px",
      padding: "11px 20px",
      gap: "8px"
    },
    lg: {
      fontSize: "16px",
      padding: "14px 26px",
      gap: "10px"
    }
  };
  const variants = {
    primary: {
      background: "var(--crescendo-lime)",
      color: "var(--crescendo-black)",
      border: "1px solid var(--crescendo-lime)"
    },
    dark: {
      background: "var(--crescendo-black)",
      color: "var(--crescendo-white)",
      border: "1px solid var(--crescendo-black)"
    },
    ghost: {
      background: "transparent",
      color: "var(--crescendo-black)",
      border: "1px solid var(--border-light)"
    },
    link: {
      background: "transparent",
      color: "var(--crescendo-blue)",
      border: "1px solid transparent",
      padding: "0"
    }
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverBg = {
    primary: "var(--crescendo-lime-press)",
    dark: "var(--crescendo-black-90)",
    ghost: "var(--crescendo-off-white)",
    link: "transparent"
  };
  const Tag = as;
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes[size].gap,
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    fontSize: sizes[size].fontSize,
    lineHeight: 1,
    letterSpacing: "0.005em",
    padding: variant === "link" ? 0 : sizes[size].padding,
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
    transform: press && !disabled ? "translateY(1px)" : "none",
    textDecoration: variant === "link" && hover ? "underline" : "none",
    ...variants[variant],
    ...(hover && !disabled ? {
      background: hoverBg[variant]
    } : {})
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: style,
    disabled: as === "button" ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Crescendo Tag — all-caps pill used for vertical tags and category labels.
 * e.g. "RETAIL + ECOMMERCE", "AI-NATIVE CXM".
 */
function Tag({
  children,
  tone = "default",
  ...rest
}) {
  const tones = {
    default: {
      color: "var(--crescendo-black)",
      border: "1px solid var(--border-light)",
      background: "transparent"
    },
    dark: {
      color: "var(--crescendo-white)",
      border: "1px solid var(--border-dark)",
      background: "transparent"
    },
    lime: {
      color: "var(--crescendo-black)",
      border: "1px solid var(--crescendo-lime)",
      background: "var(--crescendo-lime)"
    },
    blue: {
      color: "var(--crescendo-white)",
      border: "1px solid var(--crescendo-blue)",
      background: "var(--crescendo-blue)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      padding: "5px 11px",
      borderRadius: "var(--radius-pill)",
      ...tones[tone]
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Crescendo Card — clean surface for feature blocks and content.
 * Square-ish corners, hairline border, optional subtle shadow. No glow.
 */
function Card({
  children,
  title = null,
  label = null,
  icon = null,
  tone = "light",
  elevated = false,
  ...rest
}) {
  const tones = {
    light: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-light)"
    },
    offwhite: {
      background: "var(--surface-body)",
      color: "var(--text-body)",
      border: "1px solid var(--border-light)"
    },
    dark: {
      background: "var(--crescendo-black)",
      color: "var(--text-on-dark-muted)",
      border: "1px solid var(--border-dark)"
    }
  };
  const titleColor = tone === "dark" ? "var(--crescendo-white)" : "var(--text-strong)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      boxShadow: elevated ? "var(--shadow-md)" : "none",
      ...tones[tone]
    }
  }, rest), icon && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "var(--space-4)"
    }
  }, icon), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-muted)",
      marginBottom: "var(--space-2)"
    }
  }, label), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: "18px",
      lineHeight: 1.2,
      color: titleColor,
      marginBottom: "var(--space-3)",
      letterSpacing: "-0.005em"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "15px",
      lineHeight: 1.55
    }
  }, children));
}

/**
 * IconBadge — colored square that holds an icon, used inside cards and feature grids.
 * Blue is the brand's default icon-background color.
 */
function IconBadge({
  children,
  color = "blue"
}) {
  const bg = {
    blue: "var(--crescendo-blue)",
    black: "var(--crescendo-black)",
    lime: "var(--crescendo-lime)"
  }[color];
  const fg = color === "lime" ? "var(--crescendo-black)" : "var(--crescendo-white)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "44px",
      height: "44px",
      borderRadius: "var(--radius-md)",
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px"
    }
  }, children);
}
Object.assign(__ds_scope, { Card, IconBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/FooterBand.jsx
try { (() => {
/**
 * Crescendo FooterBand — the closing mark on assets.
 * Lime band (product/vertical) or dark band (overview/general) with
 * a bold line left and URL/tagline right.
 */
function FooterBand({
  left = "MADE FOR YOU. BUILT TO PERFORM.",
  right = "crescendo.ai",
  tone = "lime"
}) {
  const isLime = tone === "lime";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "var(--space-5) var(--space-7)",
      background: isLime ? "var(--crescendo-lime)" : "var(--crescendo-black)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: "15px",
      letterSpacing: "0.02em",
      color: isLime ? "var(--crescendo-black)" : "var(--crescendo-white)"
    }
  }, left), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "14px",
      color: isLime ? "var(--crescendo-black)" : "var(--crescendo-white)"
    }
  }, right));
}
Object.assign(__ds_scope, { FooterBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/FooterBand.jsx", error: String((e && e.message) || e) }); }

// components/layout/SlideFooter.jsx
try { (() => {
/**
 * Crescendo SlideFooter — the canonical closing bar on content slides.
 * Wordmark left + the mark in a black rounded square, far right.
 * Pass the resolved logo URLs (relative paths differ per consumer location).
 */
function SlideFooter({
  wordmarkSrc,
  markSrc,
  tone = "light",
  note = null
}) {
  const isLime = tone === "lime";
  const bg = isLime ? "var(--crescendo-lime)" : "transparent";
  const borderTop = isLime ? "none" : "1px solid var(--border-light)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 28px",
      background: bg,
      borderTop
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "18px"
    }
  }, wordmarkSrc && /*#__PURE__*/React.createElement("img", {
    src: wordmarkSrc,
    alt: "Crescendo",
    style: {
      height: "16px",
      width: "auto"
    }
  }), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: isLime ? "var(--crescendo-black)" : "var(--text-muted)"
    }
  }, note)), markSrc && /*#__PURE__*/React.createElement("div", {
    style: {
      width: "34px",
      height: "34px",
      borderRadius: "8px",
      background: "var(--crescendo-black)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: markSrc,
    alt: "",
    style: {
      width: "22px",
      height: "22px"
    }
  })));
}
Object.assign(__ds_scope, { SlideFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SlideFooter.jsx", error: String((e && e.message) || e) }); }

// components/layout/Stat.jsx
try { (() => {
/**
 * Crescendo Stat — large lime number with a label below.
 * Used on dark "By the Numbers" sections. On light surfaces numbers are black.
 */
function Stat({
  value,
  label,
  tone = "dark",
  align = "left"
}) {
  const numberColor = tone === "dark" ? "var(--crescendo-lime)" : "var(--crescendo-black)";
  const labelColor = tone === "dark" ? "var(--text-on-dark-muted)" : "var(--text-muted)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: "56px",
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: numberColor
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: 1.4,
      color: labelColor,
      marginTop: "var(--space-3)",
      maxWidth: "26ch",
      marginLeft: align === "center" ? "auto" : 0,
      marginRight: align === "center" ? "auto" : 0
    }
  }, label));
}

/**
 * StatRow — horizontal row of stats separated by vertical dividers.
 * Wrap 2–4 <Stat> children.
 */
function StatRow({
  children,
  tone = "dark"
}) {
  const divider = tone === "dark" ? "var(--border-dark)" : "var(--border-light)";
  const kids = React.Children.toArray(children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch"
    }
  }, kids.map((child, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: "1px",
      background: divider,
      margin: "0 var(--space-6)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, child))));
}
Object.assign(__ds_scope, { Stat, StatRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Stat.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconBadge = __ds_scope.IconBadge;

__ds_ns.FooterBand = __ds_scope.FooterBand;

__ds_ns.SlideFooter = __ds_scope.SlideFooter;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.StatRow = __ds_scope.StatRow;

})();
