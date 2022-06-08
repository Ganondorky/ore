import {removeItem, reorderItem} from '../scripts/settingHelpers.js'
export default class HitLocationSettings extends FormApplication {
  constructor(object = {}, options = { parent: null }) {
    super(object, options);
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'hitLocationSettings',
      template: 'systems/ore/templates/hit-location-settings.html',
      title: game.i18n.localize('ORE.HitLocationSettings'),
      classes: ['ore', 'hit-location-settings'],
      width: 600,
      height: 1000,
      top: 200,
      left: 400,
      resizable: true,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true,
    })
  }

  // @TODO: Add Order Sorting capabilities

  activateListeners (html) {
    super.activateListeners(html)

    html.find('.add-hit-location').click(this._addHitLocation.bind(this))
    // html.find('.collapse-toggle').click(this._collapseToggle.bind(this))
    // html.find('input.display-toggle').change(event => this._displayToggle(event, html))
    // html.find('button.display-toggle').click(event => this._displayToggle(event, html))
    html.find('#submit').click(() => this.close())
    removeItem.call(this, html)
    reorderItem.call(this, html)
  }

  getData () {
    const hitLocations = game.settings.get('ore', 'hitLocations')

    return {
      hitLocations
    }
  }

  async _updateObject (_, formData) {
    const expandedFormData = expandObject(formData)
    const currentHitLocations = game.settings.get('ore', 'hitLocations')
    const mergedHitLocations = expandedFormData.hitLocations ?? {}

    await game.settings.set('ore', 'hitLocations', mergeObject(currentHitLocations, mergedHitLocations))
  }

  async _addHitLocation (event) {
    event.preventDefault()
    const source = game.settings.get('ore', 'hitLocations')
    const newKey = Object.keys(source ?? {}).length
    const newHitLocation = {
        [newKey]: {
            name: 'New Hit Location',
            range: '0',
            wounds: 5,
        }
    }

    await game.settings.set('ore', 'hitLocations', mergeObject(source, newHitLocation))
    this.render(true)
  }

  _displayToggle (event, html) {
    event.preventDefault()
    const dataset = event.currentTarget.dataset
    if (dataset.scope) {
      $(event.currentTarget)
        .closest(dataset.scope)
        .find(dataset.selector)
        .toggle()
    } else {
      html.find(dataset.selector).toggle()
    }
  }

  async _collapseToggle (event) {
    event.preventDefault()
    const $element = $(event.currentTarget)
    const $collapseValue = $element
      .next('.collapse-value')

    $collapseValue.prop('checked', !($collapseValue.is(':checked')))

    await this._onSubmit(event)
    this.render(true)
  }

  /**
   * Remove attributes which are no longer used
   * @param attributes
   * @param base
   */
  _handleDeletableAttributes (attributes, base) {
    for (let k of Object.keys(base)) {
      if (!attributes.hasOwnProperty(k)) {
        delete attributes[k];
      }
    }
    return attributes;
  }

  _mergeHitLocations (formSets, currentSets) {
    return formSets
      ? Object.keys(formSets).reduce((sets, setKey) => {
        const setsKeys = Object.keys(sets)

        if (setsKeys.every(i => sets[i].name !== formSets[setKey].name)) {
          return {
            ...sets,
            [setsKeys.length]: formSets[setKey]
          }
        }

        return sets
      }, {})
      : {}
  }
}