import initializeOreCharacter from './scripts/initializeOreCharacter.js'

export default () => {
  Hooks.on("createActor", async (data) => {
    if (game.user == game.users.find(user => user.isGM && user.active)) {
      if (data.data.type === 'character') {
        await initializeOreCharacter(data)
      }
    }
  })
}
