import Cell from './Cell';
import CellDict from './CellDict';

Cell.install = (app) => {
  app.component(Cell.name, Cell);
  app.component(CellDict.name, CellDict);
};

export default Cell;
