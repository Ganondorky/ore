import StatSettings from './StatSettings.js'

export const registerSettings = () => {
  game.settings.registerMenu('ore', 'StatSettings', {
    hint: game.i18n.localize('ORE.StatSettingsH'),
    icon: 'fas fa-globe',
    label: game.i18n.localize('ORE.StatSettingsL'),
    name: game.i18n.localize('ORE.StatSettingsN'),
    restricted: true,
    type: StatSettings
  })
  game.settings.register('ore', 'stats', {
    name: 'Stats',
    default: {},
    scope: 'world',
    type: Object,
    config: false,
  })

}
