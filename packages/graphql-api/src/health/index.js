import { getEnumStatus } from './components/enum.js';
import { getInterpretationRemarkStatus } from './components/interpretationRemark.js';

export default (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=5'); // 5 seconds
    res.json({
      enums: getEnumStatus(),
      interpetationRemark: getInterpretationRemarkStatus(),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
