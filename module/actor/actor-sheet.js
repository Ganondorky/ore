import {objectReduce, objectSort} from '../../lib/helpers.js'
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
  export class OneRollEngineActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ore", "sheet", "actor"],
      template: "systems/ore/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData()
    console.log(data)
    return data
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    html.find('.stat-input').on('input', (event) => {
     
      const value = parseInt(event.target.value)
      const $stat = $(event.target)
      const isSkill = $stat.hasClass('skill-input')
      const statSettings = game.settings.get('ore', 'stats')
      const minValue = isSkill
        ? statSettings[$stat.data('stat')].skills[$stat.data('skill')].min
        : statSettings[$stat.data('stat')].min
      const maxValue = isSkill
        ? statSettings[$stat.data('stat')].skills[$stat.data('skill')].max
        : statSettings[$stat.data('stat')].max
      const newValue = !Number.isInteger(value)
        ? minValue
        : value < minValue
          ? minValue
          : value > maxValue
            ? maxValue
            : value

      $stat.val(newValue)
    })

    html.find('.add-quality').click(this._addQuality.bind(this))

    html.find('.remove-quality').click(this._removeQuality.bind(this))
    html.find('.hit-box').click(this._changeHitBox.bind(this))
    html.find('.hit-box').on('mouseup', this._resetHitBox.bind(this))
  }

  /* -------------------------------------------- */
  
  async _addQuality(event) {
    event.preventDefault()
    const $qualityButton = $(event.currentTarget)
    const quality = $qualityButton.data('quality')
    const currentQualityItems = this.actor.data.data.qualities[quality].items ?? {}

    await this.actor.update({
      [`data.qualities.${quality}.items`]: {
        ...currentQualityItems,
        [Object.keys(currentQualityItems).length]: {
          name: 'Brought to you by Carls Jr',
          description:''        
        }
      }
    })
  }

  async _changeHitBox(event) {
    event.preventDefault()
    const $hitbox = $(event.currentTarget)
    const newWound = {
      blocked: $hitbox.hasClass('kill'),
      kill: $hitbox.hasClass('shock'),
      shock: !$hitbox.hasClass('kill') && !$hitbox.hasClass('shock') && !$hitbox.hasClass('blocked')
    }
    await this.actor.update({
      [`data.hitLocations.${$hitbox.data('hitLocation')}.wounds.-=${$hitbox.data('wound')}`]: null
    })
    await this.actor.update({
      [`data.hitLocations.${$hitbox.data('hitLocation')}.wounds.${$hitbox.data('wound')}`]: newWound
    })

  }

  async _resetHitBox(event) {
    event.preventDefault()

    if (event.button === 2) {
      const $hitbox = $(event.currentTarget)
      const newWound = {
        blocked: false,
        kill: false,
        shock: false
      }
      await this.actor.update({
        [`data.hitLocations.${$hitbox.data('hitLocation')}.wounds.-=${$hitbox.data('wound')}`]: null
      })
      await this.actor.update({
        [`data.hitLocations.${$hitbox.data('hitLocation')}.wounds.${$hitbox.data('wound')}`]: newWound
      })
    }
  }

  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const r = new Roll(`${parseInt(dataset.stat)+parseInt(dataset.skill)}d10`)
    const roll = await r.evaluate({async: true})

    const rawResults = roll.dice[0].results
      .reduce((results, result) => {
        return {
          ...results,
          [result.result]: (results[result.result] ?? 0) + 1
        }
      }, {})

    const results = objectReduce(rawResults, (newResults, amount, value) => {
      if (amount > 1) {
        return {
          ...newResults,
          sets: [
            ...(newResults.sets ?? []),
            { value, amount }
          ]
        }
      }

      return {
        ...newResults,
        waste: [
          ...(newResults.waste ?? []),
          value
        ]
      }
    }, {})

    results.sets?.sort((a, b) => b.value - a.value)
    results.waste?.sort((a, b) => b - a)

    const message = await renderTemplate('systems/ore/templates/chat/roll-result.html', {
      rollResults: results,
      speaker:game.user
    })

    await ChatMessage.create(
      {content: message}
    )
      
    //let label = dataset.label ? `Rolling ${dataset.label}` : '';
    // roll.roll().toMessage({
    //   speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    //   flavor: label
    // })
    // if (dataset.roll) {
    //   let roll = new Roll(dataset.roll, this.actor.data.data);
    //   let label = dataset.label ? `Rolling ${dataset.label}` : '';
    //   roll.roll().toMessage({
    //     speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    //     flavor: label
    //   });
    //}

  }

  async _removeQuality(event){
    event.preventDefault()
    const $qualityButton = $(event.currentTarget)
    const quality = $qualityButton.data('quality')
    const qualityItem = $qualityButton.data('qualityItem')
    const currentQualityItems = this.actor.data.data.qualities[quality].items ?? {}

    const newData = Object.keys(currentQualityItems)
      .reduce((acc, currentKey) => {
        console.log(+currentKey, qualityItem, +currentKey !== qualityItem)
        if (+currentKey !== qualityItem) {
          return { ...acc, [Object.keys(acc).length]: currentQualityItems[currentKey] }
        }

        return acc
      }, {})
    await this.actor.update({
      [`data.qualities.${quality}.-=items`]: null
    })
    await this.actor.update({
      [`data.qualities.${quality}.items`]: newData
    })
  }
}
