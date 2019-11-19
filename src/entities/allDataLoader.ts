import { createUserLoader } from './User';

const allDataLoader = () => {
  return {
    users: createUserLoader()
  };
};
export type Loaders = ReturnType<typeof allDataLoader>;

export default allDataLoader;
