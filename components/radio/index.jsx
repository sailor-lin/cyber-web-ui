import RadioButton from "./RadioButton";
import RadioGroup from './RadioGroup';
import RadioWrapper from "./RadioWrapper";

export { RadioButton, RadioGroup, RadioWrapper };

export default {
  install: (app) => {
    app.component(RadioGroup.name, RadioGroup);
    app.component(RadioButton.name, RadioButton);
    app.component(RadioWrapper.name, RadioWrapper);
  },
};
