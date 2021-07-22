import StatSettings from './StatSettings.js'
import QualitySettings from './QualitySettings.js'
import defaultHitLocations from './defaultHitLocations.js'
import HitLocationSettings from './HitLocationSettings.js'

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
  game.settings.registerMenu('ore', 'HitLocationSettings', {
    hint: game.i18n.localize('ORE.HitLocationSettingsH'),
    icon: 'fas fa-globe',
    label: game.i18n.localize('ORE.HitLocationSettings'),
    name: game.i18n.localize('ORE.HitLocationSettings'),
    restricted: true,
    type: HitLocationSettings
  })
  game.settings.register('ore', 'hitLocations', {
    name: 'HitLocations',
    default: defaultHitLocations,
    scope: 'world',
    type: Object,
    config: false,
  })
}
