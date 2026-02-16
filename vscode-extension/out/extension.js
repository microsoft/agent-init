"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod
  )
);
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS({
  "../node_modules/fast-glob/out/utils/array.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.splitWhen = exports2.flatten = void 0;
    function flatten(items) {
      return items.reduce((collection, item) => [].concat(collection, item), []);
    }
    exports2.flatten = flatten;
    function splitWhen(items, predicate) {
      const result = [[]];
      let groupIndex = 0;
      for (const item of items) {
        if (predicate(item)) {
          groupIndex++;
          result[groupIndex] = [];
        } else {
          result[groupIndex].push(item);
        }
      }
      return result;
    }
    exports2.splitWhen = splitWhen;
  }
});

// ../node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS({
  "../node_modules/fast-glob/out/utils/errno.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEnoentCodeError = void 0;
    function isEnoentCodeError(error) {
      return error.code === "ENOENT";
    }
    exports2.isEnoentCodeError = isEnoentCodeError;
  }
});

// ../node_modules/fast-glob/out/utils/fs.js
var require_fs = __commonJS({
  "../node_modules/fast-glob/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// ../node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS({
  "../node_modules/fast-glob/out/utils/path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPosixPathToPattern =
      exports2.convertWindowsPathToPattern =
      exports2.convertPathToPattern =
      exports2.escapePosixPath =
      exports2.escapeWindowsPath =
      exports2.escape =
      exports2.removeLeadingDotSegment =
      exports2.makeAbsolute =
      exports2.unixify =
        void 0;
    var os = require("os");
    var path11 = require("path");
    var IS_WINDOWS_PLATFORM = os.platform() === "win32";
    var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
    var POSIX_UNESCAPED_GLOB_SYMBOLS_RE =
      /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
    var WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
    var DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
    var WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
    function unixify(filepath) {
      return filepath.replace(/\\/g, "/");
    }
    exports2.unixify = unixify;
    function makeAbsolute(cwd, filepath) {
      return path11.resolve(cwd, filepath);
    }
    exports2.makeAbsolute = makeAbsolute;
    function removeLeadingDotSegment(entry) {
      if (entry.charAt(0) === ".") {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === "/" || secondCharactery === "\\") {
          return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
      }
      return entry;
    }
    exports2.removeLeadingDotSegment = removeLeadingDotSegment;
    exports2.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
    function escapeWindowsPath(pattern) {
      return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapeWindowsPath = escapeWindowsPath;
    function escapePosixPath(pattern) {
      return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapePosixPath = escapePosixPath;
    exports2.convertPathToPattern = IS_WINDOWS_PLATFORM
      ? convertWindowsPathToPattern
      : convertPosixPathToPattern;
    function convertWindowsPathToPattern(filepath) {
      return escapeWindowsPath(filepath)
        .replace(DOS_DEVICE_PATH_RE, "//$1")
        .replace(WINDOWS_BACKSLASHES_RE, "/");
    }
    exports2.convertWindowsPathToPattern = convertWindowsPathToPattern;
    function convertPosixPathToPattern(filepath) {
      return escapePosixPath(filepath);
    }
    exports2.convertPosixPathToPattern = convertPosixPathToPattern;
  }
});

// ../node_modules/is-extglob/index.js
var require_is_extglob = __commonJS({
  "../node_modules/is-extglob/index.js"(exports2, module2) {
    module2.exports = function isExtglob(str) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      var match;
      while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
        if (match[2]) return true;
        str = str.slice(match.index + match[0].length);
      }
      return false;
    };
  }
});

// ../node_modules/is-glob/index.js
var require_is_glob = __commonJS({
  "../node_modules/is-glob/index.js"(exports2, module2) {
    var isExtglob = require_is_extglob();
    var chars = { "{": "}", "(": ")", "[": "]" };
    var strictCheck = function (str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      var pipeIndex = -2;
      var closeSquareIndex = -2;
      var closeCurlyIndex = -2;
      var closeParenIndex = -2;
      var backSlashIndex = -2;
      while (index < str.length) {
        if (str[index] === "*") {
          return true;
        }
        if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
          return true;
        }
        if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
          if (closeSquareIndex < index) {
            closeSquareIndex = str.indexOf("]", index);
          }
          if (closeSquareIndex > index) {
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
          }
        }
        if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
          closeCurlyIndex = str.indexOf("}", index);
          if (closeCurlyIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
              return true;
            }
          }
        }
        if (
          closeParenIndex !== -1 &&
          str[index] === "(" &&
          str[index + 1] === "?" &&
          /[:!=]/.test(str[index + 2]) &&
          str[index + 3] !== ")"
        ) {
          closeParenIndex = str.indexOf(")", index);
          if (closeParenIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
              return true;
            }
          }
        }
        if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
          if (pipeIndex < index) {
            pipeIndex = str.indexOf("|", index);
          }
          if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
            closeParenIndex = str.indexOf(")", pipeIndex);
            if (closeParenIndex > pipeIndex) {
              backSlashIndex = str.indexOf("\\", pipeIndex);
              if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
                return true;
              }
            }
          }
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    var relaxedCheck = function (str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      while (index < str.length) {
        if (/[*?{}()[\]]/.test(str[index])) {
          return true;
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    module2.exports = function isGlob(str, options) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      if (isExtglob(str)) {
        return true;
      }
      var check = strictCheck;
      if (options && options.strict === false) {
        check = relaxedCheck;
      }
      return check(str);
    };
  }
});

// ../node_modules/fast-glob/node_modules/glob-parent/index.js
var require_glob_parent = __commonJS({
  "../node_modules/fast-glob/node_modules/glob-parent/index.js"(exports2, module2) {
    "use strict";
    var isGlob = require_is_glob();
    var pathPosixDirname = require("path").posix.dirname;
    var isWin32 = require("os").platform() === "win32";
    var slash = "/";
    var backslash = /\\/g;
    var enclosure = /[\{\[].*[\}\]]$/;
    var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
    var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
    module2.exports = function globParent(str, opts) {
      var options = Object.assign({ flipBackslashes: true }, opts);
      if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
        str = str.replace(backslash, slash);
      }
      if (enclosure.test(str)) {
        str += slash;
      }
      str += "a";
      do {
        str = pathPosixDirname(str);
      } while (isGlob(str) || globby.test(str));
      return str.replace(escaped, "$1");
    };
  }
});

// ../node_modules/braces/lib/utils.js
var require_utils = __commonJS({
  "../node_modules/braces/lib/utils.js"(exports2) {
    "use strict";
    exports2.isInteger = (num) => {
      if (typeof num === "number") {
        return Number.isInteger(num);
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isInteger(Number(num));
      }
      return false;
    };
    exports2.find = (node, type) => node.nodes.find((node2) => node2.type === type);
    exports2.exceedsLimit = (min, max, step = 1, limit) => {
      if (limit === false) return false;
      if (!exports2.isInteger(min) || !exports2.isInteger(max)) return false;
      return (Number(max) - Number(min)) / Number(step) >= limit;
    };
    exports2.escapeNode = (block, n = 0, type) => {
      const node = block.nodes[n];
      if (!node) return;
      if ((type && node.type === type) || node.type === "open" || node.type === "close") {
        if (node.escaped !== true) {
          node.value = "\\" + node.value;
          node.escaped = true;
        }
      }
    };
    exports2.encloseBrace = (node) => {
      if (node.type !== "brace") return false;
      if ((node.commas >> (0 + node.ranges)) >> 0 === 0) {
        node.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isInvalidBrace = (block) => {
      if (block.type !== "brace") return false;
      if (block.invalid === true || block.dollar) return true;
      if ((block.commas >> (0 + block.ranges)) >> 0 === 0) {
        block.invalid = true;
        return true;
      }
      if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isOpenOrClose = (node) => {
      if (node.type === "open" || node.type === "close") {
        return true;
      }
      return node.open === true || node.close === true;
    };
    exports2.reduce = (nodes) =>
      nodes.reduce((acc, node) => {
        if (node.type === "text") acc.push(node.value);
        if (node.type === "range") node.type = "text";
        return acc;
      }, []);
    exports2.flatten = (...args) => {
      const result = [];
      const flat = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i];
          if (Array.isArray(ele)) {
            flat(ele);
            continue;
          }
          if (ele !== void 0) {
            result.push(ele);
          }
        }
        return result;
      };
      flat(args);
      return result;
    };
  }
});

// ../node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({
  "../node_modules/braces/lib/stringify.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = (ast, options = {}) => {
      const stringify = (node, parent = {}) => {
        const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options.escapeInvalid === true;
        let output = "";
        if (node.value) {
          if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
            return "\\" + node.value;
          }
          return node.value;
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes) {
          for (const child of node.nodes) {
            output += stringify(child);
          }
        }
        return output;
      };
      return stringify(ast);
    };
  }
});

// ../node_modules/is-number/index.js
var require_is_number = __commonJS({
  "../node_modules/is-number/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function (num) {
      if (typeof num === "number") {
        return num - num === 0;
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
      }
      return false;
    };
  }
});

// ../node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({
  "../node_modules/to-regex-range/index.js"(exports2, module2) {
    "use strict";
    var isNumber = require_is_number();
    var toRegexRange = (min, max, options) => {
      if (isNumber(min) === false) {
        throw new TypeError("toRegexRange: expected the first argument to be a number");
      }
      if (max === void 0 || min === max) {
        return String(min);
      }
      if (isNumber(max) === false) {
        throw new TypeError("toRegexRange: expected the second argument to be a number.");
      }
      let opts = { relaxZeros: true, ...options };
      if (typeof opts.strictZeros === "boolean") {
        opts.relaxZeros = opts.strictZeros === false;
      }
      let relax = String(opts.relaxZeros);
      let shorthand = String(opts.shorthand);
      let capture = String(opts.capture);
      let wrap = String(opts.wrap);
      let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
      if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
        return toRegexRange.cache[cacheKey].result;
      }
      let a = Math.min(min, max);
      let b = Math.max(min, max);
      if (Math.abs(a - b) === 1) {
        let result = min + "|" + max;
        if (opts.capture) {
          return `(${result})`;
        }
        if (opts.wrap === false) {
          return result;
        }
        return `(?:${result})`;
      }
      let isPadded = hasPadding(min) || hasPadding(max);
      let state = { min, max, a, b };
      let positives = [];
      let negatives = [];
      if (isPadded) {
        state.isPadded = isPadded;
        state.maxLen = String(state.max).length;
      }
      if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
      }
      if (b >= 0) {
        positives = splitToPatterns(a, b, state, opts);
      }
      state.negatives = negatives;
      state.positives = positives;
      state.result = collatePatterns(negatives, positives, opts);
      if (opts.capture === true) {
        state.result = `(${state.result})`;
      } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
        state.result = `(?:${state.result})`;
      }
      toRegexRange.cache[cacheKey] = state;
      return state.result;
    };
    function collatePatterns(neg, pos, options) {
      let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
      let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
      let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
      let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
      return subpatterns.join("|");
    }
    function splitToRanges(min, max) {
      let nines = 1;
      let zeros = 1;
      let stop = countNines(min, nines);
      let stops = /* @__PURE__ */ new Set([max]);
      while (min <= stop && stop <= max) {
        stops.add(stop);
        nines += 1;
        stop = countNines(min, nines);
      }
      stop = countZeros(max + 1, zeros) - 1;
      while (min < stop && stop <= max) {
        stops.add(stop);
        zeros += 1;
        stop = countZeros(max + 1, zeros) - 1;
      }
      stops = [...stops];
      stops.sort(compare);
      return stops;
    }
    function rangeToPattern(start, stop, options) {
      if (start === stop) {
        return { pattern: start, count: [], digits: 0 };
      }
      let zipped = zip(start, stop);
      let digits = zipped.length;
      let pattern = "";
      let count = 0;
      for (let i = 0; i < digits; i++) {
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) {
          pattern += startDigit;
        } else if (startDigit !== "0" || stopDigit !== "9") {
          pattern += toCharacterClass(startDigit, stopDigit, options);
        } else {
          count++;
        }
      }
      if (count) {
        pattern += options.shorthand === true ? "\\d" : "[0-9]";
      }
      return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options) {
      let ranges = splitToRanges(min, max);
      let tokens = [];
      let start = min;
      let prev;
      for (let i = 0; i < ranges.length; i++) {
        let max2 = ranges[i];
        let obj = rangeToPattern(String(start), String(max2), options);
        let zeros = "";
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
          if (prev.count.length > 1) {
            prev.count.pop();
          }
          prev.count.push(obj.count[0]);
          prev.string = prev.pattern + toQuantifier(prev.count);
          start = max2 + 1;
          continue;
        }
        if (tok.isPadded) {
          zeros = padZeros(max2, tok, options);
        }
        obj.string = zeros + obj.pattern + toQuantifier(obj.count);
        tokens.push(obj);
        start = max2 + 1;
        prev = obj;
      }
      return tokens;
    }
    function filterPatterns(arr, comparison, prefix, intersection, options) {
      let result = [];
      for (let ele of arr) {
        let { string } = ele;
        if (!intersection && !contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
        if (intersection && contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
      }
      return result;
    }
    function zip(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
      return arr;
    }
    function compare(a, b) {
      return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
      return arr.some((ele) => ele[key] === val);
    }
    function countNines(min, len) {
      return Number(String(min).slice(0, -len) + "9".repeat(len));
    }
    function countZeros(integer, zeros) {
      return integer - (integer % Math.pow(10, zeros));
    }
    function toQuantifier(digits) {
      let [start = 0, stop = ""] = digits;
      if (stop || start > 1) {
        return `{${start + (stop ? "," + stop : "")}}`;
      }
      return "";
    }
    function toCharacterClass(a, b, options) {
      return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
    }
    function hasPadding(str) {
      return /^-?(0+)\d/.test(str);
    }
    function padZeros(value, tok, options) {
      if (!tok.isPadded) {
        return value;
      }
      let diff = Math.abs(tok.maxLen - String(value).length);
      let relax = options.relaxZeros !== false;
      switch (diff) {
        case 0:
          return "";
        case 1:
          return relax ? "0?" : "0";
        case 2:
          return relax ? "0{0,2}" : "00";
        default: {
          return relax ? `0{0,${diff}}` : `0{${diff}}`;
        }
      }
    }
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => (toRegexRange.cache = {});
    module2.exports = toRegexRange;
  }
});

// ../node_modules/fill-range/index.js
var require_fill_range = __commonJS({
  "../node_modules/fill-range/index.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var toRegexRange = require_to_regex_range();
    var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var transform = (toNumber3) => {
      return (value) => (toNumber3 === true ? Number(value) : String(value));
    };
    var isValidValue = (value) => {
      return typeof value === "number" || (typeof value === "string" && value !== "");
    };
    var isNumber = (num) => Number.isInteger(+num);
    var zeros = (input) => {
      let value = `${input}`;
      let index = -1;
      if (value[0] === "-") value = value.slice(1);
      if (value === "0") return false;
      while (value[++index] === "0");
      return index > 0;
    };
    var stringify = (start, end, options) => {
      if (typeof start === "string" || typeof end === "string") {
        return true;
      }
      return options.stringify === true;
    };
    var pad = (input, maxLength, toNumber3) => {
      if (maxLength > 0) {
        let dash = input[0] === "-" ? "-" : "";
        if (dash) input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
      }
      if (toNumber3 === false) {
        return String(input);
      }
      return input;
    };
    var toMaxLen = (input, maxLength) => {
      let negative = input[0] === "-" ? "-" : "";
      if (negative) {
        input = input.slice(1);
        maxLength--;
      }
      while (input.length < maxLength) input = "0" + input;
      return negative ? "-" + input : input;
    };
    var toSequence = (parts, options, maxLen) => {
      parts.negatives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      parts.positives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      let prefix = options.capture ? "" : "?:";
      let positives = "";
      let negatives = "";
      let result;
      if (parts.positives.length) {
        positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
      }
      if (parts.negatives.length) {
        negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
      }
      if (positives && negatives) {
        result = `${positives}|${negatives}`;
      } else {
        result = positives || negatives;
      }
      if (options.wrap) {
        return `(${prefix}${result})`;
      }
      return result;
    };
    var toRange = (a, b, isNumbers, options) => {
      if (isNumbers) {
        return toRegexRange(a, b, { wrap: false, ...options });
      }
      let start = String.fromCharCode(a);
      if (a === b) return start;
      let stop = String.fromCharCode(b);
      return `[${start}-${stop}]`;
    };
    var toRegex = (start, end, options) => {
      if (Array.isArray(start)) {
        let wrap = options.wrap === true;
        let prefix = options.capture ? "" : "?:";
        return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
      }
      return toRegexRange(start, end, options);
    };
    var rangeError = (...args) => {
      return new RangeError("Invalid range arguments: " + util.inspect(...args));
    };
    var invalidRange = (start, end, options) => {
      if (options.strictRanges === true) throw rangeError([start, end]);
      return [];
    };
    var invalidStep = (step, options) => {
      if (options.strictRanges === true) {
        throw new TypeError(`Expected step "${step}" to be a number`);
      }
      return [];
    };
    var fillNumbers = (start, end, step = 1, options = {}) => {
      let a = Number(start);
      let b = Number(end);
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options.strictRanges === true) throw rangeError([start, end]);
        return [];
      }
      if (a === 0) a = 0;
      if (b === 0) b = 0;
      let descending = a > b;
      let startString = String(start);
      let endString = String(end);
      let stepString = String(step);
      step = Math.max(Math.abs(step), 1);
      let padded = zeros(startString) || zeros(endString) || zeros(stepString);
      let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
      let toNumber3 = padded === false && stringify(start, end, options) === false;
      let format = options.transform || transform(toNumber3);
      if (options.toRegex && step === 1) {
        return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
      }
      let parts = { negatives: [], positives: [] };
      let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        if (options.toRegex === true && step > 1) {
          push(a);
        } else {
          range.push(pad(format(a, index), maxLen, toNumber3));
        }
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return step > 1
          ? toSequence(parts, options, maxLen)
          : toRegex(range, null, { wrap: false, ...options });
      }
      return range;
    };
    var fillLetters = (start, end, step = 1, options = {}) => {
      if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
        return invalidRange(start, end, options);
      }
      let format = options.transform || ((val) => String.fromCharCode(val));
      let a = `${start}`.charCodeAt(0);
      let b = `${end}`.charCodeAt(0);
      let descending = a > b;
      let min = Math.min(a, b);
      let max = Math.max(a, b);
      if (options.toRegex && step === 1) {
        return toRange(min, max, false, options);
      }
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        range.push(format(a, index));
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return toRegex(range, null, { wrap: false, options });
      }
      return range;
    };
    var fill = (start, end, step, options = {}) => {
      if (end == null && isValidValue(start)) {
        return [start];
      }
      if (!isValidValue(start) || !isValidValue(end)) {
        return invalidRange(start, end, options);
      }
      if (typeof step === "function") {
        return fill(start, end, 1, { transform: step });
      }
      if (isObject(step)) {
        return fill(start, end, 0, step);
      }
      let opts = { ...options };
      if (opts.capture === true) opts.wrap = true;
      step = step || opts.step || 1;
      if (!isNumber(step)) {
        if (step != null && !isObject(step)) return invalidStep(step, opts);
        return fill(start, end, 1, step);
      }
      if (isNumber(start) && isNumber(end)) {
        return fillNumbers(start, end, step, opts);
      }
      return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    module2.exports = fill;
  }
});

// ../node_modules/braces/lib/compile.js
var require_compile = __commonJS({
  "../node_modules/braces/lib/compile.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var utils = require_utils();
    var compile = (ast, options = {}) => {
      const walk = (node, parent = {}) => {
        const invalidBlock = utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options.escapeInvalid === true;
        const invalid = invalidBlock === true || invalidNode === true;
        const prefix = options.escapeInvalid === true ? "\\" : "";
        let output = "";
        if (node.isOpen === true) {
          return prefix + node.value;
        }
        if (node.isClose === true) {
          console.log("node.isClose", prefix, node.value);
          return prefix + node.value;
        }
        if (node.type === "open") {
          return invalid ? prefix + node.value : "(";
        }
        if (node.type === "close") {
          return invalid ? prefix + node.value : ")";
        }
        if (node.type === "comma") {
          return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          const range = fill(...args, {
            ...options,
            wrap: false,
            toRegex: true,
            strictZeros: true
          });
          if (range.length !== 0) {
            return args.length > 1 && range.length > 1 ? `(${range})` : range;
          }
        }
        if (node.nodes) {
          for (const child of node.nodes) {
            output += walk(child, node);
          }
        }
        return output;
      };
      return walk(ast);
    };
    module2.exports = compile;
  }
});

// ../node_modules/braces/lib/expand.js
var require_expand = __commonJS({
  "../node_modules/braces/lib/expand.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var stringify = require_stringify();
    var utils = require_utils();
    var append3 = (queue = "", stash = "", enclose = false) => {
      const result = [];
      queue = [].concat(queue);
      stash = [].concat(stash);
      if (!stash.length) return queue;
      if (!queue.length) {
        return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
      }
      for (const item of queue) {
        if (Array.isArray(item)) {
          for (const value of item) {
            result.push(append3(value, stash, enclose));
          }
        } else {
          for (let ele of stash) {
            if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? append3(item, ele, enclose) : item + ele);
          }
        }
      }
      return utils.flatten(result);
    };
    var expand2 = (ast, options = {}) => {
      const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
      const walk = (node, parent = {}) => {
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while (p.type !== "brace" && p.type !== "root" && p.parent) {
          p = p.parent;
          q = p.queue;
        }
        if (node.invalid || node.dollar) {
          q.push(append3(q.pop(), stringify(node, options)));
          return;
        }
        if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
          q.push(append3(q.pop(), ["{}"]));
          return;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
            throw new RangeError(
              "expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit."
            );
          }
          let range = fill(...args, options);
          if (range.length === 0) {
            range = stringify(node, options);
          }
          q.push(append3(q.pop(), range));
          node.nodes = [];
          return;
        }
        const enclose = utils.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while (block.type !== "brace" && block.type !== "root" && block.parent) {
          block = block.parent;
          queue = block.queue;
        }
        for (let i = 0; i < node.nodes.length; i++) {
          const child = node.nodes[i];
          if (child.type === "comma" && node.type === "brace") {
            if (i === 1) queue.push("");
            queue.push("");
            continue;
          }
          if (child.type === "close") {
            q.push(append3(q.pop(), queue, enclose));
            continue;
          }
          if (child.value && child.type !== "open") {
            queue.push(append3(queue.pop(), child.value));
            continue;
          }
          if (child.nodes) {
            walk(child, node);
          }
        }
        return queue;
      };
      return utils.flatten(walk(ast));
    };
    module2.exports = expand2;
  }
});

// ../node_modules/braces/lib/constants.js
var require_constants = __commonJS({
  "../node_modules/braces/lib/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      MAX_LENGTH: 1e4,
      // Digits
      CHAR_0: "0",
      /* 0 */
      CHAR_9: "9",
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: "A",
      /* A */
      CHAR_LOWERCASE_A: "a",
      /* a */
      CHAR_UPPERCASE_Z: "Z",
      /* Z */
      CHAR_LOWERCASE_Z: "z",
      /* z */
      CHAR_LEFT_PARENTHESES: "(",
      /* ( */
      CHAR_RIGHT_PARENTHESES: ")",
      /* ) */
      CHAR_ASTERISK: "*",
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: "&",
      /* & */
      CHAR_AT: "@",
      /* @ */
      CHAR_BACKSLASH: "\\",
      /* \ */
      CHAR_BACKTICK: "`",
      /* ` */
      CHAR_CARRIAGE_RETURN: "\r",
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: "^",
      /* ^ */
      CHAR_COLON: ":",
      /* : */
      CHAR_COMMA: ",",
      /* , */
      CHAR_DOLLAR: "$",
      /* . */
      CHAR_DOT: ".",
      /* . */
      CHAR_DOUBLE_QUOTE: '"',
      /* " */
      CHAR_EQUAL: "=",
      /* = */
      CHAR_EXCLAMATION_MARK: "!",
      /* ! */
      CHAR_FORM_FEED: "\f",
      /* \f */
      CHAR_FORWARD_SLASH: "/",
      /* / */
      CHAR_HASH: "#",
      /* # */
      CHAR_HYPHEN_MINUS: "-",
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: "<",
      /* < */
      CHAR_LEFT_CURLY_BRACE: "{",
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: "[",
      /* [ */
      CHAR_LINE_FEED: "\n",
      /* \n */
      CHAR_NO_BREAK_SPACE: "\xA0",
      /* \u00A0 */
      CHAR_PERCENT: "%",
      /* % */
      CHAR_PLUS: "+",
      /* + */
      CHAR_QUESTION_MARK: "?",
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: ">",
      /* > */
      CHAR_RIGHT_CURLY_BRACE: "}",
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: "]",
      /* ] */
      CHAR_SEMICOLON: ";",
      /* ; */
      CHAR_SINGLE_QUOTE: "'",
      /* ' */
      CHAR_SPACE: " ",
      /*   */
      CHAR_TAB: "	",
      /* \t */
      CHAR_UNDERSCORE: "_",
      /* _ */
      CHAR_VERTICAL_LINE: "|",
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
      /* \uFEFF */
    };
  }
});

// ../node_modules/braces/lib/parse.js
var require_parse = __commonJS({
  "../node_modules/braces/lib/parse.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var {
      MAX_LENGTH,
      CHAR_BACKSLASH,
      /* \ */
      CHAR_BACKTICK,
      /* ` */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_RIGHT_SQUARE_BRACKET,
      /* ] */
      CHAR_DOUBLE_QUOTE,
      /* " */
      CHAR_SINGLE_QUOTE,
      /* ' */
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE
    } = require_constants();
    var parse2 = (input, options = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      const opts = options || {};
      const max =
        typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      if (input.length > max) {
        throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
      }
      const ast = { type: "root", input, nodes: [] };
      const stack = [ast];
      let block = ast;
      let prev = ast;
      let brackets = 0;
      const length = input.length;
      let index = 0;
      let depth = 0;
      let value;
      const advance = () => input[index++];
      const push = (node) => {
        if (node.type === "text" && prev.type === "dot") {
          prev.type = "text";
        }
        if (prev && prev.type === "text" && node.type === "text") {
          prev.value += node.value;
          return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
      };
      push({ type: "bos" });
      while (index < length) {
        block = stack[stack.length - 1];
        value = advance();
        if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
          continue;
        }
        if (value === CHAR_BACKSLASH) {
          push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
          continue;
        }
        if (value === CHAR_RIGHT_SQUARE_BRACKET) {
          push({ type: "text", value: "\\" + value });
          continue;
        }
        if (value === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          let next;
          while (index < length && (next = advance())) {
            value += next;
            if (next === CHAR_LEFT_SQUARE_BRACKET) {
              brackets++;
              continue;
            }
            if (next === CHAR_BACKSLASH) {
              value += advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              brackets--;
              if (brackets === 0) {
                break;
              }
            }
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_PARENTHESES) {
          block = push({ type: "paren", nodes: [] });
          stack.push(block);
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_RIGHT_PARENTHESES) {
          if (block.type !== "paren") {
            push({ type: "text", value });
            continue;
          }
          block = stack.pop();
          push({ type: "text", value });
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
          const open = value;
          let next;
          if (options.keepQuotes !== true) {
            value = "";
          }
          while (index < length && (next = advance())) {
            if (next === CHAR_BACKSLASH) {
              value += next + advance();
              continue;
            }
            if (next === open) {
              if (options.keepQuotes === true) value += next;
              break;
            }
            value += next;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_CURLY_BRACE) {
          depth++;
          const dollar = (prev.value && prev.value.slice(-1) === "$") || block.dollar === true;
          const brace = {
            type: "brace",
            open: true,
            close: false,
            dollar,
            depth,
            commas: 0,
            ranges: 0,
            nodes: []
          };
          block = push(brace);
          stack.push(block);
          push({ type: "open", value });
          continue;
        }
        if (value === CHAR_RIGHT_CURLY_BRACE) {
          if (block.type !== "brace") {
            push({ type: "text", value });
            continue;
          }
          const type = "close";
          block = stack.pop();
          block.close = true;
          push({ type, value });
          depth--;
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_COMMA && depth > 0) {
          if (block.ranges > 0) {
            block.ranges = 0;
            const open = block.nodes.shift();
            block.nodes = [open, { type: "text", value: stringify(block) }];
          }
          push({ type: "comma", value });
          block.commas++;
          continue;
        }
        if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
          const siblings = block.nodes;
          if (depth === 0 || siblings.length === 0) {
            push({ type: "text", value });
            continue;
          }
          if (prev.type === "dot") {
            block.range = [];
            prev.value += value;
            prev.type = "range";
            if (block.nodes.length !== 3 && block.nodes.length !== 5) {
              block.invalid = true;
              block.ranges = 0;
              prev.type = "text";
              continue;
            }
            block.ranges++;
            block.args = [];
            continue;
          }
          if (prev.type === "range") {
            siblings.pop();
            const before = siblings[siblings.length - 1];
            before.value += prev.value + value;
            prev = before;
            block.ranges--;
            continue;
          }
          push({ type: "dot", value });
          continue;
        }
        push({ type: "text", value });
      }
      do {
        block = stack.pop();
        if (block.type !== "root") {
          block.nodes.forEach((node) => {
            if (!node.nodes) {
              if (node.type === "open") node.isOpen = true;
              if (node.type === "close") node.isClose = true;
              if (!node.nodes) node.type = "text";
              node.invalid = true;
            }
          });
          const parent = stack[stack.length - 1];
          const index2 = parent.nodes.indexOf(block);
          parent.nodes.splice(index2, 1, ...block.nodes);
        }
      } while (stack.length > 0);
      push({ type: "eos" });
      return ast;
    };
    module2.exports = parse2;
  }
});

// ../node_modules/braces/index.js
var require_braces = __commonJS({
  "../node_modules/braces/index.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var compile = require_compile();
    var expand2 = require_expand();
    var parse2 = require_parse();
    var braces = (input, options = {}) => {
      let output = [];
      if (Array.isArray(input)) {
        for (const pattern of input) {
          const result = braces.create(pattern, options);
          if (Array.isArray(result)) {
            output.push(...result);
          } else {
            output.push(result);
          }
        }
      } else {
        output = [].concat(braces.create(input, options));
      }
      if (options && options.expand === true && options.nodupes === true) {
        output = [...new Set(output)];
      }
      return output;
    };
    braces.parse = (input, options = {}) => parse2(input, options);
    braces.stringify = (input, options = {}) => {
      if (typeof input === "string") {
        return stringify(braces.parse(input, options), options);
      }
      return stringify(input, options);
    };
    braces.compile = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      return compile(input, options);
    };
    braces.expand = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      let result = expand2(input, options);
      if (options.noempty === true) {
        result = result.filter(Boolean);
      }
      if (options.nodupes === true) {
        result = [...new Set(result)];
      }
      return result;
    };
    braces.create = (input, options = {}) => {
      if (input === "" || input.length < 3) {
        return [input];
      }
      return options.expand !== true
        ? braces.compile(input, options)
        : braces.expand(input, options);
    };
    module2.exports = braces;
  }
});

// ../node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS({
  "../node_modules/picomatch/lib/constants.js"(exports2, module2) {
    "use strict";
    var path11 = require("path");
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
    };
    var POSIX_REGEX_SOURCE = {
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      SEP: path11.sep,
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// ../node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  "../node_modules/picomatch/lib/utils.js"(exports2) {
    "use strict";
    var path11 = require("path");
    var win32 = process.platform === "win32";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants2();
    exports2.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports2.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports2.isRegexChar = (str) => str.length === 1 && exports2.hasRegexChars(str);
    exports2.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports2.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports2.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports2.supportsLookbehinds = () => {
      const segs = process.version.slice(1).split(".").map(Number);
      if ((segs.length === 3 && segs[0] >= 9) || (segs[0] === 8 && segs[1] >= 10)) {
        return true;
      }
      return false;
    };
    exports2.isWindows = (options) => {
      if (options && typeof options.windows === "boolean") {
        return options.windows;
      }
      return win32 === true || path11.sep === "\\";
    };
    exports2.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports2.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports2.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports2.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append3 = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append3}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
  }
});

// ../node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "../node_modules/picomatch/lib/scan.js"(exports2, module2) {
    "use strict";
    var utils = require_utils2();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants2();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar =
            code === CHAR_PLUS ||
            code === CHAR_AT ||
            code === CHAR_ASTERISK ||
            code === CHAR_QUESTION_MARK ||
            code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// ../node_modules/picomatch/lib/parse.js
var require_parse2 = __commonJS({
  "../node_modules/picomatch/lib/parse.js"(exports2, module2) {
    "use strict";
    var constants = require_constants2();
    var utils = require_utils2();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var parse2 = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max =
        typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const win32 = utils.isWindows(options);
      const PLATFORM_CHARS = constants.globChars(win32);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = (state.peek = (n = 1) => input[state.index + n]);
      const advance = (state.advance = () => input[++state.index] || "");
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append3 = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob =
            tok.extglob === true ||
            (extglobs.length && (tok.type === "pipe" || tok.type === "paren"));
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append3(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.value += tok.value;
          prev.output = (prev.output || "") + tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse2(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(
          REGEX_SPECIAL_CHARS_BACKREF,
          (m, esc, chars, first3, rest, index) => {
            if (first3 === "\\") {
              backslashes = true;
              return m;
            }
            if (first3 === "?") {
              if (esc) {
                return esc + first3 + (rest ? QMARK.repeat(rest.length) : "");
              }
              if (index === 0) {
                return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
              }
              return QMARK.repeat(chars.length);
            }
            if (first3 === ".") {
              return DOT_LITERAL.repeat(chars.length);
            }
            if (first3 === "*") {
              if (esc) {
                return esc + first3 + (rest ? star : "");
              }
              return star;
            }
            return esc ? m : `\\${m}`;
          }
        );
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if ((value === "[" && peek() !== ":") || (value === "-" && peek() === "]")) {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append3({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append3({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (
            opts.nobracket === true ||
            (prev && prev.type === "bracket" && prev.value.length === 1)
          ) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append3({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (next === "<" && !utils.supportsLookbehinds()) {
              throw new Error("Node.js v10 or higher is required for regex lookbehinds");
            }
            if (
              (prev.value === "(" && !/[!=<:]/.test(next)) ||
              (next === "<" && !/<([!=]|\w+>)/.test(remaining()))
            ) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if ((prev && prev.value === "(") || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (
            (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace")) ||
            state.parens > 0
          ) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== "/"))) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse2.fastpaths = (input, options) => {
      const opts = { ...options };
      const max =
        typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const win32 = utils.isWindows(options);
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(win32);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse2;
  }
});

// ../node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "../node_modules/picomatch/lib/picomatch.js"(exports2, module2) {
    "use strict";
    var path11 = require("path");
    var scan = require_scan();
    var parse2 = require_parse2();
    var utils = require_utils2();
    var constants = require_constants2();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || (typeof glob !== "string" && !isState)) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = utils.isWindows(options);
      const regex = isState
        ? picomatch.compileRe(glob, options)
        : picomatch.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
      const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
      return regex.test(path11.basename(input));
    };
    picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    picomatch.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
      return parse2(pattern, { ...options, fastpaths: false });
    };
    picomatch.scan = (input, options) => scan(input, options);
    picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append3 = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append3}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse2.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse2(input, options);
      }
      return picomatch.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants;
    module2.exports = picomatch;
  }
});

// ../node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "../node_modules/picomatch/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_picomatch();
  }
});

// ../node_modules/micromatch/index.js
var require_micromatch = __commonJS({
  "../node_modules/micromatch/index.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var braces = require_braces();
    var picomatch = require_picomatch2();
    var utils = require_utils2();
    var isEmptyString = (v) => v === "" || v === "./";
    var hasBraces = (v) => {
      const index = v.indexOf("{");
      return index > -1 && v.indexOf("}", index) > -1;
    };
    var micromatch = (list, patterns, options) => {
      patterns = [].concat(patterns);
      list = [].concat(list);
      let omit2 = /* @__PURE__ */ new Set();
      let keep = /* @__PURE__ */ new Set();
      let items = /* @__PURE__ */ new Set();
      let negatives = 0;
      let onResult = (state) => {
        items.add(state.output);
        if (options && options.onResult) {
          options.onResult(state);
        }
      };
      for (let i = 0; i < patterns.length; i++) {
        let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated) negatives++;
        for (let item of list) {
          let matched = isMatch(item, true);
          let match = negated ? !matched.isMatch : matched.isMatch;
          if (!match) continue;
          if (negated) {
            omit2.add(matched.output);
          } else {
            omit2.delete(matched.output);
            keep.add(matched.output);
          }
        }
      }
      let result = negatives === patterns.length ? [...items] : [...keep];
      let matches = result.filter((item) => !omit2.has(item));
      if (options && matches.length === 0) {
        if (options.failglob === true) {
          throw new Error(`No matches found for "${patterns.join(", ")}"`);
        }
        if (options.nonull === true || options.nullglob === true) {
          return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
        }
      }
      return matches;
    };
    micromatch.match = micromatch;
    micromatch.matcher = (pattern, options) => picomatch(pattern, options);
    micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    micromatch.any = micromatch.isMatch;
    micromatch.not = (list, patterns, options = {}) => {
      patterns = [].concat(patterns).map(String);
      let result = /* @__PURE__ */ new Set();
      let items = [];
      let onResult = (state) => {
        if (options.onResult) options.onResult(state);
        items.push(state.output);
      };
      let matches = new Set(micromatch(list, patterns, { ...options, onResult }));
      for (let item of items) {
        if (!matches.has(item)) {
          result.add(item);
        }
      }
      return [...result];
    };
    micromatch.contains = (str, pattern, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      if (Array.isArray(pattern)) {
        return pattern.some((p) => micromatch.contains(str, p, options));
      }
      if (typeof pattern === "string") {
        if (isEmptyString(str) || isEmptyString(pattern)) {
          return false;
        }
        if (str.includes(pattern) || (str.startsWith("./") && str.slice(2).includes(pattern))) {
          return true;
        }
      }
      return micromatch.isMatch(str, pattern, { ...options, contains: true });
    };
    micromatch.matchKeys = (obj, patterns, options) => {
      if (!utils.isObject(obj)) {
        throw new TypeError("Expected the first argument to be an object");
      }
      let keys = micromatch(Object.keys(obj), patterns, options);
      let res = {};
      for (let key of keys) res[key] = obj[key];
      return res;
    };
    micromatch.some = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (items.some((item) => isMatch(item))) {
          return true;
        }
      }
      return false;
    };
    micromatch.every = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (!items.every((item) => isMatch(item))) {
          return false;
        }
      }
      return true;
    };
    micromatch.all = (str, patterns, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      return [].concat(patterns).every((p) => picomatch(p, options)(str));
    };
    micromatch.capture = (glob, input, options) => {
      let posix = utils.isWindows(options);
      let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
      let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
      if (match) {
        return match.slice(1).map((v) => (v === void 0 ? "" : v));
      }
    };
    micromatch.makeRe = (...args) => picomatch.makeRe(...args);
    micromatch.scan = (...args) => picomatch.scan(...args);
    micromatch.parse = (patterns, options) => {
      let res = [];
      for (let pattern of [].concat(patterns || [])) {
        for (let str of braces(String(pattern), options)) {
          res.push(picomatch.parse(str, options));
        }
      }
      return res;
    };
    micromatch.braces = (pattern, options) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      if ((options && options.nobrace === true) || !hasBraces(pattern)) {
        return [pattern];
      }
      return braces(pattern, options);
    };
    micromatch.braceExpand = (pattern, options) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      return micromatch.braces(pattern, { ...options, expand: true });
    };
    micromatch.hasBraces = hasBraces;
    module2.exports = micromatch;
  }
});

// ../node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS({
  "../node_modules/fast-glob/out/utils/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isAbsolute =
      exports2.partitionAbsoluteAndRelative =
      exports2.removeDuplicateSlashes =
      exports2.matchAny =
      exports2.convertPatternsToRe =
      exports2.makeRe =
      exports2.getPatternParts =
      exports2.expandBraceExpansion =
      exports2.expandPatternsWithBraceExpansion =
      exports2.isAffectDepthOfReadingPattern =
      exports2.endsWithSlashGlobStar =
      exports2.hasGlobStar =
      exports2.getBaseDirectory =
      exports2.isPatternRelatedToParentDirectory =
      exports2.getPatternsOutsideCurrentDirectory =
      exports2.getPatternsInsideCurrentDirectory =
      exports2.getPositivePatterns =
      exports2.getNegativePatterns =
      exports2.isPositivePattern =
      exports2.isNegativePattern =
      exports2.convertToNegativePattern =
      exports2.convertToPositivePattern =
      exports2.isDynamicPattern =
      exports2.isStaticPattern =
        void 0;
    var path11 = require("path");
    var globParent = require_glob_parent();
    var micromatch = require_micromatch();
    var GLOBSTAR = "**";
    var ESCAPE_SYMBOL = "\\";
    var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
    var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
    var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
    var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
    var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
    var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
    function isStaticPattern(pattern, options = {}) {
      return !isDynamicPattern(pattern, options);
    }
    exports2.isStaticPattern = isStaticPattern;
    function isDynamicPattern(pattern, options = {}) {
      if (pattern === "") {
        return false;
      }
      if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
      }
      if (
        COMMON_GLOB_SYMBOLS_RE.test(pattern) ||
        REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) ||
        REGEX_GROUP_SYMBOLS_RE.test(pattern)
      ) {
        return true;
      }
      if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
      }
      return false;
    }
    exports2.isDynamicPattern = isDynamicPattern;
    function hasBraceExpansion(pattern) {
      const openingBraceIndex = pattern.indexOf("{");
      if (openingBraceIndex === -1) {
        return false;
      }
      const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
      if (closingBraceIndex === -1) {
        return false;
      }
      const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
      return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
    }
    function convertToPositivePattern(pattern) {
      return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
    }
    exports2.convertToPositivePattern = convertToPositivePattern;
    function convertToNegativePattern(pattern) {
      return "!" + pattern;
    }
    exports2.convertToNegativePattern = convertToNegativePattern;
    function isNegativePattern(pattern) {
      return pattern.startsWith("!") && pattern[1] !== "(";
    }
    exports2.isNegativePattern = isNegativePattern;
    function isPositivePattern(pattern) {
      return !isNegativePattern(pattern);
    }
    exports2.isPositivePattern = isPositivePattern;
    function getNegativePatterns(patterns) {
      return patterns.filter(isNegativePattern);
    }
    exports2.getNegativePatterns = getNegativePatterns;
    function getPositivePatterns(patterns) {
      return patterns.filter(isPositivePattern);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getPatternsInsideCurrentDirectory(patterns) {
      return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
    }
    exports2.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
    function getPatternsOutsideCurrentDirectory(patterns) {
      return patterns.filter(isPatternRelatedToParentDirectory);
    }
    exports2.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
    function isPatternRelatedToParentDirectory(pattern) {
      return pattern.startsWith("..") || pattern.startsWith("./..");
    }
    exports2.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
    function getBaseDirectory(pattern) {
      return globParent(pattern, { flipBackslashes: false });
    }
    exports2.getBaseDirectory = getBaseDirectory;
    function hasGlobStar(pattern) {
      return pattern.includes(GLOBSTAR);
    }
    exports2.hasGlobStar = hasGlobStar;
    function endsWithSlashGlobStar(pattern) {
      return pattern.endsWith("/" + GLOBSTAR);
    }
    exports2.endsWithSlashGlobStar = endsWithSlashGlobStar;
    function isAffectDepthOfReadingPattern(pattern) {
      const basename = path11.basename(pattern);
      return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
    }
    exports2.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
    function expandPatternsWithBraceExpansion(patterns) {
      return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
      }, []);
    }
    exports2.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
    function expandBraceExpansion(pattern) {
      const patterns = micromatch.braces(pattern, {
        expand: true,
        nodupes: true,
        keepEscaping: true
      });
      patterns.sort((a, b) => a.length - b.length);
      return patterns.filter((pattern2) => pattern2 !== "");
    }
    exports2.expandBraceExpansion = expandBraceExpansion;
    function getPatternParts(pattern, options) {
      let { parts } = micromatch.scan(
        pattern,
        Object.assign(Object.assign({}, options), { parts: true })
      );
      if (parts.length === 0) {
        parts = [pattern];
      }
      if (parts[0].startsWith("/")) {
        parts[0] = parts[0].slice(1);
        parts.unshift("");
      }
      return parts;
    }
    exports2.getPatternParts = getPatternParts;
    function makeRe(pattern, options) {
      return micromatch.makeRe(pattern, options);
    }
    exports2.makeRe = makeRe;
    function convertPatternsToRe(patterns, options) {
      return patterns.map((pattern) => makeRe(pattern, options));
    }
    exports2.convertPatternsToRe = convertPatternsToRe;
    function matchAny(entry, patternsRe) {
      return patternsRe.some((patternRe) => patternRe.test(entry));
    }
    exports2.matchAny = matchAny;
    function removeDuplicateSlashes(pattern) {
      return pattern.replace(DOUBLE_SLASH_RE, "/");
    }
    exports2.removeDuplicateSlashes = removeDuplicateSlashes;
    function partitionAbsoluteAndRelative(patterns) {
      const absolute = [];
      const relative = [];
      for (const pattern of patterns) {
        if (isAbsolute(pattern)) {
          absolute.push(pattern);
        } else {
          relative.push(pattern);
        }
      }
      return [absolute, relative];
    }
    exports2.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
    function isAbsolute(pattern) {
      return path11.isAbsolute(pattern);
    }
    exports2.isAbsolute = isAbsolute;
  }
});

// ../node_modules/merge2/index.js
var require_merge2 = __commonJS({
  "../node_modules/merge2/index.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    var PassThrough = Stream.PassThrough;
    var slice = Array.prototype.slice;
    module2.exports = merge2;
    function merge2() {
      const streamsQueue = [];
      const args = slice.call(arguments);
      let merging = false;
      let options = args[args.length - 1];
      if (options && !Array.isArray(options) && options.pipe == null) {
        args.pop();
      } else {
        options = {};
      }
      const doEnd = options.end !== false;
      const doPipeError = options.pipeError === true;
      if (options.objectMode == null) {
        options.objectMode = true;
      }
      if (options.highWaterMark == null) {
        options.highWaterMark = 64 * 1024;
      }
      const mergedStream = PassThrough(options);
      function addStream() {
        for (let i = 0, len = arguments.length; i < len; i++) {
          streamsQueue.push(pauseStreams(arguments[i], options));
        }
        mergeStream();
        return this;
      }
      function mergeStream() {
        if (merging) {
          return;
        }
        merging = true;
        let streams = streamsQueue.shift();
        if (!streams) {
          process.nextTick(endStream);
          return;
        }
        if (!Array.isArray(streams)) {
          streams = [streams];
        }
        let pipesCount = streams.length + 1;
        function next() {
          if (--pipesCount > 0) {
            return;
          }
          merging = false;
          mergeStream();
        }
        function pipe(stream) {
          function onend() {
            stream.removeListener("merge2UnpipeEnd", onend);
            stream.removeListener("end", onend);
            if (doPipeError) {
              stream.removeListener("error", onerror);
            }
            next();
          }
          function onerror(err) {
            mergedStream.emit("error", err);
          }
          if (stream._readableState.endEmitted) {
            return next();
          }
          stream.on("merge2UnpipeEnd", onend);
          stream.on("end", onend);
          if (doPipeError) {
            stream.on("error", onerror);
          }
          stream.pipe(mergedStream, { end: false });
          stream.resume();
        }
        for (let i = 0; i < streams.length; i++) {
          pipe(streams[i]);
        }
        next();
      }
      function endStream() {
        merging = false;
        mergedStream.emit("queueDrain");
        if (doEnd) {
          mergedStream.end();
        }
      }
      mergedStream.setMaxListeners(0);
      mergedStream.add = addStream;
      mergedStream.on("unpipe", function (stream) {
        stream.emit("merge2UnpipeEnd");
      });
      if (args.length) {
        addStream.apply(null, args);
      }
      return mergedStream;
    }
    function pauseStreams(streams, options) {
      if (!Array.isArray(streams)) {
        if (!streams._readableState && streams.pipe) {
          streams = streams.pipe(PassThrough(options));
        }
        if (!streams._readableState || !streams.pause || !streams.pipe) {
          throw new Error("Only readable stream can be merged.");
        }
        streams.pause();
      } else {
        for (let i = 0, len = streams.length; i < len; i++) {
          streams[i] = pauseStreams(streams[i], options);
        }
      }
      return streams;
    }
  }
});

// ../node_modules/fast-glob/out/utils/stream.js
var require_stream = __commonJS({
  "../node_modules/fast-glob/out/utils/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.merge = void 0;
    var merge2 = require_merge2();
    function merge3(streams) {
      const mergedStream = merge2(streams);
      streams.forEach((stream) => {
        stream.once("error", (error) => mergedStream.emit("error", error));
      });
      mergedStream.once("close", () => propagateCloseEventToSources(streams));
      mergedStream.once("end", () => propagateCloseEventToSources(streams));
      return mergedStream;
    }
    exports2.merge = merge3;
    function propagateCloseEventToSources(streams) {
      streams.forEach((stream) => stream.emit("close"));
    }
  }
});

// ../node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS({
  "../node_modules/fast-glob/out/utils/string.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEmpty = exports2.isString = void 0;
    function isString(input) {
      return typeof input === "string";
    }
    exports2.isString = isString;
    function isEmpty(input) {
      return input === "";
    }
    exports2.isEmpty = isEmpty;
  }
});

// ../node_modules/fast-glob/out/utils/index.js
var require_utils3 = __commonJS({
  "../node_modules/fast-glob/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.string =
      exports2.stream =
      exports2.pattern =
      exports2.path =
      exports2.fs =
      exports2.errno =
      exports2.array =
        void 0;
    var array = require_array();
    exports2.array = array;
    var errno = require_errno();
    exports2.errno = errno;
    var fs9 = require_fs();
    exports2.fs = fs9;
    var path11 = require_path();
    exports2.path = path11;
    var pattern = require_pattern();
    exports2.pattern = pattern;
    var stream = require_stream();
    exports2.stream = stream;
    var string = require_string();
    exports2.string = string;
  }
});

// ../node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS({
  "../node_modules/fast-glob/out/managers/tasks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPatternGroupToTask =
      exports2.convertPatternGroupsToTasks =
      exports2.groupPatternsByBaseDirectory =
      exports2.getNegativePatternsAsPositive =
      exports2.getPositivePatterns =
      exports2.convertPatternsToTasks =
      exports2.generate =
        void 0;
    var utils = require_utils3();
    function generate(input, settings) {
      const patterns = processPatterns(input, settings);
      const ignore = processPatterns(settings.ignore, settings);
      const positivePatterns = getPositivePatterns(patterns);
      const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
      const staticPatterns = positivePatterns.filter((pattern) =>
        utils.pattern.isStaticPattern(pattern, settings)
      );
      const dynamicPatterns = positivePatterns.filter((pattern) =>
        utils.pattern.isDynamicPattern(pattern, settings)
      );
      const staticTasks = convertPatternsToTasks(
        staticPatterns,
        negativePatterns,
        /* dynamic */
        false
      );
      const dynamicTasks = convertPatternsToTasks(
        dynamicPatterns,
        negativePatterns,
        /* dynamic */
        true
      );
      return staticTasks.concat(dynamicTasks);
    }
    exports2.generate = generate;
    function processPatterns(input, settings) {
      let patterns = input;
      if (settings.braceExpansion) {
        patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
      }
      if (settings.baseNameMatch) {
        patterns = patterns.map((pattern) => (pattern.includes("/") ? pattern : `**/${pattern}`));
      }
      return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
    }
    function convertPatternsToTasks(positive, negative, dynamic) {
      const tasks = [];
      const patternsOutsideCurrentDirectory =
        utils.pattern.getPatternsOutsideCurrentDirectory(positive);
      const patternsInsideCurrentDirectory =
        utils.pattern.getPatternsInsideCurrentDirectory(positive);
      const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(
        patternsOutsideCurrentDirectory
      );
      const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(
        patternsInsideCurrentDirectory
      );
      tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
      if ("." in insideCurrentDirectoryGroup) {
        tasks.push(
          convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic)
        );
      } else {
        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
      }
      return tasks;
    }
    exports2.convertPatternsToTasks = convertPatternsToTasks;
    function getPositivePatterns(patterns) {
      return utils.pattern.getPositivePatterns(patterns);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getNegativePatternsAsPositive(patterns, ignore) {
      const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
      const positive = negative.map(utils.pattern.convertToPositivePattern);
      return positive;
    }
    exports2.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
    function groupPatternsByBaseDirectory(patterns) {
      const group = {};
      return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
          collection[base].push(pattern);
        } else {
          collection[base] = [pattern];
        }
        return collection;
      }, group);
    }
    exports2.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
    function convertPatternGroupsToTasks(positive, negative, dynamic) {
      return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
      });
    }
    exports2.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
    function convertPatternGroupToTask(base, positive, negative, dynamic) {
      return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
      };
    }
    exports2.convertPatternGroupToTask = convertPatternGroupToTask;
  }
});

// ../node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async = __commonJS({
  "../node_modules/@nodelib/fs.stat/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path11, settings, callback) {
      settings.fs.lstat(path11, (lstatError, lstat) => {
        if (lstatError !== null) {
          callFailureCallback(callback, lstatError);
          return;
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
          callSuccessCallback(callback, lstat);
          return;
        }
        settings.fs.stat(path11, (statError, stat) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              callFailureCallback(callback, statError);
              return;
            }
            callSuccessCallback(callback, lstat);
            return;
          }
          if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
          }
          callSuccessCallback(callback, stat);
        });
      });
    }
    exports2.read = read;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// ../node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync = __commonJS({
  "../node_modules/@nodelib/fs.stat/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path11, settings) {
      const lstat = settings.fs.lstatSync(path11);
      if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
      }
      try {
        const stat = settings.fs.statSync(path11);
        if (settings.markSymbolicLink) {
          stat.isSymbolicLink = () => true;
        }
        return stat;
      } catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
          return lstat;
        }
        throw error;
      }
    }
    exports2.read = read;
  }
});

// ../node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs2 = __commonJS({
  "../node_modules/@nodelib/fs.stat/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs9 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs9.lstat,
      stat: fs9.stat,
      lstatSync: fs9.lstatSync,
      statSync: fs9.statSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// ../node_modules/@nodelib/fs.stat/out/settings.js
var require_settings = __commonJS({
  "../node_modules/@nodelib/fs.stat/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs9 = require_fs2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs9.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(
          this._options.throwErrorOnBrokenSymbolicLink,
          true
        );
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// ../node_modules/@nodelib/fs.stat/out/index.js
var require_out = __commonJS({
  "../node_modules/@nodelib/fs.stat/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.statSync = exports2.stat = exports2.Settings = void 0;
    var async = require_async();
    var sync = require_sync();
    var settings_1 = require_settings();
    exports2.Settings = settings_1.default;
    function stat(path11, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path11, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path11, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.stat = stat;
    function statSync(path11, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path11, settings);
    }
    exports2.statSync = statSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// ../node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({
  "../node_modules/queue-microtask/index.js"(exports2, module2) {
    var promise;
    module2.exports =
      typeof queueMicrotask === "function"
        ? queueMicrotask.bind(typeof window !== "undefined" ? window : global)
        : (cb) =>
            (promise || (promise = Promise.resolve())).then(cb).catch((err) =>
              setTimeout(() => {
                throw err;
              }, 0)
            );
  }
});

// ../node_modules/run-parallel/index.js
var require_run_parallel = __commonJS({
  "../node_modules/run-parallel/index.js"(exports2, module2) {
    module2.exports = runParallel;
    var queueMicrotask2 = require_queue_microtask();
    function runParallel(tasks, cb) {
      let results, pending, keys;
      let isSync = true;
      if (Array.isArray(tasks)) {
        results = [];
        pending = tasks.length;
      } else {
        keys = Object.keys(tasks);
        results = {};
        pending = keys.length;
      }
      function done(err) {
        function end() {
          if (cb) cb(err, results);
          cb = null;
        }
        if (isSync) queueMicrotask2(end);
        else end();
      }
      function each(i, err, result) {
        results[i] = result;
        if (--pending === 0 || err) {
          done(err);
        }
      }
      if (!pending) {
        done(null);
      } else if (keys) {
        keys.forEach(function (key) {
          tasks[key](function (err, result) {
            each(key, err, result);
          });
        });
      } else {
        tasks.forEach(function (task, i) {
          task(function (err, result) {
            each(i, err, result);
          });
        });
      }
      isSync = false;
    }
  }
});

// ../node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants3 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
    var NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
    if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) {
      throw new Error(
        `Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`
      );
    }
    var MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
    var MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
    var SUPPORTED_MAJOR_VERSION = 10;
    var SUPPORTED_MINOR_VERSION = 10;
    var IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
    var IS_MATCHED_BY_MAJOR_AND_MINOR =
      MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES =
      IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs3 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils4 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fs = void 0;
    var fs9 = require_fs3();
    exports2.fs = fs9;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/providers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = void 0;
    function joinPathSegments(a, b, separator) {
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async2 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var rpl = require_run_parallel();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings, callback) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        readdirWithFileTypes(directory, settings, callback);
        return;
      }
      readdir(directory, settings, callback);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings, callback) {
      settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const entries = dirents.map((dirent) => ({
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        }));
        if (!settings.followSymbolicLinks) {
          callSuccessCallback(callback, entries);
          return;
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, rplEntries);
        });
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function makeRplTaskEntry(entry, settings) {
      return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
          done(null, entry);
          return;
        }
        settings.fs.stat(entry.path, (statError, stats) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              done(statError);
              return;
            }
            done(null, entry);
            return;
          }
          entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          done(null, entry);
        });
      };
    }
    function readdir(directory, settings, callback) {
      settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const tasks = names.map((name) => {
          const path11 = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
          return (done) => {
            fsStat.stat(path11, settings.fsStatSettings, (error, stats) => {
              if (error !== null) {
                done(error);
                return;
              }
              const entry = {
                name,
                path: path11,
                dirent: utils.fs.createDirentFromStats(name, stats)
              };
              if (settings.stats) {
                entry.stats = stats;
              }
              done(null, entry);
            });
          };
        });
        rpl(tasks, (rplError, entries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, entries);
        });
      });
    }
    exports2.readdir = readdir;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// ../node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync2 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
      }
      return readdir(directory, settings);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings) {
      const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
      return dirents.map((dirent) => {
        const entry = {
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
          try {
            const stats = settings.fs.statSync(entry.path);
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          } catch (error) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              throw error;
            }
          }
        }
        return entry;
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function readdir(directory, settings) {
      const names = settings.fs.readdirSync(directory);
      return names.map((name) => {
        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
          name,
          path: entryPath,
          dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
          entry.stats = stats;
        }
        return entry;
      });
    }
    exports2.readdir = readdir;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs4 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs9 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs9.lstat,
      stat: fs9.stat,
      lstatSync: fs9.lstatSync,
      statSync: fs9.statSync,
      readdir: fs9.readdir,
      readdirSync: fs9.readdirSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings2 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path11 = require("path");
    var fsStat = require_out();
    var fs9 = require_fs4();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs9.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path11.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(
          this._options.throwErrorOnBrokenSymbolicLink,
          true
        );
        this.fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this.followSymbolicLinks,
          fs: this.fs,
          throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// ../node_modules/@nodelib/fs.scandir/out/index.js
var require_out2 = __commonJS({
  "../node_modules/@nodelib/fs.scandir/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.scandirSync = exports2.scandir = void 0;
    var async = require_async2();
    var sync = require_sync2();
    var settings_1 = require_settings2();
    exports2.Settings = settings_1.default;
    function scandir(path11, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path11, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path11, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.scandir = scandir;
    function scandirSync(path11, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path11, settings);
    }
    exports2.scandirSync = scandirSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// ../node_modules/reusify/reusify.js
var require_reusify = __commonJS({
  "../node_modules/reusify/reusify.js"(exports2, module2) {
    "use strict";
    function reusify(Constructor) {
      var head = new Constructor();
      var tail = head;
      function get() {
        var current = head;
        if (current.next) {
          head = current.next;
        } else {
          head = new Constructor();
          tail = head;
        }
        current.next = null;
        return current;
      }
      function release(obj) {
        tail.next = obj;
        tail = obj;
      }
      return {
        get,
        release
      };
    }
    module2.exports = reusify;
  }
});

// ../node_modules/fastq/queue.js
var require_queue = __commonJS({
  "../node_modules/fastq/queue.js"(exports2, module2) {
    "use strict";
    var reusify = require_reusify();
    function fastqueue(context, worker, _concurrency) {
      if (typeof context === "function") {
        _concurrency = worker;
        worker = context;
        context = null;
      }
      if (!(_concurrency >= 1)) {
        throw new Error("fastqueue concurrency must be equal to or greater than 1");
      }
      var cache3 = reusify(Task);
      var queueHead = null;
      var queueTail = null;
      var _running = 0;
      var errorHandler = null;
      var self = {
        push,
        drain: noop3,
        saturated: noop3,
        pause,
        paused: false,
        get concurrency() {
          return _concurrency;
        },
        set concurrency(value) {
          if (!(value >= 1)) {
            throw new Error("fastqueue concurrency must be equal to or greater than 1");
          }
          _concurrency = value;
          if (self.paused) return;
          for (; queueHead && _running < _concurrency; ) {
            _running++;
            release();
          }
        },
        running,
        resume,
        idle,
        length,
        getQueue,
        unshift,
        empty: noop3,
        kill,
        killAndDrain,
        error,
        abort
      };
      return self;
      function running() {
        return _running;
      }
      function pause() {
        self.paused = true;
      }
      function length() {
        var current = queueHead;
        var counter = 0;
        while (current) {
          current = current.next;
          counter++;
        }
        return counter;
      }
      function getQueue() {
        var current = queueHead;
        var tasks = [];
        while (current) {
          tasks.push(current.value);
          current = current.next;
        }
        return tasks;
      }
      function resume() {
        if (!self.paused) return;
        self.paused = false;
        if (queueHead === null) {
          _running++;
          release();
          return;
        }
        for (; queueHead && _running < _concurrency; ) {
          _running++;
          release();
        }
      }
      function idle() {
        return _running === 0 && self.length() === 0;
      }
      function push(value, done) {
        var current = cache3.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop3;
        current.errorHandler = errorHandler;
        if (_running >= _concurrency || self.paused) {
          if (queueTail) {
            queueTail.next = current;
            queueTail = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function unshift(value, done) {
        var current = cache3.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop3;
        current.errorHandler = errorHandler;
        if (_running >= _concurrency || self.paused) {
          if (queueHead) {
            current.next = queueHead;
            queueHead = current;
          } else {
            queueHead = current;
            queueTail = current;
            self.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function release(holder) {
        if (holder) {
          cache3.release(holder);
        }
        var next = queueHead;
        if (next && _running <= _concurrency) {
          if (!self.paused) {
            if (queueTail === queueHead) {
              queueTail = null;
            }
            queueHead = next.next;
            next.next = null;
            worker.call(context, next.value, next.worked);
            if (queueTail === null) {
              self.empty();
            }
          } else {
            _running--;
          }
        } else if (--_running === 0) {
          self.drain();
        }
      }
      function kill() {
        queueHead = null;
        queueTail = null;
        self.drain = noop3;
      }
      function killAndDrain() {
        queueHead = null;
        queueTail = null;
        self.drain();
        self.drain = noop3;
      }
      function abort() {
        var current = queueHead;
        queueHead = null;
        queueTail = null;
        while (current) {
          var next = current.next;
          var callback = current.callback;
          var errorHandler2 = current.errorHandler;
          var val = current.value;
          var context2 = current.context;
          current.value = null;
          current.callback = noop3;
          current.errorHandler = null;
          if (errorHandler2) {
            errorHandler2(new Error("abort"), val);
          }
          callback.call(context2, new Error("abort"));
          current.release(current);
          current = next;
        }
        self.drain = noop3;
      }
      function error(handler2) {
        errorHandler = handler2;
      }
    }
    function noop3() {}
    function Task() {
      this.value = null;
      this.callback = noop3;
      this.next = null;
      this.release = noop3;
      this.context = null;
      this.errorHandler = null;
      var self = this;
      this.worked = function worked(err, result) {
        var callback = self.callback;
        var errorHandler = self.errorHandler;
        var val = self.value;
        self.value = null;
        self.callback = noop3;
        if (self.errorHandler) {
          errorHandler(err, val);
        }
        callback.call(self.context, err, result);
        self.release(self);
      };
    }
    function queueAsPromised(context, worker, _concurrency) {
      if (typeof context === "function") {
        _concurrency = worker;
        worker = context;
        context = null;
      }
      function asyncWrapper(arg, cb) {
        worker.call(this, arg).then(function (res) {
          cb(null, res);
        }, cb);
      }
      var queue = fastqueue(context, asyncWrapper, _concurrency);
      var pushCb = queue.push;
      var unshiftCb = queue.unshift;
      queue.push = push;
      queue.unshift = unshift;
      queue.drained = drained;
      return queue;
      function push(value) {
        var p = new Promise(function (resolve, reject) {
          pushCb(value, function (err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop3);
        return p;
      }
      function unshift(value) {
        var p = new Promise(function (resolve, reject) {
          unshiftCb(value, function (err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop3);
        return p;
      }
      function drained() {
        var p = new Promise(function (resolve) {
          process.nextTick(function () {
            if (queue.idle()) {
              resolve();
            } else {
              var previousDrain = queue.drain;
              queue.drain = function () {
                if (typeof previousDrain === "function") previousDrain();
                resolve();
                queue.drain = previousDrain;
              };
            }
          });
        });
        return p;
      }
    }
    module2.exports = fastqueue;
    module2.exports.promise = queueAsPromised;
  }
});

// ../node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common2 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/readers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments =
      exports2.replacePathSegmentSeparator =
      exports2.isAppliedFilter =
      exports2.isFatalError =
        void 0;
    function isFatalError(settings, error) {
      if (settings.errorFilter === null) {
        return true;
      }
      return !settings.errorFilter(error);
    }
    exports2.isFatalError = isFatalError;
    function isAppliedFilter(filter, value) {
      return filter === null || filter(value);
    }
    exports2.isAppliedFilter = isAppliedFilter;
    function replacePathSegmentSeparator(filepath, separator) {
      return filepath.split(/[/\\]/).join(separator);
    }
    exports2.replacePathSegmentSeparator = replacePathSegmentSeparator;
    function joinPathSegments(a, b, separator) {
      if (a === "") {
        return b;
      }
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// ../node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var common = require_common2();
    var Reader = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
      }
    };
    exports2.default = Reader;
  }
});

// ../node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async3 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require("events");
    var fsScandir = require_out2();
    var fastq = require_queue();
    var common = require_common2();
    var reader_1 = require_reader();
    var AsyncReader = class extends reader_1.default {
      constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
          if (!this._isFatalError) {
            this._emitter.emit("end");
          }
        };
      }
      read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
          this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
      }
      get isDestroyed() {
        return this._isDestroyed;
      }
      destroy() {
        if (this._isDestroyed) {
          throw new Error("The reader is already destroyed");
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
      }
      onEntry(callback) {
        this._emitter.on("entry", callback);
      }
      onError(callback) {
        this._emitter.once("error", callback);
      }
      onEnd(callback) {
        this._emitter.once("end", callback);
      }
      _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
          if (error !== null) {
            this._handleError(error);
          }
        });
      }
      _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
          if (error !== null) {
            done(error, void 0);
            return;
          }
          for (const entry of entries) {
            this._handleEntry(entry, item.base);
          }
          done(null, void 0);
        });
      }
      _handleError(error) {
        if (this._isDestroyed || !common.isFatalError(this._settings, error)) {
          return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit("error", error);
      }
      _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
          return;
        }
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(
            base,
            entry.name,
            this._settings.pathSegmentSeparator
          );
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._emitEntry(entry);
        }
        if (
          entry.dirent.isDirectory() &&
          common.isAppliedFilter(this._settings.deepFilter, entry)
        ) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _emitEntry(entry) {
        this._emitter.emit("entry", entry);
      }
    };
    exports2.default = AsyncReader;
  }
});

// ../node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async4 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async3();
    var AsyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = [];
      }
      read(callback) {
        this._reader.onError((error) => {
          callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
          this._storage.push(entry);
        });
        this._reader.onEnd(() => {
          callSuccessCallback(callback, this._storage);
        });
        this._reader.read();
      }
    };
    exports2.default = AsyncProvider;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, entries) {
      callback(null, entries);
    }
  }
});

// ../node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream2 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var async_1 = require_async3();
    var StreamProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
          objectMode: true,
          read: () => {},
          destroy: () => {
            if (!this._reader.isDestroyed) {
              this._reader.destroy();
            }
          }
        });
      }
      read() {
        this._reader.onError((error) => {
          this._stream.emit("error", error);
        });
        this._reader.onEntry((entry) => {
          this._stream.push(entry);
        });
        this._reader.onEnd(() => {
          this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
      }
    };
    exports2.default = StreamProvider;
  }
});

// ../node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync3 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsScandir = require_out2();
    var common = require_common2();
    var reader_1 = require_reader();
    var SyncReader = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = [];
        this._queue = /* @__PURE__ */ new Set();
      }
      read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return this._storage;
      }
      _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
      }
      _handleQueue() {
        for (const item of this._queue.values()) {
          this._handleDirectory(item.directory, item.base);
        }
      }
      _handleDirectory(directory, base) {
        try {
          const entries = this._scandir(directory, this._settings.fsScandirSettings);
          for (const entry of entries) {
            this._handleEntry(entry, base);
          }
        } catch (error) {
          this._handleError(error);
        }
      }
      _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
          return;
        }
        throw error;
      }
      _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(
            base,
            entry.name,
            this._settings.pathSegmentSeparator
          );
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._pushToStorage(entry);
        }
        if (
          entry.dirent.isDirectory() &&
          common.isAppliedFilter(this._settings.deepFilter, entry)
        ) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _pushToStorage(entry) {
        this._storage.push(entry);
      }
    };
    exports2.default = SyncReader;
  }
});

// ../node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync4 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync3();
    var SyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
      }
      read() {
        return this._reader.read();
      }
    };
    exports2.default = SyncProvider;
  }
});

// ../node_modules/@nodelib/fs.walk/out/settings.js
var require_settings3 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path11 = require("path");
    var fsScandir = require_out2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, void 0);
        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path11.sep);
        this.fsScandirSettings = new fsScandir.Settings({
          followSymbolicLinks: this._options.followSymbolicLinks,
          fs: this._options.fs,
          pathSegmentSeparator: this._options.pathSegmentSeparator,
          stats: this._options.stats,
          throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// ../node_modules/@nodelib/fs.walk/out/index.js
var require_out3 = __commonJS({
  "../node_modules/@nodelib/fs.walk/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.walkStream = exports2.walkSync = exports2.walk = void 0;
    var async_1 = require_async4();
    var stream_1 = require_stream2();
    var sync_1 = require_sync4();
    var settings_1 = require_settings3();
    exports2.Settings = settings_1.default;
    function walk(directory, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
        return;
      }
      new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
    }
    exports2.walk = walk;
    function walkSync(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new sync_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkSync = walkSync;
    function walkStream(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new stream_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkStream = walkStream;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// ../node_modules/fast-glob/out/readers/reader.js
var require_reader2 = __commonJS({
  "../node_modules/fast-glob/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path11 = require("path");
    var fsStat = require_out();
    var utils = require_utils3();
    var Reader = class {
      constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
      }
      _getFullEntryPath(filepath) {
        return path11.resolve(this._settings.cwd, filepath);
      }
      _makeEntry(stats, pattern) {
        const entry = {
          name: pattern,
          path: pattern,
          dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
          entry.stats = stats;
        }
        return entry;
      }
      _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
      }
    };
    exports2.default = Reader;
  }
});

// ../node_modules/fast-glob/out/readers/stream.js
var require_stream3 = __commonJS({
  "../node_modules/fast-glob/out/readers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderStream = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
      }
      dynamic(root, options) {
        return this._walkStream(root, options);
      }
      static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
          return this._getEntry(filepaths[index], patterns[index], options)
            .then((entry) => {
              if (entry !== null && options.entryFilter(entry)) {
                stream.push(entry);
              }
              if (index === filepaths.length - 1) {
                stream.end();
              }
              done();
            })
            .catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
          stream.write(i);
        }
        return stream;
      }
      _getEntry(filepath, pattern, options) {
        return this._getStat(filepath)
          .then((stats) => this._makeEntry(stats, pattern))
          .catch((error) => {
            if (options.errorFilter(error)) {
              return null;
            }
            throw error;
          });
      }
      _getStat(filepath) {
        return new Promise((resolve, reject) => {
          this._stat(filepath, this._fsStatSettings, (error, stats) => {
            return error === null ? resolve(stats) : reject(error);
          });
        });
      }
    };
    exports2.default = ReaderStream;
  }
});

// ../node_modules/fast-glob/out/readers/async.js
var require_async5 = __commonJS({
  "../node_modules/fast-glob/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var stream_1 = require_stream3();
    var ReaderAsync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkAsync = fsWalk.walk;
        this._readerStream = new stream_1.default(this._settings);
      }
      dynamic(root, options) {
        return new Promise((resolve, reject) => {
          this._walkAsync(root, options, (error, entries) => {
            if (error === null) {
              resolve(entries);
            } else {
              reject(error);
            }
          });
        });
      }
      async static(patterns, options) {
        const entries = [];
        const stream = this._readerStream.static(patterns, options);
        return new Promise((resolve, reject) => {
          stream.once("error", reject);
          stream.on("data", (entry) => entries.push(entry));
          stream.once("end", () => resolve(entries));
        });
      }
    };
    exports2.default = ReaderAsync;
  }
});

// ../node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS({
  "../node_modules/fast-glob/out/providers/matchers/matcher.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var Matcher = class {
      constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
      }
      _fillStorage() {
        for (const pattern of this._patterns) {
          const segments = this._getPatternSegments(pattern);
          const sections = this._splitSegmentsIntoSections(segments);
          this._storage.push({
            complete: sections.length <= 1,
            pattern,
            segments,
            sections
          });
        }
      }
      _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
          const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
          if (!dynamic) {
            return {
              dynamic: false,
              pattern: part
            };
          }
          return {
            dynamic: true,
            pattern: part,
            patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
          };
        });
      }
      _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(
          segments,
          (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern)
        );
      }
    };
    exports2.default = Matcher;
  }
});

// ../node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS({
  "../node_modules/fast-glob/out/providers/matchers/partial.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var matcher_1 = require_matcher();
    var PartialMatcher = class extends matcher_1.default {
      match(filepath) {
        const parts = filepath.split("/");
        const levels = parts.length;
        const patterns = this._storage.filter(
          (info) => !info.complete || info.segments.length > levels
        );
        for (const pattern of patterns) {
          const section = pattern.sections[0];
          if (!pattern.complete && levels > section.length) {
            return true;
          }
          const match = parts.every((part, index) => {
            const segment = pattern.segments[index];
            if (segment.dynamic && segment.patternRe.test(part)) {
              return true;
            }
            if (!segment.dynamic && segment.pattern === part) {
              return true;
            }
            return false;
          });
          if (match) {
            return true;
          }
        }
        return false;
      }
    };
    exports2.default = PartialMatcher;
  }
});

// ../node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS({
  "../node_modules/fast-glob/out/providers/filters/deep.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var partial_1 = require_partial();
    var DeepFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
      }
      getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
      }
      _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
      }
      _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(
          utils.pattern.isAffectDepthOfReadingPattern
        );
        return utils.pattern.convertPatternsToRe(
          affectDepthOfReadingPatterns,
          this._micromatchOptions
        );
      }
      _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
          return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
          return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
          return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
      }
      _isSkippedByDeep(basePath, entryPath) {
        if (this._settings.deep === Infinity) {
          return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
      }
      _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split("/").length;
        if (basePath === "") {
          return entryPathDepth;
        }
        const basePathDepth = basePath.split("/").length;
        return entryPathDepth - basePathDepth;
      }
      _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
      }
      _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
      }
      _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
      }
    };
    exports2.default = DeepFilter;
  }
});

// ../node_modules/fast-glob/out/providers/filters/entry.js
var require_entry = __commonJS({
  "../node_modules/fast-glob/out/providers/filters/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = /* @__PURE__ */ new Map();
      }
      getFilter(positive, negative) {
        const [absoluteNegative, relativeNegative] =
          utils.pattern.partitionAbsoluteAndRelative(negative);
        const patterns = {
          positive: {
            all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions)
          },
          negative: {
            absolute: utils.pattern.convertPatternsToRe(
              absoluteNegative,
              Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })
            ),
            relative: utils.pattern.convertPatternsToRe(
              relativeNegative,
              Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })
            )
          }
        };
        return (entry) => this._filter(entry, patterns);
      }
      _filter(entry, patterns) {
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
          return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
          return false;
        }
        const isMatched = this._isMatchToPatternsSet(
          filepath,
          patterns,
          entry.dirent.isDirectory()
        );
        if (this._settings.unique && isMatched) {
          this._createIndexRecord(filepath);
        }
        return isMatched;
      }
      _isDuplicateEntry(filepath) {
        return this.index.has(filepath);
      }
      _createIndexRecord(filepath) {
        this.index.set(filepath, void 0);
      }
      _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
      }
      _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
      }
      _isMatchToPatternsSet(filepath, patterns, isDirectory) {
        const isMatched = this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory);
        if (!isMatched) {
          return false;
        }
        const isMatchedByRelativeNegative = this._isMatchToPatterns(
          filepath,
          patterns.negative.relative,
          isDirectory
        );
        if (isMatchedByRelativeNegative) {
          return false;
        }
        const isMatchedByAbsoluteNegative = this._isMatchToAbsoluteNegative(
          filepath,
          patterns.negative.absolute,
          isDirectory
        );
        if (isMatchedByAbsoluteNegative) {
          return false;
        }
        return true;
      }
      _isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
        if (patternsRe.length === 0) {
          return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
        return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
      }
      _isMatchToPatterns(filepath, patternsRe, isDirectory) {
        if (patternsRe.length === 0) {
          return false;
        }
        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
        if (!isMatched && isDirectory) {
          return utils.pattern.matchAny(filepath + "/", patternsRe);
        }
        return isMatched;
      }
    };
    exports2.default = EntryFilter;
  }
});

// ../node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS({
  "../node_modules/fast-glob/out/providers/filters/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var ErrorFilter = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getFilter() {
        return (error) => this._isNonFatalError(error);
      }
      _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
      }
    };
    exports2.default = ErrorFilter;
  }
});

// ../node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry2 = __commonJS({
  "../node_modules/fast-glob/out/providers/transformers/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryTransformer = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getTransformer() {
        return (entry) => this._transform(entry);
      }
      _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
          filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
          filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
          filepath += "/";
        }
        if (!this._settings.objectMode) {
          return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
      }
    };
    exports2.default = EntryTransformer;
  }
});

// ../node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS({
  "../node_modules/fast-glob/out/providers/provider.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path11 = require("path");
    var deep_1 = require_deep();
    var entry_1 = require_entry();
    var error_1 = require_error();
    var entry_2 = require_entry2();
    var Provider = class {
      constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
      }
      _getRootDirectory(task) {
        return path11.resolve(this._settings.cwd, task.base);
      }
      _getReaderOptions(task) {
        const basePath = task.base === "." ? "" : task.base;
        return {
          basePath,
          pathSegmentSeparator: "/",
          concurrency: this._settings.concurrency,
          deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
          entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
          errorFilter: this.errorFilter.getFilter(),
          followSymbolicLinks: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          stats: this._settings.stats,
          throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
          transform: this.entryTransformer.getTransformer()
        };
      }
      _getMicromatchOptions() {
        return {
          dot: this._settings.dot,
          matchBase: this._settings.baseNameMatch,
          nobrace: !this._settings.braceExpansion,
          nocase: !this._settings.caseSensitiveMatch,
          noext: !this._settings.extglob,
          noglobstar: !this._settings.globstar,
          posix: true,
          strictSlashes: false
        };
      }
    };
    exports2.default = Provider;
  }
});

// ../node_modules/fast-glob/out/providers/async.js
var require_async6 = __commonJS({
  "../node_modules/fast-glob/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async5();
    var provider_1 = require_provider();
    var ProviderAsync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new async_1.default(this._settings);
      }
      async read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = await this.api(root, task, options);
        return entries.map((entry) => options.transform(entry));
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderAsync;
  }
});

// ../node_modules/fast-glob/out/providers/stream.js
var require_stream4 = __commonJS({
  "../node_modules/fast-glob/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var stream_2 = require_stream3();
    var provider_1 = require_provider();
    var ProviderStream = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => {} });
        source
          .once("error", (error) => destination.emit("error", error))
          .on("data", (entry) => destination.emit("data", options.transform(entry)))
          .once("end", () => destination.emit("end"));
        destination.once("close", () => source.destroy());
        return destination;
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderStream;
  }
});

// ../node_modules/fast-glob/out/readers/sync.js
var require_sync5 = __commonJS({
  "../node_modules/fast-glob/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderSync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
      }
      dynamic(root, options) {
        return this._walkSync(root, options);
      }
      static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
          const filepath = this._getFullEntryPath(pattern);
          const entry = this._getEntry(filepath, pattern, options);
          if (entry === null || !options.entryFilter(entry)) {
            continue;
          }
          entries.push(entry);
        }
        return entries;
      }
      _getEntry(filepath, pattern, options) {
        try {
          const stats = this._getStat(filepath);
          return this._makeEntry(stats, pattern);
        } catch (error) {
          if (options.errorFilter(error)) {
            return null;
          }
          throw error;
        }
      }
      _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
      }
    };
    exports2.default = ReaderSync;
  }
});

// ../node_modules/fast-glob/out/providers/sync.js
var require_sync6 = __commonJS({
  "../node_modules/fast-glob/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync5();
    var provider_1 = require_provider();
    var ProviderSync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderSync;
  }
});

// ../node_modules/fast-glob/out/settings.js
var require_settings4 = __commonJS({
  "../node_modules/fast-glob/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
    var fs9 = require("fs");
    var os = require("os");
    var CPU_COUNT = Math.max(os.cpus().length, 1);
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = {
      lstat: fs9.lstat,
      lstatSync: fs9.lstatSync,
      stat: fs9.stat,
      statSync: fs9.statSync,
      readdir: fs9.readdir,
      readdirSync: fs9.readdirSync
    };
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(
          this._options.throwErrorOnBrokenSymbolicLink,
          false
        );
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
          this.onlyFiles = false;
        }
        if (this.stats) {
          this.objectMode = true;
        }
        this.ignore = [].concat(this.ignore);
      }
      _getValue(option, value) {
        return option === void 0 ? value : option;
      }
      _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports2.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
      }
    };
    exports2.default = Settings;
  }
});

// ../node_modules/fast-glob/out/index.js
var require_out4 = __commonJS({
  "../node_modules/fast-glob/out/index.js"(exports2, module2) {
    "use strict";
    var taskManager = require_tasks();
    var async_1 = require_async6();
    var stream_1 = require_stream4();
    var sync_1 = require_sync6();
    var settings_1 = require_settings4();
    var utils = require_utils3();
    async function FastGlob(source, options) {
      assertPatternsInput(source);
      const works = getWorks(source, async_1.default, options);
      const result = await Promise.all(works);
      return utils.array.flatten(result);
    }
    (function (FastGlob2) {
      FastGlob2.glob = FastGlob2;
      FastGlob2.globSync = sync;
      FastGlob2.globStream = stream;
      FastGlob2.async = FastGlob2;
      function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
      }
      FastGlob2.sync = sync;
      function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        return utils.stream.merge(works);
      }
      FastGlob2.stream = stream;
      function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
      }
      FastGlob2.generateTasks = generateTasks;
      function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
      }
      FastGlob2.isDynamicPattern = isDynamicPattern;
      function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
      }
      FastGlob2.escapePath = escapePath;
      function convertPathToPattern(source) {
        assertPatternsInput(source);
        return utils.path.convertPathToPattern(source);
      }
      FastGlob2.convertPathToPattern = convertPathToPattern;
      let posix;
      (function (posix2) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapePosixPath(source);
        }
        posix2.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertPosixPathToPattern(source);
        }
        posix2.convertPathToPattern = convertPathToPattern2;
      })((posix = FastGlob2.posix || (FastGlob2.posix = {})));
      let win32;
      (function (win322) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapeWindowsPath(source);
        }
        win322.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertWindowsPathToPattern(source);
        }
        win322.convertPathToPattern = convertPathToPattern2;
      })((win32 = FastGlob2.win32 || (FastGlob2.win32 = {})));
    })(FastGlob || (FastGlob = {}));
    function getWorks(source, _Provider, options) {
      const patterns = [].concat(source);
      const settings = new settings_1.default(options);
      const tasks = taskManager.generate(patterns, settings);
      const provider = new _Provider(settings);
      return tasks.map(provider.read, provider);
    }
    function assertPatternsInput(input) {
      const source = [].concat(input);
      const isValidSource = source.every(
        (item) => utils.string.isString(item) && !utils.string.isEmpty(item)
      );
      if (!isValidSource) {
        throw new TypeError("Patterns must be a string (non empty) or an array of strings");
      }
    }
    module2.exports = FastGlob;
  }
});

// ../node_modules/ms/index.js
var require_ms = __commonJS({
  "../node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function (val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str
        );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// ../node_modules/debug/src/common.js
var require_common3 = __commonJS({
  "../node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug3(...args) {
          if (!debug3.enabled) {
            return;
          }
          const self = debug3;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug3.namespace = namespace;
        debug3.useColors = createDebug.useColors();
        debug3.color = createDebug.selectColor(namespace);
        debug3.extend = extend;
        debug3.destroy = createDebug.destroy;
        Object.defineProperty(debug3, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug3);
        }
        return debug3;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(
          this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace
        );
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "")
          .trim()
          .replace(/\s+/g, ",")
          .split(",")
          .filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (
            templateIndex < template.length &&
            (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")
          ) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn(
          "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
        );
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// ../node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "../node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn(
            "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
          );
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (
        typeof window !== "undefined" &&
        window.process &&
        (window.process.type === "renderer" || window.process.__nwjs)
      ) {
        return true;
      }
      if (
        typeof navigator !== "undefined" &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ) {
        return false;
      }
      let m;
      return (
        (typeof document !== "undefined" &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) || // Is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== "undefined" &&
          window.console &&
          (window.console.firebug || (window.console.exception && window.console.table))) || // Is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== "undefined" &&
          navigator.userAgent &&
          (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) &&
          parseInt(m[1], 10) >= 31) || // Double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== "undefined" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
      );
    }
    function formatArgs(args) {
      args[0] =
        (this.useColors ? "%c" : "") +
        this.namespace +
        (this.useColors ? " %c" : " ") +
        args[0] +
        (this.useColors ? "%c " : " ") +
        "+" +
        module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {});
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {}
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error) {}
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {}
    }
    module2.exports = require_common3()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function (v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// ../node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "../node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// ../node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "../node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (
      hasFlag("no-color") ||
      hasFlag("no-colors") ||
      hasFlag("color=false") ||
      hasFlag("color=never")
    ) {
      forceColor = 0;
    } else if (
      hasFlag("color") ||
      hasFlag("colors") ||
      hasFlag("color=true") ||
      hasFlag("color=always")
    ) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor =
          env2.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (
          ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some(
            (sign) => sign in env2
          ) ||
          env2.CI_NAME === "codeship"
        ) {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// ../node_modules/debug/src/node.js
var require_node = __commonJS({
  "../node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {},
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75,
          76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161,
          162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197,
          198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221
        ];
      }
    } catch (error) {}
    exports2.inspectOpts = Object.keys(process.env)
      .filter((key) => {
        return /^debug_/i.test(key);
      })
      .reduce((obj, key) => {
        const prop = key
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (_, k) => {
            return k.toUpperCase();
          });
        let val = process.env[key];
        if (/^(yes|on|true|enabled)$/i.test(val)) {
          val = true;
        } else if (/^(no|off|false|disabled)$/i.test(val)) {
          val = false;
        } else if (val === "null") {
          val = null;
        } else {
          val = Number(val);
        }
        obj[prop] = val;
        return obj;
      }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts
        ? Boolean(exports2.inspectOpts.colors)
        : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return /* @__PURE__ */ new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug3) {
      debug3.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug3.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common3()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util
        .inspect(v, this.inspectOpts)
        .split("\n")
        .map((str) => str.trim())
        .join(" ");
    };
    formatters.O = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// ../node_modules/debug/src/index.js
var require_src = __commonJS({
  "../node_modules/debug/src/index.js"(exports2, module2) {
    if (
      typeof process === "undefined" ||
      process.type === "renderer" ||
      process.browser === true ||
      process.__nwjs
    ) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// ../node_modules/@kwsites/file-exists/dist/src/index.js
var require_src2 = __commonJS({
  "../node_modules/@kwsites/file-exists/dist/src/index.js"(exports2) {
    "use strict";
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs_1 = require("fs");
    var debug_1 = __importDefault(require_src());
    var log = debug_1.default("@kwsites/file-exists");
    function check(path11, isFile, isDirectory) {
      log(`checking %s`, path11);
      try {
        const stat = fs_1.statSync(path11);
        if (stat.isFile() && isFile) {
          log(`[OK] path represents a file`);
          return true;
        }
        if (stat.isDirectory() && isDirectory) {
          log(`[OK] path represents a directory`);
          return true;
        }
        log(`[FAIL] path represents something other than a file or directory`);
        return false;
      } catch (e) {
        if (e.code === "ENOENT") {
          log(`[FAIL] path is not accessible: %o`, e);
          return false;
        }
        log(`[FATAL] %o`, e);
        throw e;
      }
    }
    function exists3(path11, type = exports2.READABLE) {
      return check(path11, (type & exports2.FILE) > 0, (type & exports2.FOLDER) > 0);
    }
    exports2.exists = exists3;
    exports2.FILE = 1;
    exports2.FOLDER = 2;
    exports2.READABLE = exports2.FILE + exports2.FOLDER;
  }
});

// ../node_modules/@kwsites/file-exists/dist/index.js
var require_dist = __commonJS({
  "../node_modules/@kwsites/file-exists/dist/index.js"(exports2) {
    "use strict";
    function __export4(m) {
      for (var p in m) if (!exports2.hasOwnProperty(p)) exports2[p] = m[p];
    }
    Object.defineProperty(exports2, "__esModule", { value: true });
    __export4(require_src2());
  }
});

// ../node_modules/@kwsites/promise-deferred/dist/index.js
var require_dist2 = __commonJS({
  "../node_modules/@kwsites/promise-deferred/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDeferred = exports2.deferred = void 0;
    function deferred3() {
      let done;
      let fail;
      let status = "pending";
      const promise = new Promise((_done, _fail) => {
        done = _done;
        fail = _fail;
      });
      return {
        promise,
        done(result) {
          if (status === "pending") {
            status = "resolved";
            done(result);
          }
        },
        fail(error) {
          if (status === "pending") {
            status = "rejected";
            fail(error);
          }
        },
        get fulfilled() {
          return status !== "pending";
        },
        get status() {
          return status;
        }
      };
    }
    exports2.deferred = deferred3;
    exports2.createDeferred = deferred3;
    exports2.default = deferred3;
  }
});

// ../node_modules/fast-content-type-parse/index.js
var require_fast_content_type_parse = __commonJS({
  "../node_modules/fast-content-type-parse/index.js"(exports2, module2) {
    "use strict";
    var NullObject = function NullObject2() {};
    NullObject.prototype = /* @__PURE__ */ Object.create(null);
    var paramRE =
      /; *([!#$%&'*+.^\w`|~-]+)=("(?:[\v\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\v\u0020-\u00ff])*"|[!#$%&'*+.^\w`|~-]+) */gu;
    var quotedPairRE = /\\([\v\u0020-\u00ff])/gu;
    var mediaTypeRE = /^[!#$%&'*+.^\w|~-]+\/[!#$%&'*+.^\w|~-]+$/u;
    var defaultContentType = { type: "", parameters: new NullObject() };
    Object.freeze(defaultContentType.parameters);
    Object.freeze(defaultContentType);
    function parse2(header) {
      if (typeof header !== "string") {
        throw new TypeError("argument header is required and must be a string");
      }
      let index = header.indexOf(";");
      const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (mediaTypeRE.test(type) === false) {
        throw new TypeError("invalid media type");
      }
      const result = {
        type: type.toLowerCase(),
        parameters: new NullObject()
      };
      if (index === -1) {
        return result;
      }
      let key;
      let match;
      let value;
      paramRE.lastIndex = index;
      while ((match = paramRE.exec(header))) {
        if (match.index !== index) {
          throw new TypeError("invalid parameter format");
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.slice(1, value.length - 1);
          quotedPairRE.test(value) && (value = value.replace(quotedPairRE, "$1"));
        }
        result.parameters[key] = value;
      }
      if (index !== header.length) {
        throw new TypeError("invalid parameter format");
      }
      return result;
    }
    function safeParse2(header) {
      if (typeof header !== "string") {
        return defaultContentType;
      }
      let index = header.indexOf(";");
      const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (mediaTypeRE.test(type) === false) {
        return defaultContentType;
      }
      const result = {
        type: type.toLowerCase(),
        parameters: new NullObject()
      };
      if (index === -1) {
        return result;
      }
      let key;
      let match;
      let value;
      paramRE.lastIndex = index;
      while ((match = paramRE.exec(header))) {
        if (match.index !== index) {
          return defaultContentType;
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.slice(1, value.length - 1);
          quotedPairRE.test(value) && (value = value.replace(quotedPairRE, "$1"));
        }
        result.parameters[key] = value;
      }
      if (index !== header.length) {
        return defaultContentType;
      }
      return result;
    }
    module2.exports.default = { parse: parse2, safeParse: safeParse2 };
    module2.exports.parse = parse2;
    module2.exports.safeParse = safeParse2;
    module2.exports.defaultContentType = defaultContentType;
  }
});

// node_modules/ms/index.js
var require_ms2 = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function (val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str
        );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common4 = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms2();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug3(...args) {
          if (!debug3.enabled) {
            return;
          }
          const self = debug3;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug3.namespace = namespace;
        debug3.useColors = createDebug.useColors();
        debug3.color = createDebug.selectColor(namespace);
        debug3.extend = extend;
        debug3.destroy = createDebug.destroy;
        Object.defineProperty(debug3, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug3);
        }
        return debug3;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(
          this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace
        );
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "")
          .trim()
          .replace(/\s+/g, ",")
          .split(",")
          .filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (
            templateIndex < template.length &&
            (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")
          ) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn(
          "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
        );
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser2 = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn(
            "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
          );
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (
        typeof window !== "undefined" &&
        window.process &&
        (window.process.type === "renderer" || window.process.__nwjs)
      ) {
        return true;
      }
      if (
        typeof navigator !== "undefined" &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ) {
        return false;
      }
      let m;
      return (
        (typeof document !== "undefined" &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) || // Is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== "undefined" &&
          window.console &&
          (window.console.firebug || (window.console.exception && window.console.table))) || // Is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== "undefined" &&
          navigator.userAgent &&
          (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) &&
          parseInt(m[1], 10) >= 31) || // Double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== "undefined" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
      );
    }
    function formatArgs(args) {
      args[0] =
        (this.useColors ? "%c" : "") +
        this.namespace +
        (this.useColors ? " %c" : " ") +
        args[0] +
        (this.useColors ? "%c " : " ") +
        "+" +
        module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {});
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {}
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error) {}
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {}
    }
    module2.exports = require_common4()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function (v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node2 = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {},
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75,
          76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161,
          162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197,
          198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221
        ];
      }
    } catch (error) {}
    exports2.inspectOpts = Object.keys(process.env)
      .filter((key) => {
        return /^debug_/i.test(key);
      })
      .reduce((obj, key) => {
        const prop = key
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (_, k) => {
            return k.toUpperCase();
          });
        let val = process.env[key];
        if (/^(yes|on|true|enabled)$/i.test(val)) {
          val = true;
        } else if (/^(no|off|false|disabled)$/i.test(val)) {
          val = false;
        } else if (val === "null") {
          val = null;
        } else {
          val = Number(val);
        }
        obj[prop] = val;
        return obj;
      }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts
        ? Boolean(exports2.inspectOpts.colors)
        : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return /* @__PURE__ */ new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug3) {
      debug3.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug3.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common4()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util
        .inspect(v, this.inspectOpts)
        .split("\n")
        .map((str) => str.trim())
        .join(" ");
    };
    formatters.O = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src3 = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (
      typeof process === "undefined" ||
      process.type === "renderer" ||
      process.browser === true ||
      process.__nwjs
    ) {
      module2.exports = require_browser2();
    } else {
      module2.exports = require_node2();
    }
  }
});

// node_modules/@kwsites/file-exists/dist/src/index.js
var require_src4 = __commonJS({
  "node_modules/@kwsites/file-exists/dist/src/index.js"(exports2) {
    "use strict";
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs_1 = require("fs");
    var debug_1 = __importDefault(require_src3());
    var log = debug_1.default("@kwsites/file-exists");
    function check(path11, isFile, isDirectory) {
      log(`checking %s`, path11);
      try {
        const stat = fs_1.statSync(path11);
        if (stat.isFile() && isFile) {
          log(`[OK] path represents a file`);
          return true;
        }
        if (stat.isDirectory() && isDirectory) {
          log(`[OK] path represents a directory`);
          return true;
        }
        log(`[FAIL] path represents something other than a file or directory`);
        return false;
      } catch (e) {
        if (e.code === "ENOENT") {
          log(`[FAIL] path is not accessible: %o`, e);
          return false;
        }
        log(`[FATAL] %o`, e);
        throw e;
      }
    }
    function exists3(path11, type = exports2.READABLE) {
      return check(path11, (type & exports2.FILE) > 0, (type & exports2.FOLDER) > 0);
    }
    exports2.exists = exists3;
    exports2.FILE = 1;
    exports2.FOLDER = 2;
    exports2.READABLE = exports2.FILE + exports2.FOLDER;
  }
});

// node_modules/@kwsites/file-exists/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/@kwsites/file-exists/dist/index.js"(exports2) {
    "use strict";
    function __export4(m) {
      for (var p in m) if (!exports2.hasOwnProperty(p)) exports2[p] = m[p];
    }
    Object.defineProperty(exports2, "__esModule", { value: true });
    __export4(require_src4());
  }
});

// node_modules/@kwsites/promise-deferred/dist/index.js
var require_dist4 = __commonJS({
  "node_modules/@kwsites/promise-deferred/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDeferred = exports2.deferred = void 0;
    function deferred3() {
      let done;
      let fail;
      let status = "pending";
      const promise = new Promise((_done, _fail) => {
        done = _done;
        fail = _fail;
      });
      return {
        promise,
        done(result) {
          if (status === "pending") {
            status = "resolved";
            done(result);
          }
        },
        fail(error) {
          if (status === "pending") {
            status = "rejected";
            fail(error);
          }
        },
        get fulfilled() {
          return status !== "pending";
        },
        get status() {
          return status;
        }
      };
    }
    exports2.deferred = deferred3;
    exports2.createDeferred = deferred3;
    exports2.default = deferred3;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode12 = __toESM(require("vscode"));

// src/commands/analyze.ts
var vscode = __toESM(require("vscode"));

// ../src/services/analyzer.ts
var import_promises3 = __toESM(require("fs/promises"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_fast_glob = __toESM(require_out4(), 1);

// ../src/utils/fs.ts
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);
async function ensureDir(dirPath) {
  await import_promises.default.mkdir(dirPath, { recursive: true });
}
async function safeWriteFile(filePath, content, force) {
  const resolved = import_path.default.resolve(filePath);
  try {
    const stat = await import_promises.default.lstat(resolved);
    if (stat.isSymbolicLink()) {
      return { wrote: false, reason: "symlink" };
    }
    if (!force) {
      return { wrote: false, reason: "exists" };
    }
  } catch {}
  await import_promises.default.writeFile(resolved, content, "utf8");
  return { wrote: true };
}
async function fileExists(filePath) {
  try {
    await import_promises.default.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function safeReadDir(dirPath) {
  try {
    return await import_promises.default.readdir(dirPath);
  } catch {
    return [];
  }
}
async function readJson(filePath) {
  try {
    const raw = await import_promises.default.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return void 0;
  }
}
function buildTimestampedName(baseName, extension = ".json") {
  const stamp = /* @__PURE__ */ new Date().toISOString().replace(/[:.]/gu, "-");
  return `${baseName}-${stamp}${extension}`;
}

// ../src/services/git.ts
var import_promises2 = __toESM(require("fs/promises"), 1);
var import_path2 = __toESM(require("path"), 1);

// ../node_modules/simple-git/dist/esm/index.js
var import_node_buffer = require("node:buffer");
var import_file_exists = __toESM(require_dist(), 1);
var import_debug = __toESM(require_src(), 1);
var import_child_process = require("child_process");
var import_promise_deferred = __toESM(require_dist2(), 1);
var import_node_path = require("node:path");
var import_promise_deferred2 = __toESM(require_dist2(), 1);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __esm = (fn, res) =>
  function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames2(fn)[0]])((fn = 0))), res);
  };
var __commonJS2 = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export2 = (target, all) => {
  for (var name in all) __defProp2(target, name, { get: all[name], enumerable: true });
};
var __copyProps2 = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp2(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
  }
  return to;
};
var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
function pathspec(...paths) {
  const key = new String(paths);
  cache.set(key, paths);
  return key;
}
function isPathSpec(path11) {
  return path11 instanceof String && cache.has(path11);
}
var cache;
var init_pathspec = __esm({
  "src/lib/args/pathspec.ts"() {
    "use strict";
    cache = /* @__PURE__ */ new WeakMap();
  }
});
var GitError;
var init_git_error = __esm({
  "src/lib/errors/git-error.ts"() {
    "use strict";
    GitError = class extends Error {
      constructor(task, message) {
        super(message);
        this.task = task;
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
  }
});
var GitResponseError;
var init_git_response_error = __esm({
  "src/lib/errors/git-response-error.ts"() {
    "use strict";
    init_git_error();
    GitResponseError = class extends GitError {
      constructor(git, message) {
        super(void 0, message || String(git));
        this.git = git;
      }
    };
  }
});
var TaskConfigurationError;
var init_task_configuration_error = __esm({
  "src/lib/errors/task-configuration-error.ts"() {
    "use strict";
    init_git_error();
    TaskConfigurationError = class extends GitError {
      constructor(message) {
        super(void 0, message);
      }
    };
  }
});
function asFunction(source) {
  if (typeof source !== "function") {
    return NOOP;
  }
  return source;
}
function isUserFunction(source) {
  return typeof source === "function" && source !== NOOP;
}
function splitOn(input, char) {
  const index = input.indexOf(char);
  if (index <= 0) {
    return [input, ""];
  }
  return [input.substr(0, index), input.substr(index + 1)];
}
function first(input, offset = 0) {
  return isArrayLike(input) && input.length > offset ? input[offset] : void 0;
}
function last(input, offset = 0) {
  if (isArrayLike(input) && input.length > offset) {
    return input[input.length - 1 - offset];
  }
}
function isArrayLike(input) {
  return filterHasLength(input);
}
function toLinesWithContent(input = "", trimmed22 = true, separator = "\n") {
  return input.split(separator).reduce((output, line) => {
    const lineContent = trimmed22 ? line.trim() : line;
    if (lineContent) {
      output.push(lineContent);
    }
    return output;
  }, []);
}
function forEachLineWithContent(input, callback) {
  return toLinesWithContent(input, true).map((line) => callback(line));
}
function folderExists(path11) {
  return (0, import_file_exists.exists)(path11, import_file_exists.FOLDER);
}
function append(target, item) {
  if (Array.isArray(target)) {
    if (!target.includes(item)) {
      target.push(item);
    }
  } else {
    target.add(item);
  }
  return item;
}
function including(target, item) {
  if (Array.isArray(target) && !target.includes(item)) {
    target.push(item);
  }
  return target;
}
function remove(target, item) {
  if (Array.isArray(target)) {
    const index = target.indexOf(item);
    if (index >= 0) {
      target.splice(index, 1);
    }
  } else {
    target.delete(item);
  }
  return item;
}
function asArray(source) {
  return Array.isArray(source) ? source : [source];
}
function asCamelCase(str) {
  return str.replace(/[\s-]+(.)/g, (_all, chr) => {
    return chr.toUpperCase();
  });
}
function asStringArray(source) {
  return asArray(source).map((item) => {
    return item instanceof String ? item : String(item);
  });
}
function asNumber(source, onNaN = 0) {
  if (source == null) {
    return onNaN;
  }
  const num = parseInt(source, 10);
  return Number.isNaN(num) ? onNaN : num;
}
function prefixedArray(input, prefix) {
  const output = [];
  for (let i = 0, max = input.length; i < max; i++) {
    output.push(prefix, input[i]);
  }
  return output;
}
function bufferToString(input) {
  return (Array.isArray(input) ? import_node_buffer.Buffer.concat(input) : input).toString("utf-8");
}
function pick(source, properties) {
  const out = {};
  properties.forEach((key) => {
    if (source[key] !== void 0) {
      out[key] = source[key];
    }
  });
  return out;
}
function delay(duration = 0) {
  return new Promise((done) => setTimeout(done, duration));
}
function orVoid(input) {
  if (input === false) {
    return void 0;
  }
  return input;
}
var NULL;
var NOOP;
var objectToString;
var init_util = __esm({
  "src/lib/utils/util.ts"() {
    "use strict";
    init_argument_filters();
    NULL = "\0";
    NOOP = () => {};
    objectToString = Object.prototype.toString.call.bind(Object.prototype.toString);
  }
});
function filterType(input, filter, def) {
  if (filter(input)) {
    return input;
  }
  return arguments.length > 2 ? def : void 0;
}
function filterPrimitives(input, omit2) {
  const type = isPathSpec(input) ? "string" : typeof input;
  return /number|string|boolean/.test(type) && (!omit2 || !omit2.includes(type));
}
function filterPlainObject(input) {
  return !!input && objectToString(input) === "[object Object]";
}
function filterFunction(input) {
  return typeof input === "function";
}
var filterArray;
var filterNumber;
var filterString;
var filterStringOrStringArray;
var filterHasLength;
var init_argument_filters = __esm({
  "src/lib/utils/argument-filters.ts"() {
    "use strict";
    init_pathspec();
    init_util();
    filterArray = (input) => {
      return Array.isArray(input);
    };
    filterNumber = (input) => {
      return typeof input === "number";
    };
    filterString = (input) => {
      return typeof input === "string";
    };
    filterStringOrStringArray = (input) => {
      return filterString(input) || (Array.isArray(input) && input.every(filterString));
    };
    filterHasLength = (input) => {
      if (input == null || "number|boolean|function".includes(typeof input)) {
        return false;
      }
      return typeof input.length === "number";
    };
  }
});
var ExitCodes;
var init_exit_codes = __esm({
  "src/lib/utils/exit-codes.ts"() {
    "use strict";
    ExitCodes = /* @__PURE__ */ ((ExitCodes22) => {
      ExitCodes22[(ExitCodes22["SUCCESS"] = 0)] = "SUCCESS";
      ExitCodes22[(ExitCodes22["ERROR"] = 1)] = "ERROR";
      ExitCodes22[(ExitCodes22["NOT_FOUND"] = -2)] = "NOT_FOUND";
      ExitCodes22[(ExitCodes22["UNCLEAN"] = 128)] = "UNCLEAN";
      return ExitCodes22;
    })(ExitCodes || {});
  }
});
var GitOutputStreams;
var init_git_output_streams = __esm({
  "src/lib/utils/git-output-streams.ts"() {
    "use strict";
    GitOutputStreams = class _GitOutputStreams {
      constructor(stdOut, stdErr) {
        this.stdOut = stdOut;
        this.stdErr = stdErr;
      }
      asStrings() {
        return new _GitOutputStreams(this.stdOut.toString("utf8"), this.stdErr.toString("utf8"));
      }
    };
  }
});
function useMatchesDefault() {
  throw new Error(`LineParser:useMatches not implemented`);
}
var LineParser;
var RemoteLineParser;
var init_line_parser = __esm({
  "src/lib/utils/line-parser.ts"() {
    "use strict";
    LineParser = class {
      constructor(regExp, useMatches) {
        this.matches = [];
        this.useMatches = useMatchesDefault;
        this.parse = (line, target) => {
          this.resetMatches();
          if (!this._regExp.every((reg, index) => this.addMatch(reg, index, line(index)))) {
            return false;
          }
          return this.useMatches(target, this.prepareMatches()) !== false;
        };
        this._regExp = Array.isArray(regExp) ? regExp : [regExp];
        if (useMatches) {
          this.useMatches = useMatches;
        }
      }
      resetMatches() {
        this.matches.length = 0;
      }
      prepareMatches() {
        return this.matches;
      }
      addMatch(reg, index, line) {
        const matched = line && reg.exec(line);
        if (matched) {
          this.pushMatch(index, matched);
        }
        return !!matched;
      }
      pushMatch(_index, matched) {
        this.matches.push(...matched.slice(1));
      }
    };
    RemoteLineParser = class extends LineParser {
      addMatch(reg, index, line) {
        return /^remote:\s/.test(String(line)) && super.addMatch(reg, index, line);
      }
      pushMatch(index, matched) {
        if (index > 0 || matched.length > 1) {
          super.pushMatch(index, matched);
        }
      }
    };
  }
});
function createInstanceConfig(...options) {
  const baseDir = process.cwd();
  const config = Object.assign(
    { baseDir, ...defaultOptions },
    ...options.filter((o) => typeof o === "object" && o)
  );
  config.baseDir = config.baseDir || baseDir;
  config.trimmed = config.trimmed === true;
  return config;
}
var defaultOptions;
var init_simple_git_options = __esm({
  "src/lib/utils/simple-git-options.ts"() {
    "use strict";
    defaultOptions = {
      binary: "git",
      maxConcurrentProcesses: 5,
      config: [],
      trimmed: false
    };
  }
});
function appendTaskOptions(options, commands3 = []) {
  if (!filterPlainObject(options)) {
    return commands3;
  }
  return Object.keys(options).reduce((commands22, key) => {
    const value = options[key];
    if (isPathSpec(value)) {
      commands22.push(value);
    } else if (filterPrimitives(value, ["boolean"])) {
      commands22.push(key + "=" + value);
    } else if (Array.isArray(value)) {
      for (const v of value) {
        if (!filterPrimitives(v, ["string", "number"])) {
          commands22.push(key + "=" + v);
        }
      }
    } else {
      commands22.push(key);
    }
    return commands22;
  }, commands3);
}
function getTrailingOptions(args, initialPrimitive = 0, objectOnly = false) {
  const command = [];
  for (let i = 0, max = initialPrimitive < 0 ? args.length : initialPrimitive; i < max; i++) {
    if ("string|number".includes(typeof args[i])) {
      command.push(String(args[i]));
    }
  }
  appendTaskOptions(trailingOptionsArgument(args), command);
  if (!objectOnly) {
    command.push(...trailingArrayArgument(args));
  }
  return command;
}
function trailingArrayArgument(args) {
  const hasTrailingCallback = typeof last(args) === "function";
  return asStringArray(filterType(last(args, hasTrailingCallback ? 1 : 0), filterArray, []));
}
function trailingOptionsArgument(args) {
  const hasTrailingCallback = filterFunction(last(args));
  return filterType(last(args, hasTrailingCallback ? 1 : 0), filterPlainObject);
}
function trailingFunctionArgument(args, includeNoop = true) {
  const callback = asFunction(last(args));
  return includeNoop || isUserFunction(callback) ? callback : void 0;
}
var init_task_options = __esm({
  "src/lib/utils/task-options.ts"() {
    "use strict";
    init_argument_filters();
    init_util();
    init_pathspec();
  }
});
function callTaskParser(parser42, streams) {
  return parser42(streams.stdOut, streams.stdErr);
}
function parseStringResponse(result, parsers122, texts, trim = true) {
  asArray(texts).forEach((text) => {
    for (let lines = toLinesWithContent(text, trim), i = 0, max = lines.length; i < max; i++) {
      const line = (offset = 0) => {
        if (i + offset >= max) {
          return;
        }
        return lines[i + offset];
      };
      parsers122.some(({ parse: parse2 }) => parse2(line, result));
    }
  });
  return result;
}
var init_task_parser = __esm({
  "src/lib/utils/task-parser.ts"() {
    "use strict";
    init_util();
  }
});
var utils_exports = {};
__export2(utils_exports, {
  ExitCodes: () => ExitCodes,
  GitOutputStreams: () => GitOutputStreams,
  LineParser: () => LineParser,
  NOOP: () => NOOP,
  NULL: () => NULL,
  RemoteLineParser: () => RemoteLineParser,
  append: () => append,
  appendTaskOptions: () => appendTaskOptions,
  asArray: () => asArray,
  asCamelCase: () => asCamelCase,
  asFunction: () => asFunction,
  asNumber: () => asNumber,
  asStringArray: () => asStringArray,
  bufferToString: () => bufferToString,
  callTaskParser: () => callTaskParser,
  createInstanceConfig: () => createInstanceConfig,
  delay: () => delay,
  filterArray: () => filterArray,
  filterFunction: () => filterFunction,
  filterHasLength: () => filterHasLength,
  filterNumber: () => filterNumber,
  filterPlainObject: () => filterPlainObject,
  filterPrimitives: () => filterPrimitives,
  filterString: () => filterString,
  filterStringOrStringArray: () => filterStringOrStringArray,
  filterType: () => filterType,
  first: () => first,
  folderExists: () => folderExists,
  forEachLineWithContent: () => forEachLineWithContent,
  getTrailingOptions: () => getTrailingOptions,
  including: () => including,
  isUserFunction: () => isUserFunction,
  last: () => last,
  objectToString: () => objectToString,
  orVoid: () => orVoid,
  parseStringResponse: () => parseStringResponse,
  pick: () => pick,
  prefixedArray: () => prefixedArray,
  remove: () => remove,
  splitOn: () => splitOn,
  toLinesWithContent: () => toLinesWithContent,
  trailingFunctionArgument: () => trailingFunctionArgument,
  trailingOptionsArgument: () => trailingOptionsArgument
});
var init_utils = __esm({
  "src/lib/utils/index.ts"() {
    "use strict";
    init_argument_filters();
    init_exit_codes();
    init_git_output_streams();
    init_line_parser();
    init_simple_git_options();
    init_task_options();
    init_task_parser();
    init_util();
  }
});
var check_is_repo_exports = {};
__export2(check_is_repo_exports, {
  CheckRepoActions: () => CheckRepoActions,
  checkIsBareRepoTask: () => checkIsBareRepoTask,
  checkIsRepoRootTask: () => checkIsRepoRootTask,
  checkIsRepoTask: () => checkIsRepoTask
});
function checkIsRepoTask(action) {
  switch (action) {
    case "bare":
      return checkIsBareRepoTask();
    case "root":
      return checkIsRepoRootTask();
  }
  const commands3 = ["rev-parse", "--is-inside-work-tree"];
  return {
    commands: commands3,
    format: "utf-8",
    onError,
    parser
  };
}
function checkIsRepoRootTask() {
  const commands3 = ["rev-parse", "--git-dir"];
  return {
    commands: commands3,
    format: "utf-8",
    onError,
    parser(path11) {
      return /^\.(git)?$/.test(path11.trim());
    }
  };
}
function checkIsBareRepoTask() {
  const commands3 = ["rev-parse", "--is-bare-repository"];
  return {
    commands: commands3,
    format: "utf-8",
    onError,
    parser
  };
}
function isNotRepoMessage(error) {
  return /(Not a git repository|Kein Git-Repository)/i.test(String(error));
}
var CheckRepoActions;
var onError;
var parser;
var init_check_is_repo = __esm({
  "src/lib/tasks/check-is-repo.ts"() {
    "use strict";
    init_utils();
    CheckRepoActions = /* @__PURE__ */ ((CheckRepoActions22) => {
      CheckRepoActions22["BARE"] = "bare";
      CheckRepoActions22["IN_TREE"] = "tree";
      CheckRepoActions22["IS_REPO_ROOT"] = "root";
      return CheckRepoActions22;
    })(CheckRepoActions || {});
    onError = ({ exitCode }, error, done, fail) => {
      if (exitCode === 128 && isNotRepoMessage(error)) {
        return done(Buffer.from("false"));
      }
      fail(error);
    };
    parser = (text) => {
      return text.trim() === "true";
    };
  }
});
function cleanSummaryParser(dryRun, text) {
  const summary = new CleanResponse(dryRun);
  const regexp = dryRun ? dryRunRemovalRegexp : removalRegexp;
  toLinesWithContent(text).forEach((line) => {
    const removed = line.replace(regexp, "");
    summary.paths.push(removed);
    (isFolderRegexp.test(removed) ? summary.folders : summary.files).push(removed);
  });
  return summary;
}
var CleanResponse;
var removalRegexp;
var dryRunRemovalRegexp;
var isFolderRegexp;
var init_CleanSummary = __esm({
  "src/lib/responses/CleanSummary.ts"() {
    "use strict";
    init_utils();
    CleanResponse = class {
      constructor(dryRun) {
        this.dryRun = dryRun;
        this.paths = [];
        this.files = [];
        this.folders = [];
      }
    };
    removalRegexp = /^[a-z]+\s*/i;
    dryRunRemovalRegexp = /^[a-z]+\s+[a-z]+\s*/i;
    isFolderRegexp = /\/$/;
  }
});
var task_exports = {};
__export2(task_exports, {
  EMPTY_COMMANDS: () => EMPTY_COMMANDS,
  adhocExecTask: () => adhocExecTask,
  configurationErrorTask: () => configurationErrorTask,
  isBufferTask: () => isBufferTask,
  isEmptyTask: () => isEmptyTask,
  straightThroughBufferTask: () => straightThroughBufferTask,
  straightThroughStringTask: () => straightThroughStringTask
});
function adhocExecTask(parser42) {
  return {
    commands: EMPTY_COMMANDS,
    format: "empty",
    parser: parser42
  };
}
function configurationErrorTask(error) {
  return {
    commands: EMPTY_COMMANDS,
    format: "empty",
    parser() {
      throw typeof error === "string" ? new TaskConfigurationError(error) : error;
    }
  };
}
function straightThroughStringTask(commands3, trimmed22 = false) {
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return trimmed22 ? String(text).trim() : text;
    }
  };
}
function straightThroughBufferTask(commands3) {
  return {
    commands: commands3,
    format: "buffer",
    parser(buffer) {
      return buffer;
    }
  };
}
function isBufferTask(task) {
  return task.format === "buffer";
}
function isEmptyTask(task) {
  return task.format === "empty" || !task.commands.length;
}
var EMPTY_COMMANDS;
var init_task = __esm({
  "src/lib/tasks/task.ts"() {
    "use strict";
    init_task_configuration_error();
    EMPTY_COMMANDS = [];
  }
});
var clean_exports = {};
__export2(clean_exports, {
  CONFIG_ERROR_INTERACTIVE_MODE: () => CONFIG_ERROR_INTERACTIVE_MODE,
  CONFIG_ERROR_MODE_REQUIRED: () => CONFIG_ERROR_MODE_REQUIRED,
  CONFIG_ERROR_UNKNOWN_OPTION: () => CONFIG_ERROR_UNKNOWN_OPTION,
  CleanOptions: () => CleanOptions,
  cleanTask: () => cleanTask,
  cleanWithOptionsTask: () => cleanWithOptionsTask,
  isCleanOptionsArray: () => isCleanOptionsArray
});
function cleanWithOptionsTask(mode, customArgs) {
  const { cleanMode, options, valid } = getCleanOptions(mode);
  if (!cleanMode) {
    return configurationErrorTask(CONFIG_ERROR_MODE_REQUIRED);
  }
  if (!valid.options) {
    return configurationErrorTask(CONFIG_ERROR_UNKNOWN_OPTION + JSON.stringify(mode));
  }
  options.push(...customArgs);
  if (options.some(isInteractiveMode)) {
    return configurationErrorTask(CONFIG_ERROR_INTERACTIVE_MODE);
  }
  return cleanTask(cleanMode, options);
}
function cleanTask(mode, customArgs) {
  const commands3 = ["clean", `-${mode}`, ...customArgs];
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return cleanSummaryParser(mode === "n", text);
    }
  };
}
function isCleanOptionsArray(input) {
  return Array.isArray(input) && input.every((test) => CleanOptionValues.has(test));
}
function getCleanOptions(input) {
  let cleanMode;
  let options = [];
  let valid = { cleanMode: false, options: true };
  input
    .replace(/[^a-z]i/g, "")
    .split("")
    .forEach((char) => {
      if (isCleanMode(char)) {
        cleanMode = char;
        valid.cleanMode = true;
      } else {
        valid.options = valid.options && isKnownOption((options[options.length] = `-${char}`));
      }
    });
  return {
    cleanMode,
    options,
    valid
  };
}
function isCleanMode(cleanMode) {
  return cleanMode === "f" || cleanMode === "n";
}
function isKnownOption(option) {
  return /^-[a-z]$/i.test(option) && CleanOptionValues.has(option.charAt(1));
}
function isInteractiveMode(option) {
  if (/^-[^\-]/.test(option)) {
    return option.indexOf("i") > 0;
  }
  return option === "--interactive";
}
var CONFIG_ERROR_INTERACTIVE_MODE;
var CONFIG_ERROR_MODE_REQUIRED;
var CONFIG_ERROR_UNKNOWN_OPTION;
var CleanOptions;
var CleanOptionValues;
var init_clean = __esm({
  "src/lib/tasks/clean.ts"() {
    "use strict";
    init_CleanSummary();
    init_utils();
    init_task();
    CONFIG_ERROR_INTERACTIVE_MODE = "Git clean interactive mode is not supported";
    CONFIG_ERROR_MODE_REQUIRED = 'Git clean mode parameter ("n" or "f") is required';
    CONFIG_ERROR_UNKNOWN_OPTION = "Git clean unknown option found in: ";
    CleanOptions = /* @__PURE__ */ ((CleanOptions22) => {
      CleanOptions22["DRY_RUN"] = "n";
      CleanOptions22["FORCE"] = "f";
      CleanOptions22["IGNORED_INCLUDED"] = "x";
      CleanOptions22["IGNORED_ONLY"] = "X";
      CleanOptions22["EXCLUDING"] = "e";
      CleanOptions22["QUIET"] = "q";
      CleanOptions22["RECURSIVE"] = "d";
      return CleanOptions22;
    })(CleanOptions || {});
    CleanOptionValues = /* @__PURE__ */ new Set([
      "i",
      ...asStringArray(Object.values(CleanOptions))
    ]);
  }
});
function configListParser(text) {
  const config = new ConfigList();
  for (const item of configParser(text)) {
    config.addValue(item.file, String(item.key), item.value);
  }
  return config;
}
function configGetParser(text, key) {
  let value = null;
  const values = [];
  const scopes = /* @__PURE__ */ new Map();
  for (const item of configParser(text, key)) {
    if (item.key !== key) {
      continue;
    }
    values.push((value = item.value));
    if (!scopes.has(item.file)) {
      scopes.set(item.file, []);
    }
    scopes.get(item.file).push(value);
  }
  return {
    key,
    paths: Array.from(scopes.keys()),
    scopes,
    value,
    values
  };
}
function configFilePath(filePath) {
  return filePath.replace(/^(file):/, "");
}
function* configParser(text, requestedKey = null) {
  const lines = text.split("\0");
  for (let i = 0, max = lines.length - 1; i < max; ) {
    const file = configFilePath(lines[i++]);
    let value = lines[i++];
    let key = requestedKey;
    if (value.includes("\n")) {
      const line = splitOn(value, "\n");
      key = line[0];
      value = line[1];
    }
    yield { file, key, value };
  }
}
var ConfigList;
var init_ConfigList = __esm({
  "src/lib/responses/ConfigList.ts"() {
    "use strict";
    init_utils();
    ConfigList = class {
      constructor() {
        this.files = [];
        this.values = /* @__PURE__ */ Object.create(null);
      }
      get all() {
        if (!this._all) {
          this._all = this.files.reduce((all, file) => {
            return Object.assign(all, this.values[file]);
          }, {});
        }
        return this._all;
      }
      addFile(file) {
        if (!(file in this.values)) {
          const latest = last(this.files);
          this.values[file] = latest ? Object.create(this.values[latest]) : {};
          this.files.push(file);
        }
        return this.values[file];
      }
      addValue(file, key, value) {
        const values = this.addFile(file);
        if (!Object.hasOwn(values, key)) {
          values[key] = value;
        } else if (Array.isArray(values[key])) {
          values[key].push(value);
        } else {
          values[key] = [values[key], value];
        }
        this._all = void 0;
      }
    };
  }
});
function asConfigScope(scope, fallback) {
  if (typeof scope === "string" && Object.hasOwn(GitConfigScope, scope)) {
    return scope;
  }
  return fallback;
}
function addConfigTask(key, value, append22, scope) {
  const commands3 = ["config", `--${scope}`];
  if (append22) {
    commands3.push("--add");
  }
  commands3.push(key, value);
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return text;
    }
  };
}
function getConfigTask(key, scope) {
  const commands3 = ["config", "--null", "--show-origin", "--get-all", key];
  if (scope) {
    commands3.splice(1, 0, `--${scope}`);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return configGetParser(text, key);
    }
  };
}
function listConfigTask(scope) {
  const commands3 = ["config", "--list", "--show-origin", "--null"];
  if (scope) {
    commands3.push(`--${scope}`);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return configListParser(text);
    }
  };
}
function config_default() {
  return {
    addConfig(key, value, ...rest) {
      return this._runTask(
        addConfigTask(
          key,
          value,
          rest[0] === true,
          asConfigScope(
            rest[1],
            "local"
            /* local */
          )
        ),
        trailingFunctionArgument(arguments)
      );
    },
    getConfig(key, scope) {
      return this._runTask(
        getConfigTask(key, asConfigScope(scope, void 0)),
        trailingFunctionArgument(arguments)
      );
    },
    listConfig(...rest) {
      return this._runTask(
        listConfigTask(asConfigScope(rest[0], void 0)),
        trailingFunctionArgument(arguments)
      );
    }
  };
}
var GitConfigScope;
var init_config = __esm({
  "src/lib/tasks/config.ts"() {
    "use strict";
    init_ConfigList();
    init_utils();
    GitConfigScope = /* @__PURE__ */ ((GitConfigScope22) => {
      GitConfigScope22["system"] = "system";
      GitConfigScope22["global"] = "global";
      GitConfigScope22["local"] = "local";
      GitConfigScope22["worktree"] = "worktree";
      return GitConfigScope22;
    })(GitConfigScope || {});
  }
});
function isDiffNameStatus(input) {
  return diffNameStatus.has(input);
}
var DiffNameStatus;
var diffNameStatus;
var init_diff_name_status = __esm({
  "src/lib/tasks/diff-name-status.ts"() {
    "use strict";
    DiffNameStatus = /* @__PURE__ */ ((DiffNameStatus22) => {
      DiffNameStatus22["ADDED"] = "A";
      DiffNameStatus22["COPIED"] = "C";
      DiffNameStatus22["DELETED"] = "D";
      DiffNameStatus22["MODIFIED"] = "M";
      DiffNameStatus22["RENAMED"] = "R";
      DiffNameStatus22["CHANGED"] = "T";
      DiffNameStatus22["UNMERGED"] = "U";
      DiffNameStatus22["UNKNOWN"] = "X";
      DiffNameStatus22["BROKEN"] = "B";
      return DiffNameStatus22;
    })(DiffNameStatus || {});
    diffNameStatus = new Set(Object.values(DiffNameStatus));
  }
});
function grepQueryBuilder(...params) {
  return new GrepQuery().param(...params);
}
function parseGrep(grep) {
  const paths = /* @__PURE__ */ new Set();
  const results = {};
  forEachLineWithContent(grep, (input) => {
    const [path11, line, preview] = input.split(NULL);
    paths.add(path11);
    (results[path11] = results[path11] || []).push({
      line: asNumber(line),
      path: path11,
      preview
    });
  });
  return {
    paths,
    results
  };
}
function grep_default() {
  return {
    grep(searchTerm) {
      const then = trailingFunctionArgument(arguments);
      const options = getTrailingOptions(arguments);
      for (const option of disallowedOptions) {
        if (options.includes(option)) {
          return this._runTask(
            configurationErrorTask(`git.grep: use of "${option}" is not supported.`),
            then
          );
        }
      }
      if (typeof searchTerm === "string") {
        searchTerm = grepQueryBuilder().param(searchTerm);
      }
      const commands3 = ["grep", "--null", "-n", "--full-name", ...options, ...searchTerm];
      return this._runTask(
        {
          commands: commands3,
          format: "utf-8",
          parser(stdOut) {
            return parseGrep(stdOut);
          }
        },
        then
      );
    }
  };
}
var disallowedOptions;
var Query;
var _a;
var GrepQuery;
var init_grep = __esm({
  "src/lib/tasks/grep.ts"() {
    "use strict";
    init_utils();
    init_task();
    disallowedOptions = ["-h"];
    Query = Symbol("grepQuery");
    GrepQuery = class {
      constructor() {
        this[_a] = [];
      }
      *[((_a = Query), Symbol.iterator)]() {
        for (const query of this[Query]) {
          yield query;
        }
      }
      and(...and) {
        and.length && this[Query].push("--and", "(", ...prefixedArray(and, "-e"), ")");
        return this;
      }
      param(...param) {
        this[Query].push(...prefixedArray(param, "-e"));
        return this;
      }
    };
  }
});
var reset_exports = {};
__export2(reset_exports, {
  ResetMode: () => ResetMode,
  getResetMode: () => getResetMode,
  resetTask: () => resetTask
});
function resetTask(mode, customArgs) {
  const commands3 = ["reset"];
  if (isValidResetMode(mode)) {
    commands3.push(`--${mode}`);
  }
  commands3.push(...customArgs);
  return straightThroughStringTask(commands3);
}
function getResetMode(mode) {
  if (isValidResetMode(mode)) {
    return mode;
  }
  switch (typeof mode) {
    case "string":
    case "undefined":
      return "soft";
  }
  return;
}
function isValidResetMode(mode) {
  return typeof mode === "string" && validResetModes.includes(mode);
}
var ResetMode;
var validResetModes;
var init_reset = __esm({
  "src/lib/tasks/reset.ts"() {
    "use strict";
    init_utils();
    init_task();
    ResetMode = /* @__PURE__ */ ((ResetMode22) => {
      ResetMode22["MIXED"] = "mixed";
      ResetMode22["SOFT"] = "soft";
      ResetMode22["HARD"] = "hard";
      ResetMode22["MERGE"] = "merge";
      ResetMode22["KEEP"] = "keep";
      return ResetMode22;
    })(ResetMode || {});
    validResetModes = asStringArray(Object.values(ResetMode));
  }
});
function createLog() {
  return (0, import_debug.default)("simple-git");
}
function prefixedLogger(to, prefix, forward) {
  if (!prefix || !String(prefix).replace(/\s*/, "")) {
    return !forward
      ? to
      : (message, ...args) => {
          to(message, ...args);
          forward(message, ...args);
        };
  }
  return (message, ...args) => {
    to(`%s ${message}`, prefix, ...args);
    if (forward) {
      forward(message, ...args);
    }
  };
}
function childLoggerName(name, childDebugger, { namespace: parentNamespace }) {
  if (typeof name === "string") {
    return name;
  }
  const childNamespace = (childDebugger && childDebugger.namespace) || "";
  if (childNamespace.startsWith(parentNamespace)) {
    return childNamespace.substr(parentNamespace.length + 1);
  }
  return childNamespace || parentNamespace;
}
function createLogger(label, verbose, initialStep, infoDebugger = createLog()) {
  const labelPrefix = (label && `[${label}]`) || "";
  const spawned = [];
  const debugDebugger = typeof verbose === "string" ? infoDebugger.extend(verbose) : verbose;
  const key = childLoggerName(filterType(verbose, filterString), debugDebugger, infoDebugger);
  return step(initialStep);
  function sibling(name, initial) {
    return append(spawned, createLogger(label, key.replace(/^[^:]+/, name), initial, infoDebugger));
  }
  function step(phase) {
    const stepPrefix = (phase && `[${phase}]`) || "";
    const debug22 = (debugDebugger && prefixedLogger(debugDebugger, stepPrefix)) || NOOP;
    const info = prefixedLogger(infoDebugger, `${labelPrefix} ${stepPrefix}`, debug22);
    return Object.assign(debugDebugger ? debug22 : info, {
      label,
      sibling,
      info,
      step
    });
  }
}
var init_git_logger = __esm({
  "src/lib/git-logger.ts"() {
    "use strict";
    init_utils();
    import_debug.default.formatters.L = (value) =>
      String(filterHasLength(value) ? value.length : "-");
    import_debug.default.formatters.B = (value) => {
      if (Buffer.isBuffer(value)) {
        return value.toString("utf8");
      }
      return objectToString(value);
    };
  }
});
var TasksPendingQueue;
var init_tasks_pending_queue = __esm({
  "src/lib/runners/tasks-pending-queue.ts"() {
    "use strict";
    init_git_error();
    init_git_logger();
    TasksPendingQueue = class _TasksPendingQueue {
      constructor(logLabel = "GitExecutor") {
        this.logLabel = logLabel;
        this._queue = /* @__PURE__ */ new Map();
      }
      withProgress(task) {
        return this._queue.get(task);
      }
      createProgress(task) {
        const name = _TasksPendingQueue.getName(task.commands[0]);
        const logger = createLogger(this.logLabel, name);
        return {
          task,
          logger,
          name
        };
      }
      push(task) {
        const progress = this.createProgress(task);
        progress.logger("Adding task to the queue, commands = %o", task.commands);
        this._queue.set(task, progress);
        return progress;
      }
      fatal(err) {
        for (const [task, { logger }] of Array.from(this._queue.entries())) {
          if (task === err.task) {
            logger.info(`Failed %o`, err);
            logger(
              `Fatal exception, any as-yet un-started tasks run through this executor will not be attempted`
            );
          } else {
            logger.info(
              `A fatal exception occurred in a previous task, the queue has been purged: %o`,
              err.message
            );
          }
          this.complete(task);
        }
        if (this._queue.size !== 0) {
          throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
        }
      }
      complete(task) {
        const progress = this.withProgress(task);
        if (progress) {
          this._queue.delete(task);
        }
      }
      attempt(task) {
        const progress = this.withProgress(task);
        if (!progress) {
          throw new GitError(void 0, "TasksPendingQueue: attempt called for an unknown task");
        }
        progress.logger("Starting task");
        return progress;
      }
      static getName(name = "empty") {
        return `task:${name}:${++_TasksPendingQueue.counter}`;
      }
      static {
        this.counter = 0;
      }
    };
  }
});
function pluginContext(task, commands3) {
  return {
    method: first(task.commands) || "",
    commands: commands3
  };
}
function onErrorReceived(target, logger) {
  return (err) => {
    logger(`[ERROR] child process exception %o`, err);
    target.push(Buffer.from(String(err.stack), "ascii"));
  };
}
function onDataReceived(target, name, logger, output) {
  return (buffer) => {
    logger(`%s received %L bytes`, name, buffer);
    output(`%B`, buffer);
    target.push(buffer);
  };
}
var GitExecutorChain;
var init_git_executor_chain = __esm({
  "src/lib/runners/git-executor-chain.ts"() {
    "use strict";
    init_git_error();
    init_task();
    init_utils();
    init_tasks_pending_queue();
    GitExecutorChain = class {
      constructor(_executor, _scheduler, _plugins) {
        this._executor = _executor;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = Promise.resolve();
        this._queue = new TasksPendingQueue();
      }
      get cwd() {
        return this._cwd || this._executor.cwd;
      }
      set cwd(cwd) {
        this._cwd = cwd;
      }
      get env() {
        return this._executor.env;
      }
      get outputHandler() {
        return this._executor.outputHandler;
      }
      chain() {
        return this;
      }
      push(task) {
        this._queue.push(task);
        return (this._chain = this._chain.then(() => this.attemptTask(task)));
      }
      async attemptTask(task) {
        const onScheduleComplete = await this._scheduler.next();
        const onQueueComplete = () => this._queue.complete(task);
        try {
          const { logger } = this._queue.attempt(task);
          return await (isEmptyTask(task)
            ? this.attemptEmptyTask(task, logger)
            : this.attemptRemoteTask(task, logger));
        } catch (e) {
          throw this.onFatalException(task, e);
        } finally {
          onQueueComplete();
          onScheduleComplete();
        }
      }
      onFatalException(task, e) {
        const gitError =
          e instanceof GitError ? Object.assign(e, { task }) : new GitError(task, e && String(e));
        this._chain = Promise.resolve();
        this._queue.fatal(gitError);
        return gitError;
      }
      async attemptRemoteTask(task, logger) {
        const binary = this._plugins.exec("spawn.binary", "", pluginContext(task, task.commands));
        const args = this._plugins.exec(
          "spawn.args",
          [...task.commands],
          pluginContext(task, task.commands)
        );
        const raw = await this.gitResponse(
          task,
          binary,
          args,
          this.outputHandler,
          logger.step("SPAWN")
        );
        const outputStreams = await this.handleTaskData(task, args, raw, logger.step("HANDLE"));
        logger(`passing response to task's parser as a %s`, task.format);
        if (isBufferTask(task)) {
          return callTaskParser(task.parser, outputStreams);
        }
        return callTaskParser(task.parser, outputStreams.asStrings());
      }
      async attemptEmptyTask(task, logger) {
        logger(`empty task bypassing child process to call to task's parser`);
        return task.parser(this);
      }
      handleTaskData(task, args, result, logger) {
        const { exitCode, rejection, stdOut, stdErr } = result;
        return new Promise((done, fail) => {
          logger(`Preparing to handle process response exitCode=%d stdOut=`, exitCode);
          const { error } = this._plugins.exec(
            "task.error",
            { error: rejection },
            {
              ...pluginContext(task, args),
              ...result
            }
          );
          if (error && task.onError) {
            logger.info(`exitCode=%s handling with custom error handler`);
            return task.onError(
              result,
              error,
              (newStdOut) => {
                logger.info(`custom error handler treated as success`);
                logger(`custom error returned a %s`, objectToString(newStdOut));
                done(
                  new GitOutputStreams(
                    Array.isArray(newStdOut) ? Buffer.concat(newStdOut) : newStdOut,
                    Buffer.concat(stdErr)
                  )
                );
              },
              fail
            );
          }
          if (error) {
            logger.info(
              `handling as error: exitCode=%s stdErr=%s rejection=%o`,
              exitCode,
              stdErr.length,
              rejection
            );
            return fail(error);
          }
          logger.info(`retrieving task output complete`);
          done(new GitOutputStreams(Buffer.concat(stdOut), Buffer.concat(stdErr)));
        });
      }
      async gitResponse(task, command, args, outputHandler, logger) {
        const outputLogger = logger.sibling("output");
        const spawnOptions = this._plugins.exec(
          "spawn.options",
          {
            cwd: this.cwd,
            env: this.env,
            windowsHide: true
          },
          pluginContext(task, task.commands)
        );
        return new Promise((done) => {
          const stdOut = [];
          const stdErr = [];
          logger.info(`%s %o`, command, args);
          logger("%O", spawnOptions);
          let rejection = this._beforeSpawn(task, args);
          if (rejection) {
            return done({
              stdOut,
              stdErr,
              exitCode: 9901,
              rejection
            });
          }
          this._plugins.exec("spawn.before", void 0, {
            ...pluginContext(task, args),
            kill(reason) {
              rejection = reason || rejection;
            }
          });
          const spawned = (0, import_child_process.spawn)(command, args, spawnOptions);
          spawned.stdout.on(
            "data",
            onDataReceived(stdOut, "stdOut", logger, outputLogger.step("stdOut"))
          );
          spawned.stderr.on(
            "data",
            onDataReceived(stdErr, "stdErr", logger, outputLogger.step("stdErr"))
          );
          spawned.on("error", onErrorReceived(stdErr, logger));
          if (outputHandler) {
            logger(`Passing child process stdOut/stdErr to custom outputHandler`);
            outputHandler(command, spawned.stdout, spawned.stderr, [...args]);
          }
          this._plugins.exec("spawn.after", void 0, {
            ...pluginContext(task, args),
            spawned,
            close(exitCode, reason) {
              done({
                stdOut,
                stdErr,
                exitCode,
                rejection: rejection || reason
              });
            },
            kill(reason) {
              if (spawned.killed) {
                return;
              }
              rejection = reason;
              spawned.kill("SIGINT");
            }
          });
        });
      }
      _beforeSpawn(task, args) {
        let rejection;
        this._plugins.exec("spawn.before", void 0, {
          ...pluginContext(task, args),
          kill(reason) {
            rejection = reason || rejection;
          }
        });
        return rejection;
      }
    };
  }
});
var git_executor_exports = {};
__export2(git_executor_exports, {
  GitExecutor: () => GitExecutor
});
var GitExecutor;
var init_git_executor = __esm({
  "src/lib/runners/git-executor.ts"() {
    "use strict";
    init_git_executor_chain();
    GitExecutor = class {
      constructor(cwd, _scheduler, _plugins) {
        this.cwd = cwd;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = new GitExecutorChain(this, this._scheduler, this._plugins);
      }
      chain() {
        return new GitExecutorChain(this, this._scheduler, this._plugins);
      }
      push(task) {
        return this._chain.push(task);
      }
    };
  }
});
function taskCallback(task, response, callback = NOOP) {
  const onSuccess = (data) => {
    callback(null, data);
  };
  const onError22 = (err) => {
    if (err?.task === task) {
      callback(err instanceof GitResponseError ? addDeprecationNoticeToError(err) : err, void 0);
    }
  };
  response.then(onSuccess, onError22);
}
function addDeprecationNoticeToError(err) {
  let log = (name) => {
    console.warn(
      `simple-git deprecation notice: accessing GitResponseError.${name} should be GitResponseError.git.${name}, this will no longer be available in version 3`
    );
    log = NOOP;
  };
  return Object.create(err, Object.getOwnPropertyNames(err.git).reduce(descriptorReducer, {}));
  function descriptorReducer(all, name) {
    if (name in err) {
      return all;
    }
    all[name] = {
      enumerable: false,
      configurable: false,
      get() {
        log(name);
        return err.git[name];
      }
    };
    return all;
  }
}
var init_task_callback = __esm({
  "src/lib/task-callback.ts"() {
    "use strict";
    init_git_response_error();
    init_utils();
  }
});
function changeWorkingDirectoryTask(directory, root) {
  return adhocExecTask((instance) => {
    if (!folderExists(directory)) {
      throw new Error(`Git.cwd: cannot change to non-directory "${directory}"`);
    }
    return ((root || instance).cwd = directory);
  });
}
var init_change_working_directory = __esm({
  "src/lib/tasks/change-working-directory.ts"() {
    "use strict";
    init_utils();
    init_task();
  }
});
function checkoutTask(args) {
  const commands3 = ["checkout", ...args];
  if (commands3[1] === "-b" && commands3.includes("-B")) {
    commands3[1] = remove(commands3, "-B");
  }
  return straightThroughStringTask(commands3);
}
function checkout_default() {
  return {
    checkout() {
      return this._runTask(
        checkoutTask(getTrailingOptions(arguments, 1)),
        trailingFunctionArgument(arguments)
      );
    },
    checkoutBranch(branchName, startPoint) {
      return this._runTask(
        checkoutTask(["-b", branchName, startPoint, ...getTrailingOptions(arguments)]),
        trailingFunctionArgument(arguments)
      );
    },
    checkoutLocalBranch(branchName) {
      return this._runTask(
        checkoutTask(["-b", branchName, ...getTrailingOptions(arguments)]),
        trailingFunctionArgument(arguments)
      );
    }
  };
}
var init_checkout = __esm({
  "src/lib/tasks/checkout.ts"() {
    "use strict";
    init_utils();
    init_task();
  }
});
function countObjectsResponse() {
  return {
    count: 0,
    garbage: 0,
    inPack: 0,
    packs: 0,
    prunePackable: 0,
    size: 0,
    sizeGarbage: 0,
    sizePack: 0
  };
}
function count_objects_default() {
  return {
    countObjects() {
      return this._runTask({
        commands: ["count-objects", "--verbose"],
        format: "utf-8",
        parser(stdOut) {
          return parseStringResponse(countObjectsResponse(), [parser2], stdOut);
        }
      });
    }
  };
}
var parser2;
var init_count_objects = __esm({
  "src/lib/tasks/count-objects.ts"() {
    "use strict";
    init_utils();
    parser2 = new LineParser(/([a-z-]+): (\d+)$/, (result, [key, value]) => {
      const property = asCamelCase(key);
      if (Object.hasOwn(result, property)) {
        result[property] = asNumber(value);
      }
    });
  }
});
function parseCommitResult(stdOut) {
  const result = {
    author: null,
    branch: "",
    commit: "",
    root: false,
    summary: {
      changes: 0,
      insertions: 0,
      deletions: 0
    }
  };
  return parseStringResponse(result, parsers, stdOut);
}
var parsers;
var init_parse_commit = __esm({
  "src/lib/parsers/parse-commit.ts"() {
    "use strict";
    init_utils();
    parsers = [
      new LineParser(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/, (result, [branch, root, commit]) => {
        result.branch = branch;
        result.commit = commit;
        result.root = !!root;
      }),
      new LineParser(/\s*Author:\s(.+)/i, (result, [author]) => {
        const parts = author.split("<");
        const email = parts.pop();
        if (!email || !email.includes("@")) {
          return;
        }
        result.author = {
          email: email.substr(0, email.length - 1),
          name: parts.join("<").trim()
        };
      }),
      new LineParser(
        /(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g,
        (result, [changes, insertions, deletions]) => {
          result.summary.changes = parseInt(changes, 10) || 0;
          result.summary.insertions = parseInt(insertions, 10) || 0;
          result.summary.deletions = parseInt(deletions, 10) || 0;
        }
      ),
      new LineParser(
        /^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/,
        (result, [changes, lines, direction]) => {
          result.summary.changes = parseInt(changes, 10) || 0;
          const count = parseInt(lines, 10) || 0;
          if (direction === "-") {
            result.summary.deletions = count;
          } else if (direction === "+") {
            result.summary.insertions = count;
          }
        }
      )
    ];
  }
});
function commitTask(message, files, customArgs) {
  const commands3 = [
    "-c",
    "core.abbrev=40",
    "commit",
    ...prefixedArray(message, "-m"),
    ...files,
    ...customArgs
  ];
  return {
    commands: commands3,
    format: "utf-8",
    parser: parseCommitResult
  };
}
function commit_default() {
  return {
    commit(message, ...rest) {
      const next = trailingFunctionArgument(arguments);
      const task =
        rejectDeprecatedSignatures(message) ||
        commitTask(asArray(message), asArray(filterType(rest[0], filterStringOrStringArray, [])), [
          ...asStringArray(filterType(rest[1], filterArray, [])),
          ...getTrailingOptions(arguments, 0, true)
        ]);
      return this._runTask(task, next);
    }
  };
  function rejectDeprecatedSignatures(message) {
    return (
      !filterStringOrStringArray(message) &&
      configurationErrorTask(
        `git.commit: requires the commit message to be supplied as a string/string[]`
      )
    );
  }
}
var init_commit = __esm({
  "src/lib/tasks/commit.ts"() {
    "use strict";
    init_parse_commit();
    init_utils();
    init_task();
  }
});
function first_commit_default() {
  return {
    firstCommit() {
      return this._runTask(
        straightThroughStringTask(["rev-list", "--max-parents=0", "HEAD"], true),
        trailingFunctionArgument(arguments)
      );
    }
  };
}
var init_first_commit = __esm({
  "src/lib/tasks/first-commit.ts"() {
    "use strict";
    init_utils();
    init_task();
  }
});
function hashObjectTask(filePath, write) {
  const commands3 = ["hash-object", filePath];
  if (write) {
    commands3.push("-w");
  }
  return straightThroughStringTask(commands3, true);
}
var init_hash_object = __esm({
  "src/lib/tasks/hash-object.ts"() {
    "use strict";
    init_task();
  }
});
function parseInit(bare, path11, text) {
  const response = String(text).trim();
  let result;
  if ((result = initResponseRegex.exec(response))) {
    return new InitSummary(bare, path11, false, result[1]);
  }
  if ((result = reInitResponseRegex.exec(response))) {
    return new InitSummary(bare, path11, true, result[1]);
  }
  let gitDir = "";
  const tokens = response.split(" ");
  while (tokens.length) {
    const token = tokens.shift();
    if (token === "in") {
      gitDir = tokens.join(" ");
      break;
    }
  }
  return new InitSummary(bare, path11, /^re/i.test(response), gitDir);
}
var InitSummary;
var initResponseRegex;
var reInitResponseRegex;
var init_InitSummary = __esm({
  "src/lib/responses/InitSummary.ts"() {
    "use strict";
    InitSummary = class {
      constructor(bare, path11, existing, gitDir) {
        this.bare = bare;
        this.path = path11;
        this.existing = existing;
        this.gitDir = gitDir;
      }
    };
    initResponseRegex = /^Init.+ repository in (.+)$/;
    reInitResponseRegex = /^Rein.+ in (.+)$/;
  }
});
function hasBareCommand(command) {
  return command.includes(bareCommand);
}
function initTask(bare = false, path11, customArgs) {
  const commands3 = ["init", ...customArgs];
  if (bare && !hasBareCommand(commands3)) {
    commands3.splice(1, 0, bareCommand);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return parseInit(commands3.includes("--bare"), path11, text);
    }
  };
}
var bareCommand;
var init_init = __esm({
  "src/lib/tasks/init.ts"() {
    "use strict";
    init_InitSummary();
    bareCommand = "--bare";
  }
});
function logFormatFromCommand(customArgs) {
  for (let i = 0; i < customArgs.length; i++) {
    const format = logFormatRegex.exec(customArgs[i]);
    if (format) {
      return `--${format[1]}`;
    }
  }
  return "";
}
function isLogFormat(customArg) {
  return logFormatRegex.test(customArg);
}
var logFormatRegex;
var init_log_format = __esm({
  "src/lib/args/log-format.ts"() {
    "use strict";
    logFormatRegex = /^--(stat|numstat|name-only|name-status)(=|$)/;
  }
});
var DiffSummary;
var init_DiffSummary = __esm({
  "src/lib/responses/DiffSummary.ts"() {
    "use strict";
    DiffSummary = class {
      constructor() {
        this.changed = 0;
        this.deletions = 0;
        this.insertions = 0;
        this.files = [];
      }
    };
  }
});
function getDiffParser(format = "") {
  const parser42 = diffSummaryParsers[format];
  return (stdOut) => parseStringResponse(new DiffSummary(), parser42, stdOut, false);
}
var statParser;
var numStatParser;
var nameOnlyParser;
var nameStatusParser;
var diffSummaryParsers;
var init_parse_diff_summary = __esm({
  "src/lib/parsers/parse-diff-summary.ts"() {
    "use strict";
    init_log_format();
    init_DiffSummary();
    init_diff_name_status();
    init_utils();
    statParser = [
      new LineParser(
        /^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/,
        (result, [file, changes, alterations = ""]) => {
          result.files.push({
            file: file.trim(),
            changes: asNumber(changes),
            insertions: alterations.replace(/[^+]/g, "").length,
            deletions: alterations.replace(/[^-]/g, "").length,
            binary: false
          });
        }
      ),
      new LineParser(
        /^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/,
        (result, [file, before, after]) => {
          result.files.push({
            file: file.trim(),
            before: asNumber(before),
            after: asNumber(after),
            binary: true
          });
        }
      ),
      new LineParser(
        /(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/,
        (result, [changed, summary]) => {
          const inserted = /(\d+) i/.exec(summary);
          const deleted = /(\d+) d/.exec(summary);
          result.changed = asNumber(changed);
          result.insertions = asNumber(inserted?.[1]);
          result.deletions = asNumber(deleted?.[1]);
        }
      )
    ];
    numStatParser = [
      new LineParser(/(\d+)\t(\d+)\t(.+)$/, (result, [changesInsert, changesDelete, file]) => {
        const insertions = asNumber(changesInsert);
        const deletions = asNumber(changesDelete);
        result.changed++;
        result.insertions += insertions;
        result.deletions += deletions;
        result.files.push({
          file,
          changes: insertions + deletions,
          insertions,
          deletions,
          binary: false
        });
      }),
      new LineParser(/-\t-\t(.+)$/, (result, [file]) => {
        result.changed++;
        result.files.push({
          file,
          after: 0,
          before: 0,
          binary: true
        });
      })
    ];
    nameOnlyParser = [
      new LineParser(/(.+)$/, (result, [file]) => {
        result.changed++;
        result.files.push({
          file,
          changes: 0,
          insertions: 0,
          deletions: 0,
          binary: false
        });
      })
    ];
    nameStatusParser = [
      new LineParser(
        /([ACDMRTUXB])([0-9]{0,3})\t(.[^\t]*)(\t(.[^\t]*))?$/,
        (result, [status, similarity, from, _to, to]) => {
          result.changed++;
          result.files.push({
            file: to ?? from,
            changes: 0,
            insertions: 0,
            deletions: 0,
            binary: false,
            status: orVoid(isDiffNameStatus(status) && status),
            from: orVoid(!!to && from !== to && from),
            similarity: asNumber(similarity)
          });
        }
      )
    ];
    diffSummaryParsers = {
      [""]:
        /* NONE */
        statParser,
      ["--stat"]:
        /* STAT */
        statParser,
      ["--numstat"]:
        /* NUM_STAT */
        numStatParser,
      ["--name-status"]:
        /* NAME_STATUS */
        nameStatusParser,
      ["--name-only"]:
        /* NAME_ONLY */
        nameOnlyParser
    };
  }
});
function lineBuilder(tokens, fields) {
  return fields.reduce(
    (line, field, index) => {
      line[field] = tokens[index] || "";
      return line;
    },
    /* @__PURE__ */ Object.create({ diff: null })
  );
}
function createListLogSummaryParser(
  splitter = SPLITTER,
  fields = defaultFieldNames,
  logFormat = ""
) {
  const parseDiffResult = getDiffParser(logFormat);
  return function (stdOut) {
    const all = toLinesWithContent(stdOut.trim(), false, START_BOUNDARY).map(function (item) {
      const lineDetail = item.split(COMMIT_BOUNDARY);
      const listLogLine = lineBuilder(lineDetail[0].split(splitter), fields);
      if (lineDetail.length > 1 && !!lineDetail[1].trim()) {
        listLogLine.diff = parseDiffResult(lineDetail[1]);
      }
      return listLogLine;
    });
    return {
      all,
      latest: (all.length && all[0]) || null,
      total: all.length
    };
  };
}
var START_BOUNDARY;
var COMMIT_BOUNDARY;
var SPLITTER;
var defaultFieldNames;
var init_parse_list_log_summary = __esm({
  "src/lib/parsers/parse-list-log-summary.ts"() {
    "use strict";
    init_utils();
    init_parse_diff_summary();
    init_log_format();
    START_BOUNDARY = "\xF2\xF2\xF2\xF2\xF2\xF2 ";
    COMMIT_BOUNDARY = " \xF2\xF2";
    SPLITTER = " \xF2 ";
    defaultFieldNames = ["hash", "date", "message", "refs", "author_name", "author_email"];
  }
});
var diff_exports = {};
__export2(diff_exports, {
  diffSummaryTask: () => diffSummaryTask,
  validateLogFormatConfig: () => validateLogFormatConfig
});
function diffSummaryTask(customArgs) {
  let logFormat = logFormatFromCommand(customArgs);
  const commands3 = ["diff"];
  if (logFormat === "") {
    logFormat = "--stat";
    commands3.push("--stat=4096");
  }
  commands3.push(...customArgs);
  return (
    validateLogFormatConfig(commands3) || {
      commands: commands3,
      format: "utf-8",
      parser: getDiffParser(logFormat)
    }
  );
}
function validateLogFormatConfig(customArgs) {
  const flags = customArgs.filter(isLogFormat);
  if (flags.length > 1) {
    return configurationErrorTask(
      `Summary flags are mutually exclusive - pick one of ${flags.join(",")}`
    );
  }
  if (flags.length && customArgs.includes("-z")) {
    return configurationErrorTask(
      `Summary flag ${flags} parsing is not compatible with null termination option '-z'`
    );
  }
}
var init_diff = __esm({
  "src/lib/tasks/diff.ts"() {
    "use strict";
    init_log_format();
    init_parse_diff_summary();
    init_task();
  }
});
function prettyFormat(format, splitter) {
  const fields = [];
  const formatStr = [];
  Object.keys(format).forEach((field) => {
    fields.push(field);
    formatStr.push(String(format[field]));
  });
  return [fields, formatStr.join(splitter)];
}
function userOptions(input) {
  return Object.keys(input).reduce((out, key) => {
    if (!(key in excludeOptions)) {
      out[key] = input[key];
    }
    return out;
  }, {});
}
function parseLogOptions(opt = {}, customArgs = []) {
  const splitter = filterType(opt.splitter, filterString, SPLITTER);
  const format = filterPlainObject(opt.format)
    ? opt.format
    : {
        hash: "%H",
        date: opt.strictDate === false ? "%ai" : "%aI",
        message: "%s",
        refs: "%D",
        body: opt.multiLine ? "%B" : "%b",
        author_name: opt.mailMap !== false ? "%aN" : "%an",
        author_email: opt.mailMap !== false ? "%aE" : "%ae"
      };
  const [fields, formatStr] = prettyFormat(format, splitter);
  const suffix = [];
  const command = [
    `--pretty=format:${START_BOUNDARY}${formatStr}${COMMIT_BOUNDARY}`,
    ...customArgs
  ];
  const maxCount = opt.n || opt["max-count"] || opt.maxCount;
  if (maxCount) {
    command.push(`--max-count=${maxCount}`);
  }
  if (opt.from || opt.to) {
    const rangeOperator = opt.symmetric !== false ? "..." : "..";
    suffix.push(`${opt.from || ""}${rangeOperator}${opt.to || ""}`);
  }
  if (filterString(opt.file)) {
    command.push("--follow", pathspec(opt.file));
  }
  appendTaskOptions(userOptions(opt), command);
  return {
    fields,
    splitter,
    commands: [...command, ...suffix]
  };
}
function logTask(splitter, fields, customArgs) {
  const parser42 = createListLogSummaryParser(splitter, fields, logFormatFromCommand(customArgs));
  return {
    commands: ["log", ...customArgs],
    format: "utf-8",
    parser: parser42
  };
}
function log_default() {
  return {
    log(...rest) {
      const next = trailingFunctionArgument(arguments);
      const options = parseLogOptions(
        trailingOptionsArgument(arguments),
        asStringArray(filterType(arguments[0], filterArray, []))
      );
      const task =
        rejectDeprecatedSignatures(...rest) ||
        validateLogFormatConfig(options.commands) ||
        createLogTask(options);
      return this._runTask(task, next);
    }
  };
  function createLogTask(options) {
    return logTask(options.splitter, options.fields, options.commands);
  }
  function rejectDeprecatedSignatures(from, to) {
    return (
      filterString(from) &&
      filterString(to) &&
      configurationErrorTask(
        `git.log(string, string) should be replaced with git.log({ from: string, to: string })`
      )
    );
  }
}
var excludeOptions;
var init_log = __esm({
  "src/lib/tasks/log.ts"() {
    "use strict";
    init_log_format();
    init_pathspec();
    init_parse_list_log_summary();
    init_utils();
    init_task();
    init_diff();
    excludeOptions = /* @__PURE__ */ ((excludeOptions22) => {
      excludeOptions22[(excludeOptions22["--pretty"] = 0)] = "--pretty";
      excludeOptions22[(excludeOptions22["max-count"] = 1)] = "max-count";
      excludeOptions22[(excludeOptions22["maxCount"] = 2)] = "maxCount";
      excludeOptions22[(excludeOptions22["n"] = 3)] = "n";
      excludeOptions22[(excludeOptions22["file"] = 4)] = "file";
      excludeOptions22[(excludeOptions22["format"] = 5)] = "format";
      excludeOptions22[(excludeOptions22["from"] = 6)] = "from";
      excludeOptions22[(excludeOptions22["to"] = 7)] = "to";
      excludeOptions22[(excludeOptions22["splitter"] = 8)] = "splitter";
      excludeOptions22[(excludeOptions22["symmetric"] = 9)] = "symmetric";
      excludeOptions22[(excludeOptions22["mailMap"] = 10)] = "mailMap";
      excludeOptions22[(excludeOptions22["multiLine"] = 11)] = "multiLine";
      excludeOptions22[(excludeOptions22["strictDate"] = 12)] = "strictDate";
      return excludeOptions22;
    })(excludeOptions || {});
  }
});
var MergeSummaryConflict;
var MergeSummaryDetail;
var init_MergeSummary = __esm({
  "src/lib/responses/MergeSummary.ts"() {
    "use strict";
    MergeSummaryConflict = class {
      constructor(reason, file = null, meta) {
        this.reason = reason;
        this.file = file;
        this.meta = meta;
      }
      toString() {
        return `${this.file}:${this.reason}`;
      }
    };
    MergeSummaryDetail = class {
      constructor() {
        this.conflicts = [];
        this.merges = [];
        this.result = "success";
      }
      get failed() {
        return this.conflicts.length > 0;
      }
      get reason() {
        return this.result;
      }
      toString() {
        if (this.conflicts.length) {
          return `CONFLICTS: ${this.conflicts.join(", ")}`;
        }
        return "OK";
      }
    };
  }
});
var PullSummary;
var PullFailedSummary;
var init_PullSummary = __esm({
  "src/lib/responses/PullSummary.ts"() {
    "use strict";
    PullSummary = class {
      constructor() {
        this.remoteMessages = {
          all: []
        };
        this.created = [];
        this.deleted = [];
        this.files = [];
        this.deletions = {};
        this.insertions = {};
        this.summary = {
          changes: 0,
          deletions: 0,
          insertions: 0
        };
      }
    };
    PullFailedSummary = class {
      constructor() {
        this.remote = "";
        this.hash = {
          local: "",
          remote: ""
        };
        this.branch = {
          local: "",
          remote: ""
        };
        this.message = "";
      }
      toString() {
        return this.message;
      }
    };
  }
});
function objectEnumerationResult(remoteMessages) {
  return (remoteMessages.objects = remoteMessages.objects || {
    compressing: 0,
    counting: 0,
    enumerating: 0,
    packReused: 0,
    reused: { count: 0, delta: 0 },
    total: { count: 0, delta: 0 }
  });
}
function asObjectCount(source) {
  const count = /^\s*(\d+)/.exec(source);
  const delta = /delta (\d+)/i.exec(source);
  return {
    count: asNumber((count && count[1]) || "0"),
    delta: asNumber((delta && delta[1]) || "0")
  };
}
var remoteMessagesObjectParsers;
var init_parse_remote_objects = __esm({
  "src/lib/parsers/parse-remote-objects.ts"() {
    "use strict";
    init_utils();
    remoteMessagesObjectParsers = [
      new RemoteLineParser(
        /^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i,
        (result, [action, count]) => {
          const key = action.toLowerCase();
          const enumeration = objectEnumerationResult(result.remoteMessages);
          Object.assign(enumeration, { [key]: asNumber(count) });
        }
      ),
      new RemoteLineParser(
        /^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i,
        (result, [action, count]) => {
          const key = action.toLowerCase();
          const enumeration = objectEnumerationResult(result.remoteMessages);
          Object.assign(enumeration, { [key]: asNumber(count) });
        }
      ),
      new RemoteLineParser(
        /total ([^,]+), reused ([^,]+), pack-reused (\d+)/i,
        (result, [total, reused, packReused]) => {
          const objects = objectEnumerationResult(result.remoteMessages);
          objects.total = asObjectCount(total);
          objects.reused = asObjectCount(reused);
          objects.packReused = asNumber(packReused);
        }
      )
    ];
  }
});
function parseRemoteMessages(_stdOut, stdErr) {
  return parseStringResponse({ remoteMessages: new RemoteMessageSummary() }, parsers2, stdErr);
}
var parsers2;
var RemoteMessageSummary;
var init_parse_remote_messages = __esm({
  "src/lib/parsers/parse-remote-messages.ts"() {
    "use strict";
    init_utils();
    init_parse_remote_objects();
    parsers2 = [
      new RemoteLineParser(/^remote:\s*(.+)$/, (result, [text]) => {
        result.remoteMessages.all.push(text.trim());
        return false;
      }),
      ...remoteMessagesObjectParsers,
      new RemoteLineParser(
        [/create a (?:pull|merge) request/i, /\s(https?:\/\/\S+)$/],
        (result, [pullRequestUrl]) => {
          result.remoteMessages.pullRequestUrl = pullRequestUrl;
        }
      ),
      new RemoteLineParser(
        [/found (\d+) vulnerabilities.+\(([^)]+)\)/i, /\s(https?:\/\/\S+)$/],
        (result, [count, summary, url]) => {
          result.remoteMessages.vulnerabilities = {
            count: asNumber(count),
            summary,
            url
          };
        }
      )
    ];
    RemoteMessageSummary = class {
      constructor() {
        this.all = [];
      }
    };
  }
});
function parsePullErrorResult(stdOut, stdErr) {
  const pullError = parseStringResponse(new PullFailedSummary(), errorParsers, [stdOut, stdErr]);
  return pullError.message && pullError;
}
var FILE_UPDATE_REGEX;
var SUMMARY_REGEX;
var ACTION_REGEX;
var parsers3;
var errorParsers;
var parsePullDetail;
var parsePullResult;
var init_parse_pull = __esm({
  "src/lib/parsers/parse-pull.ts"() {
    "use strict";
    init_PullSummary();
    init_utils();
    init_parse_remote_messages();
    FILE_UPDATE_REGEX = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/;
    SUMMARY_REGEX = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/;
    ACTION_REGEX = /^(create|delete) mode \d+ (.+)/;
    parsers3 = [
      new LineParser(FILE_UPDATE_REGEX, (result, [file, insertions, deletions]) => {
        result.files.push(file);
        if (insertions) {
          result.insertions[file] = insertions.length;
        }
        if (deletions) {
          result.deletions[file] = deletions.length;
        }
      }),
      new LineParser(SUMMARY_REGEX, (result, [changes, , insertions, , deletions]) => {
        if (insertions !== void 0 || deletions !== void 0) {
          result.summary.changes = +changes || 0;
          result.summary.insertions = +insertions || 0;
          result.summary.deletions = +deletions || 0;
          return true;
        }
        return false;
      }),
      new LineParser(ACTION_REGEX, (result, [action, file]) => {
        append(result.files, file);
        append(action === "create" ? result.created : result.deleted, file);
      })
    ];
    errorParsers = [
      new LineParser(/^from\s(.+)$/i, (result, [remote]) => void (result.remote = remote)),
      new LineParser(/^fatal:\s(.+)$/, (result, [message]) => void (result.message = message)),
      new LineParser(
        /([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/,
        (result, [hashLocal, hashRemote, branchLocal, branchRemote]) => {
          result.branch.local = branchLocal;
          result.hash.local = hashLocal;
          result.branch.remote = branchRemote;
          result.hash.remote = hashRemote;
        }
      )
    ];
    parsePullDetail = (stdOut, stdErr) => {
      return parseStringResponse(new PullSummary(), parsers3, [stdOut, stdErr]);
    };
    parsePullResult = (stdOut, stdErr) => {
      return Object.assign(
        new PullSummary(),
        parsePullDetail(stdOut, stdErr),
        parseRemoteMessages(stdOut, stdErr)
      );
    };
  }
});
var parsers4;
var parseMergeResult;
var parseMergeDetail;
var init_parse_merge = __esm({
  "src/lib/parsers/parse-merge.ts"() {
    "use strict";
    init_MergeSummary();
    init_utils();
    init_parse_pull();
    parsers4 = [
      new LineParser(/^Auto-merging\s+(.+)$/, (summary, [autoMerge]) => {
        summary.merges.push(autoMerge);
      }),
      new LineParser(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/, (summary, [reason, file]) => {
        summary.conflicts.push(new MergeSummaryConflict(reason, file));
      }),
      new LineParser(
        /^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/,
        (summary, [reason, file, deleteRef]) => {
          summary.conflicts.push(new MergeSummaryConflict(reason, file, { deleteRef }));
        }
      ),
      new LineParser(/^CONFLICT\s+\((.+)\):/, (summary, [reason]) => {
        summary.conflicts.push(new MergeSummaryConflict(reason, null));
      }),
      new LineParser(/^Automatic merge failed;\s+(.+)$/, (summary, [result]) => {
        summary.result = result;
      })
    ];
    parseMergeResult = (stdOut, stdErr) => {
      return Object.assign(parseMergeDetail(stdOut, stdErr), parsePullResult(stdOut, stdErr));
    };
    parseMergeDetail = (stdOut) => {
      return parseStringResponse(new MergeSummaryDetail(), parsers4, stdOut);
    };
  }
});
function mergeTask(customArgs) {
  if (!customArgs.length) {
    return configurationErrorTask("Git.merge requires at least one option");
  }
  return {
    commands: ["merge", ...customArgs],
    format: "utf-8",
    parser(stdOut, stdErr) {
      const merge2 = parseMergeResult(stdOut, stdErr);
      if (merge2.failed) {
        throw new GitResponseError(merge2);
      }
      return merge2;
    }
  };
}
var init_merge = __esm({
  "src/lib/tasks/merge.ts"() {
    "use strict";
    init_git_response_error();
    init_parse_merge();
    init_task();
  }
});
function pushResultPushedItem(local, remote, status) {
  const deleted = status.includes("deleted");
  const tag = status.includes("tag") || /^refs\/tags/.test(local);
  const alreadyUpdated = !status.includes("new");
  return {
    deleted,
    tag,
    branch: !tag,
    new: !alreadyUpdated,
    alreadyUpdated,
    local,
    remote
  };
}
var parsers5;
var parsePushResult;
var parsePushDetail;
var init_parse_push = __esm({
  "src/lib/parsers/parse-push.ts"() {
    "use strict";
    init_utils();
    init_parse_remote_messages();
    parsers5 = [
      new LineParser(/^Pushing to (.+)$/, (result, [repo]) => {
        result.repo = repo;
      }),
      new LineParser(/^updating local tracking ref '(.+)'/, (result, [local]) => {
        result.ref = {
          ...(result.ref || {}),
          local
        };
      }),
      new LineParser(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/, (result, [local, remote, type]) => {
        result.pushed.push(pushResultPushedItem(local, remote, type));
      }),
      new LineParser(
        /^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/,
        (result, [local, remote, remoteName]) => {
          result.branch = {
            ...(result.branch || {}),
            local,
            remote,
            remoteName
          };
        }
      ),
      new LineParser(
        /^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/,
        (result, [local, remote, from, to]) => {
          result.update = {
            head: {
              local,
              remote
            },
            hash: {
              from,
              to
            }
          };
        }
      )
    ];
    parsePushResult = (stdOut, stdErr) => {
      const pushDetail = parsePushDetail(stdOut, stdErr);
      const responseDetail = parseRemoteMessages(stdOut, stdErr);
      return {
        ...pushDetail,
        ...responseDetail
      };
    };
    parsePushDetail = (stdOut, stdErr) => {
      return parseStringResponse({ pushed: [] }, parsers5, [stdOut, stdErr]);
    };
  }
});
var push_exports = {};
__export2(push_exports, {
  pushTagsTask: () => pushTagsTask,
  pushTask: () => pushTask
});
function pushTagsTask(ref = {}, customArgs) {
  append(customArgs, "--tags");
  return pushTask(ref, customArgs);
}
function pushTask(ref = {}, customArgs) {
  const commands3 = ["push", ...customArgs];
  if (ref.branch) {
    commands3.splice(1, 0, ref.branch);
  }
  if (ref.remote) {
    commands3.splice(1, 0, ref.remote);
  }
  remove(commands3, "-v");
  append(commands3, "--verbose");
  append(commands3, "--porcelain");
  return {
    commands: commands3,
    format: "utf-8",
    parser: parsePushResult
  };
}
var init_push = __esm({
  "src/lib/tasks/push.ts"() {
    "use strict";
    init_parse_push();
    init_utils();
  }
});
function show_default() {
  return {
    showBuffer() {
      const commands3 = ["show", ...getTrailingOptions(arguments, 1)];
      if (!commands3.includes("--binary")) {
        commands3.splice(1, 0, "--binary");
      }
      return this._runTask(
        straightThroughBufferTask(commands3),
        trailingFunctionArgument(arguments)
      );
    },
    show() {
      const commands3 = ["show", ...getTrailingOptions(arguments, 1)];
      return this._runTask(
        straightThroughStringTask(commands3),
        trailingFunctionArgument(arguments)
      );
    }
  };
}
var init_show = __esm({
  "src/lib/tasks/show.ts"() {
    "use strict";
    init_utils();
    init_task();
  }
});
var fromPathRegex;
var FileStatusSummary;
var init_FileStatusSummary = __esm({
  "src/lib/responses/FileStatusSummary.ts"() {
    "use strict";
    fromPathRegex = /^(.+)\0(.+)$/;
    FileStatusSummary = class {
      constructor(path11, index, working_dir) {
        this.path = path11;
        this.index = index;
        this.working_dir = working_dir;
        if (index === "R" || working_dir === "R") {
          const detail = fromPathRegex.exec(path11) || [null, path11, path11];
          this.from = detail[2] || "";
          this.path = detail[1] || "";
        }
      }
    };
  }
});
function renamedFile(line) {
  const [to, from] = line.split(NULL);
  return {
    from: from || to,
    to
  };
}
function parser3(indexX, indexY, handler2) {
  return [`${indexX}${indexY}`, handler2];
}
function conflicts(indexX, ...indexY) {
  return indexY.map((y) => parser3(indexX, y, (result, file) => result.conflicted.push(file)));
}
function splitLine(result, lineStr) {
  const trimmed22 = lineStr.trim();
  switch (" ") {
    case trimmed22.charAt(2):
      return data(trimmed22.charAt(0), trimmed22.charAt(1), trimmed22.slice(3));
    case trimmed22.charAt(1):
      return data(" ", trimmed22.charAt(0), trimmed22.slice(2));
    default:
      return;
  }
  function data(index, workingDir, path11) {
    const raw = `${index}${workingDir}`;
    const handler2 = parsers6.get(raw);
    if (handler2) {
      handler2(result, path11);
    }
    if (raw !== "##" && raw !== "!!") {
      result.files.push(new FileStatusSummary(path11, index, workingDir));
    }
  }
}
var StatusSummary;
var parsers6;
var parseStatusSummary;
var init_StatusSummary = __esm({
  "src/lib/responses/StatusSummary.ts"() {
    "use strict";
    init_utils();
    init_FileStatusSummary();
    StatusSummary = class {
      constructor() {
        this.not_added = [];
        this.conflicted = [];
        this.created = [];
        this.deleted = [];
        this.ignored = void 0;
        this.modified = [];
        this.renamed = [];
        this.files = [];
        this.staged = [];
        this.ahead = 0;
        this.behind = 0;
        this.current = null;
        this.tracking = null;
        this.detached = false;
        this.isClean = () => {
          return !this.files.length;
        };
      }
    };
    parsers6 = new Map([
      parser3(" ", "A", (result, file) => result.created.push(file)),
      parser3(" ", "D", (result, file) => result.deleted.push(file)),
      parser3(" ", "M", (result, file) => result.modified.push(file)),
      parser3("A", " ", (result, file) => {
        result.created.push(file);
        result.staged.push(file);
      }),
      parser3("A", "M", (result, file) => {
        result.created.push(file);
        result.staged.push(file);
        result.modified.push(file);
      }),
      parser3("D", " ", (result, file) => {
        result.deleted.push(file);
        result.staged.push(file);
      }),
      parser3("M", " ", (result, file) => {
        result.modified.push(file);
        result.staged.push(file);
      }),
      parser3("M", "M", (result, file) => {
        result.modified.push(file);
        result.staged.push(file);
      }),
      parser3("R", " ", (result, file) => {
        result.renamed.push(renamedFile(file));
      }),
      parser3("R", "M", (result, file) => {
        const renamed = renamedFile(file);
        result.renamed.push(renamed);
        result.modified.push(renamed.to);
      }),
      parser3("!", "!", (_result, _file) => {
        (_result.ignored = _result.ignored || []).push(_file);
      }),
      parser3("?", "?", (result, file) => result.not_added.push(file)),
      ...conflicts(
        "A",
        "A",
        "U"
        /* UNMERGED */
      ),
      ...conflicts(
        "D",
        "D",
        "U"
        /* UNMERGED */
      ),
      ...conflicts(
        "U",
        "A",
        "D",
        "U"
        /* UNMERGED */
      ),
      [
        "##",
        (result, line) => {
          const aheadReg = /ahead (\d+)/;
          const behindReg = /behind (\d+)/;
          const currentReg = /^(.+?(?=(?:\.{3}|\s|$)))/;
          const trackingReg = /\.{3}(\S*)/;
          const onEmptyBranchReg = /\son\s(\S+?)(?=\.{3}|$)/;
          let regexResult = aheadReg.exec(line);
          result.ahead = (regexResult && +regexResult[1]) || 0;
          regexResult = behindReg.exec(line);
          result.behind = (regexResult && +regexResult[1]) || 0;
          regexResult = currentReg.exec(line);
          result.current = filterType(regexResult?.[1], filterString, null);
          regexResult = trackingReg.exec(line);
          result.tracking = filterType(regexResult?.[1], filterString, null);
          regexResult = onEmptyBranchReg.exec(line);
          if (regexResult) {
            result.current = filterType(regexResult?.[1], filterString, result.current);
          }
          result.detached = /\(no branch\)/.test(line);
        }
      ]
    ]);
    parseStatusSummary = function (text) {
      const lines = text.split(NULL);
      const status = new StatusSummary();
      for (let i = 0, l = lines.length; i < l; ) {
        let line = lines[i++].trim();
        if (!line) {
          continue;
        }
        if (line.charAt(0) === "R") {
          line += NULL + (lines[i++] || "");
        }
        splitLine(status, line);
      }
      return status;
    };
  }
});
function statusTask(customArgs) {
  const commands3 = [
    "status",
    "--porcelain",
    "-b",
    "-u",
    "--null",
    ...customArgs.filter((arg) => !ignoredOptions.includes(arg))
  ];
  return {
    format: "utf-8",
    commands: commands3,
    parser(text) {
      return parseStatusSummary(text);
    }
  };
}
var ignoredOptions;
var init_status = __esm({
  "src/lib/tasks/status.ts"() {
    "use strict";
    init_StatusSummary();
    ignoredOptions = ["--null", "-z"];
  }
});
function versionResponse(major = 0, minor = 0, patch = 0, agent = "", installed = true) {
  return Object.defineProperty(
    {
      major,
      minor,
      patch,
      agent,
      installed
    },
    "toString",
    {
      value() {
        return `${this.major}.${this.minor}.${this.patch}`;
      },
      configurable: false,
      enumerable: false
    }
  );
}
function notInstalledResponse() {
  return versionResponse(0, 0, 0, "", false);
}
function version_default() {
  return {
    version() {
      return this._runTask({
        commands: ["--version"],
        format: "utf-8",
        parser: versionParser,
        onError(result, error, done, fail) {
          if (result.exitCode === -2) {
            return done(Buffer.from(NOT_INSTALLED));
          }
          fail(error);
        }
      });
    }
  };
}
function versionParser(stdOut) {
  if (stdOut === NOT_INSTALLED) {
    return notInstalledResponse();
  }
  return parseStringResponse(versionResponse(0, 0, 0, stdOut), parsers7, stdOut);
}
var NOT_INSTALLED;
var parsers7;
var init_version = __esm({
  "src/lib/tasks/version.ts"() {
    "use strict";
    init_utils();
    NOT_INSTALLED = "installed=false";
    parsers7 = [
      new LineParser(
        /version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/,
        (result, [major, minor, patch, agent = ""]) => {
          Object.assign(
            result,
            versionResponse(asNumber(major), asNumber(minor), asNumber(patch), agent)
          );
        }
      ),
      new LineParser(
        /version (\d+)\.(\d+)\.(\D+)(.+)?$/,
        (result, [major, minor, patch, agent = ""]) => {
          Object.assign(result, versionResponse(asNumber(major), asNumber(minor), patch, agent));
        }
      )
    ];
  }
});
var simple_git_api_exports = {};
__export2(simple_git_api_exports, {
  SimpleGitApi: () => SimpleGitApi
});
var SimpleGitApi;
var init_simple_git_api = __esm({
  "src/lib/simple-git-api.ts"() {
    "use strict";
    init_task_callback();
    init_change_working_directory();
    init_checkout();
    init_count_objects();
    init_commit();
    init_config();
    init_first_commit();
    init_grep();
    init_hash_object();
    init_init();
    init_log();
    init_merge();
    init_push();
    init_show();
    init_status();
    init_task();
    init_version();
    init_utils();
    SimpleGitApi = class {
      constructor(_executor) {
        this._executor = _executor;
      }
      _runTask(task, then) {
        const chain = this._executor.chain();
        const promise = chain.push(task);
        if (then) {
          taskCallback(task, promise, then);
        }
        return Object.create(this, {
          then: { value: promise.then.bind(promise) },
          catch: { value: promise.catch.bind(promise) },
          _executor: { value: chain }
        });
      }
      add(files) {
        return this._runTask(
          straightThroughStringTask(["add", ...asArray(files)]),
          trailingFunctionArgument(arguments)
        );
      }
      cwd(directory) {
        const next = trailingFunctionArgument(arguments);
        if (typeof directory === "string") {
          return this._runTask(changeWorkingDirectoryTask(directory, this._executor), next);
        }
        if (typeof directory?.path === "string") {
          return this._runTask(
            changeWorkingDirectoryTask(
              directory.path,
              (directory.root && this._executor) || void 0
            ),
            next
          );
        }
        return this._runTask(
          configurationErrorTask("Git.cwd: workingDirectory must be supplied as a string"),
          next
        );
      }
      hashObject(path11, write) {
        return this._runTask(
          hashObjectTask(path11, write === true),
          trailingFunctionArgument(arguments)
        );
      }
      init(bare) {
        return this._runTask(
          initTask(bare === true, this._executor.cwd, getTrailingOptions(arguments)),
          trailingFunctionArgument(arguments)
        );
      }
      merge() {
        return this._runTask(
          mergeTask(getTrailingOptions(arguments)),
          trailingFunctionArgument(arguments)
        );
      }
      mergeFromTo(remote, branch) {
        if (!(filterString(remote) && filterString(branch))) {
          return this._runTask(
            configurationErrorTask(
              `Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings`
            )
          );
        }
        return this._runTask(
          mergeTask([remote, branch, ...getTrailingOptions(arguments)]),
          trailingFunctionArgument(arguments, false)
        );
      }
      outputHandler(handler2) {
        this._executor.outputHandler = handler2;
        return this;
      }
      push() {
        const task = pushTask(
          {
            remote: filterType(arguments[0], filterString),
            branch: filterType(arguments[1], filterString)
          },
          getTrailingOptions(arguments)
        );
        return this._runTask(task, trailingFunctionArgument(arguments));
      }
      stash() {
        return this._runTask(
          straightThroughStringTask(["stash", ...getTrailingOptions(arguments)]),
          trailingFunctionArgument(arguments)
        );
      }
      status() {
        return this._runTask(
          statusTask(getTrailingOptions(arguments)),
          trailingFunctionArgument(arguments)
        );
      }
    };
    Object.assign(
      SimpleGitApi.prototype,
      checkout_default(),
      commit_default(),
      config_default(),
      count_objects_default(),
      first_commit_default(),
      grep_default(),
      log_default(),
      show_default(),
      version_default()
    );
  }
});
var scheduler_exports = {};
__export2(scheduler_exports, {
  Scheduler: () => Scheduler
});
var createScheduledTask;
var Scheduler;
var init_scheduler = __esm({
  "src/lib/runners/scheduler.ts"() {
    "use strict";
    init_utils();
    init_git_logger();
    createScheduledTask = /* @__PURE__ */ (() => {
      let id = 0;
      return () => {
        id++;
        const { promise, done } = (0, import_promise_deferred.createDeferred)();
        return {
          promise,
          done,
          id
        };
      };
    })();
    Scheduler = class {
      constructor(concurrency = 2) {
        this.concurrency = concurrency;
        this.logger = createLogger("", "scheduler");
        this.pending = [];
        this.running = [];
        this.logger(`Constructed, concurrency=%s`, concurrency);
      }
      schedule() {
        if (!this.pending.length || this.running.length >= this.concurrency) {
          this.logger(
            `Schedule attempt ignored, pending=%s running=%s concurrency=%s`,
            this.pending.length,
            this.running.length,
            this.concurrency
          );
          return;
        }
        const task = append(this.running, this.pending.shift());
        this.logger(`Attempting id=%s`, task.id);
        task.done(() => {
          this.logger(`Completing id=`, task.id);
          remove(this.running, task);
          this.schedule();
        });
      }
      next() {
        const { promise, id } = append(this.pending, createScheduledTask());
        this.logger(`Scheduling id=%s`, id);
        this.schedule();
        return promise;
      }
    };
  }
});
var apply_patch_exports = {};
__export2(apply_patch_exports, {
  applyPatchTask: () => applyPatchTask
});
function applyPatchTask(patches, customArgs) {
  return straightThroughStringTask(["apply", ...customArgs, ...patches]);
}
var init_apply_patch = __esm({
  "src/lib/tasks/apply-patch.ts"() {
    "use strict";
    init_task();
  }
});
function branchDeletionSuccess(branch, hash) {
  return {
    branch,
    hash,
    success: true
  };
}
function branchDeletionFailure(branch) {
  return {
    branch,
    hash: null,
    success: false
  };
}
var BranchDeletionBatch;
var init_BranchDeleteSummary = __esm({
  "src/lib/responses/BranchDeleteSummary.ts"() {
    "use strict";
    BranchDeletionBatch = class {
      constructor() {
        this.all = [];
        this.branches = {};
        this.errors = [];
      }
      get success() {
        return !this.errors.length;
      }
    };
  }
});
function hasBranchDeletionError(data, processExitCode) {
  return processExitCode === 1 && deleteErrorRegex.test(data);
}
var deleteSuccessRegex;
var deleteErrorRegex;
var parsers8;
var parseBranchDeletions;
var init_parse_branch_delete = __esm({
  "src/lib/parsers/parse-branch-delete.ts"() {
    "use strict";
    init_BranchDeleteSummary();
    init_utils();
    deleteSuccessRegex = /(\S+)\s+\(\S+\s([^)]+)\)/;
    deleteErrorRegex = /^error[^']+'([^']+)'/m;
    parsers8 = [
      new LineParser(deleteSuccessRegex, (result, [branch, hash]) => {
        const deletion = branchDeletionSuccess(branch, hash);
        result.all.push(deletion);
        result.branches[branch] = deletion;
      }),
      new LineParser(deleteErrorRegex, (result, [branch]) => {
        const deletion = branchDeletionFailure(branch);
        result.errors.push(deletion);
        result.all.push(deletion);
        result.branches[branch] = deletion;
      })
    ];
    parseBranchDeletions = (stdOut, stdErr) => {
      return parseStringResponse(new BranchDeletionBatch(), parsers8, [stdOut, stdErr]);
    };
  }
});
var BranchSummaryResult;
var init_BranchSummary = __esm({
  "src/lib/responses/BranchSummary.ts"() {
    "use strict";
    BranchSummaryResult = class {
      constructor() {
        this.all = [];
        this.branches = {};
        this.current = "";
        this.detached = false;
      }
      push(status, detached, name, commit, label) {
        if (status === "*") {
          this.detached = detached;
          this.current = name;
        }
        this.all.push(name);
        this.branches[name] = {
          current: status === "*",
          linkedWorkTree: status === "+",
          name,
          commit,
          label
        };
      }
    };
  }
});
function branchStatus(input) {
  return input ? input.charAt(0) : "";
}
function parseBranchSummary(stdOut, currentOnly = false) {
  return parseStringResponse(
    new BranchSummaryResult(),
    currentOnly ? [currentBranchParser] : parsers9,
    stdOut
  );
}
var parsers9;
var currentBranchParser;
var init_parse_branch = __esm({
  "src/lib/parsers/parse-branch.ts"() {
    "use strict";
    init_BranchSummary();
    init_utils();
    parsers9 = [
      new LineParser(
        /^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/,
        (result, [current, name, commit, label]) => {
          result.push(branchStatus(current), true, name, commit, label);
        }
      ),
      new LineParser(
        /^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s,
        (result, [current, name, commit, label]) => {
          result.push(branchStatus(current), false, name, commit, label);
        }
      )
    ];
    currentBranchParser = new LineParser(/^(\S+)$/s, (result, [name]) => {
      result.push("*", false, name, "", "");
    });
  }
});
var branch_exports = {};
__export2(branch_exports, {
  branchLocalTask: () => branchLocalTask,
  branchTask: () => branchTask,
  containsDeleteBranchCommand: () => containsDeleteBranchCommand,
  deleteBranchTask: () => deleteBranchTask,
  deleteBranchesTask: () => deleteBranchesTask
});
function containsDeleteBranchCommand(commands3) {
  const deleteCommands = ["-d", "-D", "--delete"];
  return commands3.some((command) => deleteCommands.includes(command));
}
function branchTask(customArgs) {
  const isDelete = containsDeleteBranchCommand(customArgs);
  const isCurrentOnly = customArgs.includes("--show-current");
  const commands3 = ["branch", ...customArgs];
  if (commands3.length === 1) {
    commands3.push("-a");
  }
  if (!commands3.includes("-v")) {
    commands3.splice(1, 0, "-v");
  }
  return {
    format: "utf-8",
    commands: commands3,
    parser(stdOut, stdErr) {
      if (isDelete) {
        return parseBranchDeletions(stdOut, stdErr).all[0];
      }
      return parseBranchSummary(stdOut, isCurrentOnly);
    }
  };
}
function branchLocalTask() {
  return {
    format: "utf-8",
    commands: ["branch", "-v"],
    parser(stdOut) {
      return parseBranchSummary(stdOut);
    }
  };
}
function deleteBranchesTask(branches, forceDelete = false) {
  return {
    format: "utf-8",
    commands: ["branch", "-v", forceDelete ? "-D" : "-d", ...branches],
    parser(stdOut, stdErr) {
      return parseBranchDeletions(stdOut, stdErr);
    },
    onError({ exitCode, stdOut }, error, done, fail) {
      if (!hasBranchDeletionError(String(error), exitCode)) {
        return fail(error);
      }
      done(stdOut);
    }
  };
}
function deleteBranchTask(branch, forceDelete = false) {
  const task = {
    format: "utf-8",
    commands: ["branch", "-v", forceDelete ? "-D" : "-d", branch],
    parser(stdOut, stdErr) {
      return parseBranchDeletions(stdOut, stdErr).branches[branch];
    },
    onError({ exitCode, stdErr, stdOut }, error, _, fail) {
      if (!hasBranchDeletionError(String(error), exitCode)) {
        return fail(error);
      }
      throw new GitResponseError(
        task.parser(bufferToString(stdOut), bufferToString(stdErr)),
        String(error)
      );
    }
  };
  return task;
}
var init_branch = __esm({
  "src/lib/tasks/branch.ts"() {
    "use strict";
    init_git_response_error();
    init_parse_branch_delete();
    init_parse_branch();
    init_utils();
  }
});
function toPath(input) {
  const path11 = input.trim().replace(/^["']|["']$/g, "");
  return path11 && (0, import_node_path.normalize)(path11);
}
var parseCheckIgnore;
var init_CheckIgnore = __esm({
  "src/lib/responses/CheckIgnore.ts"() {
    "use strict";
    parseCheckIgnore = (text) => {
      return text.split(/\n/g).map(toPath).filter(Boolean);
    };
  }
});
var check_ignore_exports = {};
__export2(check_ignore_exports, {
  checkIgnoreTask: () => checkIgnoreTask
});
function checkIgnoreTask(paths) {
  return {
    commands: ["check-ignore", ...paths],
    format: "utf-8",
    parser: parseCheckIgnore
  };
}
var init_check_ignore = __esm({
  "src/lib/tasks/check-ignore.ts"() {
    "use strict";
    init_CheckIgnore();
  }
});
var clone_exports = {};
__export2(clone_exports, {
  cloneMirrorTask: () => cloneMirrorTask,
  cloneTask: () => cloneTask
});
function disallowedCommand(command) {
  return /^--upload-pack(=|$)/.test(command);
}
function cloneTask(repo, directory, customArgs) {
  const commands3 = ["clone", ...customArgs];
  filterString(repo) && commands3.push(repo);
  filterString(directory) && commands3.push(directory);
  const banned = commands3.find(disallowedCommand);
  if (banned) {
    return configurationErrorTask(`git.fetch: potential exploit argument blocked.`);
  }
  return straightThroughStringTask(commands3);
}
function cloneMirrorTask(repo, directory, customArgs) {
  append(customArgs, "--mirror");
  return cloneTask(repo, directory, customArgs);
}
var init_clone = __esm({
  "src/lib/tasks/clone.ts"() {
    "use strict";
    init_task();
    init_utils();
  }
});
function parseFetchResult(stdOut, stdErr) {
  const result = {
    raw: stdOut,
    remote: null,
    branches: [],
    tags: [],
    updated: [],
    deleted: []
  };
  return parseStringResponse(result, parsers10, [stdOut, stdErr]);
}
var parsers10;
var init_parse_fetch = __esm({
  "src/lib/parsers/parse-fetch.ts"() {
    "use strict";
    init_utils();
    parsers10 = [
      new LineParser(/From (.+)$/, (result, [remote]) => {
        result.remote = remote;
      }),
      new LineParser(/\* \[new branch]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.branches.push({
          name,
          tracking
        });
      }),
      new LineParser(/\* \[new tag]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.tags.push({
          name,
          tracking
        });
      }),
      new LineParser(/- \[deleted]\s+\S+\s*-> (.+)$/, (result, [tracking]) => {
        result.deleted.push({
          tracking
        });
      }),
      new LineParser(
        /\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/,
        (result, [from, to, name, tracking]) => {
          result.updated.push({
            name,
            tracking,
            to,
            from
          });
        }
      )
    ];
  }
});
var fetch_exports = {};
__export2(fetch_exports, {
  fetchTask: () => fetchTask
});
function disallowedCommand2(command) {
  return /^--upload-pack(=|$)/.test(command);
}
function fetchTask(remote, branch, customArgs) {
  const commands3 = ["fetch", ...customArgs];
  if (remote && branch) {
    commands3.push(remote, branch);
  }
  const banned = commands3.find(disallowedCommand2);
  if (banned) {
    return configurationErrorTask(`git.fetch: potential exploit argument blocked.`);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser: parseFetchResult
  };
}
var init_fetch = __esm({
  "src/lib/tasks/fetch.ts"() {
    "use strict";
    init_parse_fetch();
    init_task();
  }
});
function parseMoveResult(stdOut) {
  return parseStringResponse({ moves: [] }, parsers11, stdOut);
}
var parsers11;
var init_parse_move = __esm({
  "src/lib/parsers/parse-move.ts"() {
    "use strict";
    init_utils();
    parsers11 = [
      new LineParser(/^Renaming (.+) to (.+)$/, (result, [from, to]) => {
        result.moves.push({ from, to });
      })
    ];
  }
});
var move_exports = {};
__export2(move_exports, {
  moveTask: () => moveTask
});
function moveTask(from, to) {
  return {
    commands: ["mv", "-v", ...asArray(from), to],
    format: "utf-8",
    parser: parseMoveResult
  };
}
var init_move = __esm({
  "src/lib/tasks/move.ts"() {
    "use strict";
    init_parse_move();
    init_utils();
  }
});
var pull_exports = {};
__export2(pull_exports, {
  pullTask: () => pullTask
});
function pullTask(remote, branch, customArgs) {
  const commands3 = ["pull", ...customArgs];
  if (remote && branch) {
    commands3.splice(1, 0, remote, branch);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(stdOut, stdErr) {
      return parsePullResult(stdOut, stdErr);
    },
    onError(result, _error, _done, fail) {
      const pullError = parsePullErrorResult(
        bufferToString(result.stdOut),
        bufferToString(result.stdErr)
      );
      if (pullError) {
        return fail(new GitResponseError(pullError));
      }
      fail(_error);
    }
  };
}
var init_pull = __esm({
  "src/lib/tasks/pull.ts"() {
    "use strict";
    init_git_response_error();
    init_parse_pull();
    init_utils();
  }
});
function parseGetRemotes(text) {
  const remotes = {};
  forEach(text, ([name]) => (remotes[name] = { name }));
  return Object.values(remotes);
}
function parseGetRemotesVerbose(text) {
  const remotes = {};
  forEach(text, ([name, url, purpose]) => {
    if (!Object.hasOwn(remotes, name)) {
      remotes[name] = {
        name,
        refs: { fetch: "", push: "" }
      };
    }
    if (purpose && url) {
      remotes[name].refs[purpose.replace(/[^a-z]/g, "")] = url;
    }
  });
  return Object.values(remotes);
}
function forEach(text, handler2) {
  forEachLineWithContent(text, (line) => handler2(line.split(/\s+/)));
}
var init_GetRemoteSummary = __esm({
  "src/lib/responses/GetRemoteSummary.ts"() {
    "use strict";
    init_utils();
  }
});
var remote_exports = {};
__export2(remote_exports, {
  addRemoteTask: () => addRemoteTask,
  getRemotesTask: () => getRemotesTask,
  listRemotesTask: () => listRemotesTask,
  remoteTask: () => remoteTask,
  removeRemoteTask: () => removeRemoteTask
});
function addRemoteTask(remoteName, remoteRepo, customArgs) {
  return straightThroughStringTask(["remote", "add", ...customArgs, remoteName, remoteRepo]);
}
function getRemotesTask(verbose) {
  const commands3 = ["remote"];
  if (verbose) {
    commands3.push("-v");
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser: verbose ? parseGetRemotesVerbose : parseGetRemotes
  };
}
function listRemotesTask(customArgs) {
  const commands3 = [...customArgs];
  if (commands3[0] !== "ls-remote") {
    commands3.unshift("ls-remote");
  }
  return straightThroughStringTask(commands3);
}
function remoteTask(customArgs) {
  const commands3 = [...customArgs];
  if (commands3[0] !== "remote") {
    commands3.unshift("remote");
  }
  return straightThroughStringTask(commands3);
}
function removeRemoteTask(remoteName) {
  return straightThroughStringTask(["remote", "remove", remoteName]);
}
var init_remote = __esm({
  "src/lib/tasks/remote.ts"() {
    "use strict";
    init_GetRemoteSummary();
    init_task();
  }
});
var stash_list_exports = {};
__export2(stash_list_exports, {
  stashListTask: () => stashListTask
});
function stashListTask(opt = {}, customArgs) {
  const options = parseLogOptions(opt);
  const commands3 = ["stash", "list", ...options.commands, ...customArgs];
  const parser42 = createListLogSummaryParser(
    options.splitter,
    options.fields,
    logFormatFromCommand(commands3)
  );
  return (
    validateLogFormatConfig(commands3) || {
      commands: commands3,
      format: "utf-8",
      parser: parser42
    }
  );
}
var init_stash_list = __esm({
  "src/lib/tasks/stash-list.ts"() {
    "use strict";
    init_log_format();
    init_parse_list_log_summary();
    init_diff();
    init_log();
  }
});
var sub_module_exports = {};
__export2(sub_module_exports, {
  addSubModuleTask: () => addSubModuleTask,
  initSubModuleTask: () => initSubModuleTask,
  subModuleTask: () => subModuleTask,
  updateSubModuleTask: () => updateSubModuleTask
});
function addSubModuleTask(repo, path11) {
  return subModuleTask(["add", repo, path11]);
}
function initSubModuleTask(customArgs) {
  return subModuleTask(["init", ...customArgs]);
}
function subModuleTask(customArgs) {
  const commands3 = [...customArgs];
  if (commands3[0] !== "submodule") {
    commands3.unshift("submodule");
  }
  return straightThroughStringTask(commands3);
}
function updateSubModuleTask(customArgs) {
  return subModuleTask(["update", ...customArgs]);
}
var init_sub_module = __esm({
  "src/lib/tasks/sub-module.ts"() {
    "use strict";
    init_task();
  }
});
function singleSorted(a, b) {
  const aIsNum = Number.isNaN(a);
  const bIsNum = Number.isNaN(b);
  if (aIsNum !== bIsNum) {
    return aIsNum ? 1 : -1;
  }
  return aIsNum ? sorted(a, b) : 0;
}
function sorted(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function trimmed(input) {
  return input.trim();
}
function toNumber(input) {
  if (typeof input === "string") {
    return parseInt(input.replace(/^\D+/g, ""), 10) || 0;
  }
  return 0;
}
var TagList;
var parseTagList;
var init_TagList = __esm({
  "src/lib/responses/TagList.ts"() {
    "use strict";
    TagList = class {
      constructor(all, latest) {
        this.all = all;
        this.latest = latest;
      }
    };
    parseTagList = function (data, customSort = false) {
      const tags = data.split("\n").map(trimmed).filter(Boolean);
      if (!customSort) {
        tags.sort(function (tagA, tagB) {
          const partsA = tagA.split(".");
          const partsB = tagB.split(".");
          if (partsA.length === 1 || partsB.length === 1) {
            return singleSorted(toNumber(partsA[0]), toNumber(partsB[0]));
          }
          for (let i = 0, l = Math.max(partsA.length, partsB.length); i < l; i++) {
            const diff = sorted(toNumber(partsA[i]), toNumber(partsB[i]));
            if (diff) {
              return diff;
            }
          }
          return 0;
        });
      }
      const latest = customSort
        ? tags[0]
        : [...tags].reverse().find((tag) => tag.indexOf(".") >= 0);
      return new TagList(tags, latest);
    };
  }
});
var tag_exports = {};
__export2(tag_exports, {
  addAnnotatedTagTask: () => addAnnotatedTagTask,
  addTagTask: () => addTagTask,
  tagListTask: () => tagListTask
});
function tagListTask(customArgs = []) {
  const hasCustomSort = customArgs.some((option) => /^--sort=/.test(option));
  return {
    format: "utf-8",
    commands: ["tag", "-l", ...customArgs],
    parser(text) {
      return parseTagList(text, hasCustomSort);
    }
  };
}
function addTagTask(name) {
  return {
    format: "utf-8",
    commands: ["tag", name],
    parser() {
      return { name };
    }
  };
}
function addAnnotatedTagTask(name, tagMessage) {
  return {
    format: "utf-8",
    commands: ["tag", "-a", "-m", tagMessage, name],
    parser() {
      return { name };
    }
  };
}
var init_tag = __esm({
  "src/lib/tasks/tag.ts"() {
    "use strict";
    init_TagList();
  }
});
var require_git = __commonJS2({
  "src/git.js"(exports2, module2) {
    "use strict";
    var { GitExecutor: GitExecutor22 } = (init_git_executor(), __toCommonJS2(git_executor_exports));
    var { SimpleGitApi: SimpleGitApi22 } =
      (init_simple_git_api(), __toCommonJS2(simple_git_api_exports));
    var { Scheduler: Scheduler22 } = (init_scheduler(), __toCommonJS2(scheduler_exports));
    var { configurationErrorTask: configurationErrorTask22 } =
      (init_task(), __toCommonJS2(task_exports));
    var {
      asArray: asArray22,
      filterArray: filterArray22,
      filterPrimitives: filterPrimitives22,
      filterString: filterString22,
      filterStringOrStringArray: filterStringOrStringArray22,
      filterType: filterType22,
      getTrailingOptions: getTrailingOptions22,
      trailingFunctionArgument: trailingFunctionArgument22,
      trailingOptionsArgument: trailingOptionsArgument22
    } = (init_utils(), __toCommonJS2(utils_exports));
    var { applyPatchTask: applyPatchTask22 } =
      (init_apply_patch(), __toCommonJS2(apply_patch_exports));
    var {
      branchTask: branchTask22,
      branchLocalTask: branchLocalTask22,
      deleteBranchesTask: deleteBranchesTask22,
      deleteBranchTask: deleteBranchTask22
    } = (init_branch(), __toCommonJS2(branch_exports));
    var { checkIgnoreTask: checkIgnoreTask22 } =
      (init_check_ignore(), __toCommonJS2(check_ignore_exports));
    var { checkIsRepoTask: checkIsRepoTask22 } =
      (init_check_is_repo(), __toCommonJS2(check_is_repo_exports));
    var { cloneTask: cloneTask22, cloneMirrorTask: cloneMirrorTask22 } =
      (init_clone(), __toCommonJS2(clone_exports));
    var {
      cleanWithOptionsTask: cleanWithOptionsTask22,
      isCleanOptionsArray: isCleanOptionsArray22
    } = (init_clean(), __toCommonJS2(clean_exports));
    var { diffSummaryTask: diffSummaryTask22 } = (init_diff(), __toCommonJS2(diff_exports));
    var { fetchTask: fetchTask22 } = (init_fetch(), __toCommonJS2(fetch_exports));
    var { moveTask: moveTask22 } = (init_move(), __toCommonJS2(move_exports));
    var { pullTask: pullTask22 } = (init_pull(), __toCommonJS2(pull_exports));
    var { pushTagsTask: pushTagsTask22 } = (init_push(), __toCommonJS2(push_exports));
    var {
      addRemoteTask: addRemoteTask22,
      getRemotesTask: getRemotesTask22,
      listRemotesTask: listRemotesTask22,
      remoteTask: remoteTask22,
      removeRemoteTask: removeRemoteTask22
    } = (init_remote(), __toCommonJS2(remote_exports));
    var { getResetMode: getResetMode22, resetTask: resetTask22 } =
      (init_reset(), __toCommonJS2(reset_exports));
    var { stashListTask: stashListTask22 } = (init_stash_list(), __toCommonJS2(stash_list_exports));
    var {
      addSubModuleTask: addSubModuleTask22,
      initSubModuleTask: initSubModuleTask22,
      subModuleTask: subModuleTask22,
      updateSubModuleTask: updateSubModuleTask22
    } = (init_sub_module(), __toCommonJS2(sub_module_exports));
    var {
      addAnnotatedTagTask: addAnnotatedTagTask22,
      addTagTask: addTagTask22,
      tagListTask: tagListTask22
    } = (init_tag(), __toCommonJS2(tag_exports));
    var {
      straightThroughBufferTask: straightThroughBufferTask22,
      straightThroughStringTask: straightThroughStringTask22
    } = (init_task(), __toCommonJS2(task_exports));
    function Git22(options, plugins) {
      this._plugins = plugins;
      this._executor = new GitExecutor22(
        options.baseDir,
        new Scheduler22(options.maxConcurrentProcesses),
        plugins
      );
      this._trimmed = options.trimmed;
    }
    (Git22.prototype = Object.create(SimpleGitApi22.prototype)).constructor = Git22;
    Git22.prototype.customBinary = function (command) {
      this._plugins.reconfigure("binary", command);
      return this;
    };
    Git22.prototype.env = function (name, value) {
      if (arguments.length === 1 && typeof name === "object") {
        this._executor.env = name;
      } else {
        (this._executor.env = this._executor.env || {})[name] = value;
      }
      return this;
    };
    Git22.prototype.stashList = function (options) {
      return this._runTask(
        stashListTask22(
          trailingOptionsArgument22(arguments) || {},
          (filterArray22(options) && options) || []
        ),
        trailingFunctionArgument22(arguments)
      );
    };
    function createCloneTask(api, task, repoPath, localPath) {
      if (typeof repoPath !== "string") {
        return configurationErrorTask22(`git.${api}() requires a string 'repoPath'`);
      }
      return task(
        repoPath,
        filterType22(localPath, filterString22),
        getTrailingOptions22(arguments)
      );
    }
    Git22.prototype.clone = function () {
      return this._runTask(
        createCloneTask("clone", cloneTask22, ...arguments),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.mirror = function () {
      return this._runTask(
        createCloneTask("mirror", cloneMirrorTask22, ...arguments),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.mv = function (from, to) {
      return this._runTask(moveTask22(from, to), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.checkoutLatestTag = function (then) {
      var git = this;
      return this.pull(function () {
        git.tags(function (err, tags) {
          git.checkout(tags.latest, then);
        });
      });
    };
    Git22.prototype.pull = function (remote, branch, options, then) {
      return this._runTask(
        pullTask22(
          filterType22(remote, filterString22),
          filterType22(branch, filterString22),
          getTrailingOptions22(arguments)
        ),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.fetch = function (remote, branch) {
      return this._runTask(
        fetchTask22(
          filterType22(remote, filterString22),
          filterType22(branch, filterString22),
          getTrailingOptions22(arguments)
        ),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.silent = function (silence) {
      console.warn(
        "simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3"
      );
      return this;
    };
    Git22.prototype.tags = function (options, then) {
      return this._runTask(
        tagListTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.rebase = function () {
      return this._runTask(
        straightThroughStringTask22(["rebase", ...getTrailingOptions22(arguments)]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.reset = function (mode) {
      return this._runTask(
        resetTask22(getResetMode22(mode), getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.revert = function (commit) {
      const next = trailingFunctionArgument22(arguments);
      if (typeof commit !== "string") {
        return this._runTask(configurationErrorTask22("Commit must be a string"), next);
      }
      return this._runTask(
        straightThroughStringTask22([
          "revert",
          ...getTrailingOptions22(arguments, 0, true),
          commit
        ]),
        next
      );
    };
    Git22.prototype.addTag = function (name) {
      const task =
        typeof name === "string"
          ? addTagTask22(name)
          : configurationErrorTask22("Git.addTag requires a tag name");
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.addAnnotatedTag = function (tagName, tagMessage) {
      return this._runTask(
        addAnnotatedTagTask22(tagName, tagMessage),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.deleteLocalBranch = function (branchName, forceDelete, then) {
      return this._runTask(
        deleteBranchTask22(branchName, typeof forceDelete === "boolean" ? forceDelete : false),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.deleteLocalBranches = function (branchNames, forceDelete, then) {
      return this._runTask(
        deleteBranchesTask22(branchNames, typeof forceDelete === "boolean" ? forceDelete : false),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.branch = function (options, then) {
      return this._runTask(
        branchTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.branchLocal = function (then) {
      return this._runTask(branchLocalTask22(), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.raw = function (commands3) {
      const createRestCommands = !Array.isArray(commands3);
      const command = [].slice.call(createRestCommands ? arguments : commands3, 0);
      for (let i = 0; i < command.length && createRestCommands; i++) {
        if (!filterPrimitives22(command[i])) {
          command.splice(i, command.length - i);
          break;
        }
      }
      command.push(...getTrailingOptions22(arguments, 0, true));
      var next = trailingFunctionArgument22(arguments);
      if (!command.length) {
        return this._runTask(
          configurationErrorTask22("Raw: must supply one or more command to execute"),
          next
        );
      }
      return this._runTask(straightThroughStringTask22(command, this._trimmed), next);
    };
    Git22.prototype.submoduleAdd = function (repo, path11, then) {
      return this._runTask(addSubModuleTask22(repo, path11), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.submoduleUpdate = function (args, then) {
      return this._runTask(
        updateSubModuleTask22(getTrailingOptions22(arguments, true)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.submoduleInit = function (args, then) {
      return this._runTask(
        initSubModuleTask22(getTrailingOptions22(arguments, true)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.subModule = function (options, then) {
      return this._runTask(
        subModuleTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.listRemote = function () {
      return this._runTask(
        listRemotesTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.addRemote = function (remoteName, remoteRepo, then) {
      return this._runTask(
        addRemoteTask22(remoteName, remoteRepo, getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.removeRemote = function (remoteName, then) {
      return this._runTask(removeRemoteTask22(remoteName), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.getRemotes = function (verbose, then) {
      return this._runTask(
        getRemotesTask22(verbose === true),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.remote = function (options, then) {
      return this._runTask(
        remoteTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.tag = function (options, then) {
      const command = getTrailingOptions22(arguments);
      if (command[0] !== "tag") {
        command.unshift("tag");
      }
      return this._runTask(
        straightThroughStringTask22(command),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.updateServerInfo = function (then) {
      return this._runTask(
        straightThroughStringTask22(["update-server-info"]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.pushTags = function (remote, then) {
      const task = pushTagsTask22(
        { remote: filterType22(remote, filterString22) },
        getTrailingOptions22(arguments)
      );
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.rm = function (files) {
      return this._runTask(
        straightThroughStringTask22(["rm", "-f", ...asArray22(files)]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.rmKeepLocal = function (files) {
      return this._runTask(
        straightThroughStringTask22(["rm", "--cached", ...asArray22(files)]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.catFile = function (options, then) {
      return this._catFile("utf-8", arguments);
    };
    Git22.prototype.binaryCatFile = function () {
      return this._catFile("buffer", arguments);
    };
    Git22.prototype._catFile = function (format, args) {
      var handler2 = trailingFunctionArgument22(args);
      var command = ["cat-file"];
      var options = args[0];
      if (typeof options === "string") {
        return this._runTask(
          configurationErrorTask22("Git.catFile: options must be supplied as an array of strings"),
          handler2
        );
      }
      if (Array.isArray(options)) {
        command.push.apply(command, options);
      }
      const task =
        format === "buffer"
          ? straightThroughBufferTask22(command)
          : straightThroughStringTask22(command);
      return this._runTask(task, handler2);
    };
    Git22.prototype.diff = function (options, then) {
      const task = filterString22(options)
        ? configurationErrorTask22(
            "git.diff: supplying options as a single string is no longer supported, switch to an array of strings"
          )
        : straightThroughStringTask22(["diff", ...getTrailingOptions22(arguments)]);
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.diffSummary = function () {
      return this._runTask(
        diffSummaryTask22(getTrailingOptions22(arguments, 1)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.applyPatch = function (patches) {
      const task = !filterStringOrStringArray22(patches)
        ? configurationErrorTask22(
            `git.applyPatch requires one or more string patches as the first argument`
          )
        : applyPatchTask22(asArray22(patches), getTrailingOptions22([].slice.call(arguments, 1)));
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.revparse = function () {
      const commands3 = ["rev-parse", ...getTrailingOptions22(arguments, true)];
      return this._runTask(
        straightThroughStringTask22(commands3, true),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.clean = function (mode, options, then) {
      const usingCleanOptionsArray = isCleanOptionsArray22(mode);
      const cleanMode =
        (usingCleanOptionsArray && mode.join("")) || filterType22(mode, filterString22) || "";
      const customArgs = getTrailingOptions22(
        [].slice.call(arguments, usingCleanOptionsArray ? 1 : 0)
      );
      return this._runTask(
        cleanWithOptionsTask22(cleanMode, customArgs),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.exec = function (then) {
      const task = {
        commands: [],
        format: "utf-8",
        parser() {
          if (typeof then === "function") {
            then();
          }
        }
      };
      return this._runTask(task);
    };
    Git22.prototype.clearQueue = function () {
      return this;
    };
    Git22.prototype.checkIgnore = function (pathnames, then) {
      return this._runTask(
        checkIgnoreTask22(asArray22(filterType22(pathnames, filterStringOrStringArray22, []))),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.checkIsRepo = function (checkType, then) {
      return this._runTask(
        checkIsRepoTask22(filterType22(checkType, filterString22)),
        trailingFunctionArgument22(arguments)
      );
    };
    module2.exports = Git22;
  }
});
init_pathspec();
init_git_error();
init_git_error();
init_git_error();
init_git_response_error();
init_task_configuration_error();
init_check_is_repo();
init_clean();
init_config();
init_diff_name_status();
init_grep();
init_reset();
init_utils();
init_utils();
var never = (0, import_promise_deferred2.deferred)().promise;
init_utils();
init_git_error();
init_utils();
init_utils();
init_utils();
init_pathspec();
init_utils();
var Git = require_git();
init_git_response_error();

// ../src/services/git.ts
async function isGitRepo(repoPath) {
  try {
    await import_promises2.default.access(import_path2.default.join(repoPath, ".git"));
    return true;
  } catch {
    return false;
  }
}

// ../src/services/analyzer.ts
var PACKAGE_MANAGERS = [
  { file: "pnpm-lock.yaml", name: "pnpm" },
  { file: "yarn.lock", name: "yarn" },
  { file: "package-lock.json", name: "npm" },
  { file: "bun.lockb", name: "bun" }
];
async function analyzeRepo(repoPath) {
  const files = await safeReadDir(repoPath);
  const analysis = {
    path: repoPath,
    isGitRepo: await isGitRepo(repoPath),
    languages: [],
    frameworks: []
  };
  const hasPackageJson = files.includes("package.json");
  const hasTsConfig = files.includes("tsconfig.json");
  const hasPyProject = files.includes("pyproject.toml");
  const hasRequirements = files.includes("requirements.txt");
  const hasGoMod = files.includes("go.mod");
  const hasCargo = files.includes("Cargo.toml");
  const hasCsproj = files.some((f) => f.endsWith(".csproj") || f.endsWith(".sln"));
  const hasPomXml = files.includes("pom.xml");
  const hasBuildGradle = files.includes("build.gradle") || files.includes("build.gradle.kts");
  const hasGemfile = files.includes("Gemfile");
  const hasComposerJson = files.includes("composer.json");
  if (hasPackageJson) analysis.languages.push("JavaScript");
  if (hasTsConfig) analysis.languages.push("TypeScript");
  if (hasPyProject || hasRequirements) analysis.languages.push("Python");
  if (hasGoMod) analysis.languages.push("Go");
  if (hasCargo) analysis.languages.push("Rust");
  if (hasCsproj) analysis.languages.push("C#");
  if (hasPomXml || hasBuildGradle) analysis.languages.push("Java");
  if (hasGemfile) analysis.languages.push("Ruby");
  if (hasComposerJson) analysis.languages.push("PHP");
  analysis.packageManager = await detectPackageManager(repoPath, files);
  let rootPackageJson;
  if (hasPackageJson) {
    rootPackageJson = await readJson(import_path3.default.join(repoPath, "package.json"));
    const deps = Object.keys({
      ...(rootPackageJson?.dependencies ?? {}),
      ...(rootPackageJson?.devDependencies ?? {})
    });
    analysis.frameworks.push(...detectFrameworks(deps, files));
  }
  const workspace8 = await detectWorkspace(repoPath, files, rootPackageJson);
  if (workspace8) {
    analysis.workspaceType = workspace8.type;
    analysis.workspacePatterns = workspace8.patterns;
  }
  let apps = await resolveWorkspaceApps(repoPath, workspace8?.patterns ?? [], rootPackageJson);
  if (apps.length <= 1) {
    const nonJs = await detectNonJsMonorepo(repoPath, files);
    if (nonJs.apps.length > 1) {
      apps = nonJs.apps;
      if (nonJs.type) analysis.workspaceType = nonJs.type;
      if (nonJs.patterns) analysis.workspacePatterns = nonJs.patterns;
    }
  }
  analysis.apps = apps;
  analysis.isMonorepo = apps.length > 1;
  analysis.languages = unique(analysis.languages);
  analysis.frameworks = unique(analysis.frameworks);
  analysis.areas = await detectAreas(repoPath, analysis);
  return analysis;
}
async function detectPackageManager(_repoPath, files) {
  for (const manager of PACKAGE_MANAGERS) {
    if (files.includes(manager.file)) return manager.name;
  }
  if (files.includes("package.json")) return "npm";
  if (files.includes("pyproject.toml")) return "pip";
  if (files.includes("pom.xml")) return "maven";
  if (files.includes("build.gradle") || files.includes("build.gradle.kts")) return "gradle";
  if (files.includes("Gemfile")) return "bundler";
  if (files.includes("composer.json")) return "composer";
  return void 0;
}
function detectFrameworks(deps, files) {
  const frameworks = [];
  const hasFile = (file) => files.includes(file);
  if (deps.includes("next") || hasFile("next.config.js") || hasFile("next.config.mjs"))
    frameworks.push("Next.js");
  if (deps.includes("react") || deps.includes("react-dom")) frameworks.push("React");
  if (deps.includes("vue") || hasFile("vue.config.js")) frameworks.push("Vue");
  if (deps.includes("@angular/core") || hasFile("angular.json")) frameworks.push("Angular");
  if (deps.includes("svelte") || hasFile("svelte.config.js")) frameworks.push("Svelte");
  if (deps.includes("express")) frameworks.push("Express");
  if (deps.includes("@nestjs/core")) frameworks.push("NestJS");
  if (deps.includes("fastify")) frameworks.push("Fastify");
  return frameworks;
}
async function safeReadFile(filePath) {
  try {
    return await import_promises3.default.readFile(filePath, "utf8");
  } catch {
    return void 0;
  }
}
async function detectWorkspace(repoPath, files, packageJson) {
  if (files.includes("pnpm-workspace.yaml")) {
    const patterns = await readPnpmWorkspace(
      import_path3.default.join(repoPath, "pnpm-workspace.yaml")
    );
    if (patterns.length) return { type: "pnpm", patterns };
  }
  const workspaces = packageJson?.workspaces;
  if (Array.isArray(workspaces)) {
    return { type: files.includes("yarn.lock") ? "yarn" : "npm", patterns: workspaces.map(String) };
  }
  if (workspaces && typeof workspaces === "object") {
    const packages = workspaces.packages;
    if (Array.isArray(packages)) {
      return { type: files.includes("yarn.lock") ? "yarn" : "npm", patterns: packages.map(String) };
    }
  }
  return void 0;
}
async function readPnpmWorkspace(filePath) {
  try {
    const raw = await import_promises3.default.readFile(filePath, "utf8");
    const lines = raw.split(/\r?\n/u);
    const patterns = [];
    let inPackages = false;
    for (const line of lines) {
      if (/^\s*#/u.test(line)) continue;
      if (!inPackages && /^\s*packages\s*:/u.test(line)) {
        const inline = line.match(/packages\s*:\s*\[([^\]]+)\]/u);
        if (inline) {
          const items = inline[1].split(",").map((s) => s.trim().replace(/^['"]|['"]$/gu, ""));
          return items.filter(Boolean);
        }
        inPackages = true;
        continue;
      }
      if (inPackages) {
        const match = line.match(/^\s*-\s*(.+)$/u);
        if (match?.[1]) {
          const value = match[1]
            .split("#")[0]
            .trim()
            .replace(/^['"]|['"]$/gu, "");
          if (value) patterns.push(value);
          continue;
        }
        if (/^\S/u.test(line) && line.trim()) break;
      }
    }
    return patterns;
  } catch {
    return [];
  }
}
async function resolveWorkspaceApps(repoPath, patterns, rootPackageJson) {
  const workspacePatterns = patterns
    .map((pattern) => pattern.replace(/\\/gu, "/"))
    .map((pattern) =>
      pattern.endsWith("package.json")
        ? pattern
        : import_path3.default.posix.join(pattern, "package.json")
    );
  const packageJsonPaths = workspacePatterns.length
    ? (
        await (0, import_fast_glob.default)(workspacePatterns, {
          cwd: repoPath,
          absolute: true,
          onlyFiles: true,
          dot: false
        })
      ).map((p) => import_path3.default.normalize(p))
    : [];
  if (!packageJsonPaths.length && rootPackageJson) {
    const rootPath = import_path3.default.join(repoPath, "package.json");
    return [await buildRepoApp(repoPath, rootPath, rootPackageJson)];
  }
  const apps = await Promise.all(
    packageJsonPaths.map(async (pkgPath) => {
      const pkg = await readJson(pkgPath);
      return buildRepoApp(import_path3.default.dirname(pkgPath), pkgPath, pkg);
    })
  );
  return apps.filter(Boolean);
}
async function buildRepoApp(appPath, packageJsonPath, packageJson) {
  const scripts = packageJson?.scripts ?? {};
  const name =
    typeof packageJson?.name === "string"
      ? packageJson.name
      : import_path3.default.basename(appPath);
  const hasTsConfig = await fileExists(import_path3.default.join(appPath, "tsconfig.json"));
  return {
    name,
    path: appPath,
    ecosystem: "node",
    manifestPath: packageJsonPath,
    packageJsonPath,
    scripts,
    hasTsConfig
  };
}
function buildNonJsApp(name, appPath, ecosystem, manifestPath) {
  return {
    name,
    path: appPath,
    ecosystem,
    manifestPath,
    packageJsonPath: "",
    scripts: {},
    hasTsConfig: false
  };
}
async function detectNonJsMonorepo(repoPath, files) {
  const cargoApps = await detectCargoWorkspace(repoPath);
  if (cargoApps.length > 1) return { type: "cargo", apps: cargoApps };
  const goApps = await detectGoWorkspace(repoPath);
  if (goApps.length > 1) return { type: "go", apps: goApps };
  const dotnetApps = await detectDotnetSolution(repoPath, files);
  if (dotnetApps.length > 1) return { type: "dotnet", apps: dotnetApps };
  const gradleApps = await detectGradleMultiProject(repoPath, files);
  if (gradleApps.length > 1) return { type: "gradle", apps: gradleApps };
  const mavenApps = await detectMavenMultiModule(repoPath);
  if (mavenApps.length > 1) return { type: "maven", apps: mavenApps };
  return { apps: [] };
}
async function detectCargoWorkspace(repoPath) {
  const content = await safeReadFile(import_path3.default.join(repoPath, "Cargo.toml"));
  if (!content) return [];
  const workspaceSection = content.match(/\[workspace\]([\s\S]*?)(?:\n\[|$)/u);
  if (!workspaceSection) return [];
  const membersMatch = workspaceSection[1].match(/members\s*=\s*\[([\s\S]*?)\]/u);
  if (!membersMatch) return [];
  const patterns = [...membersMatch[1].matchAll(/"([^"]+)"/gu)].map((m) => m[1]);
  if (!patterns.length) return [];
  const tomlPaths = (
    await (0, import_fast_glob.default)(
      patterns.map((p) => import_path3.default.posix.join(p, "Cargo.toml")),
      { cwd: repoPath, absolute: true, onlyFiles: true }
    )
  ).map((p) => import_path3.default.normalize(p));
  return Promise.all(
    tomlPaths.map(async (tomlPath) => {
      const dir = import_path3.default.dirname(tomlPath);
      const toml = await safeReadFile(tomlPath);
      const nameMatch = toml?.match(/^\s*name\s*=\s*"([^"]+)"/mu);
      return buildNonJsApp(
        nameMatch?.[1] ?? import_path3.default.basename(dir),
        dir,
        "rust",
        tomlPath
      );
    })
  );
}
async function detectGoWorkspace(repoPath) {
  const content = await safeReadFile(import_path3.default.join(repoPath, "go.work"));
  if (!content) return [];
  const modules = [];
  const blockMatch = content.match(/use\s*\(([\s\S]*?)\)/u);
  if (blockMatch) {
    for (const line of blockMatch[1].split(/\r?\n/u)) {
      const trimmed3 = line.replace(/\/\/.*$/u, "").trim();
      if (trimmed3) modules.push(trimmed3);
    }
  }
  for (const match of content.matchAll(/^use\s+(\S+)\s*$/gmu)) {
    modules.push(match[1]);
  }
  const apps = [];
  for (const mod of modules) {
    const modPath = import_path3.default.resolve(repoPath, mod);
    const goModPath = import_path3.default.join(modPath, "go.mod");
    if (!(await fileExists(goModPath))) continue;
    const goMod = await safeReadFile(goModPath);
    const nameMatch = goMod?.match(/^module\s+(\S+)/mu);
    const shortName = nameMatch?.[1]?.split("/").pop() ?? import_path3.default.basename(modPath);
    apps.push(buildNonJsApp(shortName, modPath, "go", goModPath));
  }
  return apps;
}
async function detectDotnetSolution(repoPath, files) {
  const slnFile = files.find((f) => f.endsWith(".sln"));
  if (!slnFile) return [];
  const content = await safeReadFile(import_path3.default.join(repoPath, slnFile));
  if (!content) return [];
  const projectRegex = /Project\("[^"]*"\)\s*=\s*"([^"]+)",\s*"([^"]+\.(?:cs|fs|vb)proj)"/giu;
  const apps = [];
  for (const match of content.matchAll(projectRegex)) {
    const name = match[1];
    const projRelPath = match[2].replace(/\\/gu, "/");
    const projPath = import_path3.default.resolve(repoPath, projRelPath);
    const appDir = import_path3.default.dirname(projPath);
    if (await fileExists(projPath)) {
      apps.push(buildNonJsApp(name, appDir, "dotnet", projPath));
    }
  }
  return apps;
}
async function detectGradleMultiProject(repoPath, files) {
  const settingsFile = files.includes("settings.gradle.kts")
    ? "settings.gradle.kts"
    : files.includes("settings.gradle")
      ? "settings.gradle"
      : null;
  if (!settingsFile) return [];
  const content = await safeReadFile(import_path3.default.join(repoPath, settingsFile));
  if (!content) return [];
  const projectNames = [];
  for (const match of content.matchAll(/['"](:(?:[\w.-]+:)*[\w.-]+)['"]/gu)) {
    projectNames.push(match[1].replace(/^:/u, "").replace(/:/gu, "/"));
  }
  const uniqueProjects = [...new Set(projectNames)];
  const apps = [];
  for (const project of uniqueProjects) {
    const projectDir = import_path3.default.resolve(repoPath, project);
    const ktsPath = import_path3.default.join(projectDir, "build.gradle.kts");
    const groovyPath = import_path3.default.join(projectDir, "build.gradle");
    const buildFile = (await fileExists(ktsPath))
      ? ktsPath
      : (await fileExists(groovyPath))
        ? groovyPath
        : null;
    if (buildFile) {
      apps.push(
        buildNonJsApp(import_path3.default.basename(project), projectDir, "java", buildFile)
      );
    }
  }
  return apps;
}
async function detectMavenMultiModule(repoPath) {
  const content = await safeReadFile(import_path3.default.join(repoPath, "pom.xml"));
  if (!content) return [];
  const apps = [];
  for (const match of content.matchAll(/<module>([^<]+)<\/module>/gu)) {
    const modName = match[1].trim();
    const modDir = import_path3.default.resolve(repoPath, modName);
    const pomPath = import_path3.default.join(modDir, "pom.xml");
    if (await fileExists(pomPath)) {
      apps.push(buildNonJsApp(import_path3.default.basename(modName), modDir, "java", pomPath));
    }
  }
  return apps;
}
function unique(items) {
  return Array.from(new Set(items));
}
var AREA_HEURISTIC_DIRS = [
  "frontend",
  "backend",
  "api",
  "web",
  "mobile",
  "app",
  "server",
  "client",
  "infra",
  "infrastructure",
  "shared",
  "common",
  "lib",
  "libs",
  "packages",
  "services",
  "docs",
  "scripts",
  "tools",
  "cli",
  "sdk",
  "core",
  "admin",
  "portal",
  "dashboard",
  "worker",
  "functions"
];
var MANIFEST_FILES = [
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "go.mod",
  "Cargo.toml",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Gemfile",
  "composer.json",
  "setup.py",
  "setup.cfg"
];
function areasFromApps(repoPath, apps) {
  return apps.map((app) => {
    const rel = import_path3.default.relative(repoPath, app.path).replace(/\\/gu, "/");
    return {
      name: app.name,
      applyTo: `${rel}/**`,
      path: app.path,
      ecosystem: app.ecosystem,
      source: "auto",
      scripts: Object.keys(app.scripts).length > 0 ? app.scripts : void 0,
      hasTsConfig: app.hasTsConfig || void 0
    };
  });
}
async function areasFromHeuristics(repoPath) {
  const entries = await safeReadDir(repoPath);
  const areas = [];
  for (const entry of entries) {
    const lower = entry.toLowerCase();
    if (!AREA_HEURISTIC_DIRS.includes(lower)) continue;
    const fullPath = import_path3.default.join(repoPath, entry);
    try {
      const stat = await import_promises3.default.stat(fullPath);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }
    const children = await safeReadDir(fullPath);
    const hasManifest = children.some((c) => MANIFEST_FILES.includes(c));
    const hasCode = children.some(
      (c) =>
        c.endsWith(".ts") ||
        c.endsWith(".js") ||
        c.endsWith(".py") ||
        c.endsWith(".go") ||
        c.endsWith(".rs") ||
        c.endsWith(".java") ||
        c.endsWith(".cs") ||
        c.endsWith(".rb") ||
        c.endsWith(".php")
    );
    const hasSrcDir = children.includes("src");
    if (!hasManifest && !hasCode && !hasSrcDir) continue;
    let scripts;
    let hasTsConfig;
    if (children.includes("package.json")) {
      const pkg = await readJson(import_path3.default.join(fullPath, "package.json"));
      const pkgScripts = pkg?.scripts ?? {};
      if (Object.keys(pkgScripts).length > 0) scripts = pkgScripts;
    }
    if (children.includes("tsconfig.json")) {
      hasTsConfig = true;
    }
    areas.push({
      name: entry,
      applyTo: `${entry}/**`,
      path: fullPath,
      source: "auto",
      scripts,
      hasTsConfig
    });
  }
  return areas;
}
async function detectAreas(repoPath, analysis) {
  let autoAreas;
  if (analysis.isMonorepo && analysis.apps && analysis.apps.length > 1) {
    const appAreas = areasFromApps(repoPath, analysis.apps);
    const heuristicAreas = await areasFromHeuristics(repoPath);
    const byName = new Map(heuristicAreas.map((a) => [a.name.toLowerCase(), a]));
    for (const a of appAreas) {
      byName.set(a.name.toLowerCase(), a);
    }
    autoAreas = Array.from(byName.values());
  } else {
    autoAreas = await areasFromHeuristics(repoPath);
  }
  const config = await loadPrimerConfig(repoPath);
  if (!config?.areas?.length) return autoAreas;
  const resolvedRoot = import_path3.default.resolve(repoPath);
  const configAreas = [];
  for (const ca of config.areas) {
    const patterns = Array.isArray(ca.applyTo) ? ca.applyTo : [ca.applyTo];
    const firstSegment = patterns[0].split("/")[0];
    const basePath =
      firstSegment.includes("*") || firstSegment.includes("?")
        ? repoPath
        : import_path3.default.join(repoPath, firstSegment);
    const resolved = import_path3.default.resolve(basePath);
    if (resolved !== resolvedRoot && !resolved.startsWith(resolvedRoot + import_path3.default.sep))
      continue;
    let scripts;
    let hasTsConfig;
    try {
      const children = await safeReadDir(basePath);
      if (children.includes("package.json")) {
        const pkg = await readJson(import_path3.default.join(basePath, "package.json"));
        const pkgScripts = pkg?.scripts ?? {};
        if (Object.keys(pkgScripts).length > 0) scripts = pkgScripts;
      }
      if (children.includes("tsconfig.json")) hasTsConfig = true;
    } catch {}
    configAreas.push({
      name: ca.name,
      description: ca.description,
      applyTo: ca.applyTo,
      path: basePath,
      source: "config",
      scripts,
      hasTsConfig
    });
  }
  const autoByName = new Map(autoAreas.map((a) => [a.name.toLowerCase(), a]));
  for (const ca of configAreas) {
    autoByName.set(ca.name.toLowerCase(), ca);
  }
  return Array.from(autoByName.values());
}
async function loadPrimerConfig(repoPath) {
  const candidates = [
    import_path3.default.join(repoPath, "primer.config.json"),
    import_path3.default.join(repoPath, ".github", "primer.config.json")
  ];
  for (const candidate of candidates) {
    const json = await readJson(candidate);
    if (!json) continue;
    if (json.areas !== void 0 && !Array.isArray(json.areas)) {
      return void 0;
    }
    const areas = [];
    if (Array.isArray(json.areas)) {
      for (const entry of json.areas) {
        if (
          typeof entry === "object" &&
          entry !== null &&
          typeof entry.name === "string" &&
          entry.applyTo !== void 0
        ) {
          const e = entry;
          if (!e.name.trim()) continue;
          const rawApplyTo = e.applyTo;
          let applyTo;
          if (typeof rawApplyTo === "string") {
            applyTo = rawApplyTo;
          } else if (Array.isArray(rawApplyTo) && rawApplyTo.every((v) => typeof v === "string")) {
            applyTo = rawApplyTo;
          } else {
            continue;
          }
          if (
            (typeof applyTo === "string" && !applyTo.trim()) ||
            (Array.isArray(applyTo) && applyTo.length === 0)
          )
            continue;
          const allPatterns = Array.isArray(applyTo) ? applyTo : [applyTo];
          if (allPatterns.some((p) => p.split("/").includes(".."))) continue;
          areas.push({
            name: e.name,
            applyTo,
            description: typeof e.description === "string" ? e.description : void 0
          });
        }
      }
    }
    let policies;
    if (Array.isArray(json.policies)) {
      policies = json.policies.filter((p) => typeof p === "string" && p.trim() !== "");
    }
    return { areas, policies: policies?.length ? policies : void 0 };
  }
  return void 0;
}
function sanitizeAreaName(name) {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "");
  return sanitized || "unnamed";
}

// ../src/services/generator.ts
var import_path4 = __toESM(require("path"), 1);
async function generateConfigs(options) {
  const { repoPath, analysis, selections, force } = options;
  const files = [];
  if (selections.includes("mcp")) {
    const filePath = import_path4.default.join(repoPath, ".vscode", "mcp.json");
    await ensureDir(import_path4.default.dirname(filePath));
    const content = renderMcp();
    const { wrote } = await safeWriteFile(filePath, content, force);
    files.push({
      path: import_path4.default.relative(process.cwd(), filePath),
      action: wrote ? "wrote" : "skipped"
    });
  }
  if (selections.includes("vscode")) {
    const filePath = import_path4.default.join(repoPath, ".vscode", "settings.json");
    await ensureDir(import_path4.default.dirname(filePath));
    const content = renderVscodeSettings(analysis);
    const { wrote } = await safeWriteFile(filePath, content, force);
    files.push({
      path: import_path4.default.relative(process.cwd(), filePath),
      action: wrote ? "wrote" : "skipped"
    });
  }
  return { files };
}
function renderMcp() {
  return JSON.stringify(
    {
      servers: {
        github: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-github"],
          env: {
            GITHUB_PERSONAL_ACCESS_TOKEN: "${input:github_token}"
          }
        },
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
        }
      },
      inputs: [
        {
          id: "github_token",
          type: "promptString",
          description: "GitHub Personal Access Token"
        }
      ]
    },
    null,
    2
  );
}
function renderVscodeSettings(analysis) {
  const reviewFocus = analysis.frameworks.length
    ? `Focus on ${analysis.frameworks.join(", ")} best practices and repo conventions.`
    : "Focus on repo conventions and maintainability.";
  return JSON.stringify(
    {
      "github.copilot.chat.codeGeneration.instructions": [
        { file: ".github/copilot-instructions.md" }
      ],
      "github.copilot.chat.reviewSelection.instructions": [{ text: reviewFocus }],
      "chat.promptFiles": true,
      "chat.mcp.enabled": true
    },
    null,
    2
  );
}

// ../src/config.ts
var DEFAULT_MODEL = "claude-sonnet-4.5";

// ../src/services/copilot.ts
var import_promises4 = __toESM(require("fs/promises"), 1);
var import_node_child_process = require("node:child_process");
var import_node_util = require("node:util");
var import_path5 = __toESM(require("path"), 1);
var import_fast_glob2 = __toESM(require_out4(), 1);
var execFileAsync = (0, import_node_util.promisify)(import_node_child_process.execFile);
var cachedCliConfig = null;
var cachedCliConfigTimestamp = 0;
var CLI_CACHE_TTL_MS = 5 * 60 * 1e3;
function cacheConfig(config) {
  cachedCliConfig = config;
  cachedCliConfigTimestamp = Date.now();
  return config;
}
async function assertCopilotCliReady() {
  const config = await findCopilotCliConfig();
  try {
    const [cmd, args] = buildExecArgs(config, ["--version"]);
    await execFileAsync(cmd, args, { timeout: 5e3 });
  } catch {
    const desc = config.cliArgs ? `${config.cliPath} ${config.cliArgs.join(" ")}` : config.cliPath;
    throw new Error(`Copilot CLI at ${desc} is not working.`);
  }
  return config;
}
function buildExecArgs(config, extraArgs) {
  if (config.cliArgs && config.cliArgs.length > 0) {
    return [config.cliPath, [...config.cliArgs, ...extraArgs]];
  }
  if (
    process.platform === "win32" &&
    (config.cliPath.endsWith(".bat") || config.cliPath.endsWith(".cmd"))
  ) {
    return ["cmd", ["/c", config.cliPath, ...extraArgs]];
  }
  return [config.cliPath, extraArgs];
}
async function findCopilotCliConfig() {
  if (cachedCliConfig && Date.now() - cachedCliConfigTimestamp < CLI_CACHE_TTL_MS) {
    return cachedCliConfig;
  }
  const isWindows = process.platform === "win32";
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  const appData = process.env.APPDATA ?? "";
  if (isWindows && appData) {
    const npmLoaderPath = import_path5.default.join(
      appData,
      "npm",
      "node_modules",
      "@github",
      "copilot",
      "npm-loader.js"
    );
    try {
      await import_promises4.default.access(npmLoaderPath);
      return cacheConfig({ cliPath: process.execPath, cliArgs: [npmLoaderPath] });
    } catch {}
  }
  const whichCmd = isWindows ? "where" : "which";
  try {
    const { stdout } = await execFileAsync(whichCmd, ["copilot"], { timeout: 5e3 });
    const found = stdout.trim().split(/\r?\n/)[0];
    if (found) {
      return cacheConfig({ cliPath: found });
    }
  } catch {}
  const staticLocations = [];
  if (process.platform === "darwin") {
    staticLocations.push(
      `${home}/Library/Application Support/Code - Insiders/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
      `${home}/Library/Application Support/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`
    );
  } else if (process.platform === "linux") {
    staticLocations.push(
      `${home}/.config/Code - Insiders/User/globalStorage/github.copilot-chat/copilotCli/copilot`,
      `${home}/.config/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`
    );
  } else if (isWindows && appData) {
    staticLocations.push(
      `${appData}\\Code - Insiders\\User\\globalStorage\\github.copilot-chat\\copilotCli\\copilot.bat`,
      `${appData}\\Code\\User\\globalStorage\\github.copilot-chat\\copilotCli\\copilot.bat`
    );
  }
  for (const location of staticLocations) {
    try {
      await import_promises4.default.access(location);
      return cacheConfig({ cliPath: location });
    } catch {}
  }
  const exts = isWindows ? "{.exe,.bat,.cmd}" : "";
  const normalizedHome = home.replace(/\\/g, "/");
  const globPatterns = [
    `${normalizedHome}/.vscode-insiders/extensions/github.copilot-chat-*/copilotCli/copilot${exts}`,
    `${normalizedHome}/.vscode/extensions/github.copilot-chat-*/copilotCli/copilot${exts}`
  ];
  for (const pattern of globPatterns) {
    const matches = await (0, import_fast_glob2.default)(pattern, { onlyFiles: true });
    if (matches.length > 0) {
      return cacheConfig({ cliPath: import_path5.default.normalize(matches[0]) });
    }
  }
  const platformHint = isWindows
    ? " Searched APPDATA and VS Code extension paths."
    : process.platform === "linux"
      ? " Searched ~/.config/Code and VS Code extension paths."
      : " Searched ~/Library/Application Support/Code and VS Code extension paths.";
  throw new Error(
    `Copilot CLI not found. Install GitHub Copilot Chat extension in VS Code or run: npm install -g @github/copilot.${platformHint}`
  );
}

// ../src/services/instructions.ts
async function generateCopilotInstructions(options) {
  const repoPath = options.repoPath;
  const progress = options.onProgress ?? (() => {});
  progress("Checking Copilot CLI...");
  const cliConfig = await assertCopilotCliReady();
  progress("Starting Copilot SDK...");
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient(cliConfig);
  try {
    progress("Creating session...");
    const preferredModel = options.model ?? DEFAULT_MODEL;
    const session = await client.createSession({
      model: preferredModel,
      streaming: true,
      workingDirectory: repoPath,
      systemMessage: {
        content:
          "You are an expert codebase analyst. Your task is to generate a concise .github/copilot-instructions.md file. Use the available tools (glob, view, grep) to explore the codebase. Output ONLY the final markdown content, no explanations."
      },
      infiniteSessions: { enabled: false }
    });
    let content = "";
    session.on((event) => {
      const e = event;
      if (e.type === "assistant.message_delta") {
        const delta = e.data?.deltaContent;
        if (delta) {
          content += delta;
          progress("Generating instructions...");
        }
      } else if (e.type === "tool.execution_start") {
        const toolName = e.data?.toolName;
        progress(`Using tool: ${toolName ?? "..."}`);
      } else if (e.type === "session.error") {
        const errorMsg = e.data?.message ?? "Unknown error";
        if (errorMsg.toLowerCase().includes("auth") || errorMsg.toLowerCase().includes("login")) {
          throw new Error(
            "Copilot CLI not logged in. Run `copilot` then `/login` to authenticate."
          );
        }
      }
    });
    const prompt = `Analyze this codebase and generate a .github/copilot-instructions.md file.

Use tools to explore:
1. Check for existing instruction files: glob for **/{.github/copilot-instructions.md,AGENT.md,CLAUDE.md,.cursorrules,README.md}
2. Identify the tech stack: look at package.json, tsconfig.json, pyproject.toml, Cargo.toml, go.mod, *.csproj, *.sln, build.gradle, pom.xml, etc.
3. Understand the structure: list key directories
4. Detect monorepo structures: check for workspace configs (npm/pnpm/yarn workspaces, Cargo.toml [workspace], go.work, .sln solution files, settings.gradle include directives, pom.xml modules)

Generate concise instructions (~20-50 lines) covering:
- Tech stack and architecture
- Build/test commands
- Project-specific conventions
- Key files/directories
- Monorepo structure and per-app layout (if this is a monorepo, describe the workspace organization, how apps relate to each other, and any shared libraries)

Output ONLY the markdown content for the instructions file.`;
    progress("Analyzing codebase...");
    await session.sendAndWait({ prompt }, 18e4);
    await session.destroy();
    return content.trim() || "";
  } finally {
    await client.stop();
  }
}
async function generateAreaInstructions(options) {
  const { repoPath, area } = options;
  const progress = options.onProgress ?? (() => {});
  progress(`Checking Copilot CLI for area "${area.name}"...`);
  const cliConfig = await assertCopilotCliReady();
  progress(`Starting Copilot SDK for area "${area.name}"...`);
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient(cliConfig);
  try {
    const applyToPatterns = Array.isArray(area.applyTo) ? area.applyTo : [area.applyTo];
    const applyToStr = applyToPatterns.join(", ");
    progress(`Creating session for area "${area.name}"...`);
    const preferredModel = options.model ?? DEFAULT_MODEL;
    const session = await client.createSession({
      model: preferredModel,
      streaming: true,
      workingDirectory: repoPath,
      systemMessage: {
        content: `You are an expert codebase analyst. Your task is to generate a concise .instructions.md file for a specific area of a codebase. This file will be used as a file-based custom instruction in VS Code Copilot, automatically applied when working on files matching certain patterns. Use the available tools (glob, view, grep) to explore the codebase. Output ONLY the final markdown content (no frontmatter, no explanations).`
      },
      infiniteSessions: { enabled: false }
    });
    let content = "";
    session.on((event) => {
      const e = event;
      if (e.type === "assistant.message_delta") {
        const delta = e.data?.deltaContent;
        if (delta) {
          content += delta;
          progress(`Generating instructions for "${area.name}"...`);
        }
      } else if (e.type === "tool.execution_start") {
        const toolName = e.data?.toolName;
        progress(`${area.name}: using tool ${toolName ?? "..."}`);
      } else if (e.type === "session.error") {
        const errorMsg = e.data?.message ?? "Unknown error";
        if (errorMsg.toLowerCase().includes("auth") || errorMsg.toLowerCase().includes("login")) {
          throw new Error(
            "Copilot CLI not logged in. Run `copilot` then `/login` to authenticate."
          );
        }
      }
    });
    const prompt = `Analyze the "${area.name}" area of this codebase and generate a file-based instruction file.

This area covers files matching: ${applyToStr}
${area.description ? `Description: ${area.description}` : ""}

Use tools to explore ONLY the files and directories within this area:
1. List the key files: glob for ${applyToPatterns.map((p) => `"${p}"`).join(", ")}
2. Identify the tech stack, dependencies, and frameworks used in this area
3. Look at key source files to understand patterns and conventions specific to this area

Generate concise instructions (~10-30 lines) covering:
- What this area does and its role in the overall project
- Area-specific tech stack, dependencies, and frameworks
- Coding conventions and patterns specific to this area
- Build/test commands relevant to this area (if different from root)
- Key files and directory structure within this area

IMPORTANT:
- Focus ONLY on this specific area, not the whole repo
- Do NOT repeat repo-wide information (that goes in the root copilot-instructions.md)
- Keep it complementary to root instructions
- Output ONLY the markdown content, no YAML frontmatter, no code fences`;
    progress(`Analyzing area "${area.name}"...`);
    await session.sendAndWait({ prompt }, 18e4);
    await session.destroy();
    return content.trim() || "";
  } finally {
    await client.stop();
  }
}

// ../src/services/evaluator.ts
var import_promises5 = __toESM(require("fs/promises"), 1);
var import_path6 = __toESM(require("path"), 1);
var DEFAULT_SYSTEM_MESSAGE =
  "You are answering questions about this repository. Use tools to inspect the repo and cite its files. Avoid generic Copilot CLI details unless the prompt explicitly asks for them.";
async function runEval(options) {
  const config = await loadConfig(options.configPath);
  const instructionFile = config.instructionFile ?? ".github/copilot-instructions.md";
  const instructionPath = import_path6.default.resolve(options.repoPath, instructionFile);
  const instructionText = await readOptionalFile(instructionPath);
  const baseSystemMessage = config.systemMessage ?? DEFAULT_SYSTEM_MESSAGE;
  const progress = options.onProgress ?? (() => {});
  const defaultOutputPath = import_path6.default.resolve(
    options.repoPath,
    ".primer",
    "evals",
    buildTimestampedName("eval-results")
  );
  const outputPath =
    resolveOutputPath(options.repoPath, options.outputPath, config.outputPath) ?? defaultOutputPath;
  const runStartedAt = Date.now();
  progress("Starting Copilot SDK...");
  const cliConfig = await assertCopilotCliReady();
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient(cliConfig);
  try {
    const results = [];
    const total = config.cases.length;
    for (const [index, testCase] of config.cases.entries()) {
      const id = testCase.id ?? `case-${index + 1}`;
      const prompt = buildPrompt(options.repoPath, testCase.prompt);
      const caseStartedAt = Date.now();
      progress(`Running eval ${index + 1}/${total}: ${id} (without instructions)...`);
      const withoutResult = await askOnce(client, {
        prompt,
        model: options.model,
        systemMessage: baseSystemMessage,
        phase: "withoutInstructions"
      });
      progress(`Running eval ${index + 1}/${total}: ${id} (with instructions)...`);
      const withResult = await askOnce(client, {
        prompt,
        model: options.model,
        systemMessage: [baseSystemMessage, instructionText].filter(Boolean).join("\n\n"),
        phase: "withInstructions"
      });
      progress(`Running eval ${index + 1}/${total}: ${id} (judging)...`);
      const judgment = await judge(client, {
        model: options.judgeModel,
        prompt: testCase.prompt,
        expectation: testCase.expectation,
        withoutInstructions: withoutResult.content,
        withInstructions: withResult.content
      });
      const metrics = {
        withoutInstructions: withoutResult.metrics,
        withInstructions: withResult.metrics,
        judge: judgment.metrics,
        totalDurationMs: Date.now() - caseStartedAt
      };
      const trajectory = [
        ...withoutResult.trajectory,
        ...withResult.trajectory,
        ...judgment.trajectory
      ];
      results.push({
        id,
        prompt: testCase.prompt,
        expectation: testCase.expectation,
        withInstructions: withResult.content,
        withoutInstructions: withoutResult.content,
        verdict: judgment.result.verdict,
        score: judgment.result.score,
        rationale: judgment.result.rationale,
        metrics,
        trajectory
      });
      progress(
        `Eval ${index + 1}/${total}: ${id} \u2192 ${judgment.result.verdict} (score: ${judgment.result.score})`
      );
    }
    const runFinishedAt = Date.now();
    const output = {
      repoPath: options.repoPath,
      model: options.model,
      judgeModel: options.judgeModel,
      runMetrics: {
        startedAt: new Date(runStartedAt).toISOString(),
        finishedAt: new Date(runFinishedAt).toISOString(),
        durationMs: runFinishedAt - runStartedAt
      },
      results
    };
    let viewerPath;
    if (outputPath) {
      await import_promises5.default.mkdir(import_path6.default.dirname(outputPath), {
        recursive: true
      });
      await import_promises5.default.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");
      viewerPath = buildViewerPath(outputPath);
      await import_promises5.default.writeFile(
        viewerPath,
        buildTrajectoryViewerHtml(output),
        "utf8"
      );
    }
    const summary = formatSummary(results, runFinishedAt - runStartedAt);
    return { summary, results, viewerPath };
  } finally {
    await client.stop();
  }
}
async function askOnce(client, options) {
  const session = await client.createSession({
    model: options.model,
    streaming: true,
    infiniteSessions: { enabled: false },
    systemMessage: options.systemMessage ? { content: options.systemMessage } : void 0
  });
  let content = "";
  const telemetry = createTelemetry(options.phase);
  const startedAt = Date.now();
  session.on((event) => {
    captureTelemetryEvent(event, telemetry);
    if (event.type === "assistant.message_delta") {
      const delta = event.data?.deltaContent;
      if (delta) content += delta;
    }
  });
  await session.sendAndWait({ prompt: options.prompt }, 12e4);
  await session.destroy();
  const finishedAt = Date.now();
  return {
    content: content.trim(),
    metrics: {
      durationMs: finishedAt - startedAt,
      tokenUsage: normalizeTokenUsage(telemetry.tokenUsage),
      toolCalls: telemetry.toolCalls
    },
    trajectory: telemetry.trajectory
  };
}
async function judge(client, options) {
  const session = await client.createSession({
    model: options.model,
    streaming: true,
    infiniteSessions: { enabled: false },
    systemMessage: {
      content:
        "You are a strict evaluator. Return JSON with keys: verdict (pass|fail|unknown), score (0-100), rationale. Do not include any other text."
    }
  });
  let content = "";
  const telemetry = createTelemetry("judge");
  const startedAt = Date.now();
  session.on((event) => {
    captureTelemetryEvent(event, telemetry);
    if (event.type === "assistant.message_delta") {
      const delta = event.data?.deltaContent;
      if (delta) content += delta;
    }
  });
  const prompt = [
    "Evaluate which response best matches the expectation.",
    "",
    `Expectation: ${options.expectation}`,
    "",
    "Response A (without custom instructions):",
    options.withoutInstructions,
    "",
    "Response B (with custom instructions):",
    options.withInstructions,
    "",
    "Return JSON only."
  ].join("\n");
  await session.sendAndWait({ prompt }, 12e4);
  await session.destroy();
  const finishedAt = Date.now();
  return {
    result: parseJudge(content),
    metrics: {
      durationMs: finishedAt - startedAt,
      tokenUsage: normalizeTokenUsage(telemetry.tokenUsage),
      toolCalls: telemetry.toolCalls
    },
    trajectory: telemetry.trajectory
  };
}
function parseJudge(content) {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON detected");
    const parsed = JSON.parse(match[0]);
    if (!parsed.verdict) throw new Error("Missing verdict");
    return {
      verdict: parsed.verdict,
      score: Number(parsed.score ?? 0),
      rationale: String(parsed.rationale ?? "")
    };
  } catch {
    return {
      verdict: "unknown",
      score: 0,
      rationale: content.trim()
    };
  }
}
async function loadConfig(configPath) {
  const raw = await import_promises5.default.readFile(configPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.cases)) {
    throw new Error("Eval config must have a 'cases' array.");
  }
  return parsed;
}
async function readOptionalFile(filePath) {
  try {
    return await import_promises5.default.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}
function buildPrompt(repoPath, userPrompt) {
  return [
    "You are working in this repository:",
    repoPath,
    "Use the file system tools when needed to inspect the codebase.",
    "",
    userPrompt
  ].join("\n");
}
function formatSummary(results, runDurationMs) {
  const total = results.length;
  const passed = results.filter((r) => r.verdict === "pass").length;
  const failed = results.filter((r) => r.verdict === "fail").length;
  const unknown = results.filter((r) => r.verdict === "unknown").length;
  const totalUsage = aggregateTokenUsage(results);
  const hasUsage = Boolean(
    totalUsage.promptTokens || totalUsage.completionTokens || totalUsage.totalTokens
  );
  const lines = [
    `Eval results: ${passed}/${total} pass, ${failed} fail, ${unknown} unknown.`,
    `Runtime: ${formatDuration(runDurationMs)}.`,
    hasUsage ? `Token usage: ${formatTokenUsage(totalUsage)}.` : "Token usage: unavailable."
  ];
  for (const result of results) {
    lines.push(`- ${result.id}: ${result.verdict ?? "unknown"} (score: ${result.score ?? 0})`);
  }
  return `
${lines.join("\n")}`;
}
function createTelemetry(phase) {
  return {
    trajectory: [],
    tokenUsage: {},
    toolCalls: { count: 0, byName: {}, totalDurationMs: 0 },
    toolCallMap: /* @__PURE__ */ new Map(),
    phase
  };
}
function captureTelemetryEvent(event, telemetry) {
  const timestampMs = Date.now();
  telemetry.trajectory.push({
    timestampMs,
    phase: telemetry.phase,
    type: event.type,
    data: sanitizeEventData(event.data)
  });
  if (event.type === "tool.execution_start") {
    const toolName = event.data?.toolName ?? "unknown";
    const toolId = resolveToolId(event.data, toolName, telemetry.toolCallMap.size);
    telemetry.toolCallMap.set(toolId, { name: toolName, startMs: timestampMs });
    telemetry.toolCalls.count += 1;
    telemetry.toolCalls.byName[toolName] = (telemetry.toolCalls.byName[toolName] ?? 0) + 1;
  } else if (event.type === "tool.execution_finish" || event.type === "tool.execution_error") {
    const toolName = event.data?.toolName ?? "unknown";
    const toolId = resolveToolId(event.data, toolName, telemetry.toolCallMap.size);
    const entry =
      telemetry.toolCallMap.get(toolId) ?? findLatestToolByName(telemetry.toolCallMap, toolName);
    if (entry) {
      const durationMs = timestampMs - entry.startMs;
      telemetry.toolCalls.totalDurationMs += durationMs;
      telemetry.toolCallMap.delete(toolId);
    }
  }
  const usage = extractTokenUsage(event.data);
  if (usage) {
    telemetry.tokenUsage = mergeTokenUsage(telemetry.tokenUsage, usage);
  }
}
function resolveToolId(data, toolName, index) {
  const rawId = data?.executionId ?? data?.toolCallId ?? data?.callId ?? data?.id;
  if (typeof rawId === "string" || typeof rawId === "number") {
    return String(rawId);
  }
  return `${toolName}-${index + 1}`;
}
function findLatestToolByName(map, toolName) {
  const entries = Array.from(map.values()).filter((entry) => entry.name === toolName);
  return entries.at(-1);
}
function extractTokenUsage(data) {
  if (!data) return null;
  const usage = findUsageObject(data);
  const promptTokens = getNumber(
    usage?.prompt_tokens ?? usage?.promptTokens ?? data.promptTokens ?? data.inputTokens
  );
  const completionTokens = getNumber(
    usage?.completion_tokens ??
      usage?.completionTokens ??
      data.completionTokens ??
      data.outputTokens
  );
  const totalTokens = getNumber(usage?.total_tokens ?? usage?.totalTokens ?? data.totalTokens);
  if (promptTokens == null && completionTokens == null && totalTokens == null) {
    return null;
  }
  return {
    promptTokens: promptTokens ?? void 0,
    completionTokens: completionTokens ?? void 0,
    totalTokens: totalTokens ?? void 0
  };
}
function findUsageObject(data) {
  const direct = data.usage ?? data.tokenUsage ?? data.tokens;
  if (direct) return direct;
  const candidates = [data.response, data.result, data.message, data.metrics, data.output];
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      const nested = candidate.usage ?? candidate.tokenUsage;
      if (nested && typeof nested === "object") return nested;
    }
  }
  return scanForUsage(data, 0);
}
function scanForUsage(value, depth) {
  if (!value || typeof value !== "object" || depth > 4) return void 0;
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = scanForUsage(entry, depth + 1);
      if (found) return found;
    }
    return void 0;
  }
  const record = value;
  if (hasTokenFields(record)) return record;
  for (const entry of Object.values(record)) {
    const found = scanForUsage(entry, depth + 1);
    if (found) return found;
  }
  return void 0;
}
function hasTokenFields(record) {
  const keys = Object.keys(record);
  return (
    keys.includes("prompt_tokens") ||
    keys.includes("completion_tokens") ||
    keys.includes("total_tokens") ||
    keys.includes("promptTokens") ||
    keys.includes("completionTokens") ||
    keys.includes("totalTokens") ||
    keys.includes("inputTokens") ||
    keys.includes("outputTokens")
  );
}
function getNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function mergeTokenUsage(existing, next) {
  return {
    promptTokens: Math.max(existing.promptTokens ?? 0, next.promptTokens ?? 0) || void 0,
    completionTokens:
      Math.max(existing.completionTokens ?? 0, next.completionTokens ?? 0) || void 0,
    totalTokens: Math.max(existing.totalTokens ?? 0, next.totalTokens ?? 0) || void 0
  };
}
function normalizeTokenUsage(usage) {
  if (!usage.promptTokens && !usage.completionTokens && !usage.totalTokens) return void 0;
  if (!usage.totalTokens) {
    const prompt = usage.promptTokens ?? 0;
    const completion = usage.completionTokens ?? 0;
    const total = prompt + completion;
    return {
      ...usage,
      totalTokens: total || void 0
    };
  }
  return usage;
}
function aggregateTokenUsage(results) {
  const total = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  for (const result of results) {
    const metrics = result.metrics;
    if (!metrics) continue;
    const usages = [
      metrics.withoutInstructions.tokenUsage,
      metrics.withInstructions.tokenUsage,
      metrics.judge.tokenUsage
    ];
    for (const usage of usages) {
      if (!usage) continue;
      total.promptTokens = (total.promptTokens ?? 0) + (usage.promptTokens ?? 0);
      total.completionTokens = (total.completionTokens ?? 0) + (usage.completionTokens ?? 0);
      total.totalTokens = (total.totalTokens ?? 0) + (usage.totalTokens ?? 0);
    }
  }
  return total;
}
function formatDuration(durationMs) {
  const seconds = Math.round(durationMs / 100) / 10;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round((seconds % 60) * 10) / 10;
  return `${minutes}m ${remaining}s`;
}
function formatTokenUsage(usage) {
  const prompt = usage.promptTokens ?? 0;
  const completion = usage.completionTokens ?? 0;
  const total = usage.totalTokens ?? prompt + completion;
  return `prompt ${prompt}, completion ${completion}, total ${total}`;
}
function resolveOutputPath(repoPath, override, configValue) {
  const chosen = override ?? configValue;
  if (!chosen) return void 0;
  return import_path6.default.isAbsolute(chosen)
    ? chosen
    : import_path6.default.resolve(repoPath, chosen);
}
function buildViewerPath(outputPath) {
  if (outputPath.endsWith(".json")) {
    return outputPath.replace(/\.json$/u, ".html");
  }
  return `${outputPath}.html`;
}
function buildTrajectoryViewerHtml(data) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Primer Eval Results</title>
<style>
  :root { --bg: #0d1117; --surface: #161b22; --surface2: #1c2128; --border: #30363d; --text: #e6edf3; --text2: #8b949e; --text3: #6e7681; --accent: #8b5cf6; --accent2: #a78bfa; --green: #3fb950; --green-bg: rgba(63,185,80,0.1); --red: #f85149; --red-bg: rgba(248,81,73,0.1); --yellow: #d29922; --yellow-bg: rgba(210,153,34,0.1); --blue: #58a6ff; --blue-bg: rgba(88,166,255,0.1); }
  [data-theme="light"] { --bg: #ffffff; --surface: #f6f8fa; --surface2: #eaeef2; --border: #d0d7de; --text: #1f2328; --text2: #656d76; --text3: #8b949e; --accent: #8b5cf6; --accent2: #7c3aed; --green: #1a7f37; --green-bg: rgba(26,127,55,0.1); --red: #cf222e; --red-bg: rgba(207,34,46,0.1); --yellow: #9a6700; --yellow-bg: rgba(154,103,0,0.1); --blue: #0969da; --blue-bg: rgba(9,105,218,0.1); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }

  /* Header */
  .header { padding: 24px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .header-left { display: flex; align-items: center; gap: 16px; }
  .header h1 { font-size: 20px; font-weight: 600; }
  .header-meta { font-size: 13px; color: var(--text2); display: flex; gap: 16px; align-items: center; }
  .header-meta code { background: var(--surface); padding: 2px 8px; border-radius: 6px; border: 1px solid var(--border); font-size: 12px; }
  .theme-toggle { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; cursor: pointer; color: var(--text2); font-size: 13px; }
  .theme-toggle:hover { border-color: var(--accent); color: var(--text); }

  /* Hero metrics */
  .hero { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 24px 32px; }
  .hero-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .hero-card .label { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text2); margin-bottom: 4px; }
  .hero-card .value { font-size: 28px; font-weight: 700; }
  .hero-card .sub { font-size: 12px; color: var(--text3); margin-top: 4px; }
  .delta { font-size: 13px; font-weight: 600; margin-left: 8px; }
  .delta.better { color: var(--green); }
  .delta.worse { color: var(--red); }
  .delta.neutral { color: var(--text3); }

  /* Section */
  .section { padding: 0 32px 24px; }
  .section-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; padding-top: 24px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }

  /* Comparison table */
  .comparison-table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .comparison-table th { background: var(--surface); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text2); padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  .comparison-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: top; }
  .comparison-table tr:last-child td { border-bottom: none; }
  .comparison-table tr:hover td { background: var(--surface); }
  .case-id { font-weight: 600; }
  .verdict-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .verdict-badge.pass { background: var(--green-bg); color: var(--green); }
  .verdict-badge.fail { background: var(--red-bg); color: var(--red); }
  .verdict-badge.unknown { background: var(--yellow-bg); color: var(--yellow); }
  .score-bar { width: 60px; height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; display: inline-block; vertical-align: middle; margin-right: 6px; }
  .score-fill { height: 100%; border-radius: 3px; }
  .metric-pair { display: flex; gap: 4px; align-items: baseline; }
  .metric-old { color: var(--text3); text-decoration: line-through; font-size: 12px; }
  .metric-new { font-weight: 600; }

  /* Impact bar chart */
  .impact-bars { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .impact-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .impact-card h3 { font-size: 13px; font-weight: 600; color: var(--text2); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .bar-label { font-size: 13px; min-width: 80px; color: var(--text2); text-align: right; }
  .bar-track { flex: 1; height: 24px; background: var(--surface2); border-radius: 6px; overflow: hidden; position: relative; }
  .bar-fill { height: 100%; border-radius: 6px; transition: width 0.3s; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; font-size: 11px; font-weight: 600; color: white; min-width: 40px; }
  .bar-fill.without { background: var(--text3); }
  .bar-fill.with { background: var(--accent); }
  .bar-legend { display: flex; gap: 16px; margin-bottom: 12px; }
  .bar-legend span { font-size: 12px; color: var(--text2); display: flex; align-items: center; gap: 4px; }
  .bar-legend .dot { width: 10px; height: 10px; border-radius: 3px; }

  /* Case details */
  .case-detail { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
  .case-detail-header { padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
  .case-detail-header:hover { background: var(--surface2); }
  .case-detail-body { display: none; padding: 0 20px 20px; }
  .case-detail.open .case-detail-body { display: block; }
  .case-detail .chevron { transition: transform 0.2s; color: var(--text3); }
  .case-detail.open .chevron { transform: rotate(90deg); }

  .response-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
  .response-col h4 { font-size: 13px; font-weight: 600; color: var(--text2); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .response-col pre { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-size: 13px; white-space: pre-wrap; word-break: break-word; max-height: 300px; overflow-y: auto; line-height: 1.6; }
  .rationale { background: var(--blue-bg); border: 1px solid var(--blue); border-radius: 8px; padding: 12px 16px; margin-top: 12px; font-size: 13px; color: var(--text); }
  .rationale strong { color: var(--blue); }
  .prompt-text { font-size: 14px; color: var(--text); margin-bottom: 4px; }
  .expect-text { font-size: 13px; color: var(--text2); margin-top: 4px; }

  .metric-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .metric-chip { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; font-size: 12px; }
  .metric-chip .chip-label { color: var(--text3); margin-right: 4px; }
  .metric-chip .chip-value { font-weight: 600; color: var(--text); }

  /* Responsive */
  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr 1fr; }
    .impact-bars { grid-template-columns: 1fr; }
    .response-grid { grid-template-columns: 1fr; }
    .header { flex-direction: column; gap: 12px; align-items: flex-start; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="header-left">
    <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor" style="color:var(--accent)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
    <div>
      <h1>Eval Results</h1>
      <div class="header-meta" id="headerMeta"></div>
    </div>
  </div>
  <button class="theme-toggle" onclick="toggleTheme()">Toggle theme</button>
</div>

<div class="hero" id="heroCards"></div>

<div class="section">
  <div class="section-title">Impact of Instructions</div>
  <div class="impact-bars" id="impactBars"></div>
</div>

<div class="section">
  <div class="section-title">Results by Case</div>
  <table class="comparison-table" id="comparisonTable"></table>
</div>

<div class="section">
  <div class="section-title">Case Details</div>
  <div id="caseDetails"></div>
</div>

<script>
const data = ${serialized};
const results = data.results || [];
const esc = s => String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');

function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
}

// Aggregates
const agg = { passCount: 0, failCount: 0, totalScore: 0, totalWithoutDur: 0, totalWithDur: 0, totalWithoutTokens: 0, totalWithTokens: 0, totalWithoutTools: 0, totalWithTools: 0 };
results.forEach(r => {
  if (r.verdict === 'pass') agg.passCount++;
  else agg.failCount++;
  agg.totalScore += (r.score ?? 0);
  const m = r.metrics || {};
  const wo = m.withoutInstructions || {};
  const wi = m.withInstructions || {};
  agg.totalWithoutDur += (wo.durationMs || 0);
  agg.totalWithDur += (wi.durationMs || 0);
  agg.totalWithoutTokens += (wo.tokenUsage?.totalTokens || 0);
  agg.totalWithTokens += (wi.tokenUsage?.totalTokens || 0);
  agg.totalWithoutTools += (wo.toolCalls?.count || 0);
  agg.totalWithTools += (wi.toolCalls?.count || 0);
});

const avgScore = results.length ? Math.round(agg.totalScore / results.length) : 0;
const durDelta = agg.totalWithoutDur ? Math.round((agg.totalWithDur - agg.totalWithoutDur) / agg.totalWithoutDur * 100) : 0;
const tokenDelta = agg.totalWithoutTokens ? Math.round((agg.totalWithTokens - agg.totalWithoutTokens) / agg.totalWithoutTokens * 100) : 0;
const toolDelta = agg.totalWithoutTools ? Math.round((agg.totalWithTools - agg.totalWithoutTools) / agg.totalWithoutTools * 100) : 0;
const runDuration = data.runMetrics?.durationMs || 0;

function deltaTag(val, invertBetter) {
  const sign = val > 0 ? '+' : '';
  const cls = val === 0 ? 'neutral' : (invertBetter ? (val > 0 ? 'worse' : 'better') : (val > 0 ? 'better' : 'worse'));
  return '<span class="delta ' + cls + '">' + sign + val + '%</span>';
}

function fmtMs(ms) { return ms < 1000 ? ms + 'ms' : (ms / 1000).toFixed(1) + 's'; }
function fmtTokens(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n); }

// Header
document.getElementById('headerMeta').innerHTML =
  '<code>' + esc(data.model) + '</code>' +
  '<span>Judge: <code>' + esc(data.judgeModel) + '</code></span>' +
  '<span>' + esc(data.repoPath?.split('/').pop()) + '</span>' +
  '<span>' + fmtMs(runDuration) + ' total</span>';

// Hero cards
const heroData = [
  { label: 'Pass Rate', value: agg.passCount + '/' + results.length, sub: agg.failCount > 0 ? agg.failCount + ' failed' : 'All passing', color: agg.failCount === 0 ? 'var(--green)' : 'var(--yellow)' },
  { label: 'Avg Score', value: avgScore, sub: 'out of 100', color: avgScore >= 80 ? 'var(--green)' : avgScore >= 50 ? 'var(--yellow)' : 'var(--red)' },
  { label: 'Speed Impact', value: deltaTag(durDelta, true), sub: fmtMs(agg.totalWithoutDur) + ' \u2192 ' + fmtMs(agg.totalWithDur), color: 'var(--text)' },
  { label: 'Token Impact', value: deltaTag(tokenDelta, true), sub: fmtTokens(agg.totalWithoutTokens) + ' \u2192 ' + fmtTokens(agg.totalWithTokens), color: 'var(--text)' },
  { label: 'Tool Calls', value: deltaTag(toolDelta, true), sub: agg.totalWithoutTools + ' \u2192 ' + agg.totalWithTools + ' calls', color: 'var(--text)' },
];
document.getElementById('heroCards').innerHTML = heroData.map(h =>
  '<div class="hero-card"><div class="label">' + h.label + '</div>' +
  '<div class="value" style="color:' + h.color + '">' + h.value + '</div>' +
  '<div class="sub">' + h.sub + '</div></div>'
).join('');

// Impact bars
function renderImpactBars() {
  const maxDur = Math.max(...results.map(r => Math.max(r.metrics?.withoutInstructions?.durationMs || 0, r.metrics?.withInstructions?.durationMs || 0)), 1);
  const maxTok = Math.max(...results.map(r => Math.max(r.metrics?.withoutInstructions?.tokenUsage?.totalTokens || 0, r.metrics?.withInstructions?.tokenUsage?.totalTokens || 0)), 1);

  const legend = '<div class="bar-legend"><span><span class="dot" style="background:var(--text3)"></span> Without instructions</span><span><span class="dot" style="background:var(--accent)"></span> With instructions</span></div>';

  let durHtml = '<div class="impact-card"><h3>Response Time</h3>' + legend;
  let tokHtml = '<div class="impact-card"><h3>Token Usage</h3>' + legend;
  results.forEach(r => {
    const m = r.metrics || {};
    const woDur = m.withoutInstructions?.durationMs || 0;
    const wiDur = m.withInstructions?.durationMs || 0;
    const woTok = m.withoutInstructions?.tokenUsage?.totalTokens || 0;
    const wiTok = m.withInstructions?.tokenUsage?.totalTokens || 0;

    durHtml += '<div class="bar-row"><div class="bar-label">' + esc(r.id) + '</div><div class="bar-track">' +
      '<div class="bar-fill without" style="width:' + (woDur/maxDur*100) + '%">' + fmtMs(woDur) + '</div></div></div>' +
      '<div class="bar-row"><div class="bar-label"></div><div class="bar-track">' +
      '<div class="bar-fill with" style="width:' + (wiDur/maxDur*100) + '%">' + fmtMs(wiDur) + '</div></div></div>';

    tokHtml += '<div class="bar-row"><div class="bar-label">' + esc(r.id) + '</div><div class="bar-track">' +
      '<div class="bar-fill without" style="width:' + (woTok/maxTok*100) + '%">' + fmtTokens(woTok) + '</div></div></div>' +
      '<div class="bar-row"><div class="bar-label"></div><div class="bar-track">' +
      '<div class="bar-fill with" style="width:' + (wiTok/maxTok*100) + '%">' + fmtTokens(wiTok) + '</div></div></div>';
  });
  durHtml += '</div>';
  tokHtml += '</div>';
  document.getElementById('impactBars').innerHTML = durHtml + tokHtml;
}
renderImpactBars();

// Comparison table
function renderTable() {
  let html = '<thead><tr><th>Case</th><th>Verdict</th><th>Score</th><th>Speed</th><th>Tokens</th><th>Tool Calls</th></tr></thead><tbody>';
  results.forEach(r => {
    const m = r.metrics || {};
    const wo = m.withoutInstructions || {};
    const wi = m.withInstructions || {};
    const woDur = wo.durationMs || 0;
    const wiDur = wi.durationMs || 0;
    const woTok = wo.tokenUsage?.totalTokens || 0;
    const wiTok = wi.tokenUsage?.totalTokens || 0;
    const woTools = wo.toolCalls?.count || 0;
    const wiTools = wi.toolCalls?.count || 0;
    const durPct = woDur ? Math.round((wiDur - woDur) / woDur * 100) : 0;
    const tokPct = woTok ? Math.round((wiTok - woTok) / woTok * 100) : 0;
    const toolPct = woTools ? Math.round((wiTools - woTools) / woTools * 100) : 0;
    const score = r.score ?? 0;
    const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';

    html += '<tr>' +
      '<td class="case-id">' + esc(r.id) + '</td>' +
      '<td><span class="verdict-badge ' + (r.verdict || 'unknown') + '">' + (r.verdict === 'pass' ? '\u2713' : r.verdict === 'fail' ? '\u2717' : '?') + ' ' + (r.verdict || 'unknown') + '</span></td>' +
      '<td><div class="score-bar"><div class="score-fill" style="width:' + score + '%;background:' + scoreColor + '"></div></div>' + score + '</td>' +
      '<td><div class="metric-pair"><span class="metric-old">' + fmtMs(woDur) + '</span><span class="metric-new">' + fmtMs(wiDur) + '</span>' + deltaTag(durPct, true) + '</div></td>' +
      '<td><div class="metric-pair"><span class="metric-old">' + fmtTokens(woTok) + '</span><span class="metric-new">' + fmtTokens(wiTok) + '</span>' + deltaTag(tokPct, true) + '</div></td>' +
      '<td><div class="metric-pair"><span class="metric-old">' + woTools + '</span><span class="metric-new">' + wiTools + '</span>' + deltaTag(toolPct, true) + '</div></td>' +
      '</tr>';
  });
  html += '</tbody>';
  document.getElementById('comparisonTable').innerHTML = html;
}
renderTable();

// Case details (expandable)
function renderCaseDetails() {
  let html = '';
  results.forEach(r => {
    const m = r.metrics || {};
    const wo = m.withoutInstructions || {};
    const wi = m.withInstructions || {};
    const score = r.score ?? 0;
    const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';

    html += '<div class="case-detail" id="detail-' + esc(r.id) + '">' +
      '<div class="case-detail-header" onclick="this.parentElement.classList.toggle(&#39;open&#39;)">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<span class="chevron">\u25B6</span>' +
          '<span class="case-id">' + esc(r.id) + '</span>' +
          '<span class="verdict-badge ' + (r.verdict || 'unknown') + '">' + (r.verdict === 'pass' ? '\u2713' : '\u2717') + ' ' + (r.verdict || 'unknown') + '</span>' +
          '<span style="color:' + scoreColor + ';font-weight:600">' + score + '</span>' +
        '</div>' +
        '<div class="metric-chips">' +
          '<div class="metric-chip"><span class="chip-label">Speed</span><span class="chip-value">' + fmtMs(wi.durationMs || 0) + '</span></div>' +
          '<div class="metric-chip"><span class="chip-label">Tokens</span><span class="chip-value">' + fmtTokens(wi.tokenUsage?.totalTokens || 0) + '</span></div>' +
          '<div class="metric-chip"><span class="chip-label">Tools</span><span class="chip-value">' + (wi.toolCalls?.count || 0) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="case-detail-body">' +
        '<div class="prompt-text"><strong>Prompt:</strong> ' + esc(r.prompt) + '</div>' +
        '<div class="expect-text"><strong>Expected:</strong> ' + esc(r.expectation) + '</div>' +
        (r.rationale ? '<div class="rationale"><strong>Judge rationale:</strong> ' + esc(r.rationale) + '</div>' : '') +
        '<div class="response-grid">' +
          '<div class="response-col"><h4>Without Instructions</h4>' +
            '<div class="metric-chips" style="margin-bottom:8px">' +
              '<div class="metric-chip"><span class="chip-label">Time</span><span class="chip-value">' + fmtMs(wo.durationMs || 0) + '</span></div>' +
              '<div class="metric-chip"><span class="chip-label">Tokens</span><span class="chip-value">' + fmtTokens(wo.tokenUsage?.totalTokens || 0) + '</span></div>' +
              '<div class="metric-chip"><span class="chip-label">Tools</span><span class="chip-value">' + (wo.toolCalls?.count || 0) + '</span></div>' +
            '</div>' +
            '<pre>' + esc(r.withoutInstructions || 'No response') + '</pre>' +
          '</div>' +
          '<div class="response-col"><h4>With Instructions</h4>' +
            '<div class="metric-chips" style="margin-bottom:8px">' +
              '<div class="metric-chip"><span class="chip-label">Time</span><span class="chip-value">' + fmtMs(wi.durationMs || 0) + '</span></div>' +
              '<div class="metric-chip"><span class="chip-label">Tokens</span><span class="chip-value">' + fmtTokens(wi.tokenUsage?.totalTokens || 0) + '</span></div>' +
              '<div class="metric-chip"><span class="chip-label">Tools</span><span class="chip-value">' + (wi.toolCalls?.count || 0) + '</span></div>' +
            '</div>' +
            '<pre>' + esc(r.withInstructions || 'No response') + '</pre>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  document.getElementById('caseDetails').innerHTML = html;
}
renderCaseDetails();
</script>
</body>
</html>`;
}
function sanitizeEventData(data) {
  if (!data) return void 0;
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "deltaContent" && typeof value === "string") {
      sanitized.deltaChars = value.length;
      sanitized.deltaPreview = value.slice(0, 120);
      continue;
    }
    sanitized[key] = sanitizeValue(value, 0);
  }
  return sanitized;
}
function sanitizeValue(value, depth) {
  if (depth > 4) return "[depth-limit]";
  if (typeof value === "string") {
    return value.length > 2e3 ? `${value.slice(0, 2e3)}\u2026` : value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((entry) => sanitizeValue(entry, depth + 1));
  }
  if (value && typeof value === "object") {
    const obj = {};
    for (const [key, entry] of Object.entries(value)) {
      obj[key] = sanitizeValue(entry, depth + 1);
    }
    return obj;
  }
  return value;
}

// ../src/services/evalScaffold.ts
var EVAL_SCAFFOLD_TIMEOUT_MS = 6e5;
var EVAL_SCAFFOLD_RECOVERY_TIMEOUT_MS = 9e4;
async function generateEvalScaffold(options) {
  const repoPath = options.repoPath;
  const count = Math.max(1, options.count);
  const progress = options.onProgress ?? (() => {});
  progress("Checking Copilot CLI...");
  const cliConfig = await assertCopilotCliReady();
  progress("Starting Copilot SDK...");
  const sdk = await import("@github/copilot-sdk");
  const client = new sdk.CopilotClient(cliConfig);
  try {
    progress("Creating session...");
    const preferredModel = options.model ?? DEFAULT_MODEL;
    const session = await client.createSession({
      model: preferredModel,
      streaming: true,
      workingDirectory: repoPath,
      systemMessage: {
        content:
          "You are an expert codebase analyst specializing in deep architectural analysis. Generate challenging, cross-cutting eval cases for this repository that require synthesizing information from multiple files and tracing logic across layers. Avoid trivial questions answerable from a single file read or grep. Use tools (glob, view, grep) extensively to inspect the codebase. Output ONLY JSON with keys: instructionFile, cases (array of {id,prompt,expectation})."
      },
      infiniteSessions: { enabled: false }
    });
    let content = "";
    session.on((event) => {
      if (event.type === "assistant.message_delta") {
        const delta = event.data?.deltaContent;
        if (delta) {
          content += delta;
          progress("Generating eval cases...");
        }
      } else if (event.type === "tool.execution_start") {
        const toolName = event.data?.toolName;
        progress(`Using tool: ${toolName ?? "..."}`);
      } else if (event.type === "session.error") {
        const errorMsg = event.data?.message ?? "Unknown error";
        if (errorMsg.toLowerCase().includes("auth") || errorMsg.toLowerCase().includes("login")) {
          throw new Error(
            "Copilot CLI not logged in. Run `copilot` then `/login` to authenticate."
          );
        }
      }
    });
    const areaContext = options.areas?.length
      ? [
          "",
          "AREA CONTEXT:",
          "This repo has the following areas:",
          ...options.areas.map((a) => {
            const patterns = Array.isArray(a.applyTo) ? a.applyTo.join(", ") : a.applyTo;
            return `- ${a.name} (${patterns})`;
          }),
          "",
          "Generate a mix of:",
          "- Single-area cases that go deep into one area's internals",
          "- Cross-area cases that test interactions between areas",
          'Include an optional "area" field in each case to tag which area(s) it targets.'
        ].join("\n")
      : "";
    const prompt = [
      `Analyze this repository and generate ${count} eval cases.`,
      "",
      "IMPORTANT: Generate HARD eval cases that require deep, cross-cutting understanding of the codebase.",
      "Each case should require synthesizing information from MULTIPLE files or tracing logic across several layers.",
      "Do NOT generate simple questions that can be answered by reading a single file or running a single grep.",
      "",
      "Good eval case examples (adapt to this repo):",
      "- Questions about how data flows end-to-end through multiple modules (e.g., 'Trace what happens when X is called \u2014 which services, transforms, and side effects are involved?')",
      "- Questions about implicit conventions or patterns that span many files (e.g., 'What error-handling pattern is used across the service layer, and where does it deviate?')",
      "- Questions requiring understanding of runtime behavior not obvious from static code (e.g., 'What is the order of initialization and what would break if module X loaded before Y?')",
      "- Questions about non-obvious interactions between components (e.g., 'How does changing config option X affect the behavior of feature Y?')",
      "- Questions about edge cases or failure modes that require reading implementation details across files",
      "- Questions that require understanding the type system, generics, or shared interfaces across module boundaries",
      "",
      "Bad eval case examples (avoid these):",
      "- 'What does this project do?' (answered by README alone)",
      "- 'How do I build/test?' (answered by package.json alone)",
      "- 'What is the entrypoint?' (answered by a single file)",
      "- Any question answerable by reading one file or searching for one keyword",
      "",
      "Use tools extensively to inspect the codebase \u2014 read multiple files, trace imports, follow call chains.",
      "If this is a monorepo (npm/pnpm/yarn workspaces, Cargo workspace, Go workspace, .NET solution, Gradle/Maven multi-module), generate cases that involve cross-app dependencies, shared libraries, and how changes in one app affect others.",
      "Ensure cases cover cross-cutting concerns: data flow, error propagation, configuration impact, implicit coupling, architectural invariants.",
      "Include a systemMessage that keeps answers scoped to this repository (avoid generic Copilot CLI details unless asked).",
      "Return JSON ONLY (no markdown, no commentary) in this schema:",
      '{\n  "instructionFile": ".github/copilot-instructions.md",\n  "systemMessage": "...",\n  "cases": [\n    {"id": "case-1", "prompt": "...", "expectation": "...", "area": "optional-area-name"}\n  ]\n}',
      areaContext
    ].join("\n");
    progress("Analyzing codebase...");
    let timedOutWaitingForIdle = false;
    try {
      await session.sendAndWait({ prompt }, EVAL_SCAFFOLD_TIMEOUT_MS);
    } catch (error) {
      if (!isSessionIdleTimeoutError(error)) {
        throw error;
      }
      timedOutWaitingForIdle = true;
      progress("Generation took longer than expected; requesting final JSON output...");
      try {
        await session.sendAndWait(
          {
            prompt:
              "Stop analysis and return only the final JSON scaffold now. Do not include markdown or commentary."
          },
          EVAL_SCAFFOLD_RECOVERY_TIMEOUT_MS
        );
      } catch (recoveryError) {
        if (!isSessionIdleTimeoutError(recoveryError)) {
          throw recoveryError;
        }
        progress("Still waiting on idle; attempting to parse partial output...");
      }
    } finally {
      await session.destroy();
    }
    let parsed;
    try {
      parsed = parseEvalConfig(content);
    } catch (error) {
      if (timedOutWaitingForIdle) {
        throw new Error(
          "Timed out waiting for scaffold generation to become idle before a complete JSON payload was returned. Try again or lower `--count`."
        );
      }
      throw error;
    }
    const normalized = normalizeEvalConfig(parsed, count);
    return normalized;
  } finally {
    await client.stop();
  }
}
function isSessionIdleTimeoutError(error) {
  if (!(error instanceof Error)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return message.includes("timeout") && message.includes("session.idle");
}
function parseEvalConfig(raw) {
  const match = raw.match(/\{[\s\S]*\}/u);
  if (!match) {
    throw new Error("Failed to parse eval scaffold JSON.");
  }
  const parsed = JSON.parse(match[0]);
  if (!parsed || !Array.isArray(parsed.cases)) {
    throw new Error("Eval scaffold JSON is missing cases.");
  }
  return parsed;
}
function normalizeEvalConfig(parsed, count) {
  const cases = (parsed.cases ?? []).slice(0, count).map((entry, index) => {
    const id = typeof entry.id === "string" && entry.id.trim() ? entry.id : `case-${index + 1}`;
    return {
      id,
      prompt: String(entry.prompt ?? "").trim(),
      expectation: String(entry.expectation ?? "").trim(),
      area: typeof entry.area === "string" && entry.area.trim() ? entry.area.trim() : void 0
    };
  });
  if (!cases.length) {
    throw new Error("Eval scaffold JSON did not include any usable cases.");
  }
  const defaultSystemMessage =
    "You are answering questions about this repository. Use tools to inspect the repo and cite its files. Avoid generic Copilot CLI details unless the prompt explicitly asks for them.";
  return {
    instructionFile: parsed.instructionFile ?? ".github/copilot-instructions.md",
    systemMessage: parsed.systemMessage ?? defaultSystemMessage,
    cases
  };
}

// ../src/services/readiness.ts
var import_promises7 = __toESM(require("fs/promises"), 1);
var import_path8 = __toESM(require("path"), 1);

// ../src/services/policy.ts
var import_promises6 = __toESM(require("fs/promises"), 1);
var import_path7 = __toESM(require("path"), 1);
var DEFAULT_PASS_RATE = 0.8;
function validatePolicyConfig(obj, source, format = "module") {
  if (typeof obj !== "object" || obj === null) {
    throw new Error(`Policy "${source}" is invalid: expected an object, got ${typeof obj}`);
  }
  const record = obj;
  if (typeof record.name !== "string" || !record.name.trim()) {
    throw new Error(`Policy "${source}" is invalid: missing required field "name" at root`);
  }
  if (record.criteria !== void 0) {
    if (typeof record.criteria !== "object") {
      throw new Error(`Policy "${source}" is invalid: "criteria" must be an object`);
    }
    const criteria = record.criteria;
    if (criteria.disable !== void 0 && !isStringArray(criteria.disable)) {
      throw new Error(
        `Policy "${source}" is invalid: "criteria.disable" must be an array of strings`
      );
    }
    if (criteria.override !== void 0) {
      if (
        typeof criteria.override !== "object" ||
        criteria.override === null ||
        Array.isArray(criteria.override)
      ) {
        throw new Error(`Policy "${source}" is invalid: "criteria.override" must be an object`);
      }
      const ALLOWED_OVERRIDE_KEYS = /* @__PURE__ */ new Set([
        "title",
        "pillar",
        "level",
        "scope",
        "impact",
        "effort"
      ]);
      for (const [id, value] of Object.entries(criteria.override)) {
        if (typeof value !== "object" || value === null) continue;
        for (const key of Object.keys(value)) {
          if (!ALLOWED_OVERRIDE_KEYS.has(key)) {
            throw new Error(
              `Policy "${source}" is invalid: "criteria.override.${id}" contains disallowed key "${key}". Allowed keys: ${[...ALLOWED_OVERRIDE_KEYS].join(", ")}`
            );
          }
        }
      }
    }
    if (format === "json" && criteria.add !== void 0) {
      throw new Error(
        `Policy "${source}" is invalid: "criteria.add" is not supported in JSON policies (check functions cannot be serialized). Use a .ts or .js policy file instead.`
      );
    }
  }
  if (record.extras !== void 0) {
    if (typeof record.extras !== "object" || record.extras === null) {
      throw new Error(`Policy "${source}" is invalid: "extras" must be an object`);
    }
    const extras = record.extras;
    if (extras.disable !== void 0 && !isStringArray(extras.disable)) {
      throw new Error(
        `Policy "${source}" is invalid: "extras.disable" must be an array of strings`
      );
    }
    if (format === "json" && extras.add !== void 0) {
      throw new Error(
        `Policy "${source}" is invalid: "extras.add" is not supported in JSON policies (check functions cannot be serialized). Use a .ts or .js policy file instead.`
      );
    }
  }
  if (record.thresholds !== void 0) {
    if (typeof record.thresholds !== "object" || record.thresholds === null) {
      throw new Error(`Policy "${source}" is invalid: "thresholds" must be an object`);
    }
    const thresholds = record.thresholds;
    if (thresholds.passRate !== void 0 && typeof thresholds.passRate !== "number") {
      throw new Error(`Policy "${source}" is invalid: "thresholds.passRate" must be a number`);
    }
    if (
      typeof thresholds.passRate === "number" &&
      (thresholds.passRate < 0 || thresholds.passRate > 1)
    ) {
      throw new Error(
        `Policy "${source}" is invalid: "thresholds.passRate" must be between 0 and 1`
      );
    }
  }
  return record;
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
async function loadPolicy(source, options) {
  const jsonOnly = options?.jsonOnly ?? false;
  if (source.startsWith(".") || import_path7.default.isAbsolute(source)) {
    const resolved = import_path7.default.resolve(source);
    if (resolved.endsWith(".json")) {
      const data = await readJson(resolved);
      if (!data) {
        throw new Error(`Policy "${source}" not found at: ${resolved}`);
      }
      return validatePolicyConfig(data, source, "json");
    }
    if (/\.[mc]?[jt]s$/u.test(resolved)) {
      if (jsonOnly) {
        throw new Error(
          `Policy "${source}" rejected: only JSON policies are allowed from primer.config.json. Module policies (.ts/.js) must be passed via --policy.`
        );
      }
      try {
        const mod = await import(resolved);
        const config = mod.default ?? mod;
        return validatePolicyConfig(config, source);
      } catch (err) {
        if (
          err instanceof Error &&
          (err.message.includes("Cannot find module") || err.message.includes("MODULE_NOT_FOUND"))
        ) {
          throw new Error(`Policy "${source}" not found at: ${resolved}`);
        }
        throw err;
      }
    }
    try {
      const raw = await import_promises6.default.readFile(resolved, "utf8");
      const data = JSON.parse(raw);
      return validatePolicyConfig(data, source, "json");
    } catch {
      throw new Error(
        `Policy "${source}" could not be loaded from: ${resolved}. Supported formats: .json, .js, .ts, .mjs`
      );
    }
  }
  if (jsonOnly) {
    throw new Error(
      `Policy "${source}" rejected: only JSON file policies are allowed from primer.config.json. npm policies must be passed via --policy.`
    );
  }
  try {
    const mod = await import(source);
    const config = mod.default ?? mod;
    return validatePolicyConfig(config, source);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("Cannot find module") ||
        err.message.includes("Cannot find package") ||
        err.message.includes("MODULE_NOT_FOUND") ||
        err.message.includes("ERR_MODULE_NOT_FOUND"))
    ) {
      throw new Error(`Policy "${source}" not found. Install it with: npm install ${source}`);
    }
    throw err;
  }
}
function resolveChain(baseCriteria, baseExtras, policies) {
  const chain = [];
  let criteria = [...baseCriteria];
  let extras = [...baseExtras];
  let passRate = DEFAULT_PASS_RATE;
  for (const policy of policies) {
    chain.push(policy.name);
    if (policy.criteria) {
      if (policy.criteria.disable?.length) {
        const disableSet = new Set(policy.criteria.disable);
        criteria = criteria.filter((c) => !disableSet.has(c.id));
      }
      if (policy.criteria.override) {
        for (const [id, overrides] of Object.entries(policy.criteria.override)) {
          const idx = criteria.findIndex((c) => c.id === id);
          if (idx >= 0) {
            criteria[idx] = { ...criteria[idx], ...overrides };
          }
        }
      }
      if (policy.criteria.add?.length) {
        for (const newCriterion of policy.criteria.add) {
          const existingIdx = criteria.findIndex((c) => c.id === newCriterion.id);
          if (existingIdx >= 0) {
            criteria[existingIdx] = newCriterion;
          } else {
            criteria.push(newCriterion);
          }
        }
      }
    }
    if (policy.extras) {
      if (policy.extras.disable?.length) {
        const disableSet = new Set(policy.extras.disable);
        extras = extras.filter((e) => !disableSet.has(e.id));
      }
      if (policy.extras.add?.length) {
        for (const newExtra of policy.extras.add) {
          const existingIdx = extras.findIndex((e) => e.id === newExtra.id);
          if (existingIdx >= 0) {
            extras[existingIdx] = newExtra;
          } else {
            extras.push(newExtra);
          }
        }
      }
    }
    if (policy.thresholds?.passRate !== void 0) {
      passRate = policy.thresholds.passRate;
    }
  }
  return { chain, criteria, extras, thresholds: { passRate } };
}

// ../src/services/readiness.ts
async function runReadinessReport(options) {
  const repoPath = options.repoPath;
  const analysis = await analyzeRepo(repoPath);
  const rootFiles = await safeReadDir(repoPath);
  const rootPackageJson = await readJson(import_path8.default.join(repoPath, "package.json"));
  const apps = analysis.apps?.length ? analysis.apps : [];
  const context = {
    repoPath,
    analysis,
    apps,
    rootFiles,
    rootPackageJson
  };
  let policySources = options.policies;
  if (!policySources?.length) {
    const primerConfig = await loadPrimerConfig(repoPath);
    if (primerConfig?.policies?.length) {
      policySources = primerConfig.policies;
    }
  }
  const baseCriteria = buildCriteria();
  const baseExtras = buildExtras();
  let resolvedCriteria;
  let resolvedExtras;
  let passRateThreshold = 0.8;
  let policyInfo;
  if (policySources?.length) {
    const policyConfigs = [];
    const isConfigSourced = policySources !== options.policies;
    for (const source of policySources) {
      policyConfigs.push(await loadPolicy(source, { jsonOnly: isConfigSourced }));
    }
    const resolved = resolveChain(baseCriteria, baseExtras, policyConfigs);
    resolvedCriteria = resolved.criteria;
    resolvedExtras = resolved.extras;
    passRateThreshold = resolved.thresholds.passRate;
    policyInfo = { chain: resolved.chain, criteriaCount: resolved.criteria.length };
  } else {
    resolvedCriteria = baseCriteria;
    resolvedExtras = baseExtras;
  }
  const criteriaResults = [];
  for (const criterion of resolvedCriteria) {
    if (criterion.scope === "repo") {
      const result = await criterion.check(context);
      criteriaResults.push({
        id: criterion.id,
        title: criterion.title,
        pillar: criterion.pillar,
        level: criterion.level,
        scope: criterion.scope,
        impact: criterion.impact,
        effort: criterion.effort,
        status: result.status,
        reason: result.reason,
        evidence: result.evidence
      });
      continue;
    }
    if (criterion.scope === "area") {
      if (!options.perArea) continue;
      const areas2 = analysis.areas ?? [];
      if (areas2.length === 0) continue;
      criteriaResults.push({
        id: criterion.id,
        title: criterion.title,
        pillar: criterion.pillar,
        level: criterion.level,
        scope: criterion.scope,
        impact: criterion.impact,
        effort: criterion.effort,
        status: "skip",
        reason: "Run with --per-area for area breakdown."
      });
      continue;
    }
    const appResults = await Promise.all(
      apps.map(async (app) => ({
        app,
        result: await criterion.check(context, app)
      }))
    );
    if (!appResults.length) {
      criteriaResults.push({
        id: criterion.id,
        title: criterion.title,
        pillar: criterion.pillar,
        level: criterion.level,
        scope: criterion.scope,
        impact: criterion.impact,
        effort: criterion.effort,
        status: "skip",
        reason: "No application packages detected."
      });
      continue;
    }
    const passed = appResults.filter((entry) => entry.result.status === "pass").length;
    const total = appResults.length;
    const passRate = total ? passed / total : 0;
    const status = passRate >= passRateThreshold ? "pass" : "fail";
    const failures = appResults
      .filter((entry) => entry.result.status !== "pass")
      .map((entry) => entry.app.name);
    criteriaResults.push({
      id: criterion.id,
      title: criterion.title,
      pillar: criterion.pillar,
      level: criterion.level,
      scope: criterion.scope,
      impact: criterion.impact,
      effort: criterion.effort,
      status,
      reason: status === "pass" ? void 0 : `Only ${passed}/${total} apps pass this check.`,
      passRate,
      appSummary: { passed, total },
      appFailures: failures
    });
  }
  let areaReports;
  const areas = analysis.areas ?? [];
  if (options.perArea && areas.length > 0) {
    const areaCriteria = resolvedCriteria.filter((c) => c.scope === "area");
    areaReports = [];
    for (const area of areas) {
      if (!area.path) continue;
      const areaFiles = await safeReadDir(area.path);
      const areaContext = {
        ...context,
        areaPath: area.path,
        areaFiles
      };
      const areaResults = [];
      for (const criterion of areaCriteria) {
        const result = await criterion.check(areaContext, void 0, area);
        areaResults.push({
          id: criterion.id,
          title: criterion.title,
          pillar: criterion.pillar,
          level: criterion.level,
          scope: criterion.scope,
          impact: criterion.impact,
          effort: criterion.effort,
          status: result.status,
          reason: result.reason,
          evidence: result.evidence
        });
      }
      const areaPillars = summarizePillars(areaResults);
      areaReports.push({ area, criteria: areaResults, pillars: areaPillars });
    }
    for (const criterion of criteriaResults) {
      if (criterion.scope !== "area") continue;
      const perAreaResults = areaReports
        .map((ar) => ar.criteria.find((c) => c.id === criterion.id))
        .filter(Boolean);
      if (!perAreaResults.length) continue;
      const passed = perAreaResults.filter((r) => r.status === "pass").length;
      const total = perAreaResults.length;
      const passRate = total ? passed / total : 0;
      criterion.status = passRate >= passRateThreshold ? "pass" : "fail";
      criterion.reason =
        criterion.status === "pass" ? void 0 : `Only ${passed}/${total} areas pass this check.`;
      criterion.passRate = passRate;
      criterion.areaSummary = { passed, total };
      criterion.areaFailures = areaReports
        .filter((ar) => ar.criteria.find((c) => c.id === criterion.id)?.status !== "pass")
        .map((ar) => ar.area.name);
    }
  }
  const pillars = summarizePillars(criteriaResults);
  const levels = summarizeLevels(criteriaResults, passRateThreshold);
  const achievedLevel = levels
    .filter((level) => level.achieved)
    .reduce((acc, level) => Math.max(acc, level.level), 0);
  const extras = options.includeExtras === false ? [] : await runExtras(context, resolvedExtras);
  return {
    repoPath,
    generatedAt: /* @__PURE__ */ new Date().toISOString(),
    isMonorepo: analysis.isMonorepo ?? false,
    apps: apps.map((app) => ({ name: app.name, path: app.path })),
    pillars,
    levels,
    achievedLevel,
    criteria: criteriaResults,
    extras,
    areaReports,
    policies: policyInfo
  };
}
function buildCriteria() {
  return [
    {
      id: "lint-config",
      title: "Linting configured",
      pillar: "style-validation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await hasLintConfig(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing ESLint/Biome/Prettier configuration.",
          evidence: ["eslint.config.js", ".eslintrc", "biome.json", ".prettierrc"]
        };
      }
    },
    {
      id: "typecheck-config",
      title: "Type checking configured",
      pillar: "style-validation",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasTypecheckConfig(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing type checking config (tsconfig or equivalent).",
          evidence: ["tsconfig.json", "pyproject.toml", "mypy.ini"]
        };
      }
    },
    {
      id: "build-script",
      title: "Build script present",
      pillar: "build-system",
      level: 1,
      scope: "app",
      impact: "high",
      effort: "low",
      check: async (_context, app) => {
        const found = Boolean(app?.scripts?.build);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing build script in package.json."
        };
      }
    },
    {
      id: "ci-config",
      title: "CI workflow configured",
      pillar: "build-system",
      level: 2,
      scope: "repo",
      impact: "high",
      effort: "medium",
      check: async (context) => {
        const found = await hasGithubWorkflows(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing .github/workflows CI configuration.",
          evidence: [".github/workflows"]
        };
      }
    },
    {
      id: "test-script",
      title: "Test script present",
      pillar: "testing",
      level: 1,
      scope: "app",
      impact: "high",
      effort: "low",
      check: async (_context, app) => {
        const found = Boolean(app?.scripts?.test);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing test script in package.json."
        };
      }
    },
    {
      id: "readme",
      title: "README present",
      pillar: "documentation",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await hasReadme(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing README documentation.",
          evidence: ["README.md"]
        };
      }
    },
    {
      id: "contributing",
      title: "CONTRIBUTING guide present",
      pillar: "documentation",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await fileExists(
          import_path8.default.join(context.repoPath, "CONTRIBUTING.md")
        );
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing CONTRIBUTING.md for contributor workflows."
        };
      }
    },
    {
      id: "lockfile",
      title: "Lockfile present",
      pillar: "dev-environment",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = hasAnyFile(context.rootFiles, [
          "pnpm-lock.yaml",
          "yarn.lock",
          "package-lock.json",
          "bun.lockb"
        ]);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing package manager lockfile."
        };
      }
    },
    {
      id: "env-example",
      title: "Environment example present",
      pillar: "dev-environment",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = hasAnyFile(context.rootFiles, [".env.example", ".env.sample"]);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing .env.example or .env.sample for setup guidance."
        };
      }
    },
    {
      id: "format-config",
      title: "Formatter configured",
      pillar: "code-quality",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasFormatterConfig(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing Prettier/Biome formatting config."
        };
      }
    },
    {
      id: "codeowners",
      title: "CODEOWNERS present",
      pillar: "security-governance",
      level: 2,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasCodeowners(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing CODEOWNERS file."
        };
      }
    },
    {
      id: "license",
      title: "LICENSE present",
      pillar: "security-governance",
      level: 1,
      scope: "repo",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        const found = await hasLicense(context.repoPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing LICENSE file."
        };
      }
    },
    {
      id: "security-policy",
      title: "Security policy present",
      pillar: "security-governance",
      level: 3,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await fileExists(import_path8.default.join(context.repoPath, "SECURITY.md"));
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing SECURITY.md policy."
        };
      }
    },
    {
      id: "dependabot",
      title: "Dependabot configured",
      pillar: "security-governance",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const found = await fileExists(
          import_path8.default.join(context.repoPath, ".github", "dependabot.yml")
        );
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing .github/dependabot.yml configuration."
        };
      }
    },
    {
      id: "observability",
      title: "Observability tooling present",
      pillar: "observability",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const deps = await readAllDependencies(context);
        const has = deps.some((dep) =>
          ["@opentelemetry/api", "@opentelemetry/sdk", "pino", "winston", "bunyan"].includes(dep)
        );
        return {
          status: has ? "pass" : "fail",
          reason: "No observability dependencies detected (OpenTelemetry/logging)."
        };
      }
    },
    {
      id: "custom-instructions",
      title: "Custom AI instructions or agent guidance",
      pillar: "ai-tooling",
      level: 1,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const rootFound = await hasCustomInstructions(context.repoPath);
        if (rootFound.length === 0) {
          return {
            status: "fail",
            reason:
              "Missing custom AI instructions (e.g. copilot-instructions.md, CLAUDE.md, AGENTS.md, .cursorrules).",
            evidence: [
              "copilot-instructions.md",
              "CLAUDE.md",
              "AGENTS.md",
              ".cursorrules",
              ".github/copilot-instructions.md"
            ]
          };
        }
        const fileBasedInstructions = await hasFileBasedInstructions(context.repoPath);
        const areas = context.analysis.areas ?? [];
        if (areas.length > 0) {
          if (fileBasedInstructions.length === 0) {
            return {
              status: "pass",
              reason: `Root instructions found, but no file-based instructions for ${areas.length} detected areas. Run \`primer instructions --areas\` to generate.`,
              evidence: [...rootFound, ...areas.map((a) => `${a.name}: missing .instructions.md`)]
            };
          }
          return {
            status: "pass",
            reason: `Root + ${fileBasedInstructions.length} file-based instruction(s) found.`,
            evidence: [...rootFound, ...fileBasedInstructions]
          };
        }
        if (context.analysis.isMonorepo && context.apps.length > 1) {
          const appsMissing = [];
          for (const app of context.apps) {
            const appFound = await hasCustomInstructions(app.path);
            if (appFound.length === 0) {
              appsMissing.push(app.name);
            }
          }
          if (appsMissing.length > 0) {
            return {
              status: "pass",
              reason: `Root instructions found, but ${appsMissing.length}/${context.apps.length} apps missing their own: ${appsMissing.join(", ")}`,
              evidence: [
                ...rootFound,
                ...appsMissing.map((name) => `${name}: missing app-level instructions`)
              ]
            };
          }
        }
        return {
          status: "pass",
          evidence: rootFound
        };
      }
    },
    {
      id: "mcp-config",
      title: "MCP configuration present",
      pillar: "ai-tooling",
      level: 2,
      scope: "repo",
      impact: "high",
      effort: "low",
      check: async (context) => {
        const found = await hasMcpConfig(context.repoPath);
        return {
          status: found.length > 0 ? "pass" : "fail",
          reason: "Missing MCP (Model Context Protocol) configuration (e.g. .vscode/mcp.json).",
          evidence:
            found.length > 0
              ? found
              : [".vscode/mcp.json", ".vscode/settings.json (mcp section)", "mcp.json"]
        };
      }
    },
    {
      id: "custom-agents",
      title: "Custom AI agents configured",
      pillar: "ai-tooling",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const found = await hasCustomAgents(context.repoPath);
        return {
          status: found.length > 0 ? "pass" : "fail",
          reason: "No custom AI agents configured (e.g. .github/agents/, .copilot/agents/).",
          evidence:
            found.length > 0
              ? found
              : [".github/agents/", ".copilot/agents/", ".github/copilot/agents/"]
        };
      }
    },
    {
      id: "copilot-skills",
      title: "Copilot/Claude skills present",
      pillar: "ai-tooling",
      level: 3,
      scope: "repo",
      impact: "medium",
      effort: "medium",
      check: async (context) => {
        const found = await hasCopilotSkills(context.repoPath);
        return {
          status: found.length > 0 ? "pass" : "fail",
          reason: "No Copilot or Claude skills found (e.g. .copilot/skills/, .github/skills/).",
          evidence:
            found.length > 0 ? found : [".copilot/skills/", ".github/skills/", ".claude/skills/"]
        };
      }
    },
    // ── Area-scoped criteria (only run when areaPath is set) ──
    {
      id: "area-readme",
      title: "Area README present",
      pillar: "documentation",
      level: 1,
      scope: "area",
      impact: "medium",
      effort: "low",
      check: async (context) => {
        if (!context.areaPath || !context.areaFiles) {
          return { status: "skip", reason: "No area context." };
        }
        const found = context.areaFiles.some(
          (f) => f.toLowerCase() === "readme.md" || f.toLowerCase() === "readme"
        );
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing README in area directory."
        };
      }
    },
    {
      id: "area-build-script",
      title: "Area build script present",
      pillar: "build-system",
      level: 1,
      scope: "area",
      impact: "high",
      effort: "low",
      check: async (context, _app, area) => {
        if (!context.areaPath || !context.areaFiles) {
          return { status: "skip", reason: "No area context." };
        }
        if (area?.scripts?.build) {
          return { status: "pass" };
        }
        const pkgPath = import_path8.default.join(context.areaPath, "package.json");
        const pkg = await readJson(pkgPath);
        const scripts = pkg?.scripts ?? {};
        const found = Boolean(scripts.build);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing build script in area."
        };
      }
    },
    {
      id: "area-test-script",
      title: "Area test script present",
      pillar: "testing",
      level: 1,
      scope: "area",
      impact: "high",
      effort: "low",
      check: async (context, _app, area) => {
        if (!context.areaPath || !context.areaFiles) {
          return { status: "skip", reason: "No area context." };
        }
        if (area?.scripts?.test) {
          return { status: "pass" };
        }
        const pkgPath = import_path8.default.join(context.areaPath, "package.json");
        const pkg = await readJson(pkgPath);
        const scripts = pkg?.scripts ?? {};
        const found = Boolean(scripts.test);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : "Missing test script in area."
        };
      }
    },
    {
      id: "area-instructions",
      title: "Area-specific instructions present",
      pillar: "ai-tooling",
      level: 2,
      scope: "area",
      impact: "high",
      effort: "low",
      check: async (context, _app, area) => {
        if (!area) {
          return { status: "skip", reason: "No area context." };
        }
        const sanitized = sanitizeAreaName(area.name);
        const instructionPath = import_path8.default.join(
          context.repoPath,
          ".github",
          "instructions",
          `${sanitized}.instructions.md`
        );
        const found = await fileExists(instructionPath);
        return {
          status: found ? "pass" : "fail",
          reason: found ? void 0 : `Missing .github/instructions/${sanitized}.instructions.md`
        };
      }
    }
  ];
}
function buildExtras() {
  return [
    {
      id: "agents-doc",
      title: "AGENTS.md present",
      check: async (context) => ({
        status: (await fileExists(import_path8.default.join(context.repoPath, "AGENTS.md")))
          ? "pass"
          : "fail",
        reason: "Missing AGENTS.md to guide coding agents."
      })
    },
    {
      id: "pr-template",
      title: "Pull request template present",
      check: async (context) => ({
        status: (await hasPullRequestTemplate(context.repoPath)) ? "pass" : "fail",
        reason: "Missing PR template for consistent reviews."
      })
    },
    {
      id: "pre-commit",
      title: "Pre-commit hooks configured",
      check: async (context) => ({
        status: (await hasPrecommitConfig(context.repoPath)) ? "pass" : "fail",
        reason: "Missing pre-commit or Husky configuration for fast feedback."
      })
    },
    {
      id: "architecture-doc",
      title: "Architecture guide present",
      check: async (context) => ({
        status: (await hasArchitectureDoc(context.repoPath)) ? "pass" : "fail",
        reason: "Missing architecture documentation."
      })
    }
  ];
}
async function runExtras(context, extraDefs) {
  const results = [];
  for (const def of extraDefs) {
    const result = await def.check(context);
    results.push({
      id: def.id,
      title: def.title,
      status: result.status,
      reason: result.reason
    });
  }
  return results;
}
function summarizePillars(criteria) {
  const pillarNames = {
    "style-validation": "Style & Validation",
    "build-system": "Build System",
    testing: "Testing",
    documentation: "Documentation",
    "dev-environment": "Dev Environment",
    "code-quality": "Code Quality",
    observability: "Observability",
    "security-governance": "Security & Governance",
    "ai-tooling": "AI Tooling"
  };
  return Object.keys(pillarNames).map((pillar) => {
    const items = criteria.filter((criterion) => criterion.pillar === pillar);
    const { passed, total } = countStatus(items);
    return {
      id: pillar,
      name: pillarNames[pillar],
      passed,
      total,
      passRate: total ? passed / total : 0
    };
  });
}
function summarizeLevels(criteria, passRateThreshold = 0.8) {
  const levelNames = {
    1: "Functional",
    2: "Documented",
    3: "Standardized",
    4: "Optimized",
    5: "Autonomous"
  };
  const summaries = [];
  for (let level = 1; level <= 5; level += 1) {
    const items = criteria.filter((criterion) => criterion.level === level);
    const { passed, total } = countStatus(items);
    const passRate = total ? passed / total : 0;
    summaries.push({
      level,
      name: levelNames[level],
      passed,
      total,
      passRate,
      achieved: false
    });
  }
  for (const summary of summaries) {
    const allPrior = summaries.filter((candidate) => candidate.level <= summary.level);
    const achieved = allPrior.every(
      (candidate) => candidate.total > 0 && candidate.passRate >= passRateThreshold
    );
    summary.achieved = achieved;
  }
  return summaries;
}
function countStatus(items) {
  const relevant = items.filter((item) => item.status !== "skip");
  const passed = relevant.filter((item) => item.status === "pass").length;
  return { passed, total: relevant.length };
}
function hasAnyFile(files, candidates) {
  return candidates.some((candidate) => files.includes(candidate));
}
async function hasReadme(repoPath) {
  const files = await safeReadDir(repoPath);
  return files.some(
    (file) => file.toLowerCase() === "readme.md" || file.toLowerCase() === "readme"
  );
}
async function hasLintConfig(repoPath) {
  return hasAnyFile(await safeReadDir(repoPath), [
    "eslint.config.js",
    "eslint.config.mjs",
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    ".eslintrc.yml",
    ".eslintrc.yaml",
    "biome.json",
    "biome.jsonc",
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    ".prettierrc.cjs",
    "prettier.config.js",
    "prettier.config.cjs"
  ]);
}
async function hasFormatterConfig(repoPath) {
  return hasAnyFile(await safeReadDir(repoPath), [
    "biome.json",
    "biome.jsonc",
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    ".prettierrc.cjs",
    "prettier.config.js",
    "prettier.config.cjs"
  ]);
}
async function hasTypecheckConfig(repoPath) {
  return hasAnyFile(await safeReadDir(repoPath), [
    "tsconfig.json",
    "tsconfig.base.json",
    "pyproject.toml",
    "mypy.ini"
  ]);
}
async function hasGithubWorkflows(repoPath) {
  return fileExists(import_path8.default.join(repoPath, ".github", "workflows"));
}
async function hasCodeowners(repoPath) {
  const root = await fileExists(import_path8.default.join(repoPath, "CODEOWNERS"));
  const github = await fileExists(import_path8.default.join(repoPath, ".github", "CODEOWNERS"));
  return root || github;
}
async function hasLicense(repoPath) {
  const files = await safeReadDir(repoPath);
  return files.some((file) => file.toLowerCase().startsWith("license"));
}
async function hasPullRequestTemplate(repoPath) {
  const direct = await fileExists(
    import_path8.default.join(repoPath, ".github", "PULL_REQUEST_TEMPLATE.md")
  );
  if (direct) return true;
  const dir = import_path8.default.join(repoPath, ".github", "PULL_REQUEST_TEMPLATE");
  try {
    const entries = await import_promises7.default.readdir(dir);
    return entries.some((entry) => entry.toLowerCase().endsWith(".md"));
  } catch {
    return false;
  }
}
async function hasPrecommitConfig(repoPath) {
  const precommit = await fileExists(
    import_path8.default.join(repoPath, ".pre-commit-config.yaml")
  );
  if (precommit) return true;
  return fileExists(import_path8.default.join(repoPath, ".husky"));
}
async function hasArchitectureDoc(repoPath) {
  const files = await safeReadDir(repoPath);
  if (files.some((file) => file.toLowerCase() === "architecture.md")) return true;
  return fileExists(import_path8.default.join(repoPath, "docs", "architecture.md"));
}
async function hasCustomInstructions(repoPath) {
  const found = [];
  const candidates = [
    ".github/copilot-instructions.md",
    "CLAUDE.md",
    ".claude/CLAUDE.md",
    "AGENTS.md",
    ".github/AGENTS.md",
    ".cursorrules",
    ".cursorignore",
    ".windsurfrules",
    ".github/instructions.md",
    "copilot-instructions.md"
  ];
  for (const candidate of candidates) {
    if (await fileExists(import_path8.default.join(repoPath, candidate))) {
      found.push(candidate);
    }
  }
  return found;
}
async function hasFileBasedInstructions(repoPath) {
  const instructionsDir = import_path8.default.join(repoPath, ".github", "instructions");
  try {
    const entries = await import_promises7.default.readdir(instructionsDir);
    return entries
      .filter((e) => e.endsWith(".instructions.md"))
      .map((e) => `.github/instructions/${e}`);
  } catch {
    return [];
  }
}
async function hasMcpConfig(repoPath) {
  const found = [];
  if (await fileExists(import_path8.default.join(repoPath, ".vscode", "mcp.json"))) {
    found.push(".vscode/mcp.json");
  }
  if (await fileExists(import_path8.default.join(repoPath, "mcp.json"))) {
    found.push("mcp.json");
  }
  const settings = await readJson(import_path8.default.join(repoPath, ".vscode", "settings.json"));
  if (settings && (settings["mcp"] || settings["github.copilot.chat.mcp.enabled"])) {
    found.push(".vscode/settings.json (mcp section)");
  }
  if (await fileExists(import_path8.default.join(repoPath, ".claude", "mcp.json"))) {
    found.push(".claude/mcp.json");
  }
  return found;
}
async function hasCustomAgents(repoPath) {
  const found = [];
  const agentDirs = [".github/agents", ".copilot/agents", ".github/copilot/agents"];
  for (const dir of agentDirs) {
    if (await fileExists(import_path8.default.join(repoPath, dir))) {
      found.push(dir);
    }
  }
  const agentFiles = [".github/copilot-agents.yml", ".github/copilot-agents.yaml"];
  for (const agentFile of agentFiles) {
    if (await fileExists(import_path8.default.join(repoPath, agentFile))) {
      found.push(agentFile);
    }
  }
  return found;
}
async function hasCopilotSkills(repoPath) {
  const found = [];
  const skillDirs = [
    ".copilot/skills",
    ".github/skills",
    ".claude/skills",
    ".github/copilot/skills"
  ];
  for (const dir of skillDirs) {
    if (await fileExists(import_path8.default.join(repoPath, dir))) {
      found.push(dir);
    }
  }
  return found;
}
async function readAllDependencies(context) {
  const dependencies = [];
  const apps = context.apps.length ? context.apps : [];
  for (const app of apps) {
    if (!app.packageJsonPath) continue;
    const pkg = await readJson(app.packageJsonPath);
    const deps = pkg?.dependencies ?? {};
    const devDeps = pkg?.devDependencies ?? {};
    dependencies.push(
      ...Object.keys({
        ...deps,
        ...devDeps
      })
    );
  }
  if (!apps.length && context.rootPackageJson) {
    const rootDeps = context.rootPackageJson.dependencies ?? {};
    const rootDevDeps = context.rootPackageJson.devDependencies ?? {};
    dependencies.push(
      ...Object.keys({
        ...rootDeps,
        ...rootDevDeps
      })
    );
  }
  return Array.from(new Set(dependencies));
}

// ../src/services/visualReport.ts
function generateVisualReport(options) {
  const {
    reports,
    title = "AI Readiness Report",
    generatedAt = /* @__PURE__ */ new Date().toISOString()
  } = options;
  const successfulReports = reports.filter((r) => !r.error);
  const failedReports = reports.filter((r) => r.error);
  const totalRepos = reports.length;
  const successfulRepos = successfulReports.length;
  const avgLevel =
    successfulReports.length > 0
      ? successfulReports.reduce((sum, r) => sum + r.report.achievedLevel, 0) /
        successfulReports.length
      : 0;
  const pillarStats = calculatePillarStats(successfulReports);
  const aiToolingData = calculateAiToolingData(successfulReports);
  return `<!DOCTYPE html>
<html lang="en" data-color-mode="dark" data-dark-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root, [data-theme="dark"] {
      --color-canvas-default: #0d1117;
      --color-canvas-subtle: #161b22;
      --color-canvas-inset: #010409;
      --color-border-default: #30363d;
      --color-border-muted: #21262d;
      --color-fg-default: #e6edf3;
      --color-fg-muted: #8b949e;
      --color-fg-subtle: #6e7681;
      --color-accent-fg: #58a6ff;
      --color-accent-emphasis: #1f6feb;
      --color-success-fg: #3fb950;
      --color-success-emphasis: #238636;
      --color-danger-fg: #f85149;
      --color-danger-emphasis: #da3633;
      --color-attention-fg: #d29922;
      --color-done-fg: #a371f7;
    }

    [data-theme="light"] {
      --color-canvas-default: #ffffff;
      --color-canvas-subtle: #f6f8fa;
      --color-canvas-inset: #eff2f5;
      --color-border-default: #d0d7de;
      --color-border-muted: #d8dee4;
      --color-fg-default: #1f2328;
      --color-fg-muted: #656d76;
      --color-fg-subtle: #6e7781;
      --color-accent-fg: #0969da;
      --color-accent-emphasis: #0550ae;
      --color-success-fg: #1a7f37;
      --color-success-emphasis: #116329;
      --color-danger-fg: #cf222e;
      --color-danger-emphasis: #a40e26;
      --color-attention-fg: #9a6700;
      --color-done-fg: #8250df;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      background: var(--color-canvas-default);
      color: var(--color-fg-default);
      padding: 24px;
      line-height: 1.5;
      font-size: 14px;
    }

    .container { max-width: 1280px; margin: 0 auto; }

    /* Header */
    .header {
      background: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      padding: 20px 24px;
      border-radius: 6px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-logo { width: 32px; height: 32px; flex-shrink: 0; }
    .header-text h1 { font-size: 20px; font-weight: 600; color: var(--color-fg-default); }
    .header .subtitle { color: var(--color-fg-muted); font-size: 12px; }

    /* Summary Cards */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .card {
      background: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      padding: 16px;
      border-radius: 6px;
    }
    .card-title { font-size: 12px; color: var(--color-fg-muted); font-weight: 500; margin-bottom: 4px; }
    .card-value { font-size: 32px; font-weight: 600; color: var(--color-accent-fg); }
    .card-subtitle { font-size: 12px; color: var(--color-fg-subtle); margin-top: 4px; }

    /* Sections */
    .section {
      background: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      padding: 24px;
      border-radius: 6px;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-fg-default);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border-muted);
    }

    /* Pillar Grid */
    .pillar-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
    }
    .pillar-card {
      padding: 12px 16px;
      border-radius: 6px;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-muted);
    }
    .pillar-name { font-size: 13px; font-weight: 600; color: var(--color-fg-default); margin-bottom: 8px; }
    .pillar-stats { display: flex; align-items: center; gap: 12px; }
    .progress-bar { flex: 1; height: 8px; background: var(--color-border-muted); border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
    .progress-fill.low { background: var(--color-danger-fg); }
    .progress-fill.medium { background: var(--color-attention-fg); }
    .progress-fill.high { background: var(--color-success-fg); }
    .pillar-stats span { font-size: 12px; color: var(--color-fg-muted); white-space: nowrap; }

    /* Repo List */
    .repo-list { display: grid; gap: 12px; }
    .repo-item {
      padding: 16px;
      border-radius: 6px;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-muted);
    }
    .repo-item.error { border-color: var(--color-danger-emphasis); }
    .repo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .repo-name { font-size: 16px; font-weight: 600; color: var(--color-accent-fg); }
    .error-message { color: var(--color-danger-fg); font-size: 13px; margin-top: 8px; }

    /* Level Badges */
    .level-badge {
      padding: 2px 10px;
      border-radius: 2em;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid transparent;
    }
    .level-0 { background: rgba(139,148,158,0.1); color: var(--color-fg-muted); border-color: var(--color-border-default); }
    .level-1 { background: rgba(88,166,255,0.12); color: var(--color-accent-fg); border-color: rgba(88,166,255,0.3); }
    .level-2 { background: rgba(121,192,255,0.12); color: #79c0ff; border-color: rgba(121,192,255,0.3); }
    .level-3 { background: rgba(63,185,80,0.12); color: var(--color-success-fg); border-color: rgba(63,185,80,0.3); }
    .level-4 { background: rgba(210,153,34,0.12); color: var(--color-attention-fg); border-color: rgba(210,153,34,0.3); }
    .level-5 { background: rgba(163,113,247,0.12); color: var(--color-done-fg); border-color: rgba(163,113,247,0.3); }

    /* Repo Pillars (expandable) */
    .repo-pillars {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 8px;
      margin-top: 12px;
    }
    .repo-pillar {
      background: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-muted);
      border-radius: 6px;
      font-size: 13px;
      overflow: hidden;
    }
    .repo-pillar details { cursor: pointer; }
    .repo-pillar summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      list-style: none;
      user-select: none;
    }
    .repo-pillar summary::-webkit-details-marker { display: none; }
    .repo-pillar summary::before {
      content: '\\25B8';
      color: var(--color-fg-subtle);
      margin-right: 6px;
      font-size: 10px;
    }
    .repo-pillar details[open] summary::before { content: '\\25BE'; }
    .repo-pillar summary:hover { background: rgba(177,186,196,0.04); }
    .repo-pillar-name { color: var(--color-fg-muted); }
    .repo-pillar-value { font-weight: 600; color: var(--color-fg-default); font-size: 12px; }
    .pillar-criteria-list { padding: 4px 12px 8px; border-top: 1px solid var(--color-border-muted); }
    .criterion-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      font-size: 12px;
      color: var(--color-fg-muted);
    }
    .criterion-row + .criterion-row { border-top: 1px solid rgba(33,38,45,0.5); }
    .criterion-status {
      font-size: 12px;
      font-weight: 500;
      padding: 1px 8px;
      border-radius: 2em;
      border: 1px solid transparent;
    }
    .criterion-status.pass { color: var(--color-success-fg); background: rgba(63,185,80,0.1); border-color: rgba(63,185,80,0.2); }
    .criterion-status.fail { color: var(--color-danger-fg); background: rgba(248,81,73,0.1); border-color: rgba(248,81,73,0.2); }
    .criterion-status.skip { color: var(--color-fg-muted); background: rgba(139,148,158,0.08); border-color: rgba(139,148,158,0.15); }

    /* Level Distribution */
    .level-distribution { display: flex; gap: 12px; margin: 8px 0 16px; align-items: flex-end; }
    .level-bar {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      min-height: 160px;
    }
    .level-bar-count { font-size: 14px; font-weight: 600; color: var(--color-accent-fg); margin-bottom: 4px; }
    .level-bar-fill {
      width: 100%;
      background: linear-gradient(180deg, var(--color-accent-fg), var(--color-accent-emphasis));
      border-radius: 6px 6px 0 0;
      transition: height 0.3s ease;
    }
    .level-bar-fill.empty { background: var(--color-border-muted); height: 3px !important; border-radius: 3px; }
    .level-bar-label { margin-top: 8px; font-size: 11px; color: var(--color-fg-muted); font-weight: 500; }

    /* Maturity Model */
    .maturity-descriptions { display: grid; gap: 8px; }
    .maturity-item {
      padding: 10px 14px;
      border-radius: 6px;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-muted);
    }
    .maturity-item.has-repos { border-color: var(--color-accent-fg); }
    .maturity-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .maturity-name { font-size: 14px; font-weight: 600; color: var(--color-fg-default); }
    .maturity-count { margin-left: auto; font-size: 12px; color: var(--color-fg-muted); }
    .maturity-desc { font-size: 12px; color: var(--color-fg-muted); line-height: 1.5; }

    /* AI Hero */
    .ai-hero {
      background: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      padding: 24px;
      border-radius: 6px;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
    }
    .ai-hero::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--color-accent-fg), var(--color-done-fg), var(--color-success-fg));
    }
    .ai-hero .section-title { color: var(--color-fg-default); }
    .ai-hero-subtitle { color: var(--color-fg-muted); font-size: 13px; margin-bottom: 16px; }
    .ai-score-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .ai-score-ring {
      width: 72px; height: 72px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; flex-shrink: 0;
    }
    .ai-score-ring.score-high { background: rgba(63,185,80,0.1); border: 2px solid var(--color-success-fg); color: var(--color-success-fg); }
    .ai-score-ring.score-medium { background: rgba(210,153,34,0.1); border: 2px solid var(--color-attention-fg); color: var(--color-attention-fg); }
    .ai-score-ring.score-low { background: rgba(248,81,73,0.1); border: 2px solid var(--color-danger-fg); color: var(--color-danger-fg); }
    .ai-score-detail { flex: 1; }
    .ai-score-label { font-size: 16px; font-weight: 600; color: var(--color-fg-default); margin-bottom: 2px; }
    .ai-score-desc { color: var(--color-fg-muted); font-size: 13px; }
    .ai-criteria-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px; }
    .ai-criterion {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-muted);
      transition: border-color 0.15s;
    }
    .ai-criterion:hover { border-color: var(--color-border-default); }
    .ai-criterion-icon {
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; flex-shrink: 0; font-weight: 700;
    }
    .ai-criterion-icon.pass { background: rgba(63,185,80,0.12); color: var(--color-success-fg); }
    .ai-criterion-icon.fail { background: rgba(248,81,73,0.12); color: var(--color-danger-fg); }
    .ai-criterion-text { flex: 1; min-width: 0; }
    .ai-criterion-title { font-weight: 600; font-size: 13px; color: var(--color-fg-default); }
    .ai-criterion-reason { font-size: 12px; color: var(--color-fg-muted); margin-top: 1px; }

    /* Footer */
    .footer {
      text-align: center;
      color: var(--color-fg-subtle);
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border-muted);
      font-size: 12px;
    }
    .footer a { color: var(--color-accent-fg); text-decoration: none; }
    .footer a:hover { text-decoration: underline; }

    /* Theme Toggle */
    .theme-toggle {
      margin-left: auto;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-default);
      border-radius: 6px;
      padding: 4px 12px;
      cursor: pointer;
      color: var(--color-fg-muted);
      font-size: 12px;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: border-color 0.15s;
    }
    .theme-toggle:hover {
      border-color: var(--color-accent-fg);
      color: var(--color-fg-default);
    }
    .theme-toggle-icon { font-size: 14px; }

    @media (max-width: 768px) {
      body { padding: 16px; }
      .summary-cards { grid-template-columns: 1fr; }
      .pillar-grid { grid-template-columns: 1fr; }
      .ai-criteria-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <svg class="header-logo" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.26-1.24-.55-1.49 1.81-.2 3.71-.89 3.71-4 0-.88-.31-1.61-.82-2.17.08-.2.36-1.02-.08-2.13 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.93-.08 2.13-.51.56-.82 1.28-.82 2.17 0 3.07 1.87 3.75 3.65 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
      </svg>
      <div class="header-text">
        <h1>${escapeHtml(title)}</h1>
        <p class="subtitle">Generated ${new Date(generatedAt).toLocaleString()}</p>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
        <span class="theme-toggle-icon" id="theme-icon">&#9789;</span>
        <span id="theme-label">Light</span>
      </button>
    </div>

    <div class="summary-cards">
      <div class="card">
        <div class="card-title">Repositories</div>
        <div class="card-value">${totalRepos}</div>
        <div class="card-subtitle">${successfulRepos} analyzed successfully</div>
      </div>
      <div class="card">
        <div class="card-title">Avg Maturity</div>
        <div class="card-value">${avgLevel.toFixed(1)}</div>
        <div class="card-subtitle">${getLevelName(Math.round(avgLevel))}</div>
      </div>
      <div class="card">
        <div class="card-title">Success Rate</div>
        <div class="card-value">${totalRepos > 0 ? Math.round((successfulRepos / totalRepos) * 100) : 0}%</div>
        <div class="card-subtitle">${failedReports.length > 0 ? failedReports.length + " failed" : "All succeeded"}</div>
      </div>
    </div>

    ${
      successfulReports.length > 0
        ? `
    ${buildAiToolingHeroHtml(aiToolingData, successfulReports)}

    <div class="section">
      <h2 class="section-title">Pillar Performance</h2>
      <div class="pillar-grid">
        ${pillarStats
          .map(
            (pillar) => `
          <div class="pillar-card">
            <div class="pillar-name">${escapeHtml(pillar.name)}</div>
            <div class="pillar-stats">
              <div class="progress-bar">
                <div class="progress-fill ${getProgressClass(pillar.passRate)}" style="width: ${Math.max(pillar.passRate * 100, pillar.total > 0 ? 2 : 0)}%"></div>
              </div>
              <span>${pillar.passed}/${pillar.total} (${Math.round(pillar.passRate * 100)}%)</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Maturity Model</h2>
      <div class="maturity-descriptions">
        ${[1, 2, 3, 4, 5]
          .map((level) => {
            const count = successfulReports.filter((r) => r.report.achievedLevel === level).length;
            return `
            <div class="maturity-item${count > 0 ? " has-repos" : ""}">
              <div class="maturity-header">
                <span class="level-badge level-${level}">${level}</span>
                <span class="maturity-name">${getLevelName(level)}</span>
                <span class="maturity-count">${count} repo${count !== 1 ? "s" : ""}</span>
              </div>
              <div class="maturity-desc">${getLevelDescription(level)}</div>
            </div>
          `;
          })
          .join("")}
      </div>

      <h3 style="font-size: 14px; font-weight: 600; color: var(--color-fg-default); margin-top: 20px; margin-bottom: 12px;">Distribution</h3>
      <div class="level-distribution">
        ${[1, 2, 3, 4, 5]
          .map((level) => {
            const count = successfulReports.filter((r) => r.report.achievedLevel === level).length;
            const percent =
              successfulReports.length > 0 ? (count / successfulReports.length) * 100 : 0;
            const barHeight = count > 0 ? Math.max(40, percent * 2) : 0;
            return `
            <div class="level-bar">
              <div class="level-bar-count">${count}</div>
              <div class="level-bar-fill${count === 0 ? " empty" : ""}" style="height: ${barHeight}px"></div>
              <div class="level-bar-label">${level}<br>${getLevelName(level)}</div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <div class="section">
      <h2 class="section-title">Repository Details</h2>
      <div class="repo-list">
        ${reports
          .map(({ repo, report, error }) => {
            if (error) {
              return `
              <div class="repo-item error">
                <div class="repo-header">
                  <div class="repo-name">${escapeHtml(repo)}</div>
                  <span class="level-badge level-0">Error</span>
                </div>
                <div class="error-message">${escapeHtml(error)}</div>
              </div>
            `;
            }
            return `
            <div class="repo-item">
              <div class="repo-header">
                <div class="repo-name">${escapeHtml(repo)}</div>
                <div class="level-badge level-${report.achievedLevel}">
                  Maturity ${report.achievedLevel}: ${getLevelName(report.achievedLevel)}
                </div>
              </div>
              ${report.isMonorepo ? `<div style="color: var(--color-fg-muted); font-size: 12px; margin-bottom: 8px;">Monorepo &middot; ${report.apps.length} apps</div>` : ""}
              <div class="repo-pillars">
                ${report.pillars
                  .map((pillar) => {
                    const pillarCriteria = report.criteria.filter((c) => c.pillar === pillar.id);
                    return `
                  <div class="repo-pillar">
                    <details>
                      <summary>
                        <span class="repo-pillar-name">${escapeHtml(pillar.name)}</span>
                        <span class="repo-pillar-value">${pillar.passed}/${pillar.total} (${Math.round(pillar.passRate * 100)}%)</span>
                      </summary>
                      <div class="pillar-criteria-list">
                        ${pillarCriteria
                          .map(
                            (c) => `
                          <div class="criterion-row">
                            <span>${escapeHtml(c.title)}</span>
                            <span class="criterion-status ${c.status}">${c.status === "pass" ? "Pass" : c.status === "fail" ? "Fail" : "Skip"}</span>
                          </div>
                        `
                          )
                          .join("")}
                        ${pillarCriteria.length === 0 ? '<div class="criterion-row" style="color: var(--color-fg-subtle);">No criteria</div>' : ""}
                      </div>
                    </details>
                  </div>
                `;
                  })
                  .join("")}
              </div>
              ${getTopFixesHtml(report)}
              ${buildAreaReportsHtml(report.areaReports)}
            </div>
          `;
          })
          .join("")}
      </div>
    </div>

    ${
      failedReports.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">Failed Repositories</h2>
      <div class="repo-list">
        ${failedReports
          .map(
            ({ repo, error }) => `
          <div class="repo-item error">
            <div class="repo-name">${escapeHtml(repo)}</div>
            <div class="error-message">${escapeHtml(error || "Unknown error")}</div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <div class="footer">
      <p>Generated with <a href="https://github.com/pierceboggan/primer">Primer</a> &middot; AI Readiness Tool</p>
    </div>
  </div>
  <script>
    function getPreferredTheme() {
      const stored = localStorage.getItem('primer-report-theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const icon = document.getElementById('theme-icon');
      const label = document.getElementById('theme-label');
      if (icon) icon.innerHTML = theme === 'dark' ? '&#9789;' : '&#9788;';
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('primer-report-theme', next);
      applyTheme(next);
    }
    applyTheme(getPreferredTheme());
  </script>
</body>
</html>`;
}
function calculatePillarStats(reports) {
  const pillarMap = /* @__PURE__ */ new Map();
  for (const { report } of reports) {
    for (const pillar of report.pillars) {
      const existing = pillarMap.get(pillar.id);
      if (existing) {
        existing.passed += pillar.passed;
        existing.total += pillar.total;
      } else {
        pillarMap.set(pillar.id, {
          name: pillar.name,
          passed: pillar.passed,
          total: pillar.total
        });
      }
    }
  }
  return Array.from(pillarMap.entries()).map(([id, stats]) => ({
    id,
    name: stats.name,
    passed: stats.passed,
    total: stats.total,
    passRate: stats.total > 0 ? stats.passed / stats.total : 0
  }));
}
function getTopFixesHtml(report) {
  const failedCriteria = report.criteria
    .filter((c) => c.status === "fail")
    .sort((a, b) => {
      const impactWeight = { high: 3, medium: 2, low: 1 };
      const effortWeight = { low: 1, medium: 2, high: 3 };
      const impactDelta = impactWeight[b.impact] - impactWeight[a.impact];
      if (impactDelta !== 0) return impactDelta;
      return effortWeight[a.effort] - effortWeight[b.effort];
    })
    .slice(0, 3);
  if (failedCriteria.length === 0) {
    return '<div style="margin-top: 12px; color: var(--color-success-fg); font-weight: 600; font-size: 13px;">All criteria passing</div>';
  }
  return `
    <div style="margin-top: 12px;">
      <div style="font-size: 12px; font-weight: 600; color: var(--color-fg-muted); margin-bottom: 6px;">Top Fixes Needed</div>
      <ul style="list-style: none; padding-left: 0; font-size: 12px;">
        ${failedCriteria
          .map(
            (c) => `
          <li style="margin-bottom: 4px; color: var(--color-fg-muted);">
            <span style="color: ${c.impact === "high" ? "var(--color-danger-fg)" : c.impact === "medium" ? "var(--color-attention-fg)" : "var(--color-fg-subtle)"};">&#9679;</span>
            <span style="color: var(--color-fg-default);">${escapeHtml(c.title)}</span>
            <span style="color: var(--color-fg-subtle);">${c.impact} impact, ${c.effort} effort</span>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `;
}
function getLevelName(level) {
  const names = {
    1: "Functional",
    2: "Documented",
    3: "Standardized",
    4: "Optimized",
    5: "Autonomous"
  };
  return names[level] || "Unknown";
}
function getLevelDescription(level) {
  const descriptions = {
    1: "Repo builds, tests run, and basic tooling (linter, lockfile) is in place. AI agents can clone and get started.",
    2: "README, CONTRIBUTING guide, and custom AI instructions exist. Agents understand project context and conventions.",
    3: "CI/CD, security policies, CODEOWNERS, and observability are configured. Agents operate within well-defined guardrails.",
    4: "MCP servers, custom agents, and AI skills are set up. Agents have deep integration with project-specific tools and workflows.",
    5: "Full AI-native development: agents can independently plan, implement, test, and ship changes with minimal human oversight."
  };
  return descriptions[level] || "";
}
function getProgressClass(passRate) {
  if (passRate >= 0.8) return "high";
  if (passRate >= 0.5) return "medium";
  return "low";
}
function calculateAiToolingData(reports) {
  const criterionMap = /* @__PURE__ */ new Map();
  for (const { report } of reports) {
    const aiCriteria = report.criteria.filter((c) => c.pillar === "ai-tooling");
    for (const c of aiCriteria) {
      const existing = criterionMap.get(c.id);
      if (existing) {
        existing.totalRepos += 1;
        if (c.status === "pass") existing.passCount += 1;
        if (c.evidence) existing.evidence.push(...c.evidence);
      } else {
        criterionMap.set(c.id, {
          id: c.id,
          title: c.title,
          passCount: c.status === "pass" ? 1 : 0,
          totalRepos: 1,
          status: c.status === "pass" ? "pass" : "fail",
          evidence: c.evidence ? [...c.evidence] : [],
          reason: c.reason || ""
        });
      }
    }
  }
  const criteria = Array.from(criterionMap.values()).map((c) => ({
    ...c,
    status: c.passCount / c.totalRepos >= 0.5 ? "pass" : "fail",
    evidence: [...new Set(c.evidence)]
  }));
  const passed = criteria.filter((c) => c.status === "pass").length;
  return {
    criteria,
    passed,
    total: criteria.length,
    passRate: criteria.length > 0 ? passed / criteria.length : 0
  };
}
function getAiScoreClass(passRate) {
  if (passRate >= 0.6) return "score-high";
  if (passRate >= 0.3) return "score-medium";
  return "score-low";
}
function getAiScoreLabel(passRate) {
  if (passRate >= 0.8) return "Excellent";
  if (passRate >= 0.6) return "Good";
  if (passRate >= 0.4) return "Fair";
  if (passRate >= 0.2) return "Getting Started";
  return "Not Started";
}
function getAiCriterionIcon(id) {
  const icons = {
    "custom-instructions": "&#128221;",
    "mcp-config": "&#128268;",
    "custom-agents": "&#129302;",
    "copilot-skills": "&#9889;"
  };
  return icons[id] || "&#128295;";
}
function buildAiToolingHeroHtml(data, reports) {
  if (data.criteria.length === 0) return "";
  const pct = Math.round(data.passRate * 100);
  const scoreClass = getAiScoreClass(data.passRate);
  const scoreLabel = getAiScoreLabel(data.passRate);
  const multiRepo = reports.length > 1;
  const perRepoHtml = multiRepo
    ? `
    <div style="margin-top: 16px; border-top: 1px solid var(--color-border-muted); padding-top: 12px;">
      <div style="font-size: 12px; font-weight: 600; color: var(--color-fg-muted); margin-bottom: 8px;">Per Repository</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px;">
        ${reports
          .map(({ repo, report }) => {
            const aiPillar = report.pillars.find((p) => p.id === "ai-tooling");
            const repoPct = aiPillar ? Math.round(aiPillar.passRate * 100) : 0;
            const repoPass = aiPillar?.passed ?? 0;
            const repoTotal = aiPillar?.total ?? 0;
            return `<div style="display: flex; justify-content: space-between; padding: 6px 10px; background: var(--color-canvas-default); border: 1px solid var(--color-border-muted); border-radius: 6px; font-size: 12px;">
            <span style="color: var(--color-accent-fg);">${escapeHtml(repo)}</span>
            <span style="font-weight: 600; color: ${repoPct >= 60 ? "var(--color-success-fg)" : repoPct >= 30 ? "var(--color-attention-fg)" : "var(--color-danger-fg)"};">${repoPass}/${repoTotal} (${repoPct}%)</span>
          </div>`;
          })
          .join("")}
      </div>
    </div>
  `
    : "";
  return `
    <div class="ai-hero">
      <h2 class="section-title">AI Tooling Readiness</h2>
      <p class="ai-hero-subtitle">How well prepared ${multiRepo ? "your repositories are" : "this repository is"} for AI-assisted development</p>

      <div class="ai-score-header">
        <div class="ai-score-ring ${scoreClass}">${pct}%</div>
        <div class="ai-score-detail">
          <div class="ai-score-label">${scoreLabel}</div>
          <div class="ai-score-desc">${data.passed} of ${data.total} AI tooling checks passing${multiRepo ? ` across ${reports.length} repositories` : ""}</div>
        </div>
      </div>

      <div class="ai-criteria-grid">
        ${data.criteria
          .map(
            (c) => `
          <div class="ai-criterion">
            <div class="ai-criterion-icon ${c.status}">
              ${c.status === "pass" ? "&#10003;" : "&#10007;"}
            </div>
            <div class="ai-criterion-text">
              <div class="ai-criterion-title">${getAiCriterionIcon(c.id)} ${escapeHtml(c.title)}</div>
              <div class="ai-criterion-reason">${c.status === "pass" ? (multiRepo ? `${c.passCount}/${c.totalRepos} repos` : "Detected") : escapeHtml(c.reason)}</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      ${perRepoHtml}
    </div>
  `;
}
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
function buildAreaReportsHtml(areaReports) {
  if (!areaReports?.length) return "";
  return `
    <div style="margin-top: 16px; border-top: 1px solid var(--color-border-muted); padding-top: 12px;">
      <div style="font-size: 12px; font-weight: 600; color: var(--color-fg-muted); margin-bottom: 8px;">Per-Area Breakdown</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px;">
        ${areaReports
          .map((ar) => {
            const relevant = ar.criteria.filter((c) => c.status !== "skip");
            const passed = relevant.filter((c) => c.status === "pass").length;
            const total = relevant.length;
            const pct = total ? Math.round((passed / total) * 100) : 0;
            const sourceLabel = ar.area.source === "config" ? "config" : "auto";
            const applyTo = Array.isArray(ar.area.applyTo)
              ? ar.area.applyTo.join(", ")
              : ar.area.applyTo;
            return `
          <div style="background: var(--color-canvas-default); border: 1px solid var(--color-border-muted); border-radius: 6px; overflow: hidden;">
            <details>
              <summary style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; cursor: pointer; list-style: none; user-select: none;">
                <span style="font-weight: 600; font-size: 13px; color: var(--color-fg-default);">${escapeHtml(ar.area.name)}</span>
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 10px; padding: 1px 6px; border-radius: 2em; background: rgba(139,148,158,0.08); color: var(--color-fg-subtle); border: 1px solid var(--color-border-muted);">${sourceLabel}</span>
                  <span style="font-weight: 600; font-size: 12px; color: ${pct >= 80 ? "var(--color-success-fg)" : pct >= 50 ? "var(--color-attention-fg)" : "var(--color-danger-fg)"};">${passed}/${total} (${pct}%)</span>
                </span>
              </summary>
              <div style="padding: 4px 12px 8px; border-top: 1px solid var(--color-border-muted);">
                <div style="font-size: 11px; color: var(--color-fg-subtle); margin-bottom: 6px;">${escapeHtml(applyTo)}</div>
                ${ar.criteria
                  .map(
                    (c) => `
                  <div class="criterion-row">
                    <span>${escapeHtml(c.title)}</span>
                    <span class="criterion-status ${c.status}">${c.status === "pass" ? "Pass" : c.status === "fail" ? "Fail" : "Skip"}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </details>
          </div>
        `;
          })
          .join("")}
      </div>
    </div>
  `;
}

// ../src/services/github.ts
var import_node_child_process2 = require("node:child_process");
var import_node_util2 = require("node:util");

// ../node_modules/universal-user-agent/index.js
function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }
  if (typeof process === "object" && process.version !== void 0) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }
  return "<environment undetectable>";
}

// ../node_modules/before-after-hook/lib/register.js
function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }
  if (!options) {
    options = {};
  }
  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name2) => {
      return register.bind(null, state, name2, callback, options);
    }, method)();
  }
  return Promise.resolve().then(() => {
    if (!state.registry[name]) {
      return method(options);
    }
    return state.registry[name].reduce((method2, registered) => {
      return registered.hook.bind(null, method2, options);
    }, method)();
  });
}

// ../node_modules/before-after-hook/lib/add.js
function addHook(state, kind, name, hook2) {
  const orig = hook2;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }
  if (kind === "before") {
    hook2 = (method, options) => {
      return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
    };
  }
  if (kind === "after") {
    hook2 = (method, options) => {
      let result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then((result_) => {
          result = result_;
          return orig(result, options);
        })
        .then(() => {
          return result;
        });
    };
  }
  if (kind === "error") {
    hook2 = (method, options) => {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch((error) => {
          return orig(error, options);
        });
    };
  }
  state.registry[name].push({
    hook: hook2,
    orig
  });
}

// ../node_modules/before-after-hook/lib/remove.js
function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }
  const index = state.registry[name]
    .map((registered) => {
      return registered.orig;
    })
    .indexOf(method);
  if (index === -1) {
    return;
  }
  state.registry[name].splice(index, 1);
}

// ../node_modules/before-after-hook/index.js
var bind = Function.bind;
var bindable = bind.bind(bind);
function bindApi(hook2, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state]);
  hook2.api = { remove: removeHookRef };
  hook2.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach((kind) => {
    const args = name ? [state, kind, name] : [state, kind];
    hook2[kind] = hook2.api[kind] = bindable(addHook, null).apply(null, args);
  });
}
function Singular() {
  const singularHookName = Symbol("Singular");
  const singularHookState = {
    registry: {}
  };
  const singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}
function Collection() {
  const state = {
    registry: {}
  };
  const hook2 = register.bind(null, state);
  bindApi(hook2, state);
  return hook2;
}
var before_after_hook_default = { Singular, Collection };

// ../node_modules/@octokit/endpoint/dist-bundle/index.js
var VERSION = "0.0.0-development";
var userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" &&
    Ctor instanceof Ctor &&
    Function.prototype.call(Ctor) === Function.prototype.call(value)
  );
}
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews
        .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
        .concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) =>
      preview.replace(/-preview/, "")
    );
  }
  return mergedOptions;
}
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return (
    url +
    separator +
    names
      .map((name) => {
        if (name === "q") {
          return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
        }
        return `${name}=${encodeURIComponent(parameters[name])}`;
      })
      .join("&")
  );
}
var urlVariableRegex = /\{[^{}}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}
function encodeReserved(str) {
  return str
    .split(/(%[0-9A-Fa-f]{2})/g)
    .map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
      }
      return part;
    })
    .join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key],
    result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value2) {
            result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];
      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }
      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });
      if (operator && operator !== "+") {
        var separator = ",";
        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }
        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options)
    .filter((option) => urlVariableNames.includes(option))
    .concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept
        .split(/,/)
        .map((format) =>
          format.replace(
            /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
            `application/vnd$1$2.${options.mediaType.format}`
          )
        )
        .join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader =
          headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader
          .concat(options.mediaType.previews)
          .map((preview) => {
            const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
            return `application/vnd.github.${preview}-preview${format}`;
          })
          .join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}
var endpoint = withDefaults(null, DEFAULTS);

// ../node_modules/@octokit/request/dist-bundle/index.js
var import_fast_content_type_parse = __toESM(require_fast_content_type_parse(), 1);

// ../node_modules/@octokit/request-error/dist-src/index.js
var RequestError = class extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(message, statusCode, options) {
    super(message, { cause: options.cause });
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/(?<! ) .*$/, " [REDACTED]")
      });
    }
    requestCopy.url = requestCopy.url
      .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
      .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
};

// ../node_modules/@octokit/request/dist-bundle/index.js
var VERSION2 = "10.0.7";
var defaults_default = {
  headers: {
    "user-agent": `octokit-request.js/${VERSION2} ${getUserAgent()}`
  }
};
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" &&
    Ctor instanceof Ctor &&
    Function.prototype.call(Ctor) === Function.prototype.call(value)
  );
}
var noop = () => "";
async function fetchWrapper(requestOptions) {
  const fetch = requestOptions.request?.fetch || globalThis.fetch;
  if (!fetch) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  const log = requestOptions.request?.log || console;
  const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
  const body =
    isPlainObject2(requestOptions.body) || Array.isArray(requestOptions.body)
      ? JSON.stringify(requestOptions.body)
      : requestOptions.body;
  const requestHeaders = Object.fromEntries(
    Object.entries(requestOptions.headers).map(([name, value]) => [name, String(value)])
  );
  let fetchResponse;
  try {
    fetchResponse = await fetch(requestOptions.url, {
      method: requestOptions.method,
      body,
      redirect: requestOptions.request?.redirect,
      headers: requestHeaders,
      signal: requestOptions.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...(requestOptions.body && { duplex: "half" })
    });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        error.status = 500;
        throw error;
      }
      message = error.message;
      if (error.name === "TypeError" && "cause" in error) {
        if (error.cause instanceof Error) {
          message = error.cause.message;
        } else if (typeof error.cause === "string") {
          message = error.cause;
        }
      }
    }
    const requestError = new RequestError(message, 500, {
      request: requestOptions
    });
    requestError.cause = error;
    throw requestError;
  }
  const status = fetchResponse.status;
  const url = fetchResponse.url;
  const responseHeaders = {};
  for (const [key, value] of fetchResponse.headers) {
    responseHeaders[key] = value;
  }
  const octokitResponse = {
    url,
    status,
    headers: responseHeaders,
    data: ""
  };
  if ("deprecation" in responseHeaders) {
    const matches =
      responseHeaders.link && responseHeaders.link.match(/<([^<>]+)>; rel="deprecation"/);
    const deprecationLink = matches && matches.pop();
    log.warn(
      `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${responseHeaders.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
    );
  }
  if (status === 204 || status === 205) {
    return octokitResponse;
  }
  if (requestOptions.method === "HEAD") {
    if (status < 400) {
      return octokitResponse;
    }
    throw new RequestError(fetchResponse.statusText, status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status === 304) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError("Not modified", status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status >= 400) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError(toErrorMessage(octokitResponse.data), status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  octokitResponse.data = parseSuccessResponseBody
    ? await getResponseData(fetchResponse)
    : fetchResponse.body;
  return octokitResponse;
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType) {
    return response.text().catch(noop);
  }
  const mimetype = (0, import_fast_content_type_parse.safeParse)(contentType);
  if (isJSONResponse(mimetype)) {
    let text = "";
    try {
      text = await response.text();
      return JSON.parse(text);
    } catch (err) {
      return text;
    }
  } else if (
    mimetype.type.startsWith("text/") ||
    mimetype.parameters.charset?.toLowerCase() === "utf-8"
  ) {
    return response.text().catch(noop);
  } else {
    return response.arrayBuffer().catch(
      /* v8 ignore next -- @preserve */
      () => new ArrayBuffer(0)
    );
  }
}
function isJSONResponse(mimetype) {
  return mimetype.type === "application/json" || mimetype.type === "application/scim+json";
}
function toErrorMessage(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return "Unknown error";
  }
  if ("message" in data) {
    const suffix = "documentation_url" in data ? ` - ${data.documentation_url}` : "";
    return Array.isArray(data.errors)
      ? `${data.message}: ${data.errors.map((v) => JSON.stringify(v)).join(", ")}${suffix}`
      : `${data.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}
function withDefaults2(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function (route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2)));
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults2.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: withDefaults2.bind(null, endpoint2)
  });
}
var request = withDefaults2(endpoint, defaults_default);

// ../node_modules/@octokit/graphql/dist-bundle/index.js
var VERSION3 = "0.0.0-development";
function _buildMessageForResponseErrors(data) {
  return (
    `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n")
  );
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "GraphqlResponseError";
  errors;
  data;
};
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(
        new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`)
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(requestOptions, headers, response.data);
    }
    return response.data.data;
  });
}
function withDefaults3(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults3.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}
var graphql2 = withDefaults3(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION3} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults3(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

// ../node_modules/@octokit/auth-token/dist-bundle/index.js
var b64url = "(?:[a-zA-Z0-9_-]+)";
var sep = "\\.";
var jwtRE = new RegExp(`^${b64url}${sep}${b64url}${sep}${b64url}$`);
var isJWT = jwtRE.test.bind(jwtRE);
async function auth(token) {
  const isApp = isJWT(token);
  const isInstallation = token.startsWith("v1.") || token.startsWith("ghs_");
  const isUserToServer = token.startsWith("ghu_");
  const tokenType = isApp
    ? "app"
    : isInstallation
      ? "installation"
      : isUserToServer
        ? "user-to-server"
        : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}
async function hook(token, request2, route, parameters) {
  const endpoint2 = request2.endpoint.merge(route, parameters);
  endpoint2.headers.authorization = withAuthorizationPrefix(token);
  return request2(endpoint2);
}
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

// ../node_modules/@octokit/core/dist-src/version.js
var VERSION4 = "7.0.6";

// ../node_modules/@octokit/core/dist-src/index.js
var noop2 = () => {};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
function createLogger2(logger = {}) {
  if (typeof logger.debug !== "function") {
    logger.debug = noop2;
  }
  if (typeof logger.info !== "function") {
    logger.info = noop2;
  }
  if (typeof logger.warn !== "function") {
    logger.warn = consoleWarn;
  }
  if (typeof logger.error !== "function") {
    logger.error = consoleError;
  }
  return logger;
}
var userAgentTrail = `octokit-core.js/${VERSION4} ${getUserAgent()}`;
var Octokit = class {
  static VERSION = VERSION4;
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent
              ? {
                  userAgent: `${options.userAgent} ${defaults.userAgent}`
                }
              : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  static plugins = [];
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    const currentPlugins = this.plugins;
    const NewOctokit = class extends this {
      static plugins = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook2 = new before_after_hook_default.Collection();
    const requestDefaults = {
      baseUrl: request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook2.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent
      ? `${options.userAgent} ${userAgentTrail}`
      : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = createLogger2(options.log);
    this.hook = hook2;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth2 = createTokenAuth(options.auth);
        hook2.wrap("request", auth2.hook);
        this.auth = auth2;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth2 = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook2.wrap("request", auth2.hook);
      this.auth = auth2;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
  // assigned during constructor
  request;
  graphql;
  log;
  hook;
  // TODO: type `octokit.auth` based on passed options.authStrategy
  auth;
};

// ../node_modules/@octokit/plugin-request-log/dist-src/version.js
var VERSION5 = "6.0.0";

// ../node_modules/@octokit/plugin-request-log/dist-src/index.js
function requestLog(octokit) {
  octokit.hook.wrap("request", (request2, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path11 = requestOptions.url.replace(options.baseUrl, "");
    return request2(options)
      .then((response) => {
        const requestId = response.headers["x-github-request-id"];
        octokit.log.info(
          `${requestOptions.method} ${path11} - ${response.status} with id ${requestId} in ${Date.now() - start}ms`
        );
        return response;
      })
      .catch((error) => {
        const requestId = error.response?.headers["x-github-request-id"] || "UNKNOWN";
        octokit.log.error(
          `${requestOptions.method} ${path11} - ${error.status} with id ${requestId} in ${Date.now() - start}ms`
        );
        throw error;
      });
  });
}
requestLog.VERSION = VERSION5;

// ../node_modules/@octokit/plugin-paginate-rest/dist-bundle/index.js
var VERSION6 = "0.0.0-development";
function normalizePaginatedListResponse(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization =
    ("total_count" in response.data || "total_commits" in response.data) &&
    !("url" in response.data);
  if (!responseNeedsNormalization) return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  const totalCommits = response.data.total_commits;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  delete response.data.total_commits;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  response.data.total_commits = totalCommits;
  return response;
}
function iterator(octokit, route, parameters) {
  const options =
    typeof route === "function"
      ? route.endpoint(parameters)
      : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(/<([^<>]+)>;\s*rel="next"/) ||
            [])[1];
          if (!url && "total_commits" in normalizedResponse.data) {
            const parsedUrl = new URL(normalizedResponse.url);
            const params = parsedUrl.searchParams;
            const page = parseInt(params.get("page") || "1", 10);
            const per_page = parseInt(params.get("per_page") || "250", 10);
            if (page * per_page < normalizedResponse.data.total_commits) {
              params.set("page", String(page + 1));
              url = parsedUrl.toString();
            }
          }
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}
function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = void 0;
  }
  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
    if (earlyExit) {
      return results;
    }
    return gather(octokit, results, iterator2, mapFn);
  });
}
var composePaginateRest = Object.assign(paginate, {
  iterator
});
function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION6;

// ../node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/version.js
var VERSION7 = "17.0.0";

// ../node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/generated/endpoints.js
var Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createHostedRunnerForOrg: ["POST /orgs/{org}/actions/hosted-runners"],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: ["DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"],
    deleteActionsCacheByKey: ["DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteCustomImageFromOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}"
    ],
    deleteCustomImageVersionFromOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteHostedRunnerForOrg: ["DELETE /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteRepoVariable: ["DELETE /repos/{owner}/{repo}/actions/variables/{name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    forceCancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"],
    generateRunnerJitconfigForOrg: ["POST /orgs/{org}/actions/runners/generate-jitconfig"],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: ["GET /orgs/{org}/actions/cache/usage-by-repository"],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomImageForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}"
    ],
    getCustomImageVersionForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}"
    ],
    getCustomOidcSubClaimForRepo: ["GET /repos/{owner}/{repo}/actions/oidc/customization/sub"],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getHostedRunnerForOrg: ["GET /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"],
    getHostedRunnersGithubOwnedImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/github-owned"
    ],
    getHostedRunnersLimitsForOrg: ["GET /orgs/{org}/actions/hosted-runners/limits"],
    getHostedRunnersMachineSpecsForOrg: ["GET /orgs/{org}/actions/hosted-runners/machine-sizes"],
    getHostedRunnersPartnerImagesForOrg: ["GET /orgs/{org}/actions/hosted-runners/images/partner"],
    getHostedRunnersPlatformsForOrg: ["GET /orgs/{org}/actions/hosted-runners/platforms"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: ["GET /repos/{owner}/{repo}/actions/permissions/access"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listCustomImageVersionsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions"
    ],
    listCustomImagesForOrg: ["GET /orgs/{org}/actions/hosted-runners/images/custom"],
    listEnvironmentSecrets: ["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listGithubHostedRunnersInGroupForOrg: [
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners"
    ],
    listHostedRunnersForOrg: ["GET /orgs/{org}/actions/hosted-runners"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}/labels"],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: ["GET /repos/{owner}/{repo}/actions/organization-secrets"],
    listRepoOrganizationVariables: ["GET /repos/{owner}/{repo}/actions/organization-variables"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedReposForOrgVariable: ["GET /orgs/{org}/actions/variables/{name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: ["POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: ["PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedReposForOrgVariable: ["PUT /orgs/{org}/actions/variables/{name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/access"],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateHostedRunnerForOrg: ["PATCH /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: ["PATCH /repos/{owner}/{repo}/actions/variables/{name}"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: ["GET /app/installation-requests"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: ["POST /app/hook/deliveries/{delivery_id}/attempts"],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubBillingPremiumRequestUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/premium_request/usage"
    ],
    getGithubBillingPremiumRequestUsageReportUser: [
      "GET /users/{username}/settings/billing/premium_request/usage"
    ],
    getGithubBillingUsageReportOrg: ["GET /organizations/{org}/settings/billing/usage"],
    getGithubBillingUsageReportUser: ["GET /users/{username}/settings/billing/usage"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  campaigns: {
    createCampaign: ["POST /orgs/{org}/campaigns"],
    deleteCampaign: ["DELETE /orgs/{org}/campaigns/{campaign_number}"],
    getCampaignSummary: ["GET /orgs/{org}/campaigns/{campaign_number}"],
    listOrgCampaigns: ["GET /orgs/{org}/campaigns"],
    updateCampaign: ["PATCH /orgs/{org}/campaigns/{campaign_number}"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: ["POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: ["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],
    createVariantAnalysis: ["POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
    getAutofix: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],
    getCodeqlDatabase: ["GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: ["GET /repos/{owner}/{repo}/code-scanning/codeql/databases"],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    updateDefaultSetup: ["PATCH /repos/{owner}/{repo}/code-scanning/default-setup"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: ["DELETE /orgs/{org}/code-security/configurations/{configuration_id}"],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: ["DELETE /orgs/{org}/code-security/configurations/detach"],
    getConfiguration: ["GET /orgs/{org}/code-security/configurations/{configuration_id}"],
    getConfigurationForRepository: ["GET /repos/{owner}/{repo}/code-security-configuration"],
    getConfigurationsForEnterprise: ["GET /enterprises/{enterprise}/code-security/configurations"],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: ["GET /orgs/{org}/code-security/configurations/defaults"],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: ["PATCH /orgs/{org}/code-security/configurations/{configuration_id}"],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: ["GET /repos/{owner}/{repo}/codespaces/permissions_check"],
    codespaceMachinesForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}/machines"],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/codespaces/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],
    createOrUpdateSecretForAuthenticatedUser: ["PUT /user/codespaces/secrets/{secret_name}"],
    createWithPrForAuthenticatedUser: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"],
    createWithRepoForAuthenticatedUser: ["POST /repos/{owner}/{repo}/codespaces"],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: ["DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],
    deleteSecretForAuthenticatedUser: ["DELETE /user/codespaces/secrets/{secret_name}"],
    exportForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/exports"],
    getCodespacesForUserInOrg: ["GET /orgs/{org}/members/{username}/codespaces"],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: ["GET /user/codespaces/secrets/public-key"],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/codespaces/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],
    getSecretForAuthenticatedUser: ["GET /user/codespaces/secrets/{secret_name}"],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: ["GET /repos/{owner}/{repo}/codespaces"],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: ["GET /repos/{owner}/{repo}/codespaces/new"],
    publishForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/publish"],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: ["GET /repos/{owner}/{repo}/codespaces/machines"],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: ["POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: ["POST /orgs/{org}/copilot/billing/selected_teams"],
    addCopilotSeatsForUsers: ["POST /orgs/{org}/copilot/billing/selected_users"],
    cancelCopilotSeatAssignmentForTeams: ["DELETE /orgs/{org}/copilot/billing/selected_teams"],
    cancelCopilotSeatAssignmentForUsers: ["DELETE /orgs/{org}/copilot/billing/selected_users"],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: ["GET /orgs/{org}/members/{username}/copilot"],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
  },
  credentials: { revoke: ["POST /credentials/revoke"] },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/dependabot/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/dependabot/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],
    listAlertsForEnterprise: ["GET /enterprises/{enterprise}/dependabot/alerts"],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repositoryAccessForOrg: ["GET /organizations/{org}/dependabot/repository-access"],
    setRepositoryAccessDefaultLevel: [
      "PUT /organizations/{org}/dependabot/repository-access/default-level"
    ],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    updateRepositoryAccessForOrg: ["PATCH /organizations/{org}/dependabot/repository-access"]
  },
  dependencyGraph: {
    createRepositorySnapshot: ["POST /repos/{owner}/{repo}/dependency-graph/snapshots"],
    diffRange: ["GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  enterpriseTeamMemberships: {
    add: ["PUT /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"],
    bulkAdd: ["POST /enterprises/{enterprise}/teams/{enterprise-team}/memberships/add"],
    bulkRemove: ["POST /enterprises/{enterprise}/teams/{enterprise-team}/memberships/remove"],
    get: ["GET /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"],
    list: ["GET /enterprises/{enterprise}/teams/{enterprise-team}/memberships"],
    remove: ["DELETE /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"]
  },
  enterpriseTeamOrganizations: {
    add: ["PUT /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"],
    bulkAdd: ["POST /enterprises/{enterprise}/teams/{enterprise-team}/organizations/add"],
    bulkRemove: ["POST /enterprises/{enterprise}/teams/{enterprise-team}/organizations/remove"],
    delete: ["DELETE /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"],
    getAssignment: ["GET /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"],
    getAssignments: ["GET /enterprises/{enterprise}/teams/{enterprise-team}/organizations"]
  },
  enterpriseTeams: {
    create: ["POST /enterprises/{enterprise}/teams"],
    delete: ["DELETE /enterprises/{enterprise}/teams/{team_slug}"],
    get: ["GET /enterprises/{enterprise}/teams/{team_slug}"],
    list: ["GET /enterprises/{enterprise}/teams"],
    update: ["PATCH /enterprises/{enterprise}/teams/{team_slug}"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  hostedCompute: {
    createNetworkConfigurationForOrg: ["POST /orgs/{org}/settings/network-configurations"],
    deleteNetworkConfigurationFromOrg: [
      "DELETE /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkConfigurationForOrg: [
      "GET /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkSettingsForOrg: ["GET /orgs/{org}/settings/network-settings/{network_settings_id}"],
    listNetworkConfigurationsForOrg: ["GET /orgs/{org}/settings/network-configurations"],
    updateNetworkConfigurationForOrg: [
      "PATCH /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addBlockedByDependency: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    getParent: ["GET /repos/{owner}/{repo}/issues/{issue_number}/parent"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listDependenciesBlockedBy: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by"
    ],
    listDependenciesBlocking: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking"
    ],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: ["GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeDependencyBlockedBy: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/{issue_id}"
    ],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    removeSubIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"],
    reprioritizeSubIssue: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", { headers: { "content-type": "text/plain; charset=utf-8" } }]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive"],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive"],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive"],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: ["GET /user/migrations/{migration_id}/repositories"],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: ["GET /orgs/{org}/actions/oidc/customization/sub"],
    updateOidcCustomSubTemplateForOrg: ["PUT /orgs/{org}/actions/oidc/customization/sub"]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated:
          "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: ["PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],
    assignUserToOrgRole: ["PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createArtifactStorageRecord: ["POST /orgs/{org}/artifacts/metadata/storage-record"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createIssueType: ["POST /orgs/{org}/issue-types"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    customPropertiesForOrgsCreateOrUpdateOrganizationValues: [
      "PATCH /organizations/{org}/org-properties/values"
    ],
    customPropertiesForOrgsGetOrganizationValues: [
      "GET /organizations/{org}/org-properties/values"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationDefinition: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationDefinitions: [
      "PATCH /orgs/{org}/properties/schema"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationValues: [
      "PATCH /orgs/{org}/properties/values"
    ],
    customPropertiesForReposDeleteOrganizationDefinition: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposGetOrganizationDefinition: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposGetOrganizationDefinitions: ["GET /orgs/{org}/properties/schema"],
    customPropertiesForReposGetOrganizationValues: ["GET /orgs/{org}/properties/values"],
    delete: ["DELETE /orgs/{org}"],
    deleteAttestationsBulk: ["POST /orgs/{org}/attestations/delete-request"],
    deleteAttestationsById: ["DELETE /orgs/{org}/attestations/{attestation_id}"],
    deleteAttestationsBySubjectDigest: ["DELETE /orgs/{org}/attestations/digest/{subject_digest}"],
    deleteIssueType: ["DELETE /orgs/{org}/issue-types/{issue_type_id}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    disableSelectedRepositoryImmutableReleasesOrganization: [
      "DELETE /orgs/{org}/settings/immutable-releases/repositories/{repository_id}"
    ],
    enableSelectedRepositoryImmutableReleasesOrganization: [
      "PUT /orgs/{org}/settings/immutable-releases/repositories/{repository_id}"
    ],
    get: ["GET /orgs/{org}"],
    getImmutableReleasesSettings: ["GET /orgs/{org}/settings/immutable-releases"],
    getImmutableReleasesSettingsRepositories: [
      "GET /orgs/{org}/settings/immutable-releases/repositories"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getOrgRulesetHistory: ["GET /orgs/{org}/rulesets/{ruleset_id}/history"],
    getOrgRulesetVersion: ["GET /orgs/{org}/rulesets/{ruleset_id}/history/{version_id}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: ["GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listArtifactStorageRecords: [
      "GET /orgs/{org}/artifacts/{subject_digest}/metadata/storage-records"
    ],
    listAttestationRepositories: ["GET /orgs/{org}/attestations/repositories"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listAttestationsBulk: ["POST /orgs/{org}/attestations/bulk-list{?per_page,before,after}"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listIssueTypes: ["GET /orgs/{org}/issue-types"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: ["GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated:
          "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated:
          "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: ["POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"],
    reviewPatGrantRequestsInBulk: ["POST /orgs/{org}/personal-access-token-requests"],
    revokeAllOrgRolesTeam: ["DELETE /orgs/{org}/organization-roles/teams/{team_slug}"],
    revokeAllOrgRolesUser: ["DELETE /orgs/{org}/organization-roles/users/{username}"],
    revokeOrgRoleTeam: ["DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],
    revokeOrgRoleUser: ["DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"],
    setImmutableReleasesSettings: ["PUT /orgs/{org}/settings/immutable-releases"],
    setImmutableReleasesSettingsRepositories: [
      "PUT /orgs/{org}/settings/immutable-releases/repositories"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateIssueType: ["PUT /orgs/{org}/issue-types/{issue_type_id}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
    deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
    deletePackageForUser: ["DELETE /users/{username}/packages/{package_type}/{package_name}"],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: ["packages", "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
    getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
    getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: ["GET /user/docker/conflicts"],
    listDockerMigrationConflictingPackagesForOrganization: ["GET /orgs/{org}/docker/conflicts"],
    listDockerMigrationConflictingPackagesForUser: ["GET /users/{username}/docker/conflicts"],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: ["DELETE /orgs/{org}/private-registries/{secret_name}"],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: ["PATCH /orgs/{org}/private-registries/{secret_name}"]
  },
  projects: {
    addItemForOrg: ["POST /orgs/{org}/projectsV2/{project_number}/items"],
    addItemForUser: ["POST /users/{username}/projectsV2/{project_number}/items"],
    deleteItemForOrg: ["DELETE /orgs/{org}/projectsV2/{project_number}/items/{item_id}"],
    deleteItemForUser: ["DELETE /users/{username}/projectsV2/{project_number}/items/{item_id}"],
    getFieldForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/fields/{field_id}"],
    getFieldForUser: ["GET /users/{username}/projectsV2/{project_number}/fields/{field_id}"],
    getForOrg: ["GET /orgs/{org}/projectsV2/{project_number}"],
    getForUser: ["GET /users/{username}/projectsV2/{project_number}"],
    getOrgItem: ["GET /orgs/{org}/projectsV2/{project_number}/items/{item_id}"],
    getUserItem: ["GET /users/{username}/projectsV2/{project_number}/items/{item_id}"],
    listFieldsForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/fields"],
    listFieldsForUser: ["GET /users/{username}/projectsV2/{project_number}/fields"],
    listForOrg: ["GET /orgs/{org}/projectsV2"],
    listForUser: ["GET /users/{username}/projectsV2"],
    listItemsForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/items"],
    listItemsForUser: ["GET /users/{username}/projectsV2/{project_number}/items"],
    updateItemForOrg: ["PATCH /orgs/{org}/projectsV2/{project_number}/items/{item_id}"],
    updateItemForUser: ["PATCH /users/{username}/projectsV2/{project_number}/items/{item_id}"]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: ["POST /repos/{owner}/{repo}/releases/{release_id}/reactions"],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}/reactions"],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: ["GET /repos/{owner}/{repo}/automated-security-fixes"],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkImmutableReleases: ["GET /repos/{owner}/{repo}/immutable-releases"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts"],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: ["GET /repos/{owner}/{repo}/compare/{basehead}"],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: ["PUT /repos/{owner}/{repo}/environments/{environment_name}"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate"],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    customPropertiesForReposCreateOrUpdateRepositoryValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    customPropertiesForReposGetRepositoryValues: ["GET /repos/{owner}/{repo}/properties/values"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: ["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes"],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disableImmutableReleases: ["DELETE /repos/{owner}/{repo}/immutable-releases"],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts"],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes"],
    enableImmutableReleases: ["PUT /repos/{owner}/{repo}/immutable-releases"],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts"],
    generateReleaseNotes: ["POST /repos/{owner}/{repo}/releases/generate-notes"],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: ["GET /repos/{owner}/{repo}/environments/{environment_name}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: ["GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: ["GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesetHistory: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history"],
    getRepoRulesetVersion: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}"],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    getWebhookDelivery: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: ["GET /repos/{owner}/{repo}/attestations/{subject_digest}"],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    listOrgPatternConfigs: ["GET /orgs/{org}/secret-scanning/pattern-configurations"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    updateOrgPatternConfigs: ["PATCH /orgs/{org}/secret-scanning/pattern-configurations"]
  },
  securityAdvisories: {
    createFork: ["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"],
    createPrivateVulnerabilityReport: ["POST /repos/{owner}/{repo}/security-advisories/reports"],
    createRepositoryAdvisory: ["POST /repos/{owner}/{repo}/security-advisories"],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: ["GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: ["PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteAttestationsBulk: ["POST /users/{username}/attestations/delete-request"],
    deleteAttestationsById: ["DELETE /users/{username}/attestations/{attestation_id}"],
    deleteAttestationsBySubjectDigest: [
      "DELETE /users/{username}/attestations/digest/{subject_digest}"
    ],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: ["DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: ["GET /user/ssh_signing_keys/{ssh_signing_key_id}"],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listAttestationsBulk: ["POST /users/{username}/attestations/bulk-list{?per_page,before,after}"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;

// ../node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/endpoints-to-methods.js
var endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint2] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint2;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign(
      {
        method,
        url
      },
      defaults
    );
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
var handler = {
  has({ scope }, methodName) {
    return endpointMethodsMap.get(scope).has(methodName);
  },
  getOwnPropertyDescriptor(target, methodName) {
    return {
      value: this.get(target, methodName),
      // ensures method is in the cache
      configurable: true,
      writable: true,
      enumerable: true
    };
  },
  defineProperty(target, methodName, descriptor) {
    Object.defineProperty(target.cache, methodName, descriptor);
    return true;
  },
  deleteProperty(target, methodName) {
    delete target.cache[methodName];
    return true;
  },
  ownKeys({ scope }) {
    return [...endpointMethodsMap.get(scope).keys()];
  },
  set(target, methodName, value) {
    return (target.cache[methodName] = value);
  },
  get({ octokit, scope, cache: cache3 }, methodName) {
    if (cache3[methodName]) {
      return cache3[methodName];
    }
    const method = endpointMethodsMap.get(scope).get(methodName);
    if (!method) {
      return void 0;
    }
    const { endpointDefaults, decorations } = method;
    if (decorations) {
      cache3[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
    } else {
      cache3[methodName] = octokit.request.defaults(endpointDefaults);
    }
    return cache3[methodName];
  }
};
function endpointsToMethods(octokit) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
  }
  return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: void 0
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
      );
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options2) {
          octokit.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
          );
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

// ../node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js
function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION7;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    ...api,
    rest: api
  };
}
legacyRestEndpointMethods.VERSION = VERSION7;

// ../node_modules/@octokit/rest/dist-src/version.js
var VERSION8 = "22.0.1";

// ../node_modules/@octokit/rest/dist-src/index.js
var Octokit2 = Octokit.plugin(requestLog, legacyRestEndpointMethods, paginateRest).defaults({
  userAgent: `octokit-rest.js/${VERSION8}`
});

// ../src/services/github.ts
var execFileAsync2 = (0, import_node_util2.promisify)(import_node_child_process2.execFile);
function createGitHubClient(token) {
  return new Octokit2({ auth: token });
}
async function createPullRequest(params) {
  const client = createGitHubClient(params.token);
  const response = await client.rest.pulls.create({
    owner: params.owner,
    repo: params.repo,
    title: params.title,
    body: params.body,
    head: params.head,
    base: params.base
  });
  return response.data.html_url;
}

// src/commands/analyze.ts
var cachedAnalysis;
function getCachedAnalysis() {
  return cachedAnalysis;
}
function setCachedAnalysis(analysis) {
  cachedAnalysis = analysis;
  vscode.commands.executeCommand("setContext", "primer.hasAnalysis", !!analysis);
}
async function analyzeCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "Primer: Analyzing repository\u2026" },
    async () => {
      try {
        const analysis = await analyzeRepo(workspacePath);
        setCachedAnalysis(analysis);
      } catch (err) {
        vscode.window.showErrorMessage(
          `Primer: Analysis failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}
function getWorkspacePath() {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showWarningMessage("Primer: No workspace folder open.");
    return void 0;
  }
  return folder.uri.fsPath;
}

// src/commands/generate.ts
var vscode2 = __toESM(require("vscode"));
var GENERATE_OPTIONS = [
  { label: "MCP Config", value: "mcp", description: ".vscode/mcp.json" },
  { label: "VS Code Settings", value: "vscode", description: ".vscode/settings.json" }
];
async function generateCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  const picked = await vscode2.window.showQuickPick(
    GENERATE_OPTIONS.map((o) => ({ label: o.label, description: o.description, value: o.value })),
    { placeHolder: "Select config type to generate" }
  );
  if (!picked) return;
  let analysis = getCachedAnalysis();
  const result = await vscode2.window.withProgress(
    {
      location: vscode2.ProgressLocation.Notification,
      title: `Primer: Generating ${picked.label}\u2026`
    },
    async () => {
      try {
        if (!analysis) {
          analysis = await analyzeRepo(workspacePath);
          setCachedAnalysis(analysis);
        }
        return await generateConfigs({
          repoPath: workspacePath,
          analysis,
          selections: [picked.value],
          force: false
        });
      } catch (err) {
        vscode2.window.showErrorMessage(
          `Primer: Config generation failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
        return void 0;
      }
    }
  );
  if (!result) return;
  const wrote = result.files.filter((f) => f.action === "wrote");
  const skipped = result.files.filter((f) => f.action === "skipped");
  if (wrote.length > 0) {
    const openAction = "Open File";
    const msg = `Generated ${wrote.map((f) => f.path).join(", ")}${skipped.length ? ` (${skipped.length} skipped)` : ""}`;
    const action = await vscode2.window.showInformationMessage(`Primer: ${msg}`, openAction);
    if (action === openAction && wrote[0]) {
      const doc = await vscode2.workspace.openTextDocument(wrote[0].path);
      await vscode2.window.showTextDocument(doc);
    }
  } else if (skipped.length > 0) {
    const overwrite = "Overwrite";
    const action = await vscode2.window.showWarningMessage(
      "Primer: All config files already exist.",
      overwrite
    );
    if (action === overwrite) {
      await vscode2.window.withProgress(
        {
          location: vscode2.ProgressLocation.Notification,
          title: `Primer: Overwriting ${picked.label}\u2026`
        },
        async () => {
          const forceResult = await generateConfigs({
            repoPath: workspacePath,
            analysis,
            selections: [picked.value],
            force: true
          });
          const forceWrote = forceResult.files.filter((f) => f.action === "wrote");
          if (forceWrote.length > 0) {
            const doc = await vscode2.workspace.openTextDocument(forceWrote[0].path);
            await vscode2.window.showTextDocument(doc);
          }
        }
      );
    }
  }
}

// src/commands/instructions.ts
var vscode3 = __toESM(require("vscode"));

// src/progress.ts
var VscodeProgressReporter = class {
  constructor(progress) {
    this.progress = progress;
  }
  update(message) {
    this.progress.report({ message });
  }
  succeed(message) {
    this.progress.report({ message: `$(check) ${message}` });
  }
  fail(message) {
    this.progress.report({ message: `$(error) ${message}` });
  }
  done() {}
};

// src/commands/instructions.ts
async function instructionsCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  const model = vscode3.workspace.getConfiguration("primer").get("model");
  let analysis = getCachedAnalysis();
  if (!analysis) {
    await vscode3.window.withProgress(
      {
        location: vscode3.ProgressLocation.Notification,
        title: "Primer: Analyzing repository\u2026"
      },
      async () => {
        analysis = await analyzeRepo(workspacePath);
        setCachedAnalysis(analysis);
      }
    );
  }
  if (!analysis) return;
  let selectedAreas = void 0;
  if (analysis.areas && analysis.areas.length > 0) {
    const picked = await vscode3.window.showQuickPick(
      analysis.areas.map((a) => ({ label: a.name, description: a.description, area: a })),
      { placeHolder: "Select areas for instructions (or Escape for root only)", canPickMany: true }
    );
    if (picked && picked.length > 0) {
      selectedAreas = picked.map((p) => p.area);
    }
  }
  await vscode3.window.withProgress(
    {
      location: vscode3.ProgressLocation.Notification,
      title: "Primer: Generating Copilot instructions\u2026",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);
        reporter.update("Generating root instructions\u2026");
        await generateCopilotInstructions({
          repoPath: workspacePath,
          model,
          onProgress: (msg) => reporter.update(msg)
        });
        if (selectedAreas) {
          for (const area of selectedAreas) {
            reporter.update(`Generating instructions for ${area.name}\u2026`);
            await generateAreaInstructions({
              repoPath: workspacePath,
              area,
              model,
              onProgress: (msg) => reporter.update(msg)
            });
          }
        }
        reporter.succeed("Instructions generated.");
      } catch (err) {
        vscode3.window.showErrorMessage(
          `Primer: Instruction generation failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}

// src/commands/readiness.ts
var vscode7 = __toESM(require("vscode"));

// src/webview.ts
var vscode4 = __toESM(require("vscode"));
var panels = /* @__PURE__ */ new Map();
function createWebviewPanel(id, title, html) {
  const existing = panels.get(id);
  if (existing) {
    existing.webview.html = html;
    existing.reveal();
    return existing;
  }
  const panel = vscode4.window.createWebviewPanel(id, title, vscode4.ViewColumn.One, {
    enableScripts: true,
    localResourceRoots: []
  });
  panel.webview.html = html;
  panel.onDidDispose(() => panels.delete(id));
  panels.set(id, panel);
  return panel;
}

// src/views/AnalysisTreeProvider.ts
var vscode5 = __toESM(require("vscode"));
var AnalysisTreeProvider = class {
  _onDidChangeTreeData = new vscode5.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  refresh() {
    this._onDidChangeTreeData.fire(void 0);
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) return element.children ?? [];
    const analysis = getCachedAnalysis();
    if (!analysis) return [];
    return this.getRootItems(analysis);
  }
  getRootItems(analysis) {
    const items = [];
    if (analysis.languages.length > 0) {
      const langs = new AnalysisItem(
        "Languages",
        vscode5.TreeItemCollapsibleState.Expanded,
        analysis.languages.map((l) => {
          const item = new AnalysisItem(l, vscode5.TreeItemCollapsibleState.None);
          item.contextValue = "language";
          return item;
        })
      );
      langs.iconPath = new vscode5.ThemeIcon("code");
      langs.description = `${analysis.languages.length}`;
      langs.contextValue = "category";
      items.push(langs);
    }
    if (analysis.frameworks.length > 0) {
      const frameworks = new AnalysisItem(
        "Frameworks",
        vscode5.TreeItemCollapsibleState.Expanded,
        analysis.frameworks.map((f) => {
          const item = new AnalysisItem(f, vscode5.TreeItemCollapsibleState.None);
          item.contextValue = "framework";
          return item;
        })
      );
      frameworks.iconPath = new vscode5.ThemeIcon("extensions");
      frameworks.description = `${analysis.frameworks.length}`;
      frameworks.contextValue = "category";
      items.push(frameworks);
    }
    if (analysis.isMonorepo && analysis.areas) {
      const areas = new AnalysisItem(
        "Monorepo",
        vscode5.TreeItemCollapsibleState.Expanded,
        analysis.areas.map((a) => {
          const item = new AnalysisItem(a.name, vscode5.TreeItemCollapsibleState.None);
          item.description = typeof a.applyTo === "string" ? a.applyTo : a.applyTo.join(", ");
          item.iconPath = new vscode5.ThemeIcon("folder");
          item.contextValue = "area";
          const md = new vscode5.MarkdownString();
          md.appendMarkdown(`**${a.name}**`);
          if (a.description)
            md.appendMarkdown(`

${a.description}`);
          md.appendMarkdown(`

Globs: \`${typeof a.applyTo === "string" ? a.applyTo : a.applyTo.join("`, `")}\``);
          item.tooltip = md;
          return item;
        })
      );
      areas.iconPath = new vscode5.ThemeIcon("folder-library");
      areas.description = analysis.workspaceType ?? void 0;
      areas.contextValue = "category";
      items.push(areas);
    }
    if (analysis.packageManager) {
      const pm = new AnalysisItem("Package Manager", vscode5.TreeItemCollapsibleState.None);
      pm.description = analysis.packageManager;
      pm.iconPath = new vscode5.ThemeIcon("package");
      pm.contextValue = "info";
      items.push(pm);
    }
    return items;
  }
};
var AnalysisItem = class extends vscode5.TreeItem {
  constructor(label, collapsibleState, children) {
    super(label, collapsibleState);
    this.children = children;
  }
};

// src/views/ReadinessTreeProvider.ts
var vscode6 = __toESM(require("vscode"));
var ReadinessTreeProvider = class {
  _onDidChangeTreeData = new vscode6.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  report;
  setReport(report) {
    this.report = report;
    this._onDidChangeTreeData.fire(void 0);
  }
  getReport() {
    return this.report;
  }
  refresh() {
    this._onDidChangeTreeData.fire(void 0);
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) return element.children ?? [];
    if (!this.report) return [];
    return this.getRootItems(this.report);
  }
  getRootItems(report) {
    const items = [];
    const levelInfo = report.levels.find((l) => l.level === report.achievedLevel);
    const level = new ReadinessItem(
      levelInfo?.name ?? `Level ${report.achievedLevel}`,
      vscode6.TreeItemCollapsibleState.None
    );
    level.description = `Level ${report.achievedLevel}`;
    level.iconPath = new vscode6.ThemeIcon(
      report.achievedLevel >= 3 ? "pass" : "warning",
      new vscode6.ThemeColor(
        report.achievedLevel >= 3 ? "testing.iconPassed" : "problemsWarningIcon.foreground"
      )
    );
    level.contextValue = "level";
    items.push(level);
    for (const pillar of report.pillars) {
      const criteria = report.criteria.filter((c) => c.pillar === pillar.id);
      items.push(this.createPillarItem(pillar, criteria));
    }
    return items;
  }
  createPillarItem(pillar, criteria) {
    const pct = Math.round(pillar.passRate * 100);
    const item = new ReadinessItem(
      pillar.name,
      criteria.length > 0
        ? vscode6.TreeItemCollapsibleState.Collapsed
        : vscode6.TreeItemCollapsibleState.None,
      criteria.map((c) => {
        const ci = new ReadinessItem(c.title, vscode6.TreeItemCollapsibleState.None);
        ci.iconPath = new vscode6.ThemeIcon(
          c.status === "pass" ? "pass" : c.status === "fail" ? "error" : "circle-outline",
          c.status === "pass"
            ? new vscode6.ThemeColor("testing.iconPassed")
            : c.status === "fail"
              ? new vscode6.ThemeColor("testing.iconFailed")
              : void 0
        );
        ci.description = c.reason;
        ci.contextValue = `criterion.${c.status}`;
        const md = new vscode6.MarkdownString();
        md.appendMarkdown(`**${c.title}**

`);
        if (c.reason)
          md.appendMarkdown(`${c.reason}

`);
        if (c.evidence && c.evidence.length > 0) {
          md.appendMarkdown("**Evidence:**\n");
          for (const e of c.evidence) {
            md.appendMarkdown(`- ${e}
`);
          }
        }
        ci.tooltip = md;
        return ci;
      })
    );
    item.iconPath = new vscode6.ThemeIcon(
      pct === 100 ? "pass" : pct >= 50 ? "warning" : "error",
      pct === 100
        ? new vscode6.ThemeColor("testing.iconPassed")
        : pct >= 50
          ? new vscode6.ThemeColor("problemsWarningIcon.foreground")
          : new vscode6.ThemeColor("testing.iconFailed")
    );
    item.description = `${pillar.passed}/${pillar.total} (${pct}%)`;
    item.contextValue = "pillar";
    return item;
  }
};
var ReadinessItem = class extends vscode6.TreeItem {
  constructor(label, collapsibleState, children) {
    super(label, collapsibleState);
    this.children = children;
  }
};

// src/views/providers.ts
var analysisTreeProvider = new AnalysisTreeProvider();
var readinessTreeProvider = new ReadinessTreeProvider();

// src/commands/readiness.ts
async function readinessCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  await vscode7.window.withProgress(
    {
      location: vscode7.ProgressLocation.Notification,
      title: "Primer: Running readiness assessment\u2026",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);
        let analysis = getCachedAnalysis();
        if (!analysis) {
          reporter.update("Analyzing repository\u2026");
          analysis = await analyzeRepo(workspacePath);
          setCachedAnalysis(analysis);
        }
        reporter.update("Evaluating readiness pillars\u2026");
        const report = await runReadinessReport({ repoPath: workspacePath });
        reporter.update("Generating report\u2026");
        const repoName = vscode7.workspace.workspaceFolders?.[0]?.name ?? "Repository";
        const html = generateVisualReport({
          reports: [{ repo: repoName, report }],
          title: `${repoName} \u2014 AI Readiness`
        });
        createWebviewPanel("primer.readinessReport", "AI Readiness Report", html);
        readinessTreeProvider.setReport(report);
        reporter.succeed(`Readiness: Level ${report.achievedLevel} achieved.`);
      } catch (err) {
        vscode7.window.showErrorMessage(
          `Primer: Readiness assessment failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}

// src/commands/eval.ts
var vscode8 = __toESM(require("vscode"));
var import_node_path2 = __toESM(require("node:path"));
var import_node_fs = __toESM(require("node:fs"));
async function evalCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  const configPath = import_node_path2.default.join(workspacePath, "primer.eval.json");
  if (!import_node_fs.default.existsSync(configPath)) {
    const action = await vscode8.window.showWarningMessage(
      "Primer: No primer.eval.json found. Create one?",
      "Scaffold",
      "Cancel"
    );
    if (action === "Scaffold") {
      await evalInitCommand();
    }
    return;
  }
  const config = vscode8.workspace.getConfiguration("primer");
  const model = config.get("model") ?? "claude-sonnet-4.5";
  await vscode8.window.withProgress(
    {
      location: vscode8.ProgressLocation.Notification,
      title: "Primer: Running eval\u2026",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);
        reporter.update("Running evaluation\u2026");
        const result = await runEval({
          configPath,
          repoPath: workspacePath,
          model,
          judgeModel: model,
          onProgress: (msg) => reporter.update(msg)
        });
        reporter.succeed(`Eval complete. ${result.summary}`);
        if (result.viewerPath && import_node_fs.default.existsSync(result.viewerPath)) {
          const html = import_node_fs.default.readFileSync(result.viewerPath, "utf-8");
          createWebviewPanel("primer.evalResults", "Eval Results", html);
        }
      } catch (err) {
        vscode8.window.showErrorMessage(
          `Primer: Eval failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}
async function evalInitCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  const config = vscode8.workspace.getConfiguration("primer");
  const model = config.get("model");
  await vscode8.window.withProgress(
    {
      location: vscode8.ProgressLocation.Notification,
      title: "Primer: Scaffolding eval config\u2026",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);
        let analysis = getCachedAnalysis();
        if (!analysis) {
          reporter.update("Analyzing repository\u2026");
          analysis = await analyzeRepo(workspacePath);
          setCachedAnalysis(analysis);
        }
        reporter.update("Generating eval cases\u2026");
        const evalConfig = await generateEvalScaffold({
          repoPath: workspacePath,
          count: 5,
          model,
          areas: analysis.areas,
          onProgress: (msg) => reporter.update(msg)
        });
        const outputPath = import_node_path2.default.join(workspacePath, "primer.eval.json");
        await safeWriteFile(outputPath, JSON.stringify(evalConfig, null, 2) + "\n", false);
        reporter.succeed("Eval config scaffolded.");
        const doc = await vscode8.workspace.openTextDocument(outputPath);
        await vscode8.window.showTextDocument(doc);
      } catch (err) {
        vscode8.window.showErrorMessage(
          `Primer: Eval scaffold failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}

// src/commands/init.ts
var vscode9 = __toESM(require("vscode"));
var import_node_path3 = __toESM(require("node:path"));
async function initCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  const config = vscode9.workspace.getConfiguration("primer");
  const model = config.get("model");
  await vscode9.window.withProgress(
    {
      location: vscode9.ProgressLocation.Notification,
      title: "Primer: Initializing repository\u2026",
      cancellable: false
    },
    async (progress) => {
      try {
        const reporter = new VscodeProgressReporter(progress);
        reporter.update("Analyzing repository\u2026");
        const analysis = await analyzeRepo(workspacePath);
        setCachedAnalysis(analysis);
        reporter.update("Generating Copilot instructions\u2026");
        await generateCopilotInstructions({
          repoPath: workspacePath,
          model,
          onProgress: (msg) => reporter.update(msg)
        });
        reporter.update("Generating configs\u2026");
        const result = await generateConfigs({
          repoPath: workspacePath,
          analysis,
          selections: ["mcp", "vscode"],
          force: false
        });
        const wrote = result.files.filter((f) => f.action === "wrote");
        const skipped = result.files.filter((f) => f.action === "skipped");
        const parts = [];
        if (wrote.length) parts.push(`${wrote.length} files generated`);
        if (skipped.length) parts.push(`${skipped.length} skipped (already exist)`);
        reporter.succeed("Repository initialized.");
        const instructionsPath = import_node_path3.default.join(
          workspacePath,
          ".github",
          "copilot-instructions.md"
        );
        try {
          const doc = await vscode9.workspace.openTextDocument(instructionsPath);
          await vscode9.window.showTextDocument(doc);
        } catch {}
        vscode9.window.showInformationMessage(`Primer: ${parts.join(", ") || "Done."}`);
      } catch (err) {
        vscode9.window.showErrorMessage(
          `Primer: Initialization failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}

// src/commands/pr.ts
var vscode11 = __toESM(require("vscode"));

// src/auth.ts
var vscode10 = __toESM(require("vscode"));
async function getGitHubToken() {
  const session = await vscode10.authentication.getSession("github", ["repo"], {
    createIfNone: true
  });
  return session.accessToken;
}

// node_modules/simple-git/dist/esm/index.js
var import_node_buffer2 = require("node:buffer");
var import_file_exists2 = __toESM(require_dist3(), 1);
var import_debug2 = __toESM(require_src3(), 1);
var import_child_process2 = require("child_process");
var import_promise_deferred3 = __toESM(require_dist4(), 1);
var import_node_path4 = require("node:path");
var import_promise_deferred4 = __toESM(require_dist4(), 1);
var import_node_events = require("node:events");
var __defProp3 = Object.defineProperty;
var __getOwnPropDesc3 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames3 = Object.getOwnPropertyNames;
var __hasOwnProp3 = Object.prototype.hasOwnProperty;
var __esm2 = (fn, res) =>
  function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames3(fn)[0]])((fn = 0))), res);
  };
var __commonJS3 = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[__getOwnPropNames3(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export3 = (target, all) => {
  for (var name in all) __defProp3(target, name, { get: all[name], enumerable: true });
};
var __copyProps3 = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames3(from))
      if (!__hasOwnProp3.call(to, key) && key !== except)
        __defProp3(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc3(from, key)) || desc.enumerable
        });
  }
  return to;
};
var __toCommonJS3 = (mod) => __copyProps3(__defProp3({}, "__esModule", { value: true }), mod);
function pathspec2(...paths) {
  const key = new String(paths);
  cache2.set(key, paths);
  return key;
}
function isPathSpec2(path11) {
  return path11 instanceof String && cache2.has(path11);
}
function toPaths(pathSpec) {
  return cache2.get(pathSpec) || [];
}
var cache2;
var init_pathspec2 = __esm2({
  "src/lib/args/pathspec.ts"() {
    "use strict";
    cache2 = /* @__PURE__ */ new WeakMap();
  }
});
var GitError2;
var init_git_error2 = __esm2({
  "src/lib/errors/git-error.ts"() {
    "use strict";
    GitError2 = class extends Error {
      constructor(task, message) {
        super(message);
        this.task = task;
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
  }
});
var GitResponseError2;
var init_git_response_error2 = __esm2({
  "src/lib/errors/git-response-error.ts"() {
    "use strict";
    init_git_error2();
    GitResponseError2 = class extends GitError2 {
      constructor(git, message) {
        super(void 0, message || String(git));
        this.git = git;
      }
    };
  }
});
var TaskConfigurationError2;
var init_task_configuration_error2 = __esm2({
  "src/lib/errors/task-configuration-error.ts"() {
    "use strict";
    init_git_error2();
    TaskConfigurationError2 = class extends GitError2 {
      constructor(message) {
        super(void 0, message);
      }
    };
  }
});
function asFunction2(source) {
  if (typeof source !== "function") {
    return NOOP2;
  }
  return source;
}
function isUserFunction2(source) {
  return typeof source === "function" && source !== NOOP2;
}
function splitOn2(input, char) {
  const index = input.indexOf(char);
  if (index <= 0) {
    return [input, ""];
  }
  return [input.substr(0, index), input.substr(index + 1)];
}
function first2(input, offset = 0) {
  return isArrayLike2(input) && input.length > offset ? input[offset] : void 0;
}
function last2(input, offset = 0) {
  if (isArrayLike2(input) && input.length > offset) {
    return input[input.length - 1 - offset];
  }
}
function isArrayLike2(input) {
  return filterHasLength2(input);
}
function toLinesWithContent2(input = "", trimmed22 = true, separator = "\n") {
  return input.split(separator).reduce((output, line) => {
    const lineContent = trimmed22 ? line.trim() : line;
    if (lineContent) {
      output.push(lineContent);
    }
    return output;
  }, []);
}
function forEachLineWithContent2(input, callback) {
  return toLinesWithContent2(input, true).map((line) => callback(line));
}
function folderExists2(path11) {
  return (0, import_file_exists2.exists)(path11, import_file_exists2.FOLDER);
}
function append2(target, item) {
  if (Array.isArray(target)) {
    if (!target.includes(item)) {
      target.push(item);
    }
  } else {
    target.add(item);
  }
  return item;
}
function including2(target, item) {
  if (Array.isArray(target) && !target.includes(item)) {
    target.push(item);
  }
  return target;
}
function remove2(target, item) {
  if (Array.isArray(target)) {
    const index = target.indexOf(item);
    if (index >= 0) {
      target.splice(index, 1);
    }
  } else {
    target.delete(item);
  }
  return item;
}
function asArray2(source) {
  return Array.isArray(source) ? source : [source];
}
function asCamelCase2(str) {
  return str.replace(/[\s-]+(.)/g, (_all, chr) => {
    return chr.toUpperCase();
  });
}
function asStringArray2(source) {
  return asArray2(source).map((item) => {
    return item instanceof String ? item : String(item);
  });
}
function asNumber2(source, onNaN = 0) {
  if (source == null) {
    return onNaN;
  }
  const num = parseInt(source, 10);
  return Number.isNaN(num) ? onNaN : num;
}
function prefixedArray2(input, prefix) {
  const output = [];
  for (let i = 0, max = input.length; i < max; i++) {
    output.push(prefix, input[i]);
  }
  return output;
}
function bufferToString2(input) {
  return (Array.isArray(input) ? import_node_buffer2.Buffer.concat(input) : input).toString(
    "utf-8"
  );
}
function pick2(source, properties) {
  const out = {};
  properties.forEach((key) => {
    if (source[key] !== void 0) {
      out[key] = source[key];
    }
  });
  return out;
}
function delay2(duration = 0) {
  return new Promise((done) => setTimeout(done, duration));
}
function orVoid2(input) {
  if (input === false) {
    return void 0;
  }
  return input;
}
var NULL2;
var NOOP2;
var objectToString2;
var init_util2 = __esm2({
  "src/lib/utils/util.ts"() {
    "use strict";
    init_argument_filters2();
    NULL2 = "\0";
    NOOP2 = () => {};
    objectToString2 = Object.prototype.toString.call.bind(Object.prototype.toString);
  }
});
function filterType2(input, filter, def) {
  if (filter(input)) {
    return input;
  }
  return arguments.length > 2 ? def : void 0;
}
function filterPrimitives2(input, omit2) {
  const type = isPathSpec2(input) ? "string" : typeof input;
  return /number|string|boolean/.test(type) && (!omit2 || !omit2.includes(type));
}
function filterPlainObject2(input) {
  return !!input && objectToString2(input) === "[object Object]";
}
function filterFunction2(input) {
  return typeof input === "function";
}
var filterArray2;
var filterNumber2;
var filterString2;
var filterStringOrStringArray2;
var filterHasLength2;
var init_argument_filters2 = __esm2({
  "src/lib/utils/argument-filters.ts"() {
    "use strict";
    init_pathspec2();
    init_util2();
    filterArray2 = (input) => {
      return Array.isArray(input);
    };
    filterNumber2 = (input) => {
      return typeof input === "number";
    };
    filterString2 = (input) => {
      return typeof input === "string";
    };
    filterStringOrStringArray2 = (input) => {
      return filterString2(input) || (Array.isArray(input) && input.every(filterString2));
    };
    filterHasLength2 = (input) => {
      if (input == null || "number|boolean|function".includes(typeof input)) {
        return false;
      }
      return typeof input.length === "number";
    };
  }
});
var ExitCodes2;
var init_exit_codes2 = __esm2({
  "src/lib/utils/exit-codes.ts"() {
    "use strict";
    ExitCodes2 = /* @__PURE__ */ ((ExitCodes22) => {
      ExitCodes22[(ExitCodes22["SUCCESS"] = 0)] = "SUCCESS";
      ExitCodes22[(ExitCodes22["ERROR"] = 1)] = "ERROR";
      ExitCodes22[(ExitCodes22["NOT_FOUND"] = -2)] = "NOT_FOUND";
      ExitCodes22[(ExitCodes22["UNCLEAN"] = 128)] = "UNCLEAN";
      return ExitCodes22;
    })(ExitCodes2 || {});
  }
});
var GitOutputStreams2;
var init_git_output_streams2 = __esm2({
  "src/lib/utils/git-output-streams.ts"() {
    "use strict";
    GitOutputStreams2 = class _GitOutputStreams {
      constructor(stdOut, stdErr) {
        this.stdOut = stdOut;
        this.stdErr = stdErr;
      }
      asStrings() {
        return new _GitOutputStreams(this.stdOut.toString("utf8"), this.stdErr.toString("utf8"));
      }
    };
  }
});
function useMatchesDefault2() {
  throw new Error(`LineParser:useMatches not implemented`);
}
var LineParser2;
var RemoteLineParser2;
var init_line_parser2 = __esm2({
  "src/lib/utils/line-parser.ts"() {
    "use strict";
    LineParser2 = class {
      constructor(regExp, useMatches) {
        this.matches = [];
        this.useMatches = useMatchesDefault2;
        this.parse = (line, target) => {
          this.resetMatches();
          if (!this._regExp.every((reg, index) => this.addMatch(reg, index, line(index)))) {
            return false;
          }
          return this.useMatches(target, this.prepareMatches()) !== false;
        };
        this._regExp = Array.isArray(regExp) ? regExp : [regExp];
        if (useMatches) {
          this.useMatches = useMatches;
        }
      }
      resetMatches() {
        this.matches.length = 0;
      }
      prepareMatches() {
        return this.matches;
      }
      addMatch(reg, index, line) {
        const matched = line && reg.exec(line);
        if (matched) {
          this.pushMatch(index, matched);
        }
        return !!matched;
      }
      pushMatch(_index, matched) {
        this.matches.push(...matched.slice(1));
      }
    };
    RemoteLineParser2 = class extends LineParser2 {
      addMatch(reg, index, line) {
        return /^remote:\s/.test(String(line)) && super.addMatch(reg, index, line);
      }
      pushMatch(index, matched) {
        if (index > 0 || matched.length > 1) {
          super.pushMatch(index, matched);
        }
      }
    };
  }
});
function createInstanceConfig2(...options) {
  const baseDir = process.cwd();
  const config = Object.assign(
    { baseDir, ...defaultOptions2 },
    ...options.filter((o) => typeof o === "object" && o)
  );
  config.baseDir = config.baseDir || baseDir;
  config.trimmed = config.trimmed === true;
  return config;
}
var defaultOptions2;
var init_simple_git_options2 = __esm2({
  "src/lib/utils/simple-git-options.ts"() {
    "use strict";
    defaultOptions2 = {
      binary: "git",
      maxConcurrentProcesses: 5,
      config: [],
      trimmed: false
    };
  }
});
function appendTaskOptions2(options, commands3 = []) {
  if (!filterPlainObject2(options)) {
    return commands3;
  }
  return Object.keys(options).reduce((commands22, key) => {
    const value = options[key];
    if (isPathSpec2(value)) {
      commands22.push(value);
    } else if (filterPrimitives2(value, ["boolean"])) {
      commands22.push(key + "=" + value);
    } else if (Array.isArray(value)) {
      for (const v of value) {
        if (!filterPrimitives2(v, ["string", "number"])) {
          commands22.push(key + "=" + v);
        }
      }
    } else {
      commands22.push(key);
    }
    return commands22;
  }, commands3);
}
function getTrailingOptions2(args, initialPrimitive = 0, objectOnly = false) {
  const command = [];
  for (let i = 0, max = initialPrimitive < 0 ? args.length : initialPrimitive; i < max; i++) {
    if ("string|number".includes(typeof args[i])) {
      command.push(String(args[i]));
    }
  }
  appendTaskOptions2(trailingOptionsArgument2(args), command);
  if (!objectOnly) {
    command.push(...trailingArrayArgument2(args));
  }
  return command;
}
function trailingArrayArgument2(args) {
  const hasTrailingCallback = typeof last2(args) === "function";
  return asStringArray2(filterType2(last2(args, hasTrailingCallback ? 1 : 0), filterArray2, []));
}
function trailingOptionsArgument2(args) {
  const hasTrailingCallback = filterFunction2(last2(args));
  return filterType2(last2(args, hasTrailingCallback ? 1 : 0), filterPlainObject2);
}
function trailingFunctionArgument2(args, includeNoop = true) {
  const callback = asFunction2(last2(args));
  return includeNoop || isUserFunction2(callback) ? callback : void 0;
}
var init_task_options2 = __esm2({
  "src/lib/utils/task-options.ts"() {
    "use strict";
    init_argument_filters2();
    init_util2();
    init_pathspec2();
  }
});
function callTaskParser2(parser42, streams) {
  return parser42(streams.stdOut, streams.stdErr);
}
function parseStringResponse2(result, parsers122, texts, trim = true) {
  asArray2(texts).forEach((text) => {
    for (let lines = toLinesWithContent2(text, trim), i = 0, max = lines.length; i < max; i++) {
      const line = (offset = 0) => {
        if (i + offset >= max) {
          return;
        }
        return lines[i + offset];
      };
      parsers122.some(({ parse: parse2 }) => parse2(line, result));
    }
  });
  return result;
}
var init_task_parser2 = __esm2({
  "src/lib/utils/task-parser.ts"() {
    "use strict";
    init_util2();
  }
});
var utils_exports2 = {};
__export3(utils_exports2, {
  ExitCodes: () => ExitCodes2,
  GitOutputStreams: () => GitOutputStreams2,
  LineParser: () => LineParser2,
  NOOP: () => NOOP2,
  NULL: () => NULL2,
  RemoteLineParser: () => RemoteLineParser2,
  append: () => append2,
  appendTaskOptions: () => appendTaskOptions2,
  asArray: () => asArray2,
  asCamelCase: () => asCamelCase2,
  asFunction: () => asFunction2,
  asNumber: () => asNumber2,
  asStringArray: () => asStringArray2,
  bufferToString: () => bufferToString2,
  callTaskParser: () => callTaskParser2,
  createInstanceConfig: () => createInstanceConfig2,
  delay: () => delay2,
  filterArray: () => filterArray2,
  filterFunction: () => filterFunction2,
  filterHasLength: () => filterHasLength2,
  filterNumber: () => filterNumber2,
  filterPlainObject: () => filterPlainObject2,
  filterPrimitives: () => filterPrimitives2,
  filterString: () => filterString2,
  filterStringOrStringArray: () => filterStringOrStringArray2,
  filterType: () => filterType2,
  first: () => first2,
  folderExists: () => folderExists2,
  forEachLineWithContent: () => forEachLineWithContent2,
  getTrailingOptions: () => getTrailingOptions2,
  including: () => including2,
  isUserFunction: () => isUserFunction2,
  last: () => last2,
  objectToString: () => objectToString2,
  orVoid: () => orVoid2,
  parseStringResponse: () => parseStringResponse2,
  pick: () => pick2,
  prefixedArray: () => prefixedArray2,
  remove: () => remove2,
  splitOn: () => splitOn2,
  toLinesWithContent: () => toLinesWithContent2,
  trailingFunctionArgument: () => trailingFunctionArgument2,
  trailingOptionsArgument: () => trailingOptionsArgument2
});
var init_utils2 = __esm2({
  "src/lib/utils/index.ts"() {
    "use strict";
    init_argument_filters2();
    init_exit_codes2();
    init_git_output_streams2();
    init_line_parser2();
    init_simple_git_options2();
    init_task_options2();
    init_task_parser2();
    init_util2();
  }
});
var check_is_repo_exports2 = {};
__export3(check_is_repo_exports2, {
  CheckRepoActions: () => CheckRepoActions2,
  checkIsBareRepoTask: () => checkIsBareRepoTask2,
  checkIsRepoRootTask: () => checkIsRepoRootTask2,
  checkIsRepoTask: () => checkIsRepoTask2
});
function checkIsRepoTask2(action) {
  switch (action) {
    case "bare":
      return checkIsBareRepoTask2();
    case "root":
      return checkIsRepoRootTask2();
  }
  const commands3 = ["rev-parse", "--is-inside-work-tree"];
  return {
    commands: commands3,
    format: "utf-8",
    onError: onError2,
    parser: parser4
  };
}
function checkIsRepoRootTask2() {
  const commands3 = ["rev-parse", "--git-dir"];
  return {
    commands: commands3,
    format: "utf-8",
    onError: onError2,
    parser(path11) {
      return /^\.(git)?$/.test(path11.trim());
    }
  };
}
function checkIsBareRepoTask2() {
  const commands3 = ["rev-parse", "--is-bare-repository"];
  return {
    commands: commands3,
    format: "utf-8",
    onError: onError2,
    parser: parser4
  };
}
function isNotRepoMessage2(error) {
  return /(Not a git repository|Kein Git-Repository)/i.test(String(error));
}
var CheckRepoActions2;
var onError2;
var parser4;
var init_check_is_repo2 = __esm2({
  "src/lib/tasks/check-is-repo.ts"() {
    "use strict";
    init_utils2();
    CheckRepoActions2 = /* @__PURE__ */ ((CheckRepoActions22) => {
      CheckRepoActions22["BARE"] = "bare";
      CheckRepoActions22["IN_TREE"] = "tree";
      CheckRepoActions22["IS_REPO_ROOT"] = "root";
      return CheckRepoActions22;
    })(CheckRepoActions2 || {});
    onError2 = ({ exitCode }, error, done, fail) => {
      if (exitCode === 128 && isNotRepoMessage2(error)) {
        return done(Buffer.from("false"));
      }
      fail(error);
    };
    parser4 = (text) => {
      return text.trim() === "true";
    };
  }
});
function cleanSummaryParser2(dryRun, text) {
  const summary = new CleanResponse2(dryRun);
  const regexp = dryRun ? dryRunRemovalRegexp2 : removalRegexp2;
  toLinesWithContent2(text).forEach((line) => {
    const removed = line.replace(regexp, "");
    summary.paths.push(removed);
    (isFolderRegexp2.test(removed) ? summary.folders : summary.files).push(removed);
  });
  return summary;
}
var CleanResponse2;
var removalRegexp2;
var dryRunRemovalRegexp2;
var isFolderRegexp2;
var init_CleanSummary2 = __esm2({
  "src/lib/responses/CleanSummary.ts"() {
    "use strict";
    init_utils2();
    CleanResponse2 = class {
      constructor(dryRun) {
        this.dryRun = dryRun;
        this.paths = [];
        this.files = [];
        this.folders = [];
      }
    };
    removalRegexp2 = /^[a-z]+\s*/i;
    dryRunRemovalRegexp2 = /^[a-z]+\s+[a-z]+\s*/i;
    isFolderRegexp2 = /\/$/;
  }
});
var task_exports2 = {};
__export3(task_exports2, {
  EMPTY_COMMANDS: () => EMPTY_COMMANDS2,
  adhocExecTask: () => adhocExecTask2,
  configurationErrorTask: () => configurationErrorTask2,
  isBufferTask: () => isBufferTask2,
  isEmptyTask: () => isEmptyTask2,
  straightThroughBufferTask: () => straightThroughBufferTask2,
  straightThroughStringTask: () => straightThroughStringTask2
});
function adhocExecTask2(parser42) {
  return {
    commands: EMPTY_COMMANDS2,
    format: "empty",
    parser: parser42
  };
}
function configurationErrorTask2(error) {
  return {
    commands: EMPTY_COMMANDS2,
    format: "empty",
    parser() {
      throw typeof error === "string" ? new TaskConfigurationError2(error) : error;
    }
  };
}
function straightThroughStringTask2(commands3, trimmed22 = false) {
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return trimmed22 ? String(text).trim() : text;
    }
  };
}
function straightThroughBufferTask2(commands3) {
  return {
    commands: commands3,
    format: "buffer",
    parser(buffer) {
      return buffer;
    }
  };
}
function isBufferTask2(task) {
  return task.format === "buffer";
}
function isEmptyTask2(task) {
  return task.format === "empty" || !task.commands.length;
}
var EMPTY_COMMANDS2;
var init_task2 = __esm2({
  "src/lib/tasks/task.ts"() {
    "use strict";
    init_task_configuration_error2();
    EMPTY_COMMANDS2 = [];
  }
});
var clean_exports2 = {};
__export3(clean_exports2, {
  CONFIG_ERROR_INTERACTIVE_MODE: () => CONFIG_ERROR_INTERACTIVE_MODE2,
  CONFIG_ERROR_MODE_REQUIRED: () => CONFIG_ERROR_MODE_REQUIRED2,
  CONFIG_ERROR_UNKNOWN_OPTION: () => CONFIG_ERROR_UNKNOWN_OPTION2,
  CleanOptions: () => CleanOptions2,
  cleanTask: () => cleanTask2,
  cleanWithOptionsTask: () => cleanWithOptionsTask2,
  isCleanOptionsArray: () => isCleanOptionsArray2
});
function cleanWithOptionsTask2(mode, customArgs) {
  const { cleanMode, options, valid } = getCleanOptions2(mode);
  if (!cleanMode) {
    return configurationErrorTask2(CONFIG_ERROR_MODE_REQUIRED2);
  }
  if (!valid.options) {
    return configurationErrorTask2(CONFIG_ERROR_UNKNOWN_OPTION2 + JSON.stringify(mode));
  }
  options.push(...customArgs);
  if (options.some(isInteractiveMode2)) {
    return configurationErrorTask2(CONFIG_ERROR_INTERACTIVE_MODE2);
  }
  return cleanTask2(cleanMode, options);
}
function cleanTask2(mode, customArgs) {
  const commands3 = ["clean", `-${mode}`, ...customArgs];
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return cleanSummaryParser2(mode === "n", text);
    }
  };
}
function isCleanOptionsArray2(input) {
  return Array.isArray(input) && input.every((test) => CleanOptionValues2.has(test));
}
function getCleanOptions2(input) {
  let cleanMode;
  let options = [];
  let valid = { cleanMode: false, options: true };
  input
    .replace(/[^a-z]i/g, "")
    .split("")
    .forEach((char) => {
      if (isCleanMode2(char)) {
        cleanMode = char;
        valid.cleanMode = true;
      } else {
        valid.options = valid.options && isKnownOption2((options[options.length] = `-${char}`));
      }
    });
  return {
    cleanMode,
    options,
    valid
  };
}
function isCleanMode2(cleanMode) {
  return cleanMode === "f" || cleanMode === "n";
}
function isKnownOption2(option) {
  return /^-[a-z]$/i.test(option) && CleanOptionValues2.has(option.charAt(1));
}
function isInteractiveMode2(option) {
  if (/^-[^\-]/.test(option)) {
    return option.indexOf("i") > 0;
  }
  return option === "--interactive";
}
var CONFIG_ERROR_INTERACTIVE_MODE2;
var CONFIG_ERROR_MODE_REQUIRED2;
var CONFIG_ERROR_UNKNOWN_OPTION2;
var CleanOptions2;
var CleanOptionValues2;
var init_clean2 = __esm2({
  "src/lib/tasks/clean.ts"() {
    "use strict";
    init_CleanSummary2();
    init_utils2();
    init_task2();
    CONFIG_ERROR_INTERACTIVE_MODE2 = "Git clean interactive mode is not supported";
    CONFIG_ERROR_MODE_REQUIRED2 = 'Git clean mode parameter ("n" or "f") is required';
    CONFIG_ERROR_UNKNOWN_OPTION2 = "Git clean unknown option found in: ";
    CleanOptions2 = /* @__PURE__ */ ((CleanOptions22) => {
      CleanOptions22["DRY_RUN"] = "n";
      CleanOptions22["FORCE"] = "f";
      CleanOptions22["IGNORED_INCLUDED"] = "x";
      CleanOptions22["IGNORED_ONLY"] = "X";
      CleanOptions22["EXCLUDING"] = "e";
      CleanOptions22["QUIET"] = "q";
      CleanOptions22["RECURSIVE"] = "d";
      return CleanOptions22;
    })(CleanOptions2 || {});
    CleanOptionValues2 = /* @__PURE__ */ new Set([
      "i",
      ...asStringArray2(Object.values(CleanOptions2))
    ]);
  }
});
function configListParser2(text) {
  const config = new ConfigList2();
  for (const item of configParser2(text)) {
    config.addValue(item.file, String(item.key), item.value);
  }
  return config;
}
function configGetParser2(text, key) {
  let value = null;
  const values = [];
  const scopes = /* @__PURE__ */ new Map();
  for (const item of configParser2(text, key)) {
    if (item.key !== key) {
      continue;
    }
    values.push((value = item.value));
    if (!scopes.has(item.file)) {
      scopes.set(item.file, []);
    }
    scopes.get(item.file).push(value);
  }
  return {
    key,
    paths: Array.from(scopes.keys()),
    scopes,
    value,
    values
  };
}
function configFilePath2(filePath) {
  return filePath.replace(/^(file):/, "");
}
function* configParser2(text, requestedKey = null) {
  const lines = text.split("\0");
  for (let i = 0, max = lines.length - 1; i < max; ) {
    const file = configFilePath2(lines[i++]);
    let value = lines[i++];
    let key = requestedKey;
    if (value.includes("\n")) {
      const line = splitOn2(value, "\n");
      key = line[0];
      value = line[1];
    }
    yield { file, key, value };
  }
}
var ConfigList2;
var init_ConfigList2 = __esm2({
  "src/lib/responses/ConfigList.ts"() {
    "use strict";
    init_utils2();
    ConfigList2 = class {
      constructor() {
        this.files = [];
        this.values = /* @__PURE__ */ Object.create(null);
      }
      get all() {
        if (!this._all) {
          this._all = this.files.reduce((all, file) => {
            return Object.assign(all, this.values[file]);
          }, {});
        }
        return this._all;
      }
      addFile(file) {
        if (!(file in this.values)) {
          const latest = last2(this.files);
          this.values[file] = latest ? Object.create(this.values[latest]) : {};
          this.files.push(file);
        }
        return this.values[file];
      }
      addValue(file, key, value) {
        const values = this.addFile(file);
        if (!Object.hasOwn(values, key)) {
          values[key] = value;
        } else if (Array.isArray(values[key])) {
          values[key].push(value);
        } else {
          values[key] = [values[key], value];
        }
        this._all = void 0;
      }
    };
  }
});
function asConfigScope2(scope, fallback) {
  if (typeof scope === "string" && Object.hasOwn(GitConfigScope2, scope)) {
    return scope;
  }
  return fallback;
}
function addConfigTask2(key, value, append22, scope) {
  const commands3 = ["config", `--${scope}`];
  if (append22) {
    commands3.push("--add");
  }
  commands3.push(key, value);
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return text;
    }
  };
}
function getConfigTask2(key, scope) {
  const commands3 = ["config", "--null", "--show-origin", "--get-all", key];
  if (scope) {
    commands3.splice(1, 0, `--${scope}`);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return configGetParser2(text, key);
    }
  };
}
function listConfigTask2(scope) {
  const commands3 = ["config", "--list", "--show-origin", "--null"];
  if (scope) {
    commands3.push(`--${scope}`);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return configListParser2(text);
    }
  };
}
function config_default2() {
  return {
    addConfig(key, value, ...rest) {
      return this._runTask(
        addConfigTask2(
          key,
          value,
          rest[0] === true,
          asConfigScope2(
            rest[1],
            "local"
            /* local */
          )
        ),
        trailingFunctionArgument2(arguments)
      );
    },
    getConfig(key, scope) {
      return this._runTask(
        getConfigTask2(key, asConfigScope2(scope, void 0)),
        trailingFunctionArgument2(arguments)
      );
    },
    listConfig(...rest) {
      return this._runTask(
        listConfigTask2(asConfigScope2(rest[0], void 0)),
        trailingFunctionArgument2(arguments)
      );
    }
  };
}
var GitConfigScope2;
var init_config2 = __esm2({
  "src/lib/tasks/config.ts"() {
    "use strict";
    init_ConfigList2();
    init_utils2();
    GitConfigScope2 = /* @__PURE__ */ ((GitConfigScope22) => {
      GitConfigScope22["system"] = "system";
      GitConfigScope22["global"] = "global";
      GitConfigScope22["local"] = "local";
      GitConfigScope22["worktree"] = "worktree";
      return GitConfigScope22;
    })(GitConfigScope2 || {});
  }
});
function isDiffNameStatus2(input) {
  return diffNameStatus2.has(input);
}
var DiffNameStatus2;
var diffNameStatus2;
var init_diff_name_status2 = __esm2({
  "src/lib/tasks/diff-name-status.ts"() {
    "use strict";
    DiffNameStatus2 = /* @__PURE__ */ ((DiffNameStatus22) => {
      DiffNameStatus22["ADDED"] = "A";
      DiffNameStatus22["COPIED"] = "C";
      DiffNameStatus22["DELETED"] = "D";
      DiffNameStatus22["MODIFIED"] = "M";
      DiffNameStatus22["RENAMED"] = "R";
      DiffNameStatus22["CHANGED"] = "T";
      DiffNameStatus22["UNMERGED"] = "U";
      DiffNameStatus22["UNKNOWN"] = "X";
      DiffNameStatus22["BROKEN"] = "B";
      return DiffNameStatus22;
    })(DiffNameStatus2 || {});
    diffNameStatus2 = new Set(Object.values(DiffNameStatus2));
  }
});
function grepQueryBuilder2(...params) {
  return new GrepQuery2().param(...params);
}
function parseGrep2(grep) {
  const paths = /* @__PURE__ */ new Set();
  const results = {};
  forEachLineWithContent2(grep, (input) => {
    const [path11, line, preview] = input.split(NULL2);
    paths.add(path11);
    (results[path11] = results[path11] || []).push({
      line: asNumber2(line),
      path: path11,
      preview
    });
  });
  return {
    paths,
    results
  };
}
function grep_default2() {
  return {
    grep(searchTerm) {
      const then = trailingFunctionArgument2(arguments);
      const options = getTrailingOptions2(arguments);
      for (const option of disallowedOptions2) {
        if (options.includes(option)) {
          return this._runTask(
            configurationErrorTask2(`git.grep: use of "${option}" is not supported.`),
            then
          );
        }
      }
      if (typeof searchTerm === "string") {
        searchTerm = grepQueryBuilder2().param(searchTerm);
      }
      const commands3 = ["grep", "--null", "-n", "--full-name", ...options, ...searchTerm];
      return this._runTask(
        {
          commands: commands3,
          format: "utf-8",
          parser(stdOut) {
            return parseGrep2(stdOut);
          }
        },
        then
      );
    }
  };
}
var disallowedOptions2;
var Query2;
var _a2;
var GrepQuery2;
var init_grep2 = __esm2({
  "src/lib/tasks/grep.ts"() {
    "use strict";
    init_utils2();
    init_task2();
    disallowedOptions2 = ["-h"];
    Query2 = Symbol("grepQuery");
    GrepQuery2 = class {
      constructor() {
        this[_a2] = [];
      }
      *[((_a2 = Query2), Symbol.iterator)]() {
        for (const query of this[Query2]) {
          yield query;
        }
      }
      and(...and) {
        and.length && this[Query2].push("--and", "(", ...prefixedArray2(and, "-e"), ")");
        return this;
      }
      param(...param) {
        this[Query2].push(...prefixedArray2(param, "-e"));
        return this;
      }
    };
  }
});
var reset_exports2 = {};
__export3(reset_exports2, {
  ResetMode: () => ResetMode2,
  getResetMode: () => getResetMode2,
  resetTask: () => resetTask2
});
function resetTask2(mode, customArgs) {
  const commands3 = ["reset"];
  if (isValidResetMode2(mode)) {
    commands3.push(`--${mode}`);
  }
  commands3.push(...customArgs);
  return straightThroughStringTask2(commands3);
}
function getResetMode2(mode) {
  if (isValidResetMode2(mode)) {
    return mode;
  }
  switch (typeof mode) {
    case "string":
    case "undefined":
      return "soft";
  }
  return;
}
function isValidResetMode2(mode) {
  return typeof mode === "string" && validResetModes2.includes(mode);
}
var ResetMode2;
var validResetModes2;
var init_reset2 = __esm2({
  "src/lib/tasks/reset.ts"() {
    "use strict";
    init_utils2();
    init_task2();
    ResetMode2 = /* @__PURE__ */ ((ResetMode22) => {
      ResetMode22["MIXED"] = "mixed";
      ResetMode22["SOFT"] = "soft";
      ResetMode22["HARD"] = "hard";
      ResetMode22["MERGE"] = "merge";
      ResetMode22["KEEP"] = "keep";
      return ResetMode22;
    })(ResetMode2 || {});
    validResetModes2 = asStringArray2(Object.values(ResetMode2));
  }
});
function createLog2() {
  return (0, import_debug2.default)("simple-git");
}
function prefixedLogger2(to, prefix, forward) {
  if (!prefix || !String(prefix).replace(/\s*/, "")) {
    return !forward
      ? to
      : (message, ...args) => {
          to(message, ...args);
          forward(message, ...args);
        };
  }
  return (message, ...args) => {
    to(`%s ${message}`, prefix, ...args);
    if (forward) {
      forward(message, ...args);
    }
  };
}
function childLoggerName2(name, childDebugger, { namespace: parentNamespace }) {
  if (typeof name === "string") {
    return name;
  }
  const childNamespace = (childDebugger && childDebugger.namespace) || "";
  if (childNamespace.startsWith(parentNamespace)) {
    return childNamespace.substr(parentNamespace.length + 1);
  }
  return childNamespace || parentNamespace;
}
function createLogger3(label, verbose, initialStep, infoDebugger = createLog2()) {
  const labelPrefix = (label && `[${label}]`) || "";
  const spawned = [];
  const debugDebugger = typeof verbose === "string" ? infoDebugger.extend(verbose) : verbose;
  const key = childLoggerName2(filterType2(verbose, filterString2), debugDebugger, infoDebugger);
  return step(initialStep);
  function sibling(name, initial) {
    return append2(
      spawned,
      createLogger3(label, key.replace(/^[^:]+/, name), initial, infoDebugger)
    );
  }
  function step(phase) {
    const stepPrefix = (phase && `[${phase}]`) || "";
    const debug22 = (debugDebugger && prefixedLogger2(debugDebugger, stepPrefix)) || NOOP2;
    const info = prefixedLogger2(infoDebugger, `${labelPrefix} ${stepPrefix}`, debug22);
    return Object.assign(debugDebugger ? debug22 : info, {
      label,
      sibling,
      info,
      step
    });
  }
}
var init_git_logger2 = __esm2({
  "src/lib/git-logger.ts"() {
    "use strict";
    init_utils2();
    import_debug2.default.formatters.L = (value) =>
      String(filterHasLength2(value) ? value.length : "-");
    import_debug2.default.formatters.B = (value) => {
      if (Buffer.isBuffer(value)) {
        return value.toString("utf8");
      }
      return objectToString2(value);
    };
  }
});
var TasksPendingQueue2;
var init_tasks_pending_queue2 = __esm2({
  "src/lib/runners/tasks-pending-queue.ts"() {
    "use strict";
    init_git_error2();
    init_git_logger2();
    TasksPendingQueue2 = class _TasksPendingQueue {
      constructor(logLabel = "GitExecutor") {
        this.logLabel = logLabel;
        this._queue = /* @__PURE__ */ new Map();
      }
      withProgress(task) {
        return this._queue.get(task);
      }
      createProgress(task) {
        const name = _TasksPendingQueue.getName(task.commands[0]);
        const logger = createLogger3(this.logLabel, name);
        return {
          task,
          logger,
          name
        };
      }
      push(task) {
        const progress = this.createProgress(task);
        progress.logger("Adding task to the queue, commands = %o", task.commands);
        this._queue.set(task, progress);
        return progress;
      }
      fatal(err) {
        for (const [task, { logger }] of Array.from(this._queue.entries())) {
          if (task === err.task) {
            logger.info(`Failed %o`, err);
            logger(
              `Fatal exception, any as-yet un-started tasks run through this executor will not be attempted`
            );
          } else {
            logger.info(
              `A fatal exception occurred in a previous task, the queue has been purged: %o`,
              err.message
            );
          }
          this.complete(task);
        }
        if (this._queue.size !== 0) {
          throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
        }
      }
      complete(task) {
        const progress = this.withProgress(task);
        if (progress) {
          this._queue.delete(task);
        }
      }
      attempt(task) {
        const progress = this.withProgress(task);
        if (!progress) {
          throw new GitError2(void 0, "TasksPendingQueue: attempt called for an unknown task");
        }
        progress.logger("Starting task");
        return progress;
      }
      static getName(name = "empty") {
        return `task:${name}:${++_TasksPendingQueue.counter}`;
      }
      static {
        this.counter = 0;
      }
    };
  }
});
function pluginContext2(task, commands3) {
  return {
    method: first2(task.commands) || "",
    commands: commands3
  };
}
function onErrorReceived2(target, logger) {
  return (err) => {
    logger(`[ERROR] child process exception %o`, err);
    target.push(Buffer.from(String(err.stack), "ascii"));
  };
}
function onDataReceived2(target, name, logger, output) {
  return (buffer) => {
    logger(`%s received %L bytes`, name, buffer);
    output(`%B`, buffer);
    target.push(buffer);
  };
}
var GitExecutorChain2;
var init_git_executor_chain2 = __esm2({
  "src/lib/runners/git-executor-chain.ts"() {
    "use strict";
    init_git_error2();
    init_task2();
    init_utils2();
    init_tasks_pending_queue2();
    GitExecutorChain2 = class {
      constructor(_executor, _scheduler, _plugins) {
        this._executor = _executor;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = Promise.resolve();
        this._queue = new TasksPendingQueue2();
      }
      get cwd() {
        return this._cwd || this._executor.cwd;
      }
      set cwd(cwd) {
        this._cwd = cwd;
      }
      get env() {
        return this._executor.env;
      }
      get outputHandler() {
        return this._executor.outputHandler;
      }
      chain() {
        return this;
      }
      push(task) {
        this._queue.push(task);
        return (this._chain = this._chain.then(() => this.attemptTask(task)));
      }
      async attemptTask(task) {
        const onScheduleComplete = await this._scheduler.next();
        const onQueueComplete = () => this._queue.complete(task);
        try {
          const { logger } = this._queue.attempt(task);
          return await (isEmptyTask2(task)
            ? this.attemptEmptyTask(task, logger)
            : this.attemptRemoteTask(task, logger));
        } catch (e) {
          throw this.onFatalException(task, e);
        } finally {
          onQueueComplete();
          onScheduleComplete();
        }
      }
      onFatalException(task, e) {
        const gitError =
          e instanceof GitError2 ? Object.assign(e, { task }) : new GitError2(task, e && String(e));
        this._chain = Promise.resolve();
        this._queue.fatal(gitError);
        return gitError;
      }
      async attemptRemoteTask(task, logger) {
        const binary = this._plugins.exec("spawn.binary", "", pluginContext2(task, task.commands));
        const args = this._plugins.exec(
          "spawn.args",
          [...task.commands],
          pluginContext2(task, task.commands)
        );
        const raw = await this.gitResponse(
          task,
          binary,
          args,
          this.outputHandler,
          logger.step("SPAWN")
        );
        const outputStreams = await this.handleTaskData(task, args, raw, logger.step("HANDLE"));
        logger(`passing response to task's parser as a %s`, task.format);
        if (isBufferTask2(task)) {
          return callTaskParser2(task.parser, outputStreams);
        }
        return callTaskParser2(task.parser, outputStreams.asStrings());
      }
      async attemptEmptyTask(task, logger) {
        logger(`empty task bypassing child process to call to task's parser`);
        return task.parser(this);
      }
      handleTaskData(task, args, result, logger) {
        const { exitCode, rejection, stdOut, stdErr } = result;
        return new Promise((done, fail) => {
          logger(`Preparing to handle process response exitCode=%d stdOut=`, exitCode);
          const { error } = this._plugins.exec(
            "task.error",
            { error: rejection },
            {
              ...pluginContext2(task, args),
              ...result
            }
          );
          if (error && task.onError) {
            logger.info(`exitCode=%s handling with custom error handler`);
            return task.onError(
              result,
              error,
              (newStdOut) => {
                logger.info(`custom error handler treated as success`);
                logger(`custom error returned a %s`, objectToString2(newStdOut));
                done(
                  new GitOutputStreams2(
                    Array.isArray(newStdOut) ? Buffer.concat(newStdOut) : newStdOut,
                    Buffer.concat(stdErr)
                  )
                );
              },
              fail
            );
          }
          if (error) {
            logger.info(
              `handling as error: exitCode=%s stdErr=%s rejection=%o`,
              exitCode,
              stdErr.length,
              rejection
            );
            return fail(error);
          }
          logger.info(`retrieving task output complete`);
          done(new GitOutputStreams2(Buffer.concat(stdOut), Buffer.concat(stdErr)));
        });
      }
      async gitResponse(task, command, args, outputHandler, logger) {
        const outputLogger = logger.sibling("output");
        const spawnOptions = this._plugins.exec(
          "spawn.options",
          {
            cwd: this.cwd,
            env: this.env,
            windowsHide: true
          },
          pluginContext2(task, task.commands)
        );
        return new Promise((done) => {
          const stdOut = [];
          const stdErr = [];
          logger.info(`%s %o`, command, args);
          logger("%O", spawnOptions);
          let rejection = this._beforeSpawn(task, args);
          if (rejection) {
            return done({
              stdOut,
              stdErr,
              exitCode: 9901,
              rejection
            });
          }
          this._plugins.exec("spawn.before", void 0, {
            ...pluginContext2(task, args),
            kill(reason) {
              rejection = reason || rejection;
            }
          });
          const spawned = (0, import_child_process2.spawn)(command, args, spawnOptions);
          spawned.stdout.on(
            "data",
            onDataReceived2(stdOut, "stdOut", logger, outputLogger.step("stdOut"))
          );
          spawned.stderr.on(
            "data",
            onDataReceived2(stdErr, "stdErr", logger, outputLogger.step("stdErr"))
          );
          spawned.on("error", onErrorReceived2(stdErr, logger));
          if (outputHandler) {
            logger(`Passing child process stdOut/stdErr to custom outputHandler`);
            outputHandler(command, spawned.stdout, spawned.stderr, [...args]);
          }
          this._plugins.exec("spawn.after", void 0, {
            ...pluginContext2(task, args),
            spawned,
            close(exitCode, reason) {
              done({
                stdOut,
                stdErr,
                exitCode,
                rejection: rejection || reason
              });
            },
            kill(reason) {
              if (spawned.killed) {
                return;
              }
              rejection = reason;
              spawned.kill("SIGINT");
            }
          });
        });
      }
      _beforeSpawn(task, args) {
        let rejection;
        this._plugins.exec("spawn.before", void 0, {
          ...pluginContext2(task, args),
          kill(reason) {
            rejection = reason || rejection;
          }
        });
        return rejection;
      }
    };
  }
});
var git_executor_exports2 = {};
__export3(git_executor_exports2, {
  GitExecutor: () => GitExecutor2
});
var GitExecutor2;
var init_git_executor2 = __esm2({
  "src/lib/runners/git-executor.ts"() {
    "use strict";
    init_git_executor_chain2();
    GitExecutor2 = class {
      constructor(cwd, _scheduler, _plugins) {
        this.cwd = cwd;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = new GitExecutorChain2(this, this._scheduler, this._plugins);
      }
      chain() {
        return new GitExecutorChain2(this, this._scheduler, this._plugins);
      }
      push(task) {
        return this._chain.push(task);
      }
    };
  }
});
function taskCallback2(task, response, callback = NOOP2) {
  const onSuccess = (data) => {
    callback(null, data);
  };
  const onError22 = (err) => {
    if (err?.task === task) {
      callback(err instanceof GitResponseError2 ? addDeprecationNoticeToError2(err) : err, void 0);
    }
  };
  response.then(onSuccess, onError22);
}
function addDeprecationNoticeToError2(err) {
  let log = (name) => {
    console.warn(
      `simple-git deprecation notice: accessing GitResponseError.${name} should be GitResponseError.git.${name}, this will no longer be available in version 3`
    );
    log = NOOP2;
  };
  return Object.create(err, Object.getOwnPropertyNames(err.git).reduce(descriptorReducer, {}));
  function descriptorReducer(all, name) {
    if (name in err) {
      return all;
    }
    all[name] = {
      enumerable: false,
      configurable: false,
      get() {
        log(name);
        return err.git[name];
      }
    };
    return all;
  }
}
var init_task_callback2 = __esm2({
  "src/lib/task-callback.ts"() {
    "use strict";
    init_git_response_error2();
    init_utils2();
  }
});
function changeWorkingDirectoryTask2(directory, root) {
  return adhocExecTask2((instance) => {
    if (!folderExists2(directory)) {
      throw new Error(`Git.cwd: cannot change to non-directory "${directory}"`);
    }
    return ((root || instance).cwd = directory);
  });
}
var init_change_working_directory2 = __esm2({
  "src/lib/tasks/change-working-directory.ts"() {
    "use strict";
    init_utils2();
    init_task2();
  }
});
function checkoutTask2(args) {
  const commands3 = ["checkout", ...args];
  if (commands3[1] === "-b" && commands3.includes("-B")) {
    commands3[1] = remove2(commands3, "-B");
  }
  return straightThroughStringTask2(commands3);
}
function checkout_default2() {
  return {
    checkout() {
      return this._runTask(
        checkoutTask2(getTrailingOptions2(arguments, 1)),
        trailingFunctionArgument2(arguments)
      );
    },
    checkoutBranch(branchName, startPoint) {
      return this._runTask(
        checkoutTask2(["-b", branchName, startPoint, ...getTrailingOptions2(arguments)]),
        trailingFunctionArgument2(arguments)
      );
    },
    checkoutLocalBranch(branchName) {
      return this._runTask(
        checkoutTask2(["-b", branchName, ...getTrailingOptions2(arguments)]),
        trailingFunctionArgument2(arguments)
      );
    }
  };
}
var init_checkout2 = __esm2({
  "src/lib/tasks/checkout.ts"() {
    "use strict";
    init_utils2();
    init_task2();
  }
});
function countObjectsResponse2() {
  return {
    count: 0,
    garbage: 0,
    inPack: 0,
    packs: 0,
    prunePackable: 0,
    size: 0,
    sizeGarbage: 0,
    sizePack: 0
  };
}
function count_objects_default2() {
  return {
    countObjects() {
      return this._runTask({
        commands: ["count-objects", "--verbose"],
        format: "utf-8",
        parser(stdOut) {
          return parseStringResponse2(countObjectsResponse2(), [parser22], stdOut);
        }
      });
    }
  };
}
var parser22;
var init_count_objects2 = __esm2({
  "src/lib/tasks/count-objects.ts"() {
    "use strict";
    init_utils2();
    parser22 = new LineParser2(/([a-z-]+): (\d+)$/, (result, [key, value]) => {
      const property = asCamelCase2(key);
      if (Object.hasOwn(result, property)) {
        result[property] = asNumber2(value);
      }
    });
  }
});
function parseCommitResult2(stdOut) {
  const result = {
    author: null,
    branch: "",
    commit: "",
    root: false,
    summary: {
      changes: 0,
      insertions: 0,
      deletions: 0
    }
  };
  return parseStringResponse2(result, parsers12, stdOut);
}
var parsers12;
var init_parse_commit2 = __esm2({
  "src/lib/parsers/parse-commit.ts"() {
    "use strict";
    init_utils2();
    parsers12 = [
      new LineParser2(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/, (result, [branch, root, commit]) => {
        result.branch = branch;
        result.commit = commit;
        result.root = !!root;
      }),
      new LineParser2(/\s*Author:\s(.+)/i, (result, [author]) => {
        const parts = author.split("<");
        const email = parts.pop();
        if (!email || !email.includes("@")) {
          return;
        }
        result.author = {
          email: email.substr(0, email.length - 1),
          name: parts.join("<").trim()
        };
      }),
      new LineParser2(
        /(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g,
        (result, [changes, insertions, deletions]) => {
          result.summary.changes = parseInt(changes, 10) || 0;
          result.summary.insertions = parseInt(insertions, 10) || 0;
          result.summary.deletions = parseInt(deletions, 10) || 0;
        }
      ),
      new LineParser2(
        /^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/,
        (result, [changes, lines, direction]) => {
          result.summary.changes = parseInt(changes, 10) || 0;
          const count = parseInt(lines, 10) || 0;
          if (direction === "-") {
            result.summary.deletions = count;
          } else if (direction === "+") {
            result.summary.insertions = count;
          }
        }
      )
    ];
  }
});
function commitTask2(message, files, customArgs) {
  const commands3 = [
    "-c",
    "core.abbrev=40",
    "commit",
    ...prefixedArray2(message, "-m"),
    ...files,
    ...customArgs
  ];
  return {
    commands: commands3,
    format: "utf-8",
    parser: parseCommitResult2
  };
}
function commit_default2() {
  return {
    commit(message, ...rest) {
      const next = trailingFunctionArgument2(arguments);
      const task =
        rejectDeprecatedSignatures(message) ||
        commitTask2(
          asArray2(message),
          asArray2(filterType2(rest[0], filterStringOrStringArray2, [])),
          [
            ...asStringArray2(filterType2(rest[1], filterArray2, [])),
            ...getTrailingOptions2(arguments, 0, true)
          ]
        );
      return this._runTask(task, next);
    }
  };
  function rejectDeprecatedSignatures(message) {
    return (
      !filterStringOrStringArray2(message) &&
      configurationErrorTask2(
        `git.commit: requires the commit message to be supplied as a string/string[]`
      )
    );
  }
}
var init_commit2 = __esm2({
  "src/lib/tasks/commit.ts"() {
    "use strict";
    init_parse_commit2();
    init_utils2();
    init_task2();
  }
});
function first_commit_default2() {
  return {
    firstCommit() {
      return this._runTask(
        straightThroughStringTask2(["rev-list", "--max-parents=0", "HEAD"], true),
        trailingFunctionArgument2(arguments)
      );
    }
  };
}
var init_first_commit2 = __esm2({
  "src/lib/tasks/first-commit.ts"() {
    "use strict";
    init_utils2();
    init_task2();
  }
});
function hashObjectTask2(filePath, write) {
  const commands3 = ["hash-object", filePath];
  if (write) {
    commands3.push("-w");
  }
  return straightThroughStringTask2(commands3, true);
}
var init_hash_object2 = __esm2({
  "src/lib/tasks/hash-object.ts"() {
    "use strict";
    init_task2();
  }
});
function parseInit2(bare, path11, text) {
  const response = String(text).trim();
  let result;
  if ((result = initResponseRegex2.exec(response))) {
    return new InitSummary2(bare, path11, false, result[1]);
  }
  if ((result = reInitResponseRegex2.exec(response))) {
    return new InitSummary2(bare, path11, true, result[1]);
  }
  let gitDir = "";
  const tokens = response.split(" ");
  while (tokens.length) {
    const token = tokens.shift();
    if (token === "in") {
      gitDir = tokens.join(" ");
      break;
    }
  }
  return new InitSummary2(bare, path11, /^re/i.test(response), gitDir);
}
var InitSummary2;
var initResponseRegex2;
var reInitResponseRegex2;
var init_InitSummary2 = __esm2({
  "src/lib/responses/InitSummary.ts"() {
    "use strict";
    InitSummary2 = class {
      constructor(bare, path11, existing, gitDir) {
        this.bare = bare;
        this.path = path11;
        this.existing = existing;
        this.gitDir = gitDir;
      }
    };
    initResponseRegex2 = /^Init.+ repository in (.+)$/;
    reInitResponseRegex2 = /^Rein.+ in (.+)$/;
  }
});
function hasBareCommand2(command) {
  return command.includes(bareCommand2);
}
function initTask2(bare = false, path11, customArgs) {
  const commands3 = ["init", ...customArgs];
  if (bare && !hasBareCommand2(commands3)) {
    commands3.splice(1, 0, bareCommand2);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(text) {
      return parseInit2(commands3.includes("--bare"), path11, text);
    }
  };
}
var bareCommand2;
var init_init2 = __esm2({
  "src/lib/tasks/init.ts"() {
    "use strict";
    init_InitSummary2();
    bareCommand2 = "--bare";
  }
});
function logFormatFromCommand2(customArgs) {
  for (let i = 0; i < customArgs.length; i++) {
    const format = logFormatRegex2.exec(customArgs[i]);
    if (format) {
      return `--${format[1]}`;
    }
  }
  return "";
}
function isLogFormat2(customArg) {
  return logFormatRegex2.test(customArg);
}
var logFormatRegex2;
var init_log_format2 = __esm2({
  "src/lib/args/log-format.ts"() {
    "use strict";
    logFormatRegex2 = /^--(stat|numstat|name-only|name-status)(=|$)/;
  }
});
var DiffSummary2;
var init_DiffSummary2 = __esm2({
  "src/lib/responses/DiffSummary.ts"() {
    "use strict";
    DiffSummary2 = class {
      constructor() {
        this.changed = 0;
        this.deletions = 0;
        this.insertions = 0;
        this.files = [];
      }
    };
  }
});
function getDiffParser2(format = "") {
  const parser42 = diffSummaryParsers2[format];
  return (stdOut) => parseStringResponse2(new DiffSummary2(), parser42, stdOut, false);
}
var statParser2;
var numStatParser2;
var nameOnlyParser2;
var nameStatusParser2;
var diffSummaryParsers2;
var init_parse_diff_summary2 = __esm2({
  "src/lib/parsers/parse-diff-summary.ts"() {
    "use strict";
    init_log_format2();
    init_DiffSummary2();
    init_diff_name_status2();
    init_utils2();
    statParser2 = [
      new LineParser2(
        /^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/,
        (result, [file, changes, alterations = ""]) => {
          result.files.push({
            file: file.trim(),
            changes: asNumber2(changes),
            insertions: alterations.replace(/[^+]/g, "").length,
            deletions: alterations.replace(/[^-]/g, "").length,
            binary: false
          });
        }
      ),
      new LineParser2(
        /^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/,
        (result, [file, before, after]) => {
          result.files.push({
            file: file.trim(),
            before: asNumber2(before),
            after: asNumber2(after),
            binary: true
          });
        }
      ),
      new LineParser2(
        /(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/,
        (result, [changed, summary]) => {
          const inserted = /(\d+) i/.exec(summary);
          const deleted = /(\d+) d/.exec(summary);
          result.changed = asNumber2(changed);
          result.insertions = asNumber2(inserted?.[1]);
          result.deletions = asNumber2(deleted?.[1]);
        }
      )
    ];
    numStatParser2 = [
      new LineParser2(/(\d+)\t(\d+)\t(.+)$/, (result, [changesInsert, changesDelete, file]) => {
        const insertions = asNumber2(changesInsert);
        const deletions = asNumber2(changesDelete);
        result.changed++;
        result.insertions += insertions;
        result.deletions += deletions;
        result.files.push({
          file,
          changes: insertions + deletions,
          insertions,
          deletions,
          binary: false
        });
      }),
      new LineParser2(/-\t-\t(.+)$/, (result, [file]) => {
        result.changed++;
        result.files.push({
          file,
          after: 0,
          before: 0,
          binary: true
        });
      })
    ];
    nameOnlyParser2 = [
      new LineParser2(/(.+)$/, (result, [file]) => {
        result.changed++;
        result.files.push({
          file,
          changes: 0,
          insertions: 0,
          deletions: 0,
          binary: false
        });
      })
    ];
    nameStatusParser2 = [
      new LineParser2(
        /([ACDMRTUXB])([0-9]{0,3})\t(.[^\t]*)(\t(.[^\t]*))?$/,
        (result, [status, similarity, from, _to, to]) => {
          result.changed++;
          result.files.push({
            file: to ?? from,
            changes: 0,
            insertions: 0,
            deletions: 0,
            binary: false,
            status: orVoid2(isDiffNameStatus2(status) && status),
            from: orVoid2(!!to && from !== to && from),
            similarity: asNumber2(similarity)
          });
        }
      )
    ];
    diffSummaryParsers2 = {
      [""]:
        /* NONE */
        statParser2,
      ["--stat"]:
        /* STAT */
        statParser2,
      ["--numstat"]:
        /* NUM_STAT */
        numStatParser2,
      ["--name-status"]:
        /* NAME_STATUS */
        nameStatusParser2,
      ["--name-only"]:
        /* NAME_ONLY */
        nameOnlyParser2
    };
  }
});
function lineBuilder2(tokens, fields) {
  return fields.reduce(
    (line, field, index) => {
      line[field] = tokens[index] || "";
      return line;
    },
    /* @__PURE__ */ Object.create({ diff: null })
  );
}
function createListLogSummaryParser2(
  splitter = SPLITTER2,
  fields = defaultFieldNames2,
  logFormat = ""
) {
  const parseDiffResult = getDiffParser2(logFormat);
  return function (stdOut) {
    const all = toLinesWithContent2(stdOut.trim(), false, START_BOUNDARY2).map(function (item) {
      const lineDetail = item.split(COMMIT_BOUNDARY2);
      const listLogLine = lineBuilder2(lineDetail[0].split(splitter), fields);
      if (lineDetail.length > 1 && !!lineDetail[1].trim()) {
        listLogLine.diff = parseDiffResult(lineDetail[1]);
      }
      return listLogLine;
    });
    return {
      all,
      latest: (all.length && all[0]) || null,
      total: all.length
    };
  };
}
var START_BOUNDARY2;
var COMMIT_BOUNDARY2;
var SPLITTER2;
var defaultFieldNames2;
var init_parse_list_log_summary2 = __esm2({
  "src/lib/parsers/parse-list-log-summary.ts"() {
    "use strict";
    init_utils2();
    init_parse_diff_summary2();
    init_log_format2();
    START_BOUNDARY2 = "\xF2\xF2\xF2\xF2\xF2\xF2 ";
    COMMIT_BOUNDARY2 = " \xF2\xF2";
    SPLITTER2 = " \xF2 ";
    defaultFieldNames2 = ["hash", "date", "message", "refs", "author_name", "author_email"];
  }
});
var diff_exports2 = {};
__export3(diff_exports2, {
  diffSummaryTask: () => diffSummaryTask2,
  validateLogFormatConfig: () => validateLogFormatConfig2
});
function diffSummaryTask2(customArgs) {
  let logFormat = logFormatFromCommand2(customArgs);
  const commands3 = ["diff"];
  if (logFormat === "") {
    logFormat = "--stat";
    commands3.push("--stat=4096");
  }
  commands3.push(...customArgs);
  return (
    validateLogFormatConfig2(commands3) || {
      commands: commands3,
      format: "utf-8",
      parser: getDiffParser2(logFormat)
    }
  );
}
function validateLogFormatConfig2(customArgs) {
  const flags = customArgs.filter(isLogFormat2);
  if (flags.length > 1) {
    return configurationErrorTask2(
      `Summary flags are mutually exclusive - pick one of ${flags.join(",")}`
    );
  }
  if (flags.length && customArgs.includes("-z")) {
    return configurationErrorTask2(
      `Summary flag ${flags} parsing is not compatible with null termination option '-z'`
    );
  }
}
var init_diff2 = __esm2({
  "src/lib/tasks/diff.ts"() {
    "use strict";
    init_log_format2();
    init_parse_diff_summary2();
    init_task2();
  }
});
function prettyFormat2(format, splitter) {
  const fields = [];
  const formatStr = [];
  Object.keys(format).forEach((field) => {
    fields.push(field);
    formatStr.push(String(format[field]));
  });
  return [fields, formatStr.join(splitter)];
}
function userOptions2(input) {
  return Object.keys(input).reduce((out, key) => {
    if (!(key in excludeOptions2)) {
      out[key] = input[key];
    }
    return out;
  }, {});
}
function parseLogOptions2(opt = {}, customArgs = []) {
  const splitter = filterType2(opt.splitter, filterString2, SPLITTER2);
  const format = filterPlainObject2(opt.format)
    ? opt.format
    : {
        hash: "%H",
        date: opt.strictDate === false ? "%ai" : "%aI",
        message: "%s",
        refs: "%D",
        body: opt.multiLine ? "%B" : "%b",
        author_name: opt.mailMap !== false ? "%aN" : "%an",
        author_email: opt.mailMap !== false ? "%aE" : "%ae"
      };
  const [fields, formatStr] = prettyFormat2(format, splitter);
  const suffix = [];
  const command = [
    `--pretty=format:${START_BOUNDARY2}${formatStr}${COMMIT_BOUNDARY2}`,
    ...customArgs
  ];
  const maxCount = opt.n || opt["max-count"] || opt.maxCount;
  if (maxCount) {
    command.push(`--max-count=${maxCount}`);
  }
  if (opt.from || opt.to) {
    const rangeOperator = opt.symmetric !== false ? "..." : "..";
    suffix.push(`${opt.from || ""}${rangeOperator}${opt.to || ""}`);
  }
  if (filterString2(opt.file)) {
    command.push("--follow", pathspec2(opt.file));
  }
  appendTaskOptions2(userOptions2(opt), command);
  return {
    fields,
    splitter,
    commands: [...command, ...suffix]
  };
}
function logTask2(splitter, fields, customArgs) {
  const parser42 = createListLogSummaryParser2(splitter, fields, logFormatFromCommand2(customArgs));
  return {
    commands: ["log", ...customArgs],
    format: "utf-8",
    parser: parser42
  };
}
function log_default2() {
  return {
    log(...rest) {
      const next = trailingFunctionArgument2(arguments);
      const options = parseLogOptions2(
        trailingOptionsArgument2(arguments),
        asStringArray2(filterType2(arguments[0], filterArray2, []))
      );
      const task =
        rejectDeprecatedSignatures(...rest) ||
        validateLogFormatConfig2(options.commands) ||
        createLogTask(options);
      return this._runTask(task, next);
    }
  };
  function createLogTask(options) {
    return logTask2(options.splitter, options.fields, options.commands);
  }
  function rejectDeprecatedSignatures(from, to) {
    return (
      filterString2(from) &&
      filterString2(to) &&
      configurationErrorTask2(
        `git.log(string, string) should be replaced with git.log({ from: string, to: string })`
      )
    );
  }
}
var excludeOptions2;
var init_log2 = __esm2({
  "src/lib/tasks/log.ts"() {
    "use strict";
    init_log_format2();
    init_pathspec2();
    init_parse_list_log_summary2();
    init_utils2();
    init_task2();
    init_diff2();
    excludeOptions2 = /* @__PURE__ */ ((excludeOptions22) => {
      excludeOptions22[(excludeOptions22["--pretty"] = 0)] = "--pretty";
      excludeOptions22[(excludeOptions22["max-count"] = 1)] = "max-count";
      excludeOptions22[(excludeOptions22["maxCount"] = 2)] = "maxCount";
      excludeOptions22[(excludeOptions22["n"] = 3)] = "n";
      excludeOptions22[(excludeOptions22["file"] = 4)] = "file";
      excludeOptions22[(excludeOptions22["format"] = 5)] = "format";
      excludeOptions22[(excludeOptions22["from"] = 6)] = "from";
      excludeOptions22[(excludeOptions22["to"] = 7)] = "to";
      excludeOptions22[(excludeOptions22["splitter"] = 8)] = "splitter";
      excludeOptions22[(excludeOptions22["symmetric"] = 9)] = "symmetric";
      excludeOptions22[(excludeOptions22["mailMap"] = 10)] = "mailMap";
      excludeOptions22[(excludeOptions22["multiLine"] = 11)] = "multiLine";
      excludeOptions22[(excludeOptions22["strictDate"] = 12)] = "strictDate";
      return excludeOptions22;
    })(excludeOptions2 || {});
  }
});
var MergeSummaryConflict2;
var MergeSummaryDetail2;
var init_MergeSummary2 = __esm2({
  "src/lib/responses/MergeSummary.ts"() {
    "use strict";
    MergeSummaryConflict2 = class {
      constructor(reason, file = null, meta) {
        this.reason = reason;
        this.file = file;
        this.meta = meta;
      }
      toString() {
        return `${this.file}:${this.reason}`;
      }
    };
    MergeSummaryDetail2 = class {
      constructor() {
        this.conflicts = [];
        this.merges = [];
        this.result = "success";
      }
      get failed() {
        return this.conflicts.length > 0;
      }
      get reason() {
        return this.result;
      }
      toString() {
        if (this.conflicts.length) {
          return `CONFLICTS: ${this.conflicts.join(", ")}`;
        }
        return "OK";
      }
    };
  }
});
var PullSummary2;
var PullFailedSummary2;
var init_PullSummary2 = __esm2({
  "src/lib/responses/PullSummary.ts"() {
    "use strict";
    PullSummary2 = class {
      constructor() {
        this.remoteMessages = {
          all: []
        };
        this.created = [];
        this.deleted = [];
        this.files = [];
        this.deletions = {};
        this.insertions = {};
        this.summary = {
          changes: 0,
          deletions: 0,
          insertions: 0
        };
      }
    };
    PullFailedSummary2 = class {
      constructor() {
        this.remote = "";
        this.hash = {
          local: "",
          remote: ""
        };
        this.branch = {
          local: "",
          remote: ""
        };
        this.message = "";
      }
      toString() {
        return this.message;
      }
    };
  }
});
function objectEnumerationResult2(remoteMessages) {
  return (remoteMessages.objects = remoteMessages.objects || {
    compressing: 0,
    counting: 0,
    enumerating: 0,
    packReused: 0,
    reused: { count: 0, delta: 0 },
    total: { count: 0, delta: 0 }
  });
}
function asObjectCount2(source) {
  const count = /^\s*(\d+)/.exec(source);
  const delta = /delta (\d+)/i.exec(source);
  return {
    count: asNumber2((count && count[1]) || "0"),
    delta: asNumber2((delta && delta[1]) || "0")
  };
}
var remoteMessagesObjectParsers2;
var init_parse_remote_objects2 = __esm2({
  "src/lib/parsers/parse-remote-objects.ts"() {
    "use strict";
    init_utils2();
    remoteMessagesObjectParsers2 = [
      new RemoteLineParser2(
        /^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i,
        (result, [action, count]) => {
          const key = action.toLowerCase();
          const enumeration = objectEnumerationResult2(result.remoteMessages);
          Object.assign(enumeration, { [key]: asNumber2(count) });
        }
      ),
      new RemoteLineParser2(
        /^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i,
        (result, [action, count]) => {
          const key = action.toLowerCase();
          const enumeration = objectEnumerationResult2(result.remoteMessages);
          Object.assign(enumeration, { [key]: asNumber2(count) });
        }
      ),
      new RemoteLineParser2(
        /total ([^,]+), reused ([^,]+), pack-reused (\d+)/i,
        (result, [total, reused, packReused]) => {
          const objects = objectEnumerationResult2(result.remoteMessages);
          objects.total = asObjectCount2(total);
          objects.reused = asObjectCount2(reused);
          objects.packReused = asNumber2(packReused);
        }
      )
    ];
  }
});
function parseRemoteMessages2(_stdOut, stdErr) {
  return parseStringResponse2({ remoteMessages: new RemoteMessageSummary2() }, parsers22, stdErr);
}
var parsers22;
var RemoteMessageSummary2;
var init_parse_remote_messages2 = __esm2({
  "src/lib/parsers/parse-remote-messages.ts"() {
    "use strict";
    init_utils2();
    init_parse_remote_objects2();
    parsers22 = [
      new RemoteLineParser2(/^remote:\s*(.+)$/, (result, [text]) => {
        result.remoteMessages.all.push(text.trim());
        return false;
      }),
      ...remoteMessagesObjectParsers2,
      new RemoteLineParser2(
        [/create a (?:pull|merge) request/i, /\s(https?:\/\/\S+)$/],
        (result, [pullRequestUrl]) => {
          result.remoteMessages.pullRequestUrl = pullRequestUrl;
        }
      ),
      new RemoteLineParser2(
        [/found (\d+) vulnerabilities.+\(([^)]+)\)/i, /\s(https?:\/\/\S+)$/],
        (result, [count, summary, url]) => {
          result.remoteMessages.vulnerabilities = {
            count: asNumber2(count),
            summary,
            url
          };
        }
      )
    ];
    RemoteMessageSummary2 = class {
      constructor() {
        this.all = [];
      }
    };
  }
});
function parsePullErrorResult2(stdOut, stdErr) {
  const pullError = parseStringResponse2(new PullFailedSummary2(), errorParsers2, [stdOut, stdErr]);
  return pullError.message && pullError;
}
var FILE_UPDATE_REGEX2;
var SUMMARY_REGEX2;
var ACTION_REGEX2;
var parsers32;
var errorParsers2;
var parsePullDetail2;
var parsePullResult2;
var init_parse_pull2 = __esm2({
  "src/lib/parsers/parse-pull.ts"() {
    "use strict";
    init_PullSummary2();
    init_utils2();
    init_parse_remote_messages2();
    FILE_UPDATE_REGEX2 = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/;
    SUMMARY_REGEX2 = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/;
    ACTION_REGEX2 = /^(create|delete) mode \d+ (.+)/;
    parsers32 = [
      new LineParser2(FILE_UPDATE_REGEX2, (result, [file, insertions, deletions]) => {
        result.files.push(file);
        if (insertions) {
          result.insertions[file] = insertions.length;
        }
        if (deletions) {
          result.deletions[file] = deletions.length;
        }
      }),
      new LineParser2(SUMMARY_REGEX2, (result, [changes, , insertions, , deletions]) => {
        if (insertions !== void 0 || deletions !== void 0) {
          result.summary.changes = +changes || 0;
          result.summary.insertions = +insertions || 0;
          result.summary.deletions = +deletions || 0;
          return true;
        }
        return false;
      }),
      new LineParser2(ACTION_REGEX2, (result, [action, file]) => {
        append2(result.files, file);
        append2(action === "create" ? result.created : result.deleted, file);
      })
    ];
    errorParsers2 = [
      new LineParser2(/^from\s(.+)$/i, (result, [remote]) => void (result.remote = remote)),
      new LineParser2(/^fatal:\s(.+)$/, (result, [message]) => void (result.message = message)),
      new LineParser2(
        /([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/,
        (result, [hashLocal, hashRemote, branchLocal, branchRemote]) => {
          result.branch.local = branchLocal;
          result.hash.local = hashLocal;
          result.branch.remote = branchRemote;
          result.hash.remote = hashRemote;
        }
      )
    ];
    parsePullDetail2 = (stdOut, stdErr) => {
      return parseStringResponse2(new PullSummary2(), parsers32, [stdOut, stdErr]);
    };
    parsePullResult2 = (stdOut, stdErr) => {
      return Object.assign(
        new PullSummary2(),
        parsePullDetail2(stdOut, stdErr),
        parseRemoteMessages2(stdOut, stdErr)
      );
    };
  }
});
var parsers42;
var parseMergeResult2;
var parseMergeDetail2;
var init_parse_merge2 = __esm2({
  "src/lib/parsers/parse-merge.ts"() {
    "use strict";
    init_MergeSummary2();
    init_utils2();
    init_parse_pull2();
    parsers42 = [
      new LineParser2(/^Auto-merging\s+(.+)$/, (summary, [autoMerge]) => {
        summary.merges.push(autoMerge);
      }),
      new LineParser2(
        /^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/,
        (summary, [reason, file]) => {
          summary.conflicts.push(new MergeSummaryConflict2(reason, file));
        }
      ),
      new LineParser2(
        /^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/,
        (summary, [reason, file, deleteRef]) => {
          summary.conflicts.push(new MergeSummaryConflict2(reason, file, { deleteRef }));
        }
      ),
      new LineParser2(/^CONFLICT\s+\((.+)\):/, (summary, [reason]) => {
        summary.conflicts.push(new MergeSummaryConflict2(reason, null));
      }),
      new LineParser2(/^Automatic merge failed;\s+(.+)$/, (summary, [result]) => {
        summary.result = result;
      })
    ];
    parseMergeResult2 = (stdOut, stdErr) => {
      return Object.assign(parseMergeDetail2(stdOut, stdErr), parsePullResult2(stdOut, stdErr));
    };
    parseMergeDetail2 = (stdOut) => {
      return parseStringResponse2(new MergeSummaryDetail2(), parsers42, stdOut);
    };
  }
});
function mergeTask2(customArgs) {
  if (!customArgs.length) {
    return configurationErrorTask2("Git.merge requires at least one option");
  }
  return {
    commands: ["merge", ...customArgs],
    format: "utf-8",
    parser(stdOut, stdErr) {
      const merge2 = parseMergeResult2(stdOut, stdErr);
      if (merge2.failed) {
        throw new GitResponseError2(merge2);
      }
      return merge2;
    }
  };
}
var init_merge2 = __esm2({
  "src/lib/tasks/merge.ts"() {
    "use strict";
    init_git_response_error2();
    init_parse_merge2();
    init_task2();
  }
});
function pushResultPushedItem2(local, remote, status) {
  const deleted = status.includes("deleted");
  const tag = status.includes("tag") || /^refs\/tags/.test(local);
  const alreadyUpdated = !status.includes("new");
  return {
    deleted,
    tag,
    branch: !tag,
    new: !alreadyUpdated,
    alreadyUpdated,
    local,
    remote
  };
}
var parsers52;
var parsePushResult2;
var parsePushDetail2;
var init_parse_push2 = __esm2({
  "src/lib/parsers/parse-push.ts"() {
    "use strict";
    init_utils2();
    init_parse_remote_messages2();
    parsers52 = [
      new LineParser2(/^Pushing to (.+)$/, (result, [repo]) => {
        result.repo = repo;
      }),
      new LineParser2(/^updating local tracking ref '(.+)'/, (result, [local]) => {
        result.ref = {
          ...(result.ref || {}),
          local
        };
      }),
      new LineParser2(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/, (result, [local, remote, type]) => {
        result.pushed.push(pushResultPushedItem2(local, remote, type));
      }),
      new LineParser2(
        /^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/,
        (result, [local, remote, remoteName]) => {
          result.branch = {
            ...(result.branch || {}),
            local,
            remote,
            remoteName
          };
        }
      ),
      new LineParser2(
        /^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/,
        (result, [local, remote, from, to]) => {
          result.update = {
            head: {
              local,
              remote
            },
            hash: {
              from,
              to
            }
          };
        }
      )
    ];
    parsePushResult2 = (stdOut, stdErr) => {
      const pushDetail = parsePushDetail2(stdOut, stdErr);
      const responseDetail = parseRemoteMessages2(stdOut, stdErr);
      return {
        ...pushDetail,
        ...responseDetail
      };
    };
    parsePushDetail2 = (stdOut, stdErr) => {
      return parseStringResponse2({ pushed: [] }, parsers52, [stdOut, stdErr]);
    };
  }
});
var push_exports2 = {};
__export3(push_exports2, {
  pushTagsTask: () => pushTagsTask2,
  pushTask: () => pushTask2
});
function pushTagsTask2(ref = {}, customArgs) {
  append2(customArgs, "--tags");
  return pushTask2(ref, customArgs);
}
function pushTask2(ref = {}, customArgs) {
  const commands3 = ["push", ...customArgs];
  if (ref.branch) {
    commands3.splice(1, 0, ref.branch);
  }
  if (ref.remote) {
    commands3.splice(1, 0, ref.remote);
  }
  remove2(commands3, "-v");
  append2(commands3, "--verbose");
  append2(commands3, "--porcelain");
  return {
    commands: commands3,
    format: "utf-8",
    parser: parsePushResult2
  };
}
var init_push2 = __esm2({
  "src/lib/tasks/push.ts"() {
    "use strict";
    init_parse_push2();
    init_utils2();
  }
});
function show_default2() {
  return {
    showBuffer() {
      const commands3 = ["show", ...getTrailingOptions2(arguments, 1)];
      if (!commands3.includes("--binary")) {
        commands3.splice(1, 0, "--binary");
      }
      return this._runTask(
        straightThroughBufferTask2(commands3),
        trailingFunctionArgument2(arguments)
      );
    },
    show() {
      const commands3 = ["show", ...getTrailingOptions2(arguments, 1)];
      return this._runTask(
        straightThroughStringTask2(commands3),
        trailingFunctionArgument2(arguments)
      );
    }
  };
}
var init_show2 = __esm2({
  "src/lib/tasks/show.ts"() {
    "use strict";
    init_utils2();
    init_task2();
  }
});
var fromPathRegex2;
var FileStatusSummary2;
var init_FileStatusSummary2 = __esm2({
  "src/lib/responses/FileStatusSummary.ts"() {
    "use strict";
    fromPathRegex2 = /^(.+)\0(.+)$/;
    FileStatusSummary2 = class {
      constructor(path11, index, working_dir) {
        this.path = path11;
        this.index = index;
        this.working_dir = working_dir;
        if (index === "R" || working_dir === "R") {
          const detail = fromPathRegex2.exec(path11) || [null, path11, path11];
          this.from = detail[2] || "";
          this.path = detail[1] || "";
        }
      }
    };
  }
});
function renamedFile2(line) {
  const [to, from] = line.split(NULL2);
  return {
    from: from || to,
    to
  };
}
function parser32(indexX, indexY, handler2) {
  return [`${indexX}${indexY}`, handler2];
}
function conflicts2(indexX, ...indexY) {
  return indexY.map((y) => parser32(indexX, y, (result, file) => result.conflicted.push(file)));
}
function splitLine2(result, lineStr) {
  const trimmed22 = lineStr.trim();
  switch (" ") {
    case trimmed22.charAt(2):
      return data(trimmed22.charAt(0), trimmed22.charAt(1), trimmed22.slice(3));
    case trimmed22.charAt(1):
      return data(" ", trimmed22.charAt(0), trimmed22.slice(2));
    default:
      return;
  }
  function data(index, workingDir, path11) {
    const raw = `${index}${workingDir}`;
    const handler2 = parsers62.get(raw);
    if (handler2) {
      handler2(result, path11);
    }
    if (raw !== "##" && raw !== "!!") {
      result.files.push(new FileStatusSummary2(path11, index, workingDir));
    }
  }
}
var StatusSummary2;
var parsers62;
var parseStatusSummary2;
var init_StatusSummary2 = __esm2({
  "src/lib/responses/StatusSummary.ts"() {
    "use strict";
    init_utils2();
    init_FileStatusSummary2();
    StatusSummary2 = class {
      constructor() {
        this.not_added = [];
        this.conflicted = [];
        this.created = [];
        this.deleted = [];
        this.ignored = void 0;
        this.modified = [];
        this.renamed = [];
        this.files = [];
        this.staged = [];
        this.ahead = 0;
        this.behind = 0;
        this.current = null;
        this.tracking = null;
        this.detached = false;
        this.isClean = () => {
          return !this.files.length;
        };
      }
    };
    parsers62 = new Map([
      parser32(" ", "A", (result, file) => result.created.push(file)),
      parser32(" ", "D", (result, file) => result.deleted.push(file)),
      parser32(" ", "M", (result, file) => result.modified.push(file)),
      parser32("A", " ", (result, file) => {
        result.created.push(file);
        result.staged.push(file);
      }),
      parser32("A", "M", (result, file) => {
        result.created.push(file);
        result.staged.push(file);
        result.modified.push(file);
      }),
      parser32("D", " ", (result, file) => {
        result.deleted.push(file);
        result.staged.push(file);
      }),
      parser32("M", " ", (result, file) => {
        result.modified.push(file);
        result.staged.push(file);
      }),
      parser32("M", "M", (result, file) => {
        result.modified.push(file);
        result.staged.push(file);
      }),
      parser32("R", " ", (result, file) => {
        result.renamed.push(renamedFile2(file));
      }),
      parser32("R", "M", (result, file) => {
        const renamed = renamedFile2(file);
        result.renamed.push(renamed);
        result.modified.push(renamed.to);
      }),
      parser32("!", "!", (_result, _file) => {
        (_result.ignored = _result.ignored || []).push(_file);
      }),
      parser32("?", "?", (result, file) => result.not_added.push(file)),
      ...conflicts2(
        "A",
        "A",
        "U"
        /* UNMERGED */
      ),
      ...conflicts2(
        "D",
        "D",
        "U"
        /* UNMERGED */
      ),
      ...conflicts2(
        "U",
        "A",
        "D",
        "U"
        /* UNMERGED */
      ),
      [
        "##",
        (result, line) => {
          const aheadReg = /ahead (\d+)/;
          const behindReg = /behind (\d+)/;
          const currentReg = /^(.+?(?=(?:\.{3}|\s|$)))/;
          const trackingReg = /\.{3}(\S*)/;
          const onEmptyBranchReg = /\son\s(\S+?)(?=\.{3}|$)/;
          let regexResult = aheadReg.exec(line);
          result.ahead = (regexResult && +regexResult[1]) || 0;
          regexResult = behindReg.exec(line);
          result.behind = (regexResult && +regexResult[1]) || 0;
          regexResult = currentReg.exec(line);
          result.current = filterType2(regexResult?.[1], filterString2, null);
          regexResult = trackingReg.exec(line);
          result.tracking = filterType2(regexResult?.[1], filterString2, null);
          regexResult = onEmptyBranchReg.exec(line);
          if (regexResult) {
            result.current = filterType2(regexResult?.[1], filterString2, result.current);
          }
          result.detached = /\(no branch\)/.test(line);
        }
      ]
    ]);
    parseStatusSummary2 = function (text) {
      const lines = text.split(NULL2);
      const status = new StatusSummary2();
      for (let i = 0, l = lines.length; i < l; ) {
        let line = lines[i++].trim();
        if (!line) {
          continue;
        }
        if (line.charAt(0) === "R") {
          line += NULL2 + (lines[i++] || "");
        }
        splitLine2(status, line);
      }
      return status;
    };
  }
});
function statusTask2(customArgs) {
  const commands3 = [
    "status",
    "--porcelain",
    "-b",
    "-u",
    "--null",
    ...customArgs.filter((arg) => !ignoredOptions2.includes(arg))
  ];
  return {
    format: "utf-8",
    commands: commands3,
    parser(text) {
      return parseStatusSummary2(text);
    }
  };
}
var ignoredOptions2;
var init_status2 = __esm2({
  "src/lib/tasks/status.ts"() {
    "use strict";
    init_StatusSummary2();
    ignoredOptions2 = ["--null", "-z"];
  }
});
function versionResponse2(major = 0, minor = 0, patch = 0, agent = "", installed = true) {
  return Object.defineProperty(
    {
      major,
      minor,
      patch,
      agent,
      installed
    },
    "toString",
    {
      value() {
        return `${this.major}.${this.minor}.${this.patch}`;
      },
      configurable: false,
      enumerable: false
    }
  );
}
function notInstalledResponse2() {
  return versionResponse2(0, 0, 0, "", false);
}
function version_default2() {
  return {
    version() {
      return this._runTask({
        commands: ["--version"],
        format: "utf-8",
        parser: versionParser2,
        onError(result, error, done, fail) {
          if (result.exitCode === -2) {
            return done(Buffer.from(NOT_INSTALLED2));
          }
          fail(error);
        }
      });
    }
  };
}
function versionParser2(stdOut) {
  if (stdOut === NOT_INSTALLED2) {
    return notInstalledResponse2();
  }
  return parseStringResponse2(versionResponse2(0, 0, 0, stdOut), parsers72, stdOut);
}
var NOT_INSTALLED2;
var parsers72;
var init_version2 = __esm2({
  "src/lib/tasks/version.ts"() {
    "use strict";
    init_utils2();
    NOT_INSTALLED2 = "installed=false";
    parsers72 = [
      new LineParser2(
        /version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/,
        (result, [major, minor, patch, agent = ""]) => {
          Object.assign(
            result,
            versionResponse2(asNumber2(major), asNumber2(minor), asNumber2(patch), agent)
          );
        }
      ),
      new LineParser2(
        /version (\d+)\.(\d+)\.(\D+)(.+)?$/,
        (result, [major, minor, patch, agent = ""]) => {
          Object.assign(result, versionResponse2(asNumber2(major), asNumber2(minor), patch, agent));
        }
      )
    ];
  }
});
var simple_git_api_exports2 = {};
__export3(simple_git_api_exports2, {
  SimpleGitApi: () => SimpleGitApi2
});
var SimpleGitApi2;
var init_simple_git_api2 = __esm2({
  "src/lib/simple-git-api.ts"() {
    "use strict";
    init_task_callback2();
    init_change_working_directory2();
    init_checkout2();
    init_count_objects2();
    init_commit2();
    init_config2();
    init_first_commit2();
    init_grep2();
    init_hash_object2();
    init_init2();
    init_log2();
    init_merge2();
    init_push2();
    init_show2();
    init_status2();
    init_task2();
    init_version2();
    init_utils2();
    SimpleGitApi2 = class {
      constructor(_executor) {
        this._executor = _executor;
      }
      _runTask(task, then) {
        const chain = this._executor.chain();
        const promise = chain.push(task);
        if (then) {
          taskCallback2(task, promise, then);
        }
        return Object.create(this, {
          then: { value: promise.then.bind(promise) },
          catch: { value: promise.catch.bind(promise) },
          _executor: { value: chain }
        });
      }
      add(files) {
        return this._runTask(
          straightThroughStringTask2(["add", ...asArray2(files)]),
          trailingFunctionArgument2(arguments)
        );
      }
      cwd(directory) {
        const next = trailingFunctionArgument2(arguments);
        if (typeof directory === "string") {
          return this._runTask(changeWorkingDirectoryTask2(directory, this._executor), next);
        }
        if (typeof directory?.path === "string") {
          return this._runTask(
            changeWorkingDirectoryTask2(
              directory.path,
              (directory.root && this._executor) || void 0
            ),
            next
          );
        }
        return this._runTask(
          configurationErrorTask2("Git.cwd: workingDirectory must be supplied as a string"),
          next
        );
      }
      hashObject(path11, write) {
        return this._runTask(
          hashObjectTask2(path11, write === true),
          trailingFunctionArgument2(arguments)
        );
      }
      init(bare) {
        return this._runTask(
          initTask2(bare === true, this._executor.cwd, getTrailingOptions2(arguments)),
          trailingFunctionArgument2(arguments)
        );
      }
      merge() {
        return this._runTask(
          mergeTask2(getTrailingOptions2(arguments)),
          trailingFunctionArgument2(arguments)
        );
      }
      mergeFromTo(remote, branch) {
        if (!(filterString2(remote) && filterString2(branch))) {
          return this._runTask(
            configurationErrorTask2(
              `Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings`
            )
          );
        }
        return this._runTask(
          mergeTask2([remote, branch, ...getTrailingOptions2(arguments)]),
          trailingFunctionArgument2(arguments, false)
        );
      }
      outputHandler(handler2) {
        this._executor.outputHandler = handler2;
        return this;
      }
      push() {
        const task = pushTask2(
          {
            remote: filterType2(arguments[0], filterString2),
            branch: filterType2(arguments[1], filterString2)
          },
          getTrailingOptions2(arguments)
        );
        return this._runTask(task, trailingFunctionArgument2(arguments));
      }
      stash() {
        return this._runTask(
          straightThroughStringTask2(["stash", ...getTrailingOptions2(arguments)]),
          trailingFunctionArgument2(arguments)
        );
      }
      status() {
        return this._runTask(
          statusTask2(getTrailingOptions2(arguments)),
          trailingFunctionArgument2(arguments)
        );
      }
    };
    Object.assign(
      SimpleGitApi2.prototype,
      checkout_default2(),
      commit_default2(),
      config_default2(),
      count_objects_default2(),
      first_commit_default2(),
      grep_default2(),
      log_default2(),
      show_default2(),
      version_default2()
    );
  }
});
var scheduler_exports2 = {};
__export3(scheduler_exports2, {
  Scheduler: () => Scheduler2
});
var createScheduledTask2;
var Scheduler2;
var init_scheduler2 = __esm2({
  "src/lib/runners/scheduler.ts"() {
    "use strict";
    init_utils2();
    init_git_logger2();
    createScheduledTask2 = /* @__PURE__ */ (() => {
      let id = 0;
      return () => {
        id++;
        const { promise, done } = (0, import_promise_deferred3.createDeferred)();
        return {
          promise,
          done,
          id
        };
      };
    })();
    Scheduler2 = class {
      constructor(concurrency = 2) {
        this.concurrency = concurrency;
        this.logger = createLogger3("", "scheduler");
        this.pending = [];
        this.running = [];
        this.logger(`Constructed, concurrency=%s`, concurrency);
      }
      schedule() {
        if (!this.pending.length || this.running.length >= this.concurrency) {
          this.logger(
            `Schedule attempt ignored, pending=%s running=%s concurrency=%s`,
            this.pending.length,
            this.running.length,
            this.concurrency
          );
          return;
        }
        const task = append2(this.running, this.pending.shift());
        this.logger(`Attempting id=%s`, task.id);
        task.done(() => {
          this.logger(`Completing id=`, task.id);
          remove2(this.running, task);
          this.schedule();
        });
      }
      next() {
        const { promise, id } = append2(this.pending, createScheduledTask2());
        this.logger(`Scheduling id=%s`, id);
        this.schedule();
        return promise;
      }
    };
  }
});
var apply_patch_exports2 = {};
__export3(apply_patch_exports2, {
  applyPatchTask: () => applyPatchTask2
});
function applyPatchTask2(patches, customArgs) {
  return straightThroughStringTask2(["apply", ...customArgs, ...patches]);
}
var init_apply_patch2 = __esm2({
  "src/lib/tasks/apply-patch.ts"() {
    "use strict";
    init_task2();
  }
});
function branchDeletionSuccess2(branch, hash) {
  return {
    branch,
    hash,
    success: true
  };
}
function branchDeletionFailure2(branch) {
  return {
    branch,
    hash: null,
    success: false
  };
}
var BranchDeletionBatch2;
var init_BranchDeleteSummary2 = __esm2({
  "src/lib/responses/BranchDeleteSummary.ts"() {
    "use strict";
    BranchDeletionBatch2 = class {
      constructor() {
        this.all = [];
        this.branches = {};
        this.errors = [];
      }
      get success() {
        return !this.errors.length;
      }
    };
  }
});
function hasBranchDeletionError2(data, processExitCode) {
  return processExitCode === 1 && deleteErrorRegex2.test(data);
}
var deleteSuccessRegex2;
var deleteErrorRegex2;
var parsers82;
var parseBranchDeletions2;
var init_parse_branch_delete2 = __esm2({
  "src/lib/parsers/parse-branch-delete.ts"() {
    "use strict";
    init_BranchDeleteSummary2();
    init_utils2();
    deleteSuccessRegex2 = /(\S+)\s+\(\S+\s([^)]+)\)/;
    deleteErrorRegex2 = /^error[^']+'([^']+)'/m;
    parsers82 = [
      new LineParser2(deleteSuccessRegex2, (result, [branch, hash]) => {
        const deletion = branchDeletionSuccess2(branch, hash);
        result.all.push(deletion);
        result.branches[branch] = deletion;
      }),
      new LineParser2(deleteErrorRegex2, (result, [branch]) => {
        const deletion = branchDeletionFailure2(branch);
        result.errors.push(deletion);
        result.all.push(deletion);
        result.branches[branch] = deletion;
      })
    ];
    parseBranchDeletions2 = (stdOut, stdErr) => {
      return parseStringResponse2(new BranchDeletionBatch2(), parsers82, [stdOut, stdErr]);
    };
  }
});
var BranchSummaryResult2;
var init_BranchSummary2 = __esm2({
  "src/lib/responses/BranchSummary.ts"() {
    "use strict";
    BranchSummaryResult2 = class {
      constructor() {
        this.all = [];
        this.branches = {};
        this.current = "";
        this.detached = false;
      }
      push(status, detached, name, commit, label) {
        if (status === "*") {
          this.detached = detached;
          this.current = name;
        }
        this.all.push(name);
        this.branches[name] = {
          current: status === "*",
          linkedWorkTree: status === "+",
          name,
          commit,
          label
        };
      }
    };
  }
});
function branchStatus2(input) {
  return input ? input.charAt(0) : "";
}
function parseBranchSummary2(stdOut, currentOnly = false) {
  return parseStringResponse2(
    new BranchSummaryResult2(),
    currentOnly ? [currentBranchParser2] : parsers92,
    stdOut
  );
}
var parsers92;
var currentBranchParser2;
var init_parse_branch2 = __esm2({
  "src/lib/parsers/parse-branch.ts"() {
    "use strict";
    init_BranchSummary2();
    init_utils2();
    parsers92 = [
      new LineParser2(
        /^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/,
        (result, [current, name, commit, label]) => {
          result.push(branchStatus2(current), true, name, commit, label);
        }
      ),
      new LineParser2(
        /^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s,
        (result, [current, name, commit, label]) => {
          result.push(branchStatus2(current), false, name, commit, label);
        }
      )
    ];
    currentBranchParser2 = new LineParser2(/^(\S+)$/s, (result, [name]) => {
      result.push("*", false, name, "", "");
    });
  }
});
var branch_exports2 = {};
__export3(branch_exports2, {
  branchLocalTask: () => branchLocalTask2,
  branchTask: () => branchTask2,
  containsDeleteBranchCommand: () => containsDeleteBranchCommand2,
  deleteBranchTask: () => deleteBranchTask2,
  deleteBranchesTask: () => deleteBranchesTask2
});
function containsDeleteBranchCommand2(commands3) {
  const deleteCommands = ["-d", "-D", "--delete"];
  return commands3.some((command) => deleteCommands.includes(command));
}
function branchTask2(customArgs) {
  const isDelete = containsDeleteBranchCommand2(customArgs);
  const isCurrentOnly = customArgs.includes("--show-current");
  const commands3 = ["branch", ...customArgs];
  if (commands3.length === 1) {
    commands3.push("-a");
  }
  if (!commands3.includes("-v")) {
    commands3.splice(1, 0, "-v");
  }
  return {
    format: "utf-8",
    commands: commands3,
    parser(stdOut, stdErr) {
      if (isDelete) {
        return parseBranchDeletions2(stdOut, stdErr).all[0];
      }
      return parseBranchSummary2(stdOut, isCurrentOnly);
    }
  };
}
function branchLocalTask2() {
  return {
    format: "utf-8",
    commands: ["branch", "-v"],
    parser(stdOut) {
      return parseBranchSummary2(stdOut);
    }
  };
}
function deleteBranchesTask2(branches, forceDelete = false) {
  return {
    format: "utf-8",
    commands: ["branch", "-v", forceDelete ? "-D" : "-d", ...branches],
    parser(stdOut, stdErr) {
      return parseBranchDeletions2(stdOut, stdErr);
    },
    onError({ exitCode, stdOut }, error, done, fail) {
      if (!hasBranchDeletionError2(String(error), exitCode)) {
        return fail(error);
      }
      done(stdOut);
    }
  };
}
function deleteBranchTask2(branch, forceDelete = false) {
  const task = {
    format: "utf-8",
    commands: ["branch", "-v", forceDelete ? "-D" : "-d", branch],
    parser(stdOut, stdErr) {
      return parseBranchDeletions2(stdOut, stdErr).branches[branch];
    },
    onError({ exitCode, stdErr, stdOut }, error, _, fail) {
      if (!hasBranchDeletionError2(String(error), exitCode)) {
        return fail(error);
      }
      throw new GitResponseError2(
        task.parser(bufferToString2(stdOut), bufferToString2(stdErr)),
        String(error)
      );
    }
  };
  return task;
}
var init_branch2 = __esm2({
  "src/lib/tasks/branch.ts"() {
    "use strict";
    init_git_response_error2();
    init_parse_branch_delete2();
    init_parse_branch2();
    init_utils2();
  }
});
function toPath2(input) {
  const path11 = input.trim().replace(/^["']|["']$/g, "");
  return path11 && (0, import_node_path4.normalize)(path11);
}
var parseCheckIgnore2;
var init_CheckIgnore2 = __esm2({
  "src/lib/responses/CheckIgnore.ts"() {
    "use strict";
    parseCheckIgnore2 = (text) => {
      return text.split(/\n/g).map(toPath2).filter(Boolean);
    };
  }
});
var check_ignore_exports2 = {};
__export3(check_ignore_exports2, {
  checkIgnoreTask: () => checkIgnoreTask2
});
function checkIgnoreTask2(paths) {
  return {
    commands: ["check-ignore", ...paths],
    format: "utf-8",
    parser: parseCheckIgnore2
  };
}
var init_check_ignore2 = __esm2({
  "src/lib/tasks/check-ignore.ts"() {
    "use strict";
    init_CheckIgnore2();
  }
});
var clone_exports2 = {};
__export3(clone_exports2, {
  cloneMirrorTask: () => cloneMirrorTask2,
  cloneTask: () => cloneTask2
});
function disallowedCommand3(command) {
  return /^--upload-pack(=|$)/.test(command);
}
function cloneTask2(repo, directory, customArgs) {
  const commands3 = ["clone", ...customArgs];
  filterString2(repo) && commands3.push(repo);
  filterString2(directory) && commands3.push(directory);
  const banned = commands3.find(disallowedCommand3);
  if (banned) {
    return configurationErrorTask2(`git.fetch: potential exploit argument blocked.`);
  }
  return straightThroughStringTask2(commands3);
}
function cloneMirrorTask2(repo, directory, customArgs) {
  append2(customArgs, "--mirror");
  return cloneTask2(repo, directory, customArgs);
}
var init_clone2 = __esm2({
  "src/lib/tasks/clone.ts"() {
    "use strict";
    init_task2();
    init_utils2();
  }
});
function parseFetchResult2(stdOut, stdErr) {
  const result = {
    raw: stdOut,
    remote: null,
    branches: [],
    tags: [],
    updated: [],
    deleted: []
  };
  return parseStringResponse2(result, parsers102, [stdOut, stdErr]);
}
var parsers102;
var init_parse_fetch2 = __esm2({
  "src/lib/parsers/parse-fetch.ts"() {
    "use strict";
    init_utils2();
    parsers102 = [
      new LineParser2(/From (.+)$/, (result, [remote]) => {
        result.remote = remote;
      }),
      new LineParser2(/\* \[new branch]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.branches.push({
          name,
          tracking
        });
      }),
      new LineParser2(/\* \[new tag]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.tags.push({
          name,
          tracking
        });
      }),
      new LineParser2(/- \[deleted]\s+\S+\s*-> (.+)$/, (result, [tracking]) => {
        result.deleted.push({
          tracking
        });
      }),
      new LineParser2(
        /\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/,
        (result, [from, to, name, tracking]) => {
          result.updated.push({
            name,
            tracking,
            to,
            from
          });
        }
      )
    ];
  }
});
var fetch_exports2 = {};
__export3(fetch_exports2, {
  fetchTask: () => fetchTask2
});
function disallowedCommand22(command) {
  return /^--upload-pack(=|$)/.test(command);
}
function fetchTask2(remote, branch, customArgs) {
  const commands3 = ["fetch", ...customArgs];
  if (remote && branch) {
    commands3.push(remote, branch);
  }
  const banned = commands3.find(disallowedCommand22);
  if (banned) {
    return configurationErrorTask2(`git.fetch: potential exploit argument blocked.`);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser: parseFetchResult2
  };
}
var init_fetch2 = __esm2({
  "src/lib/tasks/fetch.ts"() {
    "use strict";
    init_parse_fetch2();
    init_task2();
  }
});
function parseMoveResult2(stdOut) {
  return parseStringResponse2({ moves: [] }, parsers112, stdOut);
}
var parsers112;
var init_parse_move2 = __esm2({
  "src/lib/parsers/parse-move.ts"() {
    "use strict";
    init_utils2();
    parsers112 = [
      new LineParser2(/^Renaming (.+) to (.+)$/, (result, [from, to]) => {
        result.moves.push({ from, to });
      })
    ];
  }
});
var move_exports2 = {};
__export3(move_exports2, {
  moveTask: () => moveTask2
});
function moveTask2(from, to) {
  return {
    commands: ["mv", "-v", ...asArray2(from), to],
    format: "utf-8",
    parser: parseMoveResult2
  };
}
var init_move2 = __esm2({
  "src/lib/tasks/move.ts"() {
    "use strict";
    init_parse_move2();
    init_utils2();
  }
});
var pull_exports2 = {};
__export3(pull_exports2, {
  pullTask: () => pullTask2
});
function pullTask2(remote, branch, customArgs) {
  const commands3 = ["pull", ...customArgs];
  if (remote && branch) {
    commands3.splice(1, 0, remote, branch);
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser(stdOut, stdErr) {
      return parsePullResult2(stdOut, stdErr);
    },
    onError(result, _error, _done, fail) {
      const pullError = parsePullErrorResult2(
        bufferToString2(result.stdOut),
        bufferToString2(result.stdErr)
      );
      if (pullError) {
        return fail(new GitResponseError2(pullError));
      }
      fail(_error);
    }
  };
}
var init_pull2 = __esm2({
  "src/lib/tasks/pull.ts"() {
    "use strict";
    init_git_response_error2();
    init_parse_pull2();
    init_utils2();
  }
});
function parseGetRemotes2(text) {
  const remotes = {};
  forEach2(text, ([name]) => (remotes[name] = { name }));
  return Object.values(remotes);
}
function parseGetRemotesVerbose2(text) {
  const remotes = {};
  forEach2(text, ([name, url, purpose]) => {
    if (!Object.hasOwn(remotes, name)) {
      remotes[name] = {
        name,
        refs: { fetch: "", push: "" }
      };
    }
    if (purpose && url) {
      remotes[name].refs[purpose.replace(/[^a-z]/g, "")] = url;
    }
  });
  return Object.values(remotes);
}
function forEach2(text, handler2) {
  forEachLineWithContent2(text, (line) => handler2(line.split(/\s+/)));
}
var init_GetRemoteSummary2 = __esm2({
  "src/lib/responses/GetRemoteSummary.ts"() {
    "use strict";
    init_utils2();
  }
});
var remote_exports2 = {};
__export3(remote_exports2, {
  addRemoteTask: () => addRemoteTask2,
  getRemotesTask: () => getRemotesTask2,
  listRemotesTask: () => listRemotesTask2,
  remoteTask: () => remoteTask2,
  removeRemoteTask: () => removeRemoteTask2
});
function addRemoteTask2(remoteName, remoteRepo, customArgs) {
  return straightThroughStringTask2(["remote", "add", ...customArgs, remoteName, remoteRepo]);
}
function getRemotesTask2(verbose) {
  const commands3 = ["remote"];
  if (verbose) {
    commands3.push("-v");
  }
  return {
    commands: commands3,
    format: "utf-8",
    parser: verbose ? parseGetRemotesVerbose2 : parseGetRemotes2
  };
}
function listRemotesTask2(customArgs) {
  const commands3 = [...customArgs];
  if (commands3[0] !== "ls-remote") {
    commands3.unshift("ls-remote");
  }
  return straightThroughStringTask2(commands3);
}
function remoteTask2(customArgs) {
  const commands3 = [...customArgs];
  if (commands3[0] !== "remote") {
    commands3.unshift("remote");
  }
  return straightThroughStringTask2(commands3);
}
function removeRemoteTask2(remoteName) {
  return straightThroughStringTask2(["remote", "remove", remoteName]);
}
var init_remote2 = __esm2({
  "src/lib/tasks/remote.ts"() {
    "use strict";
    init_GetRemoteSummary2();
    init_task2();
  }
});
var stash_list_exports2 = {};
__export3(stash_list_exports2, {
  stashListTask: () => stashListTask2
});
function stashListTask2(opt = {}, customArgs) {
  const options = parseLogOptions2(opt);
  const commands3 = ["stash", "list", ...options.commands, ...customArgs];
  const parser42 = createListLogSummaryParser2(
    options.splitter,
    options.fields,
    logFormatFromCommand2(commands3)
  );
  return (
    validateLogFormatConfig2(commands3) || {
      commands: commands3,
      format: "utf-8",
      parser: parser42
    }
  );
}
var init_stash_list2 = __esm2({
  "src/lib/tasks/stash-list.ts"() {
    "use strict";
    init_log_format2();
    init_parse_list_log_summary2();
    init_diff2();
    init_log2();
  }
});
var sub_module_exports2 = {};
__export3(sub_module_exports2, {
  addSubModuleTask: () => addSubModuleTask2,
  initSubModuleTask: () => initSubModuleTask2,
  subModuleTask: () => subModuleTask2,
  updateSubModuleTask: () => updateSubModuleTask2
});
function addSubModuleTask2(repo, path11) {
  return subModuleTask2(["add", repo, path11]);
}
function initSubModuleTask2(customArgs) {
  return subModuleTask2(["init", ...customArgs]);
}
function subModuleTask2(customArgs) {
  const commands3 = [...customArgs];
  if (commands3[0] !== "submodule") {
    commands3.unshift("submodule");
  }
  return straightThroughStringTask2(commands3);
}
function updateSubModuleTask2(customArgs) {
  return subModuleTask2(["update", ...customArgs]);
}
var init_sub_module2 = __esm2({
  "src/lib/tasks/sub-module.ts"() {
    "use strict";
    init_task2();
  }
});
function singleSorted2(a, b) {
  const aIsNum = Number.isNaN(a);
  const bIsNum = Number.isNaN(b);
  if (aIsNum !== bIsNum) {
    return aIsNum ? 1 : -1;
  }
  return aIsNum ? sorted2(a, b) : 0;
}
function sorted2(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function trimmed2(input) {
  return input.trim();
}
function toNumber2(input) {
  if (typeof input === "string") {
    return parseInt(input.replace(/^\D+/g, ""), 10) || 0;
  }
  return 0;
}
var TagList2;
var parseTagList2;
var init_TagList2 = __esm2({
  "src/lib/responses/TagList.ts"() {
    "use strict";
    TagList2 = class {
      constructor(all, latest) {
        this.all = all;
        this.latest = latest;
      }
    };
    parseTagList2 = function (data, customSort = false) {
      const tags = data.split("\n").map(trimmed2).filter(Boolean);
      if (!customSort) {
        tags.sort(function (tagA, tagB) {
          const partsA = tagA.split(".");
          const partsB = tagB.split(".");
          if (partsA.length === 1 || partsB.length === 1) {
            return singleSorted2(toNumber2(partsA[0]), toNumber2(partsB[0]));
          }
          for (let i = 0, l = Math.max(partsA.length, partsB.length); i < l; i++) {
            const diff = sorted2(toNumber2(partsA[i]), toNumber2(partsB[i]));
            if (diff) {
              return diff;
            }
          }
          return 0;
        });
      }
      const latest = customSort
        ? tags[0]
        : [...tags].reverse().find((tag) => tag.indexOf(".") >= 0);
      return new TagList2(tags, latest);
    };
  }
});
var tag_exports2 = {};
__export3(tag_exports2, {
  addAnnotatedTagTask: () => addAnnotatedTagTask2,
  addTagTask: () => addTagTask2,
  tagListTask: () => tagListTask2
});
function tagListTask2(customArgs = []) {
  const hasCustomSort = customArgs.some((option) => /^--sort=/.test(option));
  return {
    format: "utf-8",
    commands: ["tag", "-l", ...customArgs],
    parser(text) {
      return parseTagList2(text, hasCustomSort);
    }
  };
}
function addTagTask2(name) {
  return {
    format: "utf-8",
    commands: ["tag", name],
    parser() {
      return { name };
    }
  };
}
function addAnnotatedTagTask2(name, tagMessage) {
  return {
    format: "utf-8",
    commands: ["tag", "-a", "-m", tagMessage, name],
    parser() {
      return { name };
    }
  };
}
var init_tag2 = __esm2({
  "src/lib/tasks/tag.ts"() {
    "use strict";
    init_TagList2();
  }
});
var require_git2 = __commonJS3({
  "src/git.js"(exports2, module2) {
    "use strict";
    var { GitExecutor: GitExecutor22 } =
      (init_git_executor2(), __toCommonJS3(git_executor_exports2));
    var { SimpleGitApi: SimpleGitApi22 } =
      (init_simple_git_api2(), __toCommonJS3(simple_git_api_exports2));
    var { Scheduler: Scheduler22 } = (init_scheduler2(), __toCommonJS3(scheduler_exports2));
    var { configurationErrorTask: configurationErrorTask22 } =
      (init_task2(), __toCommonJS3(task_exports2));
    var {
      asArray: asArray22,
      filterArray: filterArray22,
      filterPrimitives: filterPrimitives22,
      filterString: filterString22,
      filterStringOrStringArray: filterStringOrStringArray22,
      filterType: filterType22,
      getTrailingOptions: getTrailingOptions22,
      trailingFunctionArgument: trailingFunctionArgument22,
      trailingOptionsArgument: trailingOptionsArgument22
    } = (init_utils2(), __toCommonJS3(utils_exports2));
    var { applyPatchTask: applyPatchTask22 } =
      (init_apply_patch2(), __toCommonJS3(apply_patch_exports2));
    var {
      branchTask: branchTask22,
      branchLocalTask: branchLocalTask22,
      deleteBranchesTask: deleteBranchesTask22,
      deleteBranchTask: deleteBranchTask22
    } = (init_branch2(), __toCommonJS3(branch_exports2));
    var { checkIgnoreTask: checkIgnoreTask22 } =
      (init_check_ignore2(), __toCommonJS3(check_ignore_exports2));
    var { checkIsRepoTask: checkIsRepoTask22 } =
      (init_check_is_repo2(), __toCommonJS3(check_is_repo_exports2));
    var { cloneTask: cloneTask22, cloneMirrorTask: cloneMirrorTask22 } =
      (init_clone2(), __toCommonJS3(clone_exports2));
    var {
      cleanWithOptionsTask: cleanWithOptionsTask22,
      isCleanOptionsArray: isCleanOptionsArray22
    } = (init_clean2(), __toCommonJS3(clean_exports2));
    var { diffSummaryTask: diffSummaryTask22 } = (init_diff2(), __toCommonJS3(diff_exports2));
    var { fetchTask: fetchTask22 } = (init_fetch2(), __toCommonJS3(fetch_exports2));
    var { moveTask: moveTask22 } = (init_move2(), __toCommonJS3(move_exports2));
    var { pullTask: pullTask22 } = (init_pull2(), __toCommonJS3(pull_exports2));
    var { pushTagsTask: pushTagsTask22 } = (init_push2(), __toCommonJS3(push_exports2));
    var {
      addRemoteTask: addRemoteTask22,
      getRemotesTask: getRemotesTask22,
      listRemotesTask: listRemotesTask22,
      remoteTask: remoteTask22,
      removeRemoteTask: removeRemoteTask22
    } = (init_remote2(), __toCommonJS3(remote_exports2));
    var { getResetMode: getResetMode22, resetTask: resetTask22 } =
      (init_reset2(), __toCommonJS3(reset_exports2));
    var { stashListTask: stashListTask22 } =
      (init_stash_list2(), __toCommonJS3(stash_list_exports2));
    var {
      addSubModuleTask: addSubModuleTask22,
      initSubModuleTask: initSubModuleTask22,
      subModuleTask: subModuleTask22,
      updateSubModuleTask: updateSubModuleTask22
    } = (init_sub_module2(), __toCommonJS3(sub_module_exports2));
    var {
      addAnnotatedTagTask: addAnnotatedTagTask22,
      addTagTask: addTagTask22,
      tagListTask: tagListTask22
    } = (init_tag2(), __toCommonJS3(tag_exports2));
    var {
      straightThroughBufferTask: straightThroughBufferTask22,
      straightThroughStringTask: straightThroughStringTask22
    } = (init_task2(), __toCommonJS3(task_exports2));
    function Git22(options, plugins) {
      this._plugins = plugins;
      this._executor = new GitExecutor22(
        options.baseDir,
        new Scheduler22(options.maxConcurrentProcesses),
        plugins
      );
      this._trimmed = options.trimmed;
    }
    (Git22.prototype = Object.create(SimpleGitApi22.prototype)).constructor = Git22;
    Git22.prototype.customBinary = function (command) {
      this._plugins.reconfigure("binary", command);
      return this;
    };
    Git22.prototype.env = function (name, value) {
      if (arguments.length === 1 && typeof name === "object") {
        this._executor.env = name;
      } else {
        (this._executor.env = this._executor.env || {})[name] = value;
      }
      return this;
    };
    Git22.prototype.stashList = function (options) {
      return this._runTask(
        stashListTask22(
          trailingOptionsArgument22(arguments) || {},
          (filterArray22(options) && options) || []
        ),
        trailingFunctionArgument22(arguments)
      );
    };
    function createCloneTask(api, task, repoPath, localPath) {
      if (typeof repoPath !== "string") {
        return configurationErrorTask22(`git.${api}() requires a string 'repoPath'`);
      }
      return task(
        repoPath,
        filterType22(localPath, filterString22),
        getTrailingOptions22(arguments)
      );
    }
    Git22.prototype.clone = function () {
      return this._runTask(
        createCloneTask("clone", cloneTask22, ...arguments),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.mirror = function () {
      return this._runTask(
        createCloneTask("mirror", cloneMirrorTask22, ...arguments),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.mv = function (from, to) {
      return this._runTask(moveTask22(from, to), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.checkoutLatestTag = function (then) {
      var git = this;
      return this.pull(function () {
        git.tags(function (err, tags) {
          git.checkout(tags.latest, then);
        });
      });
    };
    Git22.prototype.pull = function (remote, branch, options, then) {
      return this._runTask(
        pullTask22(
          filterType22(remote, filterString22),
          filterType22(branch, filterString22),
          getTrailingOptions22(arguments)
        ),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.fetch = function (remote, branch) {
      return this._runTask(
        fetchTask22(
          filterType22(remote, filterString22),
          filterType22(branch, filterString22),
          getTrailingOptions22(arguments)
        ),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.silent = function (silence) {
      console.warn(
        "simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3"
      );
      return this;
    };
    Git22.prototype.tags = function (options, then) {
      return this._runTask(
        tagListTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.rebase = function () {
      return this._runTask(
        straightThroughStringTask22(["rebase", ...getTrailingOptions22(arguments)]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.reset = function (mode) {
      return this._runTask(
        resetTask22(getResetMode22(mode), getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.revert = function (commit) {
      const next = trailingFunctionArgument22(arguments);
      if (typeof commit !== "string") {
        return this._runTask(configurationErrorTask22("Commit must be a string"), next);
      }
      return this._runTask(
        straightThroughStringTask22([
          "revert",
          ...getTrailingOptions22(arguments, 0, true),
          commit
        ]),
        next
      );
    };
    Git22.prototype.addTag = function (name) {
      const task =
        typeof name === "string"
          ? addTagTask22(name)
          : configurationErrorTask22("Git.addTag requires a tag name");
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.addAnnotatedTag = function (tagName, tagMessage) {
      return this._runTask(
        addAnnotatedTagTask22(tagName, tagMessage),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.deleteLocalBranch = function (branchName, forceDelete, then) {
      return this._runTask(
        deleteBranchTask22(branchName, typeof forceDelete === "boolean" ? forceDelete : false),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.deleteLocalBranches = function (branchNames, forceDelete, then) {
      return this._runTask(
        deleteBranchesTask22(branchNames, typeof forceDelete === "boolean" ? forceDelete : false),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.branch = function (options, then) {
      return this._runTask(
        branchTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.branchLocal = function (then) {
      return this._runTask(branchLocalTask22(), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.raw = function (commands3) {
      const createRestCommands = !Array.isArray(commands3);
      const command = [].slice.call(createRestCommands ? arguments : commands3, 0);
      for (let i = 0; i < command.length && createRestCommands; i++) {
        if (!filterPrimitives22(command[i])) {
          command.splice(i, command.length - i);
          break;
        }
      }
      command.push(...getTrailingOptions22(arguments, 0, true));
      var next = trailingFunctionArgument22(arguments);
      if (!command.length) {
        return this._runTask(
          configurationErrorTask22("Raw: must supply one or more command to execute"),
          next
        );
      }
      return this._runTask(straightThroughStringTask22(command, this._trimmed), next);
    };
    Git22.prototype.submoduleAdd = function (repo, path11, then) {
      return this._runTask(addSubModuleTask22(repo, path11), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.submoduleUpdate = function (args, then) {
      return this._runTask(
        updateSubModuleTask22(getTrailingOptions22(arguments, true)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.submoduleInit = function (args, then) {
      return this._runTask(
        initSubModuleTask22(getTrailingOptions22(arguments, true)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.subModule = function (options, then) {
      return this._runTask(
        subModuleTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.listRemote = function () {
      return this._runTask(
        listRemotesTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.addRemote = function (remoteName, remoteRepo, then) {
      return this._runTask(
        addRemoteTask22(remoteName, remoteRepo, getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.removeRemote = function (remoteName, then) {
      return this._runTask(removeRemoteTask22(remoteName), trailingFunctionArgument22(arguments));
    };
    Git22.prototype.getRemotes = function (verbose, then) {
      return this._runTask(
        getRemotesTask22(verbose === true),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.remote = function (options, then) {
      return this._runTask(
        remoteTask22(getTrailingOptions22(arguments)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.tag = function (options, then) {
      const command = getTrailingOptions22(arguments);
      if (command[0] !== "tag") {
        command.unshift("tag");
      }
      return this._runTask(
        straightThroughStringTask22(command),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.updateServerInfo = function (then) {
      return this._runTask(
        straightThroughStringTask22(["update-server-info"]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.pushTags = function (remote, then) {
      const task = pushTagsTask22(
        { remote: filterType22(remote, filterString22) },
        getTrailingOptions22(arguments)
      );
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.rm = function (files) {
      return this._runTask(
        straightThroughStringTask22(["rm", "-f", ...asArray22(files)]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.rmKeepLocal = function (files) {
      return this._runTask(
        straightThroughStringTask22(["rm", "--cached", ...asArray22(files)]),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.catFile = function (options, then) {
      return this._catFile("utf-8", arguments);
    };
    Git22.prototype.binaryCatFile = function () {
      return this._catFile("buffer", arguments);
    };
    Git22.prototype._catFile = function (format, args) {
      var handler2 = trailingFunctionArgument22(args);
      var command = ["cat-file"];
      var options = args[0];
      if (typeof options === "string") {
        return this._runTask(
          configurationErrorTask22("Git.catFile: options must be supplied as an array of strings"),
          handler2
        );
      }
      if (Array.isArray(options)) {
        command.push.apply(command, options);
      }
      const task =
        format === "buffer"
          ? straightThroughBufferTask22(command)
          : straightThroughStringTask22(command);
      return this._runTask(task, handler2);
    };
    Git22.prototype.diff = function (options, then) {
      const task = filterString22(options)
        ? configurationErrorTask22(
            "git.diff: supplying options as a single string is no longer supported, switch to an array of strings"
          )
        : straightThroughStringTask22(["diff", ...getTrailingOptions22(arguments)]);
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.diffSummary = function () {
      return this._runTask(
        diffSummaryTask22(getTrailingOptions22(arguments, 1)),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.applyPatch = function (patches) {
      const task = !filterStringOrStringArray22(patches)
        ? configurationErrorTask22(
            `git.applyPatch requires one or more string patches as the first argument`
          )
        : applyPatchTask22(asArray22(patches), getTrailingOptions22([].slice.call(arguments, 1)));
      return this._runTask(task, trailingFunctionArgument22(arguments));
    };
    Git22.prototype.revparse = function () {
      const commands3 = ["rev-parse", ...getTrailingOptions22(arguments, true)];
      return this._runTask(
        straightThroughStringTask22(commands3, true),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.clean = function (mode, options, then) {
      const usingCleanOptionsArray = isCleanOptionsArray22(mode);
      const cleanMode =
        (usingCleanOptionsArray && mode.join("")) || filterType22(mode, filterString22) || "";
      const customArgs = getTrailingOptions22(
        [].slice.call(arguments, usingCleanOptionsArray ? 1 : 0)
      );
      return this._runTask(
        cleanWithOptionsTask22(cleanMode, customArgs),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.exec = function (then) {
      const task = {
        commands: [],
        format: "utf-8",
        parser() {
          if (typeof then === "function") {
            then();
          }
        }
      };
      return this._runTask(task);
    };
    Git22.prototype.clearQueue = function () {
      return this;
    };
    Git22.prototype.checkIgnore = function (pathnames, then) {
      return this._runTask(
        checkIgnoreTask22(asArray22(filterType22(pathnames, filterStringOrStringArray22, []))),
        trailingFunctionArgument22(arguments)
      );
    };
    Git22.prototype.checkIsRepo = function (checkType, then) {
      return this._runTask(
        checkIsRepoTask22(filterType22(checkType, filterString22)),
        trailingFunctionArgument22(arguments)
      );
    };
    module2.exports = Git22;
  }
});
init_pathspec2();
init_git_error2();
var GitConstructError = class extends GitError2 {
  constructor(config, message) {
    super(void 0, message);
    this.config = config;
  }
};
init_git_error2();
init_git_error2();
var GitPluginError = class extends GitError2 {
  constructor(task, plugin, message) {
    super(task, message);
    this.task = task;
    this.plugin = plugin;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
init_git_response_error2();
init_task_configuration_error2();
init_check_is_repo2();
init_clean2();
init_config2();
init_diff_name_status2();
init_grep2();
init_reset2();
function abortPlugin(signal) {
  if (!signal) {
    return;
  }
  const onSpawnAfter = {
    type: "spawn.after",
    action(_data, context) {
      function kill() {
        context.kill(new GitPluginError(void 0, "abort", "Abort signal received"));
      }
      signal.addEventListener("abort", kill);
      context.spawned.on("close", () => signal.removeEventListener("abort", kill));
    }
  };
  const onSpawnBefore = {
    type: "spawn.before",
    action(_data, context) {
      if (signal.aborted) {
        context.kill(new GitPluginError(void 0, "abort", "Abort already signaled"));
      }
    }
  };
  return [onSpawnBefore, onSpawnAfter];
}
function isConfigSwitch(arg) {
  return typeof arg === "string" && arg.trim().toLowerCase() === "-c";
}
function preventProtocolOverride(arg, next) {
  if (!isConfigSwitch(arg)) {
    return;
  }
  if (!/^\s*protocol(.[a-z]+)?.allow/.test(next)) {
    return;
  }
  throw new GitPluginError(
    void 0,
    "unsafe",
    "Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol"
  );
}
function preventUploadPack(arg, method) {
  if (/^\s*--(upload|receive)-pack/.test(arg)) {
    throw new GitPluginError(
      void 0,
      "unsafe",
      `Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack`
    );
  }
  if (method === "clone" && /^\s*-u\b/.test(arg)) {
    throw new GitPluginError(
      void 0,
      "unsafe",
      `Use of clone with option -u is not permitted without enabling allowUnsafePack`
    );
  }
  if (method === "push" && /^\s*--exec\b/.test(arg)) {
    throw new GitPluginError(
      void 0,
      "unsafe",
      `Use of push with option --exec is not permitted without enabling allowUnsafePack`
    );
  }
}
function blockUnsafeOperationsPlugin({
  allowUnsafeProtocolOverride = false,
  allowUnsafePack = false
} = {}) {
  return {
    type: "spawn.args",
    action(args, context) {
      args.forEach((current, index) => {
        const next = index < args.length ? args[index + 1] : "";
        allowUnsafeProtocolOverride || preventProtocolOverride(current, next);
        allowUnsafePack || preventUploadPack(current, context.method);
      });
      return args;
    }
  };
}
init_utils2();
function commandConfigPrefixingPlugin(configuration) {
  const prefix = prefixedArray2(configuration, "-c");
  return {
    type: "spawn.args",
    action(data) {
      return [...prefix, ...data];
    }
  };
}
init_utils2();
var never2 = (0, import_promise_deferred4.deferred)().promise;
function completionDetectionPlugin({ onClose = true, onExit = 50 } = {}) {
  function createEvents() {
    let exitCode = -1;
    const events = {
      close: (0, import_promise_deferred4.deferred)(),
      closeTimeout: (0, import_promise_deferred4.deferred)(),
      exit: (0, import_promise_deferred4.deferred)(),
      exitTimeout: (0, import_promise_deferred4.deferred)()
    };
    const result = Promise.race([
      onClose === false ? never2 : events.closeTimeout.promise,
      onExit === false ? never2 : events.exitTimeout.promise
    ]);
    configureTimeout(onClose, events.close, events.closeTimeout);
    configureTimeout(onExit, events.exit, events.exitTimeout);
    return {
      close(code) {
        exitCode = code;
        events.close.done();
      },
      exit(code) {
        exitCode = code;
        events.exit.done();
      },
      get exitCode() {
        return exitCode;
      },
      result
    };
  }
  function configureTimeout(flag, event, timeout) {
    if (flag === false) {
      return;
    }
    (flag === true ? event.promise : event.promise.then(() => delay2(flag))).then(timeout.done);
  }
  return {
    type: "spawn.after",
    async action(_data, { spawned, close }) {
      const events = createEvents();
      let deferClose = true;
      let quickClose = () => void (deferClose = false);
      spawned.stdout?.on("data", quickClose);
      spawned.stderr?.on("data", quickClose);
      spawned.on("error", quickClose);
      spawned.on("close", (code) => events.close(code));
      spawned.on("exit", (code) => events.exit(code));
      try {
        await events.result;
        if (deferClose) {
          await delay2(50);
        }
        close(events.exitCode);
      } catch (err) {
        close(events.exitCode, err);
      }
    }
  };
}
init_utils2();
var WRONG_NUMBER_ERR = `Invalid value supplied for custom binary, requires a single string or an array containing either one or two strings`;
var WRONG_CHARS_ERR = `Invalid value supplied for custom binary, restricted characters must be removed or supply the unsafe.allowUnsafeCustomBinary option`;
function isBadArgument(arg) {
  return !arg || !/^([a-z]:)?([a-z0-9/.\\_~-]+)$/i.test(arg);
}
function toBinaryConfig(input, allowUnsafe) {
  if (input.length < 1 || input.length > 2) {
    throw new GitPluginError(void 0, "binary", WRONG_NUMBER_ERR);
  }
  const isBad = input.some(isBadArgument);
  if (isBad) {
    if (allowUnsafe) {
      console.warn(WRONG_CHARS_ERR);
    } else {
      throw new GitPluginError(void 0, "binary", WRONG_CHARS_ERR);
    }
  }
  const [binary, prefix] = input;
  return {
    binary,
    prefix
  };
}
function customBinaryPlugin(plugins, input = ["git"], allowUnsafe = false) {
  let config = toBinaryConfig(asArray2(input), allowUnsafe);
  plugins.on("binary", (input2) => {
    config = toBinaryConfig(asArray2(input2), allowUnsafe);
  });
  plugins.append("spawn.binary", () => {
    return config.binary;
  });
  plugins.append("spawn.args", (data) => {
    return config.prefix ? [config.prefix, ...data] : data;
  });
}
init_git_error2();
function isTaskError(result) {
  return !!(result.exitCode && result.stdErr.length);
}
function getErrorMessage(result) {
  return Buffer.concat([...result.stdOut, ...result.stdErr]);
}
function errorDetectionHandler(
  overwrite = false,
  isError = isTaskError,
  errorMessage = getErrorMessage
) {
  return (error, result) => {
    if ((!overwrite && error) || !isError(result)) {
      return error;
    }
    return errorMessage(result);
  };
}
function errorDetectionPlugin(config) {
  return {
    type: "task.error",
    action(data, context) {
      const error = config(data.error, {
        stdErr: context.stdErr,
        stdOut: context.stdOut,
        exitCode: context.exitCode
      });
      if (Buffer.isBuffer(error)) {
        return { error: new GitError2(void 0, error.toString("utf-8")) };
      }
      return {
        error
      };
    }
  };
}
init_utils2();
var PluginStore = class {
  constructor() {
    this.plugins = /* @__PURE__ */ new Set();
    this.events = new import_node_events.EventEmitter();
  }
  on(type, listener) {
    this.events.on(type, listener);
  }
  reconfigure(type, data) {
    this.events.emit(type, data);
  }
  append(type, action) {
    const plugin = append2(this.plugins, { type, action });
    return () => this.plugins.delete(plugin);
  }
  add(plugin) {
    const plugins = [];
    asArray2(plugin).forEach((plugin2) => plugin2 && this.plugins.add(append2(plugins, plugin2)));
    return () => {
      plugins.forEach((plugin2) => this.plugins.delete(plugin2));
    };
  }
  exec(type, data, context) {
    let output = data;
    const contextual = Object.freeze(Object.create(context));
    for (const plugin of this.plugins) {
      if (plugin.type === type) {
        output = plugin.action(output, contextual);
      }
    }
    return output;
  }
};
init_utils2();
function progressMonitorPlugin(progress) {
  const progressCommand = "--progress";
  const progressMethods = ["checkout", "clone", "fetch", "pull", "push"];
  const onProgress = {
    type: "spawn.after",
    action(_data, context) {
      if (!context.commands.includes(progressCommand)) {
        return;
      }
      context.spawned.stderr?.on("data", (chunk) => {
        const message = /^([\s\S]+?):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(chunk.toString("utf8"));
        if (!message) {
          return;
        }
        progress({
          method: context.method,
          stage: progressEventStage(message[1]),
          progress: asNumber2(message[2]),
          processed: asNumber2(message[3]),
          total: asNumber2(message[4])
        });
      });
    }
  };
  const onArgs = {
    type: "spawn.args",
    action(args, context) {
      if (!progressMethods.includes(context.method)) {
        return args;
      }
      return including2(args, progressCommand);
    }
  };
  return [onArgs, onProgress];
}
function progressEventStage(input) {
  return String(input.toLowerCase().split(" ", 1)) || "unknown";
}
init_utils2();
function spawnOptionsPlugin(spawnOptions) {
  const options = pick2(spawnOptions, ["uid", "gid"]);
  return {
    type: "spawn.options",
    action(data) {
      return { ...options, ...data };
    }
  };
}
function timeoutPlugin({ block, stdErr = true, stdOut = true }) {
  if (block > 0) {
    return {
      type: "spawn.after",
      action(_data, context) {
        let timeout;
        function wait() {
          timeout && clearTimeout(timeout);
          timeout = setTimeout(kill, block);
        }
        function stop() {
          context.spawned.stdout?.off("data", wait);
          context.spawned.stderr?.off("data", wait);
          context.spawned.off("exit", stop);
          context.spawned.off("close", stop);
          timeout && clearTimeout(timeout);
        }
        function kill() {
          stop();
          context.kill(new GitPluginError(void 0, "timeout", `block timeout reached`));
        }
        stdOut && context.spawned.stdout?.on("data", wait);
        stdErr && context.spawned.stderr?.on("data", wait);
        context.spawned.on("exit", stop);
        context.spawned.on("close", stop);
        wait();
      }
    };
  }
}
init_pathspec2();
function suffixPathsPlugin() {
  return {
    type: "spawn.args",
    action(data) {
      const prefix = [];
      let suffix;
      function append22(args) {
        (suffix = suffix || []).push(...args);
      }
      for (let i = 0; i < data.length; i++) {
        const param = data[i];
        if (isPathSpec2(param)) {
          append22(toPaths(param));
          continue;
        }
        if (param === "--") {
          append22(
            data.slice(i + 1).flatMap((item) => (isPathSpec2(item) && toPaths(item)) || item)
          );
          break;
        }
        prefix.push(param);
      }
      return !suffix ? prefix : [...prefix, "--", ...suffix.map(String)];
    }
  };
}
init_utils2();
var Git2 = require_git2();
function gitInstanceFactory(baseDir, options) {
  const plugins = new PluginStore();
  const config = createInstanceConfig2(
    (baseDir && (typeof baseDir === "string" ? { baseDir } : baseDir)) || {},
    options
  );
  if (!folderExists2(config.baseDir)) {
    throw new GitConstructError(config, `Cannot use simple-git on a directory that does not exist`);
  }
  if (Array.isArray(config.config)) {
    plugins.add(commandConfigPrefixingPlugin(config.config));
  }
  plugins.add(blockUnsafeOperationsPlugin(config.unsafe));
  plugins.add(suffixPathsPlugin());
  plugins.add(completionDetectionPlugin(config.completion));
  config.abort && plugins.add(abortPlugin(config.abort));
  config.progress && plugins.add(progressMonitorPlugin(config.progress));
  config.timeout && plugins.add(timeoutPlugin(config.timeout));
  config.spawnOptions && plugins.add(spawnOptionsPlugin(config.spawnOptions));
  plugins.add(errorDetectionPlugin(errorDetectionHandler(true)));
  config.errors && plugins.add(errorDetectionPlugin(config.errors));
  customBinaryPlugin(plugins, config.binary, config.unsafe?.allowUnsafeCustomBinary);
  return new Git2(config, plugins);
}
init_git_response_error2();
var esm_default2 = gitInstanceFactory;

// src/commands/pr.ts
async function prCommand() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;
  const git = esm_default2(workspacePath);
  const remotes = await git.getRemotes(true);
  const origin = remotes.find((r) => r.name === "origin");
  if (!origin?.refs.push) {
    vscode11.window.showErrorMessage("Primer: No origin remote found.");
    return;
  }
  const match = origin.refs.push.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
  if (!match) {
    vscode11.window.showErrorMessage(
      "Primer: Could not parse GitHub owner/repo from origin remote."
    );
    return;
  }
  const [, owner, repo] = match;
  const branch = (await git.branch()).current;
  const defaultBranch = await git
    .raw(["symbolic-ref", "refs/remotes/origin/HEAD", "--short"])
    .catch(() => "origin/main");
  const base = defaultBranch.replace("origin/", "").trim();
  if (branch === base) {
    vscode11.window.showErrorMessage(
      "Primer: Cannot create PR from the default branch. Check out a feature branch first."
    );
    return;
  }
  const title = await vscode11.window.showInputBox({
    prompt: "Pull request title",
    value: `Add Primer AI configs for ${repo}`
  });
  if (!title) return;
  await vscode11.window.withProgress(
    {
      location: vscode11.ProgressLocation.Notification,
      title: "Primer: Creating pull request\u2026"
    },
    async () => {
      try {
        const token = await getGitHubToken();
        const status = await git.status();
        if (status.files.length > 0) {
          const primerFiles = status.files
            .map((f) => f.path)
            .filter(
              (p) =>
                p.startsWith(".github/") ||
                p.startsWith(".vscode/") ||
                p.endsWith(".instructions.md") ||
                p === "primer.eval.json"
            );
          if (primerFiles.length === 0) {
            vscode11.window.showWarningMessage("Primer: No Primer-generated files to commit.");
            return;
          }
          await git.add(primerFiles);
          await git.commit(title);
          await git.push("origin", branch);
        }
        const prUrl = await createPullRequest({
          token,
          owner,
          repo,
          title,
          body: "Generated by Primer VS Code extension.",
          head: branch,
          base
        });
        const openAction = "Open in Browser";
        const action = await vscode11.window.showInformationMessage(
          `Primer: Pull request created.`,
          openAction
        );
        if (action === openAction && prUrl.startsWith("https://")) {
          vscode11.env.openExternal(vscode11.Uri.parse(prUrl));
        }
      } catch (err) {
        vscode11.window.showErrorMessage(
          `Primer: PR creation failed \u2014 ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  );
}

// src/extension.ts
function activate(context) {
  const statusBar = vscode12.window.createStatusBarItem(vscode12.StatusBarAlignment.Left, 0);
  statusBar.text = "$(beaker) Primer";
  statusBar.tooltip = "Primer \u2014 click to analyze repository";
  statusBar.command = "primer.analyze";
  statusBar.show();
  context.subscriptions.push(statusBar);
  const analysisView = vscode12.window.createTreeView("primer.analysis", {
    treeDataProvider: analysisTreeProvider
  });
  const readinessView = vscode12.window.createTreeView("primer.readiness", {
    treeDataProvider: readinessTreeProvider
  });
  context.subscriptions.push(analysisView, readinessView);
  function updateAnalysisView() {
    const analysis = getCachedAnalysis();
    if (analysis) {
      const parts = [...analysis.languages.slice(0, 3), ...analysis.frameworks.slice(0, 2)];
      analysisView.description = parts.join(", ") || void 0;
    } else {
      analysisView.description = void 0;
    }
  }
  function updateReadinessView() {
    const report = readinessTreeProvider.getReport();
    if (report) {
      readinessView.description = `Level ${report.achievedLevel}`;
    } else {
      readinessView.description = void 0;
    }
  }
  function updateStatusBar() {
    const analysis = getCachedAnalysis();
    if (analysis) {
      const parts = analysis.languages.slice(0, 2);
      statusBar.text = `$(beaker) ${parts.join(", ") || "Primer"}`;
      statusBar.tooltip = `Primer \u2014 ${analysis.languages.join(", ")}${analysis.isMonorepo ? " | monorepo" : ""}`;
    } else {
      statusBar.text = "$(beaker) Primer";
      statusBar.tooltip = "Primer \u2014 click to analyze repository";
    }
  }
  context.subscriptions.push(
    vscode12.commands.registerCommand("primer.analyze", async () => {
      await analyzeCommand();
      analysisTreeProvider.refresh();
      updateAnalysisView();
      updateStatusBar();
      vscode12.commands.executeCommand("primer.analysis.focus");
    }),
    vscode12.commands.registerCommand("primer.generate", generateCommand),
    vscode12.commands.registerCommand("primer.instructions", instructionsCommand),
    vscode12.commands.registerCommand("primer.readiness", async () => {
      await readinessCommand();
      updateReadinessView();
      updateStatusBar();
    }),
    vscode12.commands.registerCommand("primer.eval", evalCommand),
    vscode12.commands.registerCommand("primer.evalInit", evalInitCommand),
    vscode12.commands.registerCommand("primer.init", async () => {
      await initCommand();
      analysisTreeProvider.refresh();
      updateAnalysisView();
      updateStatusBar();
      vscode12.commands.executeCommand("primer.analysis.focus");
    }),
    vscode12.commands.registerCommand("primer.pr", prCommand)
  );
  const config = vscode12.workspace.getConfiguration("primer");
  if (config.get("autoAnalyze") && vscode12.workspace.workspaceFolders?.length) {
    analyzeCommand()
      .then(() => {
        analysisTreeProvider.refresh();
        updateAnalysisView();
        updateStatusBar();
      })
      .catch(() => {});
  }
}
function deactivate() {}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    activate,
    deactivate
  });
/*! Bundled license information:

is-extglob/index.js:
  (*!
   * is-extglob <https://github.com/jonschlinkert/is-extglob>
   *
   * Copyright (c) 2014-2016, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-glob/index.js:
  (*!
   * is-glob <https://github.com/jonschlinkert/is-glob>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

to-regex-range/index.js:
  (*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

fill-range/index.js:
  (*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

queue-microtask/index.js:
  (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

run-parallel/index.js:
  (*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

@octokit/request-error/dist-src/index.js:
  (* v8 ignore else -- @preserve -- Bug with vitest coverage where it sees an else branch that doesn't exist *)

@octokit/request/dist-bundle/index.js:
  (* v8 ignore next -- @preserve *)
  (* v8 ignore else -- @preserve *)
*/
//# sourceMappingURL=extension.js.map
