import React from 'react';
import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import { ReactEditor } from 'slate-react';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';

import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

import { setPluginOptions } from 'volto-slate/actions';

export default (props) => {
  const {
    editor,
    editSchema,
    pluginId,
    getActiveElement,
    isActiveElement,
    insertElement,
    unwrapElement,
    hasValue,
    onChangeValues,
  } = props;

  const dispatch = useDispatch();
  const formContext = useFormStateContext();
  const [formData, setFormData] = React.useState({});

  const active = getActiveElement(editor);
  const [elementNode] = active;
  const isElement = isActiveElement(editor);

  // Update the form data based on the current footnote
  const elRef = React.useRef(null);

  if (isElement && !isEqual(elementNode, elRef.current)) {
    elRef.current = elementNode;
    setFormData(elementNode.data || {});
  } else if (!isElement) {
    elRef.current = null;
  }

  const saveDataToEditor = React.useCallback(
    (formData) => {
      if (hasValue(formData)) {
        // hasValue(formData) = !!formData.footnote
        insertElement(editor, formContext, formData);
      } else {
        unwrapElement(editor);
      }
    },
    [editor, insertElement, unwrapElement, hasValue, formContext],
  );

  return (
    <InlineForm
      schema={editSchema}
      title={editSchema.title}
      icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
      onChangeField={(id, value) => {
        if (!onChangeValues) {
          return setFormData({
            ...formData,
            [id]: value,
          });
        }
        return onChangeValues(id, value, formData, setFormData);
      }}
      formData={formData}
      headerActions={
        <>
          <button
            onClick={() => {
              saveDataToEditor(formData);
              dispatch(
                setPluginOptions(pluginId, { show_sidebar_editor: false }),
              );
              ReactEditor.focus(editor);
            }}
          >
            <VoltoIcon size="24px" name={checkSVG} />
          </button>
          <button
            onClick={() => {
              dispatch(
                setPluginOptions(pluginId, { show_sidebar_editor: false }),
              );
              setFormData({});
              ReactEditor.focus(editor);
            }}
          >
            <VoltoIcon size="24px" name={clearSVG} />
          </button>
        </>
      }
    />
  );
};
