import { getLength, objectMapKeys } from '../../lib/helpers.js'
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

export const reorderItem = async function (html) {
  html.find('.reorder').click(async event => {
    event.preventDefault()
    const {
      currentIndex,
      newIndex,
      path,
      setting
    } = event.currentTarget.dataset

    let settings = game.settings.get('ore', setting)
    const targetObject = (path || parseInt(path, 10) === 0) ? getProperty(settings, path) ?? {} : settings
    const maxKey = getLength(targetObject ?? {}) - 1
    const key = +newIndex < 0
      ? maxKey
      : maxKey < +newIndex
        ? 0
        : +newIndex

    const value = objectMapKeys(targetObject, (_, targetKey) => {
      return +targetKey === +currentIndex
        ? key
        : +currentIndex > key
          ? +targetKey < +currentIndex && +targetKey >= key
            ? +targetKey + 1
            : +targetKey
          : +targetKey > +currentIndex && +targetKey <= key
            ? +targetKey - 1
            : +targetKey
    })

    if (path || parseInt(path, 10) === 0) {
      setProperty(settings, path, value)
    } else {
      settings = value
    }

    await game.settings.set('ore', setting, settings)
    this.render(true)
  })
}