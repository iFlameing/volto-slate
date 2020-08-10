import React from 'react';
import { TABLE, THEAD, TFOOT, TBODY, TR, TD, TH } from 'volto-slate/constants';
import './less/table.less';

export const tableElements = {
  [TABLE]: ({ attributes, children }) => (
    <table {...attributes}>{children}</table>
  ),
  [THEAD]: ({ attributes, children }) => (
    <thead {...attributes}>{children}</thead>
  ),
  [TFOOT]: ({ attributes, children }) => (
    <tfoot {...attributes}>{children}</tfoot>
  ),
  [TBODY]: ({ attributes, children }) => (
    <tbody {...attributes}>{children}</tbody>
  ),
  [TR]: ({ attributes, children }) => <tr {...attributes}>{children}</tr>,
  [TD]: ({ attributes, children }) => <td {...attributes}>{children}</td>,
  [TH]: ({ attributes, children }) => <th {...attributes}>{children}</th>,
};
