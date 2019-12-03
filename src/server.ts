import './env';
// tslint:disable-next-line: ordered-imports
import app from './app';

const { PORT } = process.env;
console.log(process.env.SECRET_KEY);

app.listen(PORT, () => {
  console.log('server is listening to port', PORT);
});
