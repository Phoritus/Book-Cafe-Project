const whiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://book-cafe-project-8iba.vercel.app/',
  'https://book-cafe-project-zj9f.vercel.app/'
  // add your deployed frontend origins here, e.g. 'https://your-frontend.example.com'
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Let cors package handle requested headers automatically by reflecting
  credentials: true,
  optionsSuccessStatus: 204
}
