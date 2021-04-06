import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Heading,
  FormHelperText,
  Stack,
} from '@chakra-ui/core';

type SettingsFormData = {
  connectionString: string;
  topicName: string;
};

const Settings: React.FC = () => {
  const formMethods = useForm<SettingsFormData>({
    mode: 'onBlur',
    defaultValues: {
      connectionString: '',
      topicName: '',
    },
  });

  const submitHandler = (formData: SettingsFormData) => {
    console.log('User Recipient Form Data:', JSON.stringify(formData, null, 2));
  };

  const { handleSubmit, errors, register, formState } = formMethods;

  function onSubmit(values: any) {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
    }, 1000);
  }

  return (
    <Box w={800} p={4} m="20px auto">
      <Heading as="h2" size="lg" textAlign="center" marginBottom="10px">
        Service Bus Settings
      </Heading>

      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit}>
          <Box
            as="div"
            p={4}
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            onSubmit={handleSubmit(submitHandler)}
          >
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
                    {errors.connectionString && errors.connectionString.message}
                  </FormErrorMessage>
                </Stack>
              </FormControl>
              <FormControl isInvalid={!!errors.topicName}>
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
              </FormControl>
              <Button
                mt={4}
                variantColor="teal"
                isLoading={formState.isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </Stack>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Settings;
