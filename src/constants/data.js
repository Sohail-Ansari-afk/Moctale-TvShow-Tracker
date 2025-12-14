const now = new Date();
const addHours = (h) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_SHOWS = [
  {
    id: 1,
    title: "Squid Game: The Challenge",
    type: "webseries",
    image: "https://image.tmdb.org/t/p/w500/d9brqC9T4e85yW2j3t7T7d7Z8j.jpg",
    releaseDate: addDays(2.5),
    episode: "Season 2 Premiere",
    description: "456 players return for a chance to win $4.56 million. The stakes are higher, the games are deadlier, and the tension is palpable as contestants navigate alliances and betrayal."
  },
  {
    id: 2,
    title: "Dune: Prophecy",
    type: "movie",
    image: "https://getwallpapers.com/wallpaper/full/6/e/3/850558-dune-wallpaper-1920x1080-for-phones.jpg",
    releaseDate: addHours(5),
    episode: "Theatrical Release",
    description: "Origins of the Bene Gesserit 10,000 years before Paul Atreides. Uncover the secret history of the sisterhood that pulls the strings of the imperium."
  },
  {
    id: 3,
    title: "Stranger Things",
    type: "webseries",
    image: "https://www.pixel4k.com/wp-content/uploads/2019/11/stranger-things-season-3-4k-2019_1572996923.jpg",
    releaseDate: addDays(14),
    episode: "Season 5, Vol 1",
    description: "The final chapter begins in Hawkins. As the Upside Down bleeds into the real world, the party must unite one last time to save their town and the world."
  },
  {
    id: 4,
    title: "True Detective",
    type: "drama",
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&q=80&w=800",
    releaseDate: addDays(0.8),
    episode: "Night Country: Ep 4",
    description: "Detectives Danvers and Navarro continue their investigation into the disappearance of the research scientists in Ennis, Alaska."
  },
  {
    id: 5,
    title: "The Mandalorian",
    type: "webseries",
    image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&q=80&w=800",
    releaseDate: addDays(45),
    episode: "Movie Special",
    description: "Din Djarin and Grogu embark on a new adventure across the galaxy, facing new enemies and discovering ancient secrets of Mandalore."
  },
  {
    id: 6,
    title: "House of the Dragon",
    type: "drama",
    image: "https://images.alphacoders.com/133/1330368.jpeg", 
    releaseDate: addHours(0.1),
    episode: "Season 3, Ep 1",
    description: "The Dance of the Dragons intensifies as Rhaenyra and Aegon fight for the Iron Throne. Dragons will dance and the realm will bleed."
  },
  {
    id: 7,
    title: "The Batman II",
    type: "movie",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&q=80&w=800",
    releaseDate: addDays(300),
    episode: "Global Premiere",
    description: "Bruce Wayne faces a new threat in Gotham as he navigates the complex web of corruption and crime. The Riddler was just the beginning."
  },
  {
    id: 8,
    title: "Arcane",
    type: "webseries",
    image: "https://images.alphacoders.com/119/1190473.jpg",
    releaseDate: addDays(8),
    episode: "Season 2 Finale",
    description: "The conflict between Piltover and Zaun reaches its peak. Vi and Jinx find themselves on opposite sides of a war that will change everything."
  }
];
