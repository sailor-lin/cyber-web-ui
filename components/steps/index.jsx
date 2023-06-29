import Step from './Step.jsx';
import Steps from './Steps.jsx';

Steps.install = function (app) {
  app.component(Steps.name, Steps);
  app.component(Step.name, Step);
};

export { Step };

export default Steps;
