import RadioButton from "./RadioButton";
import RadioGroup from './RadioGroup';

export { RadioButton, RadioGroup };

export default {
  install: (app) => {
    app.component(RadioGroup.name, RadioGroup);
    app.component(RadioButton.name, RadioButton);
  },
};
