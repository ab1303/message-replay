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
  Spinner,
} from '@chakra-ui/core';
import { SettingsEvent, SettingsFormData } from './types';
import { useSettingsMutation } from './useSettingsMutation';
import { useAppDispatch, useAppState } from 'src/providers/AppStateProvider';

const Settings: React.FC = () => {
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const formMethods = useForm<SettingsFormData>({
    mode: 'onBlur',
    defaultValues: {
      connectionString: '',
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
  const settingsMutation = useSettingsMutation();
  const submitHandler = (formData: SettingsFormData) => {
    console.log('User Recipient Form Data:', JSON.stringify(formData, null, 2));

    appDispatch({
      payload: {},
      type: SettingsEvent.CONNECTION_CHANGE,
    });

    settingsMutation.mutate(formData, {
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
            {appState.isLoading ? (
              <Spinner thickness="4px" size="md" color="teal.500" />
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
