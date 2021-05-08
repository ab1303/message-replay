import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/core';
import { SettingsEvent, SettingsFormData } from './types';
import { useSettingsMutation } from './useSettingsMutation';
import { useAppDispatch, useAppState } from 'src/providers/AppStateProvider';
import { DefaultSpinner } from 'src/components';

const Settings: React.FC = () => {
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const formMethods = useForm<SettingsFormData>({
    mode: 'onBlur',
    defaultValues: {
      connectionString: appState.settings.connectionString,
    },
  });

  const {
    handleSubmit,
    errors,
    register,
    formState,
    control,
    reset,
  } = formMethods;

  const { mutate, isLoading } = useSettingsMutation();
  const toast = useToast();

  const submitHandler = (formData: SettingsFormData) => {
    console.log('User Recipient Form Data:', JSON.stringify(formData, null, 2));

    appDispatch({
      payload: {},
      type: SettingsEvent.CONNECTION_CHANGE,
    });

    mutate(formData, {
      onSuccess: result => {
        reset({
          connectionString: formData.connectionString,
        });
        appDispatch({
          payload: {
            connectionString: formData.connectionString,
            queues: result.data.queues,
            topics: result.data.topics,
          },
          type: SettingsEvent.CONNECTION_CHANGED,
        });

        toast({
          title: 'Service Bus Settings.',
          description: 'Connection string saved',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      onError: () => {
        appDispatch({
          payload: {},
          type: SettingsEvent.CONNECTION_CHANGE_ERROR,
        });

        toast({
          title: 'Service Bus Settings.',
          description: 'Failed to save connection string',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <Box w={800} p={4} m="20px auto">
      <Heading as="h2" size="lg" textAlign="center" marginBottom="10px">
        Service Bus Settings
      </Heading>

      <DevTool control={control} />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box
            as="div"
            p={4}
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
          >
            {isLoading ? (
              <DefaultSpinner />
            ) : (
              <Stack margin="auto" spacing={5}>
                <FormControl isInvalid={!!errors.connectionString}>
                  <Stack direction="row">
                    <FormLabel htmlFor="connectionString" w={200}>
                      Connection String
                    </FormLabel>
                    <Input
                      name="connectionString"
                      placeholder="connectionString"
                      ref={register({ required: true })}
                    />
                    <FormErrorMessage>
                      {errors.connectionString &&
                        errors.connectionString.message}
                    </FormErrorMessage>
                  </Stack>
                </FormControl>
                {/* <FormControl isInvalid={!!errors.topicName}>
                  <Stack direction="row">
                    <FormLabel htmlFor="topicName" w={200}>
                      Topic Name
                    </FormLabel>
                    <Input
                      name="topicName"
                      placeholder="topicName"
                      ref={register({ required: true })}
                    />
                    <FormErrorMessage>
                      {errors.topicName && errors.topicName.message}
                    </FormErrorMessage>
                  </Stack>
                </FormControl> */}
                <Button
                  mt={4}
                  variantColor="teal"
                  isLoading={formState.isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              </Stack>
            )}
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Settings;
