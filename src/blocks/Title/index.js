import React from 'react';
import titleSVG from '@plone/volto/icons/text.svg';
import TitleBlockView from './TitleBlockView';
import TitleBlockEdit from './TitleBlockEdit';

export default (config) => {
  const className = 'documentFirstHeading';

  config.blocks.blocksConfig.title = {
    id: 'title',
    title: 'Title',
    icon: titleSVG,
    group: 'text',
    view: (props) => <TitleBlockView {...props} className={className} />,
    edit: (props) => <TitleBlockEdit {...props} className={className} />,
    restricted: true,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};
