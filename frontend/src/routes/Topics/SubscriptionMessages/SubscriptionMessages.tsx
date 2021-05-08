/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';

import { Flex, Icon } from '@chakra-ui/core';

import {
  Card,
  Table,
  MessageModal,
  TableDataLoadingSpinner,
} from 'src/components';
import { SubscriptionMessagesQueryResponse } from './types';
import { useSubscriptionMessagesQuery } from './useSubscriptionMessagesQuery';

const SubscriptionMessages: React.FC = () => {
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { data, isFetched, isFetching } = useSubscriptionMessagesQuery(
    topic,
    subscription,
  );
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  const columns = React.useMemo<Column<SubscriptionMessagesQueryResponse>[]>(
    () => [
      {
        Header: 'Sequence Number',
        accessor: 'sequenceNumber',
      },
      {
        Header: 'Message Id',
        accessor: 'messageId',
      },
      {
        Header: 'Content',
        Cell: ({ row }: CellProps<any>) => {
          const { index } = row;

          return (
            // @ts-ignore
            <Icon
              style={{ cursor: 'hand' }}
              onClick={() => {
                setModalRowIndex(index);
                setOpenMessageModal(true);
              }}
              // onClick={onOpen}
              name="email"
            />
          );
        },
      },
      {
        Header: 'Size',
        accessor: 'size',
      },
    ],
    [],
  );

  const tableData = React.useMemo<SubscriptionMessagesQueryResponse[]>(
    () => (data ? data.messages : []),
    [data],
  );

  const hooks = [useRowSelect];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<SubscriptionMessagesQueryResponse>(
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
        <Flex textAlign="right" justify="space-between">
          <Card.Header.Title>Subscription Active Messages</Card.Header.Title>
        </Flex>
      </Card.Header>
      <Card.Body>
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
            {isFetching ? (
              <TableDataLoadingSpinner columnsCount={columns.length + 1} />
            ) : (
              rows.map(row => {
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
              })
            )}
          </Table.TBody>
        </Table>

        <MessageModal
          openMessageModal={openMessageModal}
          onCloseMessageModal={() => setOpenMessageModal(false)}
          message={modalRowIndex != null ? tableData[modalRowIndex] : null}
          displayProps={['messageId', 'content']}
        />
      </Card.Body>
    </Card>
  );
};

SubscriptionMessages.displayName = 'SubscriptionMessages';
export default SubscriptionMessages;
