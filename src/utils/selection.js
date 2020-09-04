import { castArray } from 'lodash';
import { Editor, Transforms, Range, Node } from 'slate';
import { settings } from '~/config';
import { ReactEditor } from 'slate-react';

/**
 * Get the nodes with a type included in `types` in the selection (from root to leaf).
 *
 * @param {} editor
 * @param {} types
 * @param {} options
 */
export function getSelectionNodesByType(editor, types, options = {}) {
  types = castArray(types);

  return Editor.nodes(editor, {
    match: (n) => {
      return types.includes(n.type);
    },
    ...options,
  });
}

/**
 * Is there a node with a type included in `types` in the selection (from root to leaf).
 */
export function isNodeInSelection(editor, types, options = {}) {
  const [match] = getSelectionNodesByType(editor, types, options);
  return !!match;
}

/**
 * getSelectionNodesArrayByType.
 *
 * @param {} editor
 * @param {} types
 * @param {} options
 */
export function getSelectionNodesArrayByType(editor, types, options = {}) {
  return Array.from(getSelectionNodesByType(editor, types, options));
}

/**
 * getMaxRange.
 *
 * @param {} editor
 *
 * TODO: is [0] ok as a path?
 */
export function getMaxRange(editor) {
  const maxRange = {
    anchor: Editor.start(editor, [0]),
    focus: Editor.end(editor, [0]),
  };
  return maxRange;
}

/**
 * selectAll.
 *
 * @param {} editor
 */
export function selectAll(editor) {
  Transforms.select(editor, getMaxRange(editor));
}

// In the isCursorAtBlockStart/End functions maybe use a part of these pieces of code:
// Range.isCollapsed(editor.selection) &&
// Point.equals(editor.selection.anchor, Editor.start(editor, []))

/**
 * isCursorAtBlockStart.
 *
 * @param {} editor
 */
export function isCursorAtBlockStart(editor) {
  // It does not work properly with lists

  if (editor.selection && Range.isCollapsed(editor.selection)) {
    const { anchor } = editor.selection;
    return anchor.offset > 0
      ? false
      : anchor.path.reduce((acc, x) => acc + x, 0) === 0;
    // anchor.path.length === 2 &&
  }
  return false;
}

/**
 * isCursorAtBlockEnd.
 *
 * @param {} editor
 */
export function isCursorAtBlockEnd(editor) {
  // fixSelection(editor);

  // if the selection is collapsed
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    const anchor = editor.selection?.anchor || {};

    // the last block node in the editor
    const [node] = Node.last(editor, []);

    if (
      // if the node with the selection is the last block node
      Node.get(editor, anchor.path) === node &&
      // if the collapsed selection is at the end of the last block node
      anchor.offset === node.text.length
    ) {
      return true;
    }
  }
  return false;
}

/**
 * getFragmentFromStartOfSelectionToEndOfEditor.
 *
 * @param {} editor
 */
export function getFragmentFromStartOfSelectionToEndOfEditor(editor) {
  const { slate } = settings;
  const range = Editor.range(
    editor,
    Range.isBackward(editor.selection)
      ? editor.selection.focus
      : editor.selection.anchor,
    Editor.end(editor, []),
  );

  // this is the case when the fragment is empty, and we must return
  // empty fragment but without formatting
  if (Range.isCollapsed(range)) {
    return slate.defaultValue();
  }

  // immer doesn't like editor.savedSelection
  const newEditor = { children: editor.children };
  return Editor.fragment(newEditor, range);
}

/**
 * getFragmentFromBeginningOfEditorToStartOfSelection.
 *
 * @param {} editor
 */
export function getFragmentFromBeginningOfEditorToStartOfSelection(editor) {
  // immer doesn't like editor.savedSelection
  const newEditor = { children: editor.children };
  return Editor.fragment(
    newEditor,
    Editor.range(
      newEditor,
      [],
      Range.isBackward(editor.selection)
        ? editor.selection.focus
        : editor.selection.anchor,
    ),
  );
}

/**
 * @returns {boolean} true if editor contains a range selection
 * @param {Editor} editor
 */
export function hasRangeSelection(editor) {
  const { savedSelection, selection } = editor;
  // const selection = editor.selection || savedSelection || editor.selection;

  const range = ReactEditor.isFocused(editor)
    ? selection || savedSelection
    : savedSelection;

  if (!range) {
    console.log('no range', editor);
    return;
  }
  const res = Range.isExpanded(range);
  // const isNativeExpanded =
  //   editor.selection && Range.isExpanded(editor.selection);
  // const isSavedExpanded =
  //   editor.savedSelection && Range.isExpanded(editor.savedSelection);
  //
  // // ReactEditor.isFocused(editor) &&
  // // &&
  // // Editor.string(editor, selection) !== '';
  // // console.log('hasRange', selection, savedSelection, res);
  //
  // const res = selection && (isNativeExpanded || isSavedExpanded);
  // console.log('has', res);
  return res;
}

export function parseDefaultSelection(editor, defaultSelection) {
  // if (!editor.selection) {
  if (defaultSelection) {
    if (defaultSelection === 'start') {
      const [, path] = Node.first(editor, []);
      const newSel = {
        anchor: { path, offset: 0 },
        focus: { path, offset: 0 },
      };
      return newSel;
    }
    if (defaultSelection === 'end') {
      const [leaf, path] = Node.last(editor, []);
      const newSel = {
        anchor: { path, offset: (leaf.text || '').length },
        focus: { path, offset: (leaf.text || '').length },
      };
      return newSel;
    }
    return defaultSelection;
  }
  // }
}
