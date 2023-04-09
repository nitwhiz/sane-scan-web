import axios from 'axios';

export interface Environment {
  saneScanApiUrl: string;
  stagecoachApiUrl: string;
}

const environmentPromise: Promise<Environment> = axios
  .get<Environment>('/env.json')
  .then(({ data }) => data)
  .catch((reason) => {
    console.error('failed to fetch environment', reason);

    return {
      stagecoachApiUrl: '',
      saneScanApiUrl: '',
    };
  });

export const useEnvironment = () => ({ env: environmentPromise });
