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
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData()

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
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
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
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const roll = new Roll(`${parseInt(dataset.stat)+parseInt(dataset.skill)}d10`)

    let label = dataset.label ? `Rolling ${dataset.label}` : '';
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label
    })
    // if (dataset.roll) {
    //   let roll = new Roll(dataset.roll, this.actor.data.data);
    //   let label = dataset.label ? `Rolling ${dataset.label}` : '';
    //   roll.roll().toMessage({
    //     speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    //     flavor: label
    //   });
    //}

  }

}
