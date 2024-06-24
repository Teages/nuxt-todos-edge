export default eventHandler(async (event) => {
  const session = await requireUserSession(event)

  // List todos for the current user
  const todos = await usePrisma().todos.findMany({
    where: { userId: session.user.id }
  })

  return todos
})
