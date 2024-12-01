import { syncConcerts } from "../lib/sync/concert-sync"

async function main() {
  try {
    await syncConcerts()
    process.exit(0)
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  }
}

main().catch(console.error)