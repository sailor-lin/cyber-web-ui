import InputPassword from "./InputPassword";

export { InputPassword };

export default {
  install: (app) => {
    app.component(InputPassword.name, InputPassword);
  },
};
