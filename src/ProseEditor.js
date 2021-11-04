import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
import React, { useEffect, useRef } from "react";
import {undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

const reactPropsKey = new PluginKey("reactProps");

function reactProps(initialProps) {
  return new Plugin({
    key: reactPropsKey,
    state: {
      init: () => initialProps,
      apply: (tr, prev) => tr.getMeta(reactPropsKey) || prev,
    },
  });
}

function createEditorView(place, reactPlugin) {
  const state = EditorState.create({ 
    doc: defaultMarkdownParser.parse("# Test"), 
    plugins: [
      reactPlugin,
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo
      }),
      keymap(baseKeymap)
    ]
  });
  const view = new EditorView(place, { 
    state,
    dispatchTransaction(transaction) {
      console.log(transaction.doc.content.toString());
      const newState = view.state.apply(transaction);
      view.updateState(newState);
    }
  });
  return view;
}

function ProseEditor(props) {
  const viewHost = useRef();
  const view = useRef(null);

  useEffect(() => { // initial render
    view.current = createEditorView(viewHost.current, reactProps(props))
    return () => view.current.destroy();
  }, []);

  useEffect(() => { // every render
    const tr = view.current.state.tr.setMeta(reactPropsKey, props);
    view.current.dispatch(tr);
  });

  return <div ref={viewHost} />;
}

export default ProseEditor;
