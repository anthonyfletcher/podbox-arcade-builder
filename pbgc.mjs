#!/usr/bin/env node
/* PodBox Arcade cart compiler: built from arcade/sdk by arcade/builder/build.mjs. GPL-2.0-only; see LICENSE and THIRD-PARTY.txt. */
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target2, all) => {
  for (var name in all)
    __defProp(target2, name, { get: all[name], enumerable: true });
};

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/folder.js
function newCartId() {
  return Array.from(
    globalThis.crypto.getRandomValues(new Uint8Array(8)),
    (b) => b.toString(16).padStart(2, "0")
  ).join("");
}
function asNewGame(cartJson, name) {
  const c = JSON.parse(cartJson);
  c.id = newCartId();
  if (name) c.name = name;
  return JSON.stringify(c, null, 2) + "\n";
}
var init_folder = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/folder.js"() {
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/defs.js
function args(s) {
  return s.split(",").map(function(a) {
    return a.trim();
  });
}
function each(text2, macro, fn) {
  const re = new RegExp("^\\s*" + macro + "\\(([^)]*)\\)", "mg");
  let m;
  while ((m = re.exec(text2)) !== null)
    fn(args(m[1]));
}
function parseOpcodes(text2) {
  const ops = [];
  const byName = {};
  each(text2, "OP", function(a) {
    const operands = a[1].replace(/"/g, "");
    let size = 1;
    for (const k of operands) size += OPERAND_SIZE[k];
    const op = {
      name: a[0],
      code: ops.length,
      operands,
      size,
      pops: parseInt(a[2], 10),
      pushes: parseInt(a[3], 10)
    };
    ops.push(op);
    byName[op.name] = op;
  });
  const methods = [];
  each(text2, "MTH", function(a) {
    methods.push({
      name: a[0],
      id: methods.length,
      min: +a[1],
      max: +a[2]
    });
  });
  const intrinsics = [];
  each(text2, "INTRINSIC", function(a) {
    intrinsics.push({
      name: a[0],
      id: intrinsics.length,
      min: +a[1],
      max: +a[2]
    });
  });
  return { ops, op: byName, methods, intrinsics };
}
function parseApi(text2) {
  const natives = /* @__PURE__ */ Object.create(null);
  const bySlot = [];
  each(text2, "API", function(a) {
    const n = {
      name: a[0],
      slot: +a[1],
      min: +a[2],
      max: +a[3],
      returns: a[4] === "VAL",
      parts: a[5] === "PARTS",
      cost: a[6],
      level: a[7],
      version: +a[8]
    };
    natives[n.name] = n;
    bySlot[n.slot] = n;
  });
  each(text2, "API_ALIAS", function(a) {
    natives[a[0]] = natives[a[1]];
  });
  const namespaces = /* @__PURE__ */ Object.create(null);
  each(text2, "API_NS", function(a) {
    const ns = /* @__PURE__ */ Object.create(null);
    for (const name of Object.keys(natives)) {
      if (!name.startsWith(a[0] + "_")) continue;
      const def = natives[name];
      def.label = a[0] + "." + name.slice(a[0].length + 1);
      ns[name.slice(a[0].length + 1)] = def;
      delete natives[name];
    }
    namespaces[a[0]] = ns;
  });
  const consts = /* @__PURE__ */ Object.create(null);
  each(text2, "API_CONST", function(a) {
    consts[a[0]] = { value: +a[1], version: +a[2] };
  });
  const groups = /* @__PURE__ */ Object.create(null);
  each(text2, "API_CONSTG", function(a) {
    if (!groups[a[0]]) groups[a[0]] = /* @__PURE__ */ Object.create(null);
    groups[a[0]][a[1]] = { value: +a[2], version: +a[3] };
  });
  return {
    natives,
    bySlot,
    consts,
    groups,
    namespaces
  };
}
var OPERAND_SIZE;
var init_defs = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/defs.js"() {
    OPERAND_SIZE = { b: 1, B: 1, h: 2, H: 2, i: 4 };
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/node_modules/acorn/dist/acorn.mjs
function isInAstralSet(code2, set) {
  var pos = 65536;
  for (var i2 = 0; i2 < set.length; i2 += 2) {
    pos += set[i2];
    if (pos > code2) {
      return false;
    }
    pos += set[i2 + 1];
    if (pos >= code2) {
      return true;
    }
  }
  return false;
}
function isIdentifierStart(code2, astral) {
  if (code2 < 65) {
    return code2 === 36;
  }
  if (code2 < 91) {
    return true;
  }
  if (code2 < 97) {
    return code2 === 95;
  }
  if (code2 < 123) {
    return true;
  }
  if (code2 <= 65535) {
    return code2 >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code2));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code2, astralIdentifierStartCodes);
}
function isIdentifierChar(code2, astral) {
  if (code2 < 48) {
    return code2 === 36;
  }
  if (code2 < 58) {
    return true;
  }
  if (code2 < 65) {
    return false;
  }
  if (code2 < 91) {
    return true;
  }
  if (code2 < 97) {
    return code2 === 95;
  }
  if (code2 < 123) {
    return true;
  }
  if (code2 <= 65535) {
    return code2 >= 170 && nonASCIIidentifier.test(String.fromCharCode(code2));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code2, astralIdentifierStartCodes) || isInAstralSet(code2, astralIdentifierCodes);
}
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
function kw(name, options2) {
  if (options2 === void 0) options2 = {};
  options2.keyword = name;
  return keywords[name] = new TokenType(name, options2);
}
function isNewLine(code2) {
  return code2 === 10 || code2 === 13 || code2 === 8232 || code2 === 8233;
}
function nextLineBreak(code2, from, end) {
  if (end === void 0) end = code2.length;
  for (var i2 = from; i2 < end; i2++) {
    var next = code2.charCodeAt(i2);
    if (isNewLine(next)) {
      return i2 < end - 1 && next === 13 && code2.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
    }
  }
  return -1;
}
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code2) {
  if (code2 <= 65535) {
    return String.fromCharCode(code2);
  }
  code2 -= 65536;
  return String.fromCharCode((code2 >> 10) + 55296, (code2 & 1023) + 56320);
}
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset2);
    if (nextBreak < 0) {
      return new Position(line, offset2 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
function getOptions(opts) {
  var options2 = {};
  for (var opt in defaultOptions) {
    options2[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options2.ecmaVersion === "latest") {
    options2.ecmaVersion = 1e8;
  } else if (options2.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options2.ecmaVersion = 11;
  } else if (options2.ecmaVersion >= 2015) {
    options2.ecmaVersion -= 2009;
  }
  if (options2.allowReserved == null) {
    options2.allowReserved = options2.ecmaVersion < 5;
  }
  if (!opts || opts.allowHashBang == null) {
    options2.allowHashBang = options2.ecmaVersion >= 14;
  }
  if (isArray(options2.onToken)) {
    var tokens = options2.onToken;
    options2.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options2.onComment)) {
    options2.onComment = pushComment(options2, options2.onComment);
  }
  if (options2.sourceType === "commonjs" && options2.allowAwaitOutsideFunction) {
    throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
  }
  return options2;
}
function pushComment(options2, array) {
  return function(block, text2, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text2,
      start,
      end
    };
    if (options2.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options2.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
function keywordOpAt(parser, pos) {
  var end = pos + 1, stop = Math.min(parser.input.length, pos + 11);
  while (end < stop) {
    var ch = parser.fullCharCodeAt(end);
    if (!isIdentifierChar(ch, true)) {
      break;
    }
    end += ch <= 65535 ? 1 : 2;
  }
  return end === pos + 2 && parser.input.slice(pos, end) === "in" || end === pos + 10 && parser.input.slice(pos, end) === "instanceof";
}
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];
  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
function buildUnicodeData(ecmaVersion2) {
  var d = data[ecmaVersion2] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion2] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion2]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion2])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
function hasProp(obj) {
  for (var _ in obj) {
    return true;
  }
  return false;
}
function isRegularExpressionModifier(ch) {
  return ch === 105 || ch === 109 || ch === 115;
}
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
function isClassSetSyntaxCharacter(ch) {
  return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
function isClassSetReservedPunctuator(ch) {
  return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
function parse3(input, options2) {
  return Parser.parse(input, options2);
}
var astralIdentifierCodes, astralIdentifierStartCodes, nonASCIIidentifierChars, nonASCIIidentifierStartChars, reservedWords, ecma5AndLessKeywords, keywords$1, keywordRelationalOperator, nonASCIIidentifierStart, nonASCIIidentifier, TokenType, beforeExpr, startsExpr, keywords, types$1, lineBreak, lineBreakG, nonASCIIwhitespace, skipWhiteSpace, ref, hasOwnProperty, toString, hasOwn, isArray, regexpCache, loneSurrogate, Position, SourceLocation, defaultOptions, warnedAboutEcmaVersion, SCOPE_TOP, SCOPE_FUNCTION, SCOPE_ASYNC, SCOPE_GENERATOR, SCOPE_ARROW, SCOPE_SIMPLE_CATCH, SCOPE_SUPER, SCOPE_DIRECT_SUPER, SCOPE_CLASS_STATIC_BLOCK, SCOPE_CLASS_FIELD_INIT, SCOPE_SWITCH, SCOPE_VAR, BIND_NONE, BIND_VAR, BIND_LEXICAL, BIND_FUNCTION, BIND_SIMPLE_CATCH, BIND_OUTSIDE, Parser, prototypeAccessors, pp$9, literal, DestructuringErrors, pp$8, loopLabel, switchLabel, empty$1, FUNC_STATEMENT, FUNC_HANGING_STATEMENT, FUNC_NULLABLE_ID, pp$7, TokContext, types, pp$6, pp$5, empty, pp$4, pp$3, Scope, Node, pp$2, scriptValuesAddedInUnicode, ecma9BinaryProperties, ecma10BinaryProperties, ecma11BinaryProperties, ecma12BinaryProperties, ecma13BinaryProperties, ecma14BinaryProperties, unicodeBinaryProperties, ecma14BinaryPropertiesOfStrings, unicodeBinaryPropertiesOfStrings, unicodeGeneralCategoryValues, ecma9ScriptValues, ecma10ScriptValues, ecma11ScriptValues, ecma12ScriptValues, ecma13ScriptValues, ecma14ScriptValues, unicodeScriptValues, data, ecmaVersion, i, list, pp$1, BranchID, RegExpValidationState, CharSetNone, CharSetOk, CharSetString, Token, pp, INVALID_TEMPLATE_ESCAPE_ERROR, version;
var init_acorn = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/node_modules/acorn/dist/acorn.mjs"() {
    astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 31, 4, 33, 15, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 199, 7, 137, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 55, 9, 7, 0, 259, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 481, 1, 61, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 12, 2, 9, 1, 3, 0, 33, 1, 1357, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 233, 0, 3, 0, 8, 1, 6, 0, 475, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
    astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 13, 65, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 7, 25, 39, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 5, 18, 21, 18, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 18, 0, 182, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 24, 43, 22, 0, 239, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 111, 6, 206, 13, 310, 2314, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 33, 24, 3, 24, 45, 74, 6, 0, 67, 12, 65, 1, 2, 0, 15, 4, 10, 7386, 37, 33, 96, 114, 14, 913, 15, 50, 7710, 3, 2, 6, 2, 1, 2, 296, 10, 0, 30, 2, 3, 0, 15, 4, 8, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 340, 2, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 129, 15, 6, 55, 50, 49, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 208, 30, 2, 2, 2, 1, 2, 6, 3, 4, 10, 1, 225, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4382, 2, 5773, 3, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 8489, 39815, 11327];
    nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7-\u05C9\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B53-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1AF0\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65";
    nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0558\u0559\u0560-\u0588\u058B\u058C\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088F\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5C\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDC-\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u208F-\u209F\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DD\uA7E2\uA7F1-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB6C\uAB6D\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
    reservedWords = {
      3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
      5: "class enum extends super const export import",
      6: "enum",
      strict: "implements interface let package private protected public static yield",
      strictBind: "eval arguments"
    };
    ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
    keywords$1 = {
      5: ecma5AndLessKeywords,
      "5module": ecma5AndLessKeywords + " export import",
      6: ecma5AndLessKeywords + " const class extends export import super"
    };
    keywordRelationalOperator = /^in(stanceof)?$/;
    nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    TokenType = function TokenType2(label, conf) {
      if (conf === void 0) conf = {};
      this.label = label;
      this.keyword = conf.keyword;
      this.beforeExpr = !!conf.beforeExpr;
      this.startsExpr = !!conf.startsExpr;
      this.isLoop = !!conf.isLoop;
      this.isAssign = !!conf.isAssign;
      this.prefix = !!conf.prefix;
      this.postfix = !!conf.postfix;
      this.binop = conf.binop || null;
      this.updateContext = null;
    };
    beforeExpr = { beforeExpr: true };
    startsExpr = { startsExpr: true };
    keywords = {};
    types$1 = {
      num: new TokenType("num", startsExpr),
      regexp: new TokenType("regexp", startsExpr),
      string: new TokenType("string", startsExpr),
      name: new TokenType("name", startsExpr),
      privateId: new TokenType("privateId", startsExpr),
      eof: new TokenType("eof"),
      // Punctuation token types.
      bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
      bracketR: new TokenType("]"),
      braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
      braceR: new TokenType("}"),
      parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
      parenR: new TokenType(")"),
      comma: new TokenType(",", beforeExpr),
      semi: new TokenType(";", beforeExpr),
      colon: new TokenType(":", beforeExpr),
      dot: new TokenType("."),
      question: new TokenType("?", beforeExpr),
      questionDot: new TokenType("?."),
      arrow: new TokenType("=>", beforeExpr),
      template: new TokenType("template"),
      invalidTemplate: new TokenType("invalidTemplate"),
      ellipsis: new TokenType("...", beforeExpr),
      backQuote: new TokenType("`", startsExpr),
      dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
      // Operators. These carry several kinds of properties to help the
      // parser use them properly (the presence of these properties is
      // what categorizes them as operators).
      //
      // `binop`, when present, specifies that this operator is a binary
      // operator, and will refer to its precedence.
      //
      // `prefix` and `postfix` mark the operator as a prefix or postfix
      // unary operator.
      //
      // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
      // binary operators with a very low precedence, that should result
      // in AssignmentExpression nodes.
      eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
      assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
      incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
      prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
      logicalOR: binop("||", 1),
      logicalAND: binop("&&", 2),
      bitwiseOR: binop("|", 3),
      bitwiseXOR: binop("^", 4),
      bitwiseAND: binop("&", 5),
      equality: binop("==/!=/===/!==", 6),
      relational: binop("</>/<=/>=", 7),
      bitShift: binop("<</>>/>>>", 8),
      plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
      modulo: binop("%", 10),
      star: binop("*", 10),
      slash: binop("/", 10),
      starstar: new TokenType("**", { beforeExpr: true }),
      coalesce: binop("??", 1),
      // Keyword token types.
      _break: kw("break"),
      _case: kw("case", beforeExpr),
      _catch: kw("catch"),
      _continue: kw("continue"),
      _debugger: kw("debugger"),
      _default: kw("default", beforeExpr),
      _do: kw("do", { isLoop: true, beforeExpr: true }),
      _else: kw("else", beforeExpr),
      _finally: kw("finally"),
      _for: kw("for", { isLoop: true }),
      _function: kw("function", startsExpr),
      _if: kw("if"),
      _return: kw("return", beforeExpr),
      _switch: kw("switch"),
      _throw: kw("throw", beforeExpr),
      _try: kw("try"),
      _var: kw("var"),
      _const: kw("const"),
      _while: kw("while", { isLoop: true }),
      _with: kw("with"),
      _new: kw("new", { beforeExpr: true, startsExpr: true }),
      _this: kw("this", startsExpr),
      _super: kw("super", startsExpr),
      _class: kw("class", startsExpr),
      _extends: kw("extends", beforeExpr),
      _export: kw("export"),
      _import: kw("import", startsExpr),
      _null: kw("null", startsExpr),
      _true: kw("true", startsExpr),
      _false: kw("false", startsExpr),
      _in: kw("in", { beforeExpr: true, binop: 7 }),
      _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
      _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
      _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
      _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
    };
    lineBreak = /\r\n?|\n|\u2028|\u2029/;
    lineBreakG = new RegExp(lineBreak.source, "g");
    nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
    skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
    ref = Object.prototype;
    hasOwnProperty = ref.hasOwnProperty;
    toString = ref.toString;
    hasOwn = Object.hasOwn || (function(obj, propName) {
      return hasOwnProperty.call(obj, propName);
    });
    isArray = Array.isArray || (function(obj) {
      return toString.call(obj) === "[object Array]";
    });
    regexpCache = /* @__PURE__ */ Object.create(null);
    loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
    Position = function Position2(line, col) {
      this.line = line;
      this.column = col;
    };
    Position.prototype.offset = function offset(n) {
      return new Position(this.line, this.column + n);
    };
    SourceLocation = function SourceLocation2(p, start, end) {
      this.start = start;
      this.end = end;
      if (p.sourceFile !== null) {
        this.source = p.sourceFile;
      }
    };
    defaultOptions = {
      // `ecmaVersion` indicates the ECMAScript version to parse. Must be
      // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
      // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
      // (the latest version the library supports). This influences
      // support for strict mode, the set of reserved words, and support
      // for new syntax features.
      ecmaVersion: null,
      // `sourceType` indicates the mode the code should be parsed in.
      // Can be either `"script"`, `"module"` or `"commonjs"`. This influences global
      // strict mode and parsing of `import` and `export` declarations.
      sourceType: "script",
      // When set to true, enable strict parsing mode even if `sourceType`
      // is `"script"`.
      strict: false,
      // `onInsertedSemicolon` can be a callback that will be called when
      // a semicolon is automatically inserted. It will be passed the
      // position of the inserted semicolon as an offset, and if
      // `locations` is enabled, it is given the location as a `{line,
      // column}` object as second argument.
      onInsertedSemicolon: null,
      // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
      // trailing commas.
      onTrailingComma: null,
      // By default, reserved words are only enforced if ecmaVersion >= 5.
      // Set `allowReserved` to a boolean value to explicitly turn this on
      // an off. When this option has the value "never", reserved words
      // and keywords can also not be used as property names.
      allowReserved: null,
      // When enabled, a return at the top level is not considered an
      // error.
      allowReturnOutsideFunction: false,
      // When enabled, import/export statements are not constrained to
      // appearing at the top of the program, and an import.meta expression
      // in a script isn't considered an error.
      allowImportExportEverywhere: false,
      // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
      // When enabled, await identifiers are allowed to appear at the top-level scope,
      // but they are still not allowed in non-async functions.
      allowAwaitOutsideFunction: null,
      // When enabled, super identifiers are not constrained to
      // appearing in methods and do not raise an error when they appear elsewhere.
      allowSuperOutsideMethod: null,
      // When enabled, hashbang directive in the beginning of file is
      // allowed and treated as a line comment. Enabled by default when
      // `ecmaVersion` >= 2023.
      allowHashBang: false,
      // By default, the parser will verify that private properties are
      // only used in places where they are valid and have been declared.
      // Set this to false to turn such checks off.
      checkPrivateFields: true,
      // When `locations` is on, `loc` properties holding objects with
      // `start` and `end` properties in `{line, column}` form (with
      // line being 1-based and column 0-based) will be attached to the
      // nodes.
      locations: false,
      // Pass an optional `{line, column}` object to use for the start of
      // the parse. This is mostly useful when using `parseExpressionAt`
      // with `locations: true`, to prevent the parser from having to
      // determine the line position at the start position.
      startLocation: null,
      // A function can be passed as `onToken` option, which will
      // cause Acorn to call that function with object in the same
      // format as tokens returned from `tokenizer().getToken()`. Note
      // that you are not allowed to call the parser from the
      // callback—that will corrupt its internal state.
      onToken: null,
      // A function can be passed as `onComment` option, which will
      // cause Acorn to call that function with `(block, text, start,
      // end)` parameters whenever a comment is skipped. `block` is a
      // boolean indicating whether this is a block (`/* */`) comment,
      // `text` is the content of the comment, and `start` and `end` are
      // character offsets that denote the start and end of the comment.
      // When the `locations` option is on, two more parameters are
      // passed, the full `{line, column}` locations of the start and
      // end of the comments. Note that you are not allowed to call the
      // parser from the callback—that will corrupt its internal state.
      // When this option has an array as value, objects representing the
      // comments are pushed to it.
      onComment: null,
      // Nodes have their start and end characters offsets recorded in
      // `start` and `end` properties (directly on the node, rather than
      // the `loc` object, which holds line/column data. To also add a
      // [semi-standardized][range] `range` property holding a `[start,
      // end]` array with the same numbers, set the `ranges` option to
      // `true`.
      //
      // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
      ranges: false,
      // It is possible to parse multiple files into a single AST by
      // passing the tree produced by parsing the first file as
      // `program` option in subsequent parses. This will add the
      // toplevel forms of the parsed file to the `Program` (top) node
      // of an existing parse tree.
      program: null,
      // When `locations` is on, you can pass this to record the source
      // file in every node's `loc` object.
      sourceFile: null,
      // This value, if given, is stored in every node, whether
      // `locations` is on or off.
      directSourceFile: null,
      // When enabled, parenthesized expressions are represented by
      // (non-standard) ParenthesizedExpression nodes
      preserveParens: false
    };
    warnedAboutEcmaVersion = false;
    SCOPE_TOP = 1;
    SCOPE_FUNCTION = 2;
    SCOPE_ASYNC = 4;
    SCOPE_GENERATOR = 8;
    SCOPE_ARROW = 16;
    SCOPE_SIMPLE_CATCH = 32;
    SCOPE_SUPER = 64;
    SCOPE_DIRECT_SUPER = 128;
    SCOPE_CLASS_STATIC_BLOCK = 256;
    SCOPE_CLASS_FIELD_INIT = 512;
    SCOPE_SWITCH = 1024;
    SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
    BIND_NONE = 0;
    BIND_VAR = 1;
    BIND_LEXICAL = 2;
    BIND_FUNCTION = 3;
    BIND_SIMPLE_CATCH = 4;
    BIND_OUTSIDE = 5;
    Parser = function Parser2(options2, input, startPos) {
      this.options = options2 = getOptions(options2);
      this.sourceFile = options2.sourceFile;
      this.keywords = wordsRegexp(keywords$1[options2.ecmaVersion >= 6 ? 6 : options2.sourceType === "module" ? "5module" : 5]);
      var reserved = "";
      if (options2.allowReserved !== true) {
        reserved = reservedWords[options2.ecmaVersion >= 6 ? 6 : options2.ecmaVersion === 5 ? 5 : 3];
        if (options2.sourceType === "module") {
          reserved += " await";
        }
      }
      this.reservedWords = wordsRegexp(reserved);
      var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
      this.reservedWordsStrict = wordsRegexp(reservedStrict);
      this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
      this.input = String(input);
      this.containsEsc = false;
      this.pos = startPos || 0;
      this.curLine = 1;
      if (options2.startLocation) {
        this.lineStart = this.pos - options2.startLocation.column;
        this.curLine = options2.startLocation.line;
      } else if (startPos) {
        this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
        if (this.options.locations) {
          this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
        }
      } else {
        this.lineStart = 0;
      }
      this.type = types$1.eof;
      this.value = null;
      this.start = this.end = this.pos;
      this.startLoc = this.endLoc = this.curPosition();
      this.lastTokEndLoc = this.lastTokStartLoc = null;
      this.lastTokStart = this.lastTokEnd = this.pos;
      this.context = this.initialContext();
      this.exprAllowed = true;
      this.inModule = options2.sourceType === "module";
      this.strict = this.inModule || options2.strict === true || this.strictDirective(this.pos);
      this.potentialArrowAt = -1;
      this.potentialArrowInForAwait = false;
      this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
      this.labels = [];
      this.undefinedExports = /* @__PURE__ */ Object.create(null);
      if (this.pos === 0 && options2.allowHashBang && this.input.slice(0, 2) === "#!") {
        this.skipLineComment(2);
      }
      this.scopeStack = [];
      this.enterScope(
        this.options.sourceType === "commonjs" ? SCOPE_FUNCTION : SCOPE_TOP
      );
      this.regexpState = null;
      this.privateNameStack = [];
    };
    prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowReturn: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, allowUsing: { configurable: true }, inClassStaticBlock: { configurable: true } };
    Parser.prototype.parse = function parse() {
      var this$1$1 = this;
      var node = this.options.program || this.startNode();
      this.nextToken();
      return this.catchStackOverflow(function() {
        return this$1$1.parseTopLevel(node);
      });
    };
    prototypeAccessors.inFunction.get = function() {
      return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
    };
    prototypeAccessors.inGenerator.get = function() {
      return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
    };
    prototypeAccessors.inAsync.get = function() {
      return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
    };
    prototypeAccessors.canAwait.get = function() {
      for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
        var ref2 = this.scopeStack[i2];
        var flags = ref2.flags;
        if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT)) {
          return false;
        }
        if (flags & SCOPE_FUNCTION) {
          return (flags & SCOPE_ASYNC) > 0;
        }
      }
      return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
    };
    prototypeAccessors.allowReturn.get = function() {
      if (this.inFunction) {
        return true;
      }
      if (this.options.allowReturnOutsideFunction && this.currentVarScope().flags & SCOPE_TOP) {
        return true;
      }
      return false;
    };
    prototypeAccessors.allowSuper.get = function() {
      var ref2 = this.currentThisScope();
      var flags = ref2.flags;
      return (flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
    };
    prototypeAccessors.allowDirectSuper.get = function() {
      return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
    };
    prototypeAccessors.treatFunctionsAsVar.get = function() {
      return this.treatFunctionsAsVarInScope(this.currentScope());
    };
    prototypeAccessors.allowNewDotTarget.get = function() {
      for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
        var ref2 = this.scopeStack[i2];
        var flags = ref2.flags;
        if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW)) {
          return true;
        }
      }
      return false;
    };
    prototypeAccessors.allowUsing.get = function() {
      var ref2 = this.currentScope();
      var flags = ref2.flags;
      if (flags & SCOPE_SWITCH) {
        return false;
      }
      if (!this.inModule && flags & SCOPE_TOP) {
        return false;
      }
      return true;
    };
    prototypeAccessors.inClassStaticBlock.get = function() {
      return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
    };
    Parser.extend = function extend() {
      var plugins = [], len = arguments.length;
      while (len--) plugins[len] = arguments[len];
      var cls = this;
      for (var i2 = 0; i2 < plugins.length; i2++) {
        cls = plugins[i2](cls);
      }
      return cls;
    };
    Parser.parse = function parse2(input, options2) {
      return new this(options2, input).parse();
    };
    Parser.parseExpressionAt = function parseExpressionAt(input, pos, options2) {
      var parser = new this(options2, input, pos);
      parser.nextToken();
      return parser.parseExpression();
    };
    Parser.tokenizer = function tokenizer(input, options2) {
      return new this(options2, input);
    };
    Object.defineProperties(Parser.prototype, prototypeAccessors);
    pp$9 = Parser.prototype;
    literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
    pp$9.strictDirective = function(start) {
      if (this.options.ecmaVersion < 5) {
        return false;
      }
      for (; ; ) {
        skipWhiteSpace.lastIndex = start;
        start += skipWhiteSpace.exec(this.input)[0].length;
        var match = literal.exec(this.input.slice(start));
        if (!match) {
          return false;
        }
        if ((match[1] || match[2]) === "use strict") {
          skipWhiteSpace.lastIndex = start + match[0].length;
          var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
          var next = this.input.charAt(end);
          return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=" || next === "i" && keywordOpAt(this, end));
        }
        start += match[0].length;
        skipWhiteSpace.lastIndex = start;
        start += skipWhiteSpace.exec(this.input)[0].length;
        if (this.input[start] === ";") {
          start++;
        }
      }
    };
    pp$9.eat = function(type) {
      if (this.type === type) {
        this.next();
        return true;
      } else {
        return false;
      }
    };
    pp$9.isContextual = function(name) {
      return this.type === types$1.name && this.value === name && !this.containsEsc;
    };
    pp$9.eatContextual = function(name) {
      if (!this.isContextual(name)) {
        return false;
      }
      this.next();
      return true;
    };
    pp$9.catchStackOverflow = function(f) {
      try {
        return f();
      } catch (e) {
        if (e instanceof Error && (/\bstack\b.*\b(exceeded|overflow)\b/i.test(e.message) || /\btoo much recursion\b/i.test(e.message))) {
          this.raise(this.start, "Not enough stack space to parse input");
        } else {
          throw e;
        }
      }
    };
    pp$9.expectContextual = function(name) {
      if (!this.eatContextual(name)) {
        this.unexpected();
      }
    };
    pp$9.canInsertSemicolon = function() {
      return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
    };
    pp$9.insertSemicolon = function() {
      if (this.canInsertSemicolon()) {
        if (this.options.onInsertedSemicolon) {
          this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
        }
        return true;
      }
    };
    pp$9.semicolon = function() {
      if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
        this.unexpected();
      }
    };
    pp$9.afterTrailingComma = function(tokType, notNext) {
      if (this.type === tokType) {
        if (this.options.onTrailingComma) {
          this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
        }
        if (!notNext) {
          this.next();
        }
        return true;
      }
    };
    pp$9.expect = function(type) {
      this.eat(type) || this.unexpected();
    };
    pp$9.unexpected = function(pos) {
      this.raise(pos != null ? pos : this.start, "Unexpected token");
    };
    DestructuringErrors = function DestructuringErrors2() {
      this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
    };
    pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
      if (!refDestructuringErrors) {
        return;
      }
      if (refDestructuringErrors.trailingComma > -1) {
        this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
      }
      var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
      if (parens > -1) {
        this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
      }
    };
    pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
      if (!refDestructuringErrors) {
        return false;
      }
      var shorthandAssign = refDestructuringErrors.shorthandAssign;
      var doubleProto = refDestructuringErrors.doubleProto;
      if (!andThrow) {
        return shorthandAssign >= 0 || doubleProto >= 0;
      }
      if (shorthandAssign >= 0) {
        this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
      }
      if (doubleProto >= 0) {
        this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
      }
    };
    pp$9.checkYieldAwaitInDefaultParams = function() {
      if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
        this.raise(this.yieldPos, "Yield expression cannot be a default value");
      }
      if (this.awaitPos) {
        this.raise(this.awaitPos, "Await expression cannot be a default value");
      }
    };
    pp$9.isSimpleAssignTarget = function(expr) {
      if (expr.type === "ParenthesizedExpression") {
        return this.isSimpleAssignTarget(expr.expression);
      }
      return expr.type === "Identifier" || expr.type === "MemberExpression";
    };
    pp$8 = Parser.prototype;
    pp$8.parseTopLevel = function(node) {
      var exports$1 = /* @__PURE__ */ Object.create(null);
      if (!node.body) {
        node.body = [];
      }
      while (this.type !== types$1.eof) {
        var stmt = this.parseStatement(null, true, exports$1);
        node.body.push(stmt);
      }
      if (this.inModule) {
        for (var i2 = 0, list2 = Object.keys(this.undefinedExports); i2 < list2.length; i2 += 1) {
          var name = list2[i2];
          this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
        }
      }
      this.adaptDirectivePrologue(node.body);
      this.next();
      node.sourceType = this.options.sourceType === "commonjs" ? "script" : this.options.sourceType;
      return this.finishNode(node, "Program");
    };
    loopLabel = { kind: "loop" };
    switchLabel = { kind: "switch" };
    pp$8.isLet = function(context) {
      if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
        return false;
      }
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, nextCh = this.fullCharCodeAt(next);
      if (nextCh === 91 || nextCh === 92) {
        return true;
      }
      if (context) {
        return false;
      }
      if (nextCh === 123) {
        return true;
      }
      if (isIdentifierStart(nextCh)) {
        var start = next;
        do {
          next += nextCh <= 65535 ? 1 : 2;
        } while (isIdentifierChar(nextCh = this.fullCharCodeAt(next)));
        if (nextCh === 92) {
          return true;
        }
        var ident = this.input.slice(start, next);
        if (!keywordRelationalOperator.test(ident)) {
          return true;
        }
      }
      return false;
    };
    pp$8.isAsyncFunction = function() {
      if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
        return false;
      }
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, after;
      return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.fullCharCodeAt(next + 8)) || after === 92));
    };
    pp$8.isUsingKeyword = function(isAwaitUsing, isFor) {
      if (this.options.ecmaVersion < 17 || !this.isContextual(isAwaitUsing ? "await" : "using")) {
        return false;
      }
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length;
      if (lineBreak.test(this.input.slice(this.pos, next))) {
        return false;
      }
      if (isAwaitUsing) {
        var usingEndPos = next + 5, after;
        if (this.input.slice(next, usingEndPos) !== "using" || usingEndPos === this.input.length || isIdentifierChar(after = this.fullCharCodeAt(usingEndPos)) || after === 92) {
          return false;
        }
        skipWhiteSpace.lastIndex = usingEndPos;
        var skipAfterUsing = skipWhiteSpace.exec(this.input);
        next = usingEndPos + skipAfterUsing[0].length;
        if (skipAfterUsing && lineBreak.test(this.input.slice(usingEndPos, next))) {
          return false;
        }
      }
      var ch = this.fullCharCodeAt(next);
      if (!isIdentifierStart(ch) && ch !== 92) {
        return false;
      }
      var idStart = next;
      do {
        next += ch <= 65535 ? 1 : 2;
      } while (isIdentifierChar(ch = this.fullCharCodeAt(next)));
      if (ch === 92) {
        return true;
      }
      var id = this.input.slice(idStart, next);
      if (keywordRelationalOperator.test(id)) {
        return false;
      }
      if (isFor && !isAwaitUsing && id === "of") {
        skipWhiteSpace.lastIndex = next;
        var skipAfterOf = skipWhiteSpace.exec(this.input);
        next = next + skipAfterOf[0].length;
        if (this.input.charCodeAt(next) !== 61 || // Check for ==, === and => operators
        (ch = this.input.charCodeAt(next + 1)) === 61 || ch === 62) {
          return false;
        }
      }
      return true;
    };
    pp$8.isAwaitUsing = function(isFor) {
      return this.isUsingKeyword(true, isFor);
    };
    pp$8.isUsing = function(isFor) {
      return this.isUsingKeyword(false, isFor);
    };
    pp$8.parseStatement = function(context, topLevel, exports$1) {
      var starttype = this.type, node = this.startNode(), kind;
      if (this.isLet(context)) {
        starttype = types$1._var;
        kind = "let";
      }
      switch (starttype) {
        case types$1._break:
        case types$1._continue:
          return this.parseBreakContinueStatement(node, starttype.keyword);
        case types$1._debugger:
          return this.parseDebuggerStatement(node);
        case types$1._do:
          return this.parseDoStatement(node);
        case types$1._for:
          return this.parseForStatement(node);
        case types$1._function:
          if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
            this.unexpected();
          }
          return this.parseFunctionStatement(node, false, !context);
        case types$1._class:
          if (context) {
            this.unexpected();
          }
          return this.parseClass(node, true);
        case types$1._if:
          return this.parseIfStatement(node);
        case types$1._return:
          return this.parseReturnStatement(node);
        case types$1._switch:
          return this.parseSwitchStatement(node);
        case types$1._throw:
          return this.parseThrowStatement(node);
        case types$1._try:
          return this.parseTryStatement(node);
        case types$1._const:
        case types$1._var:
          kind = kind || this.value;
          if (context && kind !== "var") {
            this.unexpected();
          }
          return this.parseVarStatement(node, kind);
        case types$1._while:
          return this.parseWhileStatement(node);
        case types$1._with:
          return this.parseWithStatement(node);
        case types$1.braceL:
          return this.parseBlock(true, node);
        case types$1.semi:
          return this.parseEmptyStatement(node);
        case types$1._export:
        case types$1._import:
          if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
            skipWhiteSpace.lastIndex = this.pos;
            var skip = skipWhiteSpace.exec(this.input);
            var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
            if (nextCh === 40 || nextCh === 46) {
              return this.parseExpressionStatement(node, this.parseExpression());
            }
          }
          if (!this.options.allowImportExportEverywhere) {
            if (!topLevel) {
              this.raise(this.start, "'import' and 'export' may only appear at the top level");
            }
            if (!this.inModule) {
              this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
            }
          }
          return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports$1);
        // If the statement does not start with a statement keyword or a
        // brace, it's an ExpressionStatement or LabeledStatement. We
        // simply start parsing an expression, and afterwards, if the
        // next token is a colon and the expression was a simple
        // Identifier node, we switch to interpreting it as a label.
        default:
          if (this.isAsyncFunction()) {
            if (context) {
              this.unexpected();
            }
            this.next();
            return this.parseFunctionStatement(node, true, !context);
          }
          var usingKind = this.isAwaitUsing(false) ? "await using" : this.isUsing(false) ? "using" : null;
          if (usingKind) {
            if (!this.allowUsing) {
              this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement");
            }
            if (context) {
              this.raise(this.start, "Using declaration is not allowed in single-statement positions");
            }
            if (usingKind === "await using") {
              if (!this.canAwait) {
                this.raise(this.start, "Await using cannot appear outside of async function");
              }
              this.next();
            }
            this.next();
            this.parseVar(node, false, usingKind);
            this.semicolon();
            return this.finishNode(node, "VariableDeclaration");
          }
          var maybeName = this.value, expr = this.parseExpression();
          if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
            return this.parseLabeledStatement(node, maybeName, expr, context);
          } else {
            return this.parseExpressionStatement(node, expr);
          }
      }
    };
    pp$8.parseBreakContinueStatement = function(node, keyword) {
      var isBreak = keyword === "break";
      this.next();
      if (this.eat(types$1.semi) || this.insertSemicolon()) {
        node.label = null;
      } else if (this.type !== types$1.name) {
        this.unexpected();
      } else {
        node.label = this.parseIdent();
        this.semicolon();
      }
      var i2 = 0;
      for (; i2 < this.labels.length; ++i2) {
        var lab = this.labels[i2];
        if (node.label == null || lab.name === node.label.name) {
          if (lab.kind != null && (isBreak || lab.kind === "loop")) {
            break;
          }
          if (node.label && isBreak) {
            break;
          }
        }
      }
      if (i2 === this.labels.length) {
        this.raise(node.start, "Unsyntactic " + keyword);
      }
      return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
    };
    pp$8.parseDebuggerStatement = function(node) {
      this.next();
      this.semicolon();
      return this.finishNode(node, "DebuggerStatement");
    };
    pp$8.parseDoStatement = function(node) {
      this.next();
      this.labels.push(loopLabel);
      node.body = this.parseStatement("do");
      this.labels.pop();
      this.expect(types$1._while);
      node.test = this.parseParenExpression();
      if (this.options.ecmaVersion >= 6) {
        this.eat(types$1.semi);
      } else {
        this.semicolon();
      }
      return this.finishNode(node, "DoWhileStatement");
    };
    pp$8.parseForStatement = function(node) {
      this.next();
      var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
      this.labels.push(loopLabel);
      this.enterScope(0);
      this.expect(types$1.parenL);
      if (this.type === types$1.semi) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
        return this.parseFor(node, null);
      }
      var isLet = this.isLet();
      if (this.type === types$1._var || this.type === types$1._const || isLet) {
        var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
        this.next();
        this.parseVar(init$1, true, kind);
        this.finishNode(init$1, "VariableDeclaration");
        return this.parseForAfterInit(node, init$1, awaitAt);
      }
      var startsWithLet = this.isContextual("let"), isForOf = false;
      var usingKind = this.isUsing(true) ? "using" : this.isAwaitUsing(true) ? "await using" : null;
      if (usingKind) {
        var init$2 = this.startNode();
        this.next();
        if (usingKind === "await using") {
          if (!this.canAwait) {
            this.raise(this.start, "Await using cannot appear outside of async function");
          }
          this.next();
        }
        this.parseVar(init$2, true, usingKind);
        this.finishNode(init$2, "VariableDeclaration");
        return this.parseForAfterInit(node, init$2, awaitAt);
      }
      var containsEsc = this.containsEsc;
      var refDestructuringErrors = new DestructuringErrors();
      var initPos = this.start;
      var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
      if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
        if (awaitAt > -1) {
          if (this.type === types$1._in) {
            this.unexpected(awaitAt);
          }
          node.await = true;
        } else if (isForOf && this.options.ecmaVersion >= 8) {
          if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") {
            this.unexpected();
          } else if (this.options.ecmaVersion >= 9) {
            node.await = false;
          }
        }
        if (startsWithLet && isForOf) {
          this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
        }
        this.toAssignable(init, false, refDestructuringErrors);
        this.checkLValPattern(init);
        return this.parseForIn(node, init);
      } else {
        this.checkExpressionErrors(refDestructuringErrors, true);
      }
      if (awaitAt > -1) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, init);
    };
    pp$8.parseForAfterInit = function(node, init, awaitAt) {
      if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init.declarations.length === 1) {
        if (this.type === types$1._in) {
          if ((init.kind === "using" || init.kind === "await using") && !init.declarations[0].init) {
            this.raise(this.start, "Using declaration is not allowed in for-in loops");
          }
          if (this.options.ecmaVersion >= 9 && awaitAt > -1) {
            this.unexpected(awaitAt);
          }
        } else if (this.options.ecmaVersion >= 9) {
          node.await = awaitAt > -1;
        }
        return this.parseForIn(node, init);
      }
      if (awaitAt > -1) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, init);
    };
    pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
      this.next();
      return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
    };
    pp$8.parseIfStatement = function(node) {
      this.next();
      node.test = this.parseParenExpression();
      node.consequent = this.parseStatement("if");
      node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
      return this.finishNode(node, "IfStatement");
    };
    pp$8.parseReturnStatement = function(node) {
      if (!this.allowReturn) {
        this.raise(this.start, "'return' outside of function");
      }
      this.next();
      if (this.eat(types$1.semi) || this.insertSemicolon()) {
        node.argument = null;
      } else {
        node.argument = this.parseExpression();
        this.semicolon();
      }
      return this.finishNode(node, "ReturnStatement");
    };
    pp$8.parseSwitchStatement = function(node) {
      this.next();
      node.discriminant = this.parseParenExpression();
      node.cases = [];
      this.expect(types$1.braceL);
      this.labels.push(switchLabel);
      this.enterScope(SCOPE_SWITCH);
      var cur;
      for (var sawDefault = false; this.type !== types$1.braceR; ) {
        if (this.type === types$1._case || this.type === types$1._default) {
          var isCase = this.type === types$1._case;
          if (cur) {
            this.finishNode(cur, "SwitchCase");
          }
          node.cases.push(cur = this.startNode());
          cur.consequent = [];
          this.next();
          if (isCase) {
            cur.test = this.parseExpression();
          } else {
            if (sawDefault) {
              this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
            }
            sawDefault = true;
            cur.test = null;
          }
          this.expect(types$1.colon);
        } else {
          if (!cur) {
            this.unexpected();
          }
          cur.consequent.push(this.parseStatement(null));
        }
      }
      this.exitScope();
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      this.next();
      this.labels.pop();
      return this.finishNode(node, "SwitchStatement");
    };
    pp$8.parseThrowStatement = function(node) {
      this.next();
      if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
        this.raise(this.lastTokEnd, "Illegal newline after throw");
      }
      node.argument = this.parseExpression();
      this.semicolon();
      return this.finishNode(node, "ThrowStatement");
    };
    empty$1 = [];
    pp$8.parseCatchClauseParam = function() {
      var param = this.parseBindingAtom();
      var simple = param.type === "Identifier";
      this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
      this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
      this.expect(types$1.parenR);
      return param;
    };
    pp$8.parseTryStatement = function(node) {
      this.next();
      node.block = this.parseBlock();
      node.handler = null;
      if (this.type === types$1._catch) {
        var clause = this.startNode();
        this.next();
        if (this.eat(types$1.parenL)) {
          clause.param = this.parseCatchClauseParam();
        } else {
          if (this.options.ecmaVersion < 10) {
            this.unexpected();
          }
          clause.param = null;
          this.enterScope(0);
        }
        clause.body = this.parseBlock(false);
        this.exitScope();
        node.handler = this.finishNode(clause, "CatchClause");
      }
      node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
      if (!node.handler && !node.finalizer) {
        this.raise(node.start, "Missing catch or finally clause");
      }
      return this.finishNode(node, "TryStatement");
    };
    pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
      this.next();
      this.parseVar(node, false, kind, allowMissingInitializer);
      this.semicolon();
      return this.finishNode(node, "VariableDeclaration");
    };
    pp$8.parseWhileStatement = function(node) {
      this.next();
      node.test = this.parseParenExpression();
      this.labels.push(loopLabel);
      node.body = this.parseStatement("while");
      this.labels.pop();
      return this.finishNode(node, "WhileStatement");
    };
    pp$8.parseWithStatement = function(node) {
      if (this.strict) {
        this.raise(this.start, "'with' in strict mode");
      }
      this.next();
      node.object = this.parseParenExpression();
      node.body = this.parseStatement("with");
      return this.finishNode(node, "WithStatement");
    };
    pp$8.parseEmptyStatement = function(node) {
      this.next();
      return this.finishNode(node, "EmptyStatement");
    };
    pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
      for (var i$1 = 0, list2 = this.labels; i$1 < list2.length; i$1 += 1) {
        var label = list2[i$1];
        if (label.name === maybeName) {
          this.raise(expr.start, "Label '" + maybeName + "' is already declared");
        }
      }
      var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
      for (var i2 = this.labels.length - 1; i2 >= 0; i2--) {
        var label$1 = this.labels[i2];
        if (label$1.statementStart === node.start) {
          label$1.statementStart = this.start;
          label$1.kind = kind;
        } else {
          break;
        }
      }
      this.labels.push({ name: maybeName, kind, statementStart: this.start });
      node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
      this.labels.pop();
      node.label = expr;
      return this.finishNode(node, "LabeledStatement");
    };
    pp$8.parseExpressionStatement = function(node, expr) {
      node.expression = expr;
      this.semicolon();
      return this.finishNode(node, "ExpressionStatement");
    };
    pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
      if (createNewLexicalScope === void 0) createNewLexicalScope = true;
      if (node === void 0) node = this.startNode();
      node.body = [];
      this.expect(types$1.braceL);
      if (createNewLexicalScope) {
        this.enterScope(0);
      }
      while (this.type !== types$1.braceR) {
        var stmt = this.parseStatement(null);
        node.body.push(stmt);
      }
      if (exitStrict) {
        this.strict = false;
      }
      this.next();
      if (createNewLexicalScope) {
        this.exitScope();
      }
      return this.finishNode(node, "BlockStatement");
    };
    pp$8.parseFor = function(node, init) {
      node.init = init;
      this.expect(types$1.semi);
      node.test = this.type === types$1.semi ? null : this.parseExpression();
      this.expect(types$1.semi);
      node.update = this.type === types$1.parenR ? null : this.parseExpression();
      this.expect(types$1.parenR);
      node.body = this.parseStatement("for");
      this.exitScope();
      this.labels.pop();
      return this.finishNode(node, "ForStatement");
    };
    pp$8.parseForIn = function(node, init) {
      var isForIn = this.type === types$1._in;
      this.next();
      if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
        this.raise(
          init.start,
          (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
        );
      }
      node.left = init;
      node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
      this.expect(types$1.parenR);
      node.body = this.parseStatement("for");
      this.exitScope();
      this.labels.pop();
      return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
    };
    pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
      node.declarations = [];
      node.kind = kind;
      for (; ; ) {
        var decl = this.startNode();
        this.parseVarId(decl, kind);
        if (this.eat(types$1.eq)) {
          decl.init = this.parseMaybeAssign(isFor);
        } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
          this.unexpected();
        } else if (!allowMissingInitializer && (kind === "using" || kind === "await using") && this.options.ecmaVersion >= 17 && this.type !== types$1._in && !this.isContextual("of")) {
          this.raise(this.lastTokEnd, "Missing initializer in " + kind + " declaration");
        } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
          this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
        } else {
          decl.init = null;
        }
        node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
        if (!this.eat(types$1.comma)) {
          break;
        }
      }
      return node;
    };
    pp$8.parseVarId = function(decl, kind) {
      decl.id = kind === "using" || kind === "await using" ? this.parseIdent() : this.parseBindingAtom();
      this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
    };
    FUNC_STATEMENT = 1;
    FUNC_HANGING_STATEMENT = 2;
    FUNC_NULLABLE_ID = 4;
    pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
      this.initFunction(node);
      if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
        if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
          this.unexpected();
        }
        node.generator = this.eat(types$1.star);
      }
      if (this.options.ecmaVersion >= 8) {
        node.async = !!isAsync;
      }
      if (statement & FUNC_STATEMENT) {
        node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
        if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
          this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
        }
      }
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      this.enterScope(functionFlags(node.async, node.generator));
      if (!(statement & FUNC_STATEMENT)) {
        node.id = this.type === types$1.name ? this.parseIdent() : null;
      }
      this.parseFunctionParams(node);
      this.parseFunctionBody(node, allowExpressionBody, false, forInit);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
    };
    pp$8.parseFunctionParams = function(node) {
      this.expect(types$1.parenL);
      node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
      this.checkYieldAwaitInDefaultParams();
    };
    pp$8.parseClass = function(node, isStatement) {
      this.next();
      var oldStrict = this.strict;
      this.strict = true;
      this.parseClassId(node, isStatement);
      this.parseClassSuper(node);
      var privateNameMap = this.enterClassBody();
      var classBody = this.startNode();
      var hadConstructor = false;
      classBody.body = [];
      this.expect(types$1.braceL);
      while (this.type !== types$1.braceR) {
        var element = this.parseClassElement(node.superClass !== null);
        if (element) {
          classBody.body.push(element);
          if (element.type === "MethodDefinition" && element.kind === "constructor") {
            if (hadConstructor) {
              this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
            }
            hadConstructor = true;
          } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
            this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
          }
        }
      }
      this.strict = oldStrict;
      this.next();
      node.body = this.finishNode(classBody, "ClassBody");
      this.exitClassBody();
      return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
    };
    pp$8.parseClassElement = function(constructorAllowsSuper) {
      if (this.eat(types$1.semi)) {
        return null;
      }
      var ecmaVersion2 = this.options.ecmaVersion;
      var node = this.startNode();
      var keyName = "";
      var isGenerator = false;
      var isAsync = false;
      var kind = "method";
      var isStatic = false;
      if (this.eatContextual("static")) {
        if (ecmaVersion2 >= 13 && this.eat(types$1.braceL)) {
          this.parseClassStaticBlock(node);
          return node;
        }
        if (this.isClassElementNameStart() || this.type === types$1.star) {
          isStatic = true;
        } else {
          keyName = "static";
        }
      }
      node.static = isStatic;
      if (!keyName && ecmaVersion2 >= 8 && this.eatContextual("async")) {
        if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
          isAsync = true;
        } else {
          keyName = "async";
        }
      }
      if (!keyName && (ecmaVersion2 >= 9 || !isAsync) && this.eat(types$1.star)) {
        isGenerator = true;
      }
      if (!keyName && !isAsync && !isGenerator) {
        var lastValue = this.value;
        if (this.eatContextual("get") || this.eatContextual("set")) {
          if (this.isClassElementNameStart()) {
            kind = lastValue;
          } else {
            keyName = lastValue;
          }
        }
      }
      if (keyName) {
        node.computed = false;
        node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
        node.key.name = keyName;
        this.finishNode(node.key, "Identifier");
      } else {
        this.parseClassElementName(node);
      }
      if (ecmaVersion2 < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
        var isConstructor = !node.static && checkKeyName(node, "constructor");
        var allowsDirectSuper = isConstructor && constructorAllowsSuper;
        if (isConstructor && kind !== "method") {
          this.raise(node.key.start, "Constructor can't have get/set modifier");
        }
        node.kind = isConstructor ? "constructor" : kind;
        this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
      } else {
        this.parseClassField(node);
      }
      return node;
    };
    pp$8.isClassElementNameStart = function() {
      return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
    };
    pp$8.parseClassElementName = function(element) {
      if (this.type === types$1.privateId) {
        if (this.value === "constructor") {
          this.raise(this.start, "Classes can't have an element named '#constructor'");
        }
        element.computed = false;
        element.key = this.parsePrivateIdent();
      } else {
        this.parsePropertyName(element);
      }
    };
    pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
      var key = method.key;
      if (method.kind === "constructor") {
        if (isGenerator) {
          this.raise(key.start, "Constructor can't be a generator");
        }
        if (isAsync) {
          this.raise(key.start, "Constructor can't be an async method");
        }
      } else if (method.static && checkKeyName(method, "prototype")) {
        this.raise(key.start, "Classes may not have a static property named prototype");
      }
      var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
      if (method.kind === "get" && value.params.length !== 0) {
        this.raiseRecoverable(value.start, "getter should have no params");
      }
      if (method.kind === "set" && value.params.length !== 1) {
        this.raiseRecoverable(value.start, "setter should have exactly one param");
      }
      if (method.kind === "set" && value.params[0].type === "RestElement") {
        this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
      }
      return this.finishNode(method, "MethodDefinition");
    };
    pp$8.parseClassField = function(field) {
      if (checkKeyName(field, "constructor")) {
        this.raise(field.key.start, "Classes can't have a field named 'constructor'");
      } else if (field.static && checkKeyName(field, "prototype")) {
        this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
      }
      if (this.eat(types$1.eq)) {
        this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER);
        field.value = this.parseMaybeAssign();
        this.exitScope();
      } else {
        field.value = null;
      }
      this.semicolon();
      return this.finishNode(field, "PropertyDefinition");
    };
    pp$8.parseClassStaticBlock = function(node) {
      node.body = [];
      var oldLabels = this.labels;
      this.labels = [];
      this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
      while (this.type !== types$1.braceR) {
        var stmt = this.parseStatement(null);
        node.body.push(stmt);
      }
      this.next();
      this.exitScope();
      this.labels = oldLabels;
      return this.finishNode(node, "StaticBlock");
    };
    pp$8.parseClassId = function(node, isStatement) {
      if (this.type === types$1.name) {
        node.id = this.parseIdent();
        if (isStatement) {
          this.checkLValSimple(node.id, BIND_LEXICAL, false);
        }
      } else {
        if (isStatement === true) {
          this.unexpected();
        }
        node.id = null;
      }
    };
    pp$8.parseClassSuper = function(node) {
      node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
    };
    pp$8.enterClassBody = function() {
      var element = { declared: /* @__PURE__ */ Object.create(null), used: [] };
      this.privateNameStack.push(element);
      return element.declared;
    };
    pp$8.exitClassBody = function() {
      var ref2 = this.privateNameStack.pop();
      var declared = ref2.declared;
      var used = ref2.used;
      if (!this.options.checkPrivateFields) {
        return;
      }
      var len = this.privateNameStack.length;
      var parent = len === 0 ? null : this.privateNameStack[len - 1];
      for (var i2 = 0; i2 < used.length; ++i2) {
        var id = used[i2];
        if (!hasOwn(declared, id.name)) {
          if (parent) {
            parent.used.push(id);
          } else {
            this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
          }
        }
      }
    };
    pp$8.parseExportAllDeclaration = function(node, exports$1) {
      if (this.options.ecmaVersion >= 11) {
        if (this.eatContextual("as")) {
          node.exported = this.parseModuleExportName();
          this.checkExport(exports$1, node.exported, this.lastTokStart);
        } else {
          node.exported = null;
        }
      }
      this.expectContextual("from");
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
      if (this.options.ecmaVersion >= 16) {
        node.attributes = this.parseWithClause();
      }
      this.semicolon();
      return this.finishNode(node, "ExportAllDeclaration");
    };
    pp$8.parseExport = function(node, exports$1) {
      this.next();
      if (this.eat(types$1.star)) {
        return this.parseExportAllDeclaration(node, exports$1);
      }
      if (this.eat(types$1._default)) {
        this.checkExport(exports$1, "default", this.lastTokStart);
        node.declaration = this.parseExportDefaultDeclaration();
        return this.finishNode(node, "ExportDefaultDeclaration");
      }
      if (this.shouldParseExportStatement()) {
        node.declaration = this.parseExportDeclaration(node);
        if (node.declaration.type === "VariableDeclaration") {
          this.checkVariableExport(exports$1, node.declaration.declarations);
        } else {
          this.checkExport(exports$1, node.declaration.id, node.declaration.id.start);
        }
        node.specifiers = [];
        node.source = null;
        if (this.options.ecmaVersion >= 16) {
          node.attributes = [];
        }
      } else {
        node.declaration = null;
        node.specifiers = this.parseExportSpecifiers(exports$1);
        if (this.eatContextual("from")) {
          if (this.type !== types$1.string) {
            this.unexpected();
          }
          node.source = this.parseExprAtom();
          if (this.options.ecmaVersion >= 16) {
            node.attributes = this.parseWithClause();
          }
        } else {
          for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
            var spec = list2[i2];
            this.checkUnreserved(spec.local);
            this.checkLocalExport(spec.local);
            if (spec.local.type === "Literal") {
              this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
            }
          }
          node.source = null;
          if (this.options.ecmaVersion >= 16) {
            node.attributes = [];
          }
        }
        this.semicolon();
      }
      return this.finishNode(node, "ExportNamedDeclaration");
    };
    pp$8.parseExportDeclaration = function(node) {
      return this.parseStatement(null);
    };
    pp$8.parseExportDefaultDeclaration = function() {
      var isAsync;
      if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
        var fNode = this.startNode();
        this.next();
        if (isAsync) {
          this.next();
        }
        return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
      } else if (this.type === types$1._class) {
        var cNode = this.startNode();
        return this.parseClass(cNode, "nullableID");
      } else {
        var declaration = this.parseMaybeAssign();
        this.semicolon();
        return declaration;
      }
    };
    pp$8.checkExport = function(exports$1, name, pos) {
      if (!exports$1) {
        return;
      }
      if (typeof name !== "string") {
        name = name.type === "Identifier" ? name.name : name.value;
      }
      if (hasOwn(exports$1, name)) {
        this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
      }
      exports$1[name] = true;
    };
    pp$8.checkPatternExport = function(exports$1, pat) {
      var type = pat.type;
      if (type === "Identifier") {
        this.checkExport(exports$1, pat, pat.start);
      } else if (type === "ObjectPattern") {
        for (var i2 = 0, list2 = pat.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          this.checkPatternExport(exports$1, prop);
        }
      } else if (type === "ArrayPattern") {
        for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
          var elt = list$1[i$1];
          if (elt) {
            this.checkPatternExport(exports$1, elt);
          }
        }
      } else if (type === "Property") {
        this.checkPatternExport(exports$1, pat.value);
      } else if (type === "AssignmentPattern") {
        this.checkPatternExport(exports$1, pat.left);
      } else if (type === "RestElement") {
        this.checkPatternExport(exports$1, pat.argument);
      }
    };
    pp$8.checkVariableExport = function(exports$1, decls) {
      if (!exports$1) {
        return;
      }
      for (var i2 = 0, list2 = decls; i2 < list2.length; i2 += 1) {
        var decl = list2[i2];
        this.checkPatternExport(exports$1, decl.id);
      }
    };
    pp$8.shouldParseExportStatement = function() {
      return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
    };
    pp$8.parseExportSpecifier = function(exports$1) {
      var node = this.startNode();
      node.local = this.parseModuleExportName();
      node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
      this.checkExport(
        exports$1,
        node.exported,
        node.exported.start
      );
      return this.finishNode(node, "ExportSpecifier");
    };
    pp$8.parseExportSpecifiers = function(exports$1) {
      var nodes = [], first = true;
      this.expect(types$1.braceL);
      while (!this.eat(types$1.braceR)) {
        if (!first) {
          this.expect(types$1.comma);
          if (this.afterTrailingComma(types$1.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        nodes.push(this.parseExportSpecifier(exports$1));
      }
      return nodes;
    };
    pp$8.parseImport = function(node) {
      this.next();
      if (this.type === types$1.string) {
        node.specifiers = empty$1;
        node.source = this.parseExprAtom();
      } else {
        node.specifiers = this.parseImportSpecifiers();
        this.expectContextual("from");
        node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
      }
      if (this.options.ecmaVersion >= 16) {
        node.attributes = this.parseWithClause();
      }
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    };
    pp$8.parseImportSpecifier = function() {
      var node = this.startNode();
      node.imported = this.parseModuleExportName();
      if (this.eatContextual("as")) {
        node.local = this.parseIdent();
      } else {
        this.checkUnreserved(node.imported);
        node.local = node.imported;
      }
      this.checkLValSimple(node.local, BIND_LEXICAL);
      return this.finishNode(node, "ImportSpecifier");
    };
    pp$8.parseImportDefaultSpecifier = function() {
      var node = this.startNode();
      node.local = this.parseIdent();
      this.checkLValSimple(node.local, BIND_LEXICAL);
      return this.finishNode(node, "ImportDefaultSpecifier");
    };
    pp$8.parseImportNamespaceSpecifier = function() {
      var node = this.startNode();
      this.next();
      this.expectContextual("as");
      node.local = this.parseIdent();
      this.checkLValSimple(node.local, BIND_LEXICAL);
      return this.finishNode(node, "ImportNamespaceSpecifier");
    };
    pp$8.parseImportSpecifiers = function() {
      var nodes = [], first = true;
      if (this.type === types$1.name) {
        nodes.push(this.parseImportDefaultSpecifier());
        if (!this.eat(types$1.comma)) {
          return nodes;
        }
      }
      if (this.type === types$1.star) {
        nodes.push(this.parseImportNamespaceSpecifier());
        return nodes;
      }
      this.expect(types$1.braceL);
      while (!this.eat(types$1.braceR)) {
        if (!first) {
          this.expect(types$1.comma);
          if (this.afterTrailingComma(types$1.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        nodes.push(this.parseImportSpecifier());
      }
      return nodes;
    };
    pp$8.parseWithClause = function() {
      var nodes = [];
      if (!this.eat(types$1._with)) {
        return nodes;
      }
      this.expect(types$1.braceL);
      var attributeKeys = {};
      var first = true;
      while (!this.eat(types$1.braceR)) {
        if (!first) {
          this.expect(types$1.comma);
          if (this.afterTrailingComma(types$1.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        var attr = this.parseImportAttribute();
        var keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
        if (hasOwn(attributeKeys, keyName)) {
          this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'");
        }
        attributeKeys[keyName] = true;
        nodes.push(attr);
      }
      return nodes;
    };
    pp$8.parseImportAttribute = function() {
      var node = this.startNode();
      node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
      this.expect(types$1.colon);
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.value = this.parseExprAtom();
      return this.finishNode(node, "ImportAttribute");
    };
    pp$8.parseModuleExportName = function() {
      if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
        var stringLiteral = this.parseLiteral(this.value);
        if (loneSurrogate.test(stringLiteral.value)) {
          this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
        }
        return stringLiteral;
      }
      return this.parseIdent(true);
    };
    pp$8.adaptDirectivePrologue = function(statements) {
      for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2) {
        statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
      }
    };
    pp$8.isDirectiveCandidate = function(statement) {
      return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
      (this.input[statement.start] === '"' || this.input[statement.start] === "'");
    };
    pp$7 = Parser.prototype;
    pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 6 && node) {
        switch (node.type) {
          case "Identifier":
            if (this.inAsync && node.name === "await") {
              this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
            }
            break;
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
          case "RestElement":
            break;
          case "ObjectExpression":
            node.type = "ObjectPattern";
            if (refDestructuringErrors) {
              this.checkPatternErrors(refDestructuringErrors, true);
            }
            for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
              var prop = list2[i2];
              this.toAssignable(prop, isBinding);
              if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
                this.raise(prop.argument.start, "Unexpected token");
              }
            }
            break;
          case "Property":
            if (node.kind !== "init") {
              this.raise(node.key.start, "Object pattern can't contain getter or setter");
            }
            this.toAssignable(node.value, isBinding);
            break;
          case "ArrayExpression":
            node.type = "ArrayPattern";
            if (refDestructuringErrors) {
              this.checkPatternErrors(refDestructuringErrors, true);
            }
            this.toAssignableList(node.elements, isBinding);
            break;
          case "SpreadElement":
            node.type = "RestElement";
            this.toAssignable(node.argument, isBinding);
            if (node.argument.type === "AssignmentPattern") {
              this.raise(node.argument.start, "Rest elements cannot have a default value");
            }
            break;
          case "AssignmentExpression":
            if (node.operator !== "=") {
              this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
            }
            node.type = "AssignmentPattern";
            delete node.operator;
            this.toAssignable(node.left, isBinding);
            break;
          case "ParenthesizedExpression":
            this.toAssignable(node.expression, isBinding, refDestructuringErrors);
            break;
          case "ChainExpression":
            this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
            break;
          case "MemberExpression":
            if (!isBinding) {
              break;
            }
          default:
            this.raise(node.start, "Assigning to rvalue");
        }
      } else if (refDestructuringErrors) {
        this.checkPatternErrors(refDestructuringErrors, true);
      }
      return node;
    };
    pp$7.toAssignableList = function(exprList, isBinding) {
      var end = exprList.length;
      for (var i2 = 0; i2 < end; i2++) {
        var elt = exprList[i2];
        if (elt) {
          this.toAssignable(elt, isBinding);
        }
      }
      if (end) {
        var last = exprList[end - 1];
        if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
          this.unexpected(last.argument.start);
        }
      }
      return exprList;
    };
    pp$7.parseSpread = function(refDestructuringErrors) {
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      return this.finishNode(node, "SpreadElement");
    };
    pp$7.parseRestBinding = function() {
      var node = this.startNode();
      this.next();
      if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
        this.unexpected();
      }
      node.argument = this.parseBindingAtom();
      return this.finishNode(node, "RestElement");
    };
    pp$7.parseBindingAtom = function() {
      if (this.options.ecmaVersion >= 6) {
        switch (this.type) {
          case types$1.bracketL:
            var node = this.startNode();
            this.next();
            node.elements = this.parseBindingList(types$1.bracketR, true, true);
            return this.finishNode(node, "ArrayPattern");
          case types$1.braceL:
            return this.parseObj(true);
        }
      }
      return this.parseIdent();
    };
    pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
      var elts = [], first = true;
      while (!this.eat(close)) {
        if (first) {
          first = false;
        } else {
          this.expect(types$1.comma);
        }
        if (allowEmpty && this.type === types$1.comma) {
          elts.push(null);
        } else if (allowTrailingComma && this.afterTrailingComma(close)) {
          break;
        } else if (this.type === types$1.ellipsis) {
          var rest = this.parseRestBinding();
          this.parseBindingListItem(rest);
          elts.push(rest);
          if (this.type === types$1.comma) {
            this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
          }
          this.expect(close);
          break;
        } else {
          elts.push(this.parseAssignableListItem(allowModifiers));
        }
      }
      return elts;
    };
    pp$7.parseAssignableListItem = function(allowModifiers) {
      var elem = this.parseMaybeDefault(this.start, this.startLoc);
      this.parseBindingListItem(elem);
      return elem;
    };
    pp$7.parseBindingListItem = function(param) {
      return param;
    };
    pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
      left = left || this.parseBindingAtom();
      if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
        return left;
      }
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.right = this.parseMaybeAssign();
      return this.finishNode(node, "AssignmentPattern");
    };
    pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0) bindingType = BIND_NONE;
      var isBind = bindingType !== BIND_NONE;
      switch (expr.type) {
        case "Identifier":
          if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
            this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
          }
          if (isBind) {
            if (bindingType === BIND_LEXICAL && expr.name === "let") {
              this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
            }
            if (checkClashes) {
              if (hasOwn(checkClashes, expr.name)) {
                this.raiseRecoverable(expr.start, "Argument name clash");
              }
              checkClashes[expr.name] = true;
            }
            if (bindingType !== BIND_OUTSIDE) {
              this.declareName(expr.name, bindingType, expr.start);
            }
          }
          break;
        case "ChainExpression":
          this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
          break;
        case "MemberExpression":
          if (isBind) {
            this.raiseRecoverable(expr.start, "Binding member expression");
          }
          break;
        case "ParenthesizedExpression":
          if (isBind) {
            this.raiseRecoverable(expr.start, "Binding parenthesized expression");
          }
          return this.checkLValSimple(expr.expression, bindingType, checkClashes);
        default:
          this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
      }
    };
    pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0) bindingType = BIND_NONE;
      switch (expr.type) {
        case "ObjectPattern":
          for (var i2 = 0, list2 = expr.properties; i2 < list2.length; i2 += 1) {
            var prop = list2[i2];
            this.checkLValInnerPattern(prop, bindingType, checkClashes);
          }
          break;
        case "ArrayPattern":
          for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
            var elem = list$1[i$1];
            if (elem) {
              this.checkLValInnerPattern(elem, bindingType, checkClashes);
            }
          }
          break;
        default:
          this.checkLValSimple(expr, bindingType, checkClashes);
      }
    };
    pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0) bindingType = BIND_NONE;
      switch (expr.type) {
        case "Property":
          this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
          break;
        case "AssignmentPattern":
          this.checkLValPattern(expr.left, bindingType, checkClashes);
          break;
        case "RestElement":
          this.checkLValPattern(expr.argument, bindingType, checkClashes);
          break;
        default:
          this.checkLValPattern(expr, bindingType, checkClashes);
      }
    };
    TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
      this.token = token;
      this.isExpr = !!isExpr;
      this.preserveSpace = !!preserveSpace;
      this.override = override;
      this.generator = !!generator;
    };
    types = {
      b_stat: new TokContext("{", false),
      b_expr: new TokContext("{", true),
      b_tmpl: new TokContext("${", false),
      p_stat: new TokContext("(", false),
      p_expr: new TokContext("(", true),
      q_tmpl: new TokContext("`", true, true, function(p) {
        return p.tryReadTemplateToken();
      }),
      f_stat: new TokContext("function", false),
      f_expr: new TokContext("function", true),
      f_expr_gen: new TokContext("function", true, false, null, true),
      f_gen: new TokContext("function", false, false, null, true)
    };
    pp$6 = Parser.prototype;
    pp$6.initialContext = function() {
      return [types.b_stat];
    };
    pp$6.curContext = function() {
      return this.context[this.context.length - 1];
    };
    pp$6.braceIsBlock = function(prevType) {
      var parent = this.curContext();
      if (parent === types.f_expr || parent === types.f_stat) {
        return true;
      }
      if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr)) {
        return !parent.isExpr;
      }
      if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
        return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
      }
      if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
        return true;
      }
      if (prevType === types$1.braceL) {
        return parent === types.b_stat;
      }
      if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
        return false;
      }
      return !this.exprAllowed;
    };
    pp$6.inGeneratorContext = function() {
      for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
        var context = this.context[i2];
        if (context.token === "function") {
          return context.generator;
        }
      }
      return false;
    };
    pp$6.updateContext = function(prevType) {
      var update, type = this.type;
      if (type.keyword && prevType === types$1.dot) {
        this.exprAllowed = false;
      } else if (update = type.updateContext) {
        update.call(this, prevType);
      } else {
        this.exprAllowed = type.beforeExpr;
      }
    };
    pp$6.overrideContext = function(tokenCtx) {
      if (this.curContext() !== tokenCtx) {
        this.context[this.context.length - 1] = tokenCtx;
      }
    };
    types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
      if (this.context.length === 1) {
        this.exprAllowed = true;
        return;
      }
      var out = this.context.pop();
      if (out === types.b_stat && this.curContext().token === "function") {
        out = this.context.pop();
      }
      this.exprAllowed = !out.isExpr;
    };
    types$1.braceL.updateContext = function(prevType) {
      this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
      this.exprAllowed = true;
    };
    types$1.dollarBraceL.updateContext = function() {
      this.context.push(types.b_tmpl);
      this.exprAllowed = true;
    };
    types$1.parenL.updateContext = function(prevType) {
      var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
      this.context.push(statementParens ? types.p_stat : types.p_expr);
      this.exprAllowed = true;
    };
    types$1.incDec.updateContext = function() {
    };
    types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
      if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) {
        this.context.push(types.f_expr);
      } else {
        this.context.push(types.f_stat);
      }
      this.exprAllowed = false;
    };
    types$1.colon.updateContext = function() {
      if (this.curContext().token === "function") {
        this.context.pop();
      }
      this.exprAllowed = true;
    };
    types$1.backQuote.updateContext = function() {
      if (this.curContext() === types.q_tmpl) {
        this.context.pop();
      } else {
        this.context.push(types.q_tmpl);
      }
      this.exprAllowed = false;
    };
    types$1.star.updateContext = function(prevType) {
      if (prevType === types$1._function) {
        var index = this.context.length - 1;
        if (this.context[index] === types.f_expr) {
          this.context[index] = types.f_expr_gen;
        } else {
          this.context[index] = types.f_gen;
        }
      }
      this.exprAllowed = true;
    };
    types$1.name.updateContext = function(prevType) {
      var allowed = false;
      if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
        if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
          allowed = true;
        }
      }
      this.exprAllowed = allowed;
    };
    pp$5 = Parser.prototype;
    pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
        return;
      }
      if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
        return;
      }
      var key = prop.key;
      var name;
      switch (key.type) {
        case "Identifier":
          name = key.name;
          break;
        case "Literal":
          name = String(key.value);
          break;
        default:
          return;
      }
      var kind = prop.kind;
      if (this.options.ecmaVersion >= 6) {
        if (name === "__proto__" && kind === "init") {
          if (propHash.proto) {
            if (refDestructuringErrors) {
              if (refDestructuringErrors.doubleProto < 0) {
                refDestructuringErrors.doubleProto = key.start;
              }
            } else {
              this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
            }
          }
          propHash.proto = true;
        }
        return;
      }
      name = "$" + name;
      var other = propHash[name];
      if (other) {
        var redefinition;
        if (kind === "init") {
          redefinition = this.strict && other.init || other.get || other.set;
        } else {
          redefinition = other.init || other[kind];
        }
        if (redefinition) {
          this.raiseRecoverable(key.start, "Redefinition of property");
        }
      } else {
        other = propHash[name] = {
          init: false,
          get: false,
          set: false
        };
      }
      other[kind] = true;
    };
    pp$5.parseExpression = function(forInit, refDestructuringErrors) {
      var this$1$1 = this;
      return this.catchStackOverflow(function() {
        var startPos = this$1$1.start, startLoc = this$1$1.startLoc;
        var expr = this$1$1.parseMaybeAssign(forInit, refDestructuringErrors);
        if (this$1$1.type === types$1.comma) {
          var node = this$1$1.startNodeAt(startPos, startLoc);
          node.expressions = [expr];
          while (this$1$1.eat(types$1.comma)) {
            node.expressions.push(this$1$1.parseMaybeAssign(forInit, refDestructuringErrors));
          }
          return this$1$1.finishNode(node, "SequenceExpression");
        }
        return expr;
      });
    };
    pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
      if (this.isContextual("yield")) {
        if (this.inGenerator) {
          return this.parseYield(forInit);
        } else {
          this.exprAllowed = false;
        }
      }
      var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
      if (refDestructuringErrors) {
        oldParenAssign = refDestructuringErrors.parenthesizedAssign;
        oldTrailingComma = refDestructuringErrors.trailingComma;
        oldDoubleProto = refDestructuringErrors.doubleProto;
        refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
      } else {
        refDestructuringErrors = new DestructuringErrors();
        ownDestructuringErrors = true;
      }
      var startPos = this.start, startLoc = this.startLoc;
      if (this.type === types$1.parenL || this.type === types$1.name) {
        this.potentialArrowAt = this.start;
        this.potentialArrowInForAwait = forInit === "await";
      }
      var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
      if (afterLeftParse) {
        left = afterLeftParse.call(this, left, startPos, startLoc);
      }
      if (this.type.isAssign) {
        var node = this.startNodeAt(startPos, startLoc);
        node.operator = this.value;
        if (this.type === types$1.eq) {
          left = this.toAssignable(left, false, refDestructuringErrors);
        }
        if (!ownDestructuringErrors) {
          refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
          if (refDestructuringErrors.shorthandAssign >= left.start) {
            refDestructuringErrors.shorthandAssign = -1;
          }
          if (refDestructuringErrors.doubleProto >= left.start) {
            refDestructuringErrors.doubleProto = -1;
          }
        }
        if (this.type === types$1.eq) {
          this.checkLValPattern(left);
        } else {
          this.checkLValSimple(left);
        }
        node.left = left;
        this.next();
        node.right = this.parseMaybeAssign(forInit);
        if (oldDoubleProto > -1) {
          refDestructuringErrors.doubleProto = oldDoubleProto;
        }
        return this.finishNode(node, "AssignmentExpression");
      } else {
        if (ownDestructuringErrors) {
          this.checkExpressionErrors(refDestructuringErrors, true);
        }
      }
      if (oldParenAssign > -1) {
        refDestructuringErrors.parenthesizedAssign = oldParenAssign;
      }
      if (oldTrailingComma > -1) {
        refDestructuringErrors.trailingComma = oldTrailingComma;
      }
      return left;
    };
    pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseExprOps(forInit, refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) {
        return expr;
      }
      if (!(expr.type === "ArrowFunctionExpression" && expr.start === startPos) && this.eat(types$1.question)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.test = expr;
        node.consequent = this.parseMaybeAssign();
        this.expect(types$1.colon);
        node.alternate = this.parseMaybeAssign(forInit);
        return this.finishNode(node, "ConditionalExpression");
      }
      return expr;
    };
    pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
      if (this.checkExpressionErrors(refDestructuringErrors)) {
        return expr;
      }
      return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
    };
    pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
      var prec = this.type.binop;
      if (prec != null && (!forInit || this.type !== types$1._in)) {
        if (prec > minPrec) {
          var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
          var coalesce = this.type === types$1.coalesce;
          if (coalesce) {
            prec = types$1.logicalAND.binop;
          }
          var op = this.value;
          this.next();
          var startPos = this.start, startLoc = this.startLoc;
          var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
          var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
          if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
            this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
          }
          return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
        }
      }
      return left;
    };
    pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
      if (right.type === "PrivateIdentifier") {
        this.raise(right.start, "Private identifier can only be left side of binary expression");
      }
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.operator = op;
      node.right = right;
      return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
    };
    pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
      var startPos = this.start, startLoc = this.startLoc, expr;
      if (this.isContextual("await") && this.canAwait) {
        expr = this.parseAwait(forInit);
        sawUnary = true;
      } else if (this.type.prefix) {
        var node = this.startNode(), update = this.type === types$1.incDec;
        node.operator = this.value;
        node.prefix = true;
        this.next();
        node.argument = this.parseMaybeUnary(null, true, update, forInit);
        this.checkExpressionErrors(refDestructuringErrors, true);
        if (update) {
          this.checkLValSimple(node.argument);
        } else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) {
          this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
        } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
          this.raiseRecoverable(node.start, "Private fields can not be deleted");
        } else {
          sawUnary = true;
        }
        expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
      } else if (!sawUnary && this.type === types$1.privateId) {
        if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) {
          this.unexpected();
        }
        expr = this.parsePrivateIdent();
        if (this.type !== types$1._in) {
          this.unexpected();
        }
      } else {
        expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
        if (this.checkExpressionErrors(refDestructuringErrors)) {
          return expr;
        }
        while (this.type.postfix && !this.canInsertSemicolon()) {
          var node$1 = this.startNodeAt(startPos, startLoc);
          node$1.operator = this.value;
          node$1.prefix = false;
          node$1.argument = expr;
          this.checkLValSimple(expr);
          this.next();
          expr = this.finishNode(node$1, "UpdateExpression");
        }
      }
      if (!incDec && !(expr.type === "ArrowFunctionExpression" && expr.start === startPos) && this.eat(types$1.starstar)) {
        if (sawUnary) {
          this.unexpected(this.lastTokStart);
        } else {
          return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
        }
      } else {
        return expr;
      }
    };
    pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
      var startPos = this.start, startLoc = this.startLoc;
      var oldDoubleProto = -1, oldShorthandAssign = -1;
      if (refDestructuringErrors) {
        oldDoubleProto = refDestructuringErrors.doubleProto;
        oldShorthandAssign = refDestructuringErrors.shorthandAssign;
        refDestructuringErrors.doubleProto = refDestructuringErrors.shorthandAssign = -1;
      }
      var expr = this.parseExprAtom(refDestructuringErrors, forInit);
      if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
        return expr;
      }
      var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
      if (refDestructuringErrors) {
        if (result.end > expr.end) {
          this.checkExpressionErrors(refDestructuringErrors, true);
          if (refDestructuringErrors.parenthesizedAssign >= result.start) {
            refDestructuringErrors.parenthesizedAssign = -1;
          }
          if (refDestructuringErrors.parenthesizedBind >= result.start) {
            refDestructuringErrors.parenthesizedBind = -1;
          }
          if (refDestructuringErrors.trailingComma >= result.start) {
            refDestructuringErrors.trailingComma = -1;
          }
        }
        if (oldDoubleProto > -1) {
          refDestructuringErrors.doubleProto = oldDoubleProto;
        }
        if (oldShorthandAssign > -1) {
          refDestructuringErrors.shorthandAssign = oldShorthandAssign;
        }
      }
      return result;
    };
    pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
      var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
      var optionalChained = false;
      while (true) {
        var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
        if (element.optional) {
          optionalChained = true;
        }
        if (element.end === base.end || element.type === "ArrowFunctionExpression") {
          if (optionalChained) {
            var chainNode = this.startNodeAt(startPos, startLoc);
            chainNode.expression = element;
            element = this.finishNode(chainNode, "ChainExpression");
          }
          return element;
        }
        base = element;
        maybeAsyncArrow = false;
      }
    };
    pp$5.shouldParseAsyncArrow = function() {
      return !this.canInsertSemicolon() && this.eat(types$1.arrow);
    };
    pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
    };
    pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
      var optionalSupported = this.options.ecmaVersion >= 11;
      var optional = optionalSupported && this.eat(types$1.questionDot);
      if (noCalls && optional) {
        this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
      }
      var computed = this.eat(types$1.bracketL);
      if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.object = base;
        if (computed) {
          node.property = this.parseExpression();
          this.expect(types$1.bracketR);
        } else if (this.type === types$1.privateId && base.type !== "Super") {
          node.property = this.parsePrivateIdent();
        } else {
          node.property = this.parseIdent(this.options.allowReserved !== "never");
        }
        node.computed = !!computed;
        if (optionalSupported) {
          node.optional = optional;
        }
        base = this.finishNode(node, "MemberExpression");
      } else if (!noCalls && this.eat(types$1.parenL)) {
        var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
        if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
          this.checkPatternErrors(refDestructuringErrors, false);
          this.checkYieldAwaitInDefaultParams();
          if (this.awaitIdentPos > 0) {
            this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
          }
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          this.awaitIdentPos = oldAwaitIdentPos;
          return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
        }
        this.checkExpressionErrors(refDestructuringErrors, true);
        this.yieldPos = oldYieldPos || this.yieldPos;
        this.awaitPos = oldAwaitPos || this.awaitPos;
        this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
        var node$1 = this.startNodeAt(startPos, startLoc);
        node$1.callee = base;
        node$1.arguments = exprList;
        if (optionalSupported) {
          node$1.optional = optional;
        }
        base = this.finishNode(node$1, "CallExpression");
      } else if (this.type === types$1.backQuote) {
        if (optional || optionalChained) {
          this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
        }
        var node$2 = this.startNodeAt(startPos, startLoc);
        node$2.tag = base;
        node$2.quasi = this.parseTemplate({ isTagged: true });
        base = this.finishNode(node$2, "TaggedTemplateExpression");
      }
      return base;
    };
    pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
      if (this.type === types$1.slash) {
        this.readRegexp();
      }
      var node, canBeArrow = this.potentialArrowAt === this.start;
      switch (this.type) {
        case types$1._super:
          if (!this.allowSuper) {
            this.raise(this.start, "'super' keyword outside a method");
          }
          node = this.startNode();
          this.next();
          if (this.type === types$1.parenL && !this.allowDirectSuper) {
            this.raise(node.start, "super() call outside constructor of a subclass");
          }
          if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
            this.unexpected();
          }
          return this.finishNode(node, "Super");
        case types$1._this:
          node = this.startNode();
          this.next();
          return this.finishNode(node, "ThisExpression");
        case types$1.name:
          var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
          var id = this.parseIdent(false);
          if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
            this.overrideContext(types.f_expr);
            return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
          }
          if (canBeArrow && !this.canInsertSemicolon()) {
            if (this.eat(types$1.arrow)) {
              return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit);
            }
            if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
              id = this.parseIdent(false);
              if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
                this.unexpected();
              }
              return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit);
            }
          }
          return id;
        case types$1.regexp:
          var value = this.value;
          node = this.parseLiteral(value.value);
          node.regex = { pattern: value.pattern, flags: value.flags };
          return node;
        case types$1.num:
        case types$1.string:
          return this.parseLiteral(this.value);
        case types$1._null:
        case types$1._true:
        case types$1._false:
          node = this.startNode();
          node.value = this.type === types$1._null ? null : this.type === types$1._true;
          node.raw = this.type.keyword;
          this.next();
          return this.finishNode(node, "Literal");
        case types$1.parenL:
          var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
          if (refDestructuringErrors) {
            if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
              refDestructuringErrors.parenthesizedAssign = start;
            }
            if (refDestructuringErrors.parenthesizedBind < 0) {
              refDestructuringErrors.parenthesizedBind = start;
            }
          }
          return expr;
        case types$1.bracketL:
          node = this.startNode();
          this.next();
          node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
          return this.finishNode(node, "ArrayExpression");
        case types$1.braceL:
          this.overrideContext(types.b_expr);
          return this.parseObj(false, refDestructuringErrors);
        case types$1._function:
          node = this.startNode();
          this.next();
          return this.parseFunction(node, 0);
        case types$1._class:
          return this.parseClass(this.startNode(), false);
        case types$1._new:
          return this.parseNew();
        case types$1.backQuote:
          return this.parseTemplate();
        case types$1._import:
          if (this.options.ecmaVersion >= 11) {
            return this.parseExprImport(forNew);
          } else {
            return this.unexpected();
          }
        default:
          return this.parseExprAtomDefault();
      }
    };
    pp$5.parseExprAtomDefault = function() {
      this.unexpected();
    };
    pp$5.parseExprImport = function(forNew) {
      var node = this.startNode();
      if (this.containsEsc) {
        this.raiseRecoverable(this.start, "Escape sequence in keyword import");
      }
      this.next();
      if (this.type === types$1.parenL && !forNew) {
        return this.parseDynamicImport(node);
      } else if (this.type === types$1.dot) {
        var meta2 = this.startNodeAt(node.start, node.loc && node.loc.start);
        meta2.name = "import";
        node.meta = this.finishNode(meta2, "Identifier");
        return this.parseImportMeta(node);
      } else {
        this.unexpected();
      }
    };
    pp$5.parseDynamicImport = function(node) {
      this.next();
      node.source = this.parseMaybeAssign();
      if (this.options.ecmaVersion >= 16) {
        if (!this.eat(types$1.parenR)) {
          this.expect(types$1.comma);
          if (!this.afterTrailingComma(types$1.parenR)) {
            node.options = this.parseMaybeAssign();
            if (!this.eat(types$1.parenR)) {
              this.expect(types$1.comma);
              if (!this.afterTrailingComma(types$1.parenR)) {
                this.unexpected();
              }
            }
          } else {
            node.options = null;
          }
        } else {
          node.options = null;
        }
      } else {
        if (!this.eat(types$1.parenR)) {
          var errorPos = this.start;
          if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
            this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
          } else {
            this.unexpected(errorPos);
          }
        }
      }
      return this.finishNode(node, "ImportExpression");
    };
    pp$5.parseImportMeta = function(node) {
      this.next();
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "meta") {
        this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
      }
      if (containsEsc) {
        this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
      }
      if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
        this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
      }
      return this.finishNode(node, "MetaProperty");
    };
    pp$5.parseLiteral = function(value) {
      var node = this.startNode();
      node.value = value;
      node.raw = this.input.slice(this.start, this.end);
      if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
        node.bigint = node.value != null ? node.value.toString() : node.raw.slice(0, -1).replace(/_/g, "");
      }
      this.next();
      return this.finishNode(node, "Literal");
    };
    pp$5.parseParenExpression = function() {
      this.expect(types$1.parenL);
      var val = this.parseExpression();
      this.expect(types$1.parenR);
      return val;
    };
    pp$5.shouldParseArrow = function(exprList) {
      return !this.canInsertSemicolon();
    };
    pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
      var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
      if (this.options.ecmaVersion >= 6) {
        this.next();
        var innerStartPos = this.start, innerStartLoc = this.startLoc;
        var exprList = [], first = true, lastIsComma = false;
        var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
        this.yieldPos = 0;
        this.awaitPos = 0;
        while (this.type !== types$1.parenR) {
          first ? first = false : this.expect(types$1.comma);
          if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
            lastIsComma = true;
            break;
          } else if (this.type === types$1.ellipsis) {
            spreadStart = this.start;
            exprList.push(this.parseParenItem(this.parseRestBinding()));
            if (this.type === types$1.comma) {
              this.raiseRecoverable(
                this.start,
                "Comma is not permitted after the rest element"
              );
            }
            break;
          } else {
            exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
          }
        }
        var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
        this.expect(types$1.parenR);
        if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
          this.checkPatternErrors(refDestructuringErrors, false);
          this.checkYieldAwaitInDefaultParams();
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
        }
        if (!exprList.length || lastIsComma) {
          this.unexpected(this.lastTokStart);
        }
        if (spreadStart) {
          this.unexpected(spreadStart);
        }
        this.checkExpressionErrors(refDestructuringErrors, true);
        this.yieldPos = oldYieldPos || this.yieldPos;
        this.awaitPos = oldAwaitPos || this.awaitPos;
        if (exprList.length > 1) {
          val = this.startNodeAt(innerStartPos, innerStartLoc);
          val.expressions = exprList;
          this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
        } else {
          val = exprList[0];
        }
      } else {
        val = this.parseParenExpression();
      }
      if (this.options.preserveParens) {
        var par = this.startNodeAt(startPos, startLoc);
        par.expression = val;
        return this.finishNode(par, "ParenthesizedExpression");
      } else {
        return val;
      }
    };
    pp$5.parseParenItem = function(item) {
      return item;
    };
    pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
    };
    empty = [];
    pp$5.parseNew = function() {
      if (this.containsEsc) {
        this.raiseRecoverable(this.start, "Escape sequence in keyword new");
      }
      var node = this.startNode();
      this.next();
      if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
        var meta2 = this.startNodeAt(node.start, node.loc && node.loc.start);
        meta2.name = "new";
        node.meta = this.finishNode(meta2, "Identifier");
        this.next();
        var containsEsc = this.containsEsc;
        node.property = this.parseIdent(true);
        if (node.property.name !== "target") {
          this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
        }
        if (containsEsc) {
          this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
        }
        if (!this.allowNewDotTarget) {
          this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
        }
        return this.finishNode(node, "MetaProperty");
      }
      var startPos = this.start, startLoc = this.startLoc;
      node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
      if (node.callee.type === "Super") {
        this.raiseRecoverable(startPos, "Invalid use of 'super'");
      }
      if (this.eat(types$1.parenL)) {
        node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
      } else {
        node.arguments = empty;
      }
      return this.finishNode(node, "NewExpression");
    };
    pp$5.parseTemplateElement = function(ref2) {
      var isTagged = ref2.isTagged;
      var elem = this.startNode();
      if (this.type === types$1.invalidTemplate) {
        if (!isTagged) {
          this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
        }
        elem.value = {
          raw: this.value.replace(/\r\n?/g, "\n"),
          cooked: null
        };
      } else {
        elem.value = {
          raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
          cooked: this.value
        };
      }
      this.next();
      elem.tail = this.type === types$1.backQuote;
      return this.finishNode(elem, "TemplateElement");
    };
    pp$5.parseTemplate = function(ref2) {
      if (ref2 === void 0) ref2 = {};
      var isTagged = ref2.isTagged;
      if (isTagged === void 0) isTagged = false;
      var node = this.startNode();
      this.next();
      node.expressions = [];
      var curElt = this.parseTemplateElement({ isTagged });
      node.quasis = [curElt];
      while (!curElt.tail) {
        if (this.type === types$1.eof) {
          this.raise(this.pos, "Unterminated template literal");
        }
        this.expect(types$1.dollarBraceL);
        node.expressions.push(this.parseExpression());
        this.expect(types$1.braceR);
        node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
      }
      this.next();
      return this.finishNode(node, "TemplateLiteral");
    };
    pp$5.isAsyncProp = function(prop) {
      return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
    };
    pp$5.parseObj = function(isPattern, refDestructuringErrors) {
      var node = this.startNode(), first = true, propHash = {};
      node.properties = [];
      this.next();
      while (!this.eat(types$1.braceR)) {
        if (!first) {
          this.expect(types$1.comma);
          if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        var prop = this.parseProperty(isPattern, refDestructuringErrors);
        if (!isPattern) {
          this.checkPropClash(prop, propHash, refDestructuringErrors);
        }
        node.properties.push(prop);
      }
      return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
    };
    pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
      var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
      if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
        if (isPattern) {
          prop.argument = this.parseIdent(false);
          if (this.type === types$1.comma) {
            this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
          }
          return this.finishNode(prop, "RestElement");
        }
        prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
        if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
          refDestructuringErrors.trailingComma = this.start;
        }
        return this.finishNode(prop, "SpreadElement");
      }
      if (this.options.ecmaVersion >= 6) {
        prop.method = false;
        prop.shorthand = false;
        if (isPattern || refDestructuringErrors) {
          startPos = this.start;
          startLoc = this.startLoc;
        }
        if (!isPattern) {
          isGenerator = this.eat(types$1.star);
        }
      }
      var containsEsc = this.containsEsc;
      this.parsePropertyName(prop);
      if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
        isAsync = true;
        isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
        this.parsePropertyName(prop);
      } else {
        isAsync = false;
      }
      this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
      return this.finishNode(prop, "Property");
    };
    pp$5.parseGetterSetter = function(prop) {
      var kind = prop.key.name;
      this.parsePropertyName(prop);
      prop.value = this.parseMethod(false);
      prop.kind = kind;
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        if (prop.kind === "get") {
          this.raiseRecoverable(start, "getter should have no params");
        } else {
          this.raiseRecoverable(start, "setter should have exactly one param");
        }
      } else {
        if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
          this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
        }
      }
    };
    pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
      if ((isGenerator || isAsync) && this.type === types$1.colon) {
        this.unexpected();
      }
      if (this.eat(types$1.colon)) {
        prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
        prop.kind = "init";
      } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
        if (isPattern) {
          this.unexpected();
        }
        prop.method = true;
        prop.value = this.parseMethod(isGenerator, isAsync);
        prop.kind = "init";
      } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
        if (isGenerator || isAsync) {
          this.unexpected();
        }
        this.parseGetterSetter(prop);
      } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
        if (isGenerator || isAsync) {
          this.unexpected();
        }
        this.checkUnreserved(prop.key);
        if (prop.key.name === "await" && !this.awaitIdentPos) {
          this.awaitIdentPos = startPos;
        }
        if (isPattern) {
          prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
        } else if (this.type === types$1.eq && refDestructuringErrors) {
          if (refDestructuringErrors.shorthandAssign < 0) {
            refDestructuringErrors.shorthandAssign = this.start;
          }
          prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
        } else {
          prop.value = this.copyNode(prop.key);
        }
        prop.kind = "init";
        prop.shorthand = true;
      } else {
        this.unexpected();
      }
    };
    pp$5.parsePropertyName = function(prop) {
      if (this.options.ecmaVersion >= 6) {
        if (this.eat(types$1.bracketL)) {
          prop.computed = true;
          prop.key = this.parseMaybeAssign();
          this.expect(types$1.bracketR);
          return prop.key;
        } else {
          prop.computed = false;
        }
      }
      return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
    };
    pp$5.initFunction = function(node) {
      node.id = null;
      if (this.options.ecmaVersion >= 6) {
        node.generator = node.expression = false;
      }
      if (this.options.ecmaVersion >= 8) {
        node.async = false;
      }
    };
    pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
      var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.initFunction(node);
      if (this.options.ecmaVersion >= 6) {
        node.generator = isGenerator;
      }
      if (this.options.ecmaVersion >= 8) {
        node.async = !!isAsync;
      }
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
      this.expect(types$1.parenL);
      node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
      this.checkYieldAwaitInDefaultParams();
      this.parseFunctionBody(node, false, true, false);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, "FunctionExpression");
    };
    pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
      this.initFunction(node);
      if (this.options.ecmaVersion >= 8) {
        node.async = !!isAsync;
      }
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      node.params = this.toAssignableList(params, true);
      this.parseFunctionBody(node, true, false, forInit);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, "ArrowFunctionExpression");
    };
    pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
      var isExpression = isArrowFunction && this.type !== types$1.braceL;
      var oldStrict = this.strict, useStrict = false;
      if (isExpression) {
        node.body = this.parseMaybeAssign(forInit);
        node.expression = true;
        this.checkParams(node, false);
      } else {
        var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
        if (!oldStrict || nonSimple) {
          useStrict = this.strictDirective(this.end);
          if (useStrict && nonSimple) {
            this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
          }
        }
        var oldLabels = this.labels;
        this.labels = [];
        if (useStrict) {
          this.strict = true;
        }
        this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
        if (this.strict && node.id) {
          this.checkLValSimple(node.id, BIND_OUTSIDE);
        }
        node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
        node.expression = false;
        this.adaptDirectivePrologue(node.body.body);
        this.labels = oldLabels;
      }
      this.exitScope();
    };
    pp$5.isSimpleParamList = function(params) {
      for (var i2 = 0, list2 = params; i2 < list2.length; i2 += 1) {
        var param = list2[i2];
        if (param.type !== "Identifier") {
          return false;
        }
      }
      return true;
    };
    pp$5.checkParams = function(node, allowDuplicates) {
      var nameHash = /* @__PURE__ */ Object.create(null);
      for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
        var param = list2[i2];
        this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
      }
    };
    pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
      var elts = [], first = true;
      while (!this.eat(close)) {
        if (!first) {
          this.expect(types$1.comma);
          if (allowTrailingComma && this.afterTrailingComma(close)) {
            break;
          }
        } else {
          first = false;
        }
        var elt = void 0;
        if (allowEmpty && this.type === types$1.comma) {
          elt = null;
        } else if (this.type === types$1.ellipsis) {
          elt = this.parseSpread(refDestructuringErrors);
          if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
            refDestructuringErrors.trailingComma = this.start;
          }
        } else {
          elt = this.parseMaybeAssign(false, refDestructuringErrors);
        }
        elts.push(elt);
      }
      return elts;
    };
    pp$5.checkUnreserved = function(ref2) {
      var start = ref2.start;
      var end = ref2.end;
      var name = ref2.name;
      if (this.inGenerator && name === "yield") {
        this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
      }
      if (this.inAsync && name === "await") {
        this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
      }
      if (!(this.currentThisScope().flags & SCOPE_VAR) && name === "arguments") {
        this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
      }
      if (this.inClassStaticBlock && (name === "arguments" || name === "await")) {
        this.raise(start, "Cannot use " + name + " in class static initialization block");
      }
      if (this.keywords.test(name)) {
        this.raise(start, "Unexpected keyword '" + name + "'");
      }
      if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
        return;
      }
      var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
      if (re.test(name)) {
        if (!this.inAsync && name === "await") {
          this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
        }
        this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
      }
    };
    pp$5.parseIdent = function(liberal) {
      var node = this.parseIdentNode();
      this.next(!!liberal);
      this.finishNode(node, "Identifier");
      if (!liberal) {
        this.checkUnreserved(node);
        if (node.name === "await" && !this.awaitIdentPos) {
          this.awaitIdentPos = node.start;
        }
      }
      return node;
    };
    pp$5.parseIdentNode = function() {
      var node = this.startNode();
      if (this.type === types$1.name) {
        node.name = this.value;
      } else if (this.type.keyword) {
        node.name = this.type.keyword;
        if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
          this.context.pop();
        }
        this.type = types$1.name;
      } else {
        this.unexpected();
      }
      return node;
    };
    pp$5.parsePrivateIdent = function() {
      var node = this.startNode();
      if (this.type === types$1.privateId) {
        node.name = this.value;
      } else {
        this.unexpected();
      }
      this.next();
      this.finishNode(node, "PrivateIdentifier");
      if (this.options.checkPrivateFields) {
        if (this.privateNameStack.length === 0) {
          this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
        } else {
          this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
        }
      }
      return node;
    };
    pp$5.parseYield = function(forInit) {
      if (!this.yieldPos) {
        this.yieldPos = this.start;
      }
      var node = this.startNode();
      this.next();
      if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
        node.delegate = false;
        node.argument = null;
      } else {
        node.delegate = this.eat(types$1.star);
        node.argument = this.parseMaybeAssign(forInit);
      }
      return this.finishNode(node, "YieldExpression");
    };
    pp$5.parseAwait = function(forInit) {
      if (!this.awaitPos) {
        this.awaitPos = this.start;
      }
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeUnary(null, true, false, forInit);
      return this.finishNode(node, "AwaitExpression");
    };
    pp$4 = Parser.prototype;
    pp$4.raise = function(pos, message) {
      var loc = getLineInfo(this.input, pos);
      message += " (" + loc.line + ":" + loc.column + ")";
      if (this.sourceFile) {
        message += " in " + this.sourceFile;
      }
      var err = new SyntaxError(message);
      err.pos = pos;
      err.loc = loc;
      err.raisedAt = this.pos;
      throw err;
    };
    pp$4.raiseRecoverable = pp$4.raise;
    pp$4.curPosition = function() {
      if (this.options.locations) {
        return new Position(this.curLine, this.pos - this.lineStart);
      }
    };
    pp$3 = Parser.prototype;
    Scope = function Scope2(flags) {
      this.flags = flags;
      this.var = [];
      this.lexical = [];
      this.functions = [];
    };
    pp$3.enterScope = function(flags) {
      this.scopeStack.push(new Scope(flags));
    };
    pp$3.exitScope = function() {
      this.scopeStack.pop();
    };
    pp$3.treatFunctionsAsVarInScope = function(scope) {
      return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
    };
    pp$3.declareName = function(name, bindingType, pos) {
      var redeclared = false;
      if (bindingType === BIND_LEXICAL) {
        var scope = this.currentScope();
        redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
        scope.lexical.push(name);
        if (this.inModule && scope.flags & SCOPE_TOP) {
          delete this.undefinedExports[name];
        }
      } else if (bindingType === BIND_SIMPLE_CATCH) {
        var scope$1 = this.currentScope();
        scope$1.lexical.push(name);
      } else if (bindingType === BIND_FUNCTION) {
        var scope$2 = this.currentScope();
        if (this.treatFunctionsAsVar) {
          redeclared = scope$2.lexical.indexOf(name) > -1;
        } else {
          redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
        }
        scope$2.functions.push(name);
      } else {
        for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
          var scope$3 = this.scopeStack[i2];
          if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
            redeclared = true;
            break;
          }
          scope$3.var.push(name);
          if (this.inModule && scope$3.flags & SCOPE_TOP) {
            delete this.undefinedExports[name];
          }
          if (scope$3.flags & SCOPE_VAR) {
            break;
          }
        }
      }
      if (redeclared) {
        this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
      }
    };
    pp$3.checkLocalExport = function(id) {
      if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
        this.undefinedExports[id.name] = id;
      }
    };
    pp$3.currentScope = function() {
      return this.scopeStack[this.scopeStack.length - 1];
    };
    pp$3.currentVarScope = function() {
      for (var i2 = this.scopeStack.length - 1; ; i2--) {
        var scope = this.scopeStack[i2];
        if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK)) {
          return scope;
        }
      }
    };
    pp$3.currentThisScope = function() {
      for (var i2 = this.scopeStack.length - 1; ; i2--) {
        var scope = this.scopeStack[i2];
        if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW)) {
          return scope;
        }
      }
    };
    Node = function Node2(parser, pos, loc) {
      this.type = "";
      this.start = pos;
      this.end = 0;
      if (parser.options.locations) {
        this.loc = new SourceLocation(parser, loc);
      }
      if (parser.options.directSourceFile) {
        this.sourceFile = parser.options.directSourceFile;
      }
      if (parser.options.ranges) {
        this.range = [pos, 0];
      }
    };
    pp$2 = Parser.prototype;
    pp$2.startNode = function() {
      return new Node(this, this.start, this.startLoc);
    };
    pp$2.startNodeAt = function(pos, loc) {
      return new Node(this, pos, loc);
    };
    pp$2.finishNode = function(node, type) {
      return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
    };
    pp$2.finishNodeAt = function(node, type, pos, loc) {
      return finishNodeAt.call(this, node, type, pos, loc);
    };
    pp$2.copyNode = function(node) {
      var newNode = new Node(this, node.start, this.startLoc);
      for (var prop in node) {
        newNode[prop] = node[prop];
      }
      return newNode;
    };
    scriptValuesAddedInUnicode = "Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz";
    ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
    ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
    ecma11BinaryProperties = ecma10BinaryProperties;
    ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
    ecma13BinaryProperties = ecma12BinaryProperties;
    ecma14BinaryProperties = ecma13BinaryProperties;
    unicodeBinaryProperties = {
      9: ecma9BinaryProperties,
      10: ecma10BinaryProperties,
      11: ecma11BinaryProperties,
      12: ecma12BinaryProperties,
      13: ecma13BinaryProperties,
      14: ecma14BinaryProperties
    };
    ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
    unicodeBinaryPropertiesOfStrings = {
      9: "",
      10: "",
      11: "",
      12: "",
      13: "",
      14: ecma14BinaryPropertiesOfStrings
    };
    unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
    ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
    ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
    ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
    ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
    ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
    ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
    unicodeScriptValues = {
      9: ecma9ScriptValues,
      10: ecma10ScriptValues,
      11: ecma11ScriptValues,
      12: ecma12ScriptValues,
      13: ecma13ScriptValues,
      14: ecma14ScriptValues
    };
    data = {};
    for (i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1) {
      ecmaVersion = list[i];
      buildUnicodeData(ecmaVersion);
    }
    pp$1 = Parser.prototype;
    BranchID = function BranchID2(parent, base) {
      this.parent = parent;
      this.base = base || this;
    };
    BranchID.prototype.separatedFrom = function separatedFrom(alt) {
      for (var self = this; self; self = self.parent) {
        for (var other = alt; other; other = other.parent) {
          if (self.base === other.base && self !== other) {
            return true;
          }
        }
      }
      return false;
    };
    BranchID.prototype.sibling = function sibling() {
      return new BranchID(this.parent, this.base);
    };
    RegExpValidationState = function RegExpValidationState2(parser) {
      this.parser = parser;
      this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
      this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
      this.source = "";
      this.flags = "";
      this.start = 0;
      this.switchU = false;
      this.switchV = false;
      this.switchN = false;
      this.pos = 0;
      this.lastIntValue = 0;
      this.lastStringValue = "";
      this.lastAssertionIsQuantifiable = false;
      this.numCapturingParens = 0;
      this.maxBackReference = 0;
      this.groupNames = /* @__PURE__ */ Object.create(null);
      this.backReferenceNames = [];
      this.branchID = null;
    };
    RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
      var unicodeSets = flags.indexOf("v") !== -1;
      var unicode = flags.indexOf("u") !== -1;
      this.start = start | 0;
      this.source = pattern + "";
      this.flags = flags;
      if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
        this.switchU = true;
        this.switchV = true;
        this.switchN = true;
      } else {
        this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
        this.switchV = false;
        this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
      }
    };
    RegExpValidationState.prototype.raise = function raise(message) {
      this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
    };
    RegExpValidationState.prototype.at = function at(i2, forceU) {
      if (forceU === void 0) forceU = false;
      var s = this.source;
      var l = s.length;
      if (i2 >= l) {
        return -1;
      }
      var c = s.charCodeAt(i2);
      if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l) {
        return c;
      }
      var next = s.charCodeAt(i2 + 1);
      return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
    };
    RegExpValidationState.prototype.nextIndex = function nextIndex(i2, forceU) {
      if (forceU === void 0) forceU = false;
      var s = this.source;
      var l = s.length;
      if (i2 >= l) {
        return l;
      }
      var c = s.charCodeAt(i2), next;
      if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l || (next = s.charCodeAt(i2 + 1)) < 56320 || next > 57343) {
        return i2 + 1;
      }
      return i2 + 2;
    };
    RegExpValidationState.prototype.current = function current(forceU) {
      if (forceU === void 0) forceU = false;
      return this.at(this.pos, forceU);
    };
    RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
      if (forceU === void 0) forceU = false;
      return this.at(this.nextIndex(this.pos, forceU), forceU);
    };
    RegExpValidationState.prototype.advance = function advance(forceU) {
      if (forceU === void 0) forceU = false;
      this.pos = this.nextIndex(this.pos, forceU);
    };
    RegExpValidationState.prototype.eat = function eat(ch, forceU) {
      if (forceU === void 0) forceU = false;
      if (this.current(forceU) === ch) {
        this.advance(forceU);
        return true;
      }
      return false;
    };
    RegExpValidationState.prototype.eatChars = function eatChars(chs, forceU) {
      if (forceU === void 0) forceU = false;
      var pos = this.pos;
      for (var i2 = 0, list2 = chs; i2 < list2.length; i2 += 1) {
        var ch = list2[i2];
        var current2 = this.at(pos, forceU);
        if (current2 === -1 || current2 !== ch) {
          return false;
        }
        pos = this.nextIndex(pos, forceU);
      }
      this.pos = pos;
      return true;
    };
    pp$1.validateRegExpFlags = function(state) {
      var validFlags = state.validFlags;
      var flags = state.flags;
      var u = false;
      var v = false;
      for (var i2 = 0; i2 < flags.length; i2++) {
        var flag = flags.charAt(i2);
        if (validFlags.indexOf(flag) === -1) {
          this.raise(state.start, "Invalid regular expression flag");
        }
        if (flags.indexOf(flag, i2 + 1) > -1) {
          this.raise(state.start, "Duplicate regular expression flag");
        }
        if (flag === "u") {
          u = true;
        }
        if (flag === "v") {
          v = true;
        }
      }
      if (this.options.ecmaVersion >= 15 && u && v) {
        this.raise(state.start, "Invalid regular expression flag");
      }
    };
    pp$1.validateRegExpPattern = function(state) {
      this.regexp_pattern(state);
      if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
        state.switchN = true;
        this.regexp_pattern(state);
      }
    };
    pp$1.regexp_pattern = function(state) {
      state.pos = 0;
      state.lastIntValue = 0;
      state.lastStringValue = "";
      state.lastAssertionIsQuantifiable = false;
      state.numCapturingParens = 0;
      state.maxBackReference = 0;
      state.groupNames = /* @__PURE__ */ Object.create(null);
      state.backReferenceNames.length = 0;
      state.branchID = null;
      this.regexp_disjunction(state);
      if (state.pos !== state.source.length) {
        if (state.eat(
          41
          /* ) */
        )) {
          state.raise("Unmatched ')'");
        }
        if (state.eat(
          93
          /* ] */
        ) || state.eat(
          125
          /* } */
        )) {
          state.raise("Lone quantifier brackets");
        }
      }
      if (state.maxBackReference > state.numCapturingParens) {
        state.raise("Invalid escape");
      }
      for (var i2 = 0, list2 = state.backReferenceNames; i2 < list2.length; i2 += 1) {
        var name = list2[i2];
        if (!state.groupNames[name]) {
          state.raise("Invalid named capture referenced");
        }
      }
    };
    pp$1.regexp_disjunction = function(state) {
      var trackDisjunction = this.options.ecmaVersion >= 16;
      if (trackDisjunction) {
        state.branchID = new BranchID(state.branchID, null);
      }
      this.regexp_alternative(state);
      while (state.eat(
        124
        /* | */
      )) {
        if (trackDisjunction) {
          state.branchID = state.branchID.sibling();
        }
        this.regexp_alternative(state);
      }
      if (trackDisjunction) {
        state.branchID = state.branchID.parent;
      }
      if (this.regexp_eatQuantifier(state, true)) {
        state.raise("Nothing to repeat");
      }
      if (state.eat(
        123
        /* { */
      )) {
        state.raise("Lone quantifier brackets");
      }
    };
    pp$1.regexp_alternative = function(state) {
      while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
      }
    };
    pp$1.regexp_eatTerm = function(state) {
      if (this.regexp_eatAssertion(state)) {
        if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
          if (state.switchU) {
            state.raise("Invalid quantifier");
          }
        }
        return true;
      }
      if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
        this.regexp_eatQuantifier(state);
        return true;
      }
      return false;
    };
    pp$1.regexp_eatAssertion = function(state) {
      var start = state.pos;
      state.lastAssertionIsQuantifiable = false;
      if (state.eat(
        94
        /* ^ */
      ) || state.eat(
        36
        /* $ */
      )) {
        return true;
      }
      if (state.eat(
        92
        /* \ */
      )) {
        if (state.eat(
          66
          /* B */
        ) || state.eat(
          98
          /* b */
        )) {
          return true;
        }
        state.pos = start;
      }
      if (state.eat(
        40
        /* ( */
      ) && state.eat(
        63
        /* ? */
      )) {
        var lookbehind = false;
        if (this.options.ecmaVersion >= 9) {
          lookbehind = state.eat(
            60
            /* < */
          );
        }
        if (state.eat(
          61
          /* = */
        ) || state.eat(
          33
          /* ! */
        )) {
          this.regexp_disjunction(state);
          if (!state.eat(
            41
            /* ) */
          )) {
            state.raise("Unterminated group");
          }
          state.lastAssertionIsQuantifiable = !lookbehind;
          return true;
        }
      }
      state.pos = start;
      return false;
    };
    pp$1.regexp_eatQuantifier = function(state, noError) {
      if (noError === void 0) noError = false;
      if (this.regexp_eatQuantifierPrefix(state, noError)) {
        state.eat(
          63
          /* ? */
        );
        return true;
      }
      return false;
    };
    pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
      return state.eat(
        42
        /* * */
      ) || state.eat(
        43
        /* + */
      ) || state.eat(
        63
        /* ? */
      ) || this.regexp_eatBracedQuantifier(state, noError);
    };
    pp$1.regexp_eatBracedQuantifier = function(state, noError) {
      var start = state.pos;
      if (state.eat(
        123
        /* { */
      )) {
        var min = 0, max = -1;
        if (this.regexp_eatDecimalDigits(state)) {
          min = state.lastIntValue;
          if (state.eat(
            44
            /* , */
          ) && this.regexp_eatDecimalDigits(state)) {
            max = state.lastIntValue;
          }
          if (state.eat(
            125
            /* } */
          )) {
            if (max !== -1 && max < min && !noError) {
              state.raise("numbers out of order in {} quantifier");
            }
            return true;
          }
        }
        if (state.switchU && !noError) {
          state.raise("Incomplete quantifier");
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatAtom = function(state) {
      return this.regexp_eatPatternCharacters(state) || state.eat(
        46
        /* . */
      ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
    };
    pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
      var start = state.pos;
      if (state.eat(
        92
        /* \ */
      )) {
        if (this.regexp_eatAtomEscape(state)) {
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatUncapturingGroup = function(state) {
      var start = state.pos;
      if (state.eat(
        40
        /* ( */
      )) {
        if (state.eat(
          63
          /* ? */
        )) {
          if (this.options.ecmaVersion >= 16) {
            var addModifiers = this.regexp_eatModifiers(state);
            var hasHyphen = state.eat(
              45
              /* - */
            );
            if (addModifiers || hasHyphen) {
              for (var i2 = 0; i2 < addModifiers.length; i2++) {
                var modifier = addModifiers.charAt(i2);
                if (addModifiers.indexOf(modifier, i2 + 1) > -1) {
                  state.raise("Duplicate regular expression modifiers");
                }
              }
              if (hasHyphen) {
                var removeModifiers = this.regexp_eatModifiers(state);
                if (!addModifiers && !removeModifiers && state.current() === 58) {
                  state.raise("Invalid regular expression modifiers");
                }
                for (var i$1 = 0; i$1 < removeModifiers.length; i$1++) {
                  var modifier$1 = removeModifiers.charAt(i$1);
                  if (removeModifiers.indexOf(modifier$1, i$1 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) {
                    state.raise("Duplicate regular expression modifiers");
                  }
                }
              }
            }
          }
          if (state.eat(
            58
            /* : */
          )) {
            this.regexp_disjunction(state);
            if (state.eat(
              41
              /* ) */
            )) {
              return true;
            }
            state.raise("Unterminated group");
          }
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatCapturingGroup = function(state) {
      if (state.eat(
        40
        /* ( */
      )) {
        if (this.options.ecmaVersion >= 9) {
          this.regexp_groupSpecifier(state);
        } else if (state.current() === 63) {
          state.raise("Invalid group");
        }
        this.regexp_disjunction(state);
        if (state.eat(
          41
          /* ) */
        )) {
          state.numCapturingParens += 1;
          return true;
        }
        state.raise("Unterminated group");
      }
      return false;
    };
    pp$1.regexp_eatModifiers = function(state) {
      var modifiers = "";
      var ch = 0;
      while ((ch = state.current()) !== -1 && isRegularExpressionModifier(ch)) {
        modifiers += codePointToString(ch);
        state.advance();
      }
      return modifiers;
    };
    pp$1.regexp_eatExtendedAtom = function(state) {
      return state.eat(
        46
        /* . */
      ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
    };
    pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
      if (this.regexp_eatBracedQuantifier(state, true)) {
        state.raise("Nothing to repeat");
      }
      return false;
    };
    pp$1.regexp_eatSyntaxCharacter = function(state) {
      var ch = state.current();
      if (isSyntaxCharacter(ch)) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatPatternCharacters = function(state) {
      var start = state.pos;
      var ch = 0;
      while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
        state.advance();
      }
      return state.pos !== start;
    };
    pp$1.regexp_eatExtendedPatternCharacter = function(state) {
      var ch = state.current();
      if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_groupSpecifier = function(state) {
      if (state.eat(
        63
        /* ? */
      )) {
        if (!this.regexp_eatGroupName(state)) {
          state.raise("Invalid group");
        }
        var trackDisjunction = this.options.ecmaVersion >= 16;
        var known = state.groupNames[state.lastStringValue];
        if (known) {
          if (trackDisjunction) {
            for (var i2 = 0, list2 = known; i2 < list2.length; i2 += 1) {
              var altID = list2[i2];
              if (!altID.separatedFrom(state.branchID)) {
                state.raise("Duplicate capture group name");
              }
            }
          } else {
            state.raise("Duplicate capture group name");
          }
        }
        if (trackDisjunction) {
          (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
        } else {
          state.groupNames[state.lastStringValue] = true;
        }
      }
    };
    pp$1.regexp_eatGroupName = function(state) {
      state.lastStringValue = "";
      if (state.eat(
        60
        /* < */
      )) {
        if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
          62
          /* > */
        )) {
          return true;
        }
        state.raise("Invalid capture group name");
      }
      return false;
    };
    pp$1.regexp_eatRegExpIdentifierName = function(state) {
      state.lastStringValue = "";
      if (this.regexp_eatRegExpIdentifierStart(state)) {
        state.lastStringValue += codePointToString(state.lastIntValue);
        while (this.regexp_eatRegExpIdentifierPart(state)) {
          state.lastStringValue += codePointToString(state.lastIntValue);
        }
        return true;
      }
      return false;
    };
    pp$1.regexp_eatRegExpIdentifierStart = function(state) {
      var start = state.pos;
      var forceU = this.options.ecmaVersion >= 11;
      var ch = state.current(forceU);
      state.advance(forceU);
      if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
        ch = state.lastIntValue;
      }
      if (isRegExpIdentifierStart(ch)) {
        state.lastIntValue = ch;
        return true;
      }
      state.pos = start;
      return false;
    };
    pp$1.regexp_eatRegExpIdentifierPart = function(state) {
      var start = state.pos;
      var forceU = this.options.ecmaVersion >= 11;
      var ch = state.current(forceU);
      state.advance(forceU);
      if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
        ch = state.lastIntValue;
      }
      if (isRegExpIdentifierPart(ch)) {
        state.lastIntValue = ch;
        return true;
      }
      state.pos = start;
      return false;
    };
    pp$1.regexp_eatAtomEscape = function(state) {
      if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
        return true;
      }
      if (state.switchU) {
        if (state.current() === 99) {
          state.raise("Invalid unicode escape");
        }
        state.raise("Invalid escape");
      }
      return false;
    };
    pp$1.regexp_eatBackReference = function(state) {
      var start = state.pos;
      if (this.regexp_eatDecimalEscape(state)) {
        var n = state.lastIntValue;
        if (state.switchU) {
          if (n > state.maxBackReference) {
            state.maxBackReference = n;
          }
          return true;
        }
        if (n <= state.numCapturingParens) {
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatKGroupName = function(state) {
      if (state.eat(
        107
        /* k */
      )) {
        if (this.regexp_eatGroupName(state)) {
          state.backReferenceNames.push(state.lastStringValue);
          return true;
        }
        state.raise("Invalid named reference");
      }
      return false;
    };
    pp$1.regexp_eatCharacterEscape = function(state) {
      return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
    };
    pp$1.regexp_eatCControlLetter = function(state) {
      var start = state.pos;
      if (state.eat(
        99
        /* c */
      )) {
        if (this.regexp_eatControlLetter(state)) {
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatZero = function(state) {
      if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
        state.lastIntValue = 0;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatControlEscape = function(state) {
      var ch = state.current();
      if (ch === 116) {
        state.lastIntValue = 9;
        state.advance();
        return true;
      }
      if (ch === 110) {
        state.lastIntValue = 10;
        state.advance();
        return true;
      }
      if (ch === 118) {
        state.lastIntValue = 11;
        state.advance();
        return true;
      }
      if (ch === 102) {
        state.lastIntValue = 12;
        state.advance();
        return true;
      }
      if (ch === 114) {
        state.lastIntValue = 13;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatControlLetter = function(state) {
      var ch = state.current();
      if (isControlLetter(ch)) {
        state.lastIntValue = ch % 32;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
      if (forceU === void 0) forceU = false;
      var start = state.pos;
      var switchU = forceU || state.switchU;
      if (state.eat(
        117
        /* u */
      )) {
        if (this.regexp_eatFixedHexDigits(state, 4)) {
          var lead = state.lastIntValue;
          if (switchU && lead >= 55296 && lead <= 56319) {
            var leadSurrogateEnd = state.pos;
            if (state.eat(
              92
              /* \ */
            ) && state.eat(
              117
              /* u */
            ) && this.regexp_eatFixedHexDigits(state, 4)) {
              var trail = state.lastIntValue;
              if (trail >= 56320 && trail <= 57343) {
                state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
                return true;
              }
            }
            state.pos = leadSurrogateEnd;
            state.lastIntValue = lead;
          }
          return true;
        }
        if (switchU && state.eat(
          123
          /* { */
        ) && this.regexp_eatHexDigits(state) && state.eat(
          125
          /* } */
        ) && isValidUnicode(state.lastIntValue)) {
          return true;
        }
        if (switchU) {
          state.raise("Invalid unicode escape");
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatIdentityEscape = function(state) {
      if (state.switchU) {
        if (this.regexp_eatSyntaxCharacter(state)) {
          return true;
        }
        if (state.eat(
          47
          /* / */
        )) {
          state.lastIntValue = 47;
          return true;
        }
        return false;
      }
      var ch = state.current();
      if (ch !== 99 && (!state.switchN || ch !== 107)) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatDecimalEscape = function(state) {
      state.lastIntValue = 0;
      var ch = state.current();
      if (ch >= 49 && ch <= 57) {
        do {
          state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
          state.advance();
        } while ((ch = state.current()) >= 48 && ch <= 57);
        return true;
      }
      return false;
    };
    CharSetNone = 0;
    CharSetOk = 1;
    CharSetString = 2;
    pp$1.regexp_eatCharacterClassEscape = function(state) {
      var ch = state.current();
      if (isCharacterClassEscape(ch)) {
        state.lastIntValue = -1;
        state.advance();
        return CharSetOk;
      }
      var negate = false;
      if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
        state.lastIntValue = -1;
        state.advance();
        var result;
        if (state.eat(
          123
          /* { */
        ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
          125
          /* } */
        )) {
          if (negate && result === CharSetString) {
            state.raise("Invalid property name");
          }
          return result;
        }
        state.raise("Invalid property name");
      }
      return CharSetNone;
    };
    pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
      var start = state.pos;
      if (this.regexp_eatUnicodePropertyName(state) && state.eat(
        61
        /* = */
      )) {
        var name = state.lastStringValue;
        if (this.regexp_eatUnicodePropertyValue(state)) {
          var value = state.lastStringValue;
          this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
          return CharSetOk;
        }
      }
      state.pos = start;
      if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
        var nameOrValue = state.lastStringValue;
        return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
      }
      return CharSetNone;
    };
    pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
      if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
        state.raise("Invalid property name");
      }
      if (!state.unicodeProperties.nonBinary[name].test(value)) {
        state.raise("Invalid property value");
      }
    };
    pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
      if (state.unicodeProperties.binary.test(nameOrValue)) {
        return CharSetOk;
      }
      if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) {
        return CharSetString;
      }
      state.raise("Invalid property name");
    };
    pp$1.regexp_eatUnicodePropertyName = function(state) {
      var ch = 0;
      state.lastStringValue = "";
      while (isUnicodePropertyNameCharacter(ch = state.current())) {
        state.lastStringValue += codePointToString(ch);
        state.advance();
      }
      return state.lastStringValue !== "";
    };
    pp$1.regexp_eatUnicodePropertyValue = function(state) {
      var ch = 0;
      state.lastStringValue = "";
      while (isUnicodePropertyValueCharacter(ch = state.current())) {
        state.lastStringValue += codePointToString(ch);
        state.advance();
      }
      return state.lastStringValue !== "";
    };
    pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
      return this.regexp_eatUnicodePropertyValue(state);
    };
    pp$1.regexp_eatCharacterClass = function(state) {
      if (state.eat(
        91
        /* [ */
      )) {
        var negate = state.eat(
          94
          /* ^ */
        );
        var result = this.regexp_classContents(state);
        if (!state.eat(
          93
          /* ] */
        )) {
          state.raise("Unterminated character class");
        }
        if (negate && result === CharSetString) {
          state.raise("Negated character class may contain strings");
        }
        return true;
      }
      return false;
    };
    pp$1.regexp_classContents = function(state) {
      if (state.current() === 93) {
        return CharSetOk;
      }
      if (state.switchV) {
        return this.regexp_classSetExpression(state);
      }
      this.regexp_nonEmptyClassRanges(state);
      return CharSetOk;
    };
    pp$1.regexp_nonEmptyClassRanges = function(state) {
      while (this.regexp_eatClassAtom(state)) {
        var left = state.lastIntValue;
        if (state.eat(
          45
          /* - */
        ) && this.regexp_eatClassAtom(state)) {
          var right = state.lastIntValue;
          if (state.switchU && (left === -1 || right === -1)) {
            state.raise("Invalid character class");
          }
          if (left !== -1 && right !== -1 && left > right) {
            state.raise("Range out of order in character class");
          }
        }
      }
    };
    pp$1.regexp_eatClassAtom = function(state) {
      var start = state.pos;
      if (state.eat(
        92
        /* \ */
      )) {
        if (this.regexp_eatClassEscape(state)) {
          return true;
        }
        if (state.switchU) {
          var ch$1 = state.current();
          if (ch$1 === 99 || isOctalDigit(ch$1)) {
            state.raise("Invalid class escape");
          }
          state.raise("Invalid escape");
        }
        state.pos = start;
      }
      var ch = state.current();
      if (ch !== 93) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatClassEscape = function(state) {
      var start = state.pos;
      if (state.eat(
        98
        /* b */
      )) {
        state.lastIntValue = 8;
        return true;
      }
      if (state.switchU && state.eat(
        45
        /* - */
      )) {
        state.lastIntValue = 45;
        return true;
      }
      if (!state.switchU && state.eat(
        99
        /* c */
      )) {
        if (this.regexp_eatClassControlLetter(state)) {
          return true;
        }
        state.pos = start;
      }
      return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
    };
    pp$1.regexp_classSetExpression = function(state) {
      var result = CharSetOk, subResult;
      if (this.regexp_eatClassSetRange(state)) ;
      else if (subResult = this.regexp_eatClassSetOperand(state)) {
        if (subResult === CharSetString) {
          result = CharSetString;
        }
        var start = state.pos;
        while (state.eatChars(
          [38, 38]
          /* && */
        )) {
          if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
            if (subResult !== CharSetString) {
              result = CharSetOk;
            }
            continue;
          }
          state.raise("Invalid character in character class");
        }
        if (start !== state.pos) {
          return result;
        }
        while (state.eatChars(
          [45, 45]
          /* -- */
        )) {
          if (this.regexp_eatClassSetOperand(state)) {
            continue;
          }
          state.raise("Invalid character in character class");
        }
        if (start !== state.pos) {
          return result;
        }
      } else {
        state.raise("Invalid character in character class");
      }
      for (; ; ) {
        if (this.regexp_eatClassSetRange(state)) {
          continue;
        }
        subResult = this.regexp_eatClassSetOperand(state);
        if (!subResult) {
          return result;
        }
        if (subResult === CharSetString) {
          result = CharSetString;
        }
      }
    };
    pp$1.regexp_eatClassSetRange = function(state) {
      var start = state.pos;
      if (this.regexp_eatClassSetCharacter(state)) {
        var left = state.lastIntValue;
        if (state.eat(
          45
          /* - */
        ) && this.regexp_eatClassSetCharacter(state)) {
          var right = state.lastIntValue;
          if (left !== -1 && right !== -1 && left > right) {
            state.raise("Range out of order in character class");
          }
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatClassSetOperand = function(state) {
      if (this.regexp_eatClassSetCharacter(state)) {
        return CharSetOk;
      }
      return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
    };
    pp$1.regexp_eatNestedClass = function(state) {
      var start = state.pos;
      if (state.eat(
        91
        /* [ */
      )) {
        var negate = state.eat(
          94
          /* ^ */
        );
        var result = this.regexp_classContents(state);
        if (state.eat(
          93
          /* ] */
        )) {
          if (negate && result === CharSetString) {
            state.raise("Negated character class may contain strings");
          }
          return result;
        }
        state.pos = start;
      }
      if (state.eat(
        92
        /* \ */
      )) {
        var result$1 = this.regexp_eatCharacterClassEscape(state);
        if (result$1) {
          return result$1;
        }
        state.pos = start;
      }
      return null;
    };
    pp$1.regexp_eatClassStringDisjunction = function(state) {
      var start = state.pos;
      if (state.eatChars(
        [92, 113]
        /* \q */
      )) {
        if (state.eat(
          123
          /* { */
        )) {
          var result = this.regexp_classStringDisjunctionContents(state);
          if (state.eat(
            125
            /* } */
          )) {
            return result;
          }
        } else {
          state.raise("Invalid escape");
        }
        state.pos = start;
      }
      return null;
    };
    pp$1.regexp_classStringDisjunctionContents = function(state) {
      var result = this.regexp_classString(state);
      while (state.eat(
        124
        /* | */
      )) {
        if (this.regexp_classString(state) === CharSetString) {
          result = CharSetString;
        }
      }
      return result;
    };
    pp$1.regexp_classString = function(state) {
      var count = 0;
      while (this.regexp_eatClassSetCharacter(state)) {
        count++;
      }
      return count === 1 ? CharSetOk : CharSetString;
    };
    pp$1.regexp_eatClassSetCharacter = function(state) {
      var start = state.pos;
      if (state.eat(
        92
        /* \ */
      )) {
        if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) {
          return true;
        }
        if (state.eat(
          98
          /* b */
        )) {
          state.lastIntValue = 8;
          return true;
        }
        state.pos = start;
        return false;
      }
      var ch = state.current();
      if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) {
        return false;
      }
      if (isClassSetSyntaxCharacter(ch)) {
        return false;
      }
      state.advance();
      state.lastIntValue = ch;
      return true;
    };
    pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
      var ch = state.current();
      if (isClassSetReservedPunctuator(ch)) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatClassControlLetter = function(state) {
      var ch = state.current();
      if (isDecimalDigit(ch) || ch === 95) {
        state.lastIntValue = ch % 32;
        state.advance();
        return true;
      }
      return false;
    };
    pp$1.regexp_eatHexEscapeSequence = function(state) {
      var start = state.pos;
      if (state.eat(
        120
        /* x */
      )) {
        if (this.regexp_eatFixedHexDigits(state, 2)) {
          return true;
        }
        if (state.switchU) {
          state.raise("Invalid escape");
        }
        state.pos = start;
      }
      return false;
    };
    pp$1.regexp_eatDecimalDigits = function(state) {
      var start = state.pos;
      var ch = 0;
      state.lastIntValue = 0;
      while (isDecimalDigit(ch = state.current())) {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
        state.advance();
      }
      return state.pos !== start;
    };
    pp$1.regexp_eatHexDigits = function(state) {
      var start = state.pos;
      var ch = 0;
      state.lastIntValue = 0;
      while (isHexDigit(ch = state.current())) {
        state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
        state.advance();
      }
      return state.pos !== start;
    };
    pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
      if (this.regexp_eatOctalDigit(state)) {
        var n1 = state.lastIntValue;
        if (this.regexp_eatOctalDigit(state)) {
          var n2 = state.lastIntValue;
          if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
            state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
          } else {
            state.lastIntValue = n1 * 8 + n2;
          }
        } else {
          state.lastIntValue = n1;
        }
        return true;
      }
      return false;
    };
    pp$1.regexp_eatOctalDigit = function(state) {
      var ch = state.current();
      if (isOctalDigit(ch)) {
        state.lastIntValue = ch - 48;
        state.advance();
        return true;
      }
      state.lastIntValue = 0;
      return false;
    };
    pp$1.regexp_eatFixedHexDigits = function(state, length) {
      var start = state.pos;
      state.lastIntValue = 0;
      for (var i2 = 0; i2 < length; ++i2) {
        var ch = state.current();
        if (!isHexDigit(ch)) {
          state.pos = start;
          return false;
        }
        state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
        state.advance();
      }
      return true;
    };
    Token = function Token2(p) {
      this.type = p.type;
      this.value = p.value;
      this.start = p.start;
      this.end = p.end;
      if (p.options.locations) {
        this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
      }
      if (p.options.ranges) {
        this.range = [p.start, p.end];
      }
    };
    pp = Parser.prototype;
    pp.next = function(ignoreEscapeSequenceInKeyword) {
      if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
        this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
      }
      if (this.options.onToken) {
        this.options.onToken(new Token(this));
      }
      this.lastTokEnd = this.end;
      this.lastTokStart = this.start;
      this.lastTokEndLoc = this.endLoc;
      this.lastTokStartLoc = this.startLoc;
      this.nextToken();
    };
    pp.getToken = function() {
      this.next();
      return new Token(this);
    };
    if (typeof Symbol !== "undefined") {
      pp[Symbol.iterator] = function() {
        var this$1$1 = this;
        return {
          next: function() {
            var token = this$1$1.getToken();
            return {
              done: token.type === types$1.eof,
              value: token
            };
          }
        };
      };
    }
    pp.nextToken = function() {
      var curContext = this.curContext();
      if (!curContext || !curContext.preserveSpace) {
        this.skipSpace();
      }
      this.start = this.pos;
      if (this.options.locations) {
        this.startLoc = this.curPosition();
      }
      if (this.pos >= this.input.length) {
        return this.finishToken(types$1.eof);
      }
      if (curContext.override) {
        return curContext.override(this);
      } else {
        this.readToken(this.fullCharCodeAtPos());
      }
    };
    pp.readToken = function(code2) {
      if (isIdentifierStart(code2, this.options.ecmaVersion >= 6) || code2 === 92) {
        return this.readWord();
      }
      return this.getTokenFromCode(code2);
    };
    pp.fullCharCodeAt = function(pos) {
      var code2 = this.input.charCodeAt(pos);
      if (code2 <= 55295 || code2 >= 56320) {
        return code2;
      }
      var next = this.input.charCodeAt(pos + 1);
      return next <= 56319 || next >= 57344 ? code2 : (code2 << 10) + next - 56613888;
    };
    pp.fullCharCodeAtPos = function() {
      return this.fullCharCodeAt(this.pos);
    };
    pp.skipBlockComment = function() {
      var startLoc = this.options.onComment && this.curPosition();
      var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
      if (end === -1) {
        this.raise(this.pos - 2, "Unterminated comment");
      }
      this.pos = end + 2;
      if (this.options.locations) {
        for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
          ++this.curLine;
          pos = this.lineStart = nextBreak;
        }
      }
      if (this.options.onComment) {
        this.options.onComment(
          true,
          this.input.slice(start + 2, end),
          start,
          this.pos,
          startLoc,
          this.curPosition()
        );
      }
    };
    pp.skipLineComment = function(startSkip) {
      var start = this.pos;
      var startLoc = this.options.onComment && this.curPosition();
      var ch = this.input.charCodeAt(this.pos += startSkip);
      while (this.pos < this.input.length && !isNewLine(ch)) {
        ch = this.input.charCodeAt(++this.pos);
      }
      if (this.options.onComment) {
        this.options.onComment(
          false,
          this.input.slice(start + startSkip, this.pos),
          start,
          this.pos,
          startLoc,
          this.curPosition()
        );
      }
    };
    pp.skipSpace = function() {
      loop: while (this.pos < this.input.length) {
        var ch = this.input.charCodeAt(this.pos);
        switch (ch) {
          case 32:
          case 160:
            ++this.pos;
            break;
          case 13:
            if (this.input.charCodeAt(this.pos + 1) === 10) {
              ++this.pos;
            }
          case 10:
          case 8232:
          case 8233:
            ++this.pos;
            if (this.options.locations) {
              ++this.curLine;
              this.lineStart = this.pos;
            }
            break;
          case 47:
            switch (this.input.charCodeAt(this.pos + 1)) {
              case 42:
                this.skipBlockComment();
                break;
              case 47:
                this.skipLineComment(2);
                break;
              default:
                break loop;
            }
            break;
          default:
            if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
              ++this.pos;
            } else {
              break loop;
            }
        }
      }
    };
    pp.finishToken = function(type, val) {
      this.end = this.pos;
      if (this.options.locations) {
        this.endLoc = this.curPosition();
      }
      var prevType = this.type;
      this.type = type;
      this.value = val;
      this.updateContext(prevType);
    };
    pp.readToken_dot = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next >= 48 && next <= 57) {
        return this.readNumber(true);
      }
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
        this.pos += 3;
        return this.finishToken(types$1.ellipsis);
      } else {
        ++this.pos;
        return this.finishToken(types$1.dot);
      }
    };
    pp.readToken_slash = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (this.exprAllowed) {
        ++this.pos;
        return this.readRegexp();
      }
      if (next === 61) {
        return this.finishOp(types$1.assign, 2);
      }
      return this.finishOp(types$1.slash, 1);
    };
    pp.readToken_mult_modulo_exp = function(code2) {
      var next = this.input.charCodeAt(this.pos + 1);
      var size = 1;
      var tokentype = code2 === 42 ? types$1.star : types$1.modulo;
      if (this.options.ecmaVersion >= 7 && code2 === 42 && next === 42) {
        ++size;
        tokentype = types$1.starstar;
        next = this.input.charCodeAt(this.pos + 2);
      }
      if (next === 61) {
        return this.finishOp(types$1.assign, size + 1);
      }
      return this.finishOp(tokentype, size);
    };
    pp.readToken_pipe_amp = function(code2) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code2) {
        if (this.options.ecmaVersion >= 12) {
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (next2 === 61) {
            return this.finishOp(types$1.assign, 3);
          }
        }
        return this.finishOp(code2 === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
      }
      if (next === 61) {
        return this.finishOp(types$1.assign, 2);
      }
      return this.finishOp(code2 === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
    };
    pp.readToken_caret = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 61) {
        return this.finishOp(types$1.assign, 2);
      }
      return this.finishOp(types$1.bitwiseXOR, 1);
    };
    pp.readToken_plus_min = function(code2) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code2) {
        if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
          this.skipLineComment(3);
          this.skipSpace();
          return this.nextToken();
        }
        return this.finishOp(types$1.incDec, 2);
      }
      if (next === 61) {
        return this.finishOp(types$1.assign, 2);
      }
      return this.finishOp(types$1.plusMin, 1);
    };
    pp.readToken_lt_gt = function(code2) {
      var next = this.input.charCodeAt(this.pos + 1);
      var size = 1;
      if (next === code2) {
        size = code2 === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
        if (this.input.charCodeAt(this.pos + size) === 61) {
          return this.finishOp(types$1.assign, size + 1);
        }
        return this.finishOp(types$1.bitShift, size);
      }
      if (next === 33 && code2 === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
        this.skipLineComment(4);
        this.skipSpace();
        return this.nextToken();
      }
      if (next === 61) {
        size = 2;
      }
      return this.finishOp(types$1.relational, size);
    };
    pp.readToken_eq_excl = function(code2) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 61) {
        return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
      }
      if (code2 === 61 && next === 62 && this.options.ecmaVersion >= 6) {
        this.pos += 2;
        return this.finishToken(types$1.arrow);
      }
      return this.finishOp(code2 === 61 ? types$1.eq : types$1.prefix, 1);
    };
    pp.readToken_question = function() {
      var ecmaVersion2 = this.options.ecmaVersion;
      if (ecmaVersion2 >= 11) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 46) {
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (next2 < 48 || next2 > 57) {
            return this.finishOp(types$1.questionDot, 2);
          }
        }
        if (next === 63) {
          if (ecmaVersion2 >= 12) {
            var next2$1 = this.input.charCodeAt(this.pos + 2);
            if (next2$1 === 61) {
              return this.finishOp(types$1.assign, 3);
            }
          }
          return this.finishOp(types$1.coalesce, 2);
        }
      }
      return this.finishOp(types$1.question, 1);
    };
    pp.readToken_numberSign = function() {
      var ecmaVersion2 = this.options.ecmaVersion;
      var code2 = 35;
      if (ecmaVersion2 >= 13) {
        ++this.pos;
        code2 = this.fullCharCodeAtPos();
        if (isIdentifierStart(code2, true) || code2 === 92) {
          return this.finishToken(types$1.privateId, this.readWord1());
        }
      }
      this.raise(this.pos, "Unexpected character '" + codePointToString(code2) + "'");
    };
    pp.getTokenFromCode = function(code2) {
      switch (code2) {
        // The interpretation of a dot depends on whether it is followed
        // by a digit or another two dots.
        case 46:
          return this.readToken_dot();
        // Punctuation tokens.
        case 40:
          ++this.pos;
          return this.finishToken(types$1.parenL);
        case 41:
          ++this.pos;
          return this.finishToken(types$1.parenR);
        case 59:
          ++this.pos;
          return this.finishToken(types$1.semi);
        case 44:
          ++this.pos;
          return this.finishToken(types$1.comma);
        case 91:
          ++this.pos;
          return this.finishToken(types$1.bracketL);
        case 93:
          ++this.pos;
          return this.finishToken(types$1.bracketR);
        case 123:
          ++this.pos;
          return this.finishToken(types$1.braceL);
        case 125:
          ++this.pos;
          return this.finishToken(types$1.braceR);
        case 58:
          ++this.pos;
          return this.finishToken(types$1.colon);
        case 96:
          if (this.options.ecmaVersion < 6) {
            break;
          }
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        case 48:
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 120 || next === 88) {
            return this.readRadixNumber(16);
          }
          if (this.options.ecmaVersion >= 6) {
            if (next === 111 || next === 79) {
              return this.readRadixNumber(8);
            }
            if (next === 98 || next === 66) {
              return this.readRadixNumber(2);
            }
          }
        // Anything else beginning with a digit is an integer, octal
        // number, or float.
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          return this.readNumber(false);
        // Quotes produce strings.
        case 34:
        case 39:
          return this.readString(code2);
        // Operators are parsed inline in tiny state machines. '=' (61) is
        // often referred to. `finishOp` simply skips the amount of
        // characters it is given as second argument, and returns a token
        // of the type given by its first argument.
        case 47:
          return this.readToken_slash();
        case 37:
        case 42:
          return this.readToken_mult_modulo_exp(code2);
        case 124:
        case 38:
          return this.readToken_pipe_amp(code2);
        case 94:
          return this.readToken_caret();
        case 43:
        case 45:
          return this.readToken_plus_min(code2);
        case 60:
        case 62:
          return this.readToken_lt_gt(code2);
        case 61:
        case 33:
          return this.readToken_eq_excl(code2);
        case 63:
          return this.readToken_question();
        case 126:
          return this.finishOp(types$1.prefix, 1);
        case 35:
          return this.readToken_numberSign();
      }
      this.raise(this.pos, "Unexpected character '" + codePointToString(code2) + "'");
    };
    pp.finishOp = function(type, size) {
      var str = this.input.slice(this.pos, this.pos + size);
      this.pos += size;
      return this.finishToken(type, str);
    };
    pp.readRegexp = function() {
      var escaped, inClass, start = this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) {
          this.raise(start, "Unterminated regular expression");
        }
        var ch = this.input.charAt(this.pos);
        if (lineBreak.test(ch)) {
          this.raise(start, "Unterminated regular expression");
        }
        if (!escaped) {
          if (ch === "[") {
            inClass = true;
          } else if (ch === "]" && inClass) {
            inClass = false;
          } else if (ch === "/" && !inClass) {
            break;
          }
          escaped = ch === "\\";
        } else {
          escaped = false;
        }
        ++this.pos;
      }
      var pattern = this.input.slice(start, this.pos);
      ++this.pos;
      var flagsStart = this.pos;
      var flags = this.readWord1();
      if (this.containsEsc) {
        this.unexpected(flagsStart);
      }
      var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
      state.reset(start, pattern, flags);
      this.validateRegExpFlags(state);
      this.validateRegExpPattern(state);
      var value = null;
      try {
        value = new RegExp(pattern, flags);
      } catch (e) {
      }
      return this.finishToken(types$1.regexp, { pattern, flags, value });
    };
    pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
      var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
      var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
      var start = this.pos, total = 0, lastCode = 0;
      for (var i2 = 0, e = len == null ? Infinity : len; i2 < e; ++i2, ++this.pos) {
        var code2 = this.input.charCodeAt(this.pos), val = void 0;
        if (allowSeparators && code2 === 95) {
          if (isLegacyOctalNumericLiteral) {
            this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
          }
          if (lastCode === 95) {
            this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
          }
          if (i2 === 0) {
            this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
          }
          lastCode = code2;
          continue;
        }
        if (code2 >= 97) {
          val = code2 - 97 + 10;
        } else if (code2 >= 65) {
          val = code2 - 65 + 10;
        } else if (code2 >= 48 && code2 <= 57) {
          val = code2 - 48;
        } else {
          val = Infinity;
        }
        if (val >= radix) {
          break;
        }
        lastCode = code2;
        total = total * radix + val;
      }
      if (allowSeparators && lastCode === 95) {
        this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
      }
      if (this.pos === start || len != null && this.pos - start !== len) {
        return null;
      }
      return total;
    };
    pp.readRadixNumber = function(radix) {
      var start = this.pos;
      this.pos += 2;
      var val = this.readInt(radix);
      if (val == null) {
        this.raise(this.start + 2, "Expected number in radix " + radix);
      }
      if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
        val = stringToBigInt(this.input.slice(start, this.pos));
        ++this.pos;
      } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
        this.raise(this.pos, "Identifier directly after number");
      }
      return this.finishToken(types$1.num, val);
    };
    pp.readNumber = function(startsWithDot) {
      var start = this.pos;
      if (!startsWithDot && this.readInt(10, void 0, true) === null) {
        this.raise(start, "Invalid number");
      }
      var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
      if (octal && this.strict) {
        this.raise(start, "Invalid number");
      }
      var next = this.input.charCodeAt(this.pos);
      if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
        var val$1 = stringToBigInt(this.input.slice(start, this.pos));
        ++this.pos;
        if (isIdentifierStart(this.fullCharCodeAtPos())) {
          this.raise(this.pos, "Identifier directly after number");
        }
        return this.finishToken(types$1.num, val$1);
      }
      if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
        octal = false;
      }
      if (next === 46 && !octal) {
        ++this.pos;
        this.readInt(10);
        next = this.input.charCodeAt(this.pos);
      }
      if ((next === 69 || next === 101) && !octal) {
        next = this.input.charCodeAt(++this.pos);
        if (next === 43 || next === 45) {
          ++this.pos;
        }
        if (this.readInt(10) === null) {
          this.raise(start, "Invalid number");
        }
      }
      if (isIdentifierStart(this.fullCharCodeAtPos())) {
        this.raise(this.pos, "Identifier directly after number");
      }
      var val = stringToNumber(this.input.slice(start, this.pos), octal);
      return this.finishToken(types$1.num, val);
    };
    pp.readCodePoint = function() {
      var ch = this.input.charCodeAt(this.pos), code2;
      if (ch === 123) {
        if (this.options.ecmaVersion < 6) {
          this.unexpected();
        }
        var codePos = ++this.pos;
        code2 = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
        ++this.pos;
        if (code2 > 1114111) {
          this.invalidStringToken(codePos, "Code point out of bounds");
        }
      } else {
        code2 = this.readHexChar(4);
      }
      return code2;
    };
    pp.readString = function(quote) {
      var out = "", chunkStart = ++this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) {
          this.raise(this.start, "Unterminated string constant");
        }
        var ch = this.input.charCodeAt(this.pos);
        if (ch === quote) {
          break;
        }
        if (ch === 92) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.readEscapedChar(false);
          chunkStart = this.pos;
        } else if (ch === 8232 || ch === 8233) {
          if (this.options.ecmaVersion < 10) {
            this.raise(this.start, "Unterminated string constant");
          }
          ++this.pos;
          if (this.options.locations) {
            this.curLine++;
            this.lineStart = this.pos;
          }
        } else {
          if (isNewLine(ch)) {
            this.raise(this.start, "Unterminated string constant");
          }
          ++this.pos;
        }
      }
      out += this.input.slice(chunkStart, this.pos++);
      return this.finishToken(types$1.string, out);
    };
    INVALID_TEMPLATE_ESCAPE_ERROR = {};
    pp.tryReadTemplateToken = function() {
      this.inTemplateElement = true;
      try {
        this.readTmplToken();
      } catch (err) {
        if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
          this.readInvalidTemplateToken();
        } else {
          throw err;
        }
      }
      this.inTemplateElement = false;
    };
    pp.invalidStringToken = function(position, message) {
      if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
        throw INVALID_TEMPLATE_ESCAPE_ERROR;
      } else {
        this.raise(position, message);
      }
    };
    pp.readTmplToken = function() {
      var out = "", chunkStart = this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) {
          this.raise(this.start, "Unterminated template");
        }
        var ch = this.input.charCodeAt(this.pos);
        if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
          if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
            if (ch === 36) {
              this.pos += 2;
              return this.finishToken(types$1.dollarBraceL);
            } else {
              ++this.pos;
              return this.finishToken(types$1.backQuote);
            }
          }
          out += this.input.slice(chunkStart, this.pos);
          return this.finishToken(types$1.template, out);
        }
        if (ch === 92) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.readEscapedChar(true);
          chunkStart = this.pos;
        } else if (isNewLine(ch)) {
          out += this.input.slice(chunkStart, this.pos);
          ++this.pos;
          switch (ch) {
            case 13:
              if (this.input.charCodeAt(this.pos) === 10) {
                ++this.pos;
              }
            case 10:
              out += "\n";
              break;
            default:
              out += String.fromCharCode(ch);
              break;
          }
          if (this.options.locations) {
            ++this.curLine;
            this.lineStart = this.pos;
          }
          chunkStart = this.pos;
        } else {
          ++this.pos;
        }
      }
    };
    pp.readInvalidTemplateToken = function() {
      for (; this.pos < this.input.length; this.pos++) {
        switch (this.input[this.pos]) {
          case "\\":
            ++this.pos;
            break;
          case "$":
            if (this.input[this.pos + 1] !== "{") {
              break;
            }
          // fall through
          case "`":
            return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
          case "\r":
            if (this.input[this.pos + 1] === "\n") {
              ++this.pos;
            }
          // fall through
          case "\n":
          case "\u2028":
          case "\u2029":
            ++this.curLine;
            this.lineStart = this.pos + 1;
            break;
        }
      }
      this.raise(this.start, "Unterminated template");
    };
    pp.readEscapedChar = function(inTemplate) {
      var ch = this.input.charCodeAt(++this.pos);
      ++this.pos;
      switch (ch) {
        case 110:
          return "\n";
        // 'n' -> '\n'
        case 114:
          return "\r";
        // 'r' -> '\r'
        case 120:
          return String.fromCharCode(this.readHexChar(2));
        // 'x'
        case 117:
          return codePointToString(this.readCodePoint());
        // 'u'
        case 116:
          return "	";
        // 't' -> '\t'
        case 98:
          return "\b";
        // 'b' -> '\b'
        case 118:
          return "\v";
        // 'v' -> '\u000b'
        case 102:
          return "\f";
        // 'f' -> '\f'
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        // '\r\n'
        case 10:
          if (this.options.locations) {
            this.lineStart = this.pos;
            ++this.curLine;
          }
          return "";
        case 56:
        case 57:
          if (this.strict) {
            this.invalidStringToken(
              this.pos - 1,
              "Invalid escape sequence"
            );
          }
          if (inTemplate) {
            var codePos = this.pos - 1;
            this.invalidStringToken(
              codePos,
              "Invalid escape sequence in template string"
            );
          }
        default:
          if (ch >= 48 && ch <= 55) {
            var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
            var octal = parseInt(octalStr, 8);
            if (octal > 255) {
              octalStr = octalStr.slice(0, -1);
              octal = parseInt(octalStr, 8);
            }
            this.pos += octalStr.length - 1;
            ch = this.input.charCodeAt(this.pos);
            if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
              this.invalidStringToken(
                this.pos - 1 - octalStr.length,
                inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
              );
            }
            return String.fromCharCode(octal);
          }
          if (isNewLine(ch)) {
            if (this.options.locations) {
              this.lineStart = this.pos;
              ++this.curLine;
            }
            return "";
          }
          return String.fromCharCode(ch);
      }
    };
    pp.readHexChar = function(len) {
      var codePos = this.pos;
      var n = this.readInt(16, len);
      if (n === null) {
        this.invalidStringToken(codePos, "Bad character escape sequence");
      }
      return n;
    };
    pp.readWord1 = function() {
      this.containsEsc = false;
      var word = "", first = true, chunkStart = this.pos;
      var astral = this.options.ecmaVersion >= 6;
      while (this.pos < this.input.length) {
        var ch = this.fullCharCodeAtPos();
        if (isIdentifierChar(ch, astral)) {
          this.pos += ch <= 65535 ? 1 : 2;
        } else if (ch === 92) {
          this.containsEsc = true;
          word += this.input.slice(chunkStart, this.pos);
          var escStart = this.pos;
          if (this.input.charCodeAt(++this.pos) !== 117) {
            this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
          }
          ++this.pos;
          var esc = this.readCodePoint();
          if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
            this.invalidStringToken(escStart, "Invalid Unicode escape");
          }
          word += codePointToString(esc);
          chunkStart = this.pos;
        } else {
          break;
        }
        first = false;
      }
      return word + this.input.slice(chunkStart, this.pos);
    };
    pp.readWord = function() {
      var word = this.readWord1();
      var type = types$1.name;
      if (this.keywords.test(word)) {
        type = keywords[word];
      }
      return this.finishToken(type, word);
    };
    version = "8.19.0";
    Parser.acorn = {
      Parser,
      version,
      defaultOptions,
      Position,
      SourceLocation,
      getLineInfo,
      Node,
      TokenType,
      tokTypes: types$1,
      keywordTypes: keywords,
      TokContext,
      tokContexts: types,
      isIdentifierChar,
      isIdentifierStart,
      Token,
      isNewLine,
      lineBreak,
      lineBreakG,
      nonASCIIwhitespace
    };
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/cart.js
function crc32(bytes) {
  let c = 4294967295;
  for (let i2 = 0; i2 < bytes.length; i2++)
    c = CRC_TABLE[(c ^ bytes[i2]) & 255] ^ c >>> 8;
  return (c ^ 4294967295) >>> 0;
}
function utf8(s) {
  return new TextEncoder().encode(s);
}
function writeCart(chunks) {
  const w = new Writer();
  for (const c of chunks) {
    if (c.tag.length !== 4) throw new Error("chunk tag " + c.tag);
    for (let i2 = 0; i2 < 4; i2++) w.u8(c.tag.charCodeAt(i2));
    w.u32(c.data.length);
    w.bytes(c.data);
    w.u32(crc32(c.data));
  }
  return w.done();
}
function readCart(bytes) {
  const chunks = {};
  const order = [];
  const list2 = [];
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let at2 = 0;
  while (at2 < bytes.length) {
    if (at2 + 8 > bytes.length) throw new Error("truncated chunk header");
    const tag = String.fromCharCode(
      bytes[at2],
      bytes[at2 + 1],
      bytes[at2 + 2],
      bytes[at2 + 3]
    );
    const len = dv.getUint32(at2 + 4, true);
    if (at2 + 12 + len > bytes.length)
      throw new Error("chunk " + tag + " runs past the end");
    const data2 = bytes.subarray(at2 + 8, at2 + 8 + len);
    if (dv.getUint32(at2 + 8 + len, true) !== crc32(data2))
      throw new Error("chunk " + tag + " fails its CRC");
    if (order.length === 0 && tag !== "PBG1")
      throw new Error("not a cart: no PBG1 header");
    chunks[tag] = data2;
    order.push(tag);
    list2.push({ tag, data: data2 });
    at2 += 12 + len;
  }
  return { chunks, order, list: list2 };
}
var CRC_TABLE, Writer;
var init_cart = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/cart.js"() {
    CRC_TABLE = (function() {
      const t = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++)
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        t[n] = c >>> 0;
      }
      return t;
    })();
    Writer = class {
      constructor() {
        this.buf = new Uint8Array(256);
        this.len = 0;
      }
      room(n) {
        if (this.len + n <= this.buf.length) return;
        let size = this.buf.length * 2;
        while (size < this.len + n) size *= 2;
        const b = new Uint8Array(size);
        b.set(this.buf.subarray(0, this.len));
        this.buf = b;
      }
      u8(v) {
        this.room(1);
        this.buf[this.len++] = v & 255;
      }
      u16(v) {
        this.u8(v);
        this.u8(v >> 8);
      }
      u32(v) {
        this.u16(v);
        this.u16(v >>> 16);
      }
      bytes(b) {
        this.room(b.length);
        this.buf.set(b, this.len);
        this.len += b.length;
      }
      /* u16 length, then UTF-8 */
      str(s) {
        const b = utf8(s);
        this.u16(b.length);
        this.bytes(b);
      }
      patch16(at2, v) {
        this.buf[at2] = v & 255;
        this.buf[at2 + 1] = v >> 8 & 255;
      }
      done() {
        return this.buf.slice(0, this.len);
      }
    };
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/lz4.js
function read32(b, i2) {
  return (b[i2] | b[i2 + 1] << 8 | b[i2 + 2] << 16 | b[i2 + 3] << 24) >>> 0;
}
function hash(v) {
  return Math.imul(v, 2654435761) >>> 18;
}
function lz4Compress(src) {
  const n = src.length, out = [];
  const table = new Int32Array(1 << 14).fill(-1);
  let anchor = 0, i2 = 0;
  function length(extra) {
    for (; extra >= 255; extra -= 255) out.push(255);
    out.push(extra);
  }
  function sequence(lit, offset2, mlen) {
    const ml = mlen ? mlen - MINMATCH : 0;
    out.push((lit >= 15 ? 15 : lit) << 4 | (mlen && ml >= 15 ? 15 : ml));
    if (lit >= 15) length(lit - 15);
    for (let k = 0; k < lit; k++) out.push(src[anchor + k]);
    if (!mlen) return;
    out.push(offset2 & 255, offset2 >> 8);
    if (ml >= 15) length(ml - 15);
  }
  while (i2 + MFLIMIT <= n) {
    const v = read32(src, i2), h = hash(v), ref2 = table[h];
    table[h] = i2;
    if (ref2 >= 0 && i2 - ref2 < 65536 && read32(src, ref2) === v) {
      let len = MINMATCH;
      while (i2 + len < n - LAST_LITERALS && src[ref2 + len] === src[i2 + len])
        len++;
      sequence(i2 - anchor, i2 - ref2, len);
      i2 += len;
      anchor = i2;
    } else
      i2++;
  }
  sequence(n - anchor, 0, 0);
  return Uint8Array.from(out);
}
function lz4Decompress(src, size) {
  const d = new Uint8Array(size);
  let s = 0, o = 0;
  while (s < src.length) {
    const t = src[s++];
    let lit = t >> 4;
    if (lit === 15) {
      let b;
      do {
        if (s >= src.length) return null;
        b = src[s++];
        lit += b;
      } while (b === 255);
    }
    if (lit > src.length - s || lit > size - o) return null;
    d.set(src.subarray(s, s + lit), o);
    s += lit;
    o += lit;
    if (s >= src.length) break;
    if (src.length - s < 2) return null;
    const off = src[s] | src[s + 1] << 8;
    s += 2;
    if (!off || off > o) return null;
    let m = (t & 15) + MINMATCH;
    if ((t & 15) === 15) {
      let b;
      do {
        if (s >= src.length) return null;
        b = src[s++];
        m += b;
      } while (b === 255);
    }
    if (m > size - o) return null;
    for (let k = 0; k < m; k++, o++) d[o] = d[o - off];
  }
  return o === size ? d : null;
}
var MINMATCH, LAST_LITERALS, MFLIMIT;
var init_lz4 = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/lz4.js"() {
    MINMATCH = 4;
    LAST_LITERALS = 5;
    MFLIMIT = 12;
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/png.js
function u32be(b, i2) {
  return (b[i2] << 24 | b[i2 + 1] << 16 | b[i2 + 2] << 8 | b[i2 + 3]) >>> 0;
}
function decodeIndexedPng(bytes, inflate) {
  for (let i2 = 0; i2 < 8; i2++)
    if (bytes[i2] !== SIGNATURE[i2])
      throw new Error("not a PNG file");
  let at2 = 8, ihdr = null;
  const idat = [];
  while (at2 + 8 <= bytes.length) {
    const len = u32be(bytes, at2);
    const type = String.fromCharCode(...bytes.subarray(at2 + 4, at2 + 8));
    const data2 = bytes.subarray(at2 + 8, at2 + 8 + len);
    if (data2.length !== len) throw new Error("the PNG file is cut short");
    if (type === "IHDR") ihdr = data2;
    else if (type === "IDAT") idat.push(data2);
    else if (type === "IEND") break;
    at2 += 12 + len;
  }
  if (!ihdr) throw new Error("the PNG file has no header");
  const width = u32be(ihdr, 0), height = u32be(ihdr, 4);
  const depth = ihdr[8], colour = ihdr[9], interlace = ihdr[12];
  const indexed = colour === 3 && [1, 2, 4, 8].includes(depth);
  const grey = colour === 0 && depth === 8;
  if (!indexed && !grey)
    throw new Error("save it as an indexed (palette) PNG: its pixels must be palette numbers");
  if (interlace)
    throw new Error("save it without interlacing");
  let total = 0;
  for (const d of idat) total += d.length;
  const z = new Uint8Array(total);
  let o = 0;
  for (const d of idat) {
    z.set(d, o);
    o += d.length;
  }
  const raw = inflate(z);
  const stride = Math.ceil(width * depth / 8);
  if (raw.length < (stride + 1) * height)
    throw new Error("the PNG file's pixels are cut short");
  const rows = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = rows.subarray(y * stride, (y + 1) * stride);
    const up = y ? rows.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x ? cur[x - 1] : 0, b = up ? up[x] : 0;
      const c = x && up ? up[x - 1] : 0;
      let v = src[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += a + b >> 1;
      else if (f === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (f !== 0)
        throw new Error("the PNG file has an unknown filter");
      cur[x] = v & 255;
    }
  }
  const px = new Uint8Array(width * height);
  const per = 8 / depth, mask = (1 << depth) - 1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const byte = rows[y * stride + Math.floor(x / per)];
      px[y * width + x] = byte >> 8 - depth * (x % per + 1) & mask;
    }
  return { width, height, px };
}
function crc(type, data2) {
  let c = 4294967295;
  const add = (b) => {
    c ^= b;
    for (let k = 0; k < 8; k++) c = c & 1 ? c >>> 1 ^ 3988292384 : c >>> 1;
  };
  type.forEach(add);
  data2.forEach(add);
  return (c ^ 4294967295) >>> 0;
}
function encodeIndexedPng(width, height, px, rgb, deflate2) {
  let top = 0;
  for (const v of px) if (v > top) top = v;
  const n = Math.max(rgb.length, top + 1);
  const plte = new Uint8Array(n * 3);
  for (let i2 = 0; i2 < n; i2++) {
    const c = rgb[i2] || 0;
    plte[i2 * 3] = c >> 16 & 255;
    plte[i2 * 3 + 1] = c >> 8 & 255;
    plte[i2 * 3 + 2] = c & 255;
  }
  const raw = new Uint8Array(height * (width + 1));
  for (let y = 0; y < height; y++)
    raw.set(px.subarray(y * width, (y + 1) * width), y * (width + 1) + 1);
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, width);
  dv.setUint32(4, height);
  ihdr.set([8, 3, 0, 0, 0], 8);
  const parts = [new Uint8Array(SIGNATURE)];
  const chunk = (type, data2) => {
    const head = new Uint8Array(8);
    new DataView(head.buffer).setUint32(0, data2.length);
    for (let i2 = 0; i2 < 4; i2++) head[4 + i2] = type.charCodeAt(i2);
    const tail = new Uint8Array(4);
    new DataView(tail.buffer).setUint32(0, crc(head.subarray(4), data2));
    parts.push(head, data2, tail);
  };
  chunk("IHDR", ihdr);
  chunk("PLTE", plte);
  chunk("tRNS", new Uint8Array([0]));
  chunk("IDAT", deflate2(raw));
  chunk("IEND", new Uint8Array(0));
  let len = 0;
  for (const p of parts) len += p.length;
  const out = new Uint8Array(len);
  let at2 = 0;
  for (const p of parts) {
    out.set(p, at2);
    at2 += p.length;
  }
  return out;
}
var SIGNATURE;
var init_png = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/png.js"() {
    SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/sfxr.js
function sfxrParams(json) {
  const p = Object.assign({}, DEFAULTS);
  for (const k in json) {
    if (!(k in DEFAULTS)) continue;
    const v = json[k], r = RANGES[k] || [0, 1];
    if (typeof v !== "number" || !(v >= r[0] && v <= r[1]))
      throw new Error(k + " is a number from " + r[0] + " to " + r[1]);
    p[k] = k === "wave_type" ? Math.floor(v) : v;
  }
  return p;
}
function sfxrRender(p, seed) {
  let rng = seed >>> 0 || 1;
  const frnd = (range2) => {
    rng ^= rng << 13;
    rng >>>= 0;
    rng ^= rng >>> 17;
    rng ^= rng << 5;
    rng >>>= 0;
    return rng / 4294967296 * range2;
  };
  const master_vol = 0.05;
  let phase = 0, fperiod, fmaxperiod, fslide, fdslide, period;
  let square_duty, square_slide, env_stage, env_time, env_vol;
  const env_length = [0, 0, 0];
  let fphase, fdphase, iphase, ipp;
  const phaser_buffer = new Float64Array(1024), noise_buffer = new Float64Array(32);
  let fltp, fltdp, fltw, fltw_d, fltdmp, fltphp, flthp, flthp_d;
  let vib_phase, vib_speed, vib_amp, rep_time, rep_limit, arp_time, arp_limit, arp_mod;
  let playing = true;
  function reset2(restart) {
    if (!restart) phase = 0;
    fperiod = 100 / (p.p_base_freq * p.p_base_freq + 1e-3);
    period = Math.trunc(fperiod);
    fmaxperiod = 100 / (p.p_freq_limit * p.p_freq_limit + 1e-3);
    fslide = 1 - Math.pow(p.p_freq_ramp, 3) * 0.01;
    fdslide = -Math.pow(p.p_freq_dramp, 3) * 1e-6;
    square_duty = 0.5 - p.p_duty * 0.5;
    square_slide = -p.p_duty_ramp * 5e-5;
    if (p.p_arp_mod >= 0) arp_mod = 1 - Math.pow(p.p_arp_mod, 2) * 0.9;
    else arp_mod = 1 + Math.pow(p.p_arp_mod, 2) * 10;
    arp_time = 0;
    arp_limit = Math.trunc(Math.pow(1 - p.p_arp_speed, 2) * 2e4 + 32);
    if (p.p_arp_speed === 1) arp_limit = 0;
    if (!restart) {
      fltp = 0;
      fltdp = 0;
      fltw = Math.pow(p.p_lpf_freq, 3) * 0.1;
      fltw_d = 1 + p.p_lpf_ramp * 1e-4;
      fltdmp = 5 / (1 + Math.pow(p.p_lpf_resonance, 2) * 20) * (0.01 + fltw);
      if (fltdmp > 0.8) fltdmp = 0.8;
      fltphp = 0;
      flthp = Math.pow(p.p_hpf_freq, 2) * 0.1;
      flthp_d = 1 + p.p_hpf_ramp * 3e-4;
      vib_phase = 0;
      vib_speed = Math.pow(p.p_vib_speed, 2) * 0.01;
      vib_amp = p.p_vib_strength * 0.5;
      env_vol = 0;
      env_stage = 0;
      env_time = 0;
      env_length[0] = Math.trunc(p.p_env_attack * p.p_env_attack * 1e5);
      env_length[1] = Math.trunc(p.p_env_sustain * p.p_env_sustain * 1e5);
      env_length[2] = Math.trunc(p.p_env_decay * p.p_env_decay * 1e5);
      fphase = Math.pow(p.p_pha_offset, 2) * 1020;
      if (p.p_pha_offset < 0) fphase = -fphase;
      fdphase = Math.pow(p.p_pha_ramp, 2) * 1;
      if (p.p_pha_ramp < 0) fdphase = -fdphase;
      iphase = Math.abs(Math.trunc(fphase));
      ipp = 0;
      phaser_buffer.fill(0);
      for (let i2 = 0; i2 < 32; i2++) noise_buffer[i2] = frnd(2) - 1;
      rep_time = 0;
      rep_limit = Math.trunc(Math.pow(1 - p.p_repeat_speed, 2) * 2e4 + 32);
      if (p.p_repeat_speed === 0) rep_limit = 0;
    }
  }
  reset2(false);
  const out = [];
  while (playing && out.length < SFXR_RATE * MAX_SECONDS) {
    rep_time++;
    if (rep_limit !== 0 && rep_time >= rep_limit) {
      rep_time = 0;
      reset2(true);
    }
    arp_time++;
    if (arp_limit !== 0 && arp_time >= arp_limit) {
      arp_limit = 0;
      fperiod *= arp_mod;
    }
    fslide += fdslide;
    fperiod *= fslide;
    if (fperiod > fmaxperiod) {
      fperiod = fmaxperiod;
      if (p.p_freq_limit > 0) playing = false;
    }
    let rfperiod = fperiod;
    if (vib_amp > 0) {
      vib_phase += vib_speed;
      rfperiod = fperiod * (1 + Math.sin(vib_phase) * vib_amp);
    }
    period = Math.trunc(rfperiod);
    if (period < 8) period = 8;
    square_duty += square_slide;
    if (square_duty < 0) square_duty = 0;
    if (square_duty > 0.5) square_duty = 0.5;
    env_time++;
    if (env_time > env_length[env_stage]) {
      env_time = 0;
      env_stage++;
      if (env_stage === 3) break;
    }
    if (env_stage === 0) env_vol = env_time / env_length[0];
    if (env_stage === 1)
      env_vol = 1 + Math.pow(1 - env_time / env_length[1], 1) * 2 * p.p_env_punch;
    if (env_stage === 2) env_vol = 1 - env_time / env_length[2];
    fphase += fdphase;
    iphase = Math.abs(Math.trunc(fphase));
    if (iphase > 1023) iphase = 1023;
    if (flthp_d !== 0) {
      flthp *= flthp_d;
      if (flthp < 1e-5) flthp = 1e-5;
      if (flthp > 0.1) flthp = 0.1;
    }
    let ssample = 0;
    for (let si = 0; si < 8; si++) {
      let sample = 0;
      phase++;
      if (phase >= period) {
        phase %= period;
        if (p.wave_type === 3)
          for (let i2 = 0; i2 < 32; i2++) noise_buffer[i2] = frnd(2) - 1;
      }
      const fp = phase / period;
      switch (p.wave_type) {
        case 0:
          sample = fp < square_duty ? 0.5 : -0.5;
          break;
        case 1:
          sample = 1 - fp * 2;
          break;
        case 2:
          sample = Math.sin(fp * 2 * Math.PI);
          break;
        case 3:
          sample = noise_buffer[Math.trunc(phase * 32 / period)];
          break;
      }
      const pp2 = fltp;
      fltw *= fltw_d;
      if (fltw < 0) fltw = 0;
      if (fltw > 0.1) fltw = 0.1;
      if (p.p_lpf_freq !== 1) {
        fltdp += (sample - fltp) * fltw;
        fltdp -= fltdp * fltdmp;
      } else {
        fltp = sample;
        fltdp = 0;
      }
      fltp += fltdp;
      fltphp += fltp - pp2;
      fltphp -= fltphp * flthp;
      sample = fltphp;
      phaser_buffer[ipp & 1023] = sample;
      sample += phaser_buffer[ipp - iphase + 1024 & 1023];
      ipp = ipp + 1 & 1023;
      ssample += sample * env_vol;
    }
    ssample = ssample / 8 * master_vol;
    ssample *= 2 * p.sound_vol;
    ssample *= 4;
    if (ssample > 1) ssample = 1;
    if (ssample < -1) ssample = -1;
    out.push(ssample);
  }
  return Float64Array.from(out);
}
function soundSeed(name) {
  let seed = 2166136261;
  for (const ch of name) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619);
  return seed >>> 0;
}
function halve(samples) {
  const n = samples.length >> 1, out = new Int16Array(n);
  for (let i2 = 0; i2 < n; i2++) {
    const v = (samples[i2 * 2] + samples[i2 * 2 + 1]) * 0.5 * 32767;
    out[i2] = Math.max(-32768, Math.min(32767, Math.round(v)));
  }
  return out;
}
var SFXR_RATE, MAX_SECONDS, DEFAULTS, RANGES;
var init_sfxr = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/sfxr.js"() {
    SFXR_RATE = 44100;
    MAX_SECONDS = 10;
    DEFAULTS = {
      wave_type: 0,
      p_env_attack: 0,
      p_env_sustain: 0.3,
      p_env_punch: 0,
      p_env_decay: 0.4,
      p_base_freq: 0.3,
      p_freq_limit: 0,
      p_freq_ramp: 0,
      p_freq_dramp: 0,
      p_vib_strength: 0,
      p_vib_speed: 0,
      p_arp_mod: 0,
      p_arp_speed: 0,
      p_duty: 0,
      p_duty_ramp: 0,
      p_repeat_speed: 0,
      p_pha_offset: 0,
      p_pha_ramp: 0,
      p_lpf_freq: 1,
      p_lpf_ramp: 0,
      p_lpf_resonance: 0,
      p_hpf_freq: 0,
      p_hpf_ramp: 0,
      sound_vol: 0.5
    };
    RANGES = {
      wave_type: [0, 3],
      p_freq_ramp: [-1, 1],
      p_freq_dramp: [-1, 1],
      p_arp_mod: [-1, 1],
      p_duty_ramp: [-1, 1],
      p_pha_offset: [-1, 1],
      p_pha_ramp: [-1, 1],
      p_lpf_ramp: [-1, 1],
      p_hpf_ramp: [-1, 1],
      sound_vol: [0, 1]
    };
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/bdf.js
function parseBdf(text2) {
  let ascent = null, descent = null, ch = null, line = 0;
  const glyphs = /* @__PURE__ */ new Map();
  const fail2 = (why) => {
    throw new Error("line " + line + ": " + why);
  };
  for (const raw of text2.split(/\r?\n/)) {
    line++;
    const p = raw.trim().split(/\s+/);
    if (ch && ch.rows) {
      if (p[0] === "ENDCHAR") {
        if (ch.rows.length < ch.h) fail2("a glyph has fewer rows than its BBX");
        if (ch.cp >= 0) glyphs.set(ch.cp, ch);
        ch = null;
      } else {
        if (!/^[0-9A-Fa-f]+$/.test(p[0]) || p[0].length % 2)
          fail2("a bitmap row is whole bytes in hex");
        if (ch.rows.length < ch.h) ch.rows.push(p[0]);
      }
      continue;
    }
    switch (p[0]) {
      case "FONT_ASCENT":
        ascent = +p[1];
        break;
      case "FONT_DESCENT":
        descent = +p[1];
        break;
      case "STARTCHAR":
        ch = { cp: null, adv: null, bbx: null, rows: null };
        break;
      case "ENCODING":
        if (ch) ch.cp = +p[1];
        break;
      case "DWIDTH":
        if (ch) ch.adv = +p[1];
        break;
      case "BBX":
        if (ch) ch.bbx = p.slice(1, 5).map(Number);
        break;
      case "BITMAP":
        if (!ch || ch.cp === null || ch.adv === null || !ch.bbx)
          fail2("a glyph needs ENCODING, DWIDTH and BBX before BITMAP");
        [ch.w, ch.h, ch.xo, ch.yo] = ch.bbx;
        ch.rows = [];
        break;
    }
  }
  if (!Number.isInteger(ascent) || !Number.isInteger(descent))
    throw new Error("a font needs FONT_ASCENT and FONT_DESCENT");
  const height = ascent + descent;
  if (height < 1 || height > MAX_SIDE)
    throw new Error("a font's line (FONT_ASCENT + FONT_DESCENT) is 1 to " + MAX_SIDE + " pixels, not " + height);
  const out = [];
  for (const cp of [...glyphs.keys()].sort((a, b) => a - b)) {
    const g = glyphs.get(cp);
    const where = "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
    if (g.w < 0 || g.h < 0 || g.w > MAX_SIDE || g.h > MAX_SIDE)
      throw new Error(where + " is " + g.w + "x" + g.h + "; a glyph is at most " + MAX_SIDE + " pixels a side");
    if (g.adv < 0 || g.adv > 255 || Math.abs(g.xo) > 127)
      throw new Error(where + "'s advance or offset is out of range");
    const y = ascent - (g.yo + g.h), stride = g.w + 7 >> 3;
    if (y < -128 || y > 127) throw new Error(where + " is far outside its line");
    const rows = g.rows.map((hex) => {
      const b = new Uint8Array(stride);
      for (let i2 = 0; i2 < stride && i2 * 2 < hex.length; i2++)
        b[i2] = parseInt(hex.substr(i2 * 2, 2), 16);
      if (g.w & 7) b[stride - 1] &= 255 << 8 - (g.w & 7);
      return b;
    });
    out.push({ cp, adv: g.adv, x: g.xo, y, w: g.w, h: g.h, rows });
  }
  if (!out.length) throw new Error("a font needs at least one glyph");
  return { line: height, glyphs: out };
}
function fontChunk(fonts) {
  const w = new Writer();
  w.u8(fonts.length);
  for (const f of fonts) {
    w.u8(f.line);
    w.u16(f.glyphs.length);
    let off = 0;
    for (const g of f.glyphs) {
      w.u32(g.cp);
      w.u32(off);
      off += 5 + g.h * (g.w + 7 >> 3);
    }
    for (const g of f.glyphs) {
      w.u8(g.adv);
      w.u8(g.x & 255);
      w.u8(g.y & 255);
      w.u8(g.w);
      w.u8(g.h);
      for (const r of g.rows) w.bytes(r);
    }
  }
  return w.done();
}
var MAX_FONTS, MAX_FONT_BYTES, MAX_SIDE;
var init_bdf = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/bdf.js"() {
    init_cart();
    MAX_FONTS = 16;
    MAX_FONT_BYTES = 65536;
    MAX_SIDE = 32;
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/assets.js
function objectKinds(text2) {
  const f = JSON.parse(text2), kinds = /* @__PURE__ */ new Map();
  const isText = (v) => v === void 0 || typeof v === "string";
  if (!f || typeof f !== "object" || Array.isArray(f))
    throw new Error('an object of kinds: { "coin": { ... } }');
  for (const [kind, k] of Object.entries(f)) {
    if (!NAME.test(kind))
      throw new Error(kind + ": a kind is a name: letters, digits and _");
    if (!k || typeof k !== "object" || !isText(k.help))
      throw new Error(kind + ': { "help": text, "props": { ... } }');
    const props = /* @__PURE__ */ new Map();
    for (const [name, p] of Object.entries(k.props || {})) {
      const v = p && p.default;
      if (!NAME.test(name))
        throw new Error(kind + "." + name + ": a property is a name: letters, digits and _");
      if (!p || typeof p !== "object" || !isText(p.help) || !(typeof v === "string" || v === (v | 0)))
        throw new Error(kind + "." + name + ': { "default": a whole number or text, "help": text }');
      props.set(name, { value: v, help: p.help || "" });
    }
    if (props.size > 255)
      throw new Error(kind + ": at most 255 properties");
    kinds.set(kind, { help: k.help || "", props });
  }
  return kinds;
}
function sortedNames(obj) {
  return Object.keys(obj || {}).sort();
}
function quantise(pcm) {
  let peak = 1;
  for (const v of pcm) peak = Math.max(peak, Math.abs(v));
  const scale = Math.ceil(peak / 127);
  const bytes = new Uint8Array(pcm.length);
  for (let i2 = 0; i2 < pcm.length; i2++)
    bytes[i2] = Math.max(-128, Math.min(127, Math.round(pcm[i2] / scale))) & 255;
  return { scale, bytes };
}
function parseGpl(text2) {
  const rgb = [];
  const lines2 = text2.split(/\r?\n/);
  if (!/^GIMP Palette/.test(lines2[0] || ""))
    throw new Error('a .gpl palette starts with "GIMP Palette"');
  for (let i2 = 1; i2 < lines2.length; i2++) {
    const l = lines2[i2].trim();
    if (!l || l[0] === "#" || /^(Name|Columns):/.test(l)) continue;
    const m = /^(\d+)\s+(\d+)\s+(\d+)/.exec(l);
    if (!m || +m[1] > 255 || +m[2] > 255 || +m[3] > 255)
      throw new Error("line " + (i2 + 1) + ": a colour is three numbers from 0 to 255");
    rgb.push([+m[1], +m[2], +m[3]]);
  }
  if (!rgb.length) throw new Error("the palette has no colours");
  if (rgb.length > 256) throw new Error("a palette has at most 256 colours");
  return rgb;
}
function buildAssets(assets, inflate, string, errors, lazy = []) {
  const out = {
    groups: { MAP: {}, PAL: {}, OBJ: {}, SFX: {}, DATA: {}, FONT: {} },
    images: [],
    chunks: [],
    format3: false
  };
  if (!assets) return out;
  function err(file, message) {
    errors.push({ file, line: 1, column: 1, message });
  }
  function named(file, name) {
    if (NAME.test(name)) return true;
    err(file, "a file name must be usable as a name in code: letters, digits and _");
    return false;
  }
  const pals = [];
  for (const name of sortedNames(assets.palettes)) {
    const file = "palettes/" + name + ".gpl";
    if (!named(file, name)) continue;
    if (pals.length === 255) {
      err(file, "a cart holds at most 255 palettes");
      continue;
    }
    try {
      pals.push(parseGpl(assets.palettes[name]));
      out.groups.PAL[name] = { value: pals.length - 1, version: 1 };
    } catch (e) {
      err(file, e.message);
    }
  }
  if (pals.length) out.palette = pals[0].map((c) => c[0] << 16 | c[1] << 8 | c[2]);
  if (pals.length) {
    const w = new Writer();
    w.u8(pals.length);
    for (const p of pals) {
      w.u16(p.length);
      for (const c of p) {
        w.u8(c[0]);
        w.u8(c[1]);
        w.u8(c[2]);
      }
    }
    out.chunks.push({ tag: "PALS", data: w.done() });
  }
  let sheet = null, flags = new Uint8Array(256);
  if (assets.sheet) {
    try {
      const img = decodeIndexedPng(assets.sheet, inflate);
      if (img.width !== 128 || img.height !== 128)
        err("sheet.png", "the sheet is 128x128, not " + img.width + "x" + img.height);
      else sheet = img.px;
    } catch (e) {
      err("sheet.png", e.message);
    }
  }
  if (assets.flags !== void 0) {
    try {
      const f = JSON.parse(assets.flags);
      const set = (n, v) => {
        if (!(n >= 0 && n < 256 && v >= 0 && v < 256 && v === Math.floor(v)))
          throw new Error("sprite " + n + ": flags are a number from 0 to 255, for sprites 0 to 255");
        flags[n] = v;
      };
      if (Array.isArray(f)) f.forEach((v, n) => set(n, v));
      else for (const k in f) set(+k, f[k]);
    } catch (e) {
      err("flags.json", e.message);
    }
  }
  if (sheet || assets.flags !== void 0) {
    const w = new Writer();
    const px = sheet || new Uint8Array(128 * 128);
    const z = lz4Compress(px);
    w.u16(128);
    w.u16(128);
    w.u32(z.length);
    w.bytes(z);
    w.bytes(flags);
    out.chunks.push({ tag: "SHET", data: w.done() });
  }
  if (assets.logo) {
    try {
      const img = decodeIndexedPng(assets.logo, inflate);
      if (img.width !== LOGO || img.height !== LOGO)
        throw new Error("the logo is " + LOGO + "x" + LOGO + ", not " + img.width + "x" + img.height);
      const w = new Writer(), z = lz4Compress(img.px);
      w.u16(LOGO);
      w.u16(LOGO);
      w.u32(z.length);
      w.bytes(z);
      out.chunks.push({ tag: "LOGO", data: w.done() });
      out.logo = true;
    } catch (e) {
      err("logo.png", e.message);
    }
  }
  let known = null;
  if (assets.objects !== void 0) {
    try {
      known = objectKinds(assets.objects);
    } catch (e) {
      err("objects.json", e.message);
    }
  }
  const maps = [], kinds = /* @__PURE__ */ new Set();
  for (const name of sortedNames(assets.maps)) {
    const file = "maps/" + name + ".json";
    if (!named(file, name)) continue;
    try {
      const m = JSON.parse(assets.maps[name]);
      const W = m.width, H = m.height;
      if (!(W >= 1 && W <= MAX_MAP && H >= 1 && H <= MAX_MAP && W === Math.floor(W) && H === Math.floor(H)))
        throw new Error("width and height are 1 to " + MAX_MAP + " cells");
      const cells = new Uint8Array(W * H);
      const rows = m.rows || [];
      if (!Array.isArray(rows) || rows.length > H)
        throw new Error("rows is a list of at most height strings");
      rows.forEach((r, y) => {
        if (typeof r !== "string" || r.length > W * 2 || r.length % 2 || !/^[0-9a-fA-F]*$/.test(r))
          throw new Error("row " + y + ": two hex digits a cell, at most width cells");
        for (let x = 0; x < r.length / 2; x++)
          cells[y * W + x] = parseInt(r.substr(x * 2, 2), 16);
      });
      const objects = m.objects || [];
      if (!Array.isArray(objects) || objects.length > 65535)
        throw new Error("objects is a list");
      for (const o of objects) {
        if (typeof o.kind !== "string" || !NAME.test(o.kind))
          throw new Error("an object's kind is a name: letters, digits and _");
        for (const k of ["x", "y", "w", "h"])
          if (o[k] !== void 0 && !(o[k] === Math.floor(o[k]) && o[k] >= -32768 && o[k] <= 32767))
            throw new Error("an object's " + k + " is a whole number of pixels");
        const props = o.props || {};
        if (Object.keys(props).length > 255)
          throw new Error("an object has at most 255 properties");
        for (const k in props)
          if (typeof props[k] !== "string" && !(typeof props[k] === "number" && props[k] === (props[k] | 0)))
            throw new Error("property " + k + " is a whole number or a string");
        const kn = known && known.get(o.kind);
        if (known && !kn)
          throw new Error("object kind " + o.kind + " is not in objects.json");
        for (const k in props) {
          const p = kn && kn.props.get(k);
          if (kn && !p)
            throw new Error(o.kind + " has no property " + k + " in objects.json");
          if (p && typeof p.value !== typeof props[k])
            throw new Error(o.kind + "." + k + " is " + (typeof p.value === "string" ? "text" : "a whole number") + ", as its default in objects.json");
        }
        if (kn)
          o.props = Object.assign(Object.fromEntries(
            [...kn.props].map(([k, p]) => [k, p.value])
          ), props);
        kinds.add(o.kind);
      }
      maps.push({ W, H, cells, objects });
      out.groups.MAP[name] = { value: maps.length - 1, version: 1 };
    } catch (e) {
      err(file, e.message);
    }
  }
  const kindList = [...kinds].sort();
  if (kindList.length > 255) err("maps", "at most 255 object kinds");
  kindList.forEach((k, i2) => {
    out.groups.OBJ[k] = { value: i2, version: 1 };
  });
  if (maps.length > 64) err("maps/", "a cart has at most 64 maps");
  if (maps.length) {
    const w = new Writer(), cells = [];
    w.u16(maps.length);
    for (const m of maps) {
      const z = lz4Compress(m.cells);
      cells.push({ tag: "MAPC", data: z });
      w.u16(m.W);
      w.u16(m.H);
      w.u32(z.length);
      w.u16(m.objects.length);
      for (const o of m.objects) {
        w.u8(kindList.indexOf(o.kind));
        for (const k of ["x", "y", "w", "h"]) w.u16((o[k] || 0) & 65535);
        const props = o.props || {};
        const keys = Object.keys(props);
        w.u8(keys.length);
        for (const k of keys) {
          w.u16(string(k));
          if (typeof props[k] === "string") {
            w.u8(1);
            w.u16(string(props[k]));
          } else {
            w.u8(0);
            w.u32(props[k] >>> 0);
          }
        }
      }
    }
    out.chunks.push({ tag: "MAPS", data: w.done() }, ...cells);
    out.format3 = true;
  }
  const imgs = [];
  for (const name of sortedNames(assets.images)) {
    const file = "images/" + name + ".png";
    if (!named(file, name)) continue;
    try {
      const img = decodeIndexedPng(assets.images[name], inflate);
      if (img.width > MAX_IMAGE || img.height > MAX_IMAGE)
        throw new Error("an image is at most " + MAX_IMAGE + " pixels a side");
      imgs.push(img);
      out.images.push(name);
    } catch (e) {
      err(file, e.message);
    }
  }
  if (lazy.length > 64) err("cart.json", "lazy_images names at most 64 images");
  for (const name of lazy)
    if (out.images.indexOf(name) < 0)
      err("cart.json", "lazy_images names " + name + ", which is not an image in images/");
  const isLazy = out.images.map((name) => lazy.indexOf(name) >= 0);
  const held = imgs.reduce((n, img, i2) => n + (isLazy[i2] ? 0 : 16 + img.width * img.height + 7 & ~7), 0);
  if (held > IMAGE_BYTES)
    err("images/", "the images take " + Math.ceil(held / 1024) + " KB, and the player has room for at most about " + Math.floor(IMAGE_BYTES / 1024) + " KB of images, less what the rest of the cart needs");
  if (imgs.length) {
    const w = new Writer(), pixels = [];
    const format3 = out.format3 || isLazy.some(Boolean);
    w.u16(imgs.length);
    imgs.forEach((img, i2) => {
      const z = lz4Compress(img.px);
      w.u16(img.width);
      w.u16(img.height);
      w.u32(z.length);
      if (format3) w.u8(isLazy[i2] ? 1 : 0);
      if (isLazy[i2]) pixels.push({ tag: "IMGC", data: z });
      else w.bytes(z);
    });
    out.chunks.push({ tag: "IMGS", data: w.done() }, ...pixels);
    out.format3 = format3;
  }
  const sounds = [];
  for (const name of sortedNames(assets.sounds)) {
    const file = "sounds/" + name + ".json";
    if (!named(file, name)) continue;
    try {
      const params = sfxrParams(JSON.parse(assets.sounds[name]));
      sounds.push(quantise(halve(sfxrRender(params, soundSeed(name)))));
      out.groups.SFX[name] = { value: sounds.length - 1, version: 1 };
    } catch (e) {
      err(file, e.message);
    }
  }
  if (sounds.length) {
    const w = new Writer();
    w.u16(sounds.length);
    for (const s of sounds) {
      w.u32(s.bytes.length);
      w.u16(s.scale);
      w.bytes(s.bytes);
    }
    out.chunks.push({ tag: "SFX_", data: w.done() });
  }
  const fonts = [];
  for (const name of sortedNames(assets.fonts)) {
    const file = "fonts/" + name + ".bdf";
    if (!named(file, name)) continue;
    if (ENGINE_FONTS.includes(name)) {
      err(file, "FONT." + name + " is the engine's; call the file something else");
      continue;
    }
    if (fonts.length === MAX_FONTS) {
      err(file, "a cart holds at most " + MAX_FONTS + " fonts");
      continue;
    }
    try {
      fonts.push(parseBdf(assets.fonts[name]));
      out.groups.FONT[name] = { value: FIRST_FONT + fonts.length - 1, version: 1 };
    } catch (e) {
      err(file, e.message);
    }
  }
  if (fonts.length) {
    const data2 = fontChunk(fonts);
    if (data2.length > MAX_FONT_BYTES)
      err("fonts/", "the fonts come to " + data2.length + " bytes; a cart's are at most " + MAX_FONT_BYTES + " -- leave out the characters it does not show");
    else out.chunks.push({ tag: "FONT", data: data2 });
  }
  const files = [];
  const texts = assets.texts || {};
  for (const name of sortedNames(Object.assign({}, assets.data, texts))) {
    const json = assets.data && name in assets.data;
    const file = "data/" + name + (json ? ".json" : ".txt");
    if (!named(file, name)) continue;
    if (json && name in texts) {
      err(file, "a data file and a text file are both called " + name);
      continue;
    }
    if (!json) {
      files.push({ name, kind: 1, bytes: utf8Bytes(texts[name]) });
    } else {
      try {
        const text2 = assets.data[name];
        const why = dataFault(text2, JSON.parse(text2));
        if (why) {
          err(file, why);
          continue;
        }
        files.push({ name, kind: 0, bytes: utf8Bytes(text2) });
      } catch (e) {
        err(file, e.message);
        continue;
      }
    }
    out.groups.DATA[name] = { value: files.length - 1, version: 1 };
  }
  if (files.length) {
    const w = new Writer();
    w.u16(files.length);
    for (const f of files) {
      w.u8(f.kind);
      w.str(f.name);
      w.u32(f.bytes.length);
      w.bytes(f.bytes);
    }
    out.chunks.push({ tag: "DATA", data: w.done() });
  }
  return out;
}
function utf8Bytes(s) {
  return new TextEncoder().encode(s);
}
function dataFault(text2, value) {
  const token = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  for (const [t] of text2.matchAll(token)) {
    if (t[0] === '"') continue;
    const m = /^-?(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(t);
    const v = Number(t);
    if (!/[1-9]/.test(m[1] + (m[2] || ""))) continue;
    if ((m[2] || "").length - (+m[3] || 0) <= 0) {
      if (!(v >= -2147483648 && v <= 2147483647))
        return v + " is beyond the whole numbers a cart has";
    } else if (!(v > -32768 && v < 32768)) {
      return v + " is beyond the fractions a cart has (-32768 to 32767)";
    }
  }
  return depthFault(value, 0);
}
function depthFault(v, depth) {
  if (depth > 64) return "more than 64 lists inside one another";
  if (v && typeof v === "object") {
    for (const k in v) {
      const why = depthFault(v[k], depth + 1);
      if (why) return why;
    }
  }
  return null;
}
var FIRST_FONT, ENGINE_FONTS, NAME, MAX_MAP, MAX_IMAGE, LOGO, IMAGE_BYTES;
var init_assets = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/assets.js"() {
    init_cart();
    init_lz4();
    init_png();
    init_sfxr();
    init_bdf();
    FIRST_FONT = 3;
    ENGINE_FONTS = ["CAPS", "WORLD"];
    NAME = /^[A-Za-z_][\w]*$/;
    MAX_MAP = 256;
    MAX_IMAGE = 1024;
    LOGO = 44;
    IMAGE_BYTES = 345e3;
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/unpack.js
function reader(bytes) {
  let at2 = 0;
  const r = {
    u8: () => bytes[at2++],
    u16: () => {
      const v = bytes[at2] | bytes[at2 + 1] << 8;
      at2 += 2;
      return v;
    },
    u32: () => {
      const v = (r.u16() | r.u16() << 16) >>> 0;
      return v;
    },
    bytes: (n) => {
      const b = bytes.subarray(at2, at2 + n);
      at2 += n;
      return b;
    },
    str: () => new TextDecoder().decode(r.bytes(r.u16())),
    left: () => bytes.length - at2
  };
  return r;
}
function firstPalette(pals) {
  if (!pals) return DEFAULT_RGB;
  const r = reader(pals);
  r.u8();
  const n = r.u16(), rgb = [];
  for (let i2 = 0; i2 < n; i2++) rgb.push(r.u8() << 16 | r.u8() << 8 | r.u8());
  return rgb;
}
function unpackCart(bytes, inflateRaw, deflate2) {
  const { chunks, list: list2 } = readCart(bytes);
  if (!chunks.SRC_) throw new Error("the cart holds no sources");
  const src = reader(inflateRaw(chunks.SRC_));
  const files = {};
  for (let n = src.u16(); n > 0; n--) {
    const name = src.str();
    if (!SOURCE_NAME.test(name))
      throw new Error("the cart names a file no cart folder holds: " + JSON.stringify(name));
    files[name] = src.bytes(src.u32()).slice();
  }
  const has = (prefix) => Object.keys(files).some((f) => f.startsWith(prefix));
  const lost = [
    ["PALS", "palettes/"],
    ["MAPS", "maps/"],
    ["IMGS", "images/"],
    ["SFX_", "sounds/"],
    ["DATA", "data/"],
    ["FONT", "fonts/"]
  ].filter(([tag, dir]) => chunks[tag] && !has(dir));
  if (chunks.SHET && !has("sheet.png") && !has("flags.json") || lost.length)
    throw new Error("this cart was built before carts kept their pictures, maps and sounds whole; build it again from its folder with pbgc");
  const rgb = firstPalette(chunks.PALS);
  const picture = (r) => {
    const w = r.u16(), h = r.u16(), z = r.bytes(r.u32());
    return encodeIndexedPng(w, h, lz4Decompress(z, w * h), rgb, deflate2);
  };
  if ("sheet.png" in files) {
    if (!chunks.SHET) throw new Error("the cart names a sheet it lacks");
    files["sheet.png"] = picture(reader(chunks.SHET));
  }
  if ("logo.png" in files) {
    if (!chunks.LOGO) throw new Error("the cart names a logo it lacks");
    files["logo.png"] = picture(reader(chunks.LOGO));
  }
  const images = Object.keys(files).filter((f) => /^images\/.*\.png$/.test(f)).sort();
  if (images.length) {
    const r = reader(chunks.IMGS || new Uint8Array(2));
    if (r.u16() !== images.length) throw new Error("the cart's images do not match its sources");
    const format3 = chunks.PBG1 && (chunks.PBG1[0] | chunks.PBG1[1] << 8) >= 3;
    const lazy = list2.filter((c) => c.tag === "IMGC").map((c) => c.data);
    for (const f of images) {
      const w = r.u16(), h = r.u16(), n = r.u32();
      const z = format3 && r.u8() ? lazy.shift() : r.bytes(n);
      if (!z || z.length !== n) throw new Error("the cart's images are damaged");
      files[f] = encodeIndexedPng(w, h, lz4Decompress(z, w * h), rgb, deflate2);
    }
  }
  return files;
}
var DEFAULT_RGB, SOURCE_NAME;
var init_unpack = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/unpack.js"() {
    init_cart();
    init_lz4();
    init_png();
    DEFAULT_RGB = [
      0,
      1712708,
      7023198,
      1009216,
      9065014,
      5196370,
      12104892,
      16184042,
      15216714,
      16094762,
      16311356,
      3986e3,
      3120368,
      8288936,
      15891124,
      16369818
    ];
    SOURCE_NAME = new RegExp('^(cart\\.json|sheet\\.png|logo\\.png|flags\\.json|objects\\.json|[^/\\\\:*?"<>|\\x00-\\x1f.][^/\\\\:*?"<>|\\x00-\\x1f]*\\.js|(palettes/[A-Za-z_]\\w*\\.gpl|(maps|sounds|data)/[A-Za-z_]\\w*\\.json|data/[A-Za-z_]\\w*\\.txt|fonts/[A-Za-z_]\\w*\\.bdf|editors/[A-Za-z_]\\w*\\.html|images/[A-Za-z_]\\w*\\.png))$');
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/numbers.js
function fix(raw) {
  return new Fix(raw);
}
function isFix(v) {
  return v instanceof Fix;
}
function isNum(v) {
  return typeof v === "number" || v instanceof Fix;
}
function wrap(big) {
  let x = big & MASK32;
  if (x >= 1n << 31n) x -= 1n << 32n;
  return Number(x);
}
function scaled(v) {
  return v instanceof Fix ? BigInt(v.raw) : BigInt(v) << B16;
}
function fromReal(x) {
  const raw = Math.round(x * 65536);
  if (raw > 2147483647 || raw < -2147483648) return void 0;
  return fix(raw);
}
function trunc(v) {
  if (!(v instanceof Fix)) return v;
  return Math.trunc(v.raw / 65536);
}
function truthy(v) {
  if (v instanceof Fix) return v.raw !== 0;
  return !(v === 0 || v === null || v === void 0 || v === "");
}
function text(v) {
  if (!(v instanceof Fix)) return String(v);
  const neg2 = v.raw < 0;
  let m = BigInt(v.raw);
  if (neg2) m = -m;
  let ip = m >> B16;
  let d = (m & 0xffffn) * 10000n + 32768n >> B16;
  if (d === 10000n) {
    ip += 1n;
    d = 0n;
  }
  let ds = d.toString().padStart(4, "0").replace(/0+$/, "");
  const body = ip.toString() + (ds ? "." + ds : "");
  return (neg2 && (ip !== 0n || d !== 0n) ? "-" : "") + body;
}
function equal(a, b) {
  return scaled(a) === scaled(b);
}
function binary(op, a, b) {
  if (typeof a === "number" && typeof b === "number") {
    switch (op) {
      case "+":
        return a + b | 0;
      case "-":
        return a - b | 0;
      case "*":
        return Math.imul(a, b);
      case "/":
        return b === 0 ? void 0 : b === -1 ? -a | 0 : a / b | 0;
      case "%":
        return b === 0 ? void 0 : b === -1 ? 0 : a % b | 0;
    }
  }
  switch (op) {
    case "&":
      return trunc(a) & trunc(b);
    case "|":
      return trunc(a) | trunc(b);
    case "^":
      return trunc(a) ^ trunc(b);
    case "<<":
      return trunc(a) << trunc(b);
    case ">>":
      return trunc(a) >> trunc(b);
    case ">>>":
      return trunc(a) >>> trunc(b) | 0;
    case "<":
      return scaled(a) < scaled(b) ? 1 : 0;
    case "<=":
      return scaled(a) <= scaled(b) ? 1 : 0;
    case ">":
      return scaled(a) > scaled(b) ? 1 : 0;
    case ">=":
      return scaled(a) >= scaled(b) ? 1 : 0;
  }
  const x = scaled(a), y = scaled(b);
  switch (op) {
    case "+":
      return fix(wrap(x + y));
    case "-":
      return fix(wrap(x - y));
    case "*":
      if (!(a instanceof Fix)) return fix(wrap(BigInt(a) * y));
      if (!(b instanceof Fix)) return fix(wrap(x * BigInt(b)));
      return fix(wrap(x * y >> B16));
    case "/": {
      if (y === 0n) return void 0;
      const n = x << B16;
      return fix(wrap(n / y));
    }
    case "%":
      if (y === 0n) return void 0;
      return fix(wrap(x % y));
  }
  return void 0;
}
function neg(a) {
  return a instanceof Fix ? fix(wrap(-BigInt(a.raw))) : -a | 0;
}
function bnot(a) {
  return ~trunc(a);
}
var Fix, B16, MASK32;
var init_numbers = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/numbers.js"() {
    Fix = class {
      constructor(raw) {
        this.raw = raw | 0;
      }
      toString() {
        return text(this);
      }
      /* For JS's own conversions in the reference: typed-array stores and
       * bitwise operators, both of which truncate. */
      valueOf() {
        return trunc(this);
      }
    };
    B16 = 16n;
    MASK32 = (1n << 32n) - 1n;
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/compiler.js
function nullProto(o) {
  return Object.assign(/* @__PURE__ */ Object.create(null), o);
}
function fail(node, message) {
  throw new CompileError(message, node);
}
function internal(message) {
  throw new Error("compiler bug: " + message);
}
function unsupported(node) {
  fail(node, UNSUPPORTED[node.type] || node.type + " is not supported");
}
function isFn(v) {
  return v !== null && typeof v === "object" && "fn" in v;
}
function toStr(v) {
  if (v === null) return "null";
  if (isFn(v)) return "function";
  return text(v);
}
function numLiteral(node) {
  const v = node.value;
  if (typeof v === "bigint") fail(node, "BigInt is not supported");
  if (/[.]/.test(node.raw) || !Number.isInteger(v)) {
    const f = fromReal(v);
    if (!f) fail(node, node.raw + " is too big for a fraction, which holds up to 32767.99998");
    return f;
  }
  if (v > 4294967295 || v < -2147483648)
    fail(node, node.raw + " does not fit in 32 bits");
  return v | 0;
}
function sameConst(a, b) {
  if (isFn(a) && isFn(b)) return a.fn === b.fn;
  if (isNum(a) && isNum(b)) return equal(a, b);
  return a === b;
}
function range(min, max) {
  return min === max ? String(min) : min + " to " + max;
}
function concatParts(node, scope) {
  const parts = splitParts(node, scope);
  for (let i2 = 1; i2 < parts.length; i2++)
    if (sideEffects(parts[i2], scope)) return [node];
  return parts;
}
function sideEffects(node, scope) {
  let found = false;
  function walk(n) {
    if (found || !n || typeof n.type !== "string") return;
    switch (n.type) {
      case "AssignmentExpression":
      case "UpdateExpression":
        found = true;
        return;
      case "FunctionExpression":
        return;
      case "CallExpression": {
        const c = n.callee;
        const sym = c.type === "Identifier" ? scope.resolve(c.name, c) : null;
        if (!sym || !(sym.kind === "native" || sym.kind === "apins" && sym.def) || WRITES_ARGUMENTS.indexOf(sym.def.name) >= 0) {
          found = true;
          return;
        }
      }
    }
    for (const k in n) {
      if (k === "loc") continue;
      const c = n[k];
      if (Array.isArray(c)) c.forEach(walk);
      else if (c && typeof c.type === "string") walk(c);
    }
  }
  walk(node);
  return found;
}
function splitParts(node, scope) {
  function stringy(n) {
    if (n.type === "BinaryExpression" && n.operator === "+")
      return stringy(n.left) || stringy(n.right);
    return typeof scope.prog.fold(n, scope) === "string";
  }
  function parts(n) {
    if (n.type === "BinaryExpression" && n.operator === "+" && scope.prog.fold(n, scope) === void 0 && (stringy(n.left) || stringy(n.right))) {
      const l = stringy(n.left) ? parts(n.left) : [n.left];
      const r = stringy(n.right) ? parts(n.right) : [n.right];
      return l.concat(r);
    }
    return [n];
  }
  return parts(node);
}
function header(cart, prog) {
  const w = new Writer();
  w.u16(prog.format || FORMAT);
  w.u16(prog.version);
  w.u8(cart.rate);
  w.u8(cart.menu_button === "game" ? 1 : 0);
  w.u8(prog.level);
  w.u8(cart.suspend === false ? 1 : 0);
  w.u32(0);
  for (let i2 = 0; i2 < 16; i2 += 2) w.u8(parseInt(cart.id.substr(i2, 2), 16));
  return w.done();
}
function meta(cart) {
  const w = new Writer();
  for (const k in META_TAGS) {
    if (cart[k] === void 0) continue;
    w.u8(META_TAGS[k]);
    w.str(cart[k]);
  }
  return w.done();
}
function code(prog, fns, entries) {
  const w = new Writer();
  w.u16(fns.length);
  w.u16(prog.sites);
  for (const e of entries) w.u16(e ? e.index : 65535);
  let offset2 = 0;
  for (const f of fns) {
    w.u8(f.arity);
    w.u8(f.nlocals);
    w.u16(f.maxDepth);
    w.u32(offset2);
    w.u32(f.code.length);
    offset2 += f.code.length;
  }
  for (const f of fns) w.bytes(f.code);
  return w.done();
}
function constants(prog) {
  const w = new Writer();
  w.u16(prog.strings.length);
  for (const s of prog.strings) w.str(s);
  w.u16(prog.shapes.length);
  for (const keys of prog.shapes) {
    w.u8(keys.length);
    for (const k of keys) w.u16(k);
  }
  return w.done();
}
function globals(prog) {
  const w = new Writer();
  w.u16(prog.globals.length);
  for (const g of prog.globals) {
    const v = g.value;
    if (v === null) w.u8(0);
    else if (typeof v === "number") {
      w.u8(1);
      w.u32(v);
    } else if (typeof v === "string") {
      w.u8(2);
      w.u16(prog.string(v));
    } else if (isFix(v)) {
      w.u8(4);
      w.u32(v.raw);
    } else if (v.img !== void 0) {
      w.u8(5);
      w.u16(v.img);
    } else {
      w.u8(3);
      w.u16(v.fn.index);
    }
  }
  return w.done();
}
function lines(prog, fns) {
  const w = new Writer();
  w.u16(prog.files.length);
  for (const f of prog.files) w.str(f.name);
  w.u16(prog.globals.length);
  for (const g of prog.globals) w.str(g.name);
  for (const f of fns) {
    w.str(f.name);
    w.u8(prog.files.indexOf(f.file));
    w.u16(f.lines.length);
    for (const [pc, line] of f.lines) {
      w.u16(pc);
      w.u16(line);
    }
  }
  return w.done();
}
function sources(files, deflate2) {
  const w = new Writer();
  const names = Object.keys(files).sort();
  w.u16(names.length);
  for (const n of names) {
    w.str(n);
    const b = utf8(files[n]);
    w.u32(b.length);
    w.bytes(b);
  }
  return deflate2(w.done());
}
function boardKey(name) {
  let h = 2166136261;
  for (const b of utf8(name)) h = Math.imul(h ^ b, 16777619) >>> 0;
  return h;
}
function boards(list2) {
  const w = new Writer();
  w.u8(list2.length);
  for (const b of list2) {
    w.u32(boardKey(b.name));
    w.u16(b.version);
    w.u8(b.wins === "low" ? 1 : 0);
    w.u8(FORMATS.indexOf(b.format));
    w.str(b.title);
  }
  return w.done();
}
function options(list2) {
  const w = new Writer();
  w.u8(list2.length);
  for (const o of list2) {
    w.u32(boardKey(o.name));
    w.u8(OPT_TYPES.indexOf(o.type));
    w.u32(o.default >>> 0);
    w.u32(o.min >>> 0);
    w.u32(o.max >>> 0);
    w.u32(o.step);
    w.str(o.title);
    w.u8(o.choices.length);
    for (const c of o.choices) w.str(c);
    w.str(o.help);
  }
  return w.done();
}
function achievements(list2) {
  const w = new Writer();
  w.u8(list2.length);
  for (const a of list2) {
    w.u32(boardKey(a.name));
    w.str(a.title);
    w.str(a.text);
  }
  return w.done();
}
function shortText(s) {
  return typeof s === "string" && s !== "" && utf8(s).length <= 23;
}
function isRecord(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
function checkOptions(list2, bad) {
  if (list2 === void 0) return [];
  if (!Array.isArray(list2)) {
    bad("options must be a list");
    return [];
  }
  if (list2.length > 8) bad("a cart has at most 8 options");
  const seen = /* @__PURE__ */ new Set();
  const whole = (v) => Number.isInteger(v) && v >= -2147483648 && v <= 2147483647;
  return list2.slice(0, 8).map((o, i2) => {
    const at2 = "option " + (i2 + 1) + ": ";
    if (!isRecord(o)) {
      bad(at2 + "must be a record");
      return null;
    }
    for (const k in o)
      if (OPTION_KEYS.indexOf(k) < 0) bad(at2 + "unknown setting " + k);
    if (typeof o.name !== "string" || !NAME2.test(o.name))
      bad(at2 + "name must be usable in code as OPT.<name>");
    else if (seen.has(o.name)) bad(at2 + "a second option called " + o.name);
    seen.add(o.name);
    const c = Object.assign({ title: o.name, help: "" }, o);
    if (!shortText(c.title)) bad(at2 + "title must be text of 1 to 23 bytes");
    if (typeof c.help !== "string" || utf8(c.help).length > 300)
      bad(at2 + "help must be text of at most 300 bytes");
    if (OPT_TYPES.indexOf(c.type) < 0) {
      bad(at2 + "type must be one of " + OPT_TYPES.join(", "));
      return null;
    }
    if (c.type !== "choice" && o.choices !== void 0)
      bad(at2 + "only a choice has choices");
    if (c.type !== "number") {
      for (const k of ["min", "max", "step"])
        if (o[k] !== void 0) bad(at2 + "only a number has " + k);
    }
    if (c.type === "choice") {
      if (!Array.isArray(c.choices) || c.choices.length < 2 || c.choices.length > 8 || !c.choices.every(shortText)) {
        bad(at2 + "choices must be 2 to 8 texts of 1 to 23 bytes");
        c.choices = [];
      }
      c.min = 0;
      c.max = Math.max(c.choices.length - 1, 0);
      c.step = 1;
      if (c.default === void 0) c.default = 0;
    } else if (c.type === "onoff") {
      c.choices = [];
      c.min = 0;
      c.max = 1;
      c.step = 1;
      if (c.default === void 0 || c.default === false) c.default = 0;
      if (c.default === true) c.default = 1;
    } else {
      c.choices = [];
      if (c.step === void 0) c.step = 1;
      if (!whole(c.min) || !whole(c.max) || c.min >= c.max)
        bad(at2 + "min and max must be whole numbers, min below max");
      if (!Number.isInteger(c.step) || c.step < 1 || c.step > 2147483647)
        bad(at2 + "step must be a whole number of at least 1");
      if (c.default === void 0) c.default = c.min;
    }
    if (!Number.isInteger(c.default) || c.default < c.min || c.default > c.max)
      bad(at2 + "default must be " + (c.type === "choice" ? "the index of one of its choices" : c.type === "onoff" ? "true or false" : "a whole number from min to max"));
    return c;
  }).filter(Boolean);
}
function checkAchievements(list2, bad) {
  if (list2 === void 0) return [];
  if (!Array.isArray(list2)) {
    bad("achievements must be a list");
    return [];
  }
  if (list2.length > 32) bad("a cart has at most 32 achievements");
  const seen = /* @__PURE__ */ new Set();
  return list2.slice(0, 32).map((a, i2) => {
    const at2 = "achievement " + (i2 + 1) + ": ";
    if (!isRecord(a)) {
      bad(at2 + "must be a record");
      return null;
    }
    for (const k in a)
      if (["name", "title", "text"].indexOf(k) < 0)
        bad(at2 + "unknown setting " + k);
    if (typeof a.name !== "string" || !NAME2.test(a.name))
      bad(at2 + "name must be usable in code as ACH.<name>");
    else if (seen.has(a.name)) bad(at2 + "a second achievement called " + a.name);
    seen.add(a.name);
    const c = Object.assign({ title: a.name, text: "" }, a);
    if (typeof c.title !== "string" || c.title === "" || utf8(c.title).length > 31)
      bad(at2 + "title must be text of 1 to 31 bytes");
    if (typeof c.text !== "string" || utf8(c.text).length > 95)
      bad(at2 + "text must be at most 95 bytes");
    return c;
  }).filter(Boolean);
}
function checkFlags(list2, bad) {
  if (list2 === void 0) return [];
  if (!Array.isArray(list2)) {
    bad("flags must be a list of names, flag 0 first");
    return [];
  }
  if (list2.length > 8) bad("a sprite has 8 flags, so at most 8 names");
  const seen = /* @__PURE__ */ new Set();
  return list2.slice(0, 8).map((n, i2) => {
    if (n === null || n === "") return null;
    if (typeof n !== "string" || !NAME2.test(n)) {
      bad("flag " + i2 + ": a name must be usable in code as FLAG.<name>");
      return null;
    }
    if (seen.has(n)) bad("flag " + i2 + ": a second flag called " + n);
    seen.add(n);
    return n;
  });
}
function checkBoards(list2, bad) {
  if (list2 === void 0) return [];
  if (!Array.isArray(list2)) {
    bad("boards must be a list");
    return [];
  }
  if (list2.length > 8) bad("a cart has at most 8 boards");
  const seen = /* @__PURE__ */ new Set();
  return list2.slice(0, 8).map((b, i2) => {
    const at2 = "board " + (i2 + 1) + ": ";
    if (!isRecord(b)) {
      bad(at2 + "must be a record");
      return null;
    }
    for (const k in b)
      if (BOARD_KEYS.indexOf(k) < 0) bad(at2 + "unknown setting " + k);
    if (typeof b.name !== "string" || !NAME2.test(b.name))
      bad(at2 + "name must be usable in code as BOARD.<name>");
    else if (seen.has(b.name)) bad(at2 + "a second board called " + b.name);
    seen.add(b.name);
    const c = Object.assign({
      title: b.name,
      wins: "high",
      format: "number",
      version: 1
    }, b);
    if (typeof c.title !== "string" || c.title === "" || utf8(c.title).length > 23)
      bad(at2 + "title must be text of 1 to 23 bytes");
    if (c.wins !== "high" && c.wins !== "low")
      bad(at2 + 'wins must be "high" or "low"');
    if (FORMATS.indexOf(c.format) < 0)
      bad(at2 + "format must be one of " + FORMATS.join(", "));
    if (!Number.isInteger(c.version) || c.version < 1 || c.version > 65535)
      bad(at2 + "version must be a whole number from 1 to 65535");
    return c;
  }).filter(Boolean);
}
function checkCart(cart, errors) {
  function bad(message) {
    errors.push({ file: "cart.json", line: 1, column: 1, message });
  }
  for (const k in cart)
    if (CART_KEYS.indexOf(k) < 0) bad("unknown setting " + k);
  if (typeof cart.id !== "string" || !/^[0-9a-f]{16}$/.test(cart.id))
    bad("id must be 16 lowercase hex digits, made once when the cart is created");
  if (typeof cart.name !== "string" || cart.name === "") bad("name is required");
  for (const k of ["author", "version", "help"])
    if (cart[k] !== void 0 && typeof cart[k] !== "string")
      bad(k + " must be a string");
  const c = Object.assign({ rate: 33, menu_button: "pause", music: "listen" }, cart);
  if (RATES.indexOf(c.rate) < 0) bad("rate must be one of " + RATES.join(", "));
  if (c.menu_button !== "pause" && c.menu_button !== "game")
    bad('menu_button must be "pause" or "game"');
  if (MUSIC.indexOf(c.music) < 0) bad("music must be one of " + MUSIC.join(", "));
  if (c.suspend !== void 0 && typeof c.suspend !== "boolean")
    bad("suspend must be true or false");
  c.lazy_images = cart.lazy_images === void 0 ? [] : cart.lazy_images;
  if (!Array.isArray(c.lazy_images) || c.lazy_images.some((n) => typeof n !== "string") || new Set(c.lazy_images).size !== c.lazy_images.length) {
    bad("lazy_images must be a list of image names, each once");
    c.lazy_images = [];
  }
  c.boards = checkBoards(cart.boards, bad);
  c.options = checkOptions(cart.options, bad);
  c.achievements = checkAchievements(cart.achievements, bad);
  c.flags = checkFlags(cart.flags, bad);
  return c;
}
function nearestColour(palette, rgb) {
  let best = 0, bestD = Infinity;
  palette.forEach((c, i2) => {
    const dr = (c >> 16) - (rgb >> 16 & 255), dg = (c >> 8 & 255) - (rgb >> 8 & 255), db = (c & 255) - (rgb & 255);
    const d = dr * dr + dg * dg + db * db;
    if (d < bestD) {
      best = i2;
      bestD = d;
    }
  });
  return best;
}
function compile(input) {
  const prog = new Program(input.isa, input.api);
  const errors = prog.errors;
  let cart = {};
  if (input.files["cart.json"] === void 0)
    errors.push({ file: "cart.json", line: 1, column: 1, message: "missing" });
  else {
    try {
      cart = JSON.parse(input.files["cart.json"]);
    } catch (e) {
      errors.push({ file: "cart.json", line: 1, column: 1, message: e.message });
    }
  }
  cart = checkCart(cart, errors);
  prog.level = MUSIC.indexOf(cart.music);
  const names = Object.keys(input.files).filter((n) => /\.js$/.test(n)).sort();
  if (names.indexOf("main.js") < 0)
    errors.push({ file: "main.js", line: 1, column: 1, message: "missing" });
  for (const name of names) {
    const ns = name === "main.js" ? null : name.slice(0, -3);
    const file = { name, ns, scope: /* @__PURE__ */ new Map(), ast: null };
    if (ns !== null && !/^[A-Za-z_$][\w$]*$/.test(ns)) {
      errors.push({ file: name, line: 1, column: 1, message: "a file name must be usable as a name in code: letters, digits and _" });
      continue;
    }
    try {
      file.ast = parse3(input.files[name], {
        ecmaVersion: "latest",
        sourceType: "script",
        locations: true
      });
    } catch (e) {
      errors.push({
        file: name,
        line: e.loc ? e.loc.line : 1,
        column: e.loc ? e.loc.column + 1 : 1,
        message: e.message.replace(/ \(\d+:\d+\)$/, "").replace(
          /^Unsyntactic (break|continue)$/,
          "$1 outside a loop"
        )
      });
      continue;
    }
    if (ns === null) prog.main = file;
    else prog.byNs.set(ns, file);
    prog.files.push(file);
  }
  const built = buildAssets(
    input.assets,
    input.inflate,
    (str) => prog.string(str),
    errors,
    cart.lazy_images
  );
  prog.format = built.format3 ? 3 : FORMAT;
  prog.palette = built.palette;
  const board = {}, option = {}, ach = {};
  cart.boards.forEach((b, i2) => {
    board[b.name] = { value: i2, version: 1 };
  });
  cart.options.forEach((o, i2) => {
    option[o.name] = { value: i2, version: 1 };
  });
  cart.achievements.forEach((a2, i2) => {
    ach[a2.name] = { value: i2, version: 1 };
  });
  const flag = {};
  cart.flags.forEach((n, i2) => {
    if (n) flag[n] = { value: 1 << i2, version: 1 };
  });
  prog.api = Object.assign({}, prog.api, {
    groups: Object.assign(
      {},
      prog.api.groups,
      built.groups,
      {
        BOARD: board,
        OPT: option,
        ACH: ach,
        FLAG: flag,
        FONT: Object.assign(
          {},
          prog.api.groups.FONT,
          built.groups.FONT
        )
      }
    )
  });
  if (prog.byNs.has("IMG"))
    errors.push({ file: "IMG.js", line: 1, column: 1, message: "IMG names the cart's images; call the file something else" });
  const images = { name: "images", ns: "IMG", scope: /* @__PURE__ */ new Map(), ast: null };
  built.images.forEach((name, i2) => {
    const g = {
      kind: "global",
      slot: prog.globals.length,
      name: "IMG." + name,
      node: null,
      file: images,
      value: { img: i2 }
    };
    prog.globals.push(g);
    images.scope.set(name, g);
  });
  prog.byNs.set("IMG", images);
  prog.files.sort((a2, b) => (a2.ns === null) - (b.ns === null) || (a2.name < b.name ? -1 : 1));
  for (const f of prog.files) prog.declare(f);
  if (errors.length) return { cart: null, errors };
  prog.initialise();
  for (const fn of prog.fns.slice()) {
    if (fn.node && fn.node.type === "FunctionDeclaration")
      prog.guard(fn.file, () => fn.compileBody());
  }
  const entries = prog.main ? [
    prog.start,
    prog.entry("init", true),
    prog.entry("update", true),
    prog.entry("draw", false),
    prog.entry("ending", false)
  ] : [];
  if (errors.length) return { cart: null, errors };
  const keep = /* @__PURE__ */ new Set();
  const work = entries.filter(Boolean);
  for (const g of prog.globals) if (isFn(g.value)) work.push(g.value.fn);
  while (work.length) {
    const f = work.pop();
    if (keep.has(f)) continue;
    keep.add(f);
    for (const r of f.refs) work.push(r);
  }
  const fns = prog.fns.filter((f) => keep.has(f));
  if (fns.length > 65535)
    return { cart: null, errors: [{
      file: "main.js",
      line: 1,
      column: 1,
      message: "too many functions"
    }] };
  for (const f of fns)
    if (f.nlocals + f.maxDepth + 8 > 4096) {
      const at2 = f.node && f.node.loc ? f.node.loc.start : { line: 1, column: 0 };
      return { cart: null, errors: [{
        file: f.file ? f.file.name : "main.js",
        line: at2.line,
        column: at2.column + 1,
        message: (f.name || "the program") + " needs more stack than a game has; split it"
      }] };
    }
  fns.forEach((f, i2) => {
    f.index = i2;
  });
  for (const f of fns) {
    for (const x of f.fixups) {
      f.code[x.at] = x.fn.index & 255;
      f.code[x.at + 1] = x.fn.index >> 8;
    }
  }
  const srcFiles = {};
  for (const n in input.files)
    if (/\.js$/.test(n) || n === "cart.json") srcFiles[n] = input.files[n];
  const a = input.assets || {};
  const kinds = [
    ["palettes", "palettes/", ".gpl"],
    ["maps", "maps/", ".json"],
    ["sounds", "sounds/", ".json"],
    ["data", "data/", ".json"],
    ["texts", "data/", ".txt"],
    ["fonts", "fonts/", ".bdf"],
    ["editors", "editors/", ".html"]
  ];
  for (const [kind, dir, ext] of kinds)
    for (const n in a[kind] || {}) srcFiles[dir + n + ext] = a[kind][n];
  if (a.flags !== void 0) srcFiles["flags.json"] = a.flags;
  if (a.objects !== void 0) srcFiles["objects.json"] = a.objects;
  if (a.sheet) srcFiles["sheet.png"] = "";
  if (built.logo) srcFiles["logo.png"] = "";
  for (const n of built.images) srcFiles["images/" + n + ".png"] = "";
  const bytes = writeCart([
    { tag: "PBG1", data: header(cart, prog) },
    { tag: "META", data: meta(cart) },
    { tag: "CODE", data: code(prog, fns, entries) },
    { tag: "CNST", data: constants(prog) },
    { tag: "GLOB", data: globals(prog) },
    { tag: "LINE", data: lines(prog, fns) },
    ...built.chunks,
    ...cart.boards.length ? [{ tag: "BORD", data: boards(cart.boards) }] : [],
    ...cart.options.length ? [{ tag: "OPTN", data: options(cart.options) }] : [],
    ...cart.achievements.length ? [{ tag: "ACHV", data: achievements(cart.achievements) }] : [],
    { tag: "SRC_", data: sources(srcFiles, input.deflate) }
  ]);
  let codeBytes = 0;
  for (const f of fns) codeBytes += f.code.length;
  return {
    cart: bytes,
    errors: [],
    groups: Object.assign({}, built.groups, {
      BOARD: board,
      OPT: option,
      ACH: ach,
      FLAG: flag,
      IMG: Object.fromEntries(built.images.map((n) => [n, {}]))
    }),
    /* each global's name, by its slot: the memory view's labels */
    globals: prog.globals.map((g) => g.name),
    stats: {
      functions: fns.length,
      dropped: prog.fns.length - fns.length,
      code: codeBytes,
      globals: prog.globals.length,
      strings: prog.strings.length,
      size: bytes.length,
      api: prog.version
    }
  };
}
var FORMAT, RATES, LEVELS, MUSIC, MAX_PARTS, CompileError, UNSUPPORTED, MISSING_METHODS, MISSING_GLOBALS, BUILTINS, BINARY, FUSED, FUSED_NOT, FUSED_LOCAL, BINARY_REJECTED, truthy2, Scope3, Fn, WRITES_ARGUMENTS, Program, META_TAGS, FORMATS, OPT_TYPES, CART_KEYS, BOARD_KEYS, OPTION_KEYS, NAME2;
var init_compiler = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/compiler.js"() {
    init_acorn();
    init_cart();
    init_assets();
    init_unpack();
    init_numbers();
    FORMAT = 2;
    RATES = [20, 25, 33, 50];
    LEVELS = { LISTEN: 0, CONTROL: 1, OWN: 2 };
    MUSIC = ["listen", "control", "own"];
    MAX_PARTS = 32;
    CompileError = class extends Error {
      constructor(message, node) {
        super(message);
        this.node = node;
      }
    };
    UNSUPPORTED = nullProto({
      ArrowFunctionExpression: "arrow functions (=>) are not supported; use function",
      ClassDeclaration: "classes are not supported; use records and functions",
      ClassExpression: "classes are not supported; use records and functions",
      TemplateLiteral: "template strings are not supported; join strings with +",
      TaggedTemplateExpression: "template strings are not supported",
      SpreadElement: "spread (...) is not supported",
      RestElement: "rest parameters (...) are not supported",
      AwaitExpression: "await is not supported",
      YieldExpression: "generators are not supported",
      ThisExpression: "this is not supported; pass the object as an argument",
      ForInStatement: "for...in is not supported",
      ForOfStatement: "for...of is not supported; use a for loop with an index",
      TryStatement: "try/catch is not supported",
      ThrowStatement: "throw is not supported",
      WithStatement: "with is not supported",
      LabeledStatement: "labels are not supported",
      DebuggerStatement: "debugger is not supported; use printh or watch",
      ObjectPattern: "destructuring is not supported",
      ArrayPattern: "destructuring is not supported",
      AssignmentPattern: "default parameter values are not supported",
      ChainExpression: "optional chaining (?.) is not supported",
      ImportExpression: "import is not supported; every .js file in the cart is included",
      ImportDeclaration: "import is not supported; every .js file in the cart is included",
      ExportNamedDeclaration: "export is not supported; every file is a namespace",
      ExportDefaultDeclaration: "export is not supported; every file is a namespace",
      ExportAllDeclaration: "export is not supported; every file is a namespace",
      MetaProperty: "new.target is not supported",
      Super: "super is not supported",
      ParenthesizedExpression: null
    });
    MISSING_METHODS = nullProto({
      toString: 'join it to a string: "" + n',
      forEach: "use a for loop",
      map: "use a for loop",
      filter: "use a for loop",
      reduce: "use a for loop",
      some: "use a for loop",
      every: "use a for loop",
      find: "use a for loop",
      findIndex: "use a for loop",
      fill: "use a for loop",
      concat: "push the elements, or join strings with +",
      split: "use indexOf and substring",
      trim: null,
      includes: "use indexOf(x) != -1",
      charAt: "use charCodeAt or substring",
      substr: "use substring",
      startsWith: "use indexOf",
      endsWith: null,
      replace: null,
      match: null,
      search: null,
      padStart: "the text library pads numbers",
      padEnd: null,
      repeat: null,
      toFixed: 'join it to a string: "" + x',
      hasOwnProperty: null,
      apply: null,
      call: null,
      bind: null,
      keys: null,
      values: null,
      entries: null
    });
    MISSING_GLOBALS = nullProto({
      console: "use printh()",
      Date: "use date()",
      JSON: null,
      Object: null,
      Array: "use an array literal []",
      Number: null,
      Boolean: null,
      isNaN: "there is no NaN",
      isFinite: "every number is finite",
      NaN: "there is no NaN",
      Infinity: "every number is finite",
      Symbol: null,
      Promise: null,
      setTimeout: "count ticks in update()",
      setInterval: "count ticks in update()",
      window: null,
      document: null,
      arguments: "name the parameters",
      eval: null,
      Float32Array: "use FixArray",
      Float64Array: "use FixArray",
      Int16Array: "use Int32Array",
      Uint16Array: "use Int32Array",
      Int8Array: "use Int32Array",
      Uint32Array: "use Int32Array",
      Uint8ClampedArray: "use Uint8Array",
      Map: "use a record: o[key]",
      Set: "use a record: o[key] = true",
      RegExp: null
    });
    BUILTINS = [
      "Math",
      "String",
      "parseInt",
      "Int32Array",
      "Uint8Array",
      "FixArray",
      "undefined",
      "deg",
      "rgb"
    ];
    BINARY = nullProto({
      "+": "ADD",
      "-": "SUB",
      "*": "MUL",
      "/": "DIV",
      "%": "MOD",
      "&": "BAND",
      "|": "BOR",
      "^": "BXOR",
      "<<": "SHL",
      ">>": "SHR",
      ">>>": "USHR",
      "==": "EQ",
      "===": "EQ",
      "!=": "NE",
      "!==": "NE",
      "<": "LT",
      "<=": "LE",
      ">": "GT",
      ">=": "GE"
    });
    FUSED = nullProto({
      "<": "JLT",
      "<=": "JLE",
      ">": "JGT",
      ">=": "JGE",
      "==": "JEQ",
      "===": "JEQ",
      "!=": "JNE",
      "!==": "JNE"
    });
    FUSED_NOT = nullProto({
      "<": "JGE",
      "<=": "JGT",
      ">": "JLE",
      ">=": "JLT",
      "==": "JNE",
      "===": "JNE",
      "!=": "JEQ",
      "!==": "JEQ"
    });
    FUSED_LOCAL = nullProto({
      JLT: "JLTLI",
      JLE: "JLELI",
      JGT: "JGTLI",
      JGE: "JGELI"
    });
    BINARY_REJECTED = nullProto({
      in: "the in operator is not supported; compare o[key] with null",
      instanceof: "instanceof is not supported; use typeof",
      "**": "** is not supported; use Math.pow",
      "??": "?? is not supported; use ||"
    });
    truthy2 = truthy;
    Scope3 = class {
      constructor(prog, file, outer) {
        this.prog = prog;
        this.file = file;
        this.outer = outer;
        this.locals = /* @__PURE__ */ new Map();
        this.self = null;
      }
      /* Returns a symbol, or null for a name that is not declared anywhere. */
      resolve(name, node) {
        if (this.locals.has(name))
          return { kind: "local", slot: this.locals.get(name) };
        if (this.self && this.self.name === name)
          return { kind: "func", fn: this.self.fn };
        for (let o = this.outer; o; o = o.outer) {
          if (o.locals.has(name))
            fail(node, name + " is a local variable of the function around this one, and functions cannot capture locals; pass it as an argument or make it a global");
        }
        return this.prog.lookup(name, this.file);
      }
    };
    Fn = class extends Scope3 {
      constructor(prog, file, name, node, outer) {
        super(prog, file, outer);
        this.name = name;
        this.node = node;
        this.id = prog.fns.length;
        prog.fns.push(this);
        this.arity = node ? node.params.length : 0;
        this.nlocals = 0;
        this.free = [];
        this.code = [];
        this.lines = [];
        this.lastLine = -1;
        this.line = node ? node.loc.start.line : 0;
        this.depth = 0;
        this.maxDepth = 0;
        this.live = true;
        this.fixups = [];
        this.refs = /* @__PURE__ */ new Set();
        this.targets = [];
        this.index = -1;
      }
      /* -- emitting -- */
      /* Code after a return or a jump is unreachable until a label some jump
       * reaches. It is still compiled, so its errors are reported, but
       * nothing of it is emitted. */
      emit(name, operands, pops, pushes) {
        const op = this.prog.isa.op[name];
        if (!op) internal("no opcode " + name);
        if (!this.live) return;
        if (this.line !== this.lastLine) {
          this.lines.push([this.code.length, this.line]);
          this.lastLine = this.line;
        }
        this.code.push(op.code);
        const ks = op.operands;
        for (let i2 = 0; i2 < ks.length; i2++) {
          const v = operands[i2];
          switch (ks[i2]) {
            case "b":
              if (v < -128 || v > 127) internal(name + " s8 " + v);
              this.code.push(v & 255);
              break;
            case "B":
              if (v < 0 || v > 255) internal(name + " u8 " + v);
              this.code.push(v);
              break;
            case "h":
            case "H":
              this.code.push(v & 255, v >> 8 & 255);
              break;
            case "i":
              this.code.push(
                v & 255,
                v >> 8 & 255,
                v >> 16 & 255,
                v >>> 24 & 255
              );
              break;
          }
        }
        const p = pops === void 0 ? op.pops : pops;
        const q = pushes === void 0 ? op.pushes : pushes;
        if (p < 0 || q < 0) internal(name + " needs its stack effect");
        if (this.depth < p) internal(name + " pops an empty stack");
        this.depth += q - p;
        if (this.depth > this.maxDepth) this.maxDepth = this.depth;
        if (name === "JMP" || name === "RET" || name === "RETNULL")
          this.live = false;
      }
      /* An operand naming a function, patched once functions are numbered. */
      emitFn(name, fn, pops) {
        if (!this.live) return;
        this.emit(name, [0], pops, 1);
        this.fixups.push({ at: this.code.length - 2, fn });
        this.refs.add(fn);
      }
      label() {
        return { pos: -1, depth: null, fix: [] };
      }
      reach(L, depth) {
        if (L.depth === null) L.depth = depth;
        else if (L.depth !== depth)
          internal("stack " + depth + " and " + L.depth + " meet at a label");
      }
      /* the jump's offset is its last operand, after any in front */
      jump(name, L, front = []) {
        if (!this.live) return;
        const before = this.depth;
        this.emit(name, [...front, 0]);
        this.reach(L, name === "ANDJ" || name === "ORJ" ? before : before - this.prog.isa.op[name].pops);
        const at2 = this.code.length - 2;
        if (L.pos >= 0) this.patch(at2, L.pos);
        else L.fix.push(at2);
      }
      place(L) {
        if (this.live) this.reach(L, this.depth);
        else if (L.depth !== null) {
          this.depth = L.depth;
          this.live = true;
        }
        L.pos = this.code.length;
        for (const at2 of L.fix) this.patch(at2, L.pos);
      }
      patch(at2, pos) {
        const off = pos - (at2 + 2);
        if (off < -32768 || off > 32767)
          fail(this.node, this.name + " is too long to jump across; split it");
        this.code[at2] = off & 255;
        this.code[at2 + 1] = off >> 8 & 255;
      }
      at(node) {
        if (node.loc) this.line = node.loc.start.line;
      }
      pushConst(v) {
        if (v === null) this.emit("PUSHNULL", []);
        else if (typeof v === "number") {
          if (v >= -128 && v <= 127) this.emit("PUSHI8", [v]);
          else if (v >= -32768 && v <= 32767) this.emit("PUSHI16", [v]);
          else this.emit("PUSHI32", [v]);
        } else if (isFix(v))
          this.emit("PUSHF", [v.raw]);
        else if (typeof v === "string")
          this.emit("PUSHS", [this.prog.string(v)]);
        else this.emitFn("PUSHFN", v.fn, 0);
      }
      /* -- locals -- */
      declare(name, node) {
        if (this.locals.has(name)) return;
        if (this.nlocals >= 255) fail(node, this.name + " has too many local variables");
        this.locals.set(name, this.nlocals++);
      }
      temp() {
        if (this.free.length) return this.free.pop();
        if (this.nlocals >= 255) fail(this.node, this.name + " has too many local variables");
        return this.nlocals++;
      }
      release(slot) {
        this.free.push(slot);
      }
      /* -- the body -- */
      compileBody() {
        const node = this.node;
        if (node.generator) fail(node, "generators are not supported");
        if (node.async) fail(node, "async functions are not supported");
        for (const p of node.params) {
          if (p.type !== "Identifier") unsupported(p);
          if (this.locals.has(p.name))
            fail(p, "parameter " + p.name + " is named twice");
          this.declare(p.name, p);
        }
        if (node.type === "FunctionExpression" && node.id)
          this.self = { name: node.id.name, fn: this };
        this.hoist(node.body.body);
        this.statements(node.body.body);
        if (this.live) this.emit("RETNULL", []);
      }
      /* var is function-scoped: declare every var in the body up front. */
      hoist(list2) {
        const self = this;
        function walk(n) {
          if (!n || typeof n.type !== "string") return;
          switch (n.type) {
            case "VariableDeclaration":
              if (n.kind !== "var")
                fail(n, n.kind === "let" ? "let is not supported; use var" : "const is only allowed at the top level of a file; use var");
              for (const d of n.declarations) {
                if (d.id.type !== "Identifier") unsupported(d.id);
                self.declare(d.id.name, d);
              }
              break;
            case "FunctionDeclaration":
              fail(n, "functions must be declared at the top level of a file; a function expression assigned to a variable works here");
              break;
            case "FunctionExpression":
            case "ArrowFunctionExpression":
              return;
          }
          for (const k in n) {
            if (k === "loc") continue;
            const c = n[k];
            if (Array.isArray(c)) c.forEach(walk);
            else if (c && typeof c.type === "string") walk(c);
          }
        }
        list2.forEach(walk);
      }
      /* ---- statements ---- */
      statements(list2) {
        for (const s of list2) this.statement(s);
      }
      statement(s) {
        this.at(s);
        switch (s.type) {
          case "EmptyStatement":
            return;
          case "BlockStatement":
            return this.statements(s.body);
          case "ExpressionStatement":
            if (s.directive) return;
            return this.effect(s.expression);
          case "VariableDeclaration":
            for (const d of s.declarations) {
              if (!d.init) continue;
              this.at(d);
              this.value(d.init);
              this.emit("STL", [this.locals.get(d.id.name)]);
            }
            return;
          case "IfStatement": {
            const end = this.label();
            if (s.alternate) {
              const other = this.label();
              this.cond(s.test, other, false);
              this.statement(s.consequent);
              if (this.live) this.jump("JMP", end);
              this.place(other);
              this.statement(s.alternate);
            } else {
              this.cond(s.test, end, false);
              this.statement(s.consequent);
            }
            return this.place(end);
          }
          case "ForStatement":
            if (s.init) {
              if (s.init.type === "VariableDeclaration") this.statement(s.init);
              else this.effect(s.init);
            }
            return this.loop(s.test, s.body, s.update);
          case "WhileStatement":
            return this.loop(s.test, s.body, null);
          case "DoWhileStatement": {
            const body = this.label(), cont = this.label(), brk = this.label();
            this.place(body);
            this.targets.push({ brk, cont });
            this.statement(s.body);
            this.targets.pop();
            this.place(cont);
            this.at(s.test);
            this.cond(s.test, body, true);
            return this.place(brk);
          }
          case "SwitchStatement":
            return this.switchStatement(s);
          case "BreakStatement":
          case "ContinueStatement": {
            if (s.label) unsupported({ type: "LabeledStatement", loc: s.loc });
            const brk = s.type === "BreakStatement";
            for (let i2 = this.targets.length - 1; i2 >= 0; i2--) {
              const L = brk ? this.targets[i2].brk : this.targets[i2].cont;
              if (L) return this.jump("JMP", L);
            }
            return fail(s, (brk ? "break" : "continue") + " outside a loop");
          }
          case "ReturnStatement":
            if (s.argument) {
              this.value(s.argument);
              this.emit("RET", []);
            } else this.emit("RETNULL", []);
            return;
          case "FunctionDeclaration":
            return fail(s, "functions must be declared at the top level of a file");
          default:
            return unsupported(s);
        }
      }
      /* Test at the bottom: one conditional jump per iteration. */
      loop(test, body, update) {
        const top = this.label(), cont = this.label(), brk = this.label();
        const check = this.label();
        const forever = !test || this.prog.fold(test, this) !== void 0 && truthy2(this.prog.fold(test, this));
        if (this.live) top.depth = this.depth;
        if (!forever) this.jump("JMP", check);
        this.place(top);
        this.targets.push({ brk, cont });
        this.statement(body);
        this.targets.pop();
        this.place(cont);
        if (update) {
          this.at(update);
          this.effect(update);
        }
        if (forever) this.jump("JMP", top);
        else {
          this.place(check);
          this.at(test);
          this.cond(test, top, true);
        }
        this.place(brk);
      }
      switchStatement(s) {
        this.value(s.discriminant);
        const t = this.temp();
        this.emit("STL", [t]);
        const brk = this.label();
        const entry = s.cases.map(() => this.label());
        let dflt = null;
        s.cases.forEach((c, i2) => {
          if (!c.test) {
            dflt = entry[i2];
            return;
          }
          this.at(c);
          this.emit("LDL", [t]);
          this.value(c.test);
          this.emit("EQ", []);
          this.jump("JT", entry[i2]);
        });
        this.jump("JMP", dflt || brk);
        this.release(t);
        this.targets.push({ brk, cont: null });
        s.cases.forEach((c, i2) => {
          this.place(entry[i2]);
          this.statements(c.consequent);
        });
        this.targets.pop();
        this.place(brk);
      }
      /* Jumps to L when node's truth is `when`; falls through otherwise. */
      cond(node, L, when) {
        this.at(node);
        const c = this.prog.fold(node, this);
        if (c !== void 0) {
          if (truthy2(c) === when) this.jump("JMP", L);
          return;
        }
        if (node.type === "UnaryExpression" && node.operator === "!")
          return this.cond(node.argument, L, !when);
        if (node.type === "LogicalExpression" && (node.operator === "&&" || node.operator === "||")) {
          const and = node.operator === "&&";
          if (and !== when) {
            this.cond(node.left, L, when);
            this.cond(node.right, L, when);
          } else {
            const skip = this.label();
            this.cond(node.left, skip, !when);
            this.cond(node.right, L, when);
            this.place(skip);
          }
          return;
        }
        const fused = when ? FUSED[node.operator] : FUSED_NOT[node.operator];
        if (node.type === "BinaryExpression" && fused) {
          const l = FUSED_LOCAL[fused] && this.variable(node.left);
          const k = l && l.kind === "local" ? this.prog.fold(node.right, this) : void 0;
          if (typeof k === "number" && k >= -128 && k <= 127) {
            this.at(node);
            return this.jump(FUSED_LOCAL[fused], L, [l.slot, k]);
          }
          this.value(node.left);
          this.value(node.right);
          this.at(node);
          return this.jump(fused, L);
        }
        this.value(node);
        this.jump(when ? "JT" : "JF", L);
      }
      /* ---- expressions ---- */
      value(node) {
        this.at(node);
        const c = this.prog.fold(node, this);
        if (c !== void 0) return this.pushConst(c);
        switch (node.type) {
          case "Literal":
            if (node.regex) fail(node, "regular expressions are not supported");
            return internal("literal not folded");
          case "Identifier":
            return this.load(this.name2sym(node), node);
          case "ArrayExpression":
            for (const e of node.elements) {
              if (!e) fail(node, "arrays cannot have holes");
              if (e.type === "SpreadElement") unsupported(e);
              this.value(e);
            }
            if (node.elements.length > 65535) fail(node, "array literal too long");
            return this.emit(
              "NEWARR",
              [node.elements.length],
              node.elements.length,
              1
            );
          case "ObjectExpression":
            return this.record(node);
          case "FunctionExpression": {
            const fn = this.prog.functionExpression(node, this, this.file);
            return this.emitFn("PUSHFN", fn, 0);
          }
          case "UnaryExpression":
            return this.unary(node);
          case "BinaryExpression": {
            if (BINARY_REJECTED[node.operator])
              fail(node, BINARY_REJECTED[node.operator]);
            this.value(node.left);
            this.value(node.right);
            this.at(node);
            return this.emit(BINARY[node.operator], []);
          }
          case "LogicalExpression": {
            if (BINARY_REJECTED[node.operator])
              fail(node, BINARY_REJECTED[node.operator]);
            const end = this.label();
            this.value(node.left);
            this.jump(node.operator === "&&" ? "ANDJ" : "ORJ", end);
            this.value(node.right);
            return this.place(end);
          }
          case "ConditionalExpression": {
            const other = this.label(), end = this.label();
            this.cond(node.test, other, false);
            this.value(node.consequent);
            this.jump("JMP", end);
            this.place(other);
            this.value(node.alternate);
            return this.place(end);
          }
          case "AssignmentExpression":
            return this.assign(node, true);
          case "UpdateExpression":
            return this.update(node, true);
          case "SequenceExpression":
            node.expressions.forEach((e, i2) => {
              if (i2 < node.expressions.length - 1) this.effect(e);
              else this.value(e);
            });
            return;
          case "MemberExpression":
            return this.member(node);
          case "CallExpression":
            return this.call(node, true);
          case "NewExpression":
            return this.newExpression(node);
          default:
            return unsupported(node);
        }
      }
      effect(node) {
        this.at(node);
        switch (node.type) {
          case "AssignmentExpression":
            return this.assign(node, false);
          case "UpdateExpression":
            return this.update(node, false);
          case "CallExpression":
            return this.call(node, false);
          case "SequenceExpression":
            return node.expressions.forEach((e) => this.effect(e));
          case "LogicalExpression":
            if (node.operator === "&&" || node.operator === "||") {
              const end = this.label();
              this.cond(node.left, end, node.operator === "||");
              this.effect(node.right);
              return this.place(end);
            }
            break;
          case "ConditionalExpression": {
            const other = this.label(), end = this.label();
            this.cond(node.test, other, false);
            this.effect(node.consequent);
            if (this.live) this.jump("JMP", end);
            this.place(other);
            this.effect(node.alternate);
            return this.place(end);
          }
        }
        this.value(node);
        this.emit("POP", []);
      }
      name2sym(node) {
        const name = node.name;
        const sym = this.resolve(name, node);
        if (sym) return sym;
        if (name in MISSING_GLOBALS) {
          const hint = MISSING_GLOBALS[name];
          fail(node, name + " is not available" + (hint ? "; " + hint : ""));
        }
        return fail(node, name + " is not declared");
      }
      load(sym, node) {
        switch (sym.kind) {
          case "local":
            return this.emit("LDL", [sym.slot]);
          case "global":
            return this.emit("LDG", [sym.slot]);
          case "func":
            return this.emitFn("PUSHFN", sym.fn, 0);
          case "const":
            return this.pushConst(this.prog.constValue(sym));
          case "native":
            return fail(node, sym.def.name + " is a built-in function and cannot be used as a value; call it");
          case "ns":
            return fail(node, node.name + " is a file of this cart; use its names as " + node.name + ".name");
          case "group":
            return fail(node, node.name + " is a group of constants; use " + node.name + ".NAME");
          case "apins":
            return fail(node, node.name + " is a set of built-in functions; call one, as " + node.name + ".name()");
          case "builtin":
            if (node.name === "undefined") return this.emit("PUSHNULL", []);
            return fail(node, node.name + " cannot be used as a value");
        }
        return internal("symbol " + sym.kind);
      }
      /* The symbol an assignment writes: a local, or a global of any file. */
      target(node) {
        let sym;
        if (node.type === "Identifier") sym = this.name2sym(node);
        else sym = this.nsMember(node);
        if (sym && (sym.kind === "local" || sym.kind === "global")) return sym;
        if (!sym) return null;
        const what = {
          func: "a function",
          const: "a constant",
          native: "a built-in function",
          ns: "a file",
          group: "a group of constants",
          builtin: "built in"
        };
        return fail(node, (node.name || node.property.name) + " is " + what[sym.kind] + " and cannot be assigned");
      }
      store(sym) {
        this.emit(sym.kind === "local" ? "STL" : "STG", [sym.slot]);
      }
      /* ns.name resolved statically, or null when node is not one. */
      nsMember(node) {
        if (node.type !== "MemberExpression" || node.computed || node.object.type !== "Identifier")
          return null;
        const base = this.resolve(node.object.name, node.object);
        if (!base) return null;
        if (base.kind === "ns") {
          const sym = base.file.scope.get(node.property.name);
          if (!sym)
            fail(node, node.object.name + ".js has no " + node.property.name);
          return sym;
        }
        return null;
      }
      /* The local or global a plain name, or a file's name, is; null for
       * anything else */
      variable(node) {
        let sym = null;
        if (node.type === "Identifier") sym = this.resolve(node.name, node);
        else if (node.type === "MemberExpression") sym = this.nsMember(node);
        return sym && (sym.kind === "local" || sym.kind === "global") ? sym : null;
      }
      member(node) {
        if (node.optional) unsupported({ type: "ChainExpression", loc: node.loc });
        const ns = this.nsMember(node);
        if (ns) return this.load(ns, node.property);
        if (node.object.type === "Identifier") {
          const base = this.resolve(node.object.name, node.object);
          if (base && base.kind === "group")
            fail(node, node.object.name + " has no " + node.property.name);
          if (base && base.kind === "builtin" && base.name !== "undefined")
            fail(node, node.object.name + "." + (node.property.name || "[]") + " is not supported");
        }
        const key = this.propertyKey(node);
        const g = key !== "length" && this.variable(node.object);
        if (g && g.kind === "global") {
          if (key !== null) {
            this.at(node);
            return this.emit("GETGP", [
              g.slot,
              this.prog.string(key),
              this.prog.site()
            ]);
          }
          const i2 = this.variable(node.property);
          if (i2 && i2.kind === "local") {
            this.at(node);
            return this.emit("GETGL", [g.slot, i2.slot]);
          }
        }
        this.value(node.object);
        this.at(node);
        if (key === "length") return this.emit("LEN", []);
        if (key !== null)
          return this.emit("GETPROP", [this.prog.string(key), this.prog.site()]);
        this.value(node.property);
        this.emit("GETIDX", []);
      }
      /* The key of o.name or o["name"]; null for a computed index. */
      propertyKey(node) {
        if (!node.computed) return node.property.name;
        if (node.property.type === "Literal" && typeof node.property.value === "string")
          return node.property.value;
        return null;
      }
      record(node) {
        const keys = [];
        for (const p of node.properties) {
          if (p.type === "SpreadElement") unsupported(p);
          if (p.kind !== "init") fail(p, "getters and setters are not supported");
          if (p.method) fail(p, "methods in a record are not supported; write name: function () {...}");
          if (p.shorthand) fail(p, "write " + p.key.name + ": " + p.key.name);
          if (p.computed) fail(p, "computed keys are not supported");
          let k;
          if (p.key.type === "Identifier") k = p.key.name;
          else if (p.key.type === "Literal" && typeof p.key.value === "string")
            k = p.key.value;
          else fail(p.key, "record keys must be names or strings");
          if (keys.indexOf(k) >= 0) fail(p.key, "key " + k + " appears twice");
          keys.push(k);
          this.value(p.value);
        }
        if (keys.length > 255) fail(node, "a record has at most 255 keys");
        this.at(node);
        this.emit("NEWOBJ", [this.prog.shape(keys)], keys.length, 1);
      }
      unary(node) {
        switch (node.operator) {
          case "-":
            this.value(node.argument);
            return this.emit("NEG", []);
          case "~":
            this.value(node.argument);
            return this.emit("BNOT", []);
          case "!":
            this.value(node.argument);
            return this.emit("NOT", []);
          case "typeof":
            this.value(node.argument);
            return this.emit("TYPEOF", []);
          case "+":
            return fail(node, "unary + does not convert here; use parseInt for strings");
          case "delete":
            return fail(node, "delete is not supported; set the field to null");
          case "void":
            return fail(node, "void is not supported; use null");
        }
        return unsupported(node);
      }
      /* ---- assignment ---- */
      compound(node) {
        const op = node.operator.slice(0, -1);
        if (!BINARY[op] || op.length === 0 || node.operator.length < 2)
          fail(node, node.operator + " is not supported");
        return op;
      }
      assign(node, want) {
        const left = node.left;
        if (left.type === "ObjectPattern" || left.type === "ArrayPattern") unsupported(left);
        const op = node.operator === "=" ? null : this.compound(node);
        const sym = this.target(left);
        if (sym) {
          if (op === null) this.value(node.right);
          else {
            const k = this.prog.fold(node.right, this);
            if (!want && sym.kind === "local" && typeof k === "number" && (op === "+" || op === "-")) {
              const d = op === "+" ? k : -k;
              if (d >= -128 && d <= 127) {
                this.at(node);
                return this.emit("INCL", [sym.slot, d]);
              }
            }
            this.load(sym, left);
            this.value(node.right);
            this.at(node);
            this.emit(BINARY[op], []);
          }
          if (want) this.emit("DUP", []);
          return this.store(sym);
        }
        if (left.type !== "MemberExpression")
          return fail(left, "cannot assign to this");
        this.storeMember(left, want, () => {
          if (op === null) return this.value(node.right);
          this.value(node.right);
          this.at(node);
          this.emit(BINARY[op], []);
        }, op !== null);
      }
      /* o.k = v and a[i] = v. With `read`, the old value is fetched first and
       * produce() combines it with the new; with `want` the stored value is
       * left on the stack, kept in a temporary across the store. */
      storeMember(left, want, produce, read, keepOld) {
        if (left.optional) unsupported({ type: "ChainExpression", loc: left.loc });
        const key = this.propertyKey(left);
        if (key === "length") fail(left, "length cannot be assigned");
        if (left.object.type === "Identifier") {
          const base = this.resolve(left.object.name, left.object);
          if (base && (base.kind === "group" || base.kind === "builtin"))
            fail(left, left.object.name + "." + key + " cannot be assigned");
        }
        this.value(left.object);
        if (key === null) this.value(left.property);
        const site = key === null ? 0 : this.prog.site();
        const kidx = key === null ? 0 : this.prog.string(key);
        if (read) {
          this.at(left);
          if (key === null) {
            this.emit("DUP2", []);
            this.emit("GETIDX", []);
          } else {
            this.emit("DUP", []);
            this.emit("GETPROP", [kidx, site]);
          }
        }
        let t = -1;
        if (want && keepOld) {
          t = this.temp();
          this.emit("DUP", []);
          this.emit("STL", [t]);
        }
        produce();
        if (want && !keepOld) {
          t = this.temp();
          this.emit("DUP", []);
          this.emit("STL", [t]);
        }
        this.at(left);
        if (key === null) this.emit("SETIDX", []);
        else this.emit("SETPROP", [kidx, site]);
        if (want) {
          this.emit("LDL", [t]);
          this.release(t);
        }
      }
      update(node, want) {
        const d = node.operator === "++" ? 1 : -1;
        const arg = node.argument;
        const sym = this.target(arg);
        const old = want && !node.prefix;
        if (sym && sym.kind === "local") {
          if (old) this.emit("LDL", [sym.slot]);
          this.emit("INCL", [sym.slot, d]);
          if (want && node.prefix) this.emit("LDL", [sym.slot]);
          return;
        }
        if (sym) {
          this.emit("LDG", [sym.slot]);
          if (old) this.emit("DUP", []);
          this.emit("PUSHI8", [d]);
          this.emit("ADD", []);
          if (want && node.prefix) this.emit("DUP", []);
          return this.store(sym);
        }
        if (arg.type !== "MemberExpression")
          return fail(arg, node.operator + " needs a variable, field or element");
        this.storeMember(arg, want, () => {
          this.emit("PUSHI8", [d]);
          this.emit("ADD", []);
        }, true, old);
      }
      /* ---- calls ---- */
      args(list2) {
        for (const a of list2) {
          if (a.type === "SpreadElement") unsupported(a);
          this.value(a);
        }
        if (list2.length > 255) fail(list2[255], "too many arguments");
        return list2.length;
      }
      result(pushes, want) {
        if (want && !pushes) this.emit("PUSHNULL", []);
        if (!want && pushes) this.emit("POP", []);
      }
      call(node, want) {
        if (node.optional) unsupported({ type: "ChainExpression", loc: node.loc });
        const callee = node.callee;
        const args2 = node.arguments;
        if (callee.type === "Identifier") {
          const sym = this.name2sym(callee);
          switch (sym.kind) {
            case "func":
              return this.userCall(sym.fn, args2, node, want);
            case "native":
              return this.nativeCall(sym.def, args2, node, want);
            case "apins":
              if (sym.def) return this.nativeCall(sym.def, args2, node, want);
              break;
            case "builtin":
              return this.builtinCall(callee.name, args2, node, want);
            case "const":
              return fail(callee, callee.name + " is a constant, not a function");
          }
          this.load(sym, callee);
          return this.valueCall(args2, node, want);
        }
        if (callee.type === "MemberExpression") {
          const ns = this.nsMember(callee);
          if (ns && ns.kind === "func") return this.userCall(ns.fn, args2, node, want);
          if (ns) {
            this.load(ns, callee.property);
            return this.valueCall(args2, node, want);
          }
          if (callee.object.type === "Identifier" && !callee.computed) {
            const base = this.resolve(callee.object.name, callee.object);
            if (base && base.kind === "builtin") {
              if (base.name === "Math")
                return this.mathCall(callee.property.name, args2, node, want);
              if (base.name === "String" && callee.property.name === "fromCharCode")
                return this.intrinsic("fromCharCode", args2, node, want);
              fail(callee, callee.object.name + "." + callee.property.name + " is not supported");
            }
            if (base && base.kind === "group")
              fail(callee, callee.object.name + "." + callee.property.name + " is a constant, not a function");
            if (base && base.kind === "apins") {
              const def = this.prog.api.namespaces[base.name][callee.property.name];
              if (!def)
                fail(callee, callee.object.name + " has no function " + callee.property.name);
              return this.nativeCall(def, args2, node, want);
            }
          }
          const key = this.propertyKey(callee);
          const m = key === null ? null : this.prog.isa.methods.find((x) => x.name === key);
          if (m) {
            if (args2.length < m.min || args2.length > m.max)
              fail(node, "." + key + "() takes " + range(m.min, m.max) + " argument" + (m.max === 1 ? "" : "s") + (key === "sort" ? ": a comparator, which the default string order makes necessary" : ""));
            this.value(callee.object);
            const argc = this.args(args2);
            this.at(node);
            this.emit("METHOD", [m.id, argc], argc + 1, 1);
            return this.result(1, want);
          }
          if (key !== null && key in MISSING_METHODS) {
            const hint = MISSING_METHODS[key];
            fail(callee.property, "." + key + "() is not supported" + (hint ? "; " + hint : ""));
          }
          this.member(callee);
          return this.valueCall(args2, node, want);
        }
        this.value(callee);
        return this.valueCall(args2, node, want);
      }
      valueCall(args2, node, want) {
        const argc = this.args(args2);
        this.at(node);
        this.emit("CALLV", [argc], argc + 1, 1);
        this.result(1, want);
      }
      userCall(fn, args2, node, want) {
        args2.forEach((a, i2) => {
          if (a.type === "SpreadElement") unsupported(a);
          if (i2 < fn.arity) this.value(a);
          else this.effect(a);
        });
        for (let i2 = args2.length; i2 < fn.arity; i2++) this.emit("PUSHNULL", []);
        this.at(node);
        this.emitFn("CALL", fn, fn.arity);
        this.result(1, want);
      }
      nativeCall(def, args2, node, want) {
        const name = node.callee.name || def.label || def.name;
        if (args2.length < def.min || args2.length > def.max)
          fail(node, name + "() takes " + range(def.min, def.max) + " argument" + (def.max === 1 ? "" : "s"));
        this.prog.use(def, node);
        let argc = 0;
        args2.forEach((a, i2) => {
          if (a.type === "SpreadElement") unsupported(a);
          if (i2 === 0 && def.parts) {
            let parts = concatParts(a, this);
            if (parts.length > MAX_PARTS) parts = [a];
            this.pushConst(parts.length);
            argc++;
            for (const p of parts) {
              this.value(p);
              argc++;
            }
          } else {
            this.value(a);
            argc++;
          }
        });
        if (argc > 255) fail(node, "too many arguments");
        this.at(node);
        this.emit("NCALL", [def.slot, argc], argc, def.returns ? 1 : 0);
        this.result(def.returns, want);
      }
      intrinsic(name, args2, node, want) {
        const x = this.prog.isa.intrinsics.find((i2) => i2.name === name);
        if (args2.length < x.min || args2.length > x.max)
          fail(node, name + "() takes " + range(x.min, x.max) + " argument" + (x.max === 1 ? "" : "s"));
        const argc = this.args(args2);
        this.at(node);
        this.emit("INTR", [x.id, argc], argc, 1);
        this.result(1, want);
      }
      builtinCall(name, args2, node, want) {
        switch (name) {
          case "parseInt":
            return this.intrinsic("parseInt", args2, node, want);
          case "deg":
            return fail(node, "deg() needs a number written in the code; at run time, divide by 360.0");
          case "rgb":
            return fail(node, "rgb() needs a colour written in the code, such as rgb(0xff8800); at run time, use the colour's number");
          case "Int32Array":
          case "Uint8Array":
          case "FixArray":
            return fail(node, "write new " + name + "(length)");
        }
        return fail(node, name + " is not a function");
      }
      mathCall(name, args2, node, want) {
        const one = (f) => {
          if (args2.length !== 1) fail(node, "Math." + name + "() takes 1 argument");
          return f();
        };
        const natives = this.prog.api.natives;
        switch (name) {
          case "floor":
            return this.nativeCall(natives.flr, args2, node, want);
          case "ceil":
            return this.nativeCall(natives.ceil, args2, node, want);
          case "round":
          case "trunc":
            return this.intrinsic(name, args2, node, want);
          case "abs":
            return this.nativeCall(natives.abs, args2, node, want);
          case "sign":
            return this.intrinsic("sign", args2, node, want);
          case "sqrt":
            return this.nativeCall(natives.sqrt, args2, node, want);
          case "pow":
            return this.intrinsic("pow", args2, node, want);
          case "min":
          case "max": {
            if (args2.length === 0) fail(node, "Math." + name + "() needs an argument");
            const def = natives[name];
            this.prog.use(def, node);
            this.value(args2[0]);
            for (let i2 = 1; i2 < args2.length; i2++) {
              this.value(args2[i2]);
              this.at(node);
              this.emit("NCALL", [def.slot, 2], 2, 1);
            }
            return this.result(1, want);
          }
          case "random":
            return fail(node, "Math.random is not supported; use rnd(), which repeats from a seed");
        }
        return fail(node, "Math." + name + " is not supported");
      }
      newExpression(node) {
        const c = node.callee;
        const ok = c.type === "Identifier" && (c.name === "Int32Array" || c.name === "Uint8Array" || c.name === "FixArray");
        const sym = ok ? this.resolve(c.name, c) : null;
        if (!sym || sym.kind !== "builtin")
          fail(node, "new is only for Int32Array, Uint8Array and FixArray; make records with { }");
        if (node.arguments.length !== 1 || node.arguments[0].type === "ArrayExpression")
          fail(node, "new " + c.name + "(length) takes just a length");
        this.value(node.arguments[0]);
        this.at(node);
        this.emit(c.name === "Int32Array" ? "NEWI32" : c.name === "FixArray" ? "NEWFXA" : "NEWU8", []);
      }
    };
    WRITES_ARGUMENTS = ["date", "mapobj"];
    Program = class {
      constructor(isa, api) {
        this.isa = isa;
        this.api = api;
        this.fns = [];
        this.files = [];
        this.byNs = /* @__PURE__ */ new Map();
        this.main = null;
        this.globals = [];
        this.strings = [];
        this.stringIndex = /* @__PURE__ */ new Map();
        this.shapes = [];
        this.shapeIndex = /* @__PURE__ */ new Map();
        this.sites = 0;
        this.version = 1;
        this.level = 0;
        this.errors = [];
        this.start = null;
      }
      error(e, file) {
        if (!(e instanceof CompileError)) throw e;
        const loc = e.node && e.node.loc ? e.node.loc.start : { line: 0, column: 0 };
        this.errors.push({
          file: file.name,
          line: loc.line,
          column: loc.column + 1,
          message: e.message
        });
      }
      guard(file, fn) {
        try {
          fn();
        } catch (e) {
          this.error(e, file);
        }
      }
      string(s) {
        let i2 = this.stringIndex.get(s);
        if (i2 === void 0) {
          if (this.strings.length >= 65535 - 1024)
            throw new Error("too many strings");
          i2 = this.strings.length;
          this.strings.push(s);
          this.stringIndex.set(s, i2);
        }
        return i2;
      }
      shape(keys) {
        const id = keys.join("\0");
        let i2 = this.shapeIndex.get(id);
        if (i2 === void 0) {
          i2 = this.shapes.length;
          this.shapes.push(keys.map((k) => this.string(k)));
          this.shapeIndex.set(id, i2);
        }
        return i2;
      }
      site() {
        if (this.sites >= 65535) throw new Error("too many property accesses");
        return this.sites++;
      }
      use(def, node) {
        if (LEVELS[def.level] > this.level)
          fail(node, (def.label || def.name) + "() needs the cart's music level to be " + MUSIC[LEVELS[def.level]]);
        if (def.version > this.version) this.version = def.version;
      }
      lookup(name, file) {
        let sym = file.scope.get(name);
        if (sym) return sym;
        if (file !== this.main && this.main) {
          sym = this.main.scope.get(name);
          if (sym) return sym;
        }
        if (this.byNs.has(name)) return { kind: "ns", file: this.byNs.get(name) };
        const api = this.api;
        if (api.consts[name])
          return { kind: "const", api: api.consts[name] };
        if (api.groups[name]) return { kind: "group", name };
        if (api.namespaces && api.namespaces[name])
          return { kind: "apins", name, def: api.natives[name] };
        if (api.natives[name]) return { kind: "native", def: api.natives[name] };
        if (BUILTINS.indexOf(name) >= 0) return { kind: "builtin", name };
        return null;
      }
      /* What a reserved name already is, for the error that refuses it */
      whatIs(name) {
        const api = this.api;
        if (this.byNs.has(name)) return "the name of the file " + name + ".js";
        if (api.namespaces && api.namespaces[name]) {
          const fns = Object.keys(api.namespaces[name]).sort().slice(0, 3);
          return "the " + name + " system (" + fns.map((n) => name + "." + n).join(", ") + ", ...)";
        }
        if (api.natives[name]) return "a built-in function";
        if (api.consts[name]) return "a built-in constant";
        if (api.groups[name]) return "a built-in group of constants";
        return "a built-in name";
      }
      reserved(name) {
        const api = this.api;
        return api.natives[name] || api.consts[name] || api.groups[name] || api.namespaces && api.namespaces[name] || BUILTINS.indexOf(name) >= 0 || this.byNs.has(name) || name in MISSING_GLOBALS;
      }
      constValue(sym) {
        if (sym.api) {
          if (sym.api.version > this.version) this.version = sym.api.version;
          return sym.api.value;
        }
        if (sym.state === 2) return sym.value;
        if (sym.state === 3) return 0;
        if (sym.state === 1) fail(sym.node, "const " + sym.name + " refers to itself");
        sym.state = 1;
        const v = this.fold(sym.node.init, new Scope3(this, sym.file, null));
        if (v === void 0) {
          sym.state = 3;
          fail(sym.node.init, "const " + sym.name + " needs a value known when compiling; use var");
        }
        sym.state = 2;
        sym.value = v;
        return v;
      }
      /* The constant value of node, or undefined. Never emits code. */
      fold(node, scope) {
        switch (node.type) {
          case "Literal":
            if (node.regex) return void 0;
            if (typeof node.value === "number" || typeof node.value === "bigint")
              return numLiteral(node);
            if (typeof node.value === "boolean") return node.value ? 1 : 0;
            return node.value;
          /* string or null */
          case "Identifier": {
            if (node.name === "undefined") {
              const s = scope.resolve(node.name, node);
              return s && s.kind === "builtin" ? null : void 0;
            }
            const sym = scope.resolve(node.name, node);
            if (!sym) return void 0;
            if (sym.kind === "const") return this.constValue(sym);
            if (sym.kind === "func") return { fn: sym.fn };
            return void 0;
          }
          case "MemberExpression": {
            if (node.computed || node.object.type !== "Identifier") return void 0;
            const base = scope.resolve(node.object.name, node.object);
            if (!base) return void 0;
            if (base.kind === "group") {
              const c = this.api.groups[base.name][node.property.name];
              if (!c) return void 0;
              if (c.version > this.version) this.version = c.version;
              return c.value;
            }
            if (base.kind === "ns") {
              const sym = base.file.scope.get(node.property.name);
              if (sym && sym.kind === "const") return this.constValue(sym);
              if (sym && sym.kind === "func") return { fn: sym.fn };
            }
            return void 0;
          }
          case "UnaryExpression": {
            if (node.operator === "typeof" || node.operator === "delete" || node.operator === "void")
              return void 0;
            const lit = node.argument;
            if (node.operator === "-" && lit.type === "Literal" && lit.value === 32768 && /[.]/.test(lit.raw))
              return fix(-2147483648);
            const v = this.fold(node.argument, scope);
            if (v === void 0) return void 0;
            if (node.operator === "!") return truthy2(v) ? 0 : 1;
            if (!isNum(v)) return void 0;
            if (node.operator === "-") return neg(v);
            if (node.operator === "~") return bnot(v);
            if (node.operator === "+" && node.argument.type === "Literal") return v;
            return void 0;
          }
          case "BinaryExpression": {
            if (!BINARY[node.operator]) return void 0;
            const a = this.fold(node.left, scope);
            if (a === void 0) return void 0;
            const b = this.fold(node.right, scope);
            if (b === void 0) return void 0;
            const op = node.operator;
            if (op === "==" || op === "===") return sameConst(a, b) ? 1 : 0;
            if (op === "!=" || op === "!==") return sameConst(a, b) ? 0 : 1;
            if (op === "+" && (typeof a === "string" || typeof b === "string"))
              return toStr(a) + toStr(b);
            if (isNum(a) && isNum(b)) return binary(op, a, b);
            return void 0;
          }
          case "LogicalExpression": {
            const a = this.fold(node.left, scope);
            if (a === void 0) return void 0;
            if (node.operator === "&&") return truthy2(a) ? this.fold(node.right, scope) : a;
            if (node.operator === "||") return truthy2(a) ? a : this.fold(node.right, scope);
            return void 0;
          }
          case "ConditionalExpression": {
            const t = this.fold(node.test, scope);
            if (t === void 0) return void 0;
            return this.fold(truthy2(t) ? node.consequent : node.alternate, scope);
          }
          case "CallExpression": {
            const c = node.callee;
            if (c.type !== "Identifier" || c.name !== "deg" && c.name !== "rgb") return void 0;
            const sym = scope.resolve(c.name, c);
            if (!sym || sym.kind !== "builtin") return void 0;
            if (node.arguments.length !== 1)
              fail(node, c.name + "() takes 1 argument");
            const x = this.number(node.arguments[0], scope);
            if (x === void 0) return void 0;
            if (c.name === "rgb") return nearestColour(this.palette || DEFAULT_RGB, x | 0);
            return fromReal(x / 360);
          }
        }
        return void 0;
      }
      /* deg() takes a literal, negated or not, or a constant. */
      number(node, scope) {
        if (node.type === "Literal" && typeof node.value === "number") return node.value;
        if (node.type === "Literal") return void 0;
        if (node.type === "UnaryExpression" && node.operator === "-") {
          const v2 = this.number(node.argument, scope);
          return v2 === void 0 ? void 0 : -v2;
        }
        const v = this.fold(node, scope);
        if (isFix(v)) return v.raw / 65536;
        return typeof v === "number" ? v : void 0;
      }
      functionExpression(node, outer, file) {
        const name = node.id ? node.id.name : (outer ? outer.name + "." : "") + "function@" + node.loc.start.line;
        const fn = new Fn(this, file, name, node, outer);
        fn.compileBody();
        return fn;
      }
      /* Pass 1: every file's top-level names. */
      declare(file) {
        const scope = file.scope;
        const self = this;
        function claim(id, node) {
          const name = id.name;
          if (scope.has(name))
            fail(id, name + " is declared twice in " + file.name);
          if (self.reserved(name))
            fail(id, name + " is " + self.whatIs(name) + "; choose another name for a global (a local or parameter may reuse it)");
        }
        for (const s of file.ast.body) {
          this.guard(file, () => {
            switch (s.type) {
              case "FunctionDeclaration": {
                claim(s.id, s);
                const name = (file.ns ? file.ns + "." : "") + s.id.name;
                const fn = new Fn(this, file, name, s, null);
                scope.set(s.id.name, { kind: "func", fn });
                return;
              }
              case "VariableDeclaration":
                if (s.kind === "let") fail(s, "let is not supported; use var");
                for (const d of s.declarations) {
                  if (d.id.type !== "Identifier") unsupported(d.id);
                  claim(d.id, d);
                  if (s.kind === "const") {
                    if (!d.init) fail(d, "const " + d.id.name + " needs a value");
                    scope.set(d.id.name, {
                      kind: "const",
                      name: d.id.name,
                      node: d,
                      file,
                      state: 0
                    });
                  } else {
                    if (this.globals.length >= 65535) fail(d, "too many globals");
                    const g = {
                      kind: "global",
                      slot: this.globals.length,
                      name: (file.ns ? file.ns + "." : "") + d.id.name,
                      node: d,
                      file,
                      value: null
                    };
                    this.globals.push(g);
                    scope.set(d.id.name, g);
                  }
                }
                return;
              case "EmptyStatement":
                return;
              case "ExpressionStatement":
                if (s.directive) return;
                break;
            }
            if (UNSUPPORTED[s.type]) unsupported(s);
            fail(s, "only declarations can be at the top level of a file; put code that runs once in init()");
          });
        }
      }
      /* Pass 2: constants, then globals' initial values. Those not known
       * when compiling are computed by $start, in file order, before init(). */
      initialise() {
        for (const file of this.files)
          for (const sym of file.scope.values())
            if (sym.kind === "const")
              this.guard(file, () => this.constValue(sym));
        for (const g of this.globals) {
          if (!g.node) continue;
          const init = g.node.init;
          if (!init) continue;
          this.guard(g.file, () => {
            if (init.type === "FunctionExpression") {
              const fn = new Fn(this, g.file, g.name, init, null);
              fn.compileBody();
              g.value = { fn };
              return;
            }
            const top = new Scope3(this, g.file, null);
            const v = this.fold(init, top);
            if (v !== void 0) {
              if (typeof v === "string") this.string(v);
              g.value = v;
              return;
            }
            if (!this.start) {
              this.start = new Fn(this, g.file, "$start", null, null);
            }
            const st = this.start;
            st.file = g.file;
            st.at(g.node);
            st.value(init);
            st.emit("STG", [g.slot]);
          });
        }
        if (this.start) this.start.emit("RETNULL", []);
      }
      entry(name, required) {
        const sym = this.main.scope.get(name);
        if (sym && sym.kind === "func") return sym.fn;
        if (sym)
          this.errors.push({
            file: "main.js",
            line: sym.node.loc.start.line,
            column: 1,
            message: name + " must be a function"
          });
        else if (required)
          this.errors.push({
            file: "main.js",
            line: 1,
            column: 1,
            message: "main.js needs function " + name + "()"
          });
        return null;
      }
    };
    META_TAGS = { name: 1, author: 2, version: 3, help: 4 };
    FORMATS = ["number", "time", "ticks"];
    OPT_TYPES = ["choice", "onoff", "number"];
    CART_KEYS = [
      "id",
      "name",
      "author",
      "version",
      "help",
      "rate",
      "menu_button",
      "music",
      "suspend",
      "boards",
      "options",
      "achievements",
      "flags",
      "lazy_images"
    ];
    BOARD_KEYS = ["name", "title", "wins", "format", "version"];
    OPTION_KEYS = [
      "name",
      "title",
      "type",
      "choices",
      "min",
      "max",
      "step",
      "default",
      "help"
    ];
    NAME2 = /^[A-Za-z_][A-Za-z0-9_]*$/;
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/node.js
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
function loadDefs() {
  if (!defs) {
    const built = globalThis.arcadeDefs;
    const text2 = (name) => built ? built[name] : fs.readFileSync(path.join(engine, name), "utf8");
    defs = {
      isa: parseOpcodes(text2("opcodes.def")),
      api: parseApi(text2("arcade_api.def"))
    };
  }
  return defs;
}
function deflate(bytes) {
  return new Uint8Array(zlib.deflateRawSync(bytes, { level: 9 }));
}
function compileFiles(files, assets) {
  const d = loadDefs();
  return compile({
    files,
    assets,
    isa: d.isa,
    api: d.api,
    deflate,
    inflate: (z) => new Uint8Array(zlib.inflateSync(z))
  });
}
function readFolder(dir) {
  const files = {};
  for (const name of fs.readdirSync(dir)) {
    if (/\.js$/.test(name) || name === "cart.json")
      files[name] = fs.readFileSync(path.join(dir, name), "utf8");
  }
  return files;
}
function readAssets(dir) {
  const at2 = (...p) => path.join(dir, ...p);
  const some = (sub, ext, binary2) => {
    const out = {};
    if (!fs.existsSync(at2(sub))) return out;
    for (const name of fs.readdirSync(at2(sub)))
      if (name.endsWith(ext))
        out[name.slice(0, -ext.length)] = binary2 ? new Uint8Array(fs.readFileSync(at2(sub, name))) : fs.readFileSync(at2(sub, name), "utf8");
    return out;
  };
  return {
    sheet: fs.existsSync(at2("sheet.png")) ? new Uint8Array(fs.readFileSync(at2("sheet.png"))) : void 0,
    logo: fs.existsSync(at2("logo.png")) ? new Uint8Array(fs.readFileSync(at2("logo.png"))) : void 0,
    flags: fs.existsSync(at2("flags.json")) ? fs.readFileSync(at2("flags.json"), "utf8") : void 0,
    objects: fs.existsSync(at2("objects.json")) ? fs.readFileSync(at2("objects.json"), "utf8") : void 0,
    palettes: some("palettes", ".gpl", false),
    maps: some("maps", ".json", false),
    images: some("images", ".png", true),
    sounds: some("sounds", ".json", false),
    data: some("data", ".json", false),
    texts: some("data", ".txt", false),
    fonts: some("fonts", ".bdf", false),
    editors: some("editors", ".html", false)
  };
}
var here, engine, defs;
var init_node = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/node.js"() {
    init_defs();
    init_compiler();
    here = path.dirname(fileURLToPath(import.meta.url));
    engine = path.resolve(here, "../../../apps-ipod/games/arcade");
    defs = null;
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/bytecode.js
function load(bytes) {
  const { chunks } = readCart(bytes);
  for (const t of ["PBG1", "CODE", "CNST", "GLOB"])
    if (!chunks[t]) throw new Error("no " + t + " chunk");
  let r = new Reader(chunks.PBG1);
  const header2 = {
    format: r.u16(),
    api: r.u16(),
    rate: r.u8(),
    menuButton: r.u8(),
    music: r.u8()
  };
  r.u8();
  header2.memory = r.u32();
  header2.id = Array.from(
    chunks.PBG1.subarray(r.at, r.at + 8),
    (x) => x.toString(16).padStart(2, "0")
  ).join("");
  r = new Reader(chunks.CODE);
  const nfns = r.u16();
  const sites = r.u16();
  const entries = { start: r.u16(), init: r.u16(), update: r.u16(), draw: r.u16() };
  if (header2.format >= 2) entries.ending = r.u16();
  const fns = [];
  for (let i2 = 0; i2 < nfns; i2++)
    fns.push({
      arity: r.u8(),
      nlocals: r.u8(),
      maxstack: r.u16(),
      offset: r.u32(),
      length: r.u32()
    });
  const base = r.at;
  for (const f of fns) {
    if (base + f.offset + f.length > chunks.CODE.length)
      throw new Error("function code runs past CODE");
    f.code = chunks.CODE.subarray(base + f.offset, base + f.offset + f.length);
  }
  r = new Reader(chunks.CNST);
  const strings = [];
  for (let n = r.u16(); n > 0; n--) strings.push(r.str());
  const shapes = [];
  for (let n = r.u16(); n > 0; n--) {
    const keys = [];
    for (let k = r.u8(); k > 0; k--) keys.push(r.u16());
    shapes.push(keys);
  }
  r = new Reader(chunks.GLOB);
  const globals2 = [];
  for (let n = r.u16(); n > 0; n--) {
    const tag = r.u8();
    if (tag === 0) globals2.push({ tag: "null" });
    else if (tag === 1) globals2.push({ tag: "int", value: r.s32() });
    else if (tag === 2) globals2.push({ tag: "str", value: r.u16() });
    else if (tag === 3) globals2.push({ tag: "fn", value: r.u16() });
    else if (tag === 4) globals2.push({ tag: "fix", value: r.s32() });
    else if (tag === 5) globals2.push({ tag: "img", value: r.u16() });
    else throw new Error("global with unknown tag " + tag);
  }
  let names = null;
  if (chunks.LINE) {
    r = new Reader(chunks.LINE);
    const files = [];
    for (let n = r.u16(); n > 0; n--) files.push(r.str());
    const gnames = [];
    for (let n = r.u16(); n > 0; n--) gnames.push(r.str());
    for (const f of fns) {
      f.name = r.str();
      f.file = files[r.u8()];
      f.lines = [];
      for (let n = r.u16(); n > 0; n--) f.lines.push([r.u16(), r.u16()]);
    }
    names = { files, globals: gnames };
  }
  return {
    header: header2,
    sites,
    entries,
    fns,
    strings,
    shapes,
    globals: globals2,
    names
  };
}
function decode(isa, code2, pc) {
  const op = isa.ops[code2[pc]];
  if (!op) throw new Error("unknown opcode " + code2[pc] + " at " + pc);
  if (pc + op.size > code2.length) throw new Error(op.name + " runs past the end at " + pc);
  const args2 = [];
  let at2 = pc + 1;
  for (const k of op.operands) {
    switch (k) {
      case "b":
        args2.push(code2[at2] << 24 >> 24);
        at2 += 1;
        break;
      case "B":
        args2.push(code2[at2]);
        at2 += 1;
        break;
      case "h":
        args2.push((code2[at2] | code2[at2 + 1] << 8) << 16 >> 16);
        at2 += 2;
        break;
      case "H":
        args2.push(code2[at2] | code2[at2 + 1] << 8);
        at2 += 2;
        break;
      case "i":
        args2.push(code2[at2] | code2[at2 + 1] << 8 | code2[at2 + 2] << 16 | code2[at2 + 3] << 24);
        at2 += 4;
        break;
    }
  }
  return { op, args: args2, next: at2 };
}
function effect(prog, api, ins) {
  const name = ins.op.name;
  switch (name) {
    case "CALL": {
      const f = prog.fns[ins.args[0]];
      if (!f) throw new Error("CALL of function " + ins.args[0] + ", which does not exist");
      return [f.arity, 1];
    }
    case "CALLV":
      return [ins.args[0] + 1, 1];
    case "NCALL": {
      const n = api.bySlot[ins.args[0]];
      if (!n) throw new Error("native slot " + ins.args[0] + " is not in this API");
      const argc = ins.args[1];
      if (n.parts) {
        if (argc < 1) throw new Error(n.name + " with no parts count");
      } else if (argc < n.min || argc > n.max)
        throw new Error(n.name + " called with " + argc + " arguments");
      return [argc, n.returns ? 1 : 0];
    }
    case "NEWARR":
      return [ins.args[0], 1];
    case "NEWOBJ": {
      const s = prog.shapes[ins.args[0]];
      if (!s) throw new Error("shape " + ins.args[0] + " does not exist");
      return [s.length, 1];
    }
    case "METHOD":
      return [ins.args[1] + 1, 1];
    case "INTR":
      return [ins.args[1], 1];
  }
  return [ins.op.pops, ins.op.pushes];
}
function verify(isa, api, prog) {
  const n = prog.fns.length;
  for (const k in prog.entries) {
    const e = prog.entries[k];
    if (e !== NONE && e >= n) throw new Error("entry " + k + " is not a function");
  }
  for (const g of prog.globals) {
    if (g.tag === "str" && g.value >= prog.strings.length) throw new Error("global string out of range");
    if (g.tag === "fn" && g.value >= n) throw new Error("global function out of range");
  }
  for (const s of prog.shapes)
    for (const k of s) if (k >= prog.strings.length) throw new Error("shape key out of range");
  prog.fns.forEach((f, fi) => {
    try {
      verifyFn(isa, api, prog, f);
    } catch (e) {
      throw new Error("function " + (f.name || fi) + ": " + e.message);
    }
  });
}
function verifyFn(isa, api, prog, f) {
  const code2 = f.code;
  if (f.arity > f.nlocals) throw new Error("more parameters than locals");
  const start = new Uint8Array(code2.length + 1);
  const ins = [];
  for (let pc = 0; pc < code2.length; ) {
    start[pc] = 1;
    const d = decode(isa, code2, pc);
    d.pc = pc;
    ins[pc] = d;
    pc = d.next;
  }
  for (const d of ins) {
    if (!d) continue;
    const a = d.args;
    switch (d.op.name) {
      case "LDL":
      case "STL":
      case "INCL":
        if (a[0] >= f.nlocals) throw new Error("local " + a[0] + " out of range at " + d.pc);
        break;
      case "LDG":
      case "STG":
        if (a[0] >= prog.globals.length) throw new Error("global out of range at " + d.pc);
        break;
      case "GETGL":
        if (a[0] >= prog.globals.length || a[1] >= f.nlocals)
          throw new Error("global or local out of range at " + d.pc);
        break;
      case "GETGP":
        if (a[0] >= prog.globals.length || a[1] >= prog.strings.length || a[2] >= prog.sites)
          throw new Error("global or property out of range at " + d.pc);
        break;
      case "JLTLI":
      case "JLELI":
      case "JGTLI":
      case "JGELI":
        if (a[0] >= f.nlocals) throw new Error("local " + a[0] + " out of range at " + d.pc);
        break;
      case "PUSHS":
        if (a[0] >= prog.strings.length) throw new Error("string out of range at " + d.pc);
        break;
      case "PUSHFN":
        if (a[0] >= prog.fns.length) throw new Error("function out of range at " + d.pc);
        break;
      case "GETPROP":
      case "SETPROP":
        if (a[0] >= prog.strings.length || a[1] >= prog.sites)
          throw new Error("property operand out of range at " + d.pc);
        break;
      case "METHOD": {
        const m = isa.methods[a[0]];
        if (!m || a[1] < m.min || a[1] > m.max)
          throw new Error("method or its arguments out of range at " + d.pc);
        break;
      }
      case "INTR": {
        const x = isa.intrinsics[a[0]];
        if (!x || a[1] < x.min || a[1] > x.max)
          throw new Error("intrinsic or its arguments out of range at " + d.pc);
        break;
      }
    }
    if (JUMPS[d.op.name]) {
      const t = target(d);
      if (t < 0 || t >= code2.length || !start[t])
        throw new Error("jump at " + d.pc + " lands mid-instruction or outside");
    }
  }
  const height = new Int32Array(code2.length).fill(-1);
  const work = [[0, 0]];
  let max = 0;
  function reach(pc, h) {
    if (pc >= code2.length) throw new Error("falls off the end");
    if (height[pc] === -1) {
      height[pc] = h;
      work.push([pc, h]);
    } else if (height[pc] !== h)
      throw new Error("stack height " + h + " and " + height[pc] + " meet at " + pc);
  }
  height[0] = 0;
  while (work.length) {
    const [pc, h] = work.pop();
    const d = ins[pc];
    const [pops, pushes] = effect(prog, api, d);
    if (h < pops) throw new Error(d.op.name + " at " + pc + " pops an empty stack");
    const name = d.op.name;
    if (name === "RET" || name === "RETNULL") {
      if (h - pops !== 0) throw new Error("returns with " + (h - pops) + " left on the stack at " + pc);
      continue;
    }
    const after = h - pops + pushes;
    if (after > max) max = after;
    if (JUMPS[name]) {
      const t = target(d);
      reach(t, name === "ANDJ" || name === "ORJ" ? h : after);
      if (name !== "JMP") reach(d.next, after);
    } else reach(d.next, after);
  }
  if (max > f.maxstack)
    throw new Error("needs " + max + " stack slots, declares " + f.maxstack);
}
function disassemble(isa, api, prog) {
  const out = [];
  const names = prog.fns.map((f, i2) => f.name || "fn" + i2);
  prog.fns.forEach((f, fi) => {
    out.push("");
    out.push("function " + fi + " " + names[fi] + "  arity " + f.arity + "  locals " + f.nlocals + "  stack " + f.maxstack);
    const lines2 = new Map(f.lines || []);
    for (let pc = 0; pc < f.code.length; ) {
      const d = decode(isa, f.code, pc);
      let text2 = d.op.name;
      const a = d.args;
      switch (d.op.name) {
        case "PUSHS":
          text2 += " " + JSON.stringify(prog.strings[a[0]]);
          break;
        case "PUSHF":
          text2 += " " + a[0] / 65536;
          break;
        case "PUSHFN":
        case "CALL":
          text2 += " " + names[a[0]];
          break;
        case "NCALL":
          text2 += " " + (api.bySlot[a[0]] || { name: "?" + a[0] }).name + " " + a[1];
          break;
        case "GETPROP":
        case "SETPROP":
          text2 += " ." + prog.strings[a[0]];
          break;
        case "GETGP":
          text2 += " " + a[0] + " ." + prog.strings[a[1]];
          break;
        case "METHOD":
          text2 += " ." + isa.methods[a[0]].name + " " + a[1];
          break;
        case "INTR":
          text2 += " " + isa.intrinsics[a[0]].name + " " + a[1];
          break;
        case "NEWOBJ":
          text2 += " {" + prog.shapes[a[0]].map((k) => prog.strings[k]).join(",") + "}";
          break;
        default:
          if (JUMPS[d.op.name])
            text2 += (a.length > 1 ? " " + a.slice(0, -1).join(" ") : "") + " -> " + target(d);
          else if (a.length) text2 += " " + a.join(" ");
      }
      const ln = lines2.has(pc) ? String(lines2.get(pc)).padStart(5) : "     ";
      out.push(ln + "  " + String(pc).padStart(5) + "  " + text2);
      pc = d.next;
    }
  });
  return out.join("\n").slice(1);
}
var Reader, NONE, JUMPS, target;
var init_bytecode = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/bytecode.js"() {
    init_cart();
    Reader = class {
      constructor(bytes) {
        this.b = bytes;
        this.at = 0;
      }
      need(n) {
        if (this.at + n > this.b.length) throw new Error("chunk too short");
      }
      u8() {
        this.need(1);
        return this.b[this.at++];
      }
      u16() {
        this.need(2);
        const v = this.b[this.at] | this.b[this.at + 1] << 8;
        this.at += 2;
        return v;
      }
      u32() {
        const lo = this.u16();
        return (lo | this.u16() << 16) >>> 0;
      }
      s32() {
        return this.u32() | 0;
      }
      str() {
        const n = this.u16();
        this.need(n);
        const s = new TextDecoder().decode(this.b.subarray(this.at, this.at + n));
        this.at += n;
        return s;
      }
    };
    NONE = 65535;
    JUMPS = {
      JMP: 1,
      JF: 1,
      JT: 1,
      ANDJ: 1,
      ORJ: 1,
      JLT: 1,
      JLE: 1,
      JGT: 1,
      JGE: 1,
      JEQ: 1,
      JNE: 1,
      JLTLI: 1,
      JLELI: 1,
      JGTLI: 1,
      JGELI: 1
    };
    target = (d) => d.next + d.args[d.args.length - 1];
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/webpage.js
function musicCalls(cart, isa, api) {
  const prog = load(cart);
  const found = /* @__PURE__ */ new Set();
  for (const f of prog.fns) {
    for (let pc = 0; pc < f.code.length; ) {
      const d = decode(isa, f.code, pc);
      if (d.op.name === "NCALL") {
        const n = api.bySlot[d.args[0]];
        if (n && MUSIC2.test(n.label || "") && !NOT_MUSIC.has(n.label)) found.add(n.label + "()");
      }
      pc = d.next;
    }
  }
  return [...found].sort();
}
function musicRefusal(name, calls) {
  return name + " cannot be exported as a web page: it uses the owner's music (" + calls.slice(0, 3).join(", ") + (calls.length > 3 ? " and " + (calls.length - 3) + " more" : "") + "), and a web page has none";
}
function needsWorld(files) {
  for (const [name, v] of Object.entries(files)) {
    if (!/\.(js|json|txt)$/.test(name)) continue;
    const s = typeof v === "string" ? v : new TextDecoder().decode(v);
    for (const ch of s) if (ch.codePointAt(0) >= 12288) return true;
  }
  return false;
}
function base64(bytes) {
  let s = "";
  for (let i2 = 0; i2 < bytes.length; i2 += 32768)
    s += String.fromCharCode.apply(null, bytes.subarray(i2, i2 + 32768));
  return btoa(s);
}
function webPage(o) {
  if (!WHEELS.includes(o.wheel)) throw new Error("wheel must be one of " + WHEELS.join(", "));
  if (!SCALES.includes(String(o.scale))) throw new Error("scale must be one of " + SCALES.join(", "));
  const meta2 = o.meta || {};
  const data2 = {
    name: meta2.name || "Game",
    id: meta2.id || "",
    help: meta2.help || "",
    options: meta2.options || [],
    wheel: o.wheel,
    scale: String(o.scale),
    source: SOURCE,
    cart: base64(o.cart),
    wasm: base64(o.wasmGz),
    font: o.fontGz ? base64(o.fontGz) : null
  };
  const json = JSON.stringify(data2).replace(/</g, "\\u003c");
  const script = o.script.replace(/<\/script/gi, "<\\/script");
  return o.template.replace("<title></title>", () => "<title>" + html(data2.name) + "</title>").replace('<a id="source"', () => '<a id="source" href="' + SOURCE + '"').replace(
    '<script id="cart-data" type="application/json"></script>',
    () => '<script id="cart-data" type="application/json">' + json + "</script>"
  ).replace("<script>/*SCRIPT*/</script>", () => "<script>" + script + "</script>");
}
var SOURCE, WHEELS, SCALES, MUSIC2, NOT_MUSIC, html;
var init_webpage = __esm({
  "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/src/webpage.js"() {
    init_bytecode();
    SOURCE = "https://github.com/anthonyfletcher/podbox#credits-and-licence";
    WHEELS = ["touch", "always", "never"];
    SCALES = ["fit", "whole", "1", "2", "3", "4"];
    MUSIC2 = /^(playback|beat|tracks)\./;
    NOT_MUSIC = /* @__PURE__ */ new Set(["playback.colors"]);
    html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});

// player:./web/bundle.js
var bundle_exports = {};
__export(bundle_exports, {
  playerParts: () => playerParts
});
import fs2 from "node:fs";
async function playerParts() {
  return JSON.parse(fs2.readFileSync(new URL("./player.json", import.meta.url), "utf8"));
}
var init_bundle = __esm({
  "player:./web/bundle.js"() {
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/pbgc.js
var pbgc_exports = {};
import fs3 from "node:fs";
import path2 from "node:path";
import zlib2 from "node:zlib";
function usage() {
  console.error("usage: pbgc new <folder> <name>\n       pbgc build <folder> [-o file.pbg]\n       pbgc pack <folder> [-o file.pbg]\n       pbgc unpack <file.pbg> <folder>\n       pbgc copy <folder|file.pbg> <folder> [name]\n       pbgc dis <file.pbg>\n       pbgc html <folder|file.pbg> [-o file.html] [--wheel touch|always|never]\n                 [--scale fit|whole|1|2|3|4] [--font font.bin]");
  process.exit(2);
}
function cmdNew(dir, name) {
  if (!dir || !name) usage();
  if (fs3.existsSync(dir)) {
    console.error(dir + " already exists");
    process.exit(1);
  }
  fs3.mkdirSync(dir, { recursive: true });
  const cart = {
    id: newCartId(),
    name,
    author: "",
    version: "1",
    rate: 33
  };
  fs3.writeFileSync(path2.join(dir, "cart.json"), JSON.stringify(cart, null, 2) + "\n");
  fs3.writeFileSync(path2.join(dir, "main.js"), MAIN);
  console.log("made " + dir);
}
function cmdBuild(dir, out) {
  if (!dir) usage();
  const res = compileFiles(readFolder(dir), readAssets(dir));
  if (res.errors.length) {
    for (const e of res.errors)
      console.error(path2.join(dir, e.file) + ":" + e.line + ":" + e.column + ": " + e.message);
    process.exit(1);
  }
  const file = out || dir.replace(/[\\/]+$/, "") + ".pbg";
  const d = loadDefs();
  verify(d.isa, d.api, load(res.cart));
  fs3.writeFileSync(file, res.cart);
  const s = res.stats;
  console.log(file + ": " + s.size + " bytes, " + s.functions + " functions (" + s.dropped + " unused dropped), " + s.code + " bytes of code, " + s.globals + " globals, API " + s.api);
}
function freshDir(dir) {
  if (fs3.existsSync(dir) && fs3.readdirSync(dir).length) {
    console.error(dir + " is not empty");
    process.exit(1);
  }
}
function cmdUnpack(file, dir) {
  if (!file || !dir) usage();
  freshDir(dir);
  const files = unpackCart(
    new Uint8Array(fs3.readFileSync(file)),
    (b) => new Uint8Array(zlib2.inflateRawSync(b)),
    (b) => new Uint8Array(zlib2.deflateSync(b, { level: 9 }))
  );
  const root = path2.resolve(dir);
  const names = Object.keys(files).sort();
  const paths = names.map((name) => {
    const to = path2.resolve(root, ...name.split("/"));
    if (!to.startsWith(root + path2.sep))
      throw new Error("the cart names a file outside " + dir + ": " + name);
    return to;
  });
  names.forEach((name, i2) => {
    fs3.mkdirSync(path2.dirname(paths[i2]), { recursive: true });
    fs3.writeFileSync(paths[i2], files[name]);
  });
  console.log(dir + ": " + Object.keys(files).length + " files");
}
function cmdCopy(src, dir, name) {
  if (!src || !dir) usage();
  freshDir(dir);
  if (fs3.statSync(src).isDirectory()) {
    if (!fs3.existsSync(path2.join(src, "cart.json"))) {
      console.error(src + " has no cart.json");
      process.exit(1);
    }
    fs3.cpSync(src, dir, { recursive: true });
  } else
    cmdUnpack(src, dir);
  const at2 = path2.join(dir, "cart.json");
  const text2 = asNewGame(fs3.readFileSync(at2, "utf8"), name);
  fs3.writeFileSync(at2, text2);
  const c = JSON.parse(text2);
  console.log(dir + ": " + c.name + ", a new game, id " + c.id);
}
function cmdDis(file) {
  if (!file) usage();
  const d = loadDefs();
  const prog = load(new Uint8Array(fs3.readFileSync(file)));
  verify(d.isa, d.api, prog);
  console.log(disassemble(d.isa, d.api, prog));
}
async function cmdHtml(src, out, wheel, scale, fontFile) {
  if (!src) usage();
  let cart, files;
  if (/\.pbg$/i.test(src)) {
    cart = new Uint8Array(fs3.readFileSync(src));
    files = unpackCart(
      cart,
      (b) => new Uint8Array(zlib2.inflateRawSync(b)),
      (b) => new Uint8Array(zlib2.deflateSync(b, { level: 9 }))
    );
  } else {
    files = readFolder(src);
    const res = compileFiles(files, readAssets(src));
    if (res.errors.length) {
      for (const e of res.errors)
        console.error(path2.join(src, e.file) + ":" + e.line + ":" + e.column + ": " + e.message);
      process.exit(1);
    }
    cart = res.cart;
  }
  const d = loadDefs();
  verify(d.isa, d.api, load(cart));
  const music = musicCalls(cart, d.isa, d.api);
  if (music.length) {
    console.error("pbgc: " + musicRefusal(src, music));
    process.exit(1);
  }
  if (!WHEELS.includes(wheel)) usage();
  if (!SCALES.includes(scale)) usage();
  const meta2 = JSON.parse(typeof files["cart.json"] === "string" ? files["cart.json"] : new TextDecoder().decode(files["cart.json"]));
  if (!fontFile && needsWorld(files))
    console.error("pbgc: warning: the cart has kana, Hangul or ideographs, which draw as ? without --font font.bin");
  const { playerParts: playerParts2 } = await Promise.resolve().then(() => (init_bundle(), bundle_exports));
  const parts = await playerParts2();
  const wasm = fs3.readFileSync(new URL("./wasm/arcade.wasm", import.meta.url));
  const page = webPage({
    template: parts.template,
    script: parts.script,
    cart,
    wasmGz: zlib2.gzipSync(wasm, { level: 9 }),
    fontGz: fontFile ? zlib2.gzipSync(fs3.readFileSync(fontFile), { level: 9 }) : null,
    meta: meta2,
    wheel,
    scale
  });
  const file = out || src.replace(/[\\/]+$/, "").replace(/\.pbg$/i, "") + ".html";
  fs3.writeFileSync(file, page);
  console.log(file + ": " + Math.round(page.length / 1024) + " KB");
}
var MAIN, argv;
var init_pbgc = __esm({
  async "../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/sdk/pbgc.js"() {
    init_folder();
    init_node();
    init_unpack();
    init_bytecode();
    init_webpage();
    MAIN = `function init() {
}

function update() {
}

function draw() {
    cls(1);
    print("hello", 44, 56, 7);
}
`;
    argv = process.argv.slice(2);
    try {
      switch (argv[0]) {
        case "new":
          cmdNew(argv[1], argv[2]);
          break;
        case "build":
        case "pack": {
          const o = argv.indexOf("-o");
          cmdBuild(argv[1], o > 0 ? argv[o + 1] : null);
          break;
        }
        case "unpack":
          cmdUnpack(argv[1], argv[2]);
          break;
        case "copy":
          cmdCopy(argv[1], argv[2], argv[3]);
          break;
        case "dis":
          cmdDis(argv[1]);
          break;
        case "html": {
          const opt = (k, v) => {
            const i2 = argv.indexOf(k);
            return i2 > 0 ? argv[i2 + 1] : v;
          };
          await cmdHtml(
            argv[1],
            opt("-o", null),
            opt("--wheel", "touch"),
            opt("--scale", "fit"),
            opt("--font", null)
          );
          break;
        }
        default:
          usage();
      }
    } catch (e) {
      console.error("pbgc: " + e.message);
      process.exit(1);
    }
  }
});

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/apps-ipod/games/arcade/opcodes.def
var opcodes_default = `/* GNU General Public License (version 2+)
 *
 * Arcade bytecode: the one list of instructions, read by the VM and the
 * verifier as an X-macro and by the compiler (arcade/sdk) as text.
 *
 *   OP(name, operands, pops, pushes)
 *
 * An opcode's number is its position in this list. Operands follow the
 * opcode byte, little-endian and unaligned: b s8, B u8, h s16, H u16,
 * i s32. A jump's s16 is its last operand, relative to the end of its
 * instruction. A pop or push of -1 depends on an operand; the verifier
 * and the compiler both work it out the same way:
 *
 *   CALL    pops the callee's arity, pushes 1
 *   CALLV   pops argc + 1 (the function value under its arguments), pushes 1
 *   NCALL   pops argc, pushes 1 if the native returns a value, else 0
 *   NEWARR  pops n, pushes 1
 *   NEWOBJ  pops the shape's key count, pushes 1
 *   METHOD  pops argc + 1 (the receiver under its arguments), pushes 1
 *   INTR    pops argc, pushes 1
 *
 * A conditional jump's pops and pushes are its fall-through; ANDJ and ORJ
 * arrive at their target with the operand still on the stack.
 *
 * Opcodes are only ever appended: a cart's bytes name them by number. */

OP(NOP,      "",     0, 0)
OP(POP,      "",     1, 0)
OP(DUP,      "",     1, 2)
OP(DUP2,     "",     2, 4)   /* a b -> a b a b */
OP(PUSHNULL, "",     0, 1)
OP(PUSHI8,   "b",    0, 1)
OP(PUSHI16,  "h",    0, 1)
OP(PUSHI32,  "i",    0, 1)
OP(PUSHS,    "H",    0, 1)   /* string constant */
OP(PUSHFN,   "H",    0, 1)   /* function reference */
OP(LDL,      "B",    0, 1)
OP(STL,      "B",    1, 0)
OP(LDG,      "H",    0, 1)
OP(STG,      "H",    1, 0)
OP(INCL,     "Bb",   0, 0)   /* local = local + imm, as ADD */

OP(ADD,      "",     2, 1)   /* integers add; a string either side joins */
OP(SUB,      "",     2, 1)
OP(MUL,      "",     2, 1)
OP(DIV,      "",     2, 1)   /* truncates; by zero is a runtime error */
OP(MOD,      "",     2, 1)
OP(NEG,      "",     1, 1)
OP(BAND,     "",     2, 1)
OP(BOR,      "",     2, 1)
OP(BXOR,     "",     2, 1)
OP(BNOT,     "",     1, 1)
OP(SHL,      "",     2, 1)   /* counts are taken & 31, as JS */
OP(SHR,      "",     2, 1)
OP(USHR,     "",     2, 1)
OP(EQ,       "",     2, 1)   /* strict: an integer never equals a string */
OP(NE,       "",     2, 1)
OP(LT,       "",     2, 1)   /* integers, or two strings by byte order */
OP(LE,       "",     2, 1)
OP(GT,       "",     2, 1)
OP(GE,       "",     2, 1)
OP(NOT,      "",     1, 1)
OP(TYPEOF,   "",     1, 1)

OP(JMP,      "h",    0, 0)
OP(JF,       "h",    1, 0)   /* pop; jump if falsy */
OP(JT,       "h",    1, 0)   /* pop; jump if truthy */
OP(ANDJ,     "h",    1, 0)   /* falsy: keep it and jump; else pop it */
OP(ORJ,      "h",    1, 0)   /* truthy: keep it and jump; else pop it */

OP(CALL,     "H",   -1, 1)   /* function index */
OP(CALLV,    "B",   -1, 1)   /* argc */
OP(NCALL,    "HB",  -1, -1)  /* native slot, argc */
OP(RET,      "",     1, 0)
OP(RETNULL,  "",     0, 0)

OP(NEWARR,   "H",   -1, 1)   /* element count */
OP(NEWI32,   "",     1, 1)   /* length -> Int32Array */
OP(NEWU8,    "",     1, 1)   /* length -> Uint8Array */
OP(NEWOBJ,   "H",   -1, 1)   /* shape */
OP(GETIDX,   "",     2, 1)   /* container index -> value */
OP(SETIDX,   "",     3, 0)   /* container index value -> */
OP(GETPROP,  "HH",   1, 1)   /* key string, inline-cache site */
OP(SETPROP,  "HH",   2, 0)   /* object value -> */
OP(LEN,      "",     1, 1)
OP(METHOD,   "BB",  -1, 1)   /* method, argc */
OP(INTR,     "BB",  -1, 1)   /* intrinsic, argc */
OP(PUSHF,    "i",    0, 1)   /* a fraction: 16.16 */
/* Compare and jump in one: pop two, jump if the comparison holds. A loop's
 * test or an if's is one dispatch instead of two. */
OP(JLT,      "h",    2, 0)
OP(JLE,      "h",    2, 0)
OP(JGT,      "h",    2, 0)
OP(JGE,      "h",    2, 0)
OP(JEQ,      "h",    2, 0)
OP(JNE,      "h",    2, 0)

/* Instructions the compiler fuses from common sequences, each running as
 * the sequence it stands for */
OP(GETGL,    "HB",   0, 1)   /* global [local]: LDG, LDL, GETIDX */
OP(GETGP,    "HHH",  0, 1)   /* global's field, site: LDG, GETPROP */
OP(JLTLI,    "Bbh",  0, 0)   /* local < s8, jump: LDL, PUSHI8, JLT */
OP(JLELI,    "Bbh",  0, 0)
OP(JGTLI,    "Bbh",  0, 0)
OP(JGELI,    "Bbh",  0, 0)
OP(NEWFXA,   "",     1, 1)   /* length -> FixArray */

/* Methods, numbered by position: MTH(name, min args, max args). The
 * receiver's type at run time picks the implementation; one a type does
 * not have is a runtime error. */
MTH(push,        1, 16)
MTH(pop,         0, 0)
MTH(shift,       0, 0)
MTH(unshift,     1, 16)
MTH(splice,      1, 18)   /* start, count, then items put in their place */
MTH(slice,       0, 2)
MTH(indexOf,     1, 2)    /* from where, as JS: negative counts from the end */
MTH(join,        0, 1)
MTH(reverse,     0, 0)
MTH(sort,        1, 1)
MTH(charCodeAt,  1, 1)
MTH(substring,   1, 2)
MTH(toUpperCase, 0, 0)
MTH(toLowerCase, 0, 0)
MTH(lastIndexOf, 1, 2)    /* searching back from the end, or from where */

/* Intrinsics, numbered by position: INTRINSIC(name, min args, max args).
 * The language's own globals, as distinct from the API's natives. */
INTRINSIC(fromCharCode, 1, 1)
INTRINSIC(parseInt,     1, 2)
INTRINSIC(pow,          2, 2)
INTRINSIC(sign,         1, 1)   /* Math.sign: 0 for 0, unlike sgn() */
INTRINSIC(round,        1, 1)   /* Math.round: halves round up */
INTRINSIC(trunc,        1, 1)   /* Math.trunc: toward zero */
`;

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/apps-ipod/games/arcade/arcade_api.def
var arcade_api_default = `/* GNU General Public License (version 2+)
 *
 * Arcade native API: the one list of functions a cart can call, read by the
 * engine as an X-macro and by the compiler (arcade/sdk) as text.
 *
 *   API(name, slot, min, max, ret, flags, cost, level, version)
 *
 * slot     the number a cart's bytes call it by; permanent
 * min/max  how many arguments the compiler accepts
 * ret      VAL pushes a result, VOID pushes nothing
 * flags    PARTS: the first argument arrives as its concatenated pieces --
 *          a count, then each piece -- so printing "score " + s never
 *          builds the string
 * cost     how the unit charge grows with the work done
 * level    the music level a cart must declare to call it
 * version  the API version that added it
 *
 *   API_ALIAS(name, target)       a second name for an existing function
 *   API_CONST(name, value, ver)   a named integer, folded by the compiler
 *   API_CONSTG(group, name, value, ver)  the same, written group.name
 *
 * Every line is permanent once released: functions and constants are
 * appended, never changed or removed. */

/* Drawing */
API(cls,        0, 0, 1, VOID, 0,     PIXELS, LISTEN, 1)
API(pset,       1, 2, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(pget,       2, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)
API(line,       3, 4, 5, VOID, 0,     PIXELS, LISTEN, 1)
API(rect,       4, 4, 5, VOID, 0,     PIXELS, LISTEN, 1)
API(rectfill,   5, 4, 5, VOID, 0,     PIXELS, LISTEN, 1)
API(circ,       6, 3, 4, VOID, 0,     PIXELS, LISTEN, 1)
API(circfill,   7, 3, 4, VOID, 0,     PIXELS, LISTEN, 1)
API(oval,       8, 4, 5, VOID, 0,     PIXELS, LISTEN, 1)
API(ovalfill,   9, 4, 5, VOID, 0,     PIXELS, LISTEN, 1)
API(tri,       10, 6, 7, VOID, 0,     PIXELS, LISTEN, 1)
API(trifill,   11, 6, 7, VOID, 0,     PIXELS, LISTEN, 1)
API(polyfill, 207, 3, 7, VOID, 0,     PIXELS, LISTEN, 1)
API(polyline, 213, 3, 6, VOID, 0,     PIXELS, LISTEN, 1)
API(polyboxes, 239, 3, 4, VAL, 0,     FLAT,   LISTEN, 1)
API(fillp,     12, 0, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(color,     13, 0, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(cursor,    14, 0, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(pal,       15, 0, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(palt,      16, 0, 2, VOID, 0,     FLAT,   LISTEN, 1)
API(setpal,    17, 2, 2, VOID, 0,     FLAT,   LISTEN, 1)
API(getpal,    18, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(loadpal,   19, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(camera,    20, 0, 6, VOID, 0,     FLAT,   LISTEN, 1)
API(clip,      21, 0, 4, VOID, 0,     FLAT,   LISTEN, 1)
API(print,     22, 1, 4, VAL,  PARTS, PIXELS, LISTEN, 1)
API(textw,     23, 1, 1, VAL,  PARTS, FLAT,   LISTEN, 1)
API(textfit,  225, 2, 3, VAL,  0,     FLAT,   LISTEN, 1)
API(imgw,     231, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(imgh,     232, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(font,      24, 1, 2, VOID, 0,     FLAT,   LISTEN, 1)
API(target,    25, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)

/* Sprites and images */
API(spr,       26, 3, 6, VOID, 0,     PIXELS, LISTEN, 1)
API(sspr,      27, 6, 9, VOID, 0,    PIXELS, LISTEN, 1)
API(sget,      28, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)
API(sset,      29, 2, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(fget,      30, 1, 2, VAL,  0,     FLAT,   LISTEN, 1)
API(fset,      31, 2, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(tline,     32, 6, 8, VOID, 0,     PIXELS, LISTEN, 1)
API(img,       33, 2, 2, VAL,  0,     PIXELS, LISTEN, 1)
API_NS(img)
API(img_load,  236, 1, 1, VAL,  0,     PIXELS, LISTEN, 1)
API(img_drop,  237, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(blit,      34, 3, 4, VOID, 0,     PIXELS, LISTEN, 1)
API(blitpart,  35, 7, 8, VOID, 0,     PIXELS, LISTEN, 1)

/* The map */
API(map,       36, 0, 9, VOID, 0,     PIXELS, LISTEN, 1)
API(mget,      37, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)
API(mset,      38, 3, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(loadmap,   39, 1, 2, VAL,  0,     CELLS,  LISTEN, 1)
API(mapw,      40, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(maph,      41, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(mapobj,    42, 2, 2, VAL,  0,     CELLS,  LISTEN, 1)
API(mapprop,   43, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)

/* Input */
API(btn,       44, 0, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(btnp,      45, 0, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(btnr,     230, 0, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(wheel,     46, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(wheelpos,  47, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(wheelsteps, 238, 0, 0, VAL, 0,    FLAT,   LISTEN, 1)

/* Sound */
API(sfx,       48, 1, 2, VOID, 0,     FLAT,   LISTEN, 1)
API(sfxp,      49, 2, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(tone,      50, 5, 5, VOID, 0,     FLAT,   LISTEN, 1)

/* Maths */
API(rnd,       51, 0, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(srand,     52, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(rndstate, 226, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(flr,       53, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(ceil,      54, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(abs,       55, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(min,       56, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)
API(max,       57, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)
API(mid,       58, 3, 3, VAL,  0,     FLAT,   LISTEN, 1)
API(sgn,       59, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(sqrt,      60, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(sin,       61, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(cos,       62, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(atan2,     63, 2, 2, VAL,  0,     FLAT,   LISTEN, 1)

/* Save, time and system */
API(dget,      64, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(dset,      65, 2, 2, VOID, 0,     FLAT,   LISTEN, 1)
API(t,         66, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(frame,     67, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(date,      68, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(menuitem,  69, 1, 3, VOID, 0,     FLAT,   LISTEN, 1)
API(quit,      70, 0, 0, VOID, 0,     FLAT,   LISTEN, 1)
API(printh,    71, 1, 1, VOID, PARTS, FLAT,   LISTEN, 1)
API(watch,     72, 2, 2, VOID, 0,     FLAT,   LISTEN, 1)
API(prof,      73, 0, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(rate,      92, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(setrate,   93, 1, 1, VOID, 0,     FLAT,   LISTEN, 1)
API(skipped,   94, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(unitsnow, 233, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(resumed,  222, 0, 0, VAL,  0,     FLAT,   LISTEN, 1)
API(sfxat,    223, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)

/* The owner's music, read-only: the first of the playback service (6.4) */
API_NS(playback)
API(playback_playing, 128, 0, 0, VAL, 0, FLAT, LISTEN, 1)

/* Listening: the music's clock and its beat, its spectrum, and the
 * playing track's Sound Index record (6.4) */
API_NS(beat)
API(beat_listen,   130, 1, 1, VOID, 0, FLAT, LISTEN, 1)
API(beat_state,    131, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(beat_next,     132, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(beat_inbar,    133, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_downbeat, 134, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_margin,   135, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_clock,    136, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_now,      137, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_press,    138, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(beat_jumped,   139, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_left,     140, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_mood,     141, 1, 1, VOID, 0, FLAT, LISTEN, 1)
API(playback_bands, 142, 2, 2, VOID, 0, FLAT, LISTEN, 1)
API(playback_sound, 143, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(playback_toggle, 150, 0, 0, VOID, 0, FLAT, CONTROL, 1)
API(playback_next,   151, 0, 0, VOID, 0, FLAT, CONTROL, 1)
API(playback_prev,   152, 0, 0, VOID, 0, FLAT, CONTROL, 1)

/* The owner's settings, read-only, and the firmware's phrases in their
 * language */
API_NS(sys)
API(sys_setting,   144, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(sys_translate, 145, 1, 1, VAL,  0, FLAT, LISTEN, 1)

/* Listening ahead: the hits in the audio decoded ahead of the speaker */
API(beat_ahead,    146, 3, 3, VAL,  0, FLAT, LISTEN, 1)
API(beat_horizon,  147, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(beat_offset,   235, 0, 1, VAL,  0, FLAT, LISTEN, 1)

/* Memory: the engine's own arrays, and bulk moves */
API(mem,       74, 1, 1, VAL,  0,     FLAT,   LISTEN, 1)
API(copy,      75, 5, 5, VOID, 0,     CELLS,  LISTEN, 1)
API(fill,      76, 2, 4, VOID, 0,     CELLS,  LISTEN, 1)

/* Sprites and images turned and scaled about their centres */
API(rspr,     112, 4, 8, VOID, 0,     PIXELS, LISTEN, 1)
API(rblit,    113, 4, 5, VOID, 0,     PIXELS, LISTEN, 1)

/* The click wheel's own sounds */
API(click,     77, 0, 1, VOID, 0,     FLAT,   LISTEN, 1)

/* Systems: actors and particles. A native ns_name is ns.name in a cart. */
API_NS(actors)
API_NS(particles)
API(actors_pool,     78, 1, 1, VAL,  0, CELLS, LISTEN, 1)
API(actors_spawn,    79, 1, 1, VAL,  0, CELLS, LISTEN, 1)
API(actors_move,     80, 4, 5, VAL,  0, CELLS, LISTEN, 1)
API(actors_overlaps, 81, 3, 3, VAL,  0, CELLS, LISTEN, 1)
API(actors_draw,     82, 1, 1, VOID, 0, PIXELS, LISTEN, 1)
API(particles_pool,  83, 1, 1, VAL,  0, CELLS, LISTEN, 1)
API(particles_emit,  84, 9, 10, VAL, 0, CELLS, LISTEN, 1)
API(particles_step,  85, 1, 1, VOID, 0, CELLS, LISTEN, 1)
API(particles_draw,  86, 1, 1, VOID, 0, PIXELS, LISTEN, 1)
API(particles_bounds, 229, 2, 2, VAL, 0, FLAT, LISTEN, 1)
API(actors_zones,   117, 4, 4, VAL,  0, CELLS, LISTEN, 1)

/* Systems: sprite batches, many sprites from the cart's arrays at once */
API_NS(sprites)
API(sprites_draw,     95, 4, 5, VOID, 0, PIXELS, LISTEN, 1)

/* Systems: the grid, board puzzles on a Uint8Array */
API_NS(grid)
API(grid_fill,      96, 5, 5, VAL, 0, CELLS, LISTEN, 1)
API(grid_region,    97, 5, 5, VAL, 0, CELLS, LISTEN, 1)
API(grid_runs,      98, 4, 4, VAL, 0, CELLS, LISTEN, 1)
API(grid_full,      99, 3, 3, VAL, 0, CELLS, LISTEN, 1)
API(grid_collapse, 100, 4, 4, VAL, 0, CELLS, LISTEN, 1)
API(grid_fall,     101, 2, 2, VAL, 0, CELLS, LISTEN, 1)
API(grid_slide,    102, 3, 4, VAL, 0, CELLS, LISTEN, 1)
API(grid_fits,     103, 6, 6, VAL, 0, CELLS, LISTEN, 1)
API(grid_place,    104, 6, 6, VAL, 0, CELLS, LISTEN, 1)
API(grid_rotate,   105, 4, 4, VAL, 0, CELLS, LISTEN, 1)

/* Systems: paths over a board of cells */
API_NS(path)
API(path_field,    106, 6, 6, VAL, 0, CELLS, LISTEN, 1)
API(path_next,     107, 4, 4, VAL, 0, CELLS, LISTEN, 1)
API(path_find,     108, 8, 8, VAL, 0, CELLS, LISTEN, 1)
API(path_sight,    109, 7, 7, VAL, 0, CELLS, LISTEN, 1)
API(path_view,     234, 7, 8, VAL, 0, CELLS, LISTEN, 1)
API(path_ray,      118, 6, 7, VAL, 0, CELLS, LISTEN, 1)

/* Systems: noise, smooth random values */
API_NS(noise)
API(noise_at,      110, 3, 4, VAL, 0, CELLS, LISTEN, 1)
API(noise_fill,    111, 8, 8, VAL, 0, CELLS, LISTEN, 1)

/* Systems: cells, a field of materials stepped by rules */
API_NS(cells)
API(cells_rules,   114, 0, 0, VAL, 0, CELLS, LISTEN, 1)
API(cells_step,    115, 3, 5, VAL, 0, CELLS, LISTEN, 1)
API(cells_life,    116, 4, 5, VAL, 0, CELLS, LISTEN, 1)
API(cells_lift,    126, 6, 7, VAL, 0, CELLS, LISTEN, 1)

/* Systems: points and links -- ropes, chains, bridges, cloth */
API_NS(links)
API(links_pool,    119, 2, 2, VAL,  0, CELLS,  LISTEN, 1)
API(links_point,   120, 3, 4, VAL,  0, CELLS,  LISTEN, 1)
API(links_link,    121, 3, 4, VAL,  0, CELLS,  LISTEN, 1)
API(links_step,    122, 2, 4, VAL,  0, CELLS,  LISTEN, 1)
API(links_draw,    123, 2, 2, VOID, 0, PIXELS, LISTEN, 1)
API(links_cloth,   148, 6, 7, VAL,  0, CELLS,  LISTEN, 1)
API(links_fill,    149, 2, 2, VAL,  0, PIXELS, LISTEN, 1)
API(links_ring,    211, 5, 5, VAL,  0, CELLS,  LISTEN, 1)

/* Systems: the outlines points meet */
API_NS(segs)
API(segs_make,     208, 3, 5, VAL,  0, CELLS,  LISTEN, 1)
API(segs_move,     209, 3, 3, VOID, 0, CELLS,  LISTEN, 1)
API(segs_draw,     210, 2, 2, VOID, 0, PIXELS, LISTEN, 1)
API(segs_trace,    212, 1, 9, VAL,  0, CELLS,  LISTEN, 1)

/* Systems: a voxel landscape, from the plane's camera */
API_NS(land)
API(land_draw,     124, 2, 6, VAL, 0, PIXELS, LISTEN, 1)
API(land_height,   125, 3, 4, VAL, 0, CELLS,  LISTEN, 1)

/* Systems: first-person walls from the map, from the plane's camera */
API_NS(walls)
API(walls_draw,    127, 1, 5, VAL, 0, PIXELS, LISTEN, 1)

/* Systems: the plane, the map as a floor seen from a camera */
API_NS(plane)
API(plane_view,       87, 6, 6, VOID, 0, CELLS,  LISTEN, 1)
API(plane_draw,       88, 0, 5, VOID, 0, PIXELS, LISTEN, 1)
API(plane_fog,       129, 3, 4, VOID, 0, CELLS,  LISTEN, 1)
API(plane_project,    89, 4, 4, VAL,  0, CELLS,  LISTEN, 1)
API(plane_pick,       90, 3, 3, VAL,  0, CELLS,  LISTEN, 1)
API(plane_billboards, 91, 7, 9, VAL,  0, PIXELS, LISTEN, 1)
API(plane_sky,       153, 1, 2, VOID, 0, PIXELS, LISTEN, 1)

/* Music: the playing track, and the library and queue (playback, tracks) */
API(playback_elapsed, 154, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_length,  155, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_changed, 156, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_title,   157, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_artist,  158, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_album,   159, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_track,   160, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_seek,    161, 1, 1, VOID, 0, FLAT, CONTROL, 1)
API(playback_duck,    162, 1, 2, VOID, 0, FLAT, CONTROL, 1)
API(playback_play,    163, 1, 2, VAL,  0, FLAT, OWN, 1)
API(playback_stop,    164, 0, 0, VOID, 0, FLAT, OWN, 1)
API(playback_started, 165, 0, 0, VAL,  0, FLAT, OWN, 1)
API_NS(tracks)
API(tracks_count,     166, 0, 1, VAL,  0, CELLS, LISTEN, 1)
API(tracks_pick,      167, 3, 3, VAL,  0, CELLS, LISTEN, 1)
API(tracks_field,     168, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(tracks_near,      169, 3, 4, VAL,  0, CELLS, LISTEN, 1)
API(tracks_sound,     170, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(tracks_queued,    171, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(tracks_place,     172, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(tracks_queue,     173, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(tracks_enqueue,   174, 1, 2, VAL,  0, FLAT, CONTROL, 1)
API_CONSTG(TRACK, TITLE,  0, 1)
API_CONSTG(TRACK, ARTIST, 1, 1)
API_CONSTG(TRACK, ALBUM,  2, 1)
API_CONSTG(TRACK, GENRE,  3, 1)
API_CONSTG(TRACK, YEAR,   4, 1)
API_CONSTG(TRACK, LENGTH, 5, 1)

/* High scores: the boards cart.json declares, as BOARD.<name> */
API_NS(score)
API(score_submit,     175, 2, 3, VAL,  0, FLAT, LISTEN, 1)
API(score_best,       176, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(score_get,        177, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(score_name,       178, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(score_count,      179, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(score_show,       180, 1, 1, VOID, 0, FLAT, LISTEN, 1)

/* Generators of their own, beside rnd()'s stream */
API_NS(rng)
API(rng_seed,         227, 2, 2, VOID, 0, FLAT, LISTEN, 1)
API(rng_rnd,          228, 1, 2, VAL,  0, FLAT, LISTEN, 1)

/* Options: the settings cart.json declares, as OPT.<name> */
API_NS(opt)
API(opt_get,          181, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(opt_changed,      182, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(opt_set,          224, 2, 2, VOID, 0, FLAT, LISTEN, 1)

/* Dialogs: the player's own, over the game */
API_NS(ui)
API(ui_choose,        183, 2, 3, VAL,  0, FLAT, LISTEN, 1)
API(ui_confirm,       184, 1, 2, VAL,  0, FLAT, LISTEN, 1)
API(ui_message,       185, 1, 2, VOID, 0, FLAT, LISTEN, 1)
API(ui_number,        186, 4, 5, VAL,  0, FLAT, LISTEN, 1)
API(ui_text,          187, 2, 3, VAL,  0, FLAT, LISTEN, 1)

/* Speech: the player's synthesiser */
API_NS(speak)
API(speak_say,        188, 1, 8, VOID, 0, FLAT, LISTEN, 1)
API(speak_queue,      189, 1, 8, VOID, 0, FLAT, LISTEN, 1)
API(speak_busy,       190, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(speak_stop,       191, 0, 0, VOID, 0, FLAT, LISTEN, 1)
API(speak_on,         192, 0, 0, VAL,  0, FLAT, LISTEN, 1)

/* Data: the cart's data files, as DATA.<name>, and its own stored files */
API_NS(data)
API(data_read,        193, 1, 1, VAL,  0, CELLS, LISTEN, 1)
API_NS(store)
API(store_read,       194, 1, 1, VAL,  0, CELLS, LISTEN, 1)
API(store_write,      195, 2, 2, VAL,  0, CELLS, LISTEN, 1)
API(store_remove,     196, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(store_list,       197, 0, 0, VAL,  0, FLAT, LISTEN, 1)

/* Circles: actors bouncing off one another and off the map */
API(actors_bounce,     198, 3, 4, VAL, 0, CELLS, LISTEN, 1)
API(actors_bounce_map, 199, 3, 4, VAL, 0, CELLS, LISTEN, 1)

/* Achievements: the ones cart.json declares, as ACH.<name> */
API_NS(ach)
API(ach_earn,         200, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(ach_has,          201, 1, 1, VAL,  0, FLAT, LISTEN, 1)

/* Light: lights over a dark scene */
API_NS(light)
API(light_draw,       202, 5, 5, VOID, 0, PIXELS, LISTEN, 1)

/* The plane's ceiling, a sprite table over the map like the floor's */
API(plane_ceiling,    203, 1, 5, VOID, 0, PIXELS, LISTEN, 1)

/* The height print would take: its lines, in the current font and size */
API(texth,            204, 1, 1, VAL,  PARTS, FLAT, LISTEN, 1)

/* The dialogs' colours: the box, its text, the highlight */
API(ui_style,         205, 3, 3, VOID, 0, FLAT, LISTEN, 1)

/* The sheet the sprite calls draw from: an image, or the cart's */
API(sheet,            206, 0, 1, VOID, 0, FLAT, LISTEN, 1)

/* Colours: the ones the player is showing, and shades and accents made
 * from any colour, each 0xRRGGBB */
API(playback_colors, 214, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API_NS(color)
API(color_mix,       215, 3, 3, VAL,  0, FLAT, LISTEN, 1)
API(color_tone,      216, 1, 1, VAL,  0, FLAT, LISTEN, 1)
API(color_toned,     217, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(color_turn,      218, 2, 2, VAL,  0, FLAT, LISTEN, 1)
API(color_contrast,  219, 2, 2, VAL,  0, FLAT, LISTEN, 1)

/* The owner's volume: read, and turned a step at a time */
API(playback_volume,  220, 0, 0, VAL,  0, FLAT, LISTEN, 1)
API(playback_adjust,  221, 1, 1, VAL,  0, FLAT, CONTROL, 1)

API_ALIAS(time, t)

/* The drawing target that is the screen; img() makes the others */
API_CONST(SCREEN,   0, 1)

/* Built-in fonts; a cart's own follow from 16. 1 is taken: carts built
 * before font() had a size draw CAPS at 2 with it. */
API_CONSTG(FONT, CAPS,  0, 1)
API_CONSTG(FONT, WORLD, 2, 1)

/* What actors.move() reports: the side of the actor that hit, or a
 * trigger cell entered */
API_CONSTG(HIT, LEFT,  0, 1)
API_CONSTG(HIT, RIGHT, 1, 1)
API_CONSTG(HIT, UP,    2, 1)
API_CONSTG(HIT, DOWN,  3, 1)
API_CONSTG(HIT, ENTER, 4, 1)
API_CONSTG(HIT, LEAVE, 5, 1)
API_CONSTG(HIT, TOUCH, 6, 1)
API_CONSTG(HIT, REACT, 7, 1)
API_CONSTG(HIT, CRUSH, 8, 1)

/* Directions, for grid.slide() and anything else that goes one way: the
 * same numbers as HIT's sides */
API_CONSTG(DIR, LEFT,  0, 1)
API_CONSTG(DIR, RIGHT, 1, 1)
API_CONSTG(DIR, UP,    2, 1)
API_CONSTG(DIR, DOWN,  3, 1)

/* What an actor makes of a material, in cells.rules().flags */
API_CONSTG(CELL, SOLID,  1, 1)
API_CONSTG(CELL, LIQUID, 2, 1)
API_CONSTG(CELL, HARM,   4, 1)

/* How a material moves, in cells.rules().move */
API_CONSTG(MOVE, STATIC, 0, 1)
API_CONSTG(MOVE, POWDER, 1, 1)
API_CONSTG(MOVE, LIQUID, 2, 1)
API_CONSTG(MOVE, GAS,    3, 1)

/* tone()'s waves */
API_CONSTG(WAVE, SQUARE,   0, 1)
API_CONSTG(WAVE, SAW,      1, 1)
API_CONSTG(WAVE, TRIANGLE, 2, 1)
API_CONSTG(WAVE, SINE,     3, 1)
API_CONSTG(WAVE, NOISE,    4, 1)

/* What mem() hands out, each a Uint8Array */
API_CONSTG(MEM, SCREEN, 0, 1)
API_CONSTG(MEM, SHEET,  1, 1)
API_CONSTG(MEM, MAP,    2, 1)
API_CONSTG(MEM, FLAGS,  3, 1)

/* The fields of playback.sound()'s record, an Int32Array of SOUND.SIZE */
API_CONSTG(SOUND, PERIOD,     0, 1)
API_CONSTG(SOUND, CONFIDENCE, 1, 1)
API_CONSTG(SOUND, SETTLED,    2, 1)
API_CONSTG(SOUND, LOUDNESS,   3, 1)
API_CONSTG(SOUND, CREST,      4, 1)
API_CONSTG(SOUND, WIDTH,      5, 1)
API_CONSTG(SOUND, LOW,        6, 1)
API_CONSTG(SOUND, MID,        7, 1)
API_CONSTG(SOUND, HIGH,       8, 1)
API_CONSTG(SOUND, ONSETS_LOW, 9, 1)
API_CONSTG(SOUND, ONSETS_MID, 10, 1)
API_CONSTG(SOUND, ONSETS_HIGH, 11, 1)
API_CONSTG(SOUND, STRENGTH,   12, 1)
API_CONSTG(SOUND, PEAKINESS,  13, 1)
API_CONSTG(SOUND, PITCH,      14, 1)
API_CONSTG(SOUND, TONIC,      26, 1)
API_CONSTG(SOUND, MODE,       27, 1)
API_CONSTG(SOUND, MODE_MARGIN, 28, 1)
API_CONSTG(SOUND, CLARITY,    29, 1)
API_CONSTG(SOUND, CHANGE,     30, 1)
API_CONSTG(SOUND, SIZE,       31, 1)
`;

// ../../AppData/Local/Temp/tmp.iZJa1h7WU7/src/arcade/builder/entry.js
globalThis.arcadeDefs = { "opcodes.def": opcodes_default, "arcade_api.def": arcade_api_default };
await init_pbgc().then(() => pbgc_exports);
