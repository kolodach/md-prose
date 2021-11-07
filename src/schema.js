import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-markdown';

// prosemirror-math related schema
const mathInlineSpec = {
  group: "inline math",
  content: "text*",
  inline: true,
  atom: true,
  toDOM: () => ["math-inline", { class: "math-node" }, 0],
  parseDOM: [{
      tag: "math-inline"
  }]
};

const mathDisplaySpec = {
  group: "block math",
  content: "text*",
  atom: true,
  code: true,
  toDOM: () => ["math-display", { class: "math-node" }, 0],
  parseDOM: [{
      tag: "math-display"
  }]
}


const customSchema = new Schema({
  nodes: schema.spec.nodes
    .addToEnd("math_inline", mathInlineSpec)
    .addToEnd("math_display", mathDisplaySpec),
  marks: schema.spec.marks,
});

export {
  customSchema as schema
};

