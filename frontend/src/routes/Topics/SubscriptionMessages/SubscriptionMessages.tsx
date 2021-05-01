/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CellProps,
  Column,
  HeaderProps,
  Hooks,
  useRowSelect,
  useTable,
} from 'react-table';

import { MdMoreVert } from 'react-icons/md';

import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/core';

import {
  Card,
  Table,
  IndeterminateCheckbox,
  MessageModal,
} from 'src/components';
import { SubscriptionMessagesQueryResponse } from './types';
import { useSubscriptionMessagesQuery } from './useSubscriptionMessagesQuery';

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

const SubscriptionMessages: React.FC = () => {
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { data, isFetched } = useSubscriptionMessagesQuery(topic, subscription);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
                onOpen();
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
    [isFetched],
  );

  const hooks = [useRowSelect, selectionHook];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    selectedFlatRows,
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
          <Card.Header.Title>Subscription Dead Letters</Card.Header.Title>
          <Menu>
            <MenuButton as={Button}>
              <MdMoreVert />
            </MenuButton>
            <MenuList>
              <MenuItem>Delete all</MenuItem>
              <MenuItem>Delete selected</MenuItem>
              <MenuItem>Send all to DeadLetter</MenuItem>
              <MenuItem>Send selected to DeadLetter</MenuItem>
            </MenuList>
          </Menu>
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

        <MessageModal
          isOpen={isOpen}
          onClose={onClose}
          message={modalRowIndex != null ? tableData[modalRowIndex] : null}
          displayProps={['messageId', 'content']}
        />
      </Card.Body>
    </Card>
  );
};

SubscriptionMessages.displayName = 'SubscriptionMessages';
export default SubscriptionMessages;
