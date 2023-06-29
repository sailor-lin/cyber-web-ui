import Modal from './Modal.jsx';


Modal.install = function (app) {
  app.component(Modal.name, Modal);
};

export default Modal;