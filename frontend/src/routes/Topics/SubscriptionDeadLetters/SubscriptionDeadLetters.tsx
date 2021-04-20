/* eslint-disable react/display-name */
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  CellProps,
  Column,
  HeaderProps,
  Hooks,
  useRowSelect,
  useTable,
} from 'react-table';

import { Card, Table } from 'src/components';
import {
  HeaderCheckbox,
  RowCheckbox,
} from 'src/components/Table/components/TableStyles';
import { SubscriptionDeadLettersQueryResponse } from './types';
import { useSubscriptionDeadLettersQuery } from './useSubscriptionDeadLettersQuery';

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement>(
  // @ts-ignore
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      // @ts-ignore
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        {/* @ts-ignore */}
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  },
);

const selectionHook = (hooks: Hooks<any>) => {
  hooks.visibleColumns.push(columns => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        // @ts-ignore
        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => (
        // @ts-ignore
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      ),
    },
    ...columns,
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0];
    selectionGroupHeader.canResize = false;
  });
};

const SubscriptionDeadLetters: React.FC = () => {
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { data, isFetched } = useSubscriptionDeadLettersQuery(
    topic,
    subscription,
  );

  const columns = React.useMemo<Column<SubscriptionDeadLettersQueryResponse>[]>(
    () => [
      {
        Header: 'Message Id',
        accessor: 'messageId',
      },
      {
        Header: 'Subject',
        accessor: 'subject',
      },
      {
        Header: 'Expires At',
        accessor: 'expiresAt',
      },
    ],
    [],
  );

  const tableData = React.useMemo<SubscriptionDeadLettersQueryResponse[]>(
    () => (data ? data.deadLetters : []),
    [isFetched],
  );

  const hooks = [useRowSelect, selectionHook];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<SubscriptionDeadLettersQueryResponse>(
    {
      columns,
      data: tableData,
    },
    ...hooks,
  );

  return (
    /* eslint-disable react/jsx-key */
    <Card>
      <Card.Header>
        <Card.Header.Title>Subscription Dead Letters</Card.Header.Title>
      </Card.Header>

      <Table {...getTableProps()}>
        <Table.THead>
          {headerGroups.map(headerGroup => (
            <Table.THead.TR {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Table.THead.TH {...column.getHeaderProps()}>
                  {column.render('Header')}
                </Table.THead.TH>
              ))}
            </Table.THead.TR>
          ))}
        </Table.THead>
        <Table.TBody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Table.TBody.TR {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <Table.TBody.TD {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </Table.TBody.TD>
                  );
                })}
              </Table.TBody.TR>
            );
          })}
        </Table.TBody>
      </Table>
    </Card>
  );
};

SubscriptionDeadLetters.displayName = 'SubscriptionDeadLetters';

export default SubscriptionDeadLetters;
