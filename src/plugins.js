import { buildInputRules } from './inputrules';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { createKeymap } from './keymap';

export function createPlugins(schema) {
  return [
    buildInputRules(schema),
    history(),
    keymap(createKeymap(schema)),
    keymap(baseKeymap),
  ]
}
