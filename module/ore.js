// Import Modules
import { OneRollEngineActor } from "./actor/actor.js";
import { OneRollEngineActorSheet } from "./actor/actor-sheet.js";
import { OneRollEngineItem } from "./item/item.js";
import { OneRollEngineItemSheet } from "./item/item-sheet.js";
import { registerSettings } from "./settings/settings.js";
import { preloadHandlebarsTemplates } from "./preloadTemplates.js";
import oreHooks from "./oreHooks.js"

Hooks.once('init', async function() {

  game.ore = {
    OneRollEngineActor,
    OneRollEngineItem
  };


  // Define custom Entity classes
  CONFIG.Actor.entityClass = OneRollEngineActor;
  CONFIG.Item.entityClass = OneRollEngineItem;

  registerSettings()

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ore", OneRollEngineActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("ore", OneRollEngineItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('ifString', function (val, str, alt) {
    return val ? str : alt
  })
  
  preloadHandlebarsTemplates()

  oreHooks()
});