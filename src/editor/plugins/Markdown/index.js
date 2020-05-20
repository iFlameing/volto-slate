import { withShortcuts } from './decorators';

export default function install(config) {
  const slate = config.settings.slate || {};
  config.settings.slate = slate;
  slate.decorators = [...(slate.decorators || []), withShortcuts];

  return config;
}
