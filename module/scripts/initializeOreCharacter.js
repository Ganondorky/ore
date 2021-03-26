export default async (data) => {
  const actor = new Actor(data)
  const workingData = duplicate(data.data)
  const characterData = workingData.data

  const statSettings = game.settings.get('ore', 'stats')

  characterData.stats = Object.keys(statSettings)
    .reduce((stats, statIndex) => {
      return {
        ...stats,
        [statIndex]: {
          ...statSettings[statIndex],
          value: statSettings[statIndex].min,
          skills: Object.keys(statSettings[statIndex].skills || {})
            .reduce((skills, skillIndex) => {
              return {
                ...skills,
                [skillIndex]: {
                  ...statSettings[statIndex].skills[skillIndex],
                  value: statSettings[statIndex].skills[skillIndex].min
                }
              }
            }, {})
        }
      }
    }, {})

  const qualitySettings = game.settings.get('ore', 'qualities')

  characterData.qualities = Object.keys(qualitySettings)
    .reduce((qualities, qualityIndex) => {
      return {
        ...qualities,
        [qualityIndex]: {
          ...qualitySettings[qualityIndex],
          items: {}
        }
      }
    }, {})

  workingData.data = characterData

  await actor.update(workingData)
  await actor.sheet.render(false)
}
