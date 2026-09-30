import fs from 'fs/promises';
import { getLatestInterpretationRemark } from '../src/health/components/interpretationRemark.js';

const writeInterpretationRemark = async () => {
  try {
    console.log('Loading interpretationRemark from API, hang on.');
    const interpretationremark = await getLatestInterpretationRemark();
    console.log('InterpretationRemark loaded.');
    console.log('Writing /src/helpers/enums/interpretationRemark.json');

    return fs
      .writeFile(
        `${import.meta.dirname}/../src/helpers/enums/interpretationRemark.json`,
        JSON.stringify(interpretationremark, null, 2),
      )
      .then(() => console.log('Done.'));
  } catch (err) {
    console.log(err);
    return Promise.resolve();
  }
};

writeInterpretationRemark().then(process.exit);
