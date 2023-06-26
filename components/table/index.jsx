import Table from './Table';
import TableWrapper from './TableWrapper';

Table.install = (app) => {
  app.component(Table.name, Table);
  app.component(TableWrapper.name, TableWrapper);
};

export { TableWrapper };

export default Table;
