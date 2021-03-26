import createNewFieldElements from '../scripts/createNewFieldElements.js'

export default class StatSettings extends FormApplication {
  constructor(object = {}, options = { parent: null }) {
    super(object, options);
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'statSettings',
      template: 'systems/ore/templates/stat-settings.html',
      title: game.i18n.localize('ORE.StatSettingsT'),
      classes: ['ore', 'stat-settings'],
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

    html.find('.add-stat').click(this._addStat.bind(this))
    html.find('.add-skill').click(this._addSkill.bind(this))
    html.find('.collapse-toggle').click(this._collapseToggle.bind(this))
    html.find('input.display-toggle').change(event => this._displayToggle(event, html))
    html.find('button.display-toggle').click(event => this._displayToggle(event, html))
    html.find('.remove-parent-element').click(this._removeParentElement.bind(this))
    html.find('#submit').click(() => this.close())
  }

  getData () {
    const stats = game.settings.get('ore', 'stats')

    return {
      stats
    }
  }

  async _updateObject (_, formData) {
    const expandedFormData = expandObject(formData)
    const stats = game.settings.get('ore', 'stats')

    const mergedStats = expandedFormData.stats ?? {}

    if (expandedFormData.newStat) {
      const currentStatLength = Object.keys(mergedStats).length

      const saveValue = {
        ...mergedStats,
        [currentStatLength]: {
          ...expandedFormData.newStat,
          skills: {}
        }
      }

      await game.settings.set('ore', 'stats', saveValue)
    } else if (expandedFormData.newSkill) {
      const currentSkills = mergedStats[expandedFormData.newSkill.stat].skills
      const currentSkillsLength = Object.keys(currentSkills || {}).length
      mergedStats[expandedFormData.newSkill.stat].skills = {
        ...currentSkills,
        [currentSkillsLength]: expandedFormData.newSkill
      }
      await game.settings.set('ore', 'stats', mergedStats)
    } else {
      await game.settings.set('ore', 'stats', mergedStats)
    }

  }

  async _addSkill (event) {
    event.preventDefault()
    const dataset = event.currentTarget.dataset
    const $form = this.form
    const stat = game.settings.get('ore', 'stats')[dataset.stat]

    const $newSkillFields = createNewFieldElements([
      { name: 'newSkill.name', type: 'text', value: `New ${stat.name} Skill` },
      { name: 'newSkill.min', type: 'number', value: 1 },
      { name: 'newSkill.max', type: 'number', value: 10 },
      { name: 'newSkill.stat', type: 'text', value: dataset.stat }
    ])

    $form.append($newSkillFields)
    await this._onSubmit(event)
    this.render(true)
  }

  async _addStat (event) {
    event.preventDefault()
    const $form = this.form

    const $newStatFields = createNewFieldElements([
      { name: 'newStat.name', type: 'text', value:'Your stat goes here' },
      { name: 'newStat.min', type: 'number', value: 1 },
      { name: 'newStat.max', type: 'number', value: 5 }
    ])

    $form.append($newStatFields)
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

  _mergeStats (formSets, currentSets) {
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