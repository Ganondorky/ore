import StatSettings from './StatSettings.js'
import QualitySettings from './QualitySettings.js'

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
  game.settings.registerMenu('ore', 'QualitySettings', {
    hint: game.i18n.localize('ORE.QualitySettingsH'),
    icon: 'fas fa-globe',
    label: game.i18n.localize('ORE.QualitySettingsL'),
    name: game.i18n.localize('ORE.QualitySettingsN'),
    restricted: true,
    type: QualitySettings
  })
  game.settings.register('ore', 'qualities', {
    name: 'Qualities',
    default: {},
    scope: 'world',
    type: Object,
    config: false,
  })

}
