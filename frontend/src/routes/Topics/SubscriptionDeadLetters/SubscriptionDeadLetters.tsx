import React from 'react';
import { useParams } from 'react-router-dom';
import { Column, useTable } from 'react-table';

import { Card, Table } from 'src/components';
import { SubscriptionDeadLettersQueryResponse } from './types';
import { useSubscriptionDeadLettersQuery } from './useSubscriptionDeadLettersQuery';

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<SubscriptionDeadLettersQueryResponse>({
    columns,
    data: tableData,
  });

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
