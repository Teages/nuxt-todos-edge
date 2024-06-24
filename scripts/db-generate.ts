import fs from 'node:fs/promises'
import { exec } from 'node:child_process'
import { webcrypto } from 'node:crypto'
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient({ datasourceUrl: `file:./tmp.db` })
  await prisma.$connect()

  // load all migrations to the database
  const existingMigrations = await scanMigrations()
  for (const migration of existingMigrations) {
    const { content } = migration
    const statements = content.split(/--\*/).filter(Boolean)

    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt.trim())
    }
  }
  await prisma.$disconnect()

  // generate the next filename
  const nextId = existingMigrations.length
  const randomStr = nextId === 0
    ? 'init'
    : webcrypto.randomUUID().split('-')[0]
  const nextFilename = `${String(nextId).padStart(4, '0')}_${randomStr}.sql`

  // run prisma generate
  const output = (await run([
    'npx prisma migrate diff',
    '--from-url file:./prisma/tmp.db',
    '--to-schema-datamodel ./prisma/schema.prisma',
    '--script'
  ].join(' '))).trim()

  // check if generated
  if (isMigrationEmpty(output)) {
    console.log(output)
    console.log(`No changes detected.`)
  }
  else {
    console.log('Generated migration:')
    output.split('\n').filter(o => o.startsWith('--')).forEach(o => console.log(o))
    await fs.writeFile(`./prisma/migrations/${nextFilename}`, `${output}\n`, 'utf-8')
    console.log(`Migration saved to: ${nextFilename}`)
  }

  // clean up
  await fs.unlink('./prisma/tmp.db')
}

main()

async function scanMigrations() {
  const migrations = await fs.readdir('./prisma/migrations')
  return Promise.all(migrations.map(async filename => ({
    filename,
    content: await fs.readFile(`./prisma/migrations/${filename}`, 'utf-8')
  })))
}

function run(cmd: string) {
  return new Promise<string>((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

function isMigrationEmpty(migration: string) {
  const commands = migration
    .split('\n')
    .filter(line => line.trim().length > 0 && !line.startsWith('--'))

  return commands.length === 0
}
