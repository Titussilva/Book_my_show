const movies = [
  {
    // TMDB ID: 361743 - Top Gun: Maverick (2022)
    title: 'Top Gun: Maverick',
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
    genre: ['Action', 'Drama'],
    language: ['English', 'Hindi'],
    duration: 130,
    releaseDate: '2022-05-27',
    poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpD343gKzJ55D21f.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/z4qWPqKPkX61HMRdJJVFRpLN7hT.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
    director: 'Joseph Kosinski',
    rating: 8.3,
    ageRating: 'UA',
    cast: [
      { name: 'Tom Cruise', role: 'Pete Mitchell', image: 'https://image.tmdb.org/t/p/w185/8qBylBsQf4llkGrWR3qAsOtOU8O.jpg' },
      { name: 'Miles Teller', role: 'Rooster', image: 'https://image.tmdb.org/t/p/w185/7IVBtbEGawxAp3HxEmNFzMu7JpP.jpg' }
    ]
  },
  {
    // TMDB ID: 533535 - Deadpool & Wolverine (2024)
    title: 'Deadpool & Wolverine',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 127,
    releaseDate: '2024-07-26',
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    director: 'Shawn Levy',
    rating: 8.5,
    ageRating: 'A',
    cast: [
      { name: 'Ryan Reynolds', role: 'Wade Wilson', image: 'https://image.tmdb.org/t/p/w185/vVpSoBFRTffzYkOqV5z1g3Yk6b3.jpg' },
      { name: 'Hugh Jackman', role: 'Logan', image: 'https://image.tmdb.org/t/p/w185/oX6CpXmnXCHLyqsa4NE01bxaA01.jpg' }
    ]
  },
  {
    // TMDB ID: 872585 - Oppenheimer (2023)
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    genre: ['Biography', 'Drama', 'History'],
    language: ['English'],
    duration: 180,
    releaseDate: '2023-07-21',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    director: 'Christopher Nolan',
    rating: 8.9,
    ageRating: 'UA',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: 'https://image.tmdb.org/t/p/w185/3s3XN4B0YQ8dCgL41Z53RqzC4T2.jpg' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer', image: 'https://image.tmdb.org/t/p/w185/rJdYdEu5v2tE4I0b6P5E1o3A7y3.jpg' }
    ]
  },
  {
    // TMDB ID: 569094 - Spider-Man: Across the Spider-Verse (2023)
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genre: ['Animation', 'Action', 'Adventure'],
    language: ['English', 'Hindi'],
    duration: 140,
    releaseDate: '2023-06-02',
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=shW9i6k8cB0',
    director: 'Joaquim Dos Santos, Kemp Powers',
    rating: 8.7,
    ageRating: 'U',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales', image: 'https://image.tmdb.org/t/p/w185/uJNaUTwFzHEGv2uQk146B44F69.jpg' }
    ]
  },
  {
    // TMDB ID: 505642 - Black Panther: Wakanda Forever (2022)
    title: 'Black Panther: Wakanda Forever',
    description: "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    genre: ['Action', 'Adventure', 'Drama'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 161,
    releaseDate: '2022-11-11',
    poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
    director: 'Ryan Coogler',
    rating: 7.3,
    ageRating: 'UA',
    cast: [
      { name: 'Letitia Wright', role: 'Shuri', image: 'https://image.tmdb.org/t/p/w185/7oFHYvFp1WQMMSApIOmCHB3XR5D.jpg' },
      { name: 'Angela Bassett', role: 'Ramonda', image: 'https://image.tmdb.org/t/p/w185/bkCNOuJMjhPFpUBDvFBW5Q6R5ac.jpg' }
    ]
  },
  {
    // TMDB ID: 155 - The Dark Knight (2008)
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: ['English', 'Hindi'],
    duration: 152,
    releaseDate: '2008-07-18',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    director: 'Christopher Nolan',
    rating: 9.0,
    ageRating: 'UA',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne', image: 'https://image.tmdb.org/t/p/w185/kU3B75TyRiCgE270EyZnHjfivoq.jpg' },
      { name: 'Heath Ledger', role: 'The Joker', image: 'https://image.tmdb.org/t/p/w185/hD3DFiUPpJllSBmFQNRBd3Gkh6V.jpg' }
    ]
  },
  {
    // TMDB ID: 447365 - Guardians of the Galaxy Vol. 3 (2023)
    title: 'Guardians of the Galaxy Vol. 3',
    description: 'Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and protect one of their own. If the mission is not completely successful, it could lead to the end of the Guardians.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    language: ['English', 'Hindi'],
    duration: 150,
    releaseDate: '2023-05-05',
    poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpN8n1s5m69p69yP882P.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nHf61UzkfFno5X1ofIjkVmgSn45.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=u3V5KDHRQvk',
    director: 'James Gunn',
    rating: 8.0,
    ageRating: 'UA',
    cast: [
      { name: 'Chris Pratt', role: 'Peter Quill', image: 'https://image.tmdb.org/t/p/w185/lSlJbI2g5xF9C5TCJFnNnNFm0Hg.jpg' },
      { name: 'Zoe Saldana', role: 'Gamora', image: 'https://image.tmdb.org/t/p/w185/vksW8qK4LdJgU6xQyY4rFm9gPeb.jpg' }
    ]
  },
  {
    // TMDB ID: 299534 - Avengers: Endgame (2019)
    title: 'Avengers: Endgame',
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 181,
    releaseDate: '2019-04-26',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    director: 'Anthony Russo, Joe Russo',
    rating: 8.4,
    ageRating: 'UA',
    cast: [
      { name: 'Robert Downey Jr.', role: 'Tony Stark', image: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg' },
      { name: 'Chris Evans', role: 'Steve Rogers', image: 'https://image.tmdb.org/t/p/w185/3bOGNsHlrswhyW79uvIHH1V43JI.jpg' }
    ]
  },
  {
    // TMDB ID: 569094 - Spider-Man: No Way Home (2021)
    title: 'Spider-Man: No Way Home',
    description: 'Peter Parker is unmasked and can no longer separate his normal life from the high-stakes of being a super-hero. When he asks Doctor Strange for help, the stakes become even more dangerous.',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 148,
    releaseDate: '2021-12-17',
    poster: 'https://image.tmdb.org/t/p/w500/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    director: 'Jon Watts',
    rating: 8.2,
    ageRating: 'UA',
    cast: [
      { name: 'Tom Holland', role: 'Peter Parker', image: 'https://image.tmdb.org/t/p/w185/bkiAZDP8d3KFpCBFCMgMGVW2qH3.jpg' },
      { name: 'Zendaya', role: 'MJ', image: 'https://image.tmdb.org/t/p/w185/3WwGkigw9s0a6FvY41kSItP2QhL.jpg' }
    ]
  },
  {
    // TMDB ID: 774752 - Doctor Strange in the Multiverse of Madness (2022)
    title: 'Doctor Strange in the Multiverse of Madness',
    description: 'Doctor Strange teams up with a mysterious teenager who travels through the multiverse while a strange villain threatens to wipe out millions of people across the multiverse.',
    genre: ['Action', 'Adventure', 'Fantasy'],
    language: ['English', 'Hindi'],
    duration: 126,
    releaseDate: '2022-05-06',
    poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/wcKFYIiVDvRURrzglV9bOoZSwDu.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=aWzlQ2N6qqg',
    director: 'Sam Raimi',
    rating: 7.3,
    ageRating: 'UA',
    cast: [
      { name: 'Benedict Cumberbatch', role: 'Doctor Strange', image: 'https://image.tmdb.org/t/p/w185/Qvar68ueKWBqYNNEUMHhDoLYJOA.jpg' },
      { name: 'Elizabeth Olsen', role: 'Wanda Maximoff', image: 'https://image.tmdb.org/t/p/w185/mbYQLSbqUbHilFcOq7xh7V3rXN2.jpg' }
    ]
  },
  {
    // TMDB ID: 284054 - Black Panther (2018)
    title: 'Black Panther',
    description: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 134,
    releaseDate: '2018-02-16',
    poster: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=xjDjIWPwcPU',
    director: 'Ryan Coogler',
    rating: 7.3,
    ageRating: 'UA',
    cast: [
      { name: 'Chadwick Boseman', role: "T'Challa", image: 'https://image.tmdb.org/t/p/w185/wYETzWe8DAi9dtqv6jPdmMYVwRG.jpg' },
      { name: 'Michael B. Jordan', role: 'Erik Killmonger', image: 'https://image.tmdb.org/t/p/w185/cPdFTsHMuTuniU57MZsI3mKMm7s.jpg' }
    ]
  },
  {
    // TMDB ID: 299536 - Avengers: Infinity War (2018)
    title: 'Avengers: Infinity War',
    description: 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 149,
    releaseDate: '2018-04-27',
    poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=6ZfuNTqbHE8',
    director: 'Anthony Russo, Joe Russo',
    rating: 8.4,
    ageRating: 'UA',
    cast: [
      { name: 'Robert Downey Jr.', role: 'Tony Stark', image: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg' },
      { name: 'Josh Brolin', role: 'Thanos', image: 'https://image.tmdb.org/t/p/w185/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg' }
    ]
  }
];

module.exports = movies;
