var valueParser = require("postcss-value-parser");
var extend = require("extend");

function postcssUnits(options) {
  options = extend(
    {
      size: 750,
      toPxSize: 375,
    },
    options
  );
  return function (css) {
    css.walkDecls(function (decl) {
      if (!/(rem)/.test(decl.value)) {
        return null;
      }
      var parsedValue = valueParser(decl.value).walk(function (node) {
        if (node.type !== "word") {
          return;
        }
        const value = valueParser.unit(node.value);
        const { number, unit } = value;
        if (unit === "rem" && !isNaN(number)) {
          node.value = `${
            (parseFloat(number) / (options?.size / 100)) * options?.toPxSize
          }px`;
        } else if (unit === "px" && !isNaN(number)) {
          node.value = `${
            parseFloat(number) / (options?.size / options?.toPxSize)
          }px`;
        }
      });
      decl.value = parsedValue.toString();
    });
  };
}

export default postcssUnits;
