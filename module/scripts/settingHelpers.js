import {indexObjectValues, objectFilter} from './helpers.js'

export const removeItem = function (html) {
    html.find('.remove-item').click(async event => {
      event.preventDefault()
      const {
        group,
        itemKey,
        itemName,
        setting
      } = event.currentTarget.dataset
      // if (setting && confirm(`Are you sure you want to remove ${itemName}`)) {
        if (setting){
          let settings = game.settings.get('ore', setting)
  
          const currentGroupSettings = group ? await getProperty(settings, group) : settings
          const groupSettingValue = indexObjectValues(objectFilter(currentGroupSettings, (_, key) => +key !== +itemKey))
  
          if (group) {
            setProperty(settings, group, groupSettingValue)
          } else {
            settings = groupSettingValue
          }
          await game.settings.set('ore', setting, settings)
  
          this.render(true)
      }
    })
  }