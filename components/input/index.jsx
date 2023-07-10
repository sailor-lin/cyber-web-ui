import InputNumber from "./InputNumber";

export { InputNumber };

export default {
  install: (app) => {
    app.component(InputNumber.name, InputNumber);
  },
};
