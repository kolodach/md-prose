import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from "react";
import './ProseEditor.css';
import { createPlugins } from './plugins';
import { schema } from './schema';
import { createParser } from './parser';
import { mathSerializer } from '@benrbray/prosemirror-math';
import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";

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
  const markdownParser = createParser(schema);
  const plugins = createPlugins(schema);
  plugins.push(reactPlugin);
  const state = EditorState.create({ 
    doc: markdownParser.parse("# Test"), 
    plugins,
  });
  const view = new EditorView(place, { 
    state,
    dispatchTransaction(transaction) {
      // console.log(transaction.doc.content.toString());
      const newState = view.state.apply(transaction);
      view.updateState(newState);
    },
    clipboardTextParser: (slice) => {
      return mathSerializer.serializeSlice(slice);
    },
  });
  return view;
}

function ProseEditor(props) {
  const viewHost = useRef();
  const view = useRef(null);

  useEffect(() => { // initial render
    view.current = createEditorView(viewHost.current, reactProps(props))
    return () => view.current.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { // every render
    const tr = view.current.state.tr.setMeta(reactPropsKey, props);
    view.current.dispatch(tr);
  });

  return <div className="prosemirrorWrapper" ref={viewHost} />;
}

export default ProseEditor;
