import './env';
// tslint:disable-next-line: ordered-imports
import app from './app';

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log('server is listening to port', PORT);
});
