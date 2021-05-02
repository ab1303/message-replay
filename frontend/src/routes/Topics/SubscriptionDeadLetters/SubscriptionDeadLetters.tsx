/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
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
  Tooltip,
  useDisclosure,
} from '@chakra-ui/core';

import {
  Card,
  Table,
  IndeterminateCheckbox,
  TableDataLoadingSpinner,
  MessageModal,
} from 'src/components';

import { SubscriptionDeadLettersQueryResponse } from './types';
import { useSubscriptionDeadLettersQuery } from './useSubscriptionDeadLettersQuery';
import { useDeleteSelectedMutation } from './useDeleteSelectedMutation';

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
  const [
    deleteSelectedLockedUntilUtc,
    setDeleteSelectedLockedUntilUtc,
  ] = useState<number | null>(null);

  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!deleteSelectedLockedUntilUtc) return;

    const interval = window.setInterval(() => {
      if (Date.now() > deleteSelectedLockedUntilUtc) {
        setDeleteSelectedLockedUntilUtc(null);
      }
    }, 1000);
    return () => {
      console.log('Timer cleared');
      window.clearInterval(interval);
    };
  }, [deleteSelectedLockedUntilUtc]);

  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const {
    data,
    isFetched,
    isFetching,
    refetch,
  } = useSubscriptionDeadLettersQuery(topic, subscription);

  const deleteSelectedMutation = useDeleteSelectedMutation(topic, subscription);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const columns = React.useMemo<Column<SubscriptionDeadLettersQueryResponse>[]>(
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
              name="email"
            />
          );
        },
      },
      {
        Header: 'Size',
        accessor: 'size',
      },
      {
        Header: 'Delivery Count',
        accessor: 'deliveryCount',
      },
      {
        Header: 'Dead Letter Reason',
        accessor: 'deadLetterReason',
      },
    ],
    [],
  );

  const tableData = React.useMemo<SubscriptionDeadLettersQueryResponse[]>(
    () => (data ? data.deadLetters : []),
    [data],
  );

  const hooks = [useRowSelect, selectionHook];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    selectedFlatRows,
    prepareRow,
  } = useTable<SubscriptionDeadLettersQueryResponse>(
    {
      columns,
      data: tableData,
    },
    ...hooks,
  );

  const deleteSelectedHandler = () => {
    const messageIds = selectedFlatRows.map(sfr => sfr.original.messageId);
    deleteSelectedMutation.mutate(
      {
        messageIds,
      },
      {
        onSuccess: result => {
          // reset({
          //   connectionString: formData.connectionString,
          // });
          // appDispatch({
          //   payload: {
          //     connectionString: formData.connectionString,
          //     queues: result.data.queues,
          //     topics: result.data.topics,
          //   },
          //   type: SettingsEvent.CONNECTION_CHANGED,
          // });
          console.log('response on success', result);
          setDeleteSelectedLockedUntilUtc(
            Date.parse(result.data.lockedUntilUtc),
          );
          refetch();
          console.log('messages purged successfully, result:', result);
        },
      },
    );
  };

  const disableDeleteSelected =
    deleteSelectedLockedUntilUtc != null &&
    deleteSelectedLockedUntilUtc > Date.now();

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
              <MenuItem
                isDisabled={disableDeleteSelected}
                onClick={deleteSelectedHandler}
              >
                Delete selected
                {disableDeleteSelected && (
                  <span
                    style={{
                      marginLeft: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    <Tooltip
                      zIndex={2}
                      aria-label="Warning"
                      label="Please try deleting individual messages after few seconds"
                      placement="right"
                    >
                      <Icon size="5" color="yellow.600" name="warning" />
                    </Tooltip>
                  </span>
                )}
              </MenuItem>
              <MenuItem>Resubmit all to Topic</MenuItem>
              <MenuItem>Resubmit selected to Topic</MenuItem>
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
            {isFetching ? (
              <TableDataLoadingSpinner />
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
          isOpen={isOpen}
          onClose={onClose}
          message={modalRowIndex != null ? tableData[modalRowIndex] : null}
          displayProps={['messageId', 'content']}
        />
      </Card.Body>
    </Card>
  );
};

SubscriptionDeadLetters.displayName = 'SubscriptionDeadLetters';

export default SubscriptionDeadLetters;
