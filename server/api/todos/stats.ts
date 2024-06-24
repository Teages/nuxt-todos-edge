export default eventHandler(async () => {
  // Count the total number of todos
  return usePrisma().$queryRaw<{
    todos: number
    users: number
  }>`
    SELECT COUNT(*) AS todos, COUNT(DISTINCT(user_id)) AS users
    from todos
  `
})
