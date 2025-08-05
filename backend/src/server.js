const env = require('./config/env');
const app = require('./app');

const PORT = env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
