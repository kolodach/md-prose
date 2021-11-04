import { schema } from "prosemirror-schema-basic";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React, { useEffect, useRef } from "react";

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

function ProseEditor(props) {
  const viewHost = useRef();
  const view = useRef(null);

  useEffect(() => { // initial render
    const state = EditorState.create({ schema, plugins: [reactProps(props)] });
    view.current = new EditorView(viewHost.current, { state });
    return () => view.current.destroy();
  }, []);

  useEffect(() => { // every render
    const tr = view.current.state.tr.setMeta(reactPropsKey, props);
    view.current.dispatch(tr);
  });

  return <div ref={viewHost} />;
}

export default ProseEditor;
