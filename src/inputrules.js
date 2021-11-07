import {
  textblockTypeInputRule,
  inputRules,
  smartQuotes,
  emDash,
  ellipsis,
  wrappingInputRule,
} from 'prosemirror-inputrules';
import {
	makeBlockMathInputRule, makeInlineMathInputRule,
	REGEX_INLINE_MATH_DOLLARS, REGEX_BLOCK_MATH_DOLLARS
} from "@benrbray/prosemirror-math";

export function headingRule(nodeType) {
  return textblockTypeInputRule(
    new RegExp(/^(#{1,6})\s$/),
    nodeType,
    match => ({level: match[1].length})
  );
}

export function headingRule2(nodeType, maxLevel) {
  return textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"),
                                nodeType, match => ({level: match[1].length}))
}

export function bulletListRule(nodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

export function codeBlockRule(nodeType) {
  return textblockTypeInputRule(/^```$/, nodeType)
}

export function orderedListRule(nodeType) {
  return wrappingInputRule(/^(\d+)\.\s$/, 
    nodeType, match => ({order: +match[1]}),
    (match, node) => node.childCount + node.attrs.order === +match[1]);
}

export function blockQuoteRule(nodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType)
}

export function buildInputRules(schema) {
  let rules = smartQuotes.concat(emDash, ellipsis);
  rules.push(bulletListRule(schema.nodes.bullet_list));
  rules.push(orderedListRule(schema.nodes.ordered_list));
  rules.push(codeBlockRule(schema.nodes.code_block));
  rules.push(blockQuoteRule(schema.nodes.blockQuoteRule));
  rules.push(headingRule(schema.nodes.heading));
  
  // prosermirror-math
  rules.push(makeInlineMathInputRule(
    REGEX_INLINE_MATH_DOLLARS, schema.nodes.math_inline));
  rules.push(makeBlockMathInputRule(
    REGEX_BLOCK_MATH_DOLLARS, schema.nodes.math_display));

  return inputRules({rules});
}
