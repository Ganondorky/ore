// Import Modules
import { OneRollEngineActor } from "./actor/actor.js";
import { OneRollEngineActorSheet } from "./actor/actor-sheet.js";
import { OneRollEngineItem } from "./item/item.js";
import { OneRollEngineItemSheet } from "./item/item-sheet.js";
import { registerSettings } from "./settings/settings.js";
import { preloadHandlebarsTemplates } from "./preloadTemplates.js";
import oreHooks from "./oreHooks.js"

Hooks.once('init', async function () {

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
  Handlebars.registerHelper('concat', function () {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('ifString', function (val, str, alt) {
    return val ? str : alt
  })

  Handlebars.registerHelper('getLength', function (val) {
    return val?.length ?? Object.keys(val ?? {})?.length ?? 0
  })

  Handlebars.registerHelper('times', function (n, block) {
    let accum = ''
    for (let i = 0; i < n; i++)
      accum += block.fn(i)
    return accum;
  })

  Handlebars.registerHelper({
    '??': (a, b) => a ?? b,
    and: (a, b) => a && b,
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    minus: (a, b) => (+a) - (+b),
    ne: (a, b) => a !== b,
    not: a => !a,
    or: (a, b) => a || b,
    plus: (a, b) => +a + b,
    ternary: (conditional, a, b) => conditional ? a : b
  })

  preloadHandlebarsTemplates()

  oreHooks()
});