export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'actor/partials/advantages',
    'actor/partials/descriptions',
    'actor/partials/esoterics',
    'actor/partials/hit-locations',
    'actor/partials/items',
    'actor/partials/martials',
    'actor/partials/stats',
    'reorder'
  ]

  return loadTemplates(
    templatePaths
      .map(template => `systems/ore/templates/${template}.html`)
  )
}
