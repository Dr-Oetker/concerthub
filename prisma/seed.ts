import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')
  
  try {
    // Clear existing data
    await prisma.concert.deleteMany()
    console.log('Cleared existing concerts')

    // Create example concerts
    const concerts = [
      {
        title: "Taylor Swift | The Eras Tour",
        artist: "Taylor Swift",
        date: new Date('2024-12-15T19:00:00'),
        venue: "Madison Square Garden",
        city: "New York",
        description: "Experience Taylor Swift's record-breaking Eras Tour live! A three-hour musical journey through all of Taylor's eras.",
        price: 199.99,
        imageUrl: "/images/concert1.jpg"
      },
      {
        title: "Ed Sheeran - Mathematics Tour",
        artist: "Ed Sheeran",
        date: new Date('2024-12-10T20:00:00'),
        venue: "Wembley Stadium",
        city: "London",
        description: "Ed Sheeran's biggest tour yet, featuring all his greatest hits in an intimate yet spectacular show.",
        price: 89.99,
        imageUrl: "/images/concert2.jpg"
      },
      {
        title: "Coldplay - Music of the Spheres",
        artist: "Coldplay",
        date: new Date('2024-12-20T19:30:00'),
        venue: "Rose Bowl",
        city: "Los Angeles",
        description: "An unforgettable night of music and visual spectacle featuring Coldplay's innovative eco-friendly stage setup.",
        price: 149.99,
        imageUrl: "/images/concert3.jpg"
      },
      {
        title: "Beyoncé Renaissance World Tour",
        artist: "Beyoncé",
        date: new Date('2025-01-05T20:00:00'),
        venue: "AT&T Stadium",
        city: "Dallas",
        description: "Queen Bey's triumphant return to the stage with her Renaissance World Tour! Experience the music, the dancing, and the spectacle.",
        price: 249.99,
        imageUrl: "/images/concert4.jpg"
      },
      {
        title: "The Weeknd - After Hours Tour",
        artist: "The Weeknd",
        date: new Date('2025-01-15T19:00:00'),
        venue: "United Center",
        city: "Chicago",
        description: "A cinematic experience featuring hits from After Hours and more, with state-of-the-art production and visuals.",
        price: 129.99,
        imageUrl: "/images/concert5.jpg"
      },
      {
        title: "Billie Eilish World Tour",
        artist: "Billie Eilish",
        date: new Date('2025-02-01T19:30:00'),
        venue: "O2 Arena",
        city: "London",
        description: "The Grammy-winning superstar's biggest show yet, featuring songs from her latest album and fan favorites.",
        price: 89.99,
        imageUrl: "/images/concert6.jpg"
      },
      {
        title: "Red Hot Chili Peppers Live",
        artist: "Red Hot Chili Peppers",
        date: new Date('2025-02-15T20:00:00'),
        venue: "Allegiant Stadium",
        city: "Las Vegas",
        description: "Rock legends return with their greatest hits! An explosive night of funk rock and unmatchable energy.",
        price: 119.99,
        imageUrl: "/images/concert7.jpg"
      },
      {
        title: "Bad Bunny in Concert",
        artist: "Bad Bunny",
        date: new Date('2025-03-01T20:00:00'),
        venue: "Hard Rock Stadium",
        city: "Miami",
        description: "The biggest Latin music event of the year! Experience Bad Bunny's electrifying performance live.",
        price: 159.99,
        imageUrl: "/images/concert8.jpg"
      },
      {
        title: "Adele Weekend with Adele",
        artist: "Adele",
        date: new Date('2025-03-15T19:00:00'),
        venue: "Caesars Palace",
        city: "Las Vegas",
        description: "An intimate evening with the legendary vocalist, featuring her timeless hits and new material.",
        price: 299.99,
        imageUrl: "/images/concert9.jpg"
      },
      {
        title: "BTS World Tour",
        artist: "BTS",
        date: new Date('2025-04-01T19:30:00'),
        venue: "SoFi Stadium",
        city: "Los Angeles",
        description: "The global phenomenon returns to stage! Experience the magic of BTS live with their biggest production yet.",
        price: 199.99,
        imageUrl: "/images/concert10.jpg"
      }
    ]

    for (const concert of concerts) {
      await prisma.concert.create({
        data: concert
      })
    }
    
    console.log('Seeded 10 concerts successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Cleaning up...')
    await prisma.$disconnect()
  })