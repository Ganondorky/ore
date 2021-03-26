import createNewFieldElements from '../scripts/createNewFieldElements.js'

export default class QualitySettings extends FormApplication {
  constructor(object = {}, options = { parent: null }) {
    super(object, options);
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'qualitySettings',
      template: 'systems/ore/templates/quality-settings.html',
      title: game.i18n.localize('ORE.QualitySettingsT'),
      classes: ['ore', 'quality-settings'],
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

    html.find('.add-quality').click(this._addQuality.bind(this))
    html.find('.collapse-toggle').click(this._collapseToggle.bind(this))
    html.find('input.display-toggle').change(event => this._displayToggle(event, html))
    html.find('button.display-toggle').click(event => this._displayToggle(event, html))
    html.find('.remove-parent-element').click(this._removeParentElement.bind(this))
    html.find('#submit').click(() => this.close())
  }

  getData () {
    const qualities = game.settings.get('ore', 'qualities')

    return {
      qualities
    }
  }

  async _updateObject (_, formData) {
    const expandedFormData = expandObject(formData)

    const mergedQualities = expandedFormData.qualities ?? {}

    if (expandedFormData.newQuality) {
      const currentQualityLength = Object.keys(mergedQualities).length

      const saveValue = {
        ...mergedQualities,
        [currentQualityLength]: expandedFormData.newQuality

      }

      await game.settings.set('ore', 'qualities', saveValue)
    } else {
      await game.settings.set('ore', 'qualities', mergedQualities)
    }
  }

  async _addQuality (event) {
    event.preventDefault()
    const $form = this.form

    const $newQualityFields = createNewFieldElements([
      { name: 'newQuality.name', type: 'text', value:'Your quality goes here' }
    ])

    $form.append($newQualityFields)
    await this._onSubmit(event)
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

  _mergeQualities (formSets, currentSets) {
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

  async _removeParentElement (event) {
    event.preventDefault()
    const $element = event.currentTarget
    const dataset = $element.dataset
    const $parent = $element.closest(dataset.selector)

    $parent.parentElement.removeChild($parent)
    await this._onSubmit(event)
    this.render(true)
  }
}