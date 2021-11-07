import { buildInputRules } from './inputrules';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { createKeymap } from './keymap';
import { mathPlugin } from '@benrbray/prosemirror-math';

export function createPlugins(schema) {
  return [
    mathPlugin,
    buildInputRules(schema),
    history(),
    keymap(createKeymap(schema)),
    keymap(baseKeymap),
  ]
}
