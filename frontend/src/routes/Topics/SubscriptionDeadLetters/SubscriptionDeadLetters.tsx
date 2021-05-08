/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
  useToast,
} from '@chakra-ui/core';

import {
  Card,
  Table,
  IndeterminateCheckbox,
  TableDataLoadingSpinner,
  MessageModal,
} from 'src/components';

import {
  ResubmitDlqMessagesResponse,
  SubscriptionDeadLettersEvent,
  SubscriptionDeadLettersQueryResponse,
} from './types';
import { useSubscriptionDeadLettersQuery } from './useSubscriptionDeadLettersQuery';
import { useDeleteSelectedMutation } from './useDeleteSelectedMutation';
import ResubmitStatusModal from 'src/routes/Topics/SubscriptionDeadLetters/ResubmitStatusModal';
import { useResubmitAllMutation } from './useResubmitAllMutation';
import { useAppDispatch } from 'src/providers/AppStateProvider';
import { Subscription } from '../SubscriptionList/types';
import { Path } from 'src/router';
import { AxiosError } from 'axios';
import { useResubmitSelectedMutation } from './useResubmitSelectedMutation';

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
  const history = useHistory();
  const toast = useToast();

  const appDispatch = useAppDispatch();

  const [
    messageSelectionLockedUntilUtc,
    setMessageSelectionLockedUntilUtc,
  ] = useState<number | null>(null);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  const [showTableLoading, setShowTableLoading] = useState<boolean>(false);

  const [resubmitAllState, setResubmitAllState] = useState<{
    showModal: boolean;
    response: ResubmitDlqMessagesResponse | null;
  }>({ showModal: false, response: null });

  const { data, isFetching, refetch } = useSubscriptionDeadLettersQuery(
    topic,
    subscription,
  );

  useEffect(() => {
    if (!messageSelectionLockedUntilUtc) return;

    const interval = window.setInterval(() => {
      if (Date.now() > messageSelectionLockedUntilUtc) {
        setMessageSelectionLockedUntilUtc(null);
      }
    }, 1000);
    return () => {
      console.log('Timer cleared');
      window.clearInterval(interval);
    };
  }, [messageSelectionLockedUntilUtc]);

  useEffect(() => {
    if (isFetching || resubmitAllState.showModal) {
      setShowTableLoading(true);
      return;
    }

    setShowTableLoading(false);
  }, [isFetching, resubmitAllState]);

  const deleteSelectedMutation = useDeleteSelectedMutation(topic, subscription);
  const resumbitSelectedMutation = useResubmitSelectedMutation(
    topic,
    subscription,
  );
  const resubmitAllMutation = useResubmitAllMutation(topic, subscription);

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
                setRowIndex(index);
                setOpenMessageModal(true);
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

  const disableSelectedAction =
    messageSelectionLockedUntilUtc != null &&
    messageSelectionLockedUntilUtc > Date.now();

  const deleteSelectedHandler = () => {
    const messageIds = selectedFlatRows.map(sfr => sfr.original.messageId);
    deleteSelectedMutation.mutate(
      {
        messageIds,
      },
      {
        onSuccess: result => {
          setMessageSelectionLockedUntilUtc(
            Date.parse(result.data.lockedUntilUtc),
          );
          refetch();

          toast({
            title: 'Subscription - DeadLetters.',
            description: 'Selected Messages Deleted successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        },
        onError: (error: AxiosError) => {
          toast({
            title: 'Server Error',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
      },
    );
  };

  const resubmitSelectedHandler = () => {
    const messageIds = selectedFlatRows.map(sfr => sfr.original.messageId);
    resumbitSelectedMutation.mutate(
      {
        messageIds,
      },
      {
        onSuccess: result => {
          setMessageSelectionLockedUntilUtc(
            Date.parse(result.data.lockedUntilUtc),
          );
          refetch();

          toast({
            title: 'Subscription - DeadLetters.',
            description: 'Selected Messages resubmitted successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        },
        onError: (error: AxiosError) => {
          toast({
            title: 'Server Error',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
      },
    );
  };

  const resubmitAllHandler = () => {
    resubmitAllMutation.mutate(null, {
      onSuccess: result => {
        setResubmitAllState({
          showModal: true,
          response: result.data,
        });

        toast({
          title: 'Subscription - DeadLetters.',
          description: 'Request successfully sent to server for processing',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error: AxiosError) => {
        toast({
          title: 'Server Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

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
                isDisabled={disableSelectedAction}
                onClick={deleteSelectedHandler}
              >
                Delete selected
                {disableSelectedAction && (
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
              <MenuItem onClick={resubmitAllHandler}>
                Resubmit all to Topic
              </MenuItem>
              <MenuItem
                isDisabled={disableSelectedAction}
                onClick={resubmitSelectedHandler}
              >
                Resubmit selected to Topic
                {disableSelectedAction && (
                  <span
                    style={{
                      marginLeft: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    <Tooltip
                      zIndex={2}
                      aria-label="Warning"
                      label="Please try resubmitting individual messages after few seconds"
                      placement="right"
                    >
                      <Icon size="5" color="yellow.600" name="warning" />
                    </Tooltip>
                  </span>
                )}
              </MenuItem>
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
            {showTableLoading ? (
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
          closeMessageModal={() => setOpenMessageModal(false)}
          message={rowIndex != null ? tableData[rowIndex] : null}
          displayProps={['messageId', 'content']}
        />

        {resubmitAllState.response && (
          <ResubmitStatusModal
            resubmitDlqMessagesResponse={resubmitAllState.response}
            openResubmitStatusModal={resubmitAllState.showModal}
            closeResubmitStatusModal={(updatedSubscription: Subscription) => {
              setResubmitAllState({
                showModal: false,
                response: null,
              });

              appDispatch({
                type: SubscriptionDeadLettersEvent.RESUBMIT_ALL_PROCESSED,
                payload: {
                  subscription: updatedSubscription,
                },
              });

              history.push(
                `${Path.MESSAGE_BROKER_TOPICS}/${topic}/subscriptions/${subscription}/messages`,
              );
            }}
          />
        )}
      </Card.Body>
    </Card>
  );
};

SubscriptionDeadLetters.displayName = 'SubscriptionDeadLetters';

export default SubscriptionDeadLetters;
